import type { MetadataRoute } from 'next'
import { getAllPublishedSlugs } from '@/lib/tools'
import { allCategorySlugs } from '@/lib/categories'

// Генеруємо на запит (рантайм), не на білді — щоб білд не чіпав БД.
// Нові тули з Telegram-бота потрапляють у sitemap автоматично (динамічний рендер).
export const dynamic = 'force-dynamic'

const BASE_URL = 'https://www.ailand.gallery'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllPublishedSlugs()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/submit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = allCategorySlugs().map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }))

  const toolRoutes: MetadataRoute.Sitemap = slugs.map(slug => ({
    url: `${BASE_URL}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes]
}
