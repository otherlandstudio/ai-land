'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

const CLAUDE_PROMPT = `You are setting up the full automation system for AI Land — a curated AI tools directory.

## Your credentials (replace all placeholders before running)

OPENROUTER_API_KEY=YOUR_OPENROUTER_KEY_HERE
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
TELEGRAM_CHANNEL_ID=YOUR_CHANNEL_ID_HERE
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
N8N_URL=http://localhost:5678
N8N_API_KEY=YOUR_N8N_API_KEY_HERE
SCREENSHOT_SERVICE_URL=http://localhost:3001

## Context

AI Land is a curated AI tools directory. The automation handles:
1. Weekly discovery of new AI tools via Perplexity search
2. Enrichment — only generate slug + use_cases via GPT-4o (no pricing, no tags, no ELI5)
3. Screenshots of each tool's website via local Playwright service
4. Telegram review channel — team sees each tool as a message
5. Publish by reaction — 👍 on a message → tool goes live on website
6. User submissions from the website → same Telegram review flow

## Tool data model (only 6 fields)

For every tool we collect and publish ONLY:
- name
- category
- screenshot_url
- website_url
- description (short, 2–3 sentences, citation markers like [4] must be stripped)
- use_cases (array of 4 short scenarios, max 60 chars each)

Do NOT generate, store, or display: pricing, tags, "best for", ELI5, cover_color.

## Task: Create 3 n8n workflows via n8n REST API

Connect to n8n at N8N_URL using N8N_API_KEY.
First create the required credentials in n8n, then create the 3 workflows.

### Step 1 — Create credentials in n8n

1a. OpenRouter credential (HTTP Header Auth)
Name: "OpenRouter"
Type: httpHeaderAuth
data: { name: "Authorization", value: "Bearer OPENROUTER_API_KEY" }

1b. Supabase credential
Name: "Supabase AI Land"
Type: supabaseApi
data: { host: SUPABASE_URL, serviceRole: SUPABASE_SERVICE_KEY }

1c. Telegram credential
Name: "Telegram AI Land Bot"
Type: telegramApi
data: { accessToken: TELEGRAM_BOT_TOKEN }

### Step 2 — Workflow 1: "AI Land — Weekly Research"

Trigger: Schedule Trigger — every Monday at 09:00, timezone Europe/Kyiv

Nodes in order:
1. Schedule Trigger
2. HTTP Request → OpenRouter (perplexity/sonar) — research prompt:
   "Find 15-20 new or recently launched AI tools from the last 7 days.
   Return ONLY a valid JSON array, no markdown. Each item must have:
   name, website_url, description (2-3 sentences, plain text, no citation markers),
   category (one of: Assistants | Writing & Content | Creativity & Design |
   Development | Research & Analytics | Product Management | Productivity |
   Marketing | Sales | Hiring & HR)"
3. Code node — parse response JSON, strip markdown fences AND Perplexity citation markers ([4], [5] etc):
   const raw = $input.first().json.choices[0].message.content;
   const clean = raw.replace(/\`\`\`json|\`\`\`/g, '').trim();
   const tools = JSON.parse(clean);
   const stripCitations = (s) => (s ?? '').replace(/\\s*\\[\\d+\\](\\[\\d+\\])*\\s*$/g, '').replace(/\\s*\\[\\d+\\]/g, '').trim();
   return tools.map(t => ({ json: { ...t, description: stripCitations(t.description), name: stripCitations(t.name) } }));
4. Split In Batches (size: 1)
5. Supabase node — SELECT from tools WHERE website_url = {{ $json.website_url }}
6. IF node — continue only if result length === 0 (new tool, not duplicate)
7. HTTP Request → OpenRouter (openai/gpt-4o) — enrich prompt:
   System: "You write for AI Land — a curated AI tools directory. Always respond with valid JSON only."
   User: "Tool: {{ $json.name }}\\nURL: {{ $json.website_url }}\\nDescription: {{ $json.description }}\\nCategory: {{ $json.category }}\\n\\nGenerate JSON: { \\"slug\\": \\"url-friendly-kebab-slug\\", \\"use_cases\\": [\\"4 short specific scenarios, max 60 chars each — what a user would actually do with the tool\\"], \\"search_description\\": \\"700-1000 chars, dense with synonyms, technologies, roles, alternatives, natural-language search phrases. Never displayed on site — only feeds the search index.\\" }"
8. Code node — parse enrich response and merge data:
   const content = $input.first().json.choices[0].message.content;
   const clean = content.replace(/\`\`\`json|\`\`\`/g, '').trim();
   const enriched = JSON.parse(clean);
   const prev = $node['Split In Batches'].json;
   return [{ json: { ...prev, ...enriched } }];
9. HTTP Request → SCREENSHOT_SERVICE_URL/screenshot (POST):
   Body: { url: {{ $json.website_url }}, slug: {{ $json.slug }} }
   continueOnFail: true
10. Supabase INSERT into pending_tools:
    tool_data: { name, slug, category, description, use_cases, search_description, website_url, screenshot_url: {{ $node['Screenshot'].json.publicUrl }} }
    status: "pending_review"
    source: "weekly_research"
11. Wait node — 1 second (avoid rate limits)
12. Telegram — Send Photo to TELEGRAM_CHANNEL_ID:
    Photo: {{ $json.tool_data.screenshot_url }}
    Caption (HTML, parse_mode=HTML):
    🆕 <b>{{ $json.tool_data.name }}</b>
    📂 {{ $json.tool_data.category }}

    {{ $json.tool_data.description }}

    🎯 <b>Use cases:</b>
    {{ $json.tool_data.use_cases.map(u => '• ' + u).join('\\n') }}

    🔗 {{ $json.tool_data.website_url }}
13. Supabase UPDATE pending_tools SET telegram_msg_id = {{ $node['Telegram'].json.message_id }}
    WHERE id = {{ $node['Supabase Insert'].json.id }}

### Step 3 — Workflow 2: "AI Land — User Submission"

Trigger: Webhook — POST /submit-tool, respond immediately with 200

Nodes in order:
1. Webhook trigger
2. Code node — validate and sanitize:
   const b = $json.body;
   if (b.hp) return []; // honeypot check
   if (!b.tool_name?.trim()) return [];
   try { new URL(b.website_url) } catch { return []; }
   if (!b.description || b.description.length < 20) return [];
   if (!b.category) return [];
   return [{ json: {
     name: b.tool_name.trim(),
     website_url: b.website_url.trim(),
     description: b.description.trim(),
     category: b.category,
     submitted_by_name: b.your_name || 'Anonymous',
     submitted_by_email: b.your_email || ''
   }}];
3. Supabase SELECT from tools WHERE website_url = {{ $json.website_url }}
4. IF node — continue only if not duplicate
5-12. Same as Workflow 1 steps 7-13, but:
   - source: "user_submission"
   - submitted_by: {{ $json.submitted_by_name }} ({{ $json.submitted_by_email }})
   - Telegram caption prefix:
     ⚡️ *[USER SUBMITTED]*
     👤 {{ $json.submitted_by_name }} {{ $json.submitted_by_email ? '(' + $json.submitted_by_email + ')' : '' }}

### Step 4 — Workflow 3: "AI Land — Reaction Publish"

Trigger: Webhook — POST /tg-reaction (Telegram will send reactions here)

Nodes in order:
1. Webhook trigger
2. Code node — extract reaction:
   const reaction = $json.body.message_reaction;
   if (!reaction) return [];
   const emoji = reaction.new_reaction?.[0]?.emoji;
   const msg_id = reaction.message_id;
   if (!['👍', '✅', '❌'].includes(emoji)) return [];
   return [{ json: { emoji, msg_id, is_approve: emoji !== '❌' } }];
3. Supabase SELECT from pending_tools WHERE telegram_msg_id = {{ $json.msg_id }} AND status = 'pending_review'
4. IF node — continue only if result found
5. IF node — split on is_approve
   TRUE branch (approve):
     5a. Supabase INSERT into tools from tool_data jsonb:
         published: true, published_at: now(), submitted_by_user: (source === 'user_submission')
     5b. Supabase UPDATE pending_tools SET status = 'approved'
     5c. Telegram sendMessage to TELEGRAM_CHANNEL_ID:
         Reply to message: {{ $json.msg_id }}
         Text: ✅ *{{ $json[0].tool_data.name }}* is now live on AI Land 🚀
   FALSE branch (reject):
     5d. Supabase UPDATE pending_tools SET status = 'rejected'

### Step 5 — Register Telegram webhook

After creating the workflows and activating them, make this HTTP call to register
the Telegram webhook so reactions are forwarded to n8n:

POST https://api.telegram.org/botTELEGRAM_BOT_TOKEN/setWebhook
Body: {
  "url": "N8N_URL/webhook/tg-reaction",
  "allowed_updates": ["message_reaction"]
}

### Step 6 — Verify

After setup:
1. Manually trigger Workflow 1 — confirm messages appear in Telegram channel
2. Test Workflow 2 by POSTing to N8N_URL/webhook/submit-tool with sample data
3. React with 👍 to a message — confirm the tool appears in Supabase tools table with published=true

If n8n API is unavailable or returns errors, output the 3 workflow JSON files
ready for manual import via n8n UI (Settings → Import workflow).`

