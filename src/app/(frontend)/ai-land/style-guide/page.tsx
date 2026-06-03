'use client'

import { useState } from 'react'

/* AI Land — Style Guide
   Source: Figma EGHpyw3BfFgVioOCbKWHzK · node 702:3022
   Standalone dark-theme style guide for the AI Land directory project. */

const C = {
  bg: '#0a0a0c',
  bgRaised: '#111114',
  surface: '#15151a',
  surfaceHover: '#1c1c22',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.18)',
  text: '#ffffff',
  textDim: '#a0a0a8',
  textMuted: '#6a6a72',
  yellow: '#ffff57',
  ink: '#0a0a0c',
}

const fontMono = { fontFamily: 'var(--ai-font-mono), ui-monospace, monospace' } as const
const fontSans = { fontFamily: 'var(--ai-font-sans), ui-sans-serif, system-ui' } as const

/* ============================================================== PAGE */

export default function AiLandStyleGuide() {
  return (
    <main
      className="min-h-screen"
      style={{ background: C.bg, color: C.text, ...fontSans }}
    >
      <div className="mx-auto max-w-[1280px] px-8 pb-32 pt-12">
        <Header />

        <Group label="Buttons">
          <Section title="Visit Website (primary, white pill)">
            <RowGap>
              <ButtonVisitWebsite />
              <ButtonVisitWebsite forceHover />
            </RowGap>
          </Section>

          <Section title="Submit Your Tool (ghost, dark with light border)">
            <RowGap>
              <ButtonSubmitTool />
              <ButtonSubmitTool forceHover />
            </RowGap>
          </Section>

          <Section title="Icon buttons (close × · pagination chevrons)">
            <RowGap>
              <IconCircleButton icon="close" />
              <IconCircleButton icon="close" forceHover />
              <IconCircleButton icon="prev" />
              <IconCircleButton icon="next" />
              <IconCircleButton icon="first" />
              <IconCircleButton icon="last" />
            </RowGap>
          </Section>
        </Group>

        <Group label="Filter pills">
          <Section title="AI Search filter pill (default · active)">
            <RowGap>
              <FilterPill>AI Search</FilterPill>
              <FilterPill active>AI Search</FilterPill>
            </RowGap>
          </Section>
        </Group>

        <Group label="Search">
          <Section title="Search input (full-width · with circular search button)">
            <SearchInput placeholder="AI Search tools or describe what you need…" />
            <SearchInput placeholder="AI Search tools or describe what you need…" filled="ChatGPT alternative" />
          </Section>
        </Group>

        <Group label="Promo CTA">
          <Section title="Ask AI banner (yellow pill with sparkle)">
            <AskAIBanner />
          </Section>
        </Group>

        <Group label="Pagination">
          <Section title="Numbered pagination (dark squares · selected ring)">
            <PaginationRow />
          </Section>
        </Group>

        <Group label="Category tabs">
          <Section title="Filter tabs with colored dots (All · Finance · Lifestyle · …)">
            <CategoryTabs />
          </Section>
        </Group>

        <Group label="Tool cards">
          <Section title="Tool card grid (3-up)">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ToolCard
                category="PRODUCTIVITY"
                categoryColor="#5dd87a"
                title="Whisper Flow"
                description="Whisper Flow provides advanced speech-to-text dictation with high accuracy for real-time transcription."
                tags={['LEAD GENERATION', 'PRICE MONITORING', 'CONTACT SCRAPING']}
                thumb="grid-1"
              />
              <ToolCard
                category="SALES"
                categoryColor="#c084fc"
                title="n8n"
                description="n8n is a no-code platform for building AI workflow automations connecting various apps and services."
                tags={['LEAD GENERATION', 'PRICE MONITORING', 'CONTACT SCRAPING']}
                thumb="grid-2"
              />
              <ToolCard
                category="MARKETING"
                categoryColor="#5dd87a"
                title="Tobira.ai"
                description="AI tool designed to enhance productivity through advanced voice and text interactions."
                tags={['LEAD GENERATION', 'PRICE MONITORING', 'CONTACT SCRAPING']}
                thumb="grid-3"
              />
            </div>
          </Section>
        </Group>

        <Group label="Footer">
          <Section title="Site footer (text-only links)">
            <SiteFooter />
          </Section>
        </Group>

        <PageMeta />
      </div>
    </main>
  )
}

/* ============================================================== HEADER */

