# PRD — AI Land
**Product Requirements Document**
Version 1.0 · Other Land · 23.03.2026

---

## 1. Overview

**Продукт:** AI Land — курований директорій АІ тулів
**Власник:** Other Land studio
**Тип:** Публічний веб-продукт (саб-продукт Other Land)
**URL прототипу:** https://ai-land-ol-directory.vercel.app

### Одна фраза
Тижнево оновлювана бібліотека АІ тулів з людськими поясненнями, яка автоматично наповнюється через Telegram-апрув команди.

### Проблема
АІ тулів стає все більше, але немає простого місця де можна зрозуміти що робить кожен інструмент — без жаргону, з реальними юз кейсами. Команда Other Land хоче вести таку бібліотеку, але ручне наповнення потребує занадто багато часу.

### Рішення
Сайт-директорій + автоматизований pipeline: щотижнева розвідка нових тулів → AI-генерація описів → Telegram-ревю → публікація одним натиском (реакцією).

---

## 2. Цільова аудиторія

**Основна:** Фахівці та команди, які хочуть знайти потрібний АІ інструмент без зайвого дослідження. Дизайнери, маркетологи, менеджери продукту, розробники.

**Вторинна:** Стартапи та АІ-компанії, які хочуть потрапити в куратований директорій (User Submission).

**Профіль користувача:**
- Чув про AI тул але не розуміє чи потрібен
- Шукає рішення для конкретного юз кейсу ("хочу автоматизувати звіти")
- Не хоче читати технічні документації — хоче просте пояснення
- Довіряє куратованому контенту більше ніж агрегатору

---

## 3. Цілі продукту

|Ціль | Метрика успіху |
|------|---------------|
| Зменшити час на наповнення директорію | Команда витрачає ≤30 хв/тиждень на апрув |
| Зростання бібліотеки | +10-20 нових тулів на тиждень |
| Корисність для юзерів | Повернення юзерів, час на сторінці тулу |
| Впізнаваність Other Land | Трафік з директорію на otherland.studio |

---

## 4. Функціональні вимоги

### 4.1 Сайт — Головна сторінка

**Hero блок:**
- H1: "Discover AI tools that actually work"
- Subtitle: "Curated directory of the best AI products — from established platforms to early-stage startups. Updated weekly."
- Stats: кількість тулів · кількість категорій · "Updated weekly"

**Category Filter:**
- Горизонтальний таб-рядок з 11 категоріями
- Категорії: Latest · Assistants · Writing & Content · Creativity & Design · Development · Research & Analytics · Product Management · Productivity · Marketing · Sales · Hiring & HR
- "Latest" показує всі тули, відсортовані по даті додавання
- При виборі категорії — фільтрація без перезавантаження сторінки

**Tool Grid:**
- 4 колонки на десктопі, 2 на планшеті, 1 на мобайлі
- Відображається назва секції "All Tools" + каунтер кількості

**Tool Card:**
- Верхня частина: градієнтна обкладинка з назвою тулу (унікальний колір per тул або per категорія)
- Назва тулу + тег категорії
- ELI5 цитата в лапках курсивом
- Рядок з emoji-тегами (до 3-х) + ціна праворуч
- При кліку — перехід на detail сторінку

**Emoji-теги (система):**
- 🎨 Creative
- 🔥 Popular
- 🧠 Pro-level
- 🚀 Fast
- 🌱 Beginner-friendly
- 👥 Team
- 💰 Pricey
- ✨ New

---

### 4.2 Tool Detail Сторінка

URL: `/tools/[slug]`

**Структура (зверху вниз):**
1. Кнопка "← Back"
2. Градієнтна обкладинка (повна ширина, назва тулу центром)
3. H1: назва тулу
4. Мета-рядок: тег категорії · ціновий badge · "Added X days ago"
5. Повний опис (2-3 речення, без ELI5)
6. ELI5 блок: 🙃 "EXPLAIN LIKE I'M 5" + цитата курсивом
7. Emoji-теги
8. "USE CASES" — список тегів-пілюль (5-6 штук)
9. CTA-рядок: "Visit Website →" + "💬 How can this help me?"
10. "More in [Category]" — горизонтальний scroll related tool cards

