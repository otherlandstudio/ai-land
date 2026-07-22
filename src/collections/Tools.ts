import type { CollectionConfig } from 'payload'
import type { PayloadRequest } from 'payload'
import { revalidatePath } from 'next/cache'
import { CATEGORIES } from '../lib/types'
import { categorySlug } from '../lib/categories'

/**
 * Якщо тул має ЗОВНІШНІЙ screenshotUrl (microlink тощо) і немає завантаженого «Фото» —
 * качаємо байти й кладемо в Supabase Media, щоб сайт віддавав НАШ кешований файл,
 * а не генерований наживо microlink. Так усе з Telegram-бота одразу лягає в Supabase.
 *
 * Ставить лише data.screenshotUpload — далі наявний beforeChange будує Supabase-URL.
 * Не кидає помилок: якщо microlink віддав 429/сміття — лишаємо як є (self-healing
 * при наступному збереженні). Працює в serverless — браузер не потрібен, лише fetch.
 */
async function ensureStoredScreenshot(
  data: Record<string, unknown>,
  req: PayloadRequest,
  originalDoc?: { slug?: string } | null,
): Promise<void> {
  if (data.screenshotUpload) return // вже є завантажене фото
  const url = data.screenshotUrl
  if (typeof url !== 'string' || !url) return
  if (url.includes('/storage/v1/object/public/')) return // вже наш Supabase-файл

  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 30_000)
    const res = await fetch(url, { signal: ctrl.signal, redirect: 'follow' })
    clearTimeout(timer)
    if (!res.ok) return

    const mimetype = (res.headers.get('content-type') || '').split(';')[0].trim()
    if (!mimetype.startsWith('image/')) return
    const buffer = Buffer.from(await res.arrayBuffer())
    if (buffer.length < 5 * 1024) return // заглушка/Cloudflare-challenge — лишаємо як є

    const ext = mimetype === 'image/jpeg' ? 'jpg' : mimetype === 'image/webp' ? 'webp' : 'png'
    const slug = (data.slug as string) || originalDoc?.slug || 'tool'
    const media = await req.payload.create({
      collection: 'media',
      data: { alt: (data.name as string) || slug },
      file: { data: buffer, mimetype, name: `${slug}.${ext}`, size: buffer.length },
    })
    data.screenshotUpload = media.id // наявний beforeChange нижче збудує screenshotUrl
  } catch {
    /* мережа / rate-limit → лишаємо наявний screenshotUrl */
  }
}

/**
 * Tools — каталог AI-тулів. Максимально проста форма (Webflow-style):
 *   ① Фото → ② Назва → ③ Короткий опис → ④ Сайт → ⑤ Контент (rich text) → ⑥ Сценарії
 * Мета (категорія / slug / дата / canonical URL) — у сайдбарі.
 *
 * dbName: 'cms_tools' — окрема таблиця, не чіпає legacy `tools`.
 */
export const Tools: CollectionConfig = {
  slug: 'tools',
  dbName: 'cms_tools',
  labels: { singular: 'Тул', plural: 'Тули' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['screenshotUpload', 'name', 'category', '_status'],
    group: 'Каталог',
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: { autosave: false },
    maxPerDoc: 10,
  },
  fields: [
    // ① Фото
    {
      name: 'screenshotUpload',
      label: 'Фото',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Головне зображення тула. Завантаж або заміни — воно одразу на сайті.' },
    },
    // ② Назва
    { name: 'name', label: 'Назва', type: 'text', required: true },
    // ③ Короткий опис
    {
      name: 'description',
      label: 'Короткий опис',
      type: 'textarea',
      admin: { description: 'Одне-два речення для картки й прев’ю.' },
    },
    // ④ Сайт
    { name: 'websiteUrl', label: 'Сайт', type: 'text', admin: { placeholder: 'https://' } },
    // ⑤ Контент (rich text)
    {
      name: 'content',
      label: 'Контент',
      type: 'richText',
      admin: { description: 'Повний опис тула — заголовки, списки, посилання. Як у Webflow.' },
    },
    // ⑥ Сценарії використання (пігулки)
    {
      name: 'useCases',
      label: 'Сценарії використання',
      type: 'text',
      hasMany: true,
      admin: { description: 'Додавай по одному, Enter — щоб підтвердити.' },
    },

    // ───── сайдбар (мета) ─────
    {
      name: 'category',
      label: 'Категорія',
      type: 'select',
      options: CATEGORIES.map((c) => ({ label: c, value: c })),
      admin: { position: 'sidebar' },
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Авто з назви. /tools/<slug>. Не міняти після публікації.',
      },
    },
    {
      name: 'publishedAt',
      label: 'Дата публікації',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'screenshotUrl',
      label: 'URL скріншоту (авто)',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Заповнюється автоматично з «Фото». Це поле читає сайт.',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Авто-slug із назви, якщо порожній.
        if (data && !data.slug && data.name) {
          data.slug = String(data.name)
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }
        return data
      },
    ],
    beforeChange: [
      // ① Зовнішній screenshotUrl (microlink) → завантажити в Supabase Media.
      async ({ data, req, originalDoc }) => {
        if (data) await ensureStoredScreenshot(data, req, originalDoc)
        return data
      },
      // ② Із завантаженого «Фото» будуємо детермінований публічний Supabase-URL.
      async ({ data, req, originalDoc }) => {
        if (data?.screenshotUpload) {
          try {
            const media = await req.payload.findByID({
              collection: 'media',
              id: data.screenshotUpload,
              depth: 0,
            })
            const m = media as { url?: string; filename?: string }
            const base = process.env.SUPABASE_URL
            const bucket = process.env.S3_BUCKET
            // Детерміновано будуємо публічний Supabase-URL (а не відносний /api/media).
            if (m.filename && base && bucket) {
              data.screenshotUrl = `${base}/storage/v1/object/public/${bucket}/${m.filename}`
            } else if (m.url?.startsWith('http')) {
              data.screenshotUrl = m.url
            }
          } catch {
            /* лишаємо наявний screenshotUrl */
          }
        } else if (originalDoc?.screenshotUpload && data && 'screenshotUpload' in data) {
          data.screenshotUrl = null
        }
        if (data?._status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
    afterChange: [
      ({ doc, context }) => {
        if (context?.disableRevalidate) return doc
        try {
          revalidatePath('/')
          if (doc?.slug) revalidatePath(`/tools/${doc.slug}`)
          // Новий/змінений тул → оновити його категорійну сторінку та sitemap.
          if (doc?.category) revalidatePath(`/${categorySlug(doc.category)}`)
          revalidatePath('/sitemap.xml')
        } catch {
          /* поза Next-request scope */
        }
        return doc
      },
    ],
    afterDelete: [
      ({ doc, context }) => {
        if (context?.disableRevalidate) return doc
        try {
          revalidatePath('/')
          if (doc?.slug) revalidatePath(`/tools/${doc.slug}`)
        } catch {
          /* поза Next-request scope */
        }
        return doc
      },
    ],
  },
}
