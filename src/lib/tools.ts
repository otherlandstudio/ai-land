import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'
import type { Tool } from './types'

/**
 * Шар даних на Payload Local API (замінює прямі запити в Supabase).
 * Повертає той самий тип `Tool` (snake_case), тож компоненти не міняються.
 *
 * getSearchSuggestions лишається на Supabase (таблиця search_suggestions
 * не мігрована в Payload) — ре-експортуємо нижче.
 */

let _payload: Awaited<ReturnType<typeof getPayload>> | null = null
async function payload() {
  if (!_payload) _payload = await getPayload({ config })
  return _payload
}

const PUBLISHED = { _status: { equals: 'published' } }

type Doc = {
  id: string | number
  name: string
  slug: string
  category?: string | null
  description?: string | null
  useCases?: (string | null)[] | null
  websiteUrl?: string | null
  screenshotUrl?: string | null
  content?: unknown
  _status?: string | null
  createdAt: string
  publishedAt?: string | null
}

function mapTool(doc: Doc): Tool {
  return {
    id: String(doc.id),
    name: doc.name,
    slug: doc.slug,
    category: doc.category ?? '',
    description: doc.description ?? null,
    eli5: null,
    tags: [],
    use_cases: (doc.useCases ?? []).filter((v): v is string => Boolean(v)),
    price_label: null,
    price_type: null,
    website_url: doc.websiteUrl ?? null,
    cover_color: null,
    screenshot_url: doc.screenshotUrl ?? null,
    content: doc.content ?? null,
    published: doc._status === 'published',
    submitted_by_user: false,
    created_at: doc.createdAt,
    published_at: doc.publishedAt ?? null,
  }
}

export async function getTools({
  category,
  query,
  limit = 40,
  offset = 0,
}: {
  category?: string
  query?: string
  limit?: number
  offset?: number
} = {}): Promise<Tool[]> {
  const p = await payload()
  const where: Where = { ...PUBLISHED }
  if (category) where.category = { equals: category }
  const q = query?.trim()
  if (q) {
    where.or = [
      { name: { like: q } },
      { description: { like: q } },
      { eli5: { like: q } },
    ]
  }
  const res = await p.find({
    collection: 'tools',
    where,
    limit,
    page: Math.floor(offset / Math.max(limit, 1)) + 1,
    sort: '-publishedAt',
    depth: 0,
  })
  return (res.docs as unknown as Doc[]).map(mapTool)
}

export async function getTool(slug: string): Promise<Tool | null> {
  const p = await payload()
  const res = await p.find({
    collection: 'tools',
    where: { ...PUBLISHED, slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const doc = res.docs[0] as unknown as Doc | undefined
  return doc ? mapTool(doc) : null
}

export async function getRelatedTools(
  category: string,
  excludeSlug: string,
  limit = 3,
): Promise<Tool[]> {
  const p = await payload()
  const res = await p.find({
    collection: 'tools',
    where: {
      ...PUBLISHED,
      category: { equals: category },
      slug: { not_equals: excludeSlug },
    },
    sort: '-publishedAt',
    limit,
    depth: 0,
  })
  return (res.docs as unknown as Doc[]).map(mapTool)
}

export async function getToolsCount({
  category,
  query,
}: { category?: string; query?: string } = {}): Promise<number> {
  const p = await payload()
  const where: Where = { ...PUBLISHED }
  if (category) where.category = { equals: category }
  const q = query?.trim()
  if (q) {
    where.or = [
      { name: { like: q } },
      { description: { like: q } },
      { eli5: { like: q } },
    ]
  }
  const res = await p.count({ collection: 'tools', where })
  return res.totalDocs
}

export async function getToolNeighbours(
  category: string,
  currentSlug: string,
): Promise<{ prev: string | null; next: string | null }> {
  const p = await payload()
  const res = await p.find({
    collection: 'tools',
    where: { ...PUBLISHED, category: { equals: category } },
    sort: '-publishedAt',
    limit: 1000,
    depth: 0,
    pagination: false,
  })
  const slugs = (res.docs as unknown as Doc[]).map((d) => d.slug)
  const i = slugs.indexOf(currentSlug)
  if (i === -1) return { prev: null, next: null }
  return {
    prev: i > 0 ? slugs[i - 1] : slugs[slugs.length - 1] ?? null,
    next: i < slugs.length - 1 ? slugs[i + 1] : slugs[0] ?? null,
  }
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const p = await payload()
  const res = await p.find({
    collection: 'tools',
    where: PUBLISHED,
    limit: 1000,
    depth: 0,
    pagination: false,
    select: { category: true },
  })
  const counts: Record<string, number> = {}
  for (const d of res.docs as unknown as Doc[]) {
    if (d.category) counts[d.category] = (counts[d.category] || 0) + 1
  }
  return counts
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  try {
    const p = await payload()
    const res = await p.find({
      collection: 'tools',
      where: PUBLISHED,
      limit: 1000,
      depth: 0,
      pagination: false,
      select: { slug: true },
    })
    return (res.docs as unknown as Doc[]).map((d) => d.slug)
  } catch {
    return []
  }
}

// search_suggestions ще на Supabase — ре-експорт, щоб консьюмери імпортували все звідси.
export { getSearchSuggestions } from './supabase'
