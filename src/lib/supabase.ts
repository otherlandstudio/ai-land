import { createClient } from '@supabase/supabase-js'
import type { Tool } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Browser client (for client components)
export function createBrowserClient() {
  if (!isConfigured) throw new Error('Supabase env vars not set')
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Server client (for server components and API routes)
export function createServerClient() {
  if (!isConfigured) throw new Error('Supabase env vars not set')
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  })
}

// ── Queries ──────────────────────────────────────────────────

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
  if (!isConfigured) return []
  const supabase = createServerClient()

  // Use the search_tools RPC: weighted FTS (name=A, use_cases=B, description=C, eli5/tags=D)
  // + trigram fallback for typos in tool names. Falls back to plain category browse when no q.
  const { data, error } = await supabase.rpc('search_tools', {
    q: query?.trim() || null,
    cat: category || null,
    result_limit: limit,
    result_offset: offset,
  })

  if (error) {
    console.error('[getTools]', error.message)
    return []
  }
  return (data as Tool[]) ?? []
}

export async function getSearchSuggestions(): Promise<{ id: string; text: string }[]> {
  if (!isConfigured) return []
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('search_suggestions')
    .select('id, text')
    .eq('active', true)
    .order('position', { ascending: true })
    .limit(8)
  if (error || !data) return []
  return data as { id: string; text: string }[]
}

export async function getTool(slug: string): Promise<Tool | null> {
  if (!isConfigured) return null
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) return null
  return data as Tool
}

export async function getRelatedTools(
  category: string,
  excludeSlug: string,
  limit = 3
): Promise<Tool[]> {
  if (!isConfigured) return []
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .neq('slug', excludeSlug)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return (data as Tool[]) ?? []
}

export async function getToolsCount({
  category,
  query,
}: { category?: string; query?: string } = {}): Promise<number> {
  if (!isConfigured) return 0
  const supabase = createServerClient()
  let q = supabase
    .from('tools')
    .select('*', { count: 'exact', head: true })
    .eq('published', true)

  if (category) q = q.eq('category', category)
  if (query?.trim()) {
    // Postgres FTS via the search_vector column maintained by the trigger.
    q = q.textSearch('search_vector', query.trim(), { config: 'english', type: 'websearch' })
  }

  const { count, error } = await q
  if (error) return 0
  return count ?? 0
}

/* For the carousel arrows on the tool-detail page: returns slugs of the previous
   and next tool inside the same category, ordered by published_at. */
export async function getToolNeighbours(
  category: string,
  currentSlug: string,
): Promise<{ prev: string | null; next: string | null }> {
  if (!isConfigured) return { prev: null, next: null }
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('tools')
    .select('slug')
    .eq('published', true)
    .eq('category', category)
    .order('published_at', { ascending: false })

  if (error || !data) return { prev: null, next: null }
  const slugs = (data as Array<{ slug: string }>).map((r) => r.slug)
  const i = slugs.indexOf(currentSlug)
  if (i === -1) return { prev: null, next: null }
  return {
    prev: i > 0 ? slugs[i - 1] : slugs[slugs.length - 1] ?? null,
    next: i < slugs.length - 1 ? slugs[i + 1] : slugs[0] ?? null,
  }
}

/* Returns { category → number of published tools } across the whole table,
   so category-tab badges stay populated even when a filter is applied. */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  if (!isConfigured) return {}
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('tools')
    .select('category')
    .eq('published', true)

  if (error || !data) return {}
  const counts: Record<string, number> = {}
  for (const row of data as Array<{ category: string }>) {
    counts[row.category] = (counts[row.category] || 0) + 1
  }
  return counts
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  if (!isConfigured) return []
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('tools')
      .select('slug')
      .eq('published', true)
    return (data ?? []).map((r: { slug: string }) => r.slug)
  } catch {
    return []
  }
}