**Дані тулу (data schema):**
```
id: uuid
name: string
slug: string
category: enum (11 categories)
description: text
eli5: text (ELI5 пояснення)
tags: array (emoji tags)
use_cases: array of strings
price_label: string (e.g. "Free / $20/mo", "From $10/mo")
price_type: enum (free | freemium | paid)
website_url: string
cover_color: string (hex або gradient preset)
screenshot_url: string (optional)
published: boolean
submitted_by_user: boolean
created_at: timestamp
published_at: timestamp
```

---

### 4.3 Фіча: "How can this help me?"

**Поведінка:**
- Кнопка "💬 How can this help me?" на detail сторінці кожного тулу
- При кліку — з'являється вибір: ChatGPT · Claude · Perplexity (і можливо Grok)
- При виборі асистента — відкривається новий таб з pre-filled промптом

**Формат промпту:**
```
I want to understand how [Tool Name] can help me.

Here's what this tool does: [description]
Use cases it covers: [use_cases joined by comma]

Please help me understand:
1. Is this tool relevant for my work?
2. What's the best way to start using it?
3. What are realistic expectations?
```

**Технічна реалізація:**
- Чисто фронтенд, без API викликів
- URL-encode промпту і відкрити відповідний URL:
  - ChatGPT: `https://chat.openai.com/?q=`
  - Claude: `https://claude.ai/new?q=`
  - Perplexity: `https://www.perplexity.ai/?q=`

---

### 4.4 Пошук

**Тригер:** ⌘K або клік на search bar у навігації

**Поведінка:**
- Відкривається modal/overlay
- Пошук по: назва, опис, use cases
- Фільтр по категорії (dropdown або quick filters)
- Результати оновлюються в реальному часі
- Клік на результат → перехід на detail сторінку
- Esc або клік поза modal → закриття

**Технічна реалізація:**
- Supabase full-text search (PostgreSQL `tsvector`)
- Індексуємо: `name`, `description`, `eli5`, `use_cases`
- НЕ LLM, не векторний пошук — звичайний SQL full-text
- Debounce 300ms на input

---

### 4.5 Submit Tool Форма

URL: `/submit`

**Поля форми:**
- Tool Name (required)
- Website URL (required, validation)
- Short description (required, max 280 chars)
- Category (required, dropdown з 11 категорій)
- Pricing model (required: Free / Freemium / Paid + поле для ціни)
- Your name (optional)
- Your email (optional, для фідбеку)

**Після відправки:**
- Success state з текстом "Thanks! We'll review your submission"
- Форма очищається
- Дані → Make.com webhook → Telegram (Pipeline 2)

**Спам-захист:**
- Honeypot field
- Rate limiting на API route (max 5 submits per IP per day)

---

## 5. Автоматизація

### 5.1 Pipeline 1 — Weekly Research

**Тригер:** Кожного понеділка о 09:00 (налаштовується)

**Крок 1 — Пошук нових тулів:**
- Make.com scenario запускається по розкладу
- Запит до Perplexity API: "Find 15-20 new AI tools released or updated in the last 7 days. For each: name, website URL, brief description, pricing model, main use cases, industry category. Focus on tools that are genuinely useful, not hype."
- Альтернатива: парсинг Product Hunt / There's An AI For That / Futurepedia

**Крок 2 — Дедуплікація:**
- Перевірка по URL чи тул вже є в базі (Supabase query)
- Відсіювання дублікатів

**Крок 3 — AI Збагачення (Claude API):**
Для кожного нового тулу Claude генерує:
```
- ELI5 пояснення (1 речення, просто, з гумором якщо доречно)
- Emoji теги (вибрати з системи: Creative/Popular/Pro-level/Fast/Beginner/Team/Pricey/New)
- Use cases (5-6 конкретних юз кейсів)
- Normalized category (з 11 доступних)
- Price label (normalized: "Free", "Free / $X/mo", "From $X/mo")
```

**Крок 4 — Screenshot:**
- ScreenshotOne API: GET `https://api.screenshotone.com/take?url=[tool_url]&...`
- Зберігаємо в Supabase Storage
- URL скріншота → поле `screenshot_url` в тимчасовому записі

