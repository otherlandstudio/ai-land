# AI Land — Фікс скріншотів + Адмінка на Payload CMS (Supabase)

> Документ-хендоф для виконання в окремому вікні. Самодостатній: контекст + кроки + команди + чек-листи.
> Стек проєкту: Next.js 16.2.1 (App Router, Turbopack), React 19.2, Supabase, Tailwind v4. Менеджер — npm.
> Робоча директорія: `/Users/vladmac/Documents/otherland-product`

---

## 0. Контекст і ціль

Каталог ai-land (212 опублікованих тулів) показує скріншоти від **Microlink** (157 шт) і власного Playwright-сервісу (55 шт).

**Дві проблеми зі скрінами:**
- «без картинки» — Microlink повертає порожню/помилкову сторінку;
- «скріни з хостингу» — Microlink упирається в **Cloudflare "Verify you are human"** / cookie-стінки замість продукту (підтверджено: `theprismhq.com` → Cloudflare-wall; `poper.ai` → ок).

Власний `automation/screenshot-service.js` (Playwright + stealth + блокери Cloudflare/cookie) під це й зроблений, **але в проді не використовується**.

**Що робимо:**
- **Частина A** — одноразова авто-перезйомка поганих скрінів через захардений сервіс → Supabase Storage.
- **Частина B** — вбудувати **Payload CMS 3.x** у цей же Next-проект, на **існуючій Supabase БД**, у режимі **Payload-native**: Payload створює власні таблиці, мігруємо 212 тулів + pending, перепідключаємо сайт і Telegram-автоматизацію на Payload. Медіа — в існуючий бакет `tool-screenshots` через S3-адаптер.

**Затверджені рішення:**
- Payload-native з міграцією даних (не мапінг старої таблиці).
- Медіа → існуючий бакет `tool-screenshots`.
- Скіл `payload-cms-setup` НЕ редагуємо — Supabase-логіку застосовуємо вручну тільки для цього проєкту.
- Вхід в адмінку — стандартні Payload Users (email + пароль).
- Мова інтерфейсу/labels/повідомлень — українська.

---

## ⛔️ Блокери: що треба отримати ПЕРЕД Частиною B

Цього не дістати з service-ключа (Supabase MCP залогінений в інший акаунт):

1. **Connection string Supabase Postgres (з паролем).**
   Supabase Dashboard → Project Settings → Database → Connection string → **Session pooler / URI**.
   Формат: `postgresql://postgres.<ref>:<PASSWORD>@aws-...pooler.supabase.com:5432/postgres`
   ⚠️ Саме **Session pooler (порт 5432)** — підтримує DDL/міграції. Transaction pooler (6543) для Payload-міграцій НЕ годиться. SSL обовʼязковий.

2. **S3-ключі Supabase Storage** (для аплоаду медіа):
   Dashboard → Storage → S3 Access Keys → New key → отримаєш `Access key ID` + `Secret`.
   Також знадобиться:
   - S3-ендпоінт: `https://<ref>.storage.supabase.co/storage/v1/s3`
   - регіон проєкту (Dashboard → Project Settings → General → Region)

> Проєкт ref: `bgfieeapxzuxqusthhvb` (з `.env.local` → `NEXT_PUBLIC_SUPABASE_URL`).
> Частина A цих даних **НЕ потребує** — її роби одразу.

---

## Частина A — Терміновий фікс скріншотів (робити першою)

Незалежна від Payload. Переводить ризиковані Microlink-скріни на захардену перезйомку → Supabase Storage. Робити **ДО** міграції даних у Payload, щоб у CMS заїхали вже чисті скріни.

