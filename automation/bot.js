// Pipeline 3: Telegram Bot — approve/reject tools via inline buttons
// Usage: node bot.js

import 'dotenv/config'
import { Telegraf } from 'telegraf'
import { createClient } from '@supabase/supabase-js'

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

async function publishTool(pendingId, ctx) {
  const { data: pending, error } = await supabase
    .from('pending_tools')
    .select('*')
    .eq('id', pendingId)
    .single()

  if (error || !pending) {
    await ctx.answerCbQuery('Tool not found')
    return
  }

  if (pending.status !== 'pending_review') {
    await ctx.answerCbQuery(`Already ${pending.status}`)
    return
  }

  const toolData = pending.tool_data

  // Only the 6 displayed fields + search_description (internal, search-only).
  // Deprecated columns (eli5, tags, price_*, cover_color) are nulled out — schema kept for back-compat.
  const { error: insertError } = await supabase.from('tools').insert({
    name: toolData.name,
    slug: toolData.slug,
    category: toolData.category,
    description: toolData.description,
    use_cases: toolData.use_cases ?? [],
    website_url: toolData.website_url ?? null,
    screenshot_url: toolData.screenshot_url ?? null,
    search_description: toolData.search_description ?? null,
    eli5: null,
    tags: [],
    price_type: null,
    price_label: null,
    cover_color: null,
    published: true,
    submitted_by_user: pending.source === 'user_submission',
    published_at: new Date().toISOString(),
  })

  if (insertError) {
    console.error('[bot] Insert error:', insertError.message)
    await ctx.answerCbQuery('Error publishing')
    return
  }

  await supabase.from('pending_tools').update({ status: 'approved' }).eq('id', pendingId)

  await ctx.editMessageReplyMarkup({ inline_keyboard: [[{ text: '✅ Published', callback_data: 'done' }]] })
  await ctx.answerCbQuery(`✅ Published: ${toolData.name}`)
  console.log(`[bot] Published: ${toolData.name}`)
}

async function rejectTool(pendingId, ctx) {
  const { data: pending } = await supabase
    .from('pending_tools')
    .select('status, tool_data')
    .eq('id', pendingId)
    .single()

  if (!pending) { await ctx.answerCbQuery('Not found'); return }
  if (pending.status !== 'pending_review') { await ctx.answerCbQuery(`Already ${pending.status}`); return }

  await supabase.from('pending_tools').update({ status: 'rejected' }).eq('id', pendingId)

  await ctx.editMessageReplyMarkup({ inline_keyboard: [[{ text: '❌ Rejected', callback_data: 'done' }]] })
  await ctx.answerCbQuery(`❌ Rejected: ${pending.tool_data?.name}`)
  console.log(`[bot] Rejected: ${pending.tool_data?.name}`)
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
  const { count } = await supabase
    .from('pending_tools')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending_review')
  await ctx.reply(`🤖 AI Land Bot running\n📋 Pending reviews: ${count ?? 0}`)
})

bot.launch({
  allowedUpdates: ['callback_query', 'message'],
})

console.log('[bot] AI Land Bot started. Waiting for approvals...')

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
