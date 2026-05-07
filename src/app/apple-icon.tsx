import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/* Apple touch icon — bigger version of /icon for iOS home-screen. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#141414',
          color: '#ffff57',
          fontFamily: 'system-ui, sans-serif',
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: '-0.04em',
        }}
      >
        AI
      </div>
    ),
    size,
  )
}
