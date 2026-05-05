import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--ai-font-sans',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--ai-font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Style Guide — AI Land',
  robots: { index: false, follow: false },
}

export default function AiLandStyleGuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} ${mono.variable}`}>{children}</div>
  )
}