### A1. Підняти захардений Playwright-сервіс локально
`automation/screenshot-service.js` читає **свої** env-імена (НЕ `NEXT_PUBLIC_…`):
```bash
cd /Users/vladmac/Documents/otherland-product
# дістати значення з .env.local і дати сервісу його імена + окремий порт (3001 зайнятий dev-сервером)
export SUPABASE_URL=$(grep '^NEXT_PUBLIC_SUPABASE_URL=' .env.local | cut -d= -f2- | tr -d '"'"'"'"')
export SUPABASE_SERVICE_KEY=$(grep '^SUPABASE_SERVICE_ROLE_KEY=' .env.local | cut -d= -f2- | tr -d '"'"'"'"')
export SCREENSHOT_PORT=4001
# за потреби: npx playwright install chromium
node automation/screenshot-service.js   # у фоні / окремий термінал
# health: curl http://localhost:4001/health
```

### A2. Скрипт `automation/recapture-screenshots.js` (НОВИЙ — створити)
Логіка:
1. Сервіс-клієнтом Supabase вибрати з `tools`: `published=true AND screenshot_url ILIKE '%microlink%'` → `slug`, `website_url`.
2. Послідовно (з паузою ~1с, таймаут ~45с): `POST http://localhost:4001/screenshot {url: website_url, slug}` → отримати `{publicUrl}`.
3. На успіх: оновити `tools.screenshot_url = publicUrl + '?v=' + Date.now()` (cache-buster — обʼєкт перезаписується по тому самому шляху `screenshots/{slug}.png`, URL інакше не зміниться).
4. Евристика «все ще погано»: HEAD на обʼєкт у Storage, якщо < ~30KB АБО сервіс повернув помилку/таймаут → занести slug у `automation/recapture-report.json`.
5. Лог наприкінці: скільки оновлено / скільки в репорті.

> Re-use: патерн виклику сервісу — дивись `takeScreenshot` у `automation/research.js`; контракт upload — `automation/screenshot-service.js:115-131`; сервіс-клієнт — `src/app/api/submit-tool/route.ts:8-14`.

### A3. Перевірка очима
Завантажити 8-10 свіже-перезнятих PNG у `PlayWriteScreen/_diag/` і переглянути (особливо ті, що були Cloudflare-walls). Тули зі звіту `recapture-report.json` → ручна заміна вже в адмінці (Частина B).

> ⚠️ Після скрипта прод оновиться тільки з ревалідацією (`/` має `revalidate=3600`). Або редеплой на Vercel, або зачекати годину. (Коли Payload з hooks буде на місці — ревалідація автоматична.)

**Чек-лист A:**
- [ ] Сервіс на :4001 відповідає `/health`
- [ ] `recapture-screenshots.js` створено і прогнано
- [ ] У бакеті `tool-screenshots` зʼявились `screenshots/{slug}.png`
- [ ] `tools.screenshot_url` оновлені (з `?v=`)
- [ ] `recapture-report.json` згенеровано
- [ ] Вибірково 8-10 PNG переглянуто

---

## Частина B — Payload CMS на Supabase (Payload-native, embedded)

### B0. Сумісність (ПЕРШИЙ крок — це головний ризик)
- Next 16.2.1 + React 19.2.4. Взяти **останній Payload 3.x** (для next@16 → `3.81+`). Перевірити peer-deps на React 19.2 / Next 16.2; за потреби вирівняти версії.
- **Turbopack:** `withPayload` може вимагати окремої конфігурації. Перевірити, що `next dev` і `next build` працюють. Якщо білд падає на Turbopack — спробувати webpack для білда.
- **Не йти далі, поки `npm run build` з порожнім Payload не пройде.**

### B1. Залежності
```bash
npm add payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical @payloadcms/storage-s3 sharp
npm add -D tsx cross-env
```
(Vercel Blob / Neon адаптери НЕ ставимо.)

