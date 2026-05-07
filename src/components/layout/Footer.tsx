'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const fontSans = 'var(--font-inter), ui-sans-serif, system-ui'

export default function Footer() {
  const pathname = usePathname()
  // /landing renders its own Otherland Studio footer
  if (pathname?.startsWith('/landing')) return null

  return (
    <footer
      className="px-6 py-10 lg:px-10"
      style={{
        background: '#141414',
        fontFamily: fontSans,
      }}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-center">
        <nav className="flex flex-wrap items-center gap-x-2 gap-y-1" style={{ color: '#a0a0a8', fontSize: 14 }}>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-about'))}
            className="hover:text-white transition-colors"
            style={{ color: 'inherit', font: 'inherit', cursor: 'pointer' }}
          >
            About
          </button>
          <span style={{ color: '#6a6a72' }}>•</span>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-privacy'))}
            className="hover:text-white transition-colors"
            style={{ color: 'inherit', font: 'inherit', cursor: 'pointer' }}
          >
            Privacy Policy
          </button>
          <span style={{ color: '#6a6a72' }}>•</span>
          <a
            href="https://www.linkedin.com/company/other-land/?viewAsMember=true"
            target="_blank"
            rel="noopener"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <span style={{ color: '#6a6a72' }}>•</span>
          <Link href="/submit" className="inline-flex items-center gap-1 hover:text-white transition-colors">
            Submit
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M3 8L8 3M5 3h3v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </nav>
      </div>
    </footer>
  )
}