const CODE_SNIPPETS: Record<string, string> = {
  n8n: `docker run -it --rm \\\n  -p 5678:5678 \\\n  -v n8n_data:/home/node/.n8n \\\n  n8nio/n8n`,
  install: `cd automation\nnpm install\nnpx playwright install chromium`,
  'env-cmd': `cp .env.example .env\nnano .env`,
  'env-content': `SUPABASE_URL=https://YOUR_PROJECT.supabase.co\nSUPABASE_SERVICE_KEY=eyJhbGciOiJI...`,
  start: `npm start`,
}

function CopyButton({ codeKey, isPrompt = false }: { codeKey: string; isPrompt?: boolean }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const text = isPrompt ? CLAUDE_PROMPT : CODE_SNIPPETS[codeKey]
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isPrompt) {
    return (
      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 font-extrabold text-[15px] py-3.5 rounded-xl transition-all mt-4"
        style={{
          background: copied ? '#0fd79c' : '#c9e75d',
          color: '#121312',
        }}
      >
        {copied ? '✓ Скопійовано!' : '📋 Copy Claude Code Prompt'}
      </button>
    )
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 text-[11px] font-semibold px-2.5 py-1 rounded transition-all"
      style={{
        background: copied ? '#0fd79c' : '#25295d',
        color: copied ? '#000' : '#b1b1d3',
      }}
    >
      {copied ? '✓' : '📋 Copy'}
    </button>
  )
}

