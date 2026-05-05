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
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <nav className="flex flex-wrap items-center gap-x-2 gap-y-1" style={{ color: '#a0a0a8', fontSize: 14 }}>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <span style={{ color: '#6a6a72' }}>•</span>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span style={{ color: '#6a6a72' }}>•</span>
          <a
            href="https://www.linkedin.com/company/otherland-studio"
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
        <span
          style={{
            fontFamily: fontSans,
            color: '#6a6a72',
            fontSize: 14,
            letterSpacing: 0,
          }}
        >
          Crafted by{' '}
          <a
            href="https://otherland.studio"
            target="_blank"
            rel="noopener"
            style={{ color: '#ffffff', fontWeight: 500 }}
            className="hover:underline"
          >
            Other Land
          </a>{' '}
          studio <span style={{ color: '#6a6a72' }}>/ dev</span>{' '}
          <a
            href="https://webf.love"
            target="_blank"
            rel="noopener"
            style={{ color: '#ffffff', fontWeight: 500 }}
            className="hover:underline"
          >
            webf.love
          </a>
        </span>
      </div>
    </footer>
  )
}
