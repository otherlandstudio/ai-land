# AI Land — Automation Plan
**n8n local · Supabase Free · OpenRouter API · Playwright (local)**

**Ongoing cost: ~$5-30/mo** (тільки OpenRouter API, pay-per-use)

---

## Стек

| Сервіс | Роль | Ціна |
|--------|------|------|
| n8n (local/self-hosted) | Оркестрація всіх workflow | Free |
| Supabase Free | БД + Storage + REST API | Free |
| OpenRouter API | `perplexity/sonar` (research) + `gpt-4o` (enrich) | ~$5-30/mo |
| Playwright (Node.js) | Скріншоти по URL | Free |
| Telegram Bot API | Канал апруву + реакції | Free |

---

## Архітектура

### Screenshot мікросервіс
```
POST http://localhost:3001/screenshot
{ "url": "https://example.com", "slug": "example" }
→ { "publicUrl": "https://supabase.../screenshots/example.png" }
```
Playwright → знімає скрін → Supabase Storage → повертає URL.

### OpenRouter моделі
- **Research**: `perplexity/sonar` — web access, пошук нових тулів
- **Enrich**: `openai/gpt-4o` — ELI5, теги, use cases, slug
- Endpoint: `https://openrouter.ai/api/v1/chat/completions`
- Header: `Authorization: Bearer OPENROUTER_API_KEY`

---

## Supabase Schema

### Таблиця `tools` (публічні опубліковані тули)
```sql
id, name, slug, category, description, eli5, tags[], use_cases[],
price_label, price_type, website_url, cover_color, screenshot_url,
published, submitted_by_user, telegram_msg_id, created_at, published_at, search_vector
```

### Таблиця `pending_tools` (черга апруву)
```sql
id, telegram_msg_id, tool_data (jsonb), status, source, submitted_by, created_at
```

### Storage
- Bucket: `tool-screenshots` (public)
- Path: `screenshots/{slug}.png`

---

## PIPELINE 1 — Weekly Research

**Тригер:** Schedule Trigger → кожного понеділка 09:00 (Europe/Kyiv)

```
[Schedule] → [OpenRouter sonar research] → [Parse JSON]
→ [Split In Batches: 1]
→ [Supabase dedup check] → IF not found →
→ [OpenRouter gpt-4o enrich] → [Screenshot :3001] →
→ [Supabase INSERT pending_tools] → [Telegram Send Photo] → [Supabase UPDATE msg_id]
```

### Node 2 — Research prompt (perplexity/sonar)
```
Find 15-20 new or recently updated AI tools from the last 7 days.
Return ONLY a valid JSON array. Each item:
{ name, website_url, description, price_type (free|freemium|paid), price_label, category }
category: Assistants | Writing & Content | Creativity & Design | Development |
          Research & Analytics | Product Management | Productivity | Marketing | Sales | Hiring & HR
```

### Node 3 — Parse JSON (Code node)
```javascript
const raw = $input.first().json.choices[0].message.content;
const clean = raw.replace(/```json|```/g, '').trim();
const tools = JSON.parse(clean);
return tools.map(t => ({ json: t }));
```

### Node 5 — Dedup (Supabase SELECT + IF)
```
SELECT from tools WHERE website_url = {{ $json.website_url }}
IF length === 0 → continue | else → No Operation
```

### Node 6 — Enrich prompt (gpt-4o)
```
Tool: {{ $json.name }} | URL: {{ $json.website_url }}
Description: {{ $json.description }} | Category: {{ $json.category }}

Generate JSON:
{
  "eli5": "one fun sentence for 5-year-old in quotes",
  "tags": ["max 3 from: Creative|Popular|Pro-level|Fast|Beginner|Team|Pricey|New"],
  "use_cases": ["5-6 short specific phrases"],
  "slug": "url-slug"
}
```

### Node 9 — Telegram caption
```
🆕 *{name}*
📁 {category} · 💰 {price_label}

📝 {description}

🙃 _"{eli5}"_

🏷 {tags joined ' · '}

Use cases:
• {use_case_1}
• ...

🔗 {website_url}
```

---

## PIPELINE 2 — User Submission

