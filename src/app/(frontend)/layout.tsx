import type { Metadata } from 'next'
import Script from 'next/script'
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
  metadataBase: new URL('https://ailand.gallery'),
  title: 'AI Land — Curated library of AI tools',
  description: 'A hand-picked collection of AI tools that actually work. Discover, compare and find the right tool for your workflow — described in plain language.',
  openGraph: {
    title: 'AI Land — Curated library of AI tools',
    description: 'Hand-picked AI tools that actually work, described in plain language.',
    url: 'https://ailand.gallery',
    siteName: 'AI Land',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Land — Curated library of AI tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Land — Curated library of AI tools',
    description: 'Hand-picked AI tools that actually work, described in plain language.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://ailand.gallery',
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

        {/* Google Analytics (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3L54DLT6DM"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3L54DLT6DM');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xpi6e3l6y0");
          `}
        </Script>
      </body>
    </html>
  )
}
