import Link from 'next/link'

const fontMono = 'var(--font-mono), ui-monospace, monospace'
const fontSans = 'var(--font-inter), ui-sans-serif, system-ui'

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: '#141414', color: '#ffffff', fontFamily: fontSans }}
    >
      <div
        style={{
          fontFamily: fontMono,
          color: '#ffff57',
          opacity: 0.18,
          fontSize: 140,
          fontWeight: 500,
          lineHeight: 1,
          letterSpacing: '-0.04em',
        }}
      >
        404
      </div>

      <h1
        style={{
          fontSize: 32,
          lineHeight: '40px',
          letterSpacing: '-0.02em',
          fontWeight: 600,
          color: '#ffffff',
          marginTop: -28,
          marginBottom: 12,
        }}
      >
        Page not found
      </h1>

      <p
        style={{
          fontSize: 16,
          lineHeight: '24px',
          color: '#a0a0a8',
          marginBottom: 40,
        }}
      >
        This tool doesn&apos;t exist… yet.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full"
        style={{
          fontFamily: fontMono,
          height: 46,
          paddingLeft: 22,
          paddingRight: 22,
          background: '#ffffff',
          color: '#0a0a0c',
          fontSize: 13,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fontWeight: 500,
        }}
      >
        Browse tools
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 11L11 3M5 3h6v6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  )
}
