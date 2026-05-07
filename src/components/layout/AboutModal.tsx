'use client'

import { useEffect, useState } from 'react'
import { useScrollLock } from '@/hooks/useScrollLock'

/* About modal — Figma node 702:2408 (Chest' / Дизайн file).
   Frame 708×888, bg #222222, radius 16, padding 32.
   Inner column: 644px wide, sections gap 32, heading→body gap 12.
   Typography: Inter (Figma uses Suisse Intl — closest sans we have).
   - Title: 28 / 32 SemiBold #fff
   - Body: 18 / 28 Regular #fff
   - Section headings: 18 / 22 SemiBold #fff
   - CTA: white bg, radius 56 pill, h 62, dark text 18 SemiBold #141414
   - Close: 38×38 white circle, top right (inside padding).
*/

const C = {
  surface: '#222222',
  text: '#ffffff',
  ctaBg: '#ffffff',
  ctaText: '#141414',
}
const fontSans = { fontFamily: 'var(--font-inter), ui-sans-serif, system-ui' } as const

export default function AboutModal() {
  const [open, setOpen] = useState(false)
  useScrollLock(open)

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('open-about', onOpen)
    return () => window.removeEventListener('open-about', onOpen)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto px-4 py-4 sm:items-center sm:py-8"
      style={{
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        ...fontSans,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false)
      }}
    >
      <div
        className="relative w-full overflow-y-auto overflow-x-hidden"
        style={{
          background: C.surface,
          borderRadius: 16,
          maxHeight: 'calc(100vh - 32px)',
          maxWidth: 708,
          padding: 32,
          color: C.text,
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}
      >
        <CloseButton onClick={() => setOpen(false)} />

        <div className="flex flex-col" style={{ gap: 32 }}>
          {/* Section 1 — title + lead body */}
          <section className="flex flex-col" style={{ gap: 12 }}>
            <h2
              style={{
                ...fontSans,
                fontSize: 28,
                lineHeight: '32px',
                fontWeight: 600,
                letterSpacing: 0,
                color: C.text,
                paddingRight: 56,
              }}
            >
              About AI Land
            </h2>
            <p
              style={{
                ...fontSans,
                fontSize: 18,
                lineHeight: '28px',
                fontWeight: 400,
                color: C.text,
                whiteSpace: 'pre-line',
              }}
            >
              {`AI Land is a curated library of AI tools and startups, designed to help you quickly understand what’s out there and what’s actually useful.

We don’t aim to list everything. Instead, we focus on tools that solve real problems, have clear use cases, and can be applied in real workflows.

Each tool is hand-picked and described in plain language, so you don’t have to spend hours figuring out what it does or whether it’s relevant for you.

It can serve both as a source of inspiration and a practical way to discover tools that can improve how you build and work.`}
            </p>
          </section>

          {/* Section 2 — built for */}
          <section className="flex flex-col" style={{ gap: 12 }}>
            <h3 style={headingStyle}>AI Land is built for:</h3>
            <ul
              style={{
                ...bodyStyle,
                paddingLeft: 24,
                listStyle: 'disc',
              }}
            >
              <li>Product teams exploring AI</li>
              <li>Designers and developers looking for tools</li>
              <li>Founders searching for ideas or leverage</li>
              <li>Anyone looking for inspiration from well-designed AI products</li>
            </ul>
          </section>

          {/* Section 3 — who we are */}
          <section className="flex flex-col" style={{ gap: 12 }}>
            <h3 style={headingStyle}>Who we are</h3>
            <p style={{ ...bodyStyle, whiteSpace: 'pre-line' }}>
              {`AI Land is built by `}
              <a
                href="https://otherland.studio"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#ffff57',
                  textDecoration: 'none',
                }}
              >
                Other Land
              </a>
              {`, a product design studio working with AI and B2B startups.

We spend a lot of time inside complex products, helping teams simplify flows, improve UX, and ship better features.

This library reflects that experience. It’s not just a list of tools, but a curated view on what’s actually useful, well-designed, and worth paying attention to.`}
            </p>
          </section>

          {/* CTA — full-width white pill */}
          <a
            href="https://otherland.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
            style={{
              ...fontSans,
              background: C.ctaBg,
              color: C.ctaText,
              borderRadius: 56,
              height: 62,
              fontSize: 18,
              lineHeight: '28px',
              fontWeight: 600,
              transition: 'background-color 200ms cubic-bezier(0.4,0,0.2,1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f0f0f0'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.ctaBg
            }}
          >
            More about Other Land
          </a>
        </div>
      </div>
    </div>
  )
}

const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter), ui-sans-serif, system-ui',
  fontSize: 18,
  lineHeight: '22px',
  fontWeight: 600,
  color: '#ffffff',
}

const bodyStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter), ui-sans-serif, system-ui',
  fontSize: 18,
  lineHeight: '28px',
  fontWeight: 400,
  color: '#ffffff',
}

function CloseButton({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Close"
      className="absolute flex items-center justify-center"
      style={{
        top: 32,
        right: 32,
        width: 38,
        height: 38,
        borderRadius: 999,
        background: hover ? '#e8e8e8' : '#ffffff',
        color: '#141414',
        transition: 'background-color 180ms',
        cursor: 'pointer',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M1 1l10 10M11 1L1 11"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}
