'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface NavbarProps {
  onSearchOpen?: () => void
}

export default function Navbar({ onSearchOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onSearchOpen?.()
      }
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onSearchOpen])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 h-[56px] flex items-center px-6 gap-6 transition-all duration-200"
        style={{
          background: scrolled ? 'rgba(21,24,47,0.95)' : 'rgba(21,24,47,0.7)',
          backdropFilter: 'blur(16px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-extrabold text-[18px] tracking-tight text-[#c9e75d] hover:text-[#e3ff7c] transition-colors"
          onClick={() => setMenuOpen(false)}
        >
          AI Land
        </Link>

        {/* Nav links — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-1 ml-2">
          <Link
            href="/"
            className="text-[13px] font-medium text-[#b1b1d3] hover:text-[#fafafa] px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
          >
            Browse
          </Link>
          <Link
            href="/submit"
            className="text-[13px] font-medium text-[#b1b1d3] hover:text-[#fafafa] px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
          >
            Submit Tool
          </Link>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search trigger — hidden on mobile */}
        <button
          onClick={onSearchOpen}
          className="hidden md:flex items-center gap-2 bg-[#1c2146] hover:bg-[#25295d] border border-white/8 rounded-xl px-3 py-2 text-[13px] text-[#7676a1] hover:text-[#b1b1d3] transition-all group"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <span>Search tools...</span>
          <span className="ml-2 text-[11px] text-[#4f548e] group-hover:text-[#7676a1] bg-[#25295d] px-1.5 py-0.5 rounded font-mono">
            ⌘K
          </span>
        </button>

        {/* Submit CTA */}
        <Link
          href="/submit"
          className="text-[13px] font-bold px-4 py-2 rounded-xl bg-[#c9e75d] text-[#121312] hover:bg-[#e3ff7c] transition-colors"
          onClick={() => setMenuOpen(false)}
        >
          + Submit
        </Link>

        {/* Hamburger — visible on mobile only */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span
            className="block w-5 h-[2px] rounded-full transition-all duration-200"
            style={{
              background: '#b1b1d3',
              transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
            }}
          />
          <span
            className="block w-5 h-[2px] rounded-full transition-all duration-200"
            style={{
              background: '#b1b1d3',
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-5 h-[2px] rounded-full transition-all duration-200"
            style={{
              background: '#b1b1d3',
              transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-[56px] md:hidden"
          style={{ background: 'rgba(21,24,47,0.98)', backdropFilter: 'blur(20px)' }}
        >
          <nav className="flex flex-col px-6 py-8 gap-2">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="text-[22px] font-bold text-[#fafafa] hover:text-[#c9e75d] py-3 transition-colors border-b"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              Browse
            </Link>
            <Link
              href="/submit"
              onClick={() => setMenuOpen(false)}
              className="text-[22px] font-bold text-[#fafafa] hover:text-[#c9e75d] py-3 transition-colors border-b"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              Submit Tool
            </Link>

            {/* Mobile search */}
            <button
              onClick={() => { setMenuOpen(false); onSearchOpen?.() }}
              className="mt-6 flex items-center gap-3 bg-[#181b38] border rounded-2xl px-5 py-4 text-[15px] text-[#7676a1] transition-all w-full"
              style={{ borderColor: 'rgba(255,255,255,0.10)' }}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <span>Search tools...</span>
            </button>
          </nav>
        </div>
      )}
    </>
  )
}
