'use client'

import { useState } from 'react'

const TOKENS = {
  surface: '#f0eeea',
  surface2: '#eae6de',
  surface4: '#0f0f0e',
  stroke: '#d3d2c4',
  accent: '#db4601',
  yellow: '#ffff1a',
  pink: '#f5b0d2',
  text: '#000000',
  textDim: '#525252',
}

const sgStyle = {
  fontFamily: 'var(--sg-font-body), Inter, system-ui, sans-serif',
} as const

const displayFont = {
  fontFamily: 'var(--sg-font-display), Inter, system-ui, sans-serif',
} as const

export default function StyleGuidePage() {
  return (
    <main
      className="relative z-10 min-h-screen bg-white text-black"
      style={sgStyle}
    >
      <div className="mx-auto max-w-[1280px] px-10 py-20">
        <Header />
        <Section num="01" title="Typography">
          <Typography />
        </Section>
        <Section num="02" title="Buttons & CTAs" desc="All interactive states. Hover the elements to see transitions.">
          <ButtonsSection />
        </Section>
        <Section num="03" title="Filter chips" desc="Three states: active / default / hover.">
          <FilterChipsSection />
        </Section>
        <Section num="04" title="Side navigation" desc="Works component — Default, Hover, Active, icon.">
          <SideNavSection />
        </Section>
        <Section num="05" title="Cards" desc="Blog card with hover state.">
          <CardsSection />
        </Section>
        <Section num="06" title="FAQ Item" desc="Default / Hover × Open / Closed. Click to expand.">
          <FAQSection />
        </Section>
        <Section num="07" title="Domains accordion" desc="State × opened — large content accordion. Click rows to toggle.">
          <DomainsSection />
        </Section>
        <footer className="mt-32 border-t border-[#e5e5e5] pt-8 text-sm" style={{ color: TOKENS.textDim }}>
          Otherland — Style Guide. Source: Figma · Page 6 / Components.
          Production header font: Handil Pro Medium (preview uses Inter Tight as a near-substitute).
        </footer>
      </div>
    </main>
  )
}

/* ---------- Page chrome ---------- */

function Header() {
  return (
    <header className="mb-24">
      <div className="mb-3 text-xs uppercase tracking-[0.2em]" style={{ color: TOKENS.textDim }}>
        Otherland · Redesign
      </div>
      <h1 className="text-[88px] font-medium leading-[0.95] tracking-[-0.02em]" style={displayFont}>
        Style Guide
      </h1>
      <p className="mt-6 max-w-2xl text-base" style={{ color: TOKENS.textDim }}>
        Living reference for the redesign. Every component below is the actual React implementation —
        hover, focus and active states are wired up so you can see the transitions in motion.
      </p>
    </header>
  )
}