function Header() {
  return (
    <header className="mb-16 flex items-end justify-between border-b pb-8" style={{ borderColor: C.border }}>
      <div>
        <div
          className="mb-3 text-[12px] uppercase tracking-[0.18em]"
          style={{ ...fontMono, color: C.textMuted }}
        >
          Style Guide / Components
        </div>
        <h1
          className="text-[64px] leading-[1.05] tracking-[-0.02em]"
          style={{ ...fontSans, fontWeight: 500, color: C.text }}
        >
          AI&nbsp;Land
        </h1>
        <p className="mt-3 max-w-[560px] text-[15px] leading-[1.5]" style={{ color: C.textDim }}>
          Dark theme directory of AI tools. This page collects all atoms,
          buttons, inputs and card patterns so the rest of the site can stay consistent.
        </p>
      </div>
      <div className="text-right text-[11px] uppercase tracking-[0.12em]" style={{ ...fontMono, color: C.textMuted }}>
        Figma · 702:3022
      </div>
    </header>
  )
}

/* ============================================================== LAYOUT HELPERS */

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-20">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-[28px] leading-tight tracking-[-0.01em]" style={{ fontWeight: 500 }}>
          {label}
        </h2>
      </div>
      <div className="flex flex-col gap-12">{children}</div>
    </section>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4 text-[12px] uppercase tracking-[0.12em]" style={{ ...fontMono, color: C.textMuted }}>
        {title}
      </div>
      <div
        className="rounded-2xl p-8"
        style={{ background: C.bgRaised, border: `1px solid ${C.border}` }}
      >
        {children}
      </div>
    </div>
  )
}