### B2. Підключення до Supabase Postgres
У `src/payload.config.ts`:
```ts
import { postgresAdapter } from '@payloadcms/db-postgres'
// ...
db: postgresAdapter({
  pool: { connectionString: process.env.DATABASE_URL },
  push: false, // прод-БД: керуємо міграціями, не авто-push
}),
```
- `DATABASE_URL` = session-pooler рядок (блокер №1).
- `idType` — дефолтний Payload (роутинг сайту по `slug`, не по id → безпечно).
- Конфлікт назв: Payload створює таблиці в `public`. Стара таблиця `tools` зайнята → **після сіду** перейменувати legacy: `tools`→`tools_legacy`, `pending_tools`→`pending_tools_legacy` (щоб Payload володів чистим простором імен). Або тимчасово дати Payload-колекції інший slug, потім вирішити. Узгодити на імплементації.
- Міграції: `npx payload migrate:create`, `npx payload migrate`.

### B3. Сховище медіа — Supabase Storage (S3) у бакет `tool-screenshots`
```ts
import { s3Storage } from '@payloadcms/storage-s3'
// у plugins:
s3Storage({
  collections: {
    media: {
      disablePayloadAccessControl: true,
      generateFileURL: ({ filename, prefix }) =>
        `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.S3_BUCKET}/${prefix ? prefix + '/' : ''}${filename}`,
    },
  },
  bucket: process.env.S3_BUCKET,            // 'tool-screenshots'
  config: {
    endpoint: process.env.S3_ENDPOINT,       // https://<ref>.storage.supabase.co/storage/v1/s3
    region: process.env.S3_REGION,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  },
}),
```
(блокер №2)

### B4. Scaffold + колекції
- Route group `src/app/(payload)/`: `layout.tsx`, `admin/[[...segments]]/page.tsx` (+`not-found.tsx`), `api/[...slug]/route.ts`, `api/graphql/route.ts`, `api/graphql-playground/route.ts`, `custom.scss`.
  Шаблони: `/Users/vladmac/.claude/skills/payload-cms-setup/templates/` (якщо папки немає — згенерувати стандартні Payload-scaffold файли).
- `next.config.ts` → обгорнути у `withPayload(nextConfig)`, **зберегти наявні `remotePatterns`** (вони вже дозволяють `*.supabase.co` і microlink).
- `tsconfig.json` → alias: `"@payload-config": ["./src/payload.config.ts"]`.
- Колекції в `src/collections/`:

  **`Tools.ts`** — поля дзеркалять `src/lib/types.ts` → `interface Tool`:
  - `name` (text), `slug` (text, unique, index), `category` (select з `CATEGORIES` із types.ts), `description` (textarea), `eli5` (textarea), `tags` (array of text), `useCases` (array of text), `priceLabel` (text), `priceType` (select: free/freemium/paid), `websiteUrl` (text), `coverColor` (text)
  - `screenshotUrl` (text) — **канонічне поле, яке читає сайт**; покриває мігровані / recapture / manual URL
  - `screenshotUpload` (upload → Media) — hook (`beforeChange`/`afterChange`) кладе public URL завантаженого файлу у `screenshotUrl`
  - Публікація через **Payload drafts/versions**: `versions: { drafts: true }`. draft = unpublished, published = на сайті. Зберегти `publishedAt`.
  - **Hooks ревалідації** (`afterChange`, `afterDelete`): `revalidatePath('/')` + `revalidatePath('/tools/' + slug)`.

  **`Media.ts`** — upload-колекція (S3 → `tool-screenshots`).

  **`Users.ts`** — auth (email+пароль). `access.create` відкритий до першого адміна → потім закрити на `authenticated`. **Увімкнути API key** (`auth: { useAPIKey: true }`) — для автоматизації (B7).

  **`PendingSubmissions.ts`** — заявки з форми `/submit` + Telegram-черга. Поля з `pending_tools`: дані тула (group або json), `status` (select pending_review/approved/rejected), `source` (select weekly_research/user_submission), `submittedBy` (text), `telegramMsgId` (number).

- Branding: `admin.meta.title = "AI Land CMS"`, `titleSuffix = " — AI Land CMS"`. `src/components/admin/AdminLogo.tsx` + `AdminIcon.tsx` (текстовий wordmark «AI Land» або інлайн логотипа з `public/`). Жодного «Payload» в UI.

