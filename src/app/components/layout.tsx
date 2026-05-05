import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--cm-font',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Components — Otherland',
  robots: { index: false, follow: false },
}

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  return <div className={inter.variable}>{children}</div>
}
