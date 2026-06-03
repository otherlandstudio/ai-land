/**
 * Seed — переносить дані з legacy Supabase-таблиць у Payload-колекції.
 *   legacy `tools`         → колекція `tools` (cms_tools)
 *   legacy `pending_tools` → колекція `pending-submissions`
 *
 * Ідемпотентний: якщо цільова колекція вже непорожня — пропускає її.
 * Запуск: npm run seed  (з експортованими DATABASE_URL + PAYLOAD_SECRET)
 */
import { getPayload } from 'payload'
import pg from 'pg'
import config from '../src/payload.config'


async function main() {
  const payload = await getPayload({ config })

  const sql = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })
  await sql.connect()

  // ───────────────────────── TOOLS ─────────────────────────
  const toolsCount = await payload.count({ collection: 'tools' })
  if (toolsCount.totalDocs > 0) {
    console.log(`⏭  tools: вже ${toolsCount.totalDocs} док. — пропускаю`)
  } else {
    const { rows } = await sql.query('select * from tools order by created_at asc')
    let ok = 0
    let fail = 0
    for (const r of rows) {
      try {
        await payload.create({
          collection: 'tools',
          context: { disableRevalidate: true },
          data: {
            _status: r.published ? 'published' : 'draft',
            name: r.name,
            slug: r.slug,
            category: r.category ?? undefined,
            description: r.description ?? undefined,
            useCases: (r.use_cases ?? []) as string[],
            websiteUrl: r.website_url ?? undefined,
            screenshotUrl: r.screenshot_url ?? undefined,
            publishedAt: r.published_at ?? undefined,
          },
        })
        ok++
      } catch (e) {
        fail++
        console.log('  ✗ tool', r.slug, (e as Error).message)
      }
    }
    console.log(`✅ tools: ${ok} створено, ${fail} помилок (з ${rows.length})`)
  }

  // ──────────────────── PENDING SUBMISSIONS ────────────────────
  const pendCount = await payload.count({ collection: 'pending-submissions' })
  if (pendCount.totalDocs > 0) {
    console.log(`⏭  pending-submissions: вже ${pendCount.totalDocs} док. — пропускаю`)
  } else {
    const { rows } = await sql.query('select * from pending_tools order by created_at asc')
    let ok = 0
    let fail = 0
    for (const r of rows) {
      try {
        await payload.create({
          collection: 'pending-submissions',
          context: { disableRevalidate: true },
          data: {
            title: r.tool_data?.name ?? r.tool_data?.slug ?? 'Без назви',
            status: r.status ?? 'pending_review',
            source: r.source ?? undefined,
            submittedBy: r.submitted_by ?? undefined,
            telegramMsgId: r.telegram_msg_id != null ? Number(r.telegram_msg_id) : undefined,
            toolData: r.tool_data ?? undefined,
          },
        })
        ok++
      } catch (e) {
        fail++
        console.log('  ✗ pending', r.id, (e as Error).message)
      }
    }
    console.log(`✅ pending-submissions: ${ok} створено, ${fail} помилок (з ${rows.length})`)
  }

  await sql.end()
  console.log('🌱 seed завершено')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
