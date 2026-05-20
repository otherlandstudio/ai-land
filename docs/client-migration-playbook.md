# Client Migration Playbook

Перенос проєкту з наших акаунтів на клієнтські.
Стек: Supabase + GitHub + Vercel + n8n + Telegram + OpenRouter.

> Цей документ — чек-ліст. Деталі/помилки — у `MIGRATION-LOG.md`.

---

## Pre-flight (до першого дотику)

🔴 **Усі сервіси клієнта на ОДНОМУ email.** Інакше Vercel форсить Pro-план і hand-off ламається.

Клієнт має створити/підготувати:
- [ ] Supabase project (порожній) — потрібен `project_ref`
- [ ] GitHub org або personal account
- [ ] Vercel team
- [ ] Telegram bot через @BotFather → token
- [ ] Telegram channel + бот як admin → `chat_id`
- [ ] OpenRouter акаунт з funding → API key
- [ ] Доступ до DNS домену

Ми робимо:
- [ ] Backup нашої Supabase (data + schema + storage manifest)
- [ ] Export n8n workflows (JSON)
- [ ] Архів `.env.local`
- [ ] Scan git history на витоки: `git ls-files | grep -iE '\.env|secret|key|token'` + gitleaks

---

## Phase 0 — Backup нашої інфри ✅

1. Через Supabase MCP зняти: `tools`, `pending_tools`, `suggestions`, RLS, функції, тригери, міграції.
2. Записати у `backups/<timestamp>/` як JSON + SQL.
3. Перевірити Storage **не** через `count(*)`, а sample колонок `screenshot_url` / `image_url` — URL може дивитися назовні (у нас усе на microlink, bucket порожній).
4. Schema drift check: `pg_trigger` + `pg_proc` vs міграції — знайти orphan тригери / missing колонки.

---

## Phase 1 — Supabase ✅

1. Підключити Supabase MCP до клієнтського org.
2. Якщо клієнт уже створив порожній проєкт — використати його (не плодити дубль).
3. Накотити міграції в правильному порядку + drift fix (у нас — додати колонку `best_for`, дропнути orphan trigger).
4. **Restore даних:** REST API + `service_role` + bulk POST з `Prefer: resolution=ignore-duplicates`.
   *(MCP `execute_sql` для bulk DML > 50 рядків — задорого по контексту.)*
5. Оновити локальний `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — пишемо програмно
   - `SUPABASE_SERVICE_ROLE_KEY` — клієнт сам вставляє в editor (не в чат)
   - **Закрити редактор перед `Write`**, інакше TextEdit перепише наш файл своїм буфером.
6. Smoke test: `npm run dev` → `/tools/<slug>` рендериться → `/api/search?q=...` повертає дані.

---

## Phase 2 — GitHub ✅

1. Якщо у клієнта **інший email** на GitHub vs Supabase/Vercel — Phase 2 **відкласти на кінець**, поки робити на нашому репо.
2. Перевірити що в історії немає секретів (`git ls-files | grep ...`). Якщо є — очистити перед push.
3. Зробити clean копію без: `vercel-env.txt`, dev `*.png`, `seed.js`, `.claude/`, бекапів.
4. Додати `.env.example` (порожні placeholders) + повний `.gitignore`.
5. `gh auth switch` на клієнтський акаунт → `gh auth setup-git` → `git remote set-url origin https://...` (HTTPS, не SSH).
6. Initial commit + push.
7. Старе репо: локальний tag `archive/pre-migration-<date>` + remote `castolo-backup` як backup.

---

## Phase 3 — Vercel ✅

1. Клієнт у своєму Vercel UI: **Add New Project → Import Git Repository** → клієнтський репо.
2. Якщо CLI залогінений під нашим акаунтом, а Vercel team — клієнтський (split auth):
   - Згенерувати `vercel-env-import.txt` локально (читати service_role з `.env.local` через bash, **не echo в чат**).
   - Клієнт перетягує файл у Vercel UI → Environment Variables → Import .env.
3. Trigger redeploy → перевірити `/api/tools` (повертає рядки), `/api/search?q=...` (релевант).
4. ⚠️ Hobby tier — флаг для апгрейду на Pro **до публічного запуску** (TOS).

---

## Phase 5 prep ✅ (Phase 5 не закрита)

1. `automation/.env` оновлено на новий Supabase URL + service_role.
2. Backup старих значень → `automation/.env.bak-pre-migration`.

---

## ⏭ Що далі (наступні етапи)

- [ ] **Phase 5 — n8n:** оновити Supabase credential у n8n UI → Test → run Pipeline 1/2/3 end-to-end.
- [ ] **Phase 6 — Telegram:** новий bot через @BotFather, новий канал, оновити `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHANNEL_ID` в Vercel + n8n.
- [ ] **Phase 7 — OpenRouter:** новий акаунт + funding, оновити `OPENROUTER_API_KEY` в Vercel + n8n.
- [ ] **Phase 8 — Cutover:** DNS на `otherland.studio`, 24h моніторинг, паузити старий Supabase, revoke старі ключі.

Phase 4 (screenshot service hosting) — **пропущено**, microlink покриває.

---

## Грабли (не наступати вдруге)

- `gh auth login` без `gh auth setup-git` → push fail.
- SSH remote без ключів → `Permission denied (publickey)`. Дефолт — HTTPS.
- TextEdit з відкритим файлом → `Write` мовчки втрачається при save.
- MCP `execute_sql` для bulk insert → жере контекст, краще REST API.
- `count(*)` зі Storage не каже всю правду — перевіряй URL у колонках.
- Split-email клієнта → Phase 2/3 ламаються мід-флайт. Питати **до старту**.
- Vercel Hobby ≠ commercial use.
