/**
 * Проставляє довгий Cache-Control на існуючих скріншотах у Supabase Storage.
 *
 * Причина: Supabase S3-ендпоінт за замовчуванням віддає `no-cache`, через що
 * Next Image Optimizer транслює браузеру `max-age=0, must-revalidate` і браузер
 * перезавантажує кожну картинку при кожному переході. Виправляємо в джерелі —
 * недеструктивна CopyObject in-place з MetadataDirective=REPLACE.
 *
 * Запуск:
 *   tsx scripts/fix-screenshot-cache.ts --one     # один об'єкт (доказ)
 *   tsx scripts/fix-screenshot-cache.ts           # усі об'єкти в бакеті
 */
import {
  S3Client,
  ListObjectsV2Command,
  CopyObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3'

const BUCKET = process.env.S3_BUCKET || 'tool-screenshots'
const CACHE = 'public, max-age=2678400, immutable' // 31 день

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
})

const ONE = process.argv.includes('--one')

async function listKeys(): Promise<string[]> {
  const keys: string[] = []
  let token: string | undefined
  do {
    const res = await s3.send(
      new ListObjectsV2Command({ Bucket: BUCKET, ContinuationToken: token }),
    )
    for (const o of res.Contents ?? []) if (o.Key) keys.push(o.Key)
    token = res.IsTruncated ? res.NextContinuationToken : undefined
  } while (token)
  return keys
}

async function fixKey(key: string): Promise<void> {
  const head = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }))
  await s3.send(
    new CopyObjectCommand({
      Bucket: BUCKET,
      Key: key,
      // Кодуємо кожен сегмент шляху, але зберігаємо `/` (об'єкти в підпапці screenshots/)
      CopySource: `/${BUCKET}/${key.split('/').map(encodeURIComponent).join('/')}`,
      MetadataDirective: 'REPLACE',
      CacheControl: CACHE,
      ContentType: head.ContentType || 'image/png',
    }),
  )
}

async function main() {
  const all = await listKeys()
  const keys = ONE ? all.slice(0, 1) : all
  console.log(`Бакет "${BUCKET}": ${all.length} об'єктів, обробляю ${keys.length}`)
  let ok = 0
  for (const key of keys) {
    try {
      await fixKey(key)
      ok++
      if (ONE || ok % 25 === 0) console.log(`  ✓ ${ok}/${keys.length}  ${key}`)
    } catch (e) {
      console.log(`  ✗ ${key}: ${(e as Error).message}`)
    }
  }
  console.log(`Готово: ${ok}/${keys.length} оновлено (Cache-Control: ${CACHE})`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
