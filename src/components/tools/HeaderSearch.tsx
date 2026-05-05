'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface Suggestion {
  id: string
  text: string
}

interface Props {
  suggestions: Suggestion[]
  /** Initial query — if user navigated here with ?q= already set */
  initialQuery?: string
}

const C = {
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

export default function HeaderSearch({ suggestions, initialQuery = '' }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(initialQuery)
  const [focused, setFocused] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync internal state if URL changes externally (e.g. category click clearing q)
  useEffect(() => {
    setValue(searchParams.get('q') ?? '')
  }, [searchParams])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setFocused(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function submit(query: string) {
    const trimmed = query.trim()
    const params = new URLSearchParams(searchParams.toString())
    if (trimmed) params.set('q', trimmed)
    else params.delete('q')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
    setFocused(false)
    inputRef.current?.blur()
  }

  function clear() {
    setValue('')
    submit('')
  }

  function pickSuggestion(s: Suggestion) {
    setValue(s.text)
    submit(s.text)
  }

  const showDropdown = focused && suggestions.length > 0

  return (
    <div ref={wrapperRef} className="relative w-full max-w-[520px]" style={fontSans}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(value)
        }}
        className="relative flex items-center"
        style={{
          background: focused ? C.surface : 'rgba(255,255,255,0.03)',
          border: `1px solid ${focused ? C.borderStrong : C.border}`,
          borderRadius: 999,
          height: 46,
          paddingLeft: 18,
          paddingRight: 6,
          transition: 'background-color 200ms, border-color 200ms',
        }}
      >
        <SearchIcon />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search tools or describe what you need..."
          className="ml-2.5 flex-1 bg-transparent outline-none focus:outline-none focus:ring-0"
          style={{
            ...fontSans,
            fontSize: 14,
            color: C.text,
            caretColor: C.text,
            border: 'none',
            boxShadow: 'none',
          }}
          aria-label="Search tools"
        />
        {value && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="flex items-center justify-center"
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              color: C.textDim,
              background: 'transparent',
              transition: 'background-color 160ms, color 160ms',
              marginRight: 4,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.color = C.text
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = C.textDim
            }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </form>

      {showDropdown && (
        <div
          className="absolute left-0 right-0 z-50"
          style={{
            top: 'calc(100% + 8px)',
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              ...fontMono,
              padding: '14px 18px 8px',
              color: C.textMuted,
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Popular searches
          </div>
          <ul style={{ paddingBottom: 8 }}>
            {suggestions.map((s) => (
              <SuggestionRow key={s.id} text={s.text} onClick={() => pickSuggestion(s)} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function SuggestionRow({ text, onClick }: { text: string; onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="flex w-full items-center text-left"
        style={{
          ...fontSans,
          gap: 12,
          padding: '10px 18px',
          background: hover ? 'rgba(255,255,255,0.04)' : 'transparent',
          color: hover ? '#ffffff' : '#d4d4d8',
          fontSize: 14,
          transition: 'background-color 140ms, color 140ms',
        }}
      >
        <ArrowRightIcon dim={!hover} />
        {text}
      </button>
    </li>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: '#6a6a72', flexShrink: 0 }}>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function ArrowRightIcon({ dim }: { dim: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{ color: dim ? '#6a6a72' : '#ffff57', flexShrink: 0, transition: 'color 140ms' }}
    >
      <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
