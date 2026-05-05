'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import type { Tool } from '@/lib/types'
import { getCategoryColor } from '@/lib/utils'
import { useScrollLock } from '@/hooks/useScrollLock'

interface Suggestion {
  id: string
  text: string
}

interface SearchModalProps {
  open: boolean
  onClose: () => void
  suggestions?: Suggestion[]
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

/* Bottom-anchored search popup. Opens above the floating AI Search pill.
   No backdrop dim — just an invisible click-catcher to close on outside click. */
export default function SearchModal({ open, onClose, suggestions = [] }: SearchModalProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Tool[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useScrollLock(open)

  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

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
    const val = e.target.value
    setQuery(val)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => search(val), 300)
  }

  function submit(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('q', trimmed)
    router.push(`/?${params.toString()}`, { scroll: false })
    onClose()
  }

  function pickSuggestion(s: Suggestion) {
    submit(s.text)
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit(query)
    }
  }

  if (!open) return null

  const hasQuery = query.trim().length > 0
  const showSuggestions = !hasQuery && suggestions.length > 0
  const showEmpty = hasQuery && results.length === 0 && !loading
  const showResults = results.length > 0

  return (
    <>
      {/* Invisible click-catcher — closes popup on outside click. No dim/blur. */}
      <div
        className="fixed inset-0 z-[150]"
        onClick={onClose}
        aria-hidden
        style={{ background: 'transparent', pointerEvents: 'auto' }}
      />

      {/* Popup — anchored above the floating pill at bottom-center */}
      <div
        className="fixed inset-x-0 z-[200] flex justify-center px-4"
        style={{ bottom: 80, ...fontSans }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-full max-w-[640px] overflow-hidden"
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 24,
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          }}
        >
          {/* Input row */}
          <div
            className="flex items-center"
            style={{
              paddingLeft: 24,
              paddingRight: 12,
              paddingTop: 12,
              paddingBottom: 12,
              borderBottom: `1px solid ${C.border}`,
              gap: 14,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: C.textDim }}>
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={handleChange}
              onKeyDown={handleKey}
              placeholder="Search tools or describe what you need…"
              className="flex-1 bg-transparent outline-none focus:outline-none focus:ring-0"
              style={{
                ...fontSans,
                fontSize: 16,
                color: C.text,
                caretColor: C.text,
                height: 32,
                border: 'none',
                boxShadow: 'none',
              }}
            />
            {loading && (
              <span
                className="inline-block animate-spin rounded-full"
                style={{
                  width: 16,
                  height: 16,
                  border: `2px solid ${C.border}`,
                  borderTopColor: C.text,
                }}
              />
            )}
            <kbd
              style={{
                ...fontMono,
                background: 'rgba(255,255,255,0.06)',
                color: C.textDim,
                fontSize: 11,
                padding: '4px 8px',
                borderRadius: 6,
              }}
            >
              esc
            </kbd>
          </div>

          {/* Body */}
          <div className="max-h-[440px] overflow-y-auto">
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
                    <SuggestionRow key={s.id} text={s.text} onClick={() => pickSuggestion(s)} />
                  ))}
                </ul>
              </>
            )}

            {showResults && results.map((tool) => {
              const color = getCategoryColor(tool.category)
              return (
                <SearchResultRow key={tool.id} tool={tool} color={color} onClose={onClose} />
              )
            })}

            {showEmpty && (
              <div
                style={{
                  ...fontSans,
                  padding: '40px 24px',
                  textAlign: 'center',
                  color: C.textMuted,
                  fontSize: 14,
                }}
              >
                No tools found for &ldquo;
                <span style={{ color: C.text }}>{query}</span>
                &rdquo;
              </div>
            )}
          </div>
        </div>
      </div>
    </>
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
          style={{
            color: hover ? '#ffff57' : '#6a6a72',
            flexShrink: 0,
            transition: 'color 140ms',
          }}
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
        padding: '16px 24px',
        background: hover ? C.surfaceHover : 'transparent',
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
        <div
          className="truncate"
          style={{ color: C.textDim, fontSize: 12, marginTop: 2 }}
        >
          {tool.description}
        </div>
      </div>
      <span
        className="shrink-0 inline-flex items-center"
        style={{
          ...fontMono,
          fontSize: 10,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: C.textDim,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          padding: '6px 10px',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        {tool.category}
      </span>
    </Link>
  )
}