### B5. Міграція даних (seed)
`scripts/seed.ts` (`getPayload` + `@payload-config`):
1. Прочитати наявні `tools` (212) і `pending_tools` зі Supabase (сервіс-клієнтом) **або** з бекапу `backups/20260505_095555/tools.json` / `pending_tools.json`.
2. Кожен тул → `payload.create({ collection: 'tools', data, draft: !published })`. Зберегти `slug`, `screenshotUrl` (вже виправлений Частиною A), `publishedAt`.
3. pending → `PendingSubmissions`.
4. `package.json` → `"seed": "cross-env NODE_OPTIONS=--import=tsx/esm tsx scripts/seed.ts"`.
5. Послідовність першого запуску:
   ```bash
   npm run dev                 # відкрити /admin, створити першого адміна
   npx payload generate:types
   npm run seed
   ```
6. Звірити: 212 published у колекції Tools; вибірково кілька сторінок збігаються з сайтом.

### B6. Перепідключення фронтенду на Payload
- Новий `src/lib/tools.ts` на **Payload Local API** (`getPayload({ config })` у RSC): `getTools(page, category)`, `getToolBySlug(slug)`, `getRelatedTools(category, excludeSlug)`, `getTotalCount()`. Мапити Payload-doc → існуючий `Tool` тип (мінімум змін у компонентах; зберегти назву `screenshotUrl`/`screenshot_url` у мапінгу).
- Перевести на нове джерело: `src/app/page.tsx`, `src/app/HomeClient.tsx` (через props), `src/app/tools/[slug]/page.tsx` (+ `generateStaticParams` з Payload), `src/app/api/tools/route.ts`, `src/app/api/search/route.ts`.
- **Пошук:** зараз tsvector RPC `search_tools`. Для v1 — Payload `where` з `like`/`contains` по name/description (простіше, якість нижча). Опційно пізніше — `@payloadcms/plugin-search`. Позначити як можливий downgrade.
- `ToolCard.tsx` / `ToolDetailClient.tsx` лишаються, якщо мапінг збереже поле зображення.

### B7. Перепідключення автоматизації на Payload (узгоджено з B5/B6)
- `automation/bot.js` (approve → publish), `automation/research.js` / `src/app/api/submit-tool/route.ts` (insert pending) зараз пишуть у Supabase через supabase-js.
- Перевести на **Payload REST API** з **API-key** сервісного користувача:
  - submit → `POST /api/pending-submissions`
  - approve (Telegram) → створити/опублікувати Tools-doc (`POST /api/tools` або `PATCH /api/tools/:id?draft=false`)
  - Header: `Authorization: users API-Key <key>`
- Створити сервісного Users з API-key; ключ — в env автоматизації.

### B8. Env / секрети / gitignore
Додати (server-only, без `NEXT_PUBLIC_`):
```
DATABASE_URL=                       # session-pooler рядок Supabase
PAYLOAD_SECRET=                     # openssl rand -base64 32
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
S3_BUCKET=tool-screenshots
S3_ENDPOINT=https://bgfieeapxzuxqusthhvb.storage.supabase.co/storage/v1/s3
S3_REGION=                          # регіон проєкту
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
SUPABASE_URL=https://bgfieeapxzuxqusthhvb.supabase.co   # для generateFileURL
```
- Лишити наявні Supabase-envs (бот/скрипти ще читають до B7).
- `.env.example` — оновити.
- `.gitignore` — додати `payload-types.ts` (і переконатись що `.env*` ігнориться).
- Vercel: `vercel env add` для всіх ключів (production/preview/development).

---

## Карта файлів

