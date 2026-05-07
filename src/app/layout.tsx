import type { Metadata } from 'next'
import { Exo_2, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Footer from '@/components/layout/Footer'
import AboutModal from '@/components/layout/AboutModal'
import PrivacyModal from '@/components/layout/PrivacyModal'

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-exo2',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AI Land — Discover AI tools that actually work',
  description: 'A curated directory of the best AI tools. Discover, compare and find the right AI tool for your workflow.',
  openGraph: {
    title: 'AI Land — Discover AI tools that actually work',
    description: 'A curated directory of the best AI tools.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${exo2.variable} ${inter.variable} ${mono.variable} h-full`}>
      <body className="min-h-full bg-page text-t1 antialiased flex flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
        <AboutModal />
        <PrivacyModal />
      </body>
    </html>
  )
}
