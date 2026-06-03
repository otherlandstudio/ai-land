/**
 * Відновлює use_cases у нове hasMany-text поле з бекапу automation/usecases-backup.json
 * (зроблений ДО зміни схеми array→hasMany). Запуск після migrate.
 */
import { getPayload } from 'payload'
import { readFileSync } from 'fs'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })
  const map: Record<string, string[]> = JSON.parse(
    readFileSync('automation/usecases-backup.json', 'utf8'),
  )

  let ok = 0
  let skip = 0
  for (const [slug, ucs] of Object.entries(map)) {
    if (!Array.isArray(ucs) || ucs.length === 0) {
      skip++
      continue
    }
    const found = await payload.find({
      collection: 'tools',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    const doc = found.docs[0]
    if (!doc) {
      skip++
      continue
    }
    await payload.update({
      collection: 'tools',
      id: doc.id,
      context: { disableRevalidate: true },
      data: { useCases: ucs },
    })
    ok++
  }
  console.log(`✅ restored use_cases: ${ok} tools, skipped ${skip}`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
