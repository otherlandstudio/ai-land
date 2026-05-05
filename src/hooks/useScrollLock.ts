import { useEffect } from 'react'

/**
 * Locks <body> scroll while `active` is true and preserves the scrollbar
 * gutter so the page doesn't shift horizontally when the modal opens.
 *
 * Multiple modals stack safely — the body is only restored once the last
 * caller unmounts (counted via a module-level lock count).
 */

let lockCount = 0
let savedBodyStyles: { overflow: string; paddingRight: string } | null = null

function lock() {
  lockCount += 1
  if (lockCount > 1) return
  if (typeof document === 'undefined') return

  // Compensate for the scrollbar so layout doesn't jump
  const scrollbar = window.innerWidth - document.documentElement.clientWidth
  savedBodyStyles = {
    overflow: document.body.style.overflow,
    paddingRight: document.body.style.paddingRight,
  }
  document.body.style.overflow = 'hidden'
  if (scrollbar > 0) {
    document.body.style.paddingRight = `${scrollbar}px`
  }
}

function unlock() {
  if (lockCount === 0) return
  lockCount -= 1
  if (lockCount > 0) return
  if (typeof document === 'undefined' || !savedBodyStyles) return
  document.body.style.overflow = savedBodyStyles.overflow
  document.body.style.paddingRight = savedBodyStyles.paddingRight
  savedBodyStyles = null
}

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    lock()
    return () => unlock()
  }, [active])
}
