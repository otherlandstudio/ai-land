'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { Tool } from '@/lib/types'
import { getCategoryColor } from '@/lib/utils'
import HelpMeModal from '@/components/tools/HelpMeModal'
import FloatingSearch from '@/components/tools/FloatingSearch'

/* Tool detail page — Figma node 702:2424
   Layout (1440 max width, 64px side padding):
   - top: AI Land wordmark + Submit button
   - hero: tool screenshot 16:9 with prev/next chevrons on each side
   - row: category dot + title + description + tag chips · Visit Website pill (right)
   - yellow CTA banner: Ask AI: How it can help me?
   - More in {Category} N · 3-up related cards
   - footer + floating AI Search pill */

interface Props {
  tool: Tool
  related: Tool[]
  categoryCount: number
  prevSlug: string | null
  nextSlug: string | null
  suggestions?: { id: string; text: string }[]
}

const C = {
  bg: '#141414',
  surface: '#15151a',
  cardBg: '#222222',
  cardBgHover: '#2a2a2a',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.18)',
  text: '#ffffff',
  textDim: '#a0a0a8',
  textMuted: '#6a6a72',
  yellow: '#ffff57',
}
const fontMono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const
const fontSans = { fontFamily: 'var(--font-inter), ui-sans-serif, system-ui' } as const

