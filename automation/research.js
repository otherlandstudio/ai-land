// Pipeline 1: Weekly Research
// Usage: node research.js

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { enrichTool, stripCitations } from './utils/enrich.js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHANNEL = process.env.TELEGRAM_CHANNEL_ID
const SCREENSHOT_URL = process.env.SCREENSHOT_SERVICE_URL ?? 'http://localhost:3001'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function parseJSON(content) {
  const match = content.match(/```(?:json)?\n?([\s\S]+?)\n?```/)
  try { return JSON.parse(match ? match[1] : content) } catch {
    const arr = content.match(/\[[\s\S]+\]/)
    try { return arr ? JSON.parse(arr[0]) : null } catch { return null }
  }
}

async function discoverTools() {
  const prompt = `List 15 interesting AI tools that have launched or gained attention recently in 2025-2026. Include a mix of new startups and lesser-known tools — not the biggest names like ChatGPT, Claude, or Midjourney.

Return ONLY a valid JSON array with no markdown, no explanation, nothing else:
[{"name":"Tool Name","website_url":"https://example.com","description":"What it does in 2-3 sentences.","category":"Category"}]

Categories must be exactly one of: Assistants, Writing & Content, Creativity & Design, Development, Research & Analytics, Product Management, Productivity, Marketing, Sales, Hiring & HR`

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'perplexity/sonar',
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) throw new Error(`Perplexity error: ${await res.text()}`)

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content ?? ''
  const tools = parseJSON(content)

  if (!Array.isArray(tools)) {
    console.log('[research] Raw response from Perplexity:')
    console.log(content.slice(0, 1000))
    throw new Error(`Could not parse tools list`)
  }

  // Perplexity adds citation markers like "fact[4]" — strip them before they hit the DB.
  for (const t of tools) {
    if (t?.description) t.description = stripCitations(t.description)
    if (t?.name) t.name = stripCitations(t.name)
  }

  console.log(`[research] Discovered ${tools.length} tools`)
  return tools
}

async function deduplicateTools(tools) {
  const urls = tools.map(t => t.website_url).filter(Boolean)

  const [{ data: existing }, { data: pending }] = await Promise.all([
    supabase.from('tools').select('website_url').in('website_url', urls),
    supabase.from('pending_tools').select('tool_data').in('tool_data->>website_url', urls),
  ])

  const existingUrls = new Set([
    ...(existing ?? []).map(r => r.website_url),
    ...(pending ?? []).map(r => r.tool_data?.website_url),
  ])

  const newTools = tools.filter(t => !existingUrls.has(t.website_url))
  console.log(`[research] ${newTools.length} new (filtered ${tools.length - newTools.length} duplicates)`)
  return newTools
}

async function takeScreenshot(website_url, slug) {
  try {
    const res = await fetch(`${SCREENSHOT_URL}/screenshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: website_url, slug }),
      signal: AbortSignal.timeout(30_000),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.publicUrl ?? null
  } catch (err) {
    console.warn(`[research] Screenshot failed for ${slug}:`, err.message)
    return null
  }
}

async function saveToPending(toolData) {
  const { data, error } = await supabase
    .from('pending_tools')
    .insert({
      tool_data: toolData,
      status: 'pending_review',
      source: 'weekly_research',
    })
    .select()
    .single()

  if (error) throw new Error(`Supabase insert error: ${error.message}`)
  return data
}

async function sendToTelegram(pending, screenshotUrl) {
  const tool = pending.tool_data
  const useCases = Array.isArray(tool.use_cases) && tool.use_cases.length
    ? `\n\n🎯 <b>Use cases:</b>\n${tool.use_cases.map((u) => `• ${u}`).join('\n')}`
    : ''
  const caption = `🆕 <b>${tool.name}</b>\n` +
    `📂 ${tool.category}\n\n` +
    `${tool.description ?? ''}` +
    `${useCases}\n\n` +
    `🔗 ${tool.website_url}`

  const keyboard = {
    inline_keyboard: [[
      { text: '✅ Publish', callback_data: `approve:${pending.id}` },
      { text: '❌ Reject', callback_data: `reject:${pending.id}` },
    ]]
  }

  let msgId = null

  if (screenshotUrl) {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHANNEL,
        photo: screenshotUrl,
        caption,
        parse_mode: 'HTML',
        reply_markup: keyboard,
      }),
    })
    const data = await res.json()
    msgId = data.result?.message_id ?? null
  } else {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHANNEL,
        text: caption,
        parse_mode: 'HTML',
        reply_markup: keyboard,
      }),
    })
    const data = await res.json()
    msgId = data.result?.message_id ?? null
  }

  if (msgId) {
    await supabase
      .from('pending_tools')
      .update({ telegram_msg_id: msgId })
      .eq('id', pending.id)
  }
}

async function main() {
  console.log('[research] Starting weekly research...')

  // Check screenshot service
  try {
    const health = await fetch(`${SCREENSHOT_URL}/health`, { signal: AbortSignal.timeout(3000) })
    console.log('[research] Screenshot service:', health.ok ? 'online' : 'offline')
  } catch {
    console.warn('[research] Screenshot service offline — will skip screenshots')
  }

  const discovered = await discoverTools()
  const newTools = await deduplicateTools(discovered)

  if (newTools.length === 0) {
    console.log('[research] No new tools found. Done.')
    return
  }

  for (const tool of newTools) {
    try {
      console.log(`[research] Processing: ${tool.name}`)
      const enriched = await enrichTool(tool)
      const screenshotUrl = await takeScreenshot(enriched.website_url, enriched.slug)
      if (screenshotUrl) enriched.screenshot_url = screenshotUrl

      const pending = await saveToPending(enriched)
      await sendToTelegram(pending, screenshotUrl)
      console.log(`[research] ✓ ${tool.name} → Telegram`)
      await sleep(2000)
    } catch (err) {
      console.error(`[research] ✗ ${tool.name}:`, err.message)
    }
  }

  console.log(`[research] Done. Processed ${newTools.length} tools.`)
}

main().catch(console.error)