function CodeBlock({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div className="relative mt-2.5">
      <pre
        className="rounded-lg px-4 py-3.5 overflow-x-auto text-[13px] leading-relaxed text-[#e0ddeb]"
        style={{ background: '#0d0f1e', border: '1px solid rgba(255,255,255,0.06)', fontFamily: "'JetBrains Mono', monospace" }}
      >
        {children}
      </pre>
      <CopyButton codeKey={id} />
    </div>
  )
}

function SaveBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-start gap-2.5 rounded-lg px-3.5 py-2.5 mt-2.5 text-[12px] text-[#b1b1d3] leading-relaxed"
      style={{ background: 'rgba(201,231,93,0.06)', border: '1px solid rgba(201,231,93,0.15)' }}
    >
      <span className="text-base flex-shrink-0">🔐</span>
      <div>{children}</div>
    </div>
  )
}

function TipBox({ warn = false, children }: { warn?: boolean; children: React.ReactNode }) {
  return (
    <div
      className="flex gap-3 items-start rounded-lg px-4 py-3.5 mt-4 text-[13px] text-[#b1b1d3] leading-relaxed"
      style={
        warn
          ? { background: 'rgba(236,169,17,0.06)', border: '1px solid rgba(236,169,17,0.2)' }
          : { background: 'rgba(15,215,156,0.06)', border: '1px solid rgba(15,215,156,0.2)' }
      }
    >
      <span className="text-base flex-shrink-0 mt-0.5">{warn ? '⚠️' : '💡'}</span>
      <div>{children}</div>
    </div>
  )
}

