# Action Plan — AI Land
**План дій · webf.love × Other Land**
Version 1.0 · 23.03.2026

---

## Фази проекту

### ФАЗА 0 — Pre-start (до старту розробки)
**Відповідальний:** Other Land
**Тривалість:** 1-2 тижні

- [ ] Надати доступ до Google Doc з технічним ТЗ
- [ ] Підготувати Figma-файл дизайну (або підтвердити що розробляємо по прототипу)
- [ ] Вирішити питання платформи: Next.js (рекомендовано) vs Webflow
- [ ] Визначити джерела для weekly research (Product Hunt? Specific sites?)
- [ ] Вирішити: прев'ю тулу = авто-скрін або лого вручну?
- [ ] Створити Telegram канал і бота (або надати доступ до існуючих)
- [ ] Підтвердити бюджет на API (~$55-85/mo ongoing)
- [ ] Підготувати стартовий контент: список 20-50 тулів для першого запуску
- [ ] Kick-off дзвінок з командою webf.love

---

### ФАЗА 1 — Foundation (тиждень 1-2)
**Відповідальний:** webf.love
**Обсяг:** ~20-25 год

#### Інфраструктура
- [ ] Створити Supabase проект, налаштувати таблиці `tools` і `pending_tools`
- [ ] Налаштувати full-text search індекс (tsvector)
- [ ] Налаштувати Supabase Storage для скріншотів
- [ ] Ініціалізувати Next.js проект на Vercel
- [ ] Підключити Supabase до Next.js
- [ ] Налаштувати environment variables
- [ ] Row Level Security: public read, service role write

#### Базові компоненти
- [ ] Design system: кольори, типографія, spacing (з Figma або по прототипу)
- [ ] Глобальна навігація (Logo, Search placeholder, Submit CTA)
- [ ] Footer
- [ ] Tool Card компонент
- [ ] Layout/wrapper компоненти

**Deliverable Фази 1:** Порожній сайт з компонентами, підключений до Supabase

---

### ФАЗА 2 — Core Pages (тиждень 2-3)
**Відповідальний:** webf.love
**Обсяг:** ~18-22 год

#### Сторінки
- [ ] Homepage: Hero + Category Tabs + Tool Grid (з реальними даними)
- [ ] Tool Detail шаблон: всі секції, динамічний routing `/tools/[slug]`
- [ ] Submit Tool форма з валідацією
- [ ] 404 сторінка

#### Функціонал
- [ ] Category filter (client-side)
- [ ] Search modal (⌘K) з Supabase full-text
- [ ] "How can this help me?" логіка (ChatGPT/Claude/Perplexity URL генерація)
- [ ] SEO: meta tags, OG теги, sitemap

#### Контент
- [ ] Залити стартовий контент (20-50 тулів) в Supabase
- [ ] Перевірка адаптивності (mobile, tablet, desktop)

**Deliverable Фази 2:** Повнофункціональний сайт з реальним контентом, без автоматизації

---

### ФАЗА 3 — Automation (тиждень 3-5)
**Відповідальний:** webf.love
**Обсяг:** ~20-34 год

#### Telegram Bot
- [ ] Налаштувати Telegram Bot через BotFather
- [ ] Додати бота в приватний канал як адміна
- [ ] Налаштувати webhook для реакцій в Make.com
- [ ] Протестувати reaction listener

#### Pipeline 1 — Weekly Research
- [ ] Make.com: scheduled trigger (понеділок 09:00)
- [ ] Інтеграція з Perplexity API (або вибране джерело)
- [ ] Дедуплікація (Supabase check)
- [ ] Claude API: генерація ELI5, тегів, use cases, категорії
- [ ] ScreenshotOne API: авто-скрін
- [ ] Telegram: форматування і відправка повідомлень
- [ ] Збереження в `pending_tools`
- [ ] End-to-end тест: від запуску до Telegram

#### Pipeline 2 — User Submission
- [ ] API route на Next.js: `/api/submit-tool`
- [ ] Make.com webhook: отримання + Claude enrich
- [ ] Telegram повідомлення з [USER SUBMITTED] маркером
- [ ] End-to-end тест: форма → Telegram

#### Reaction → Publish
- [ ] Make.com: Telegram webhook для реакцій
- [ ] Логіка: знайти в `pending_tools` → перенести в `tools`
- [ ] Перевірка що тул з'являється на сайті після реакції
- [ ] End-to-end тест: реакція → публікація

**Deliverable Фази 3:** Повна автоматизація працює

---

### ФАЗА 4 — QA + Launch (тиждень 5-6)
**Відповідальний:** webf.love + Other Land
**Обсяг:** ~6-10 год

#### QA
- [ ] Тестування всіх сторінок на мобайлі
- [ ] Тестування пошуку з різними запитами
- [ ] Тестування "How can this help me?" для всіх трьох асистентів
- [ ] Повний end-to-end тест weekly pipeline (ручний запуск)
- [ ] Повний end-to-end тест user submission
- [ ] Перевірка SEO (Lighthouse)
- [ ] Перевірка OG-карток (Twitter/LinkedIn превью)

#### Performance
- [ ] Image optimization
- [ ] Lazy loading для tool grid
- [ ] Перевірка Core Web Vitals

#### Launch checklist
- [ ] Custom domain налаштований
- [ ] Analytics підключено (Plausible або GA4)
- [ ] Error monitoring (Sentry або Vercel logs)
- [ ] Make.com scenarios активовані
- [ ] Telegram bot активний
- [ ] Стартовий контент перевірено командою

**Deliverable Фази 4:** Продукт готовий до публічного запуску

---

## Залежності та ризики

| Ризик | Вплив | Мітигація |
|-------|-------|-----------|
| Figma не готовий до старту | Затримка Фази 2 на 1-2 тижні | Розробляємо по прототипу, замінюємо після |
| Telegram API обмеження на реакції | Automation може не спрацювати | Тест на початку Фази 3, fallback — ручний webhook |
| Claude API rate limits | Повільний weekly batch | Додати delay між запитами, обробка по черзі |
| Стартовий контент не готовий | Сайт запускається порожнім | Мінімум 20 тулів для MVP launch |
| Google Doc з ТЗ закритий | Прогалини в розумінні автоматизації | Провести детальний kick-off до старту |

---

## Технічний стек

| Шар | Технологія | Версія/план |
|-----|-----------|-------------|
| Frontend | Next.js 15 | App Router |
| Hosting | Vercel | Free → Pro при потребі |
| Database | Supabase | Free → Pro |
| Storage | Supabase Storage | Для скріншотів |
| Automation | Make.com | Core ($16/mo) |
| AI Research | Perplexity API | pay-as-you-go |
| AI Enrichment | Claude API (claude-sonnet-4-6) | pay-as-you-go |
| Screenshots | ScreenshotOne | Basic ($19/mo) |
| Bot | Telegram Bot API | Free |

**Ongoing costs estimate:** ~$55-85/mo

---

## Milestones

| Milestone | Тиждень | Що є |
|-----------|---------|------|
| M0 — Kick-off | W0 | Всі питання закриті, доступи отримані |
| M1 — Foundation | W2 | Supabase + Next.js + компоненти |
| M2 — Site Live | W3 | Сайт із контентом, без автоматизації |
| M3 — Automation | W5 | Повна автоматизація |
| M4 — Launch | W6 | Публічний запуск |