**Тригер:** Webhook POST `/submit-tool` ← Next.js `/api/submit-tool`

```
[Webhook] → [Validate + honeypot check] → IF valid →
[Supabase dedup] → IF new →
[OpenRouter enrich] → [Screenshot :3001] →
[Supabase INSERT pending_tools] → [Telegram Send Photo ⚡️ USER SUBMITTED] → [Supabase UPDATE msg_id]
```

### Node 2 — Validation (Code node)
```javascript
const { tool_name, website_url, description, category, price_type, price_label } = $json.body;
if ($json.body.hp) return []; // honeypot

const errors = [];
if (!tool_name?.trim()) errors.push('name required');
try { new URL(website_url) } catch { errors.push('invalid url') }
if (!description || description.length < 20) errors.push('description too short');
if (!category) errors.push('category required');
if (errors.length > 0) return [];

return [{ json: { tool_name, website_url, description, category, price_type, price_label,
  submitted_by_name: $json.body.your_name,
  submitted_by_email: $json.body.your_email
}}];
```

### Telegram caption prefix
```
⚡️ *[USER SUBMITTED]*
👤 {name} ({email})
```

---

## PIPELINE 3 — Telegram Reaction → Publish

**Тригер:** Telegram Webhook → `message_reaction` event

```
[Webhook] → [Extract emoji + msg_id] → IF emoji є 👍 або ❌ →
[Supabase SELECT pending WHERE telegram_msg_id = msg_id AND status = 'pending_review']
  → IF found:
    👍 → [Supabase INSERT tools (published=true)] + [UPDATE pending status=approved]
         → [Telegram reply: ✅ Published]
    ❌ → [UPDATE pending status=rejected]
```

### Node 2 — Extract reaction (Code node)
```javascript
const reaction = $json.body.message_reaction;
if (!reaction) return [];
const emoji = reaction.new_reaction?.[0]?.emoji;
const msg_id = reaction.message_id;
if (!['👍', '✅', '❌'].includes(emoji)) return [];
return [{ json: { emoji, msg_id, is_approve: emoji !== '❌' } }];
```

### Telegram Webhook registration
```bash
curl "https://api.telegram.org/bot{TOKEN}/setWebhook\
  ?url=https://your-n8n-url/webhook/tg-reaction\
  &allowed_updates=[\"message_reaction\"]"
```

---

## Error Handling

| Ситуація | Дія |
|---------|-----|
| OpenRouter повертає не-JSON | Code node try/catch → skip item |
| Screenshot service fail | `continueOnFail=true` → screenshot_url=null |
| Telegram msg не в pending | IF node → Stop silently |
| Дублікат slug | Append `-2`, `-3` в Code node |
| OpenRouter rate limit | Wait node (2s) між батчами |

---

## Файли проекту

```
automation/
  screenshot-service.js   ← Playwright Express сервіс
  package.json
  .env.example

supabase/
  schema.sql              ← tools + pending_tools tables
  rls.sql                 ← RLS policies + storage bucket
```

---

## Launch Checklist

### 1. Infrastructure
```bash
# n8n
docker run -it --rm -p 5678:5678 n8nio/n8n
# або: npx n8n

# Screenshot service
cd automation && npm install && npx playwright install chromium
cp .env.example .env  # заповни значення
npm start
```

### 2. Supabase
- Run `schema.sql` в SQL Editor
- Run `rls.sql` в SQL Editor
- Bucket `tool-screenshots` створюється автоматично через rls.sql

### 3. Telegram
- BotFather → create bot → отримати TOKEN
- Приватний канал → додати бота як адміна (з правом реагувати)
- setWebhook до n8n URL

### 4. n8n Credentials
- OpenRouter: HTTP Header Auth `Authorization: Bearer sk-or-...`
- Supabase: URL + service key
- Telegram: Bot Token

### 5. n8n Workflows
- Створити 3 workflow з nodes по плану вище
- Тест Pipeline 1: ручний запуск → перевірити Telegram
- Тест Pipeline 2: `curl -X POST localhost:5678/webhook/submit-tool -d '{...}'`
- Тест Pipeline 3: поставити 👍 → перевірити tools в Supabase
- Активувати Schedule trigger
