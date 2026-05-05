'use client'

import { useState } from 'react'

interface Props {
  onClick: () => void
}

const fontSans = { fontFamily: 'var(--font-inter), ui-sans-serif, system-ui' } as const

/* Floating "AI Search" pill — bottom-center, fixed.
   Figma node 702:2518 — 154×46, cornerRadius 36, translucent gray, sparkle icon + label. */
export default function FloatingSearchPill({ onClick }: Props) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Open search"
      className="fixed inset-x-0 z-[60] mx-auto flex items-center justify-center"
      style={{
        ...fontSans,
        bottom: 24,
        width: 'fit-content',
        height: 46,
        paddingLeft: 22,
        paddingRight: 22,
        gap: 10,
        borderRadius: 36,
        background: hover ? 'rgba(96,96,96,0.55)' : 'rgba(96,96,96,0.4)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 500,
        lineHeight: '24px',
        cursor: 'pointer',
        transition: 'background-color 200ms cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
      }}
    >
      <SearchIcon />
      <span>AI Search</span>
    </button>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