**Крок 5 — Telegram повідомлення:**
Формат кожного повідомлення:
```
[Screenshot або лого]

🆕 **[Tool Name]**
📁 [Category] · 💰 [Price]

📝 [Description]

🙃 *"[ELI5]"*

Tags: [emoji tags]

Use cases:
• [use case 1]
• [use case 2]
• [use case 3]
• ...

🔗 [website URL]
```

**Крок 6 — Зберігання pending запису:**
- Дані тулу + Telegram message_id → Supabase таблиця `pending_tools`
- Status: `pending_review`

---

### 5.2 Pipeline 2 — User Submission

**Тригер:** Submit Tool форма на сайті

**Крок 1 — Отримання даних:**
- Make.com webhook отримує дані форми

**Крок 2 — Auto-enrich (Claude API):**
- Аналогічно Pipeline 1, але на основі URL та опису від юзера

**Крок 3 — Telegram повідомлення:**
Те саме форматування + позначка:
```
⚡️ [USER SUBMITTED]

[Screenshot або лого]

🆕 **[Tool Name]**
...
```

**Кроки 4-5:** Аналогічно Pipeline 1

---

### 5.3 Telegram Reaction Listener

**Механізм:**
- Make.com scenario слухає Telegram webhook
- Тригер: нова реакція на повідомлення в каналі
- Перевірка: реакція = 👍 або ✅
- Знаходить запис в `pending_tools` по `telegram_message_id`
- Оновлює статус на `approved`
- Переносить з `pending_tools` до `tools` з `published = true`
- Тул з'являється на сайті

**Reject механізм (опціонально):**
- Реакція ❌ → статус `rejected` → тул не публікується

---

## 6. Data Schema (Supabase)

### Таблиця `tools`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
name            text NOT NULL
slug            text UNIQUE NOT NULL
category        text NOT NULL
description     text
eli5            text
tags            text[] -- array of emoji tag names
use_cases       text[]
price_label     text
price_type      text -- free|freemium|paid
website_url     text
cover_color     text
screenshot_url  text
published       boolean DEFAULT false
submitted_by_user boolean DEFAULT false
telegram_msg_id bigint
created_at      timestamptz DEFAULT now()
published_at    timestamptz
search_vector   tsvector -- для full-text search
```

### Таблиця `pending_tools`
```sql
id              uuid PRIMARY KEY
telegram_msg_id bigint UNIQUE
tool_data       jsonb -- весь набір даних тулу
status          text -- pending_review|approved|rejected
source          text -- weekly_research|user_submission
created_at      timestamptz DEFAULT now()
```

---

## 7. Non-functional Requirements

**Performance:**
- Time to first byte < 500ms
- Tool grid load < 1s
- Search results < 200ms

**SEO:**
- SSR/SSG для tool detail сторінок
- OG meta tags для кожного тулу (для шерингу)
- Slug-based URLs: `/tools/midjourney`

**Reliability:**
- Автоматизація: retry logic при помилці API
- Якщо Claude API недоступний — зберігати raw дані, попередити в Telegram
- Якщо Screenshot API fails — continue без скріншота

**Security:**
- Rate limiting на Submit форму
- Supabase Row Level Security (публічний read, service role write)
- Валідація URL перед screenshot

---

## 8. Out of Scope (v1)

- Авторизація юзерів / акаунти
- Рейтинги та відгуки від юзерів
- Порівняння тулів
- Email-розсилка новинок
- Мобільний додаток
- Платна реклама / sponsored listings (є footer лінк "Sponsor" — для v2)
- Власний AI асистент на сайті

---

## 9. Відкриті питання

1. Дизайн (Figma файл) готовий до старту розробки?
2. Які конкретні джерела для weekly research?
3. Прев'ю тулу — авто-скрін або лого?
4. Telegram канал вже існує?
5. Бюджет на monthly API costs (~$55-85/mo)?
6. ELI5 публікується as-is чи команда може редагувати в Telegram перед апрувом?
7. Стартовий контент — хто і як завантажує перші 150+ тулів?
8. Дедлайн або MVP дата?
