'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState } from 'react'
import { CATEGORIES } from '@/lib/types'
import { getCategoryColor, cleanDescription } from '@/lib/utils'
import type { Tool } from '@/lib/types'
import FloatingSearch from '@/components/tools/FloatingSearch'
import Pagination from '@/components/tools/Pagination'
import { AppTransitionProvider, useAppTransition } from '@/lib/transition'

interface HomeClientProps {
  tools: Tool[]
  category?: string
  query?: string
  totalCount?: number
  /** Count of tools matching current category+query — used to compute pagination */
  filteredCount?: number
  /** Stable counts per category over the whole catalog — survive filtering */
  categoryCounts?: Record<string, number>
  suggestions?: { id: string; text: string }[]
  page?: number
  pageSize?: number
}

/* ------------------------------------------------------------------ tokens */
const C = {
  bg: '#141414',
  surface: '#15151a',
  surfaceHover: '#1c1c22',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.18)',
  text: '#ffffff',
  textDim: '#a0a0a8',
  textMuted: '#6a6a72',
  yellow: '#ffff57',
}
const fontMono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const
const fontSans = { fontFamily: 'var(--font-inter), ui-sans-serif, system-ui' } as const

export default function HomeClient(props: HomeClientProps) {
  return (
    <AppTransitionProvider>
      <HomeClientInner {...props} />
    </AppTransitionProvider>
  )
}

function HomeClientInner({
  tools,
  category,
  query,
  totalCount = 0,
  filteredCount,
  categoryCounts = {},
  suggestions = [],
  page = 1,
  pageSize = 9,
}: HomeClientProps) {
  const { isPending } = useAppTransition()
  // Prefer the server-computed filtered count (handles q + category accurately).
  // Fallback to category counts or totalCount if not provided.
  const filterTotal =
    filteredCount ??
    (category && categoryCounts[category] != null ? categoryCounts[category] : totalCount)
  const totalPages = Math.max(1, Math.ceil(filterTotal / pageSize))

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100vh', ...fontSans }}>
      {/* Submit button — absolute top-right per Figma 702:2260. Hidden on mobile,
          replaced by floating search pill which is mobile-friendly. */}
      <div className="absolute right-4 top-5 z-30 hidden md:right-[40px] md:block">
        <SubmitToolButton />
      </div>

      <main className="mx-auto px-4 sm:px-6 lg:px-10" style={{ maxWidth: 1440 }}>
        <Hero totalCount={totalCount} />

        <CategoryTabs counts={categoryCounts} />

        {query && (
          <ResultsHeader query={query} category={category} count={tools.length} />
        )}

        <div
          style={{
            opacity: isPending ? 0.4 : 1,
            transition: 'opacity 420ms cubic-bezier(0.4,0,0.2,1)',
            pointerEvents: isPending ? 'none' : 'auto',
          }}
        >
          {tools.length > 0 ? (
            <>
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                style={{ gap: 8, marginTop: 32 }}
              >
                {tools.map((tool) => (
                  <AILandToolCard key={tool.id} tool={tool} />
                ))}
              </div>
              <Pagination current={page} total={totalPages} />
            </>
          ) : (
            <EmptyState query={query} category={category} />
          )}
        </div>
      </main>

      <FloatingSearch suggestions={suggestions} />
    </div>
  )
}

/* ============================================================== SUBMIT BUTTON */

function SubmitToolButton() {
  const [hover, setHover] = useState(false)
  return (
    <Link
      href="/submit"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-flex items-center"
      style={{
        ...fontMono,
        height: 46,
        paddingTop: 12,
        paddingBottom: 14,
        paddingLeft: 20,
        paddingRight: 22,
        borderRadius: 33,
        background: hover ? '#2c2c2c' : '#222222',
        color: '#ffffff',
        fontSize: 14,
        lineHeight: '20px',
        letterSpacing: '0.11em',
        textTransform: 'uppercase',
        fontWeight: 400,
        transition: 'background-color 220ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      Submit your tool
    </Link>
  )
}

/* ============================================================== HERO
   Figma group 702:2257: AI Land logotype + "/ Curated library..." text inline,
   28/32 SemiBold, AI Land in #fff, rest in #898989, container width ~650 → wraps 2 lines. */

function Hero({ totalCount: _totalCount }: { totalCount: number; hideTopWordmark?: boolean }) {
  return (
    <section className="pt-5 pb-20 md:pb-[168px]">
      <h1
        className="text-[22px] leading-[28px] md:text-[28px] md:leading-[32px]"
        style={{
          ...fontSans,
          letterSpacing: 0,
          fontWeight: 600,
          maxWidth: 650,
        }}
      >
        <Link href="/" style={{ color: '#ffffff' }}>AI&nbsp;Land</Link>
        <span style={{ color: '#898989' }}>
          {' '}/ Curated library of AI tools.
          <br />
          Hand-picked and described in plain language.
        </span>
      </h1>
    </section>
  )
}

/* ============================================================== CATEGORY TABS */

function CategoryTabs({ counts }: { counts: Record<string, number> }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { startTransition } = useAppTransition()
  const active = searchParams.get('category') ?? ''

  function select(cat: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (cat === active) params.delete('category')
    else params.set('category', cat)
    params.delete('page')
    startTransition(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }))
  }

  return (
    <div
      className="flex flex-nowrap items-center overflow-x-auto"
      style={{ gap: 28, paddingBottom: 4 }}
    >
      <CategoryTab name="All" active={active === ''} onClick={() => select('')} />
      {CATEGORIES.map((cat) => (
        <CategoryTab
          key={cat}
          name={cat}
          color={getCategoryColor(cat)}
          count={counts[cat]}
          active={active === cat}
          onClick={() => select(cat)}
        />
      ))}
    </div>
  )
}

