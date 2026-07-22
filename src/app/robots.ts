import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.ailand.gallery'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Службові шляхи не індексуємо (адмінка, API, внутрішні сторінки).
        disallow: ['/admin', '/api/', '/setup', '/style-guide', '/components'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
