import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import {
  getTools,
  getToolsCount,
  getCategoryCounts,
  getSearchSuggestions,
} from '@/lib/tools'
import { categoryFromSlug, allCategorySlugs, CATEGORY_SEO } from '@/lib/categories'
import HomeClient from '../HomeClient'

const BASE_URL = 'https://www.ailand.gallery'
const PAGE_SIZE = 27

// SSG для 11 категорій; ISR раз на годину. Невідомі слаги → 404 (dynamicParams=false).
export const revalidate = 3600
export const dynamicParams = false

export function generateStaticParams() {
  return allCategorySlugs().map((category) => ({ category }))
}

interface PageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params
  const cat = categoryFromSlug(slug)
  if (!cat) return {}
  const seo = CATEGORY_SEO[cat]
  const url = `${BASE_URL}/${slug}`
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: url },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName: 'AI Land',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category: slug } = await params
  const cat = categoryFromSlug(slug)
  if (!cat) notFound()

  const sp = await searchParams
  const page = Math.max(1, Number(sp.page ?? 1) || 1)
  const offset = (page - 1) * PAGE_SIZE

  const [tools, totalCount, filteredCount, categoryCounts, suggestions] = await Promise.all([
    getTools({ category: cat, limit: PAGE_SIZE, offset }),
    getToolsCount(),
    getToolsCount({ category: cat }),
    getCategoryCounts(),
    getSearchSuggestions(),
  ])

  return (
    <Suspense fallback={null}>
      <HomeClient
        tools={tools}
        category={cat}
        activeCategory={cat}
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
