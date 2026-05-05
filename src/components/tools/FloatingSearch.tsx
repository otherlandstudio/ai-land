'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Tool } from '@/lib/types'
import { getCategoryColor } from '@/lib/utils'
import { useAppTransition } from '@/lib/transition'

interface Suggestion {
  id: string
  text: string
}

interface Props {
  suggestions?: Suggestion[]
}

const C = {
  text: '#ffffff',
  textDim: '#a0a0a8',
  textMuted: '#6a6a72',
  border: 'rgba(255,255,255,0.08)',
  surface: '#1a1a1a',
}
const fontSans = { fontFamily: 'var(--font-inter), ui-sans-serif, system-ui' } as const
const fontMono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const

/* Bottom-anchored search that expands in place — no jumping.
   Collapsed: small "AI Search" pill (Figma 702:2518).
   Expanded: wide pill input + suggestions/results stacked ABOVE it growing upward.
   Outside click or Escape collapses it back. */
export default function FloatingSearch({ suggestions = [] }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { startTransition } = useAppTransition()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Tool[]>([])
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cmd+K toggles
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Outside click
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  // Focus input when opening
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    } else {
      setQuery('')
      setResults([])
    }
  }, [open])

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.tools ?? [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setQuery(v)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(v), 300)
  }

  function submit(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('q', trimmed)
    params.delete('page')
    startTransition(() => router.push(`/?${params.toString()}`, { scroll: false }))
    setOpen(false)
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit(query)
    }
  }

  const hasQuery = query.trim().length > 0
  const showSuggestions = open && !hasQuery && suggestions.length > 0
  const showResults = open && results.length > 0

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-x-0 z-[60] mx-auto flex flex-col items-center"
      style={{
        bottom: 24,
        width: 'fit-content',
        maxWidth: 'min(640px, calc(100vw - 32px))',
        ...fontSans,
      }}
    >
      {/* Suggestions / Results panel — appears ABOVE the input, growing upward */}
      {(showSuggestions || showResults) && (
        <div
          className="w-full overflow-hidden"
          style={{
            marginBottom: 10,
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 24,
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            maxHeight: 'min(60vh, 480px)',
            overflowY: 'auto',
          }}
        >
          {showSuggestions && (
            <>
              <div
                style={{
                  ...fontMono,
                  padding: '14px 24px 8px',
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
                  <SuggestionRow key={s.id} text={s.text} onClick={() => submit(s.text)} />
                ))}
              </ul>
            </>
          )}

          {showResults &&
            results.map((tool) => (
              <SearchResultRow
                key={tool.id}
                tool={tool}
                color={getCategoryColor(tool.category)}
                onClose={() => setOpen(false)}
              />
            ))}
        </div>
      )}

      {/* The pill itself — collapses/expands in place. No layout jump. */}
      {open ? <ExpandedPill
        inputRef={inputRef}
        query={query}
        loading={loading}
        onChange={handleChange}
        onKey={handleKey}
        onSubmit={() => submit(query)}
        onClose={() => setOpen(false)}
      /> : <CollapsedPill onClick={() => setOpen(true)} />}
    </div>
  )
}

function CollapsedPill({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Open search"
      className="flex items-center justify-center"
      style={{
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

function ExpandedPill({
  inputRef,
  query,
  loading,
  onChange,
  onKey,
  onSubmit,
  onClose,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>
  query: string
  loading: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKey: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onSubmit: () => void
  onClose: () => void
}) {
  return (
    <div
      className="flex items-center"
      style={{
        width: 'min(640px, calc(100vw - 32px))',
        height: 56,
        paddingLeft: 22,
        paddingRight: 6,
        gap: 12,
        borderRadius: 36,
        background: 'rgba(36,36,36,0.92)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
      }}
    >
      <SearchIcon />
      <input
        ref={inputRef}
        value={query}
        onChange={onChange}
        onKeyDown={onKey}
        placeholder="AI Search tools or describe what you need…"
        className="flex-1 bg-transparent outline-none focus:outline-none focus:ring-0"
        style={{
          ...fontSans,
          fontSize: 16,
          color: '#ffffff',
          caretColor: '#ffffff',
          height: 32,
          border: 'none',
          boxShadow: 'none',
        }}
      />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="flex items-center justify-center"
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          color: 'rgba(255,255,255,0.7)',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onSubmit}
        aria-label="Search"
        className="flex items-center justify-center"
        style={{
          width: 44,
          height: 44,
          borderRadius: 999,
          background: '#ffffff',
          color: '#141414',
          cursor: 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: '#ffffff', flexShrink: 0 }}>
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
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
          padding: '10px 24px',
          background: hover ? 'rgba(255,255,255,0.04)' : 'transparent',
          color: hover ? '#ffffff' : '#d4d4d8',
          fontSize: 14,
          transition: 'background-color 140ms, color 140ms',
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{ color: hover ? '#ffff57' : '#6a6a72', flexShrink: 0, transition: 'color 140ms' }}
        >
          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {text}
      </button>
    </li>
  )
}

function SearchResultRow({
  tool,
  color,
  onClose,
}: {
  tool: Tool
  color: string
  onClose: () => void
}) {
  const [hover, setHover] = useState(false)
  return (
    <Link
      href={`/tools/${tool.slug}`}
      onClick={onClose}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex items-center"
      style={{
        ...fontSans,
        gap: 14,
        padding: '14px 24px',
        background: hover ? 'rgba(255,255,255,0.04)' : 'transparent',
        borderBottom: `1px solid ${C.border}`,
        transition: 'background-color 160ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <span
        className="shrink-0"
        style={{ width: 8, height: 8, borderRadius: 999, background: color }}
      />
      <div className="min-w-0 flex-1">
        <div
          className="truncate"
          style={{ color: C.text, fontSize: 15, fontWeight: 500, letterSpacing: '-0.01em' }}
        >
          {tool.name}
        </div>
        <div className="truncate" style={{ color: C.textDim, fontSize: 12, marginTop: 2 }}>
          {tool.description}
        </div>
      </div>
    </Link>
  )
}
