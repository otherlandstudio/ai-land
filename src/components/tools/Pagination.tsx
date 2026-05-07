'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useAppTransition } from '@/lib/transition'

interface Props {
  current: number
  total: number
}

const fontSans = { fontFamily: 'var(--font-inter), ui-sans-serif, system-ui' } as const

/* Pagination — Figma node 702:1744. 9 large square cells (144×144 cornerRadius 16),
   8px gap, full content width. Active cell #222222 (filled), inactive cells transparent
   with thin #222222 stroke. Numbers 18px SemiBold white.
   Position lock: after navigation, the pagination's viewport y is preserved so the user
   doesn't perceive a scroll jump even when the new page has fewer cards (shorter grid). */
export default function Pagination({ current, total }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { startTransition, isPending } = useAppTransition()
  const wrapperRef = useRef<HTMLDivElement>(null)
  // y of the pagination wrapper at the moment of click — null when no adjust pending
  const lockYRef = useRef<number | null>(null)

  // After the transition commits, restore the pagination to the same viewport y.
  useEffect(() => {
    if (isPending) return
    if (lockYRef.current == null || !wrapperRef.current) return
    const after = wrapperRef.current.getBoundingClientRect().top
    const delta = after - lockYRef.current
    if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: 'instant' as ScrollBehavior })
    lockYRef.current = null
  }, [isPending])

  if (total <= 1) return null

  function goto(page: number) {
    if (page === current) return
    if (wrapperRef.current) {
      lockYRef.current = wrapperRef.current.getBoundingClientRect().top
    }
    const params = new URLSearchParams(searchParams.toString())
    if (page <= 1) params.delete('page')
    else params.set('page', String(page))
    startTransition(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }))
  }

  const items = pageItems(current, total)

  return (
    <div
      ref={wrapperRef}
      className="flex flex-wrap items-stretch justify-between"
      style={{
        width: '100%',
        gap: 8,
        paddingTop: 56,
        paddingBottom: 120,
        ...fontSans,
      }}
    >
      {items.map((item, i) => {
        if (item === 'ellipsis') return <Cell key={`e-${i}`} label="..." muted />
        const n = item as number
        return (
          <Cell
            key={n}
            label={String(n)}
            active={n === current}
            onClick={() => goto(n)}
          />
        )
      })}
    </div>
  )
}

function Cell({
  label,
  active = false,
  muted = false,
  onClick,
}: {
  label: string
  active?: boolean
  muted?: boolean
  onClick?: () => void
}) {
  const [hover, setHover] = useState(false)
  const interactive = !!onClick && !muted
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex items-center justify-center"
      style={{
        ...fontSans,
        flex: '1 1 0',
        minWidth: 56,
        aspectRatio: '1 / 1',
        borderRadius: 16,
        background: active ? '#222222' : hover && interactive ? '#1c1c1c' : 'transparent',
        border: `1px solid #222222`,
        color: muted ? '#9b9b9b' : '#ffffff',
        fontSize: 18,
        fontWeight: 600,
        lineHeight: '32px',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'background-color 200ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {label}
    </button>
  )
}

/* Build a 9-cell page list:
   total ≤ 9              → all pages
   current near start (≤4) → 1..6, ellipsis, total
   current near end (≥last-3) → 1, ellipsis, last-5..last
   middle                 → 1, ellipsis, c-2..c+2, ellipsis, total */
type Item = number | 'ellipsis'
function pageItems(current: number, total: number): Item[] {
  if (total <= 9) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) {
    return [1, 2, 3, 4, 5, 6, 'ellipsis', total]
  }
  if (current >= total - 3) {
    return [1, 'ellipsis', total - 5, total - 4, total - 3, total - 2, total - 1, total]
  }
  return [1, 'ellipsis', current - 2, current - 1, current, current + 1, current + 2, 'ellipsis', total]
}
