// Pipeline 3: Telegram Bot — approve/reject tools via inline buttons
// Usage: node bot.js
//
// Пише в Payload через REST API з API-key сервісного користувача.
// Потрібні env: TELEGRAM_BOT_TOKEN, PAYLOAD_API_URL (напр. https://ailand.gallery
// або http://localhost:3000), PAYLOAD_API_KEY.

import 'dotenv/config'
import { Telegraf } from 'telegraf'

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

const API = (process.env.PAYLOAD_API_URL || 'http://localhost:3000').replace(/\/$/, '')
const AUTH = { Authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}` }
const JSON_HEADERS = { ...AUTH, 'Content-Type': 'application/json' }

async function api(path, init = {}) {
  const res = await fetch(`${API}/api${path}`, init)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.errors?.[0]?.message || `HTTP ${res.status}`)
  return data
}

async function publishTool(pendingId, ctx) {
  let pending
  try {
    pending = await api(`/pending-submissions/${pendingId}`, { headers: AUTH })
  } catch {
    await ctx.answerCbQuery('Tool not found')
    return
  }

  if (pending.status !== 'pending_review') {
    await ctx.answerCbQuery(`Already ${pending.status}`)
    return
  }

  const t = pending.toolData || {}
  const useCases = Array.isArray(t.use_cases) ? t.use_cases.filter(Boolean).map((value) => ({ value })) : []

  try {
    await api('/tools', {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({
        _status: 'published',
        name: t.name,
        slug: t.slug,
        category: t.category,
        description: t.description ?? null,
        useCases,
        websiteUrl: t.website_url ?? null,
        screenshotUrl: t.screenshot_url ?? null,
        publishedAt: new Date().toISOString(),
      }),
    })
  } catch (err) {
    console.error('[bot] Publish error:', err.message)
    await ctx.answerCbQuery('Error publishing')
    return
  }

  await api(`/pending-submissions/${pendingId}`, {
    method: 'PATCH',
    headers: JSON_HEADERS,
    body: JSON.stringify({ status: 'approved' }),
  })

  await ctx.editMessageReplyMarkup({ inline_keyboard: [[{ text: '✅ Published', callback_data: 'done' }]] })
  await ctx.answerCbQuery(`✅ Published: ${t.name}`)
  console.log(`[bot] Published: ${t.name}`)
}

async function rejectTool(pendingId, ctx) {
  let pending
  try {
    pending = await api(`/pending-submissions/${pendingId}`, { headers: AUTH })
  } catch {
    await ctx.answerCbQuery('Not found')
    return
  }
  if (pending.status !== 'pending_review') {
    await ctx.answerCbQuery(`Already ${pending.status}`)
    return
  }

  await api(`/pending-submissions/${pendingId}`, {
    method: 'PATCH',
    headers: JSON_HEADERS,
    body: JSON.stringify({ status: 'rejected' }),
  })

  await ctx.editMessageReplyMarkup({ inline_keyboard: [[{ text: '❌ Rejected', callback_data: 'done' }]] })
  await ctx.answerCbQuery(`❌ Rejected: ${pending.toolData?.name}`)
  console.log(`[bot] Rejected: ${pending.toolData?.name}`)
}

// Inline button handlers
bot.action(/^approve:(.+)$/, async (ctx) => {
  await publishTool(ctx.match[1], ctx)
})

bot.action(/^reject:(.+)$/, async (ctx) => {
  await rejectTool(ctx.match[1], ctx)
})

bot.action('done', (ctx) => ctx.answerCbQuery())

// Health check command
bot.command('status', async (ctx) => {
  try {
    const data = await api('/pending-submissions?where[status][equals]=pending_review&limit=1', { headers: AUTH })
    await ctx.reply(`🤖 AI Land Bot running\n📋 Pending reviews: ${data.totalDocs ?? 0}`)
  } catch (err) {
    await ctx.reply(`🤖 Bot up, but API error: ${err.message}`)
  }
})

bot.launch({
  allowedUpdates: ['callback_query', 'message'],
})

console.log('[bot] AI Land Bot started. Waiting for approvals...')

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
