import type { MetadataRoute } from 'next'
import { getAllPublishedSlugs } from '@/lib/supabase'

const BASE_URL = 'https://ai.land'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllPublishedSlugs()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/submit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/setup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const toolRoutes: MetadataRoute.Sitemap = slugs.map(slug => ({
    url: `${BASE_URL}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...toolRoutes]
}
