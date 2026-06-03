/**
 * Гібридний бекфіл скріншотів у Payload Media.
 *
 * Для кожного тула в cms_tools:
 *   1. Якщо screenshotUpload уже є → пропустити (ідемпотентність).
 *   2. Скачати поточний screenshotUrl. Якщо це валідна картинка ≥ MIN_BYTES → беремо як є.
 *   3. Інакше (Cloudflare-заглушка / помилка / замала) і є websiteUrl →
 *      перезняти Playwright-сервісом :4001, скачати результат.
 *   4. Завантажити байти через Payload Media (→ Supabase Storage) і
 *      залінкувати screenshotUpload + screenshotUrl.
 *
 * Запуск: npm run backfill:screenshots  (DATABASE_URL+PAYLOAD_SECRET+S3_* в env,
 *         Playwright-сервіс піднятий на :4001)
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const MIN_BYTES = 25 * 1024 // < 25KB ≈ порожня/заглушка
const SERVICE = process.env.SCREENSHOT_SERVICE_URL || 'http://localhost:4001'
const FETCH_TIMEOUT = 60_000

type Outcome = { slug: string; source: 'microlink' | 'stored' | 'recapture'; ok: boolean; note?: string }

async function fetchImage(url: string): Promise<Buffer | null> {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT)
    const res = await fetch(url, { signal: ctrl.signal, redirect: 'follow' })
    clearTimeout(t)
    if (!res.ok) return null
    const ct = res.headers.get('content-type') || ''
    if (!ct.startsWith('image/')) return null
    const buf = Buffer.from(await res.arrayBuffer())
    return buf
  } catch {
    return null
  }
}

async function recapture(websiteUrl: string, slug: string): Promise<string | null> {
  try {
    const res = await fetch(`${SERVICE}/screenshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: websiteUrl, slug }),
    })
    const data = (await res.json()) as { publicUrl?: string | null }
    return data.publicUrl ?? null
  } catch {
    return null
  }
}

async function main() {
  const payload = await getPayload({ config })
  const report: Outcome[] = []

  const all = await payload.find({
    collection: 'tools',
    limit: 1000,
    pagination: false,
    depth: 0,
    select: { slug: true, name: true, websiteUrl: true, screenshotUrl: true, screenshotUpload: true },
  })
  let docs = all.docs as Array<{
    id: string | number
    slug: string
    name: string
    websiteUrl?: string | null
    screenshotUrl?: string | null
    screenshotUpload?: unknown
  }>
  const LIMIT = Number(process.env.BACKFILL_LIMIT || 0)
  if (LIMIT > 0) docs = docs.slice(0, LIMIT)
  console.log(`Знайдено ${docs.length} тулів${LIMIT ? ` (ліміт ${LIMIT})` : ''}`)

  let done = 0
  for (const t of docs) {
    done++
    const tag = `[${done}/${docs.length}] ${t.slug}`
    if (t.screenshotUpload) {
      report.push({ slug: t.slug, source: 'stored', ok: true, note: 'already-media' })
      continue
    }

    const url = t.screenshotUrl || ''
    const isMicrolink = /microlink/i.test(url)
    let buffer: Buffer | null = null
    let source: Outcome['source'] = isMicrolink ? 'microlink' : 'stored'

    if (url) buffer = await fetchImage(url)

    // погана microlink-картинка (замала/нема) → перезняти
    const tooSmall = buffer != null && isMicrolink && buffer.length < MIN_BYTES
    if ((!buffer || tooSmall) && t.websiteUrl) {
      const fresh = await recapture(t.websiteUrl, t.slug)
      if (fresh) {
        const b = await fetchImage(fresh)
        if (b) {
          buffer = b
          source = 'recapture'
        }
      }
    }

    if (!buffer) {
      report.push({ slug: t.slug, source, ok: false, note: 'no-image' })
      console.log(`${tag} ✗ без картинки`)
      continue
    }

    try {
      const media = await payload.create({
        collection: 'media',
        data: { alt: t.name },
        file: {
          data: buffer,
          mimetype: 'image/png',
          name: `${t.slug}.png`,
          size: buffer.length,
        },
      })
      await payload.update({
        collection: 'tools',
        id: t.id,
        context: { disableRevalidate: true },
        data: {
          screenshotUpload: media.id,
          screenshotUrl: (media as { url?: string }).url,
        },
      })
      report.push({ slug: t.slug, source, ok: true })
      console.log(`${tag} ✓ ${source} (${Math.round(buffer.length / 1024)}KB)`)
    } catch (e) {
      report.push({ slug: t.slug, source, ok: false, note: (e as Error).message })
      console.log(`${tag} ✗ upload: ${(e as Error).message}`)
    }
  }

  const ok = report.filter((r) => r.ok).length
  const recap = report.filter((r) => r.source === 'recapture' && r.ok).length
  const failed = report.filter((r) => !r.ok)
  console.log(`\n🌱 Готово: ${ok}/${docs.length} ok (перезнято ${recap}), помилок ${failed.length}`)
  if (failed.length) console.log('Невдалі:', failed.map((f) => f.slug).join(', '))

  const { writeFileSync } = await import('fs')
  writeFileSync('automation/backfill-report.json', JSON.stringify(report, null, 2))
  console.log('Репорт: automation/backfill-report.json')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
