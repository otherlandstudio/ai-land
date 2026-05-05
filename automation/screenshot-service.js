// screenshot-service.js
// Playwright microservice — takes screenshot of a URL, uploads to Supabase Storage
// Usage: node screenshot-service.js
// POST http://localhost:3001/screenshot { url, slug }

import express from 'express'
import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'

const app = express()
app.use(express.json())

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const BUCKET = 'tool-screenshots'

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.post('/screenshot', async (req, res) => {
  const { url, slug } = req.body

  if (!url || !slug) {
    return res.status(400).json({ error: 'url and slug are required', publicUrl: null })
  }

  let browser
  try {
    browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()

    await page.setViewportSize({ width: 1280, height: 800 })

    // Block unnecessary resources to speed things up
    await page.route('**/*.{woff,woff2,ttf,otf}', route => route.abort())

    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 })

    // Wait for content to settle (animations, lazy loads)
    await page.waitForTimeout(1500)

    const buffer = await page.screenshot({ type: 'png', fullPage: false })

    const storagePath = `screenshots/${slug}.png`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: 'image/png',
        upsert: true,
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath)

    console.log(`[screenshot] ${slug} → ${publicUrl}`)
    res.json({ publicUrl })

  } catch (err) {
    console.error(`[screenshot] ERROR for ${slug}:`, err.message)
    res.status(500).json({ error: err.message, publicUrl: null })
  } finally {
    if (browser) await browser.close()
  }
})

const PORT = process.env.SCREENSHOT_PORT || 3001
app.listen(PORT, () => {
  console.log(`Screenshot service running on :${PORT}`)
  console.log(`Health: http://localhost:${PORT}/health`)
  console.log(`POST  : http://localhost:${PORT}/screenshot`)
})
