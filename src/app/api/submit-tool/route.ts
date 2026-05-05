import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHANNEL = process.env.TELEGRAM_CHANNEL_ID

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

function parseJSON(content: string) {
  const match = content.match(/```(?:json)?\n?([\s\S]+?)\n?```/)
  try { return JSON.parse(match ? match[1] : content) } catch {
    const obj = content.match(/\{[\s\S]+\}/)
    try { return obj ? JSON.parse(obj[0]) : null } catch { return null }
  }
}

async function enrichWithAI(tool: { tool_name: string; website_url: string; description: string; category: string }) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return null

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: [{
          role: 'user',
          content: `Enrich this AI tool. Return ONLY JSON:
{"slug":"kebab-slug","use_cases":["scenario 1","scenario 2","scenario 3","scenario 4"],"search_description":"long search-only paragraph up to 1000 chars"}

use_cases: each max 60 chars, what a user would actually do with the tool.
search_description: 700-1000 chars dense with synonyms, technologies, roles, alternatives, natural-language phrases users would type. NEVER shown on site — only feeds search index.

Tool: ${tool.tool_name} | ${tool.website_url} | ${tool.description} | ${tool.category}`
        }],
        response_format: { type: 'json_object' },
      }),
    })

    if (!res.ok) return null
    const data = await res.json()
    return parseJSON(data.choices?.[0]?.message?.content ?? '')
  } catch {
    return null
  }
}

async function notifyTelegram(pending: { id: string; tool_data: Record<string, unknown> }) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHANNEL) return

  const tool = pending.tool_data
  const useCases = Array.isArray(tool.use_cases) && tool.use_cases.length
    ? `\n\n🎯 <b>Use cases:</b>\n${(tool.use_cases as string[]).map((u) => `• ${u}`).join('\n')}`
    : ''
  const caption = `⚡️ <b>User Submitted: ${tool.name}</b>\n` +
    `📂 ${tool.category}\n\n` +
    `${tool.description ?? ''}` +
    `${useCases}\n\n` +
    `🔗 ${tool.website_url}`

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHANNEL,
        text: caption,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[
            { text: '✅ Publish', callback_data: `approve:${pending.id}` },
            { text: '❌ Reject', callback_data: `reject:${pending.id}` },
          ]]
        }
      }),
    })
    const data = await res.json()
    if (data.result?.message_id) {
      await getServiceClient()
        .from('pending_tools')
        .update({ telegram_msg_id: data.result.message_id })
        .eq('id', pending.id)
    }
  } catch (err) {
    console.error('[submit-tool] Telegram notify failed:', err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Honeypot
    if (body.hp) return NextResponse.json({ ok: true })

    // Validation
    const { tool_name, website_url, description, category } = body
    if (!tool_name?.trim()) return NextResponse.json({ error: 'name required' }, { status: 400 })
    if (!description || description.length < 20) return NextResponse.json({ error: 'description too short' }, { status: 400 })
    if (!category) return NextResponse.json({ error: 'category required' }, { status: 400 })
    try { new URL(website_url) } catch {
      return NextResponse.json({ error: 'invalid url' }, { status: 400 })
    }

    const supabase = getServiceClient()

    // Duplicate check
    const { data: existing } = await supabase
      .from('pending_tools')
      .select('id')
      .eq('tool_data->>website_url', website_url)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'already submitted' }, { status: 409 })
    }

    // Enrich with AI (best-effort)
    const enriched = await enrichWithAI({ tool_name, website_url, description, category })

    const toolData = {
      name: tool_name,
      slug: enriched?.slug ?? tool_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      description,
      website_url,
      use_cases: Array.isArray(enriched?.use_cases) ? enriched.use_cases : [],
      search_description: typeof enriched?.search_description === 'string'
        ? enriched.search_description.slice(0, 1100)
        : null,
    }

    // Save to pending_tools
    const { data: pending, error } = await supabase
      .from('pending_tools')
      .insert({
        tool_data: toolData,
        status: 'pending_review',
        source: 'user_submission',
        submitted_by: body.your_email ?? null,
      })
      .select()
      .single()

    if (error) {
      console.error('[submit-tool] Supabase error:', error.message)
      return NextResponse.json({ error: 'server error' }, { status: 500 })
    }

    // Notify Telegram (fire-and-forget)
    notifyTelegram(pending).catch(console.error)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[submit-tool]', err)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
