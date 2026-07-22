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
    browser = await chromium.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-features=FedCm,FedCmAuthz',
        '--disable-blink-features=AutomationControlled',
      ],
    })
    // Stealth context — mimics a real browser to bypass bot detection
    // (Alibaba ESA, Cloudflare-lite, basic UA-sniffers).
    const ctx = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
      locale: 'en-US',
      timezoneId: 'America/New_York',
    })
    await ctx.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined })
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] })
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] })
    })
    const page = await ctx.newPage()

    // Block unnecessary resources to speed things up
    await page.route('**/*.{woff,woff2,ttf,otf}', route => route.abort())

    // Block Google One Tap / Identity Services so the "Sign in with Google"
    // overlay never loads on third-party sites we screenshot.
    await page.route('**/accounts.google.com/gsi/**', route => route.abort())
    await page.route('**/gstatic.com/_/gsi/**', route => route.abort())

    // domcontentloaded + вищий таймаут: важкі сайти з постійним мережевим трафіком
    // (аналітика/реклама) ніколи не дають 'networkidle'. Прорисовку добирає waitForTimeout нижче.
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 })
    } catch {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
    }

    // Fallback: hide any One Tap iframe that slipped past the network block,
    // plus the most common cookie-consent overlays that ruin marketing screenshots.
    await page.addStyleTag({
      content: `
        iframe[src*="accounts.google.com/gsi"],
        #credential_picker_container,
        [id^="credential_picker_iframe"],
        #onetrust-banner-sdk,
        #onetrust-consent-sdk,
        #osano-cm-window,
        #cookie-banner,
        [id*="cookie-banner"],
        [class*="cookie-banner"],
        [id*="CookieConsent"],
        [class*="CookieConsent"],
        [class*="cookie-consent"],
        [aria-label*="cookie" i],
        [aria-label*="consent" i],
        .cky-consent-container,
        .truste_box_overlay,
        .truste_overlay,
        #usercentrics-root { display: none !important; }
        html, body { overflow: auto !important; }
      `,
    }).catch(() => {})

    // Wait for content to settle (animations, lazy loads, splash screens,
    // delayed cookie banners that appear ~2s after load)
    await page.waitForTimeout(3000)

    // Auto-dismiss cookie banners that use generic selectors by clicking
    // common reject/decline buttons. Done AFTER the wait so delayed banners
    // are already in the DOM. Failures are silent.
    await page.evaluate(() => {
      const labels = ['reject all', 'reject', 'decline all', 'decline', 'dismiss', 'no thanks', 'не приймати', 'відхилити']
      const els = Array.from(document.querySelectorAll('button, a[role="button"], div[role="button"], [class*="cookie"] button, [class*="consent"] button'))
      for (const el of els) {
        const txt = ((el.innerText || el.textContent || '').trim().toLowerCase())
        if (labels.includes(txt) && el.offsetParent) {
          try { el.click() } catch {}
        }
      }
    }).catch(() => {})

    // Small settle after dismiss
    await page.waitForTimeout(500)

    const buffer = await page.screenshot({ type: 'png', fullPage: false })

    const storagePath = `screenshots/${slug}.png`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: 'image/png',
        cacheControl: '2678400', // 31 день — щоб браузер/edge кешували скрін одразу
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
