// One-time backfill: generate search_description for every tool that lacks one.
// Uses gpt-4o-mini for cost (≈$0.20 for 172 tools).
//
// Usage: node backfill-search-descriptions.js [--dry-run] [--limit N]

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'openai/gpt-4o-mini'
const CONCURRENCY = 4
const BATCH_DELAY_MS = 200

const DRY = process.argv.includes('--dry-run')
const limitArg = process.argv.find((a) => a.startsWith('--limit='))
const LIMIT = limitArg ? Number(limitArg.split('=')[1]) : null

function parseJSON(content) {
  const match = content.match(/```(?:json)?\n?([\s\S]+?)\n?```/)
  try { return JSON.parse(match ? match[1] : content) } catch {
    const obj = content.match(/\{[\s\S]+\}/)
    try { return obj ? JSON.parse(obj[0]) : null } catch { return null }
  }
}

async function generateSearchDescription(tool) {
  const prompt = `Generate a long search-only description for this AI tool. The text is NEVER displayed on the website — its only job is to feed the search index so users find this tool when typing natural-language queries.

Tool:
Name: ${tool.name}
Category: ${tool.category}
Description: ${tool.description ?? ''}
Use cases: ${(tool.use_cases ?? []).join(', ')}
Tags: ${(tool.tags ?? []).join(', ')}

Write 700–1000 characters, dense with:
- Synonyms for what this tool does (e.g. "email automation, email marketing, outbound campaigns, drip sequences, newsletter")
- Target user roles ("for marketers, founders, sales teams, product managers")
- Related technologies and integrations ("works with Gmail, Slack, Notion, Zapier")
- Alternative product names this competes with ("alternative to Mailchimp, similar to ActiveCampaign")
- Natural-language phrases real users would type ("automate my email marketing", "send personalized emails at scale")

Plain prose, no bullets, no markdown, no headings. Pack it with keywords but keep it readable.

Return ONLY JSON: {"search_description": "..."}`

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`)
  const data = await res.json()
  const json = parseJSON(data.choices?.[0]?.message?.content ?? '')
  if (!json?.search_description) throw new Error('No search_description in response')
  return String(json.search_description).slice(0, 1100)
}

async function processTool(tool) {
  try {
    const text = await generateSearchDescription(tool)
    if (DRY) {
      console.log(`[dry] ${tool.name}: ${text.slice(0, 80)}…`)
      return { ok: true }
    }
    const { error } = await supabase
      .from('tools')
      .update({ search_description: text })
      .eq('id', tool.id)
    if (error) throw new Error(error.message)
    console.log(`✓ ${tool.name}`)
    return { ok: true }
  } catch (err) {
    console.error(`✗ ${tool.name}: ${err.message}`)
    return { ok: false, error: err.message }
  }
}

async function main() {
  let q = supabase
    .from('tools')
    .select('id, name, category, description, use_cases, tags')
    .is('search_description', null)
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (LIMIT) q = q.limit(LIMIT)

  const { data: tools, error } = await q
  if (error) throw new Error(`Fetch error: ${error.message}`)

  console.log(`[backfill] ${tools.length} tools missing search_description${DRY ? ' (DRY RUN)' : ''}`)

  let done = 0
  let failed = 0

  for (let i = 0; i < tools.length; i += CONCURRENCY) {
    const chunk = tools.slice(i, i + CONCURRENCY)
    const results = await Promise.all(chunk.map(processTool))
    done += results.filter((r) => r.ok).length
    failed += results.filter((r) => !r.ok).length
    if (i + CONCURRENCY < tools.length) await new Promise((r) => setTimeout(r, BATCH_DELAY_MS))
  }

  console.log(`\n[backfill] Done. ✓ ${done}  ✗ ${failed}`)
}

main().catch((err) => {
  console.error('[backfill] Fatal:', err)
  process.exit(1)
})