function Section({
  num,
  title,
  desc,
  children,
}: {
  num: string
  title: string
  desc?: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-24 border-t border-[#e5e5e5] pt-12">
      <div className="mb-10">
        <div className="mb-3 text-xs uppercase tracking-[0.2em]" style={{ color: TOKENS.textDim }}>
          Section {num}
        </div>
        <h2 className="text-[44px] font-medium leading-[1.05] tracking-[-0.02em]" style={displayFont}>
          {title}
        </h2>
        {desc ? (
          <p className="mt-3 max-w-2xl text-base" style={{ color: TOKENS.textDim }}>
            {desc}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

/* ---------- 01 Typography ---------- */

function Typography() {
  const headers: Array<{ name: string; size: number; lh: number; ls: number; sample: string }> = [
    { name: 'H1', size: 62, lh: 1.0, ls: -0.02, sample: 'Senior design, embedded.' },
    { name: 'H2', size: 48, lh: 1.06, ls: -0.02, sample: 'Backed by product and design leads.' },
    { name: 'H3', size: 28, lh: 1.06, ls: -0.02, sample: 'Section heading example for the redesign.' },
    { name: 'H4', size: 24, lh: 1.2, ls: -0.02, sample: 'Card title for case studies and articles.' },
  ]
  const body: Array<{ name: string; size: number; lh: number; ls: number; weight: number; sample: string }> = [
    { name: 'B2 / Regular', size: 16, lh: 1.26, ls: 0, weight: 400, sample: 'We work with founders and product teams to embed senior design directly inside their workflow.' },
    { name: 'B2 / Medium', size: 16, lh: 1.26, ls: -0.01, weight: 500, sample: 'Senior designer embedded in your team within 1–2 weeks.' },
    { name: 'B3 / Regular', size: 14, lh: 1.0, ls: 0, weight: 400, sample: 'Caption · metadata · author · date · tag' },
  ]
  return (
    <div>
      <SubLabel>Headers — Handil Pro Medium (preview: Inter Tight)</SubLabel>
      <div className="divide-y divide-[#e5e5e5]">
        {headers.map((h) => (
          <div key={h.name} className="flex gap-10 py-6">
            <Meta
              label={h.name}
              spec={`${h.size}px / ${(h.lh * 100).toFixed(0)}% / LS ${(h.ls * 100).toFixed(0)}%`}
            />
            <div
              className="flex-1 font-medium"
              style={{
                ...displayFont,
                fontSize: `${h.size}px`,
                lineHeight: h.lh,
                letterSpacing: `${h.ls}em`,
              }}
            >
              {h.sample}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <SubLabel>Body — Inter</SubLabel>
        <div className="divide-y divide-[#e5e5e5]">
          {body.map((b) => (
            <div key={b.name} className="flex gap-10 py-6">
              <Meta
                label={b.name}
                spec={`${b.size}px / ${(b.lh * 100).toFixed(0)}% / LS ${(b.ls * 100).toFixed(0)}%`}
              />
              <div
                className="flex-1"
                style={{
                  fontSize: `${b.size}px`,
                  lineHeight: b.lh,
                  letterSpacing: `${b.ls}em`,
                  fontWeight: b.weight,
                }}
              >
                {b.sample}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 text-base font-medium">{children}</div>
  )
}

function Meta({ label, spec }: { label: string; spec: string }) {
  return (
    <div className="w-[300px] shrink-0">
      <div className="text-base font-medium">{label}</div>
      <div className="mt-1 font-mono text-xs" style={{ color: TOKENS.textDim }}>{spec}</div>
    </div>
  )
}

/* ---------- 02 Buttons ---------- */

function ButtonsSection() {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
      <Demo name="Button — primary" id="702:2671">
        <ButtonPrimary>Book a call</ButtonPrimary>
      </Demo>
      <Demo name="Button — Book intro call (avatar)" id="702:2676">
        <ButtonIntroCall>Book an intro call</ButtonIntroCall>
      </Demo>
      <Demo name="Button — More works (large CTA)" id="702:2977" wide>
        <ButtonMoreWorks>More works</ButtonMoreWorks>
      </Demo>
    </div>
  )
}

function Demo({
  name,
  id,
  wide,
  children,
}: {
  name: string
  id: string
  wide?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={wide ? 'md:col-span-2' : ''}>
      <div className="mb-3 flex items-baseline justify-between">
        <div className="text-base font-medium">{name}</div>
        <div className="font-mono text-xs" style={{ color: TOKENS.textDim }}>{id}</div>
      </div>
      <div
        className="flex min-h-[180px] items-center justify-center rounded-2xl border p-10"
        style={{ background: TOKENS.surface, borderColor: TOKENS.stroke }}
      >
        {children}
      </div>
    </div>
  )
}

function ButtonPrimary({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="rounded-full px-7 py-4 text-base font-medium text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-[#252525] active:scale-[0.98]"
      style={{ background: TOKENS.surface4 }}
    >
      {children}
    </button>
  )
}

function ButtonIntroCall({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="group flex items-center gap-4 rounded-full pr-7 text-base font-medium text-white transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
      style={{ background: TOKENS.surface4 }}
    >
      <span
        className="flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:rotate-[-6deg]"
        style={{
          background: `linear-gradient(135deg, ${TOKENS.pink} 0%, #c47fa1 100%)`,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="7" r="3.2" fill="rgba(15,15,14,0.9)" />
          <path d="M3 18c1.4-3.2 4-4.8 7-4.8s5.6 1.6 7 4.8" stroke="rgba(15,15,14,0.9)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <span>{children}</span>
    </button>
  )
}

function ButtonMoreWorks({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="group flex w-full items-center justify-between rounded-2xl border-2 px-8 py-7 text-2xl font-medium transition-all duration-300 ease-out hover:bg-black hover:text-white"
      style={{ borderColor: TOKENS.surface4, color: TOKENS.surface4 }}
    >
      <span style={displayFont}>{children}</span>
      <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-current transition-transform duration-300 ease-out group-hover:rotate-45">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  )
}

/* ---------- 03 Filter chips ---------- */

function FilterChipsSection() {
  const [active, setActive] = useState('All')
  const items = ['All', 'Product', 'Branding', 'Web', 'AI']
  return (
    <Demo name="types — filter chips" id="702:2949" wide>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <Chip key={it} active={active === it} onClick={() => setActive(it)}>
            {it}
          </Chip>
        ))}
      </div>
    </Demo>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ease-out"
      style={{
        background: active ? TOKENS.surface4 : 'transparent',
        color: active ? '#ffffff' : TOKENS.surface4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: active ? TOKENS.surface4 : TOKENS.stroke,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = TOKENS.surface2
          e.currentTarget.style.borderColor = TOKENS.surface4
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderColor = TOKENS.stroke
        }
      }}
    >
      {children}
    </button>
  )
}

/* ---------- 04 Side navigation (Works) ---------- */

function SideNavSection() {
  const [active, setActive] = useState('All works')
  const items = [
    { name: 'All works', icon: false },
    { name: 'Product', icon: false },
    { name: 'Branding', icon: false },
    { name: 'Insights', icon: true },
  ]
  return (
    <Demo name="Works — side navigation" id="702:2527" wide>
      <nav className="w-[260px]">
        <ul className="space-y-1">
          {items.map((it) => (
            <li key={it.name}>
              <button
                onClick={() => setActive(it.name)}
                className="group flex w-full items-center justify-between rounded-xl px-4 py-3 text-base transition-all duration-200 ease-out"
                style={{
                  background: active === it.name ? TOKENS.surface4 : 'transparent',
                  color: active === it.name ? '#ffffff' : TOKENS.surface4,
                  fontWeight: active === it.name ? 500 : 400,
                }}
                onMouseEnter={(e) => {
                  if (active !== it.name) e.currentTarget.style.background = TOKENS.surface2
                }}
                onMouseLeave={(e) => {
                  if (active !== it.name) e.currentTarget.style.background = 'transparent'
                }}
              >
                <span>{it.name}</span>
                {it.icon ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </Demo>
  )
}

/* ---------- 05 Cards ---------- */

function CardsSection() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Demo name="Blog card — hover state" id="702:2578">
        <BlogCard
          title="The case for embedded design"
          subtitle="Sep 2026 · 6 min"
        />
      </Demo>
      <Demo name="Blog card — full" id="702:2589">
        <BlogCard
          title="How AI workflows changed our delivery"
          subtitle="Aug 2026 · 8 min"
          full
        />
      </Demo>
    </div>
  )
}

function BlogCard({
  title,
  subtitle,
  full,
}: {
  title: string
  subtitle: string
  full?: boolean
}) {
  return (
    <a
      href="#"
      className="group block w-full max-w-[420px] rounded-2xl border p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
      style={{
        borderColor: TOKENS.stroke,
        background: full ? TOKENS.surface2 : '#ffffff',
      }}
    >
      <div className="text-sm" style={{ color: TOKENS.textDim }}>{subtitle}</div>
      <div
        className="mt-2 text-xl font-medium leading-tight transition-colors duration-200 group-hover:text-[#db4601]"
        style={displayFont}
      >
        {title}
      </div>
      <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
        Read article
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transition-transform duration-200 group-hover:translate-x-1">
          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </a>
  )
}

/* ---------- 06 FAQ ---------- */

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)
  const items = [
    {
      q: 'What is an embedded designer?',
      a: 'A senior designer who joins your team in 1–2 weeks, attends standups, picks up tickets and ships work end-to-end — without the overhead of hiring full-time.',
    },
    {
      q: 'How do you measure success?',
      a: 'We agree on outcomes upfront — usually shipping velocity, design quality bar, and team satisfaction — and review them every two weeks.',
    },
    {
      q: 'Can we replace our existing in-house designer?',
      a: 'No. We embed alongside your existing team and elevate their work. If you have no designer yet, we can be the first one until you scale up.',
    },
    {
      q: 'What does pricing look like?',
      a: 'Flat monthly fee per embedded designer. No retainers, no scope creep, no surprises.',
    },
  ]
  return (
    <Demo name="FAQItem — accordion with hover" id="702:2593" wide>
      <ul className="w-full space-y-3">
        {items.map((it, i) => (
          <FAQRow
            key={it.q}
            question={it.q}
            answer={it.a}
            isOpen={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
          />
        ))}
      </ul>
    </Demo>
  )
}

function FAQRow({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <li
      className="group rounded-2xl border transition-all duration-200 ease-out hover:border-black"
      style={{ borderColor: TOKENS.stroke, background: '#ffffff' }}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span className="text-xl font-medium" style={displayFont}>{question}</span>
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ease-out"
          style={{
            borderColor: TOKENS.surface4,
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div
        className="grid overflow-hidden px-6 transition-all duration-300 ease-out"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          opacity: isOpen ? 1 : 0,
          paddingBottom: isOpen ? 20 : 0,
        }}
      >
        <div className="min-h-0">
          <p className="text-base" style={{ color: TOKENS.textDim }}>{answer}</p>
        </div>
      </div>
    </li>
  )
}

/* ---------- 07 Domains accordion ---------- */

const DOMAINS: Array<{
  name: string
  count: number
  projects: Array<{ name: string; desc: string; year: string }>
}> = [
  {
    name: 'B2B SaaS',
    count: 7,
    projects: [
      { name: 'Asper', desc: 'AI platform for planning purchases', year: '2026' },
      { name: 'Cricut', desc: 'Software for cutting machines', year: '2022 – ongoing' },
      { name: 'Sides', desc: 'SaaS platform for restaurant management', year: '2022–2024' },
      { name: 'eAuthor', desc: 'Business learning and training materials', year: '2023' },
      { name: 'Accessia', desc: 'Open cloud physical security platform', year: '2023' },
      { name: 'Sells AI', desc: 'AI-powered sales widgets', year: '2022' },
      { name: 'B Lunch', desc: 'Corporate food ordering platform', year: '2021' },
    ],
  },
  { name: 'Fintech', count: 3, projects: [
    { name: 'Stockpile', desc: 'Investing platform', year: '2024' },
    { name: 'RAKBank', desc: 'Mobile banking experience', year: '2023' },
    { name: 'Migros Bank', desc: 'Web & mobile banking redesign', year: '2022' },
  ]},
  { name: 'Consumer', count: 2, projects: [
    { name: 'DRESSX', desc: 'Digital fashion marketplace', year: '2024' },
    { name: 'Beanz', desc: 'Loyalty rewards app', year: '2023' },
  ]},
  { name: 'AI', count: 2, projects: [
    { name: 'Persona AI', desc: 'AI persona builder for product teams', year: '2025' },
    { name: 'Sells AI', desc: 'AI-powered sales widgets', year: '2022' },
  ]},
]

function DomainsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  return (
    <Demo name="Domains — accordion" id="702:2879" wide>
      <ul className="w-full divide-y" style={{ borderColor: TOKENS.stroke, borderTopWidth: 1, borderBottomWidth: 1 } as React.CSSProperties}>
        {DOMAINS.map((d, i) => (
          <DomainRow
            key={d.name}
            domain={d}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </ul>
    </Demo>
  )
}

function DomainRow({
  domain,
  isOpen,
  onToggle,
}: {
  domain: (typeof DOMAINS)[number]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <li className="group transition-colors duration-200 hover:bg-[#f7f5f0]">
      <button onClick={onToggle} className="flex w-full items-center justify-between py-5 text-left">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-medium" style={displayFont}>{domain.name}</span>
          <span
            className="flex h-7 min-w-[28px] items-center justify-center rounded-md px-1.5 text-xs font-medium text-white"
            style={{ background: TOKENS.surface4 }}
          >
            {domain.count}
          </span>
        </div>
        <span
          className="flex h-8 w-8 items-center justify-center transition-transform duration-300 ease-out"
          style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div
        className="grid overflow-hidden transition-all duration-300 ease-out"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
        }}
      >
        <div className="min-h-0">
          <ul className="pb-5">
            {domain.projects.map((p) => (
              <li
                key={p.name}
                className="grid grid-cols-[200px_1fr_auto_120px] items-center gap-6 py-2.5 text-base transition-colors duration-200 hover:text-[#db4601]"
              >
                <span className="font-medium">{p.name}</span>
                <span style={{ color: TOKENS.textDim }}>{p.desc}</span>
                <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: TOKENS.textDim }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  action
                </span>
                <span className="text-right text-sm" style={{ color: TOKENS.textDim }}>{p.year}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  )
}
