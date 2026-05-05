import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import {
  getTool,
  getRelatedTools,
  getAllPublishedSlugs,
  getCategoryCounts,
  getToolNeighbours,
  getSearchSuggestions,
} from '@/lib/supabase'
import ToolDetailClient from './ToolDetailClient'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const tool = await getTool(slug)
  if (!tool) return {}
  return {
    title: `${tool.name} — AI Land`,
    description: tool.description ?? undefined,
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

  return (
    <Suspense fallback={null}>
      <ToolDetailClient
        tool={tool}
        related={related}
        categoryCount={categoryCounts[tool.category] ?? related.length + 1}
        prevSlug={neighbours.prev}
        nextSlug={neighbours.next}
        suggestions={suggestions}
      />
    </Suspense>
  )
}