export default function ToolDetailClient({
  tool,
  related,
  categoryCount,
  prevSlug,
  nextSlug,
  suggestions = [],
}: Props) {
  const [helpOpen, setHelpOpen] = useState(false)
  const color = getCategoryColor(tool.category)

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100vh', ...fontSans }}>
      <HelpMeModal tool={tool} open={helpOpen} onClose={() => setHelpOpen(false)} />
      <FloatingSearch suggestions={suggestions} />

      {/* Wide top row — wordmark left + Submit right (max 1440 page padding 64) */}
      <header
        className="mx-auto flex items-start justify-between"
        style={{
          maxWidth: 1440,
          paddingLeft: 40,
          paddingRight: 40,
          paddingTop: 20,
          paddingBottom: 56,
        }}
      >
        <Link
          href="/"
          style={{
            ...fontSans,
            fontSize: 28,
            lineHeight: '32px',
            fontWeight: 600,
            letterSpacing: 0,
            maxWidth: 650,
          }}
        >
          <span style={{ color: '#ffffff' }}>AI&nbsp;Land</span>
          <span style={{ color: '#898989' }}> / Curated library of AI tools.</span>
        </Link>
        <div className="hidden md:block">
          <SubmitToolButton />
        </div>
      </header>

      {/* Narrow column for HERO + CTA only — 904px per Figma 702:2424.
          The "More in {Category}" related grid below uses the wider container. */}
      <div className="mx-auto px-4 sm:px-6 lg:px-0" style={{ maxWidth: 904 }}>

        {/* HERO CARD — screenshot + info wrapped in a single card.
            « and » arrows live OUTSIDE the card, at page-edge positions.       */}
        <div className="relative">
          {prevSlug && (
            <Link
              href={`/tools/${prevSlug}`}
              aria-label="Previous tool"
              className="absolute top-1/2 z-10 hidden -translate-y-1/2 lg:flex"
              style={{ left: 'calc(492px - 50vw)' }}
            >
              <CarouselArrow direction="prev" />
            </Link>
          )}
          {nextSlug && (
            <Link
              href={`/tools/${nextSlug}`}
              aria-label="Next tool"
              className="absolute top-1/2 z-10 hidden -translate-y-1/2 lg:flex"
              style={{ right: 'calc(492px - 50vw)' }}
            >
              <CarouselArrow direction="next" />
            </Link>
          )}

          <article
            style={{
              background: '#222222',
              borderRadius: 24,
              padding: 36,
            }}
          >
            {/* screenshot — inset from card edges (matches small card style) */}
            <div
              className="relative overflow-hidden"
              style={{
                aspectRatio: '16 / 9',
                borderRadius: 12,
                background: '#1f161a',
                marginBottom: 32,
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
              }}
            >
              {tool.screenshot_url ? (
                <Image
                  src={tool.screenshot_url}
                  alt={tool.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1280px"
                  className="object-cover object-top"
                  priority
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ color: `${color}33`, fontWeight: 700, fontSize: 160 }}
                >
                  {tool.name[0]}
                </div>
              )}
            </div>

            {/* Title row: [category + name] (left) ... [Visit website] (right) — Figma 1948757247 */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-16">
              <div className="min-w-0">
                {/* category */}
                <div className="inline-flex items-center" style={{ gap: 10, marginBottom: 12 }}>
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

                {/* title */}
                <h1
                  style={{
                    ...fontSans,
                    color: C.text,
                    fontSize: 32,
                    lineHeight: '40px',
                    letterSpacing: '-0.02em',
                    fontWeight: 600,
                  }}
                >
                  {tool.name}
                </h1>
              </div>

              {/* right: visit website pill */}
              {tool.website_url && (
                <div className="shrink-0">
                  <VisitWebsiteButton href={tool.website_url} />
                </div>
              )}
            </div>

            {/* description — full width below the title row */}
            {tool.description && (
              <p
                style={{
                  ...fontSans,
                  color: C.textDim,
                  fontSize: 16,
                  lineHeight: '26px',
                  marginTop: 24,
                  maxWidth: 760,
                }}
              >
                {tool.description}
              </p>
            )}

            {/* use cases — chips per Figma 702:2445 (LEAD GENERATION · PRICE MONITORING · …) */}
            {tool.use_cases && tool.use_cases.length > 0 && (
              <div className="flex flex-wrap" style={{ gap: 6, marginTop: 24 }}>
                {tool.use_cases.map((uc) => (
                  <span
                    key={uc}
                    className="inline-flex items-center"
                    style={{
                      ...fontMono,
                      fontSize: 11,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#9b9b9b',
                      background: '#141414',
                      borderRadius: 6,
                      padding: '6px 12px',
                    }}
                  >
                    {uc}
                  </span>
                ))}
              </div>
            )}
          </article>
        </div>

        {/* Yellow Ask AI CTA — below the card, same width */}
        <div style={{ marginTop: 24, marginBottom: 80 }}>
          <AskAIBanner onClick={() => setHelpOpen(true)} />
        </div>
      </div>

      {/* WIDE column — "More in {category}" grid stretches to the full content width */}
      {related.length > 0 && (
        <section
          className="mx-auto px-4 sm:px-6 lg:px-10"
          style={{ maxWidth: 1440, paddingBottom: 120 }}
        >
          <h2
            className="inline-flex items-center"
            style={{
              ...fontSans,
              color: C.text,
              fontSize: 32,
              lineHeight: '40px',
              letterSpacing: '-0.01em',
              fontWeight: 600,
              gap: 12,
              marginBottom: 24,
            }}
          >
            <span style={{ color: C.textDim, fontWeight: 500 }}>More in</span>
            {tool.category}
            <span
              className="inline-flex items-center justify-center rounded-full"
              style={{
                background: color,
                color: '#0a0a0c',
                fontSize: 12,
                fontWeight: 600,
                minWidth: 26,
                height: 24,
                paddingLeft: 8,
                paddingRight: 8,
                ...fontMono,
              }}
            >
              {categoryCount}
            </span>
          </h2>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            style={{ gap: 22 }}
          >
            {related.map((t) => (
              <RelatedCard key={t.id} tool={t} />
            ))}
          </div>
        </section>
      )}

    </div>
  )
}

/* ============================================================== ARROW */

