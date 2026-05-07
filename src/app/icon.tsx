import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

/* AI Land favicon — black tile with neon-yellow "AI" wordmark.
   Matches site palette (#141414 page surface, #ffff57 accent).
   Replace src/app/favicon.ico if a final version is provided in Figma. */
export default function Icon() {
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
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: '-0.04em',
          borderRadius: 6,
        }}
      >
        AI
      </div>
    ),
    size,
  )
}
