/**
 * Створює (або знаходить) сервісного користувача з API-ключем для автоматизації
 * (Telegram-бот, weekly research). Друкує ключ — встав його в automation/.env
 * як PAYLOAD_API_KEY.
 *
 * Запуск: cross-env ... tsx scripts/create-service-user.ts
 */
import { getPayload } from 'payload'
import { randomUUID } from 'crypto'
import config from '../src/payload.config'

const EMAIL = 'automation@ailand.local'

async function main() {
  const payload = await getPayload({ config })
  const apiKey = randomUUID() + randomUUID().replace(/-/g, '')

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: EMAIL } },
    limit: 1,
  })

  const user = existing.docs[0]
  if (!user) {
    await payload.create({
      collection: 'users',
      data: {
        email: EMAIL,
        name: 'Automation (bot/research)',
        password: randomUUID() + 'A1!',
        enableAPIKey: true,
        apiKey,
      },
    })
    console.log('Створено сервісного користувача:', EMAIL)
  } else {
    await payload.update({
      collection: 'users',
      id: user.id,
      data: { enableAPIKey: true, apiKey },
    })
    console.log('Оновлено сервісного користувача (новий ключ):', EMAIL)
  }

  console.log('\n=== PAYLOAD_API_KEY ===')
  console.log(apiKey)
  console.log('=======================')
  console.log('Header: Authorization: users API-Key <key>')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
