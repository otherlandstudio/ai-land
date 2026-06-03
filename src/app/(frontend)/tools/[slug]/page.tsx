import { Suspense } from 'react'
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
        contentSlot={
          hasContent(tool.content) ? <RichText data={tool.content as never} /> : null
        }
      />
    </Suspense>
  )
}
