# Brief Analysis — AI Land
**webf.love × Other Land · 23.03.2026**

---

## Проект

**Клієнт:** Other Land
**Продукт:** AI Land — курований директорій АІ тулів
**Тип:** Сайт + CMS + Автоматизація + Telegram Workflow
**Дизайн:** від клієнта

---

## Що є в скоупі

### Підтверджено
- Директорій АІ тулів з 11 категоріями
- Tool detail сторінки
- Submit Tool форма
- Weekly research pipeline
- Telegram approval workflow (реакція = публікація)
- "How can this help me?" CTA
- SQL-пошук (не LLM)
- Дизайн від клієнта

### Опціонально
- Окремі сторінки категорій
- Sponsor / About сторінки
- Auto-screenshot тулів
- Email backup нотифікації
- Пагінація / infinite scroll
- Фільтр по ціні/тегах
- Admin панель

### Відкриті питання
- Платформа: Next.js (recommended) vs Webflow
- БД: Supabase vs Airtable
- Звідки research: які джерела?
- Прев'ю: авто-скрін чи лого?
- Figma-дизайн готовий до старту?
- Хто генерує ELI5 — AI as-is чи команда редагує?
- Дедлайн чи пріоритет?
- Бюджет на API ($55-85/mo ongoing)

---

## Архітектура сайту

### Global Components
- Навігація: Logo + Search ⌘K + "Submit Tool" CTA
- Footer: посилання на Other Land + About / Sponsor / Submit
- Search Modal / Command Palette
- "How can this help me?" — Modal/Logic

### Homepage (унікальна)
- Hero: "Discover AI tools that actually work" + stats (150+ tools, 11 categories, Updated weekly)
- Category Filter Tabs: Latest / Assistants / Writing & Content / Creativity & Design / Development / Research & Analytics / Product Management / Productivity / Marketing / Sales / Hiring & HR
- Tool Grid (4 колонки)
- Tool Card компонент

### Tool Card компонент
- Градієнтна обкладинка з назвою тулу
- Назва + тег категорії
- ELI5 цитата курсивом
- Emoji-теги (до 3) + ціна

### Tool Detail Page (шаблон × N тулів)
- Кнопка "← Back"
- Градієнтна обкладинка
- Назва, категорія, ціна, дата додавання
- Повний опис
- ELI5 блок (🙃 "Explain Like I'm 5")
- Emoji-теги
- USE CASES (5-6 тегів)
- CTA: "Visit Website →" + "💬 How can this help me?"
- "More in [Category]" — related tools

### Submit Tool Page (унікальна)
- Форма: назва, URL, опис, категорія, ціна
- Success state
- Валідація + спам-захист

### About / Sponsor (опціонально)
- Про проект та Other Land
- Sponsor info

---

## Автоматизація

### Pipeline 1 — Weekly Research → Telegram → Publish

1. ⏰ Щотижневий тригер (понеділок 09:00)
2. 🔍 Пошук нових AI тулів (Perplexity API або Product Hunt)
3. 🔄 Дедуплікація (Supabase check)
4. 🤖 Claude API: генерація ELI5, тегів, use cases, категорії
5. 📸 Screenshot (ScreenshotOne API)
6. 📲 Telegram: одне повідомлення per тул
7. 👍 Реакція команди = апрув
8. ✅ Авто-публікація на сайті

### Pipeline 2 — User Submission → Telegram → Publish

1. 📝 Submit Tool форма на сайті
2. 🤖 Auto-enrich (Claude API)
3. 📲 Telegram з позначкою [USER SUBMITTED]
4. 👍 Реакція = апрув
5. ✅ Публікація на сайті

### Feature — "How can this help me?"
- Кнопка на кожній tool detail сторінці
- Генерується промпт з контекстом тулу
- Відкриває ChatGPT / Claude / Perplexity з pre-filled промптом
- Чисто фронтенд, без API
- Референс: thegradient.com — блок "Discuss with your AI" внизу статей

### Feature — Search
- ⌘K тригер
- Full-text search: назва, опис, use cases
- Фільтр по категорії / тегах
- Результати в реальному часі
- Supabase full-text search (PostgreSQL tsvector), НЕ LLM

---

## Рекомендований стек

| Шар | Технологія | Причина |
|-----|-----------|---------|
| Сайт | Next.js + Vercel | Прототип вже Next.js, потрібні dynamic routes та API routes |
| База даних | Supabase | PostgreSQL full-text search, REST API, Storage |
| Автоматизація | Make.com | Visual workflow, є Telegram + Supabase + Claude коннектори |
| AI Research | Perplexity API | Актуальний веб-пошук нових тулів |
| AI Enrichment | Claude API | Генерація описів, ELI5, тегів, use cases |
| Screenshots | ScreenshotOne API | ~$19/mo, простий URL → screenshot |
| Bot | Telegram Bot API | Через Make.com |

**Ongoing API costs: ~$55-85/mo**
- Make.com Core: ~$16/mo
- ScreenshotOne Basic: ~$19/mo
- Claude API: ~$20-50/mo

---

## Естімейт

### Сайт + Фронтенд
- Глобальні компоненти (Nav, Footer, Search, "How can this help me?"): 6–10 год
- Homepage: 8–12 год
- Tool Detail шаблон: 6–10 год
- Submit Tool форма: 4–6 год
- About / Sponsor (опц.): 2–4 год
- Supabase schema + API routes + інтеграція: 8–14 год
- **Subtotal: 34–56 год**

### Автоматизація
- Weekly Research Pipeline: 10–18 год
- Telegram Reaction Listener → auto-publish: 6–10 год
- User Submission → Telegram flow: 4–6 год
- **Subtotal: 20–34 год**

### Опціонально
- Category Pages × 11: +6–12 год
- Admin інтерфейс: +12–20 год

### **Базовий скоуп: 54–90 годин**

---

## Уточнюючі питання

**Критичні:**
1. Figma готовий до старту — чи розробка паралельно з дизайном?
2. Які джерела для weekly research?
3. Прев'ю — авто-скрін сайту чи лого вручну?

**Технічні:**
4. Telegram канал/бот вже є чи з нуля?
5. Бюджет на API сервіси (~$55-85/mo)?
6. Supabase / Vercel акаунти вже є?

**Скоуп / контент:**
7. ELI5 — AI генерує і публікує, чи команда редагує перед апрувом?
8. Стартовий контент — хто завантажує перші 150+ тулів?
9. Редагування після публікації — потрібен UI?

**Дедлайни:**
10. Є MVP дата?
