import type { Metadata } from 'next'
import { Inter, Inter_Tight } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--sg-font-body',
  display: 'swap',
})

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--sg-font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Style Guide — Otherland',
  robots: { index: false, follow: false },
}

export default function StyleGuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} ${interTight.variable}`}>{children}</div>
  )
}