**Нові:**
- `automation/recapture-screenshots.js` (Частина A)
- `src/payload.config.ts`
- `src/app/(payload)/…` — layout, admin page, not-found, api routes, custom.scss
- `src/collections/Tools.ts`, `Media.ts`, `Users.ts`, `PendingSubmissions.ts`
- `src/components/admin/AdminLogo.tsx`, `AdminIcon.tsx`
- `scripts/seed.ts`
- `src/lib/tools.ts`

**Редагування:**
- `next.config.ts` (withPayload + лишити remotePatterns)
- `tsconfig.json` (alias @payload-config)
- `src/app/page.tsx`, `HomeClient.tsx`, `tools/[slug]/page.tsx`, `api/tools/route.ts`, `api/search/route.ts` (re-point)
- `automation/bot.js`, `automation/research.js`, `src/app/api/submit-tool/route.ts` (re-point на Payload API)
- `.env.example`, `.gitignore`, `package.json`

**Re-use (не дублювати):**
- `src/lib/types.ts` — `Tool`, `CATEGORIES`
- `src/app/api/submit-tool/route.ts:8-14` — патерн сервіс-клієнта
- `automation/screenshot-service.js:115-131` — контракт upload
- `automation/research.js` — `takeScreenshot` (виклик сервісу)
- скіл `payload-cms-setup/templates/` — scaffold-файли

---

## Гочі / ризики
1. **Payload × Next 16 × React 19 × Turbopack** — головний ризик. Перевірити білд першим (B0).
2. **Connection string** — session pooler (5432), не transaction (6543); SSL обовʼязковий.
3. **Конфлікт назв таблиць** — після сіду перейменувати старі в `*_legacy`.
4. **Масиви** (`tags`/`use_cases`) — Payload зберігає array-поля в окремих таблицях (не `text[]`) → саме тому Payload-native (мігруємо значення).
5. **Пошук** — втрата tsvector-якості при переході на Payload `like`.
6. **Ревалідація** — без hooks зміни в адмінці не зʼявляться на сайті до години.
7. **S3-ключі Supabase** — окремі Storage-S3-ключі, не service-role.
8. **Порядок** — B5 (seed) → B6 (front re-point) → B7 (automation re-point) робити узгоджено; поки B7 не зроблено, Telegram-публікація писатиме у стару таблицю.

---

## Верифікація (фінальний чек-лист)
- [ ] **A:** скріни перезняті, у Storage, `screenshot_url` оновлені, report є
- [ ] **B0:** `npm run build` з Payload без помилок
- [ ] **B-DB:** `npx payload migrate:create` + `migrate` проходять на Supabase (session pooler)
- [ ] **Admin:** `/admin` відкривається, тайтл «AI Land CMS», створено першого адміна
- [ ] **Seed:** 212 published у Tools; вибірково збігаються з сайтом
- [ ] **Front:** `/` і `/tools/{slug}` з Payload; зміна скріна/тексту → видно після ревалідації
- [ ] **Upload:** завантаження картинки в адмінці → обʼєкт у `tool-screenshots` + `screenshotUrl` оновлено
- [ ] **Drafts:** unpublish ховає тул із сайту; publish повертає
- [ ] **Automation:** submit створює PendingSubmissions; Telegram-approve публікує Tools-doc
- [ ] Деплой на Vercel + усі env; прод `/admin` працює

## Поза скоупом (окремо / пізніше)
- Деплой Playwright-сервісу в прод для кнопки «recapture» (зараз — локальним скриптом + редеплой).
- Перенесення інших хардкод-секцій сайту в Payload (advisory-режим скіла).
- Заміна Payload `like`-пошуку на повноцінний (`plugin-search` або Postgres-функція).

---

## Швидкий старт у новому вікні
1. Прочитай цей файл цілком.
2. Зроби **Частину A** (не потребує блокерів).
3. Попроси користувача дати **2 блокери** (connection string + S3-ключі).
4. Роби **Частину B** по порядку B0→B8. Між фазами комітити логічними групами.
5. Звіряйся з чек-листом верифікації.
