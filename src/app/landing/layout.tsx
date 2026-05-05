import localFont from 'next/font/local'

const suisse = localFont({
  src: '../../../public/fonts/SuisseIntl-Regular.otf',
  weight: '400',
  style: 'normal',
  variable: '--cm-font',
  display: 'swap',
})

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${suisse.variable} bg-white text-[#1f1d1e]`}
      style={{ fontFamily: 'var(--cm-font), -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}
    >
      {children}
    </div>
  )
}