function RowGap({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-4">{children}</div>
}

/* ============================================================== BUTTONS */

function ButtonVisitWebsite({ forceHover }: { forceHover?: boolean }) {
  const [hover, setHover] = useState(false)
  const isHover = forceHover || hover
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-flex h-[46px] items-center gap-2 rounded-full px-6"
      style={{
        ...fontMono,
        background: isHover ? '#f0f0f0' : '#ffffff',
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
          transform: isHover ? 'translate(2px,-2px)' : 'translate(0,0)',
          transition: 'transform 240ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <path d="M3 11L11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

function ButtonSubmitTool({ forceHover }: { forceHover?: boolean }) {
  const [hover, setHover] = useState(false)
  const isHover = forceHover || hover
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-flex h-[46px] items-center rounded-full px-6"
      style={{
        ...fontMono,
        background: isHover ? 'rgba(255,255,255,0.04)' : 'transparent',
        color: C.text,
        fontSize: 13,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontWeight: 500,
        border: `1px solid ${isHover ? C.borderStrong : C.border}`,
        transition: 'background-color 220ms cubic-bezier(0.4,0,0.2,1), border-color 220ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      Submit your tool
    </button>
  )
}

function IconCircleButton({
  icon,
  forceHover,
}: {
  icon: 'close' | 'prev' | 'next' | 'first' | 'last'
  forceHover?: boolean
}) {
  const [hover, setHover] = useState(false)
  const isHover = forceHover || hover
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={icon}
      className="flex h-[38px] w-[38px] items-center justify-center rounded-full"
      style={{
        background: isHover ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isHover ? C.borderStrong : C.border}`,
        color: C.text,
        transition: 'background-color 200ms, border-color 200ms',
      }}
    >
      {icon === 'close' ? (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ) : icon === 'prev' || icon === 'next' ? (
        <svg
          width="12"
          height="10"
          viewBox="0 0 12 10"
          fill="none"
          style={{
            transform: icon === 'prev' ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path d="M1 5h10M7 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg
          width="12"
          height="10"
          viewBox="0 0 12 10"
          fill="none"
          style={{
            transform: icon === 'first' ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path d="M1 5h10M5 1l4 4-4 4M2 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

/* ============================================================== FILTER PILL */

function FilterPill({
  children,
  active,
}: {
  children: React.ReactNode
  active?: boolean
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-flex h-[32px] items-center gap-2 rounded-full px-4"
      style={{
        ...fontSans,
        background: active ? '#2a2a30' : hover ? 'rgba(255,255,255,0.04)' : 'transparent',
        border: `1px solid ${active ? 'transparent' : C.border}`,
        color: active ? C.text : C.textDim,
        fontSize: 13,
        transition: 'background-color 200ms, color 200ms, border-color 200ms',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {children}
    </button>
  )
}

/* ============================================================== SEARCH INPUT */

function SearchInput({
  placeholder,
  filled,
}: {
  placeholder: string
  filled?: string
}) {
  const [value, setValue] = useState(filled || '')
  const [focused, setFocused] = useState(false)
  return (
    <div
      className="mb-4 flex h-[56px] w-full items-center rounded-full pr-1.5"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${focused ? C.borderStrong : C.border}`,
        paddingLeft: 20,
        transition: 'border-color 200ms',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 12, color: C.textDim }}>
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="h-full flex-1 bg-transparent outline-none"
        style={{
          ...fontSans,
          fontSize: 15,
          color: C.text,
        }}
      />
      {value && (
        <button
          onClick={() => setValue('')}
          aria-label="Clear"
          className="mr-2 flex h-7 w-7 items-center justify-center rounded-full"
          style={{ color: C.textDim, transition: 'color 180ms' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.textDim)}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
      <button
        aria-label="Search"
        className="flex h-[44px] w-[44px] items-center justify-center rounded-full"
        style={{
          background: '#ffffff',
          color: '#0a0a0c',
          transition: 'background-color 180ms',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f0f0')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

/* ============================================================== ASK AI BANNER */

function AskAIBanner() {
  const [hover, setHover] = useState(false)
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex h-[48px] w-full items-center justify-center gap-2 rounded-full"
      style={{
        ...fontSans,
        background: C.yellow,
        color: '#0a0a0c',
        fontSize: 14,
        fontWeight: 500,
        transition: 'transform 220ms cubic-bezier(0.4,0,0.2,1), filter 220ms',
        transform: hover ? 'translateY(-1px)' : 'translateY(0)',
        filter: hover ? 'brightness(1.05)' : 'none',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 1l1.4 3.4 3.6 1.1-3.6 1.1L8 10l-1.4-3.4L3 5.5l3.6-1.1L8 1zM12.5 9l.7 1.7 1.8.5-1.8.5L12.5 13l-.7-1.7-1.8-.5 1.8-.5.7-1.3z"
          fill="currentColor"
        />
      </svg>
      Ask AI: How it can help me?
    </button>
  )
}

/* ============================================================== PAGINATION */

function PaginationRow() {
  const [active, setActive] = useState(2)
  const items = [1, 2, 3, 4, 5, 6, '...', 23] as const
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((p, i) => (
        <PageNumber
          key={`${p}-${i}`}
          value={typeof p === 'number' ? String(p) : p}
          active={typeof p === 'number' && p === active}
          onClick={typeof p === 'number' ? () => setActive(p) : undefined}
        />
      ))}
    </div>
  )
}

function PageNumber({
  value,
  active,
  onClick,
}: {
  value: string
  active?: boolean
  onClick?: () => void
}) {
  const [hover, setHover] = useState(false)
  const interactive = !!onClick
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={!interactive}
      className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl"
      style={{
        ...fontMono,
        background: hover && interactive ? C.surfaceHover : C.surface,
        border: `1px solid ${active ? C.text : C.border}`,
        color: C.text,
        fontSize: 18,
        cursor: interactive ? 'pointer' : 'default',
        transition: 'background-color 200ms, border-color 200ms',
      }}
    >
      {value}
    </button>
  )
}

/* ============================================================== CATEGORY TABS */

const CATEGORIES: Array<{ name: string; color?: string; count?: string }> = [
  { name: 'All' },
  { name: 'Finance', color: '#3b82f6', count: '12' },
  { name: 'Lifestyle', color: '#f59e0b', count: '8' },
  { name: 'Social', color: '#8b5cf6', count: '6' },
  { name: 'Portfolio', color: '#9ca3af', count: '4' },
  { name: 'Shopping', color: '#10b981', count: '7' },
  { name: 'Productivity', color: '#ec4899', count: '14' },
  { name: 'Finance', color: '#3b82f6', count: '5' },
  { name: 'Lifestyle', color: '#10b981', count: '9' },
  { name: 'Social', color: '#f59e0b', count: '3' },
]

function CategoryTabs() {
  const [active, setActive] = useState(0)
  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
      {CATEGORIES.map((c, i) => (
        <CategoryTab
          key={`${c.name}-${i}`}
          name={c.name}
          color={c.color}
          count={c.count}
          active={active === i}
          onClick={() => setActive(i)}
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
  count?: string
  active?: boolean
  onClick?: () => void
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-flex items-center gap-2"
      style={{
        ...fontSans,
        color: active || hover ? C.text : C.textDim,
        fontSize: 17,
        transition: 'color 200ms',
      }}
    >
      {name}
      {color && (
        <span
          className="inline-flex h-[20px] min-w-[24px] items-center justify-center rounded-full px-1.5"
          style={{
            background: color,
            color: '#0a0a0c',
            fontSize: 11,
            fontWeight: 600,
            ...fontMono,
          }}
        >
          {count}
        </span>
      )}
    </button>
  )
}

/* ============================================================== TOOL CARD */

function ToolCard({
  category,
  categoryColor,
  title,
  description,
  tags,
  thumb,
}: {
  category: string
  categoryColor: string
  title: string
  description: string
  tags: string[]
  thumb: 'grid-1' | 'grid-2' | 'grid-3'
}) {
  const [hover, setHover] = useState(false)
  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="rounded-2xl p-4"
      style={{
        background: hover ? C.surfaceHover : C.surface,
        border: `1px solid ${C.border}`,
        transition: 'background-color 240ms cubic-bezier(0.4,0,0.2,1), transform 240ms cubic-bezier(0.4,0,0.2,1)',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* header row: category + arrow */}
      <div className="mb-3 flex items-center justify-between">
        <div className="inline-flex items-center gap-2">
          <span style={{ width: 7, height: 7, borderRadius: 999, background: categoryColor, display: 'inline-block' }} />
          <span
            className="uppercase tracking-[0.1em]"
            style={{ ...fontMono, color: C.textDim, fontSize: 11 }}
          >
            {category}
          </span>
        </div>
        <div
          className="flex h-[28px] w-[28px] items-center justify-center rounded-full"
          style={{
            color: C.textDim,
            background: hover ? 'rgba(255,255,255,0.06)' : 'transparent',
            transition: 'background-color 200ms, transform 200ms',
            transform: hover ? 'translate(2px,-2px)' : 'translate(0,0)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 9L9 3M5 3h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* thumbnail */}
      <div
        className="mb-5 aspect-[4/3] w-full overflow-hidden rounded-xl"
        style={{
          background: thumb === 'grid-1'
            ? 'linear-gradient(135deg, #1a1a24 0%, #2a2a3a 100%)'
            : thumb === 'grid-2'
              ? 'linear-gradient(135deg, #0e1a14 0%, #1c2a22 100%)'
              : 'linear-gradient(135deg, #1a1422 0%, #281c30 100%)',
          border: `1px solid ${C.border}`,
        }}
      >
        <ThumbMock variant={thumb} />
      </div>

      {/* title + description */}
      <h3
        className="mb-2 leading-[1.2]"
        style={{ ...fontSans, color: C.text, fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em' }}
      >
        {title}
      </h3>
      <p style={{ ...fontSans, color: C.textDim, fontSize: 13, lineHeight: 1.5 }}>
        {description}
      </p>

      {/* tags */}
      <div className="mt-5 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center rounded-md px-2.5 py-1.5 uppercase tracking-[0.06em]"
            style={{
              ...fontMono,
              fontSize: 10,
              color: C.textDim,
              border: `1px solid ${C.border}`,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  )
}

function ThumbMock({ variant }: { variant: 'grid-1' | 'grid-2' | 'grid-3' }) {
  // simple decorative inner UI hint that reads like a screenshot placeholder
  const lines = variant === 'grid-1' ? 6 : variant === 'grid-2' ? 5 : 7
  return (
    <div className="flex h-full w-full flex-col gap-1.5 p-4" style={{ opacity: 0.55 }}>
      <div
        className="h-3 w-1/3 rounded"
        style={{ background: 'rgba(255,255,255,0.4)' }}
      />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-1.5 rounded"
          style={{
            width: `${50 + ((i * 17) % 45)}%`,
            background: 'rgba(255,255,255,0.18)',
          }}
        />
      ))}
    </div>
  )
}

/* ============================================================== FOOTER */

function SiteFooter() {
  return (
    <div className="flex items-center justify-between" style={{ ...fontSans }}>
      <div style={{ color: C.textDim, fontSize: 14 }}>
        About <span style={{ color: C.textMuted }}>•</span> Privacy Policy{' '}
        <span style={{ color: C.textMuted }}>•</span> LinkedIn{' '}
        <span style={{ color: C.textMuted }}>•</span> Submit ↗
      </div>
      <div style={{ color: C.textMuted, fontSize: 14 }}>
        Crafted by Other Land studio
      </div>
    </div>
  )
}

function PageMeta() {
  return (
    <footer
      className="mt-24 border-t pt-8 text-[12px]"
      style={{ ...fontMono, borderColor: C.border, color: C.textMuted, letterSpacing: '0.06em' }}
    >
      AI LAND · STYLE GUIDE · FIGMA EGHpyw3BfFgVioOCbKWHzK · NODE 702:3022
    </footer>
  )
}
