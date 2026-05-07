'use client'

import { useEffect, useState } from 'react'
import { useScrollLock } from '@/hooks/useScrollLock'

/* Privacy modal — same surface tokens as About modal (Figma 702:2408).
   No dedicated Figma frame yet — copy is an AI-drafted starting point,
   designed for a curated AI-tools directory hosted on Vercel + Supabase.
*/

const C = {
  surface: '#222222',
  text: '#ffffff',
  yellow: '#ffff57',
}
const fontSans = { fontFamily: 'var(--font-inter), ui-sans-serif, system-ui' } as const

export default function PrivacyModal() {
  const [open, setOpen] = useState(false)
  useScrollLock(open)

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('open-privacy', onOpen)
    return () => window.removeEventListener('open-privacy', onOpen)
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
          <section className="flex flex-col" style={{ gap: 12 }}>
            <h2
              style={{
                ...fontSans,
                fontSize: 28,
                lineHeight: '32px',
                fontWeight: 600,
                letterSpacing: 0,
                paddingRight: 56,
              }}
            >
              Privacy Policy
            </h2>
            <p style={metaStyle}>Last updated: May 7, 2026</p>
            <p style={bodyStyle}>
              AI Land is a small, curated directory of AI tools, run by{' '}
              <a
                href="https://otherland.studio"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: C.yellow, textDecoration: 'none' }}
              >
                Other Land
              </a>
              . We try to collect as little data as possible. This page explains what
              we do collect and why.
            </p>
          </section>

          <section className="flex flex-col" style={{ gap: 12 }}>
            <h3 style={headingStyle}>What we collect</h3>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyle: 'disc' }}>
              <li>
                <strong style={strong}>Anonymous usage analytics</strong> — pages
                viewed, country, browser, device type. We use this to understand which
                tools and categories are useful. No personal information is attached.
              </li>
              <li>
                <strong style={strong}>Cookies</strong> — only the minimum needed for
                the site to work (no third-party advertising or tracking cookies).
              </li>
              <li>
                <strong style={strong}>Submission data</strong> — if you submit a tool
                via the Submit form, we store the data you provide (tool name, URL,
                description, tags, optional contact email).
              </li>
            </ul>
          </section>

          <section className="flex flex-col" style={{ gap: 12 }}>
            <h3 style={headingStyle}>How we use it</h3>
            <p style={{ ...bodyStyle, whiteSpace: 'pre-line' }}>
              {`We use anonymous analytics to improve the directory — to learn which categories matter most and which tool descriptions land well.

Submission data is used only to review and (if accepted) publish the tool on AI Land. We may contact the submitter if we have a clarifying question.

We do not sell, rent or share user data with third parties for marketing.`}
            </p>
          </section>

          <section className="flex flex-col" style={{ gap: 12 }}>
            <h3 style={headingStyle}>Third-party services we rely on</h3>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyle: 'disc' }}>
              <li>
                <strong style={strong}>Vercel</strong> — hosting & basic request logs.
              </li>
              <li>
                <strong style={strong}>Supabase</strong> — database for tool entries
                and submission records.
              </li>
              <li>
                <strong style={strong}>OpenAI / Claude / Perplexity</strong> — only
                when <em>you</em> click &quot;Open in&quot; to launch a prompt; we
                don&apos;t send anything to these services on our own.
              </li>
            </ul>
          </section>

          <section className="flex flex-col" style={{ gap: 12 }}>
            <h3 style={headingStyle}>Your rights</h3>
            <p style={{ ...bodyStyle, whiteSpace: 'pre-line' }}>
              {`You can request a copy of any data we hold about you, ask us to correct it, or ask us to delete it. We aim to respond within 14 days.

If you submitted a tool and want it removed from the directory, just write to us with the tool name and the email you used.`}
            </p>
          </section>

          <section className="flex flex-col" style={{ gap: 12 }}>
            <h3 style={headingStyle}>Contact</h3>
            <p style={bodyStyle}>
              For any privacy-related question, write to{' '}
              <a
                href="mailto:hello@otherland.studio"
                style={{ color: C.yellow, textDecoration: 'none' }}
              >
                hello@otherland.studio
              </a>
              .
            </p>
          </section>
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

const metaStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono), ui-monospace, monospace',
  fontSize: 12,
  lineHeight: '20px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#a0a0a8',
  marginBottom: 4,
}

const strong: React.CSSProperties = { fontWeight: 600 }

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
