import { Suspense } from 'react'
import {
  getTools,
  getToolsCount,
  getCategoryCounts,
  getSearchSuggestions,
} from '@/lib/supabase'
import HomeClient from './HomeClient'
import ToolCardSkeleton from '@/components/tools/ToolCardSkeleton'

export const revalidate = 3600

const PAGE_SIZE = 27

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>
}

function ToolGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ToolCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page ?? 1) || 1)
  const offset = (page - 1) * PAGE_SIZE

  const [tools, totalCount, filteredCount, categoryCounts, suggestions] = await Promise.all([
    getTools({
      category: params.category,
      query: params.q,
      limit: PAGE_SIZE,
      offset,
    }),
    getToolsCount(),
    getToolsCount({ category: params.category, query: params.q }),
    getCategoryCounts(),
    getSearchSuggestions(),
  ])

  return (
    <Suspense fallback={<ToolGridSkeleton />}>
      <HomeClient
        tools={tools}
        category={params.category}
        query={params.q}
        totalCount={totalCount}
        filteredCount={filteredCount}
        categoryCounts={categoryCounts}
        suggestions={suggestions}
        page={page}
        pageSize={PAGE_SIZE}
      />
    </Suspense>
  )
}
