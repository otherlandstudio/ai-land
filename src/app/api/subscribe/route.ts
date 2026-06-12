import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHANNEL = process.env.TELEGRAM_CHANNEL_ID

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

async function notifyTelegram(email: string) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHANNEL) return
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHANNEL,
        text: `📬 <b>New subscriber</b>\n${email}`,
        parse_mode: 'HTML',
      }),
    })
  } catch (err) {
    console.error('[subscribe] Telegram notify failed:', err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Honeypot
    if (body.hp) return NextResponse.json({ ok: true })

    const email = String(body.email ?? '').trim().toLowerCase()
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'invalid email' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Уже підписаний — ідемпотентний ok, без leak існування адреси
    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
    })
    if (existing.totalDocs > 0) {
      return NextResponse.json({ ok: true })
    }

    await payload.create({
      collection: 'subscribers',
      data: { email, status: 'active', source: 'hero' },
    })

    notifyTelegram(email).catch(console.error)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[subscribe]', err)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