function CarouselArrow({ direction }: { direction: 'prev' | 'next' }) {
  const [hover, setHover] = useState(false)
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex h-[30px] w-[30px] items-center justify-center"
      style={{
        color: hover ? C.text : 'rgba(255,255,255,0.7)',
        transition: 'color 200ms',
      }}
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        style={{ transform: direction === 'next' ? 'rotate(180deg)' : 'none' }}
      >
        <path
          d="M21.25 20L16.25 15L21.25 10M13.75 20L8.75 15L13.75 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
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
        fontWeight: 600,
        transition: 'background-color 220ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      Submit your tool
    </Link>
  )
}

/* ============================================================== VISIT WEBSITE */

function VisitWebsiteButton({ href }: { href: string }) {
  const [hover, setHover] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-flex items-center justify-center gap-2 rounded-full"
      style={{
        ...fontMono,
        height: 50,
        paddingLeft: 24,
        paddingRight: 24,
        background: hover ? '#f0f0f0' : '#ffffff',
        color: '#0a0a0c',
        fontSize: 13,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontWeight: 500,
        transition: 'background-color 220ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      Visit Website
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        style={{
          transform: hover ? 'translate(2px,-2px)' : 'translate(0,0)',
          transition: 'transform 240ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <path d="M3 11L11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  )
}

/* ============================================================== ASK AI BANNER */

function AskAIBanner({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex h-[60px] w-full items-center justify-center gap-2 rounded-full"
      style={{
        ...fontSans,
        background: C.yellow,
        color: '#0a0a0c',
        fontSize: 16,
        fontWeight: 500,
        transition: 'transform 220ms cubic-bezier(0.4,0,0.2,1), filter 220ms',
        transform: hover ? 'translateY(-1px)' : 'translateY(0)',
        filter: hover ? 'brightness(1.05)' : 'none',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M9 1l1.6 4 4 1.3-4 1.3L9 11.5l-1.6-3.9L3.5 6.3l4-1.3L9 1zM14 10.5l.8 1.9 2 .6-2 .6L14 15l-.8-1.9-2-.6 2-.6.8-1.4z"
          fill="currentColor"
        />
      </svg>
      Ask AI: How it can help me?
    </button>
  )
}

/* ============================================================== RELATED CARD
   Same look as the homepage tool card */

function RelatedCard({ tool }: { tool: Tool }) {
  const [hover, setHover] = useState(false)
  const color = getCategoryColor(tool.category)
  return (
    <Link
      href={`/tools/${tool.slug}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="block"
      style={{
        background: hover ? C.cardBgHover : C.cardBg,
        borderRadius: 24,
        padding: 32,
        transition: 'background-color 280ms cubic-bezier(0.4,0,0.2,1), transform 280ms cubic-bezier(0.4,0,0.2,1)',
        transform: hover ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 28 }}>
        <div className="inline-flex items-center" style={{ gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: color }} />
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
        <div
          className="flex h-[32px] w-[32px] items-center justify-center rounded-full"
          style={{
            color: C.textDim,
            opacity: hover ? 1 : 0,
            background: hover ? 'rgba(255,255,255,0.06)' : 'transparent',
            transform: hover ? 'translate(2px,-2px)' : 'translate(0,0)',
            transition:
              'opacity 200ms cubic-bezier(0.4,0,0.2,1), background-color 200ms cubic-bezier(0.4,0,0.2,1), transform 240ms cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 11L11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: '16 / 10',
          borderRadius: 12,
          background: '#1f161a',
          marginBottom: 36,
          marginLeft: 16,
          marginRight: 16,
        }}
      >
        {tool.screenshot_url ? (
          <Image
            src={tool.screenshot_url}
            alt={tool.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover object-top"
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

      <h3
        style={{
          ...fontSans,
          color: C.text,
          fontSize: 26,
          lineHeight: '32px',
          letterSpacing: '-0.01em',
          fontWeight: 600,
          marginBottom: 16,
        }}
      >
        {tool.name}
      </h3>
      {tool.description && (
        <p
          className="line-clamp-2"
          style={{
            ...fontSans,
            color: C.textDim,
            fontSize: 16,
            lineHeight: '24px',
          }}
        >
          {tool.description}
        </p>
      )}
    </Link>
  )
}