function SubStep({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3.5 items-start py-3.5 border-b last:border-b-0 last:pb-0 first:pt-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5 text-[#b1b1d3]"
        style={{ background: '#25295d' }}
      >
        {num}
      </div>
      <div className="flex-1">
        <div className="text-[14px] font-semibold text-[#fafafa] mb-1">{title}</div>
        <div className="text-[13px] text-[#b1b1d3] leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

function StepCard({
  id,
  num,
  icon,
  title,
  subtitle,
  link,
  linkGhost,
  children,
}: {
  id: string
  num: number
  icon: string
  title: string
  subtitle: string
  link?: { href: string; label: string }
  linkGhost?: { href: string; label: string }
  children: React.ReactNode
}) {
  return (
    <div
      id={id}
      className="rounded-2xl mb-6 overflow-hidden hover:border-[rgba(201,231,93,0.12)] transition-colors"
      style={{ background: '#181b38', border: '1px solid rgba(255,255,255,0.06)', scrollMarginTop: '80px' }}
    >
      <div className="flex items-center gap-4 px-7 py-6" style={{ background: '#1c2146', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-[18px] font-extrabold flex-shrink-0 text-[#c9e75d]"
          style={{ background: '#25295d', border: '2px solid #4f548e' }}
        >
          {num}
        </div>
        <span className="text-2xl flex-shrink-0">{icon}</span>
        <div className="flex-1">
          <h2 className="text-[20px] font-bold text-[#fafafa] leading-tight">{title}</h2>
          <p className="text-[13px] text-[#7676a1]">{subtitle}</p>
        </div>
        {link && (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-[12px] font-bold px-3.5 py-2 rounded-lg transition-colors"
            style={{ background: '#c9e75d', color: '#121312' }}
          >
            {link.label}
          </a>
        )}
        {linkGhost && (
          <a
            href={linkGhost.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-[12px] font-bold px-3.5 py-2 rounded-lg transition-colors ml-2"
            style={{ background: 'transparent', border: '1px solid rgba(201,231,93,0.3)', color: '#c9e75d' }}
          >
            {linkGhost.label}
          </a>
        )}
      </div>
      <div className="px-7 py-6">{children}</div>
    </div>
  )
}

const STEPS = [
  { n: 1, name: 'Telegram Bot' },
  { n: 2, name: 'Supabase БД' },
  { n: 3, name: 'OpenRouter API' },
  { n: 4, name: 'n8n локально' },
  { n: 5, name: 'Screenshot сервіс' },
  { n: 6, name: 'Claude Code Prompt' },
]

export default function SetupPage() {
  const [activeStep, setActiveStep] = useState(1)

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY + 100
      let current = 1
      for (let n = 1; n <= 6; n++) {
        const el = document.getElementById('step-' + n)
        if (el && el.offsetTop <= scrollY) current = n
      }
      setActiveStep(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollToStep(n: number) {
    const el = document.getElementById('step-' + n)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <Navbar />

      <div className="flex pt-[56px] min-h-screen relative" style={{ background: '#15182f' }}>

        {/* Sidebar */}
        <aside
          className="fixed top-[56px] left-0 h-[calc(100vh-56px)] overflow-y-auto py-8 hidden md:block"
          style={{ width: 240, background: '#181b38', borderRight: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#7676a1] px-5 pb-3">
            Кроки налаштування
          </div>
          {STEPS.map(({ n, name }) => (
            <button
              key={n}
              onClick={() => scrollToStep(n)}
              className="w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors"
              style={{
                background: activeStep === n ? 'rgba(201,231,93,0.12)' : 'transparent',
                borderLeft: activeStep === n ? '2px solid #c9e75d' : '2px solid transparent',
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                style={{
                  background: activeStep === n ? '#c9e75d' : '#25295d',
                  color: activeStep === n ? '#121312' : '#b1b1d3',
                }}
              >
                {n}
              </div>
              <span
                className="text-[12px] font-medium"
                style={{ color: activeStep === n ? '#fafafa' : '#b1b1d3' }}
              >
                {name}
              </span>
            </button>
          ))}

          <div className="px-5 pt-4 mt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-[11px] text-[#7676a1] leading-relaxed">
              Щомісячна вартість:<br />
              <span className="text-[#c9e75d] font-bold">~$5–30</span> / month<br />
              <span className="text-[10px]">тільки OpenRouter API<br />(pay-per-use)</span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-6 md:px-12 py-12 pb-32" style={{ marginLeft: 0 }} >
          <div className="max-w-[820px] md:ml-[240px]">

            {/* Hero */}
            <div className="mb-14">
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#c9e75d] mb-4"
                style={{ background: 'rgba(201,231,93,0.1)', border: '1px solid rgba(201,231,93,0.2)' }}
              >
                ⚙️ Setup Guide
              </div>
              <h1 className="text-[40px] font-extrabold tracking-tight leading-tight mb-3 text-[#fafafa]">
                Automation<br /><span className="text-[#c9e75d]">Setup Guide</span>
              </h1>
              <p className="text-[17px] text-[#b1b1d3] leading-relaxed max-w-xl">
                6 кроків — і система сама знаходить нові AI-тули кожного понеділка, надсилає в Telegram на перегляд, і публікує їх після твого 👍
              </p>

              <div className="flex flex-wrap gap-1.5 mt-7">
                {STEPS.map(({ n, name }) => (
                  <button
                    key={n}
                    onClick={() => scrollToStep(n)}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] transition-all"
                    style={{ background: '#181b38', border: '1px solid rgba(255,255,255,0.06)', color: '#7676a1' }}
                  >
                    <div
                      className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: '#25295d' }}
                    >
                      {n}
                    </div>
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 1 — Telegram */}
            <StepCard
              id="step-1"
              num={1}
              icon="🤖"
              title="Telegram Bot"
              subtitle="Канал для перегляду і публікації тулів реакцією"
              link={{ href: 'https://t.me/BotFather', label: '→ BotFather' }}
            >
              <SubStep num={1} title="Відкрий BotFather і створи нового бота">
                Перейди в{' '}
                <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-[#c9e75d] hover:underline">@BotFather</a>
                {' '}в Telegram → надішли команду{' '}
                <code className="bg-[#25295d] px-1.5 py-0.5 rounded text-[12px]">/newbot</code>
                {' '}→ придумай назву та username для бота (має закінчуватись на <em>bot</em>)
                <SaveBox>
                  <strong className="text-[#c9e75d]">Зберегти: BOT TOKEN</strong> — виглядає як{' '}
                  <code>123456789:AAFxxxxxx</code>
                </SaveBox>
              </SubStep>
              <SubStep num={2} title="Створи приватний канал">
                Telegram → New Channel → Private. Назви його, наприклад, <em>AI Land Review</em>. Це закритий канал тільки для тебе і бота.
              </SubStep>
              <SubStep num={3} title="Додай бота як адміністратора">
                Налаштування каналу → Administrators → Add Admin → знайди свого бота по username → дай права: Post Messages, Edit Messages, Delete Messages, Add Members. Важливо: увімкни <strong className="text-[#fafafa]">реакції</strong> в налаштуваннях каналу.
              </SubStep>
              <SubStep num={4} title="Дізнайся CHANNEL_ID">
                Надішли будь-яке повідомлення в канал, потім відкрий в браузері:
                <code className="block mt-1.5 bg-[#25295d] px-2.5 py-1.5 rounded text-[12px]">
                  https://api.telegram.org/bot<span className="text-[#f65959]">YOUR_TOKEN</span>/getUpdates
                </code>
                Знайди поле <code className="bg-[#25295d] px-1 rounded text-[12px]">{'"chat":{"id":'}</code> — це і є CHANNEL_ID (зазвичай починається з <code className="bg-[#25295d] px-1 rounded text-[12px]">-100</code>)
                <SaveBox>
                  <strong className="text-[#c9e75d]">Зберегти: CHANNEL_ID</strong> — виглядає як <code>-1001234567890</code>
                </SaveBox>
              </SubStep>
            </StepCard>

            {/* Step 2 — Supabase */}
            <StepCard
              id="step-2"
              num={2}
              icon="🗄️"
              title="Supabase БД"
              subtitle="Безкоштовна база даних для тулів і черги публікацій"
              link={{ href: 'https://supabase.com', label: '→ supabase.com' }}
            >
              <SubStep num={1} title="Зареєструйся і створи проект">
                Перейди на{' '}
                <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-[#c9e75d] hover:underline">supabase.com</a>
                {' '}→ Sign Up → New Project → придумай назву (напр. <em>ai-land</em>) і надійний пароль БД. Безкоштовний план — 500 МБ бази і 1 ГБ сховища, цього більш ніж достатньо.
              </SubStep>
              <SubStep num={2} title="Виконай SQL-схему — таблиці">
                Ліве меню → <strong className="text-[#fafafa]">SQL Editor</strong> → New Query → встав вміст файлу{' '}
                <code className="bg-[#25295d] px-1.5 py-0.5 rounded text-[12px]">supabase/schema.sql</code>
                {' '}→ натисни <strong className="text-[#fafafa]">Run</strong>. Це створить таблиці <code className="bg-[#25295d] px-1 rounded text-[12px]">tools</code> і <code className="bg-[#25295d] px-1 rounded text-[12px]">pending_tools</code>.
              </SubStep>
              <SubStep num={3} title="Виконай SQL-схему — права доступу">
                Ще один запит в SQL Editor → вміст файлу{' '}
                <code className="bg-[#25295d] px-1.5 py-0.5 rounded text-[12px]">supabase/rls.sql</code>
                {' '}→ <strong className="text-[#fafafa]">Run</strong>. Це налаштує права доступу і створить публічний bucket для скріншотів.
              </SubStep>
              <SubStep num={4} title="Скопіюй ключі проекту">
                Ліве меню → <strong className="text-[#fafafa]">Settings → API</strong>. Тобі потрібні два значення:
                <SaveBox>
                  <strong className="text-[#c9e75d]">SUPABASE_URL</strong> — Project URL (виглядає як <code>https://xxxx.supabase.co</code>)<br />
                  <strong className="text-[#c9e75d]">SUPABASE_SERVICE_KEY</strong> — service_role key (довгий JWT токен — НЕ anon key!)
                </SaveBox>
              </SubStep>
              <TipBox>
                <strong className="text-[#fafafa]">Важливо:</strong> використовуй саме <code className="bg-[#25295d] px-1 rounded text-[11px]">service_role</code> key, а не <code className="bg-[#25295d] px-1 rounded text-[11px]">anon</code>. Service role дозволяє n8n і screenshot-сервісу записувати дані в обхід RLS-правил.
              </TipBox>
            </StepCard>

            {/* Step 3 — OpenRouter */}
            <StepCard
              id="step-3"
              num={3}
              icon="🔑"
              title="OpenRouter API"
              subtitle="Один ключ — доступ до GPT-4o і Perplexity Sonar"
              link={{ href: 'https://openrouter.ai/keys', label: '→ openrouter.ai' }}
            >
              <SubStep num={1} title="Зареєструйся на OpenRouter">
                Перейди на{' '}
                <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-[#c9e75d] hover:underline">openrouter.ai</a>
                {' '}→ Sign In → Google або GitHub.
              </SubStep>
              <SubStep num={2} title="Поповни баланс">
                <a href="https://openrouter.ai/credits" target="_blank" rel="noopener noreferrer" className="text-[#c9e75d] hover:underline">openrouter.ai/credits</a>
                {' '}→ Add Credits → поповни $10. Цього вистачить на кілька місяців роботи. Система витрачає приблизно $0.05–0.15 за один тижневий запуск (15–20 тулів).
              </SubStep>
              <SubStep num={3} title="Створи API ключ">
                <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-[#c9e75d] hover:underline">openrouter.ai/keys</a>
                {' '}→ Create Key → назви його <em>ai-land-automation</em> → скопіюй.
                <SaveBox>
                  <strong className="text-[#c9e75d]">Зберегти: OPENROUTER_API_KEY</strong> — виглядає як <code>sk-or-v1-xxxx</code>
                </SaveBox>
              </SubStep>
              <TipBox>
                <strong className="text-[#fafafa]">Як OpenRouter використовується в системі:</strong><br />
                • <code className="text-[#c9e75d] text-[12px]">perplexity/sonar</code> — шукає нові AI-тули в інтернеті (research)<br />
                • <code className="text-[#c9e75d] text-[12px]">openai/gpt-4o</code> — генерує slug і use_cases для кожного тулу (enrich)
              </TipBox>
            </StepCard>

            {/* Step 4 — n8n */}
            <StepCard
              id="step-4"
              num={4}
              icon="⚙️"
              title="n8n локально"
              subtitle="Оркестратор всіх workflow — безкоштовний self-hosted"
              link={{ href: 'https://docs.docker.com/get-started/get-docker/', label: '→ Docker' }}
              linkGhost={{ href: 'https://docs.n8n.io', label: 'docs.n8n.io' }}
            >
              <SubStep num={1} title="Встанови Docker Desktop">
                Якщо ще не встановлено:{' '}
                <a href="https://docs.docker.com/get-started/get-docker/" target="_blank" rel="noopener noreferrer" className="text-[#c9e75d] hover:underline">docs.docker.com</a>
                {' '}→ завантаж для macOS/Windows/Linux → встанови → запусти.
              </SubStep>
              <SubStep num={2} title="Запусти n8n через Docker">
                Відкрий термінал і виконай команду:
                <CodeBlock id="n8n">
                  <span className="text-[#c9e75d] font-semibold">docker</span>
                  {' run -it --rm \\\n  -p '}
                  <span className="text-[#a5d6ff]">5678:5678</span>
                  {' \\\n  -v n8n_data:/home/node/.n8n \\\n  n8nio/n8n'}
                </CodeBlock>
                <p className="mt-2">Прапор <code className="bg-[#25295d] px-1 rounded text-[12px]">-v n8n_data:/home/node/.n8n</code> зберігає всі workflow і налаштування між перезапусками.</p>
              </SubStep>
              <SubStep num={3} title="Відкрий n8n і зареєструйся">
                Перейди в браузері на{' '}
                <a href="http://localhost:5678" target="_blank" rel="noopener noreferrer" className="text-[#c9e75d] hover:underline">localhost:5678</a>
                {' '}→ введи email і пароль → готово.
              </SubStep>
              <SubStep num={4} title="Увімкни n8n API (для Claude Code)">
                Settings (шестерня внизу зліва) → n8n API → Enable → скопіюй API Key.
                <SaveBox>
                  <strong className="text-[#c9e75d]">Зберегти: N8N_API_KEY</strong> — потрібен для Claude Code промпту
                </SaveBox>
              </SubStep>
              <TipBox warn>
                <strong className="text-[#fafafa]">Щоразу при перезапуску комп'ютера</strong> n8n треба запускати заново цією командою. Якщо хочеш щоб він працював постійно — додай прапор <code className="bg-[#25295d] px-1 rounded text-[11px]">--restart unless-stopped</code> і прибери <code className="bg-[#25295d] px-1 rounded text-[11px]">--rm</code>.
              </TipBox>
            </StepCard>

            {/* Step 5 — Screenshot */}
            <StepCard
              id="step-5"
              num={5}
              icon="📸"
              title="Screenshot сервіс"
              subtitle="Playwright робить скріни сайтів і зберігає в Supabase Storage"
              link={{ href: 'https://nodejs.org', label: '→ Node.js' }}
            >
              <SubStep num={1} title="Встанови Node.js">
                Якщо ще нема:{' '}
                <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer" className="text-[#c9e75d] hover:underline">nodejs.org</a>
                {' '}→ завантаж LTS версію → встанови. Перевір: <code className="bg-[#25295d] px-1.5 py-0.5 rounded text-[12px]">node --version</code> має показати <code className="bg-[#25295d] px-1 rounded text-[12px]">v18+</code>
              </SubStep>
              <SubStep num={2} title="Встанови залежності">
                В терміналі, з папки проекту:
                <CodeBlock id="install">
                  <span className="text-[#79c0ff]">cd</span>
                  {' automation\n'}
                  <span className="text-[#79c0ff]">npm</span>
                  {' install\n'}
                  <span className="text-[#79c0ff]">npx</span>
                  {' playwright install chromium'}
                </CodeBlock>
              </SubStep>
              <SubStep num={3} title="Заповни .env файл">
                Скопіюй шаблон і встав свої дані:
                <CodeBlock id="env-cmd">
                  <span className="text-[#79c0ff]">cp</span>
                  {' .env.example .env\n'}
                  <span className="text-[#79c0ff]">nano</span>
                  {' .env  '}
                  <span className="text-[#7676a1] italic"># або відкрий в будь-якому редакторі</span>
                </CodeBlock>
                <p className="mt-2">Вміст файлу .env (вставити свої значення):</p>
                <CodeBlock id="env-content">
                  {'SUPABASE_URL='}
                  <span className="text-[#f65959] font-semibold">https://YOUR_PROJECT.supabase.co</span>
                  {'\nSUPABASE_SERVICE_KEY='}
                  <span className="text-[#f65959] font-semibold">eyJhbGciOiJI...</span>
                </CodeBlock>
              </SubStep>
              <SubStep num={4} title="Запусти сервіс і перевір">
                <CodeBlock id="start">
                  <span className="text-[#79c0ff]">npm</span>
                  {' start\n'}
                  <span className="text-[#7676a1] italic"># → Screenshot service running on :3001</span>
                </CodeBlock>
                <p className="mt-2">
                  Перевір що працює: відкрий{' '}
                  <a href="http://localhost:3001/health" target="_blank" rel="noopener noreferrer" className="text-[#c9e75d] hover:underline">localhost:3001/health</a>
                  {' '}— має повернути <code className="bg-[#25295d] px-1 rounded text-[12px]">{'{"status":"ok"}'}</code>
                </p>
              </SubStep>
            </StepCard>

            {/* Divider */}
            <div className="flex items-center gap-4 my-12">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#7676a1] whitespace-nowrap">Фінальний крок</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>

            {/* Step 6 — Claude Prompt */}
            <div
              id="step-6"
              className="rounded-2xl p-9"
              style={{
                background: 'linear-gradient(135deg, rgba(201,231,93,0.04) 0%, rgba(99,102,241,0.04) 100%)',
                border: '1px solid rgba(201,231,93,0.2)',
                scrollMarginTop: '80px',
              }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-[52px] h-[52px] rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: '#c9e75d' }}
                >
                  ✨
                </div>
                <div>
                  <h2 className="text-[22px] font-extrabold text-[#fafafa]">Claude Code Prompt</h2>
                  <p className="text-[14px] text-[#b1b1d3]">Вставте промпт у Claude Code — він сам налаштує всі 3 workflow в n8n</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  ['1', 'Збери всі credentials'],
                  ['2', 'Заміни плейсхолдери'],
                  ['3', 'Вставте в Claude Code'],
                  ['4', 'Готово — 3 workflow в n8n'],
                ].map(([n, label]) => (
                  <div
                    key={n}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] text-[#b1b1d3]"
                    style={{ background: '#181b38', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span className="text-[#c9e75d] font-bold">{n}</span> {label}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {[
                  { key: 'OPENROUTER_API_KEY', desc: 'Ключ OpenRouter', where: '→ openrouter.ai/keys (крок 3)' },
                  { key: 'TELEGRAM_BOT_TOKEN', desc: 'Токен від BotFather', where: '→ @BotFather в Telegram (крок 1)' },
                  { key: 'TELEGRAM_CHANNEL_ID', desc: 'ID приватного каналу', where: '→ getUpdates API (крок 1)' },
                  { key: 'SUPABASE_URL', desc: 'URL проекту Supabase', where: '→ Settings → API (крок 2)' },
                  { key: 'SUPABASE_SERVICE_KEY', desc: 'service_role JWT key', where: '→ Settings → API (крок 2)' },
                  { key: 'N8N_API_KEY', desc: 'n8n API key', where: '→ n8n Settings → API (крок 4)' },
                ].map(({ key, desc, where }) => (
                  <div key={key} className="rounded-lg px-3.5 py-3" style={{ background: '#1c2146', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-[11px] text-[#c9e75d] font-medium mb-0.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{key}</div>
                    <div className="text-[12px] text-[#b1b1d3]">{desc}</div>
                    <div className="text-[11px] text-[#7676a1] mt-0.5">{where}</div>
                  </div>
                ))}
              </div>

              <div className="relative">
                <pre
                  className="rounded-xl p-6 overflow-x-auto text-[13px] leading-relaxed text-[#e0ddeb] max-h-[520px] overflow-y-auto"
                  style={{
                    background: '#0d0f1e',
                    border: '1px solid rgba(201,231,93,0.1)',
                    fontFamily: "'JetBrains Mono', monospace",
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {CLAUDE_PROMPT}
                </pre>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(CLAUDE_PROMPT)
                  }}
                  className="absolute top-3 right-3 text-[11px] font-semibold px-3 py-1.5 rounded transition-all"
                  style={{ background: '#25295d', color: '#b1b1d3' }}
                >
                  📋 Copy
                </button>
              </div>

              <CopyButton codeKey="prompt" isPrompt />
            </div>

            {/* Final tip */}
            <TipBox>
              <strong className="text-[#fafafa]">Після налаштування:</strong> кожного понеділка о 09:00 система сама знайде 15-20 нових AI-тулів, надішле їх у твій Telegram канал зі скріншотом і описом. Постав 👍 — тул з'явиться на сайті. Постав ❌ — відхилиться. Ніяких ручних дій більше не потрібно.
            </TipBox>
          </div>
        </main>
      </div>
    </>
  )
}