function CategoryTab({
  name,
  color,
  count,
  active,
  onClick,
}: {
  name: string
  color?: string
  count?: number
  active?: boolean
  onClick: () => void
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-flex shrink-0 items-center whitespace-nowrap"
      style={{
        ...fontSans,
        gap: 10,
        color: active ? '#ffffff' : hover ? '#cfcfcf' : '#898989',
        fontSize: 24,
        fontWeight: 600,
        lineHeight: '32px',
        letterSpacing: 0,
        cursor: 'pointer',
        transition: 'color 200ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {name}
      {color && count !== undefined && count > 0 && (
        <span
          className="inline-flex items-center justify-center"
          style={{
            background: color,
            color: '#141414',
            fontSize: 10,
            fontWeight: 500,
            lineHeight: '14px',
            letterSpacing: '0.04em',
            width: 20,
            height: 20,
            borderRadius: 999,
            ...fontMono,
          }}
        >
          {count}
        </span>
      )}
    </button>
  )
}

/* ============================================================== RESULTS HEADER */

function ResultsHeader({
  query,
  category,
  count,
}: {
  query: string
  category?: string
  count: number
}) {
  return (
    <div
      className="flex flex-wrap items-baseline"
      style={{ marginTop: 8, gap: 10, ...fontSans }}
    >
      <h2
        style={{
          ...fontSans,
          color: C.textDim,
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: 0,
        }}
      >
        Results for &ldquo;<span style={{ color: C.yellow }}>{query}</span>&rdquo;
        <span style={{ color: '#ffffff' }}>
          {' — '}
          {count} {count === 1 ? 'tool' : 'tools'} found
        </span>
        {category && (
          <span style={{ color: C.textDim }}>
            {' '}in <span style={{ color: '#ffffff' }}>{category}</span>
          </span>
        )}
      </h2>
    </div>
  )
}

/* ============================================================== TOOL CARD */

/* Tool card — matches Figma 702:2120
   - Card bg: neutral #222222 on page bg #141414
   - Radius: 24, padding: 32 all sides, 32 bottom
   - Image: 16:10 aspect, radius 12, generous breathing room around
   - Title: 26/32 weight 600
   - Description: 16/24 dim
   - Tag chips: 14px mono, padding 14×10, border, radius 8 */
function AILandToolCard({ tool }: { tool: Tool }) {
  const [hover, setHover] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const color = getCategoryColor(tool.category)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative"
      style={{
        background: hover ? '#2a2a2a' : '#222222',
        borderRadius: 24,
        transition: 'background-color 280ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* External-website arrow — positioned absolute so it sits OUTSIDE
          the <Link>, allowing valid HTML and a separate click target. */}
      {tool.website_url && (
        <a
          href={tool.website_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${tool.name} website`}
          onClick={(e) => e.stopPropagation()}
          className="absolute z-10 flex h-[32px] w-[32px] items-center justify-center rounded-full"
          style={{
            top: 18,
            right: 22,
            color: C.textDim,
            opacity: hover ? 1 : 0,
            background: hover ? 'rgba(255,255,255,0.06)' : 'transparent',
            transform: hover ? 'translate(2px,-2px)' : 'translate(0,0)',
            transition:
              'opacity 200ms cubic-bezier(0.4,0,0.2,1), background-color 200ms cubic-bezier(0.4,0,0.2,1), transform 240ms cubic-bezier(0.4,0,0.2,1)',
            cursor: 'pointer',
            pointerEvents: hover ? 'auto' : 'none',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 11L11 3M5 3h6v6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      )}

      <Link
        href={`/tools/${tool.slug}`}
        className="block"
        style={{
          padding: '20px 24px 24px 24px',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
      {/* category row */}
      <div className="flex items-center justify-between" style={{ marginBottom: 28 }}>
        <div className="inline-flex items-center" style={{ gap: 10 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: color,
              display: 'inline-block',
            }}
          />
          <span
            style={{
              ...fontMono,
              color: C.textDim,
              fontSize: 13,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {tool.category}
          </span>
        </div>
        {/* arrow placeholder — keeps category row balanced; real arrow is above */}
        <span aria-hidden style={{ width: 32, height: 32 }} />
      </div>

      {/* screenshot — 16:10 aspect, INSET from card edges so it isn't flush left/right.
          On hover the WHOLE preview (frame + image) scales 1.10 — real size grows. */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: '16 / 10',
          borderRadius: 12,
          background: '#1f161a',
          marginBottom: 36,
          marginLeft: 16,
          marginRight: 16,
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          transform: hover ? 'scale(1.10)' : 'scale(1)',
          transformOrigin: 'center',
          transition: 'transform 320ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {tool.screenshot_url ? (
          <Image
            src={tool.screenshot_url}
            alt={tool.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAAGElEQVR4nGNkYGBgZGD4z8DAwMDAwMAAAA0ABS0ucYTfAAAAAElFTkSuQmCC"
            onLoad={() => setImgLoaded(true)}
            style={{
              filter: imgLoaded ? 'blur(0)' : 'blur(16px)',
              transform: imgLoaded ? 'scale(1)' : 'scale(1.04)',
              transition: 'filter 600ms cubic-bezier(0.4,0,0.2,1), transform 600ms cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ color: `${color}33`, fontWeight: 700, fontSize: 80 }}
          >
            {tool.name[0]}
          </div>
        )}
      </div>

      {/* title */}
      <h3
        style={{
          ...fontSans,
          color: C.text,
          fontSize: 22,
          lineHeight: '28px',
          letterSpacing: '-0.01em',
          fontWeight: 600,
          marginBottom: 12,
        }}
      >
        {tool.name}
      </h3>

      {/* description */}
      {tool.description && (
        <p
          className="line-clamp-2"
          style={{
            ...fontSans,
            color: C.textDim,
            fontSize: 14,
            lineHeight: '22px',
            marginBottom: 24,
          }}
        >
          {cleanDescription(tool.description)}
        </p>
      )}

      {/* use_cases chips — same data shown on detail page + Telegram caption */}
      {tool.use_cases && tool.use_cases.length > 0 && (
        <div className="flex flex-wrap" style={{ gap: 6 }}>
          {tool.use_cases.slice(0, 3).map((t) => (
            <span
              key={t}
              className="inline-flex items-center"
              style={{
                ...fontMono,
                fontSize: 10,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#9b9b9b',
                border: 'none',
                borderRadius: 6,
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 6,
                paddingBottom: 6,
                background: '#141414',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}
      </Link>
    </div>
  )
}

/* ============================================================== EMPTY STATE */

function EmptyState({ query, category }: { query?: string; category?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { startTransition } = useAppTransition()

  function clearCategory() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    params.delete('page')
    startTransition(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }))
  }

  function clearQuery() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    params.delete('page')
    startTransition(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }))
  }

  const hasQuery = Boolean(query)
  const hasCategory = Boolean(category)
  const inCombo = hasQuery && hasCategory

  return (
    <div
      className="mt-12 flex flex-col items-center justify-center rounded-2xl py-20 text-center"
      style={{ background: C.surface, border: `1px solid ${C.border}`, marginBottom: 120 }}
    >
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="9" cy="9" r="7" stroke={C.textDim} strokeWidth="1.6" />
          <path d="M14 14l6 6" stroke={C.textDim} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="mb-2" style={{ fontSize: 20, fontWeight: 500, color: C.text }}>
        No tools found
      </h3>
      <p style={{ color: C.textDim, fontSize: 14, maxWidth: 420 }}>
        {inCombo && (
          <>
            No results for &ldquo;<span style={{ color: C.text }}>{query}</span>&rdquo; in{' '}
            <span style={{ color: C.text }}>{category}</span>.
          </>
        )}
        {hasQuery && !hasCategory && (
          <>No results for &ldquo;<span style={{ color: C.text }}>{query}</span>&rdquo;. Try different keywords.</>
        )}
        {!hasQuery && hasCategory && <>No tools in this category yet.</>}
        {!hasQuery && !hasCategory && <>No tools yet.</>}
      </p>
      {(inCombo || (hasQuery && !hasCategory)) && (
        <div className="mt-6 flex flex-wrap items-center justify-center" style={{ gap: 10 }}>
          {inCombo && (
            <button
              onClick={clearCategory}
              className="inline-flex items-center rounded-full"
              style={{
                ...fontMono,
                height: 40,
                paddingLeft: 18,
                paddingRight: 18,
                background: '#ffffff',
                color: '#0a0a0c',
                fontSize: 12,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              Search in all categories
            </button>
          )}
          {hasQuery && (
            <button
              onClick={clearQuery}
              className="inline-flex items-center rounded-full"
              style={{
                ...fontMono,
                height: 40,
                paddingLeft: 18,
                paddingRight: 18,
                background: 'transparent',
                color: C.textDim,
                fontSize: 12,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 500,
                border: `1px solid ${C.border}`,
              }}
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  )
}

