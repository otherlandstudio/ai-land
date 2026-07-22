import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import {
  getTool,
  getRelatedTools,
  getCategoryCounts,
  getToolNeighbours,
  getSearchSuggestions,
} from '@/lib/tools'
import ToolDetailClient from './ToolDetailClient'

// Простий тип lexical-стану для перевірки «чи є контент».
type LexicalState = { root?: { children?: unknown[] } }
function hasContent(c: unknown): c is LexicalState {
  return Boolean(
    c && typeof c === 'object' && (c as LexicalState).root?.children?.length,
  )
}

export const revalidate = 3600
// ISR on-demand: не пре-рендеримо всі тули на білді (це били б ~223 запити у
// віддалену Supabase й упирались у ліміт конектів). Сторінка будується при
// першому заході та кешується на `revalidate`. dynamicParams=true (дефолт).
export const dynamicParams = true

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const tool = await getTool(slug)
  if (!tool) return {}

  // Абсолютний www-URL — головний хост (non-www 307-редіректить на www),
  // узгоджено з sitemap і category-сторінками.
  const url = `https://www.ailand.gallery/tools/${slug}`
  const title = `${tool.name} — AI Land`
  const description = tool.description ?? undefined
  // OG-зображення — реальний скріншот тула з Supabase; fallback на сайтовий OG.
  const ogImage = tool.screenshot_url || '/og-image.png'

  return {
    title,
    description,
    // Кожен тул сам-канонічний (раніше успадковував canonical головної з layout).
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'AI Land',
      images: [{ url: ogImage, alt: tool.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params
  const tool = await getTool(slug)
  if (!tool) notFound()

  const [related, categoryCounts, neighbours, suggestions] = await Promise.all([
    getRelatedTools(tool.category, slug),
    getCategoryCounts(),
    getToolNeighbours(tool.category, slug),
    getSearchSuggestions(),
  ])

  // Structured data (schema.org) — допомагає Google розуміти сторінку як AI-тул.
  // Поля лише реальні; undefined автоматично випадають при JSON.stringify.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description ?? undefined,
    applicationCategory: tool.category || undefined,
    url: `https://www.ailand.gallery/tools/${slug}`,
    image: tool.screenshot_url ?? undefined,
    sameAs: tool.website_url ?? undefined,
  }

  return (
    <Suspense fallback={null}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolDetailClient
        tool={tool}
        related={related}
        categoryCount={categoryCounts[tool.category] ?? related.length + 1}
        prevSlug={neighbours.prev}
        nextSlug={neighbours.next}
        suggestions={suggestions}
        contentSlot={
          hasContent(tool.content) ? <RichText data={tool.content as never} /> : null
        }
      />
    </Suspense>
  )
}
