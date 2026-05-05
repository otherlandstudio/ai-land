'use client'

import { useEffect, useRef, useState } from 'react'

/* ======================================================================
   Tokens — extracted 1:1 from Figma (file EGHpyw3BfFgVioOCbKWHzK · Page 6)
   ====================================================================== */

const C = {
  ink: '#1f1d1e',
  inkHover: '#312f30',
  white: '#ffffff',
  surfaceLight: '#f7f7f7',
  surfaceLightHover: '#f2f2f2',
  border: '#e2e2e2',
  textMuted: '#808080',
  textDim: '#999999',
  yellow: '#ffff57',
  bodyFont:
    'var(--cm-font), "Suisse Intl", "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
} as const

const fontStyle = { fontFamily: C.bodyFont } as const

/* ======================================================================
   Page chrome
   ====================================================================== */

export default function ComponentsPage() {
  return (
    <main
      className="relative z-10 min-h-screen bg-white text-[#1f1d1e]"
      style={fontStyle}
    >
      <div className="mx-auto max-w-[1400px] px-10 py-20">
        <PageHeader />

        <Group label="Atoms" id="atoms">
          <Item title="logo" id="702:2524" w={44} h={44}>
            <Logo />
          </Item>
          <Item title="logo-circle" id="702:2683" w={48} h={48}>
            <LogoCircle />
          </Item>
          <Item title="Tag — 5 variants" id="702:2654" w={419} h={22}>
            <TagSet />
          </Item>
          <Item title="Icon — 9 icons" id="702:2627" w={568} h={24}>
            <IconSet />
          </Item>
        </Group>

        <Group label="Buttons & CTAs" id="buttons">
          <Item title="Button — primary (default + hover)" id="702:2671" w={138} h={44}>
            <RowGap>
              <ButtonPrimary>Book a call</ButtonPrimary>
              <ButtonPrimary forceHover>Book a call</ButtonPrimary>
            </RowGap>
          </Item>
          <Item title="Button — intro call (default + hover)" id="702:2676" w={227} h={52}>
            <RowGap>
              <ButtonIntroCall>Book an intro call</ButtonIntroCall>
              <ButtonIntroCall forceHover>Book an intro call</ButtonIntroCall>
            </RowGap>
          </Item>
          <Item title="button-more works" id="702:2977" w={1280} h={68} wide>
            <ButtonMoreWorks count={52}>More works</ButtonMoreWorks>
          </Item>
        </Group>

        <Group label="Filters & Navigation atoms" id="filters">
          <Item title="types — filter chips (active / default / hover)" id="702:2949" w={452} h={64} wide>
            <FilterChipsDemo />
          </Item>
          <Item title="WorkRow — 3 states (Default/desktop · Default/mobile · hover/desktop)" id="702:2959" w={1240} h={208} wide>
            <div className="flex flex-col" style={{ gap: 24 }}>
              <div className="flex flex-col" style={{ gap: 6 }}>
                <span style={{ ...fontStyle, fontSize: 11, color: C.textMuted, letterSpacing: '0.04em' }}>
                  DEFAULT / DESKTOP
                </span>
                <WorkRow
                  name="Asper"
                  info="AI platform for planning purchases"
                  year="2026"
                  state="default"
                  platform="desktop"
                  interactive={false}
                />
              </div>
              <div className="flex flex-col" style={{ gap: 6 }}>
                <span style={{ ...fontStyle, fontSize: 11, color: C.textMuted, letterSpacing: '0.04em' }}>
                  DEFAULT / MOBILE
                </span>
                <WorkRow
                  name="Asper"
                  info="AI platform for planning purchases"
                  year="2026"
                  state="default"
                  platform="mobile"
                  interactive={false}
                />
              </div>
              <div className="flex flex-col" style={{ gap: 6 }}>
                <span style={{ ...fontStyle, fontSize: 11, color: C.textMuted, letterSpacing: '0.04em' }}>
                  HOVER / DESKTOP (info & year turn ink)
                </span>
                <WorkRow
                  name="Asper"
                  info="AI platform for planning purchases"
                  year="2026"
                  state="hover"
                  platform="desktop"
                  interactive={false}
                />
              </div>
              <div className="flex flex-col" style={{ gap: 6 }}>
                <span style={{ ...fontStyle, fontSize: 11, color: C.textMuted, letterSpacing: '0.04em' }}>
                  INTERACTIVE — HOVER ME
                </span>
                <WorkRow
                  name="Asper"
                  info="AI platform for planning purchases"
                  year="2026"
                />
              </div>
            </div>
          </Item>
        </Group>

        <Group label="Cards" id="cards">
          <Item title="blog (default + hover)" id="702:2578" w={315} h={68}>
            <RowGap dir="col">
              <BlogCard />
              <BlogCard forceHover />
            </RowGap>
          </Item>
          <Item title="full-blog" id="702:2589" w={315} h={160}>
            <FullBlog />
          </Item>
          <Item title="ArticleCard" id="702:2665" w={420} h={520}>
            <ArticleCard />
          </Item>
          <Item title="ServiceCard" id="702:3015" w={380} h={216}>
            <ServiceCard
              title="Product Design"
              description="Design AI capabilities people actually understand and trust."
            />
          </Item>
          <Item title="CaseStudyCard" id="702:2612" w={620} h={512} wide>
            <CaseStudyCard />
          </Item>
        </Group>

        <Group label="Patterns" id="patterns">
          <Item title="FAQItem — all 4 states (default/hover × open=no/yes)" id="702:2593" w={838} h={304} wide>
            <FAQStatesDemo />
          </Item>
          <Item title="FAQItem — interactive (smooth animation)" id="702:2593" w={838} h={90} wide>
            <FAQDemo />
          </Item>
          <Item title="TestimonialFeatured — yellow / desktop" id="702:2705" w={1179} h={370} wide>
            <TestimonialFeatured
              colour="yellow"
              platform="desktop"
              quote="We've worked with Other Land for over two years. They integrated smoothly, took ownership of the design side, and consistently delivered strong UX/UI solutions."
              stat="12.3m"
              statLabel="App users on a single product we designed"
              avatar1="/components/avatar.jpg"
              avatar2="/components/avatar.jpg"
            />
          </Item>
          <Item title="TestimonialFeatured — gray / desktop" id="702:2705" w={690} h={370} wide>
            <TestimonialFeatured
              colour="gray"
              platform="desktop"
              quote="This is my third time working with Other Land, and I'd gladly partner with them again. They focus on real product value, move fast, and integrate seamlessly. No fluff, just smart, metrics-oriented design that drives results."
              stat="+240%"
              statLabel="Conversion lift on the redesigned funnel"
            />
          </Item>
          <Item title="TestimonialFeatured — white / desktop" id="702:2705" w={690} h={370} wide>
            <TestimonialFeatured
              colour="white"
              platform="desktop"
              quote="We have been matched with an incredible designer Vlad, whose work brought a clear upgrade in both usability and visual quality. His attention to detail and high standards truly impressed us. We're glad to have him on our team."
              stat="+5.7m"
              statLabel="App users acquired post-redesign"
            />
          </Item>
          <Item title="TestimonialFeatured — yellow / mobile" id="702:2705" w={359} h={551}>
            <TestimonialFeatured
              colour="yellow"
              platform="mobile"
              quote="We've worked with Other Land for over two years. They integrated smoothly, took ownership of the design side, and consistently delivered strong UX/UI solutions."
              stat="12.3m"
              statLabel="App users on a single product we designed"
            />
          </Item>
          <Item title="TestimonialFeatured — gray / mobile" id="702:2705" w={359} h={551}>
            <TestimonialFeatured
              colour="gray"
              platform="mobile"
              quote="This is my third time working with Other Land, and I'd gladly partner with them again. They focus on real product value, move fast, and integrate seamlessly."
              stat="+240%"
              statLabel="Conversion lift on the redesigned funnel"
            />
          </Item>
          <Item title="TestimonialFeatured — white / mobile" id="702:2705" w={359} h={551}>
            <TestimonialFeatured
              colour="white"
              platform="mobile"
              quote="We have been matched with an incredible designer Vlad, whose work brought a clear upgrade in both usability and visual quality."
              stat="+5.7m"
              statLabel="App users acquired post-redesign"
            />
          </Item>
          <Item title="CTABanner — desktop" id="702:2986" w={1280} h={554} wide>
            <CTABanner />
          </Item>
          <Item title="Domains — accordion" id="702:2879" w={1280} h={76} wide>
            <DomainsDemo />
          </Item>
        </Group>

        <Group label="Logos" id="logos">
          <Item title="logo-line — clients marquee (infinite loop, pauses on hover)" id="702:2867" w={1280} h={125} wide>
            <LogoMarquee />
          </Item>
        </Group>

        <Group label="Layout" id="layout">
          <Item title="Works (nav-item) — 4 states: Default / Hover / Active / icon" id="702:2527" w={122} h={246} wide>
            <NavbarItemStates />
          </Item>
          <Item title="Navbar — desktop (mobile state=no)" id="702:2536" w={1280} h={56} wide>
            <Navbar />
          </Item>
          <Item title="Navbar — mobile / closed" id="702:2536" w={359} h={44}>
            <NavbarMobile open={false} />
          </Item>
          <Item title="Navbar — mobile / opened" id="702:2536" w={359} h={365}>
            <NavbarMobile open />
          </Item>
          <Item title="Footer" id="702:2798" w={1280} h={216} wide>
            <Footer />
          </Item>
        </Group>

        <PageFooter />
      </div>
    </main>
  )
}

/* ======================================================================
   Page chrome components
   ====================================================================== */

function PageHeader() {
  return (
    <header className="mb-20">
      <div className="mb-3 text-[12px] uppercase tracking-[0.16em]" style={{ color: C.textMuted }}>
        Otherland · Redesign · Pixel-perfect
      </div>
      <h1
        className="text-[80px] leading-[0.95] tracking-[-0.02em]"
        style={{ ...fontStyle, fontWeight: 500 }}
      >
        Components
      </h1>
      <p className="mt-5 max-w-2xl text-[16px] leading-[1.5]" style={{ color: C.textMuted }}>
        Every component below mirrors the Figma source 1:1 — exact paddings, gaps, radii,
        font sizes, line-heights and colours. Production font is Suisse Intl;
        this preview falls back to Inter where Suisse Intl is unavailable.
      </p>
    </header>
  )
}

function Group({
  label,
  id,
  children,
}: {
  label: string
  id: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="mb-20 border-t pt-10" style={{ borderColor: C.border }}>
      <h2
        className="mb-8 text-[28px] leading-[1.05] tracking-[-0.01em]"
        style={{ ...fontStyle, fontWeight: 500 }}
      >
        {label}
      </h2>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">{children}</div>
    </section>
  )
}

function Item({
  title,
  id,
  w,
  h,
  wide,
  children,
}: {
  title: string
  id: string
  w: number
  h: number
  wide?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={wide ? 'lg:col-span-2' : ''}>
      <div className="mb-3 flex items-baseline justify-between">
        <div className="text-[14px]" style={{ ...fontStyle, fontWeight: 500 }}>{title}</div>
        <div className="font-mono text-[11px]" style={{ color: C.textMuted }}>
          {id} · {w}×{h}
        </div>
      </div>
      <div
        className="rounded-2xl border p-10"
        style={{
          background: '#fafafa',
          borderColor: C.border,
          backgroundImage:
            'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, 10px 0',
        }}
      >
        <div className="overflow-hidden rounded-xl bg-white p-8">{children}</div>
      </div>
    </div>
  )
}

function RowGap({
  children,
  dir = 'row',
}: {
  children: React.ReactNode
  dir?: 'row' | 'col'
}) {
  return (
    <div className={`flex ${dir === 'col' ? 'flex-col' : 'flex-row items-center'} gap-6 flex-wrap`}>
      {children}
    </div>
  )
}

function PageFooter() {
  return (
    <footer
      className="mt-24 border-t pt-8 text-[13px]"
      style={{ borderColor: C.border, color: C.textMuted }}
    >
      Source: Figma · file EGHpyw3BfFgVioOCbKWHzK · Page 6 / Components.
      Built pixel-perfect from extracted node specs.
    </footer>
  )
}

/* LogoMarquee — 702:2867 (logo-line)
   9 client SVGs scrolling infinitely. Each tile 124×125, gap 40 (Figma).
   Track is duplicated 2× and translated by -50% so the loop is seamless.
   White fade gradients on edges (62×125) match the Figma masks.
   Pauses on hover. Honors prefers-reduced-motion. */
const CLIENT_LOGOS = [
  'dressx',
  'cricut',
  'takko',
  'beanz',
  'rakbank',
  'stockpile',
  'migrosbank',
  'sides',
  'mobily',
] as const

function LogoMarquee({ speedSec = 30 }: { speedSec?: number }) {
  const trackContent = (
    <>
      {CLIENT_LOGOS.map((n) => (
        <div
          key={n}
          className="flex shrink-0 items-center justify-center"
          style={{ width: 124, height: 125, color: C.textDim }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 124,
              height: 125,
              backgroundColor: 'currentColor',
              WebkitMask: `url(/clients/${n}.svg) center / contain no-repeat`,
              mask: `url(/clients/${n}.svg) center / contain no-repeat`,
            }}
            aria-label={n}
          />
        </div>
      ))}
    </>
  )

  return (
    <div
      className="relative w-full"
      style={{
        height: 125,
        ...fontStyle,
        // CSS custom prop so consumer can tune speed inline
        ['--marquee-duration' as string]: `${speedSec}s`,
      }}
    >
      <style jsx>{`
        @keyframes logo-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          gap: 40px;
          animation: logo-marquee var(--marquee-duration) linear infinite;
          will-change: transform;
        }
        .marquee-wrap:hover .marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
      <div className="marquee-wrap relative h-full overflow-hidden">
        <div className="marquee-track">
          {/* duplicated 2× for seamless loop (translate -50% lands on identical content) */}
          <div className="flex shrink-0 items-center" style={{ gap: 40 }}>{trackContent}</div>
          <div className="flex shrink-0 items-center" style={{ gap: 40 }} aria-hidden>{trackContent}</div>
        </div>
        {/* edge fades (62px wide each, matching Figma) */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0"
          style={{
            width: 62,
            background: 'linear-gradient(to right, white, rgba(255,255,255,0))',
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0"
          style={{
            width: 62,
            background: 'linear-gradient(to left, white, rgba(255,255,255,0))',
          }}
        />
      </div>
    </div>
  )
}

/* ======================================================================
   ATOMS
   ====================================================================== */

/* logo (44×44, radius 6, ink bg + image overlay) */
function Logo() {
  return (
    <div className="relative h-[44px] w-[44px] overflow-hidden rounded-[6px]" style={{ background: C.ink }}>
      <img
        src="/components/logo-ol.png"
        alt="OL"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  )
}

/* logo-circle (48×48) */
function LogoCircle() {
  return (
    <div className="h-[48px] w-[48px] overflow-hidden rounded-full">
      <img
        src="/components/logo-ol.png"
        alt="OL"
        className="h-full w-full object-cover"
      />
    </div>
  )
}

/* Tag — 5 variants (h:22, r:4, p: 4/8, font 12/14 LH +4% LS UPPER) */
function TagSet() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tag variant="accent">Label</Tag>
      <Tag variant="surface">Label</Tag>
      <Tag variant="dark">Label</Tag>
      <Tag variant="subtle">Label</Tag>
      <Tag variant="overlay">Label</Tag>
    </div>
  )
}
function Tag({
  children,
  variant,
}: {
  children: React.ReactNode
  variant: 'accent' | 'surface' | 'dark' | 'subtle' | 'overlay'
}) {
  const style: Record<string, { bg: string; color: string; border?: string }> = {
    accent: { bg: C.yellow, color: C.ink },
    surface: { bg: C.surfaceLight, color: C.ink },
    dark: { bg: C.ink, color: C.white },
    subtle: { bg: C.white, color: C.textMuted },
    overlay: { bg: 'rgba(255,255,255,0.16)', color: C.ink, border: 'rgba(31,29,30,0.12)' },
  }
  const s = style[variant]
  return (
    <span
      className="inline-flex items-center justify-center rounded-[4px] px-2 py-1 text-[12px] uppercase"
      style={{
        ...fontStyle,
        fontWeight: 400,
        height: 22,
        lineHeight: '14px',
        letterSpacing: '0.04em',
        background: s.bg,
        color: s.color,
        border: s.border ? `1px solid ${s.border}` : undefined,
      }}
    >
      {children}
    </span>
  )
}

/* Icon set — 9 icons (24×24 stroke, color: ink) */
/* Icon — 702:2627. 9 variants, each 24×24 from Figma exported SVGs in /public/icons.
   Uses mask-image so currentColor controls fill, and each icon gets a smooth
   hover micro-interaction matching the rest of the design system. */
type FigmaIconName =
  | 'plus'
  | 'burger'
  | 'close'
  | 'arrow'
  | 'prohibit'
  | 'user-add'
  | 'sparkle'
  | 'warning'
  | 'check'

const ICON_HOVER_TRANSFORM: Record<FigmaIconName, string> = {
  plus: 'rotate(90deg)',                 // + → ×
  burger: 'scaleY(0.5)',                 // bars compress
  close: 'rotate(90deg)',                // × spins
  arrow: 'translate(2px, -2px)',         // nudges ↗
  prohibit: 'rotate(45deg)',             // line tilts
  'user-add': 'scale(1.1)',
  sparkle: 'rotate(180deg) scale(1.1)',  // sparkly spin
  warning: 'scale(1.1)',
  check: 'scale(1.15)',
}

function FigmaIcon({
  name,
  size = 24,
  className,
}: {
  name: FigmaIconName
  size?: number
  className?: string
}) {
  const url = `/icons/${name}.svg`
  return (
    <span
      className={className}
      aria-hidden
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        backgroundColor: 'currentColor',
        WebkitMask: `url(${url}) center / contain no-repeat`,
        mask: `url(${url}) center / contain no-repeat`,
        transition: 'transform 260ms cubic-bezier(0.4,0,0.2,1)',
      }}
    />
  )
}

function IconHoverButton({ name }: { name: FigmaIconName }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      className="flex h-11 w-11 items-center justify-center rounded-[8px]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={name}
      style={{
        background: hover ? 'rgba(0,0,0,0.04)' : 'transparent',
        color: C.ink,
        transition: 'background-color 220ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          width: 24,
          height: 24,
          backgroundColor: 'currentColor',
          WebkitMask: `url(/icons/${name}.svg) center / contain no-repeat`,
          mask: `url(/icons/${name}.svg) center / contain no-repeat`,
          transform: hover ? ICON_HOVER_TRANSFORM[name] : 'none',
          transition: 'transform 280ms cubic-bezier(0.4,0,0.2,1)',
        }}
      />
    </button>
  )
}

function IconSet() {
  const icons: FigmaIconName[] = [
    'plus',
    'burger',
    'close',
    'arrow',
    'prohibit',
    'user-add',
    'sparkle',
    'warning',
    'check',
  ]
  return (
    <div className="flex items-center" style={{ gap: 16, color: C.ink }}>
      {icons.map((n) => (
        <IconHoverButton key={n} name={n} />
      ))}
    </div>
  )
}

const stroke = { stroke: C.ink, strokeWidth: 2, fill: 'none' as const, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

function IconPlus() {
  return <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 2v12M2 8h12" {...stroke} /></svg>
}
function IconBurger() {
  return <svg width="18" height="14" viewBox="0 0 18 14"><path d="M1 1h16M1 7h16M1 13h16" {...stroke} /></svg>
}
function IconClose() {
  return <svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 1l12 12M13 1L1 13" {...stroke} /></svg>
}
function IconArrow() {
  return <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 13L13 3M5 3h8v8" {...stroke} /></svg>
}
function IconProhibit() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="9" {...stroke} />
      <path d="M3.5 16.5L16.5 3.5" {...stroke} />
    </svg>
  )
}
function IconUserAdd() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <circle cx="8" cy="6" r="3" {...stroke} />
      <path d="M2 18c1-3 3.5-4.5 6-4.5s5 1.5 6 4.5" {...stroke} />
      <path d="M16 6v4M14 8h4" {...stroke} />
    </svg>
  )
}
function IconAi() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <path d="M10 2l1.6 4.4L16 8l-4.4 1.6L10 14l-1.6-4.4L4 8l4.4-1.6L10 2z" {...stroke} />
      <path d="M16 13l.7 1.8 1.8.7-1.8.7L16 18l-.7-1.8-1.8-.7 1.8-.7L16 13z" {...stroke} />
    </svg>
  )
}
function IconWarning() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <path d="M2 4h6v6H2zM6 8l4 4 8-8" {...stroke} />
      <polygon points="2,2 18,2 18,18 2,18" {...stroke} />
    </svg>
  )
}
function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="9" fill={C.ink} />
      <path d="M5.5 10.5L8.5 13.5L14.5 6.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ======================================================================
   BUTTONS & CTAs
   ====================================================================== */

/* Button primary — sm: 138×44, r:6, p: 8/20, ink bg, white 20px Suisse Intl */
function ButtonPrimary({
  children,
  forceHover,
}: {
  children: React.ReactNode
  forceHover?: boolean
}) {
  return (
    <button
      className="inline-flex h-[44px] items-center justify-center rounded-[6px] px-5 transition-colors duration-200"
      style={{
        ...fontStyle,
        background: forceHover ? C.inkHover : C.ink,
        color: C.white,
        fontSize: 20,
        lineHeight: '28px',
        letterSpacing: '-0.01em',
        fontWeight: 400,
      }}
      onMouseEnter={(e) => {
        if (!forceHover) e.currentTarget.style.background = C.inkHover
      }}
      onMouseLeave={(e) => {
        if (!forceHover) e.currentTarget.style.background = C.ink
      }}
    >
      {children}
    </button>
  )
}

/* Button intro call — 227×52, r:30, p: 2/16/2/2, ink bg, avatar 48×48 ellipse + 20px text */
function ButtonIntroCall({
  children,
  forceHover,
}: {
  children: React.ReactNode
  forceHover?: boolean
}) {
  return (
    <button
      className="inline-flex h-[52px] items-center rounded-full transition-colors duration-200"
      style={{
        ...fontStyle,
        background: forceHover ? C.inkHover : C.ink,
        paddingLeft: 2,
        paddingRight: 16,
        paddingTop: 2,
        paddingBottom: 2,
        gap: 6,
      }}
      onMouseEnter={(e) => {
        if (!forceHover) e.currentTarget.style.background = C.inkHover
      }}
      onMouseLeave={(e) => {
        if (!forceHover) e.currentTarget.style.background = C.ink
      }}
    >
      <span className="block h-[48px] w-[48px] shrink-0 overflow-hidden rounded-full">
        <img src="/components/avatar.jpg" alt="" className="h-full w-full object-cover" />
      </span>
      <span
        style={{
          ...fontStyle,
          color: C.white,
          fontSize: 20,
          lineHeight: '28px',
          letterSpacing: '-0.01em',
          fontWeight: 400,
        }}
      >
        {children}
      </span>
    </button>
  )
}

/* button-more works — 1280×68, r:6, p:0/20, surface bg, border, gap 8, font 20/28 -1% */
function ButtonMoreWorks({ children, count }: { children: React.ReactNode; count: number }) {
  return (
    <button
      className="group flex h-[68px] w-full items-center justify-center gap-2 rounded-[6px] border transition-colors duration-200"
      style={{
        background: C.surfaceLight,
        borderColor: C.border,
        paddingLeft: 0,
        paddingRight: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = C.surfaceLightHover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = C.surfaceLight
      }}
    >
      <span
        className="transition-colors duration-200 group-hover:text-[#1f1d1e]"
        style={{
          ...fontStyle,
          color: C.textMuted,
          fontSize: 20,
          lineHeight: '28px',
          letterSpacing: '-0.01em',
        }}
      >
        {children}
      </span>
      <span
        className="inline-flex items-center justify-center rounded-[4px] px-1.5 transition-colors duration-200 group-hover:bg-[#1f1d1e]"
        style={{
          background: C.textMuted,
          height: 22,
          minWidth: 23,
        }}
      >
        <span
          className="text-[12px]"
          style={{
            ...fontStyle,
            color: C.surfaceLight,
            lineHeight: '14px',
            letterSpacing: '0.04em',
          }}
        >
          {count}
        </span>
      </span>
    </button>
  )
}

/* ======================================================================
   FILTER CHIPS — types (144×64, r:12, p:20/20)
   ====================================================================== */

function FilterChipsDemo() {
  const [active, setActive] = useState('Hiring gap')
  const items = ['Hiring gap', 'Speed', 'Quality', 'Bandwidth']
  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((it) => (
        <FilterChip key={it} active={active === it} onClick={() => setActive(it)}>
          {it}
        </FilterChip>
      ))}
    </div>
  )
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  const [hover, setHover] = useState(false)
  const strokeColor = active ? C.ink : hover ? C.ink : C.textMuted
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-flex h-[44px] items-center gap-2 rounded-[12px]"
      style={{
        ...fontStyle,
        paddingLeft: 16,
        paddingRight: 16,
        background: active ? C.white : hover ? 'rgba(0,0,0,0.04)' : 'transparent',
        boxShadow: active ? '0 0 0 1px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' : 'none',
        color: active || hover ? C.ink : C.textMuted,
        transition:
          'background-color 220ms cubic-bezier(0.4,0,0.2,1), color 220ms cubic-bezier(0.4,0,0.2,1), box-shadow 220ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <span
        className="flex h-4 w-4 items-center justify-center"
        style={{
          transform: active ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 260ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'stroke 220ms cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
      </span>
      <span style={{ fontSize: 15, lineHeight: '20px', fontWeight: 400 }}>{children}</span>
    </button>
  )
}

/* ======================================================================
   Component 1948755814 — work row (1240×28)
   ====================================================================== */

/* WorkRow — 702:2959 (Component 1948755814)
   3 variants: Default/desktop · Default/mobile · hover/desktop
   - desktop: HORIZONTAL gap 32, name 220 / info FILL / [action 170 + year 170, gap 32]
   - mobile: VERTICAL gap 4, name → info → [action + year inline, gap 16]
   - Hover: info & year switch from #808080 (muted) → #1f1d1e (ink)
   - Boolean props mirror Figma: Show action / Show year. */
function WorkRow({
  name,
  info,
  year,
  action = '→ action',
  state,
  platform = 'desktop',
  showAction = true,
  showYear = true,
  forceHover,
  interactive = true,
}: {
  name: string
  info: string
  year: string
  action?: string
  state?: 'default' | 'hover'
  platform?: 'desktop' | 'mobile'
  showAction?: boolean
  showYear?: boolean
  forceHover?: boolean
  interactive?: boolean
}) {
  const [hover, setHover] = useState(false)
  const isHover = forceHover || (state === 'hover') || (interactive && hover && !state)

  const baseText: React.CSSProperties = {
    fontSize: 20,
    lineHeight: '28px',
    letterSpacing: '-0.01em',
    fontWeight: 400,
  }
  const transitionColor = 'color 200ms cubic-bezier(0.4,0,0.2,1)'

  // colors that flip on hover
  const dimColor = isHover ? C.ink : C.textMuted

  if (platform === 'mobile') {
    return (
      <div
        className="flex flex-col"
        style={{ ...fontStyle, gap: 4 }}
        onMouseEnter={() => interactive && !state && setHover(true)}
        onMouseLeave={() => interactive && !state && setHover(false)}
      >
        <div style={{ ...baseText, color: C.ink, maxWidth: 220 }}>{name}</div>
        <div style={{ ...baseText, color: dimColor, transition: transitionColor }}>{info}</div>
        {(showAction || showYear) && (
          <div className="flex items-center" style={{ gap: 16 }}>
            {showAction && <span style={{ ...baseText, color: C.ink }}>{action}</span>}
            {showYear && (
              <span style={{ ...baseText, color: dimColor, transition: transitionColor }}>{year}</span>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className="flex items-center"
      style={{ gap: 32, ...fontStyle, width: '100%' }}
      onMouseEnter={() => interactive && !state && setHover(true)}
      onMouseLeave={() => interactive && !state && setHover(false)}
    >
      <div style={{ ...baseText, color: C.ink, width: 220, flexShrink: 0 }}>{name}</div>
      <div
        style={{ ...baseText, color: dimColor, flex: 1, transition: transitionColor }}
      >
        {info}
      </div>
      {(showAction || showYear) && (
        <div className="flex items-center" style={{ gap: 32 }}>
          {showAction && (
            <span style={{ ...baseText, color: C.ink, width: 170, display: 'inline-block' }}>
              {action}
            </span>
          )}
          {showYear && (
            <span
              style={{
                ...baseText,
                color: dimColor,
                width: 170,
                display: 'inline-block',
                transition: transitionColor,
              }}
            >
              {year}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/* ======================================================================
   CARDS
   ====================================================================== */

/* blog — 315×68, r:8, p:4/16/4/4, surface bg, border, gap 42, p-align space-between */
/* blog — 702:2578 (Default + Hover via 702:2584)
   315×68. r:8, p:4/16/4/4, gap 42, surfaceLight bg, border #e2e2e2.
   Hover bg → surfaceLightHover (#f2f2f2). Arrow nudges ↗ on hover. */
function BlogCard({
  title = 'Research: How AI changes UX patterns',
  image = '/components/blog-1.png',
  forceHover,
}: {
  title?: string
  image?: string
  forceHover?: boolean
}) {
  const [hover, setHover] = useState(false)
  const isHover = forceHover || hover
  return (
    <a
      href="#"
      className="flex items-center justify-between rounded-[8px] border"
      style={{
        ...fontStyle,
        width: 315,
        height: 68,
        background: isHover ? C.surfaceLightHover : C.surfaceLight,
        borderColor: C.border,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 4,
        paddingRight: 16,
        gap: 42,
        transition: 'background-color 200ms cubic-bezier(0.4,0,0.2,1)',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex items-center" style={{ gap: 10 }}>
        <div className="block h-[58px] w-[58px] shrink-0 overflow-hidden rounded-[6px]">
          <img src={image} alt="" className="h-full w-full object-cover" />
        </div>
        <div
          style={{
            color: C.ink,
            fontSize: 15,
            lineHeight: '20px',
            fontWeight: 400,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </div>
      </div>
      <span
        className="flex h-6 w-6 items-center justify-center"
        style={{
          transform: isHover ? 'translate(2px, -2px)' : 'translate(0, 0)',
          transition: 'transform 220ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <path d="M1 8L8 1M2 1h6v6" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  )
}

/* full-blog — 702:2589. 315×160, layout VERTICAL gap 5.
   "last updates:" label: 12px Suisse Intl, line-height 14, letter-spacing 4%, UPPERCASE,
   ink color with opacity 0.6 (per Figma). */
function FullBlog() {
  return (
    <div className="flex flex-col" style={{ width: 315, gap: 5 }}>
      <div
        style={{
          ...fontStyle,
          fontSize: 12,
          lineHeight: '14px',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: C.ink,
          opacity: 0.6,
        }}
      >
        last updates:
      </div>
      <BlogCard title="Research: How AI changes UX patterns" image="/components/blog-1.png" />
      <BlogCard title="Our AI tools library" image="/components/blog-2.png" />
    </div>
  )
}

/* ServiceCard — 380×216, r:12, surface bg, p:100/20/20/20, gap 4 */
function ServiceCard({ title, description }: { title: string; description: string }) {
  return (
    <div
      className="flex flex-col justify-end rounded-[12px]"
      style={{
        width: 380,
        height: 216,
        background: C.surfaceLight,
        paddingTop: 100,
        paddingRight: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        gap: 4,
        ...fontStyle,
      }}
    >
      <div style={{ color: C.ink, fontSize: 28, lineHeight: '36px', fontWeight: 400 }}>{title}</div>
      <div
        style={{
          color: C.ink,
          fontSize: 20,
          lineHeight: '28px',
          letterSpacing: '-0.01em',
          fontWeight: 400,
        }}
      >
        {description}
      </div>
    </div>
  )
}

/* ArticleCard — 420×520, gap 12, image 420×420 r:12 */
function ArticleCard() {
  return (
    <div className="flex flex-col" style={{ width: 420, gap: 12, ...fontStyle }}>
      <div
        className="rounded-[12px]"
        style={{
          width: 420,
          height: 420,
          background:
            'linear-gradient(135deg, #1f1d1e 0%, #312f30 60%, #1f1d1e 100%)',
        }}
      >
        <div className="p-4">
          <Tag variant="surface">Label</Tag>
        </div>
      </div>
      <div style={{ color: C.ink, fontSize: 20, lineHeight: '28px', letterSpacing: '-0.01em' }}>
        Title. Exampled line on very long text and descriptions
      </div>
      <div style={{ color: C.textDim, fontSize: 15, lineHeight: '20px' }}>by Name Surname, Role</div>
    </div>
  )
}

/* CaseStudyCard — 620×512, gap 12, image 620×430 r:12 */
function CaseStudyCard() {
  return (
    <div className="flex flex-col" style={{ width: 620, gap: 12, ...fontStyle }}>
      <div
        className="rounded-[12px]"
        style={{
          width: 620,
          height: 430,
          background: 'linear-gradient(135deg, #1f1d1e 0%, #312f30 60%, #1f1d1e 100%)',
        }}
      />
      <div style={{ color: C.ink, fontSize: 28, lineHeight: '36px' }}>Project name. Description</div>
      <div className="flex flex-wrap gap-1">
        <Tag variant="accent">Label</Tag>
        <Tag variant="surface">Label</Tag>
        <Tag variant="surface">Label</Tag>
      </div>
    </div>
  )
}

/* ======================================================================
   PATTERNS
   ====================================================================== */

/* FAQItem — 702:2593
   4 states: (default | hover) × (open=no | open=yes)
   - 838×62 collapsed, 838×90 expanded
   - r:12, p:20 all sides, gap 8 when open
   - default border #e2e2e2, hover border #1f1d1e (ink)
   - Question 20/28 -1% ink
   - Answer 15/20 #999999 (textDim) */

/* Static side-by-side demo of all 4 Figma variants */
function FAQStatesDemo() {
  return (
    <div className="flex flex-col" style={{ width: '100%', maxWidth: 838, gap: 16 }}>
      <FAQStaticItem hover={false} open={false} />
      <FAQStaticItem hover open={false} />
      <FAQStaticItem hover={false} open />
      <FAQStaticItem hover open />
    </div>
  )
}

function FAQStaticItem({ hover, open }: { hover: boolean; open: boolean }) {
  return (
    <div
      className="rounded-[12px] border"
      style={{
        ...fontStyle,
        background: C.white,
        borderColor: hover ? C.ink : C.border,
        padding: 20,
      }}
    >
      <div className="flex w-full items-center justify-between" style={{ gap: 8 }}>
        <span
          style={{
            color: C.ink,
            fontSize: 20,
            lineHeight: '28px',
            letterSpacing: '-0.01em',
            fontWeight: 400,
          }}
        >
          Question
        </span>
        <span className="relative flex h-6 w-6 shrink-0 items-center justify-center" aria-hidden>
          <span
            className="absolute"
            style={{
              width: 16,
              height: 2,
              background: C.ink,
              borderRadius: 1,
              transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            }}
          />
          <span
            className="absolute"
            style={{
              width: 16,
              height: 2,
              background: C.ink,
              borderRadius: 1,
              transform: open ? 'rotate(-45deg)' : 'rotate(90deg)',
            }}
          />
        </span>
      </div>
      {open ? (
        <div
          style={{
            color: C.textDim,
            fontSize: 15,
            lineHeight: '20px',
            paddingTop: 8,
          }}
        >
          Answer
        </div>
      ) : null}
    </div>
  )
}

function FAQDemo() {
  const [open, setOpen] = useState<number | null>(2)
  const items = [
    { q: 'What is an embedded designer?', a: 'A senior designer who joins your team in 1–2 weeks.' },
    { q: 'How do you measure success?', a: 'We agree on outcomes upfront and review every two weeks.' },
    { q: 'Can we replace our designer?', a: 'No. We embed alongside your team and elevate their work.' },
    { q: 'What does pricing look like?', a: 'Flat monthly fee per embedded designer.' },
  ]
  return (
    <div className="flex flex-col" style={{ width: 838, gap: 32 }}>
      {items.map((it, i) => (
        <FAQItem
          key={it.q}
          question={it.q}
          answer={it.a}
          open={open === i}
          onToggle={() => setOpen(open === i ? null : i)}
        />
      ))}
    </div>
  )
}

function FAQItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string
  answer: string
  open: boolean
  onToggle: () => void
}) {
  const [hover, setHover] = useState(false)
  return (
    <div
      className="rounded-[12px] border"
      style={{
        ...fontStyle,
        background: C.white,
        borderColor: hover || open ? C.ink : C.border,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        transition: 'border-color 220ms cubic-bezier(0.4,0,0.2,1)',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button onClick={onToggle} className="flex w-full items-center justify-between" style={{ gap: 8 }}>
        <span
          style={{
            color: C.ink,
            fontSize: 20,
            lineHeight: '28px',
            letterSpacing: '-0.01em',
            fontWeight: 400,
            textAlign: 'left',
            flex: 1,
          }}
        >
          {question}
        </span>
        <span className="relative flex h-6 w-6 shrink-0 items-center justify-center" aria-hidden>
          {/* horizontal bar → rotates 45° when open (forms × close) */}
          <span
            className="absolute"
            style={{
              width: 16,
              height: 2,
              background: C.ink,
              borderRadius: 1,
              transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
              transition: 'transform 320ms cubic-bezier(0.4,0,0.2,1)',
            }}
          />
          {/* vertical bar → rotates to -45° when open */}
          <span
            className="absolute"
            style={{
              width: 16,
              height: 2,
              background: C.ink,
              borderRadius: 1,
              transform: open ? 'rotate(-45deg)' : 'rotate(90deg)',
              transition: 'transform 320ms cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        </span>
      </button>
      <div
        className="grid"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 320ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div
            style={{
              color: C.textDim,
              fontSize: 15,
              lineHeight: '20px',
              paddingTop: 8,
              opacity: open ? 1 : 0,
              transition: 'opacity 240ms cubic-bezier(0.4,0,0.2,1)',
              transitionDelay: open ? '120ms' : '0ms',
            }}
          >
            {answer}
          </div>
        </div>
      </div>
    </div>
  )
}

/* AnimatedStat — counts up from 0 to target value with smooth ease-out cubic.
   Triggered once when scrolled into view. Parses values like "12.3m", "+240%", "+5.7m".
   Honors prefers-reduced-motion. */
function AnimatedStat({
  value,
  durationMs = 900,
  startRatio = 0.75,
  className,
  style,
}: {
  value: string
  durationMs?: number
  /** how much of the target to start from (0-1). 0.75 = animates only the last 25% */
  startRatio?: number
  className?: string
  style?: React.CSSProperties
}) {
  const m = value.match(/^([+-]?)([0-9.]+)([a-zA-Z%]*)$/)
  const prefix = m ? m[1] : ''
  const numStr = m ? m[2] : '0'
  const suffix = m ? m[3] : ''
  const target = parseFloat(numStr)
  const decimals = (numStr.split('.')[1] || '').length
  const startVal = target * startRatio

  const ref = useRef<HTMLSpanElement>(null)
  const [trigger, setTrigger] = useState(false)
  const [current, setCurrent] = useState(startVal)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(target)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setTrigger(true)
          obs.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])

  useEffect(() => {
    if (!trigger) return
    let raf = 0
    const start = performance.now()
    // easeOutQuart — gentle deceleration that settles softly without overshoot
    const ease = (t: number) => 1 - Math.pow(1 - t, 4)
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1)
      setCurrent(startVal + (target - startVal) * ease(t))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [trigger, target, startVal, durationMs])

  if (!m) return <span className={className} style={style}>{value}</span>
  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {current.toFixed(decimals)}
      {suffix}
    </span>
  )
}

/* TestimonialFeatured — 702:2705. 6 variants: (yellow|gray|white) × (desktop|mobile)
   - yellow desktop: 1179×370, stat on the RIGHT
   - gray/white desktop: 690×370, stat BELOW quote, next to person row
   - mobile: 359×551, stacked vertical (tags → stat → quote → person)
   - Padding 40 desktop / 20 mobile, radius 12, gap 59 between top and bottom */
type TestimonialColour = 'yellow' | 'gray' | 'white'
type TestimonialPlatform = 'desktop' | 'mobile'

const TESTIMONIAL_BG: Record<TestimonialColour, string> = {
  yellow: C.yellow,
  gray: C.surfaceLight,
  white: C.white,
}

function TestimonialFeatured({
  colour = 'yellow',
  platform = 'desktop',
  quote,
  name = 'Samantha Park',
  role = 'Product Manager, Stockpile',
  stat,
  statLabel = 'App users on a single product we designed',
  avatar1 = '/components/avatar.jpg',
  avatar2 = '/components/avatar.jpg',
}: {
  colour?: TestimonialColour
  platform?: TestimonialPlatform
  quote: string
  name?: string
  role?: string
  stat: string
  statLabel?: string
  avatar1?: string
  avatar2?: string
}) {
  const bg = TESTIMONIAL_BG[colour]
  const isMobile = platform === 'mobile'
  const isYellowDesktop = !isMobile && colour === 'yellow'
  const padding = isMobile ? 20 : 40
  const width = isMobile ? 359 : isYellowDesktop ? 1179 : 690

  /* Avatar bubble — uses the card's bg as the border color so the second
     overlapping avatar reads as a stacked group, like in Figma. */
  const Avatars = () => (
    <div className="flex">
      <div
        className="h-[50px] w-[50px] shrink-0 overflow-hidden rounded-full border-[3px]"
        style={{ borderColor: bg }}
      >
        <img src={avatar1} alt="" className="h-full w-full object-cover" />
      </div>
      <div
        className="-ml-2 h-[50px] w-[50px] shrink-0 overflow-hidden rounded-full border-[3px]"
        style={{ borderColor: bg }}
      >
        <img src={avatar2} alt="" className="h-full w-full object-cover" />
      </div>
    </div>
  )

  const PersonRow = () => (
    <div className="flex items-center" style={{ gap: 12 }}>
      <Avatars />
      <div style={{ color: C.ink, fontSize: 15, lineHeight: '20px' }}>
        {name}
        <br />
        <span style={{ color: C.textMuted }}>{role}</span>
      </div>
    </div>
  )

  const StatBlock = ({ width: w }: { width?: number }) => (
    <div className="flex flex-col" style={{ width: w, gap: 8 }}>
      <div
        style={{
          color: C.ink,
          fontSize: 66,
          lineHeight: '56px',
          letterSpacing: '-0.01em',
          fontWeight: 400,
        }}
      >
        <AnimatedStat value={stat} />
      </div>
      <div
        style={{
          color: C.ink,
          fontSize: 12,
          lineHeight: '14px',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        {statLabel}
      </div>
    </div>
  )

  const Tags = () => (
    <div className="flex" style={{ gap: 8 }}>
      <Tag variant="dark">Label</Tag>
      <Tag variant="surface">Label</Tag>
    </div>
  )

  const Quote = ({ size = 28, lh = 36 }: { size?: number; lh?: number }) => (
    <div
      style={{
        color: C.ink,
        fontSize: size,
        lineHeight: `${lh}px`,
        fontWeight: 400,
        letterSpacing: '-0.01em',
      }}
    >
      {quote}
    </div>
  )

  // Yellow desktop: HORIZONTAL — left (quote+person stacked) + right (stat)
  if (isYellowDesktop) {
    return (
      <div
        className="flex"
        style={{
          ...fontStyle,
          width,
          background: bg,
          borderRadius: 12,
          padding,
          gap: 40,
        }}
      >
        <div className="flex flex-1 flex-col justify-between" style={{ gap: 59 }}>
          <div className="flex flex-col" style={{ gap: 20 }}>
            <Tags />
            <div style={{ maxWidth: 650 }}>
              <Quote />
            </div>
          </div>
          <PersonRow />
        </div>
        <StatBlock width={174} />
      </div>
    )
  }

  // Gray/white desktop: VERTICAL with quote+tags top, then person+stat row
  if (!isMobile) {
    return (
      <div
        className="flex flex-col"
        style={{
          ...fontStyle,
          width,
          background: bg,
          borderRadius: 12,
          padding,
          gap: 59,
        }}
      >
        <div className="flex flex-col" style={{ gap: 20 }}>
          <Tags />
          <Quote size={24} lh={28} />
        </div>
        <div className="flex items-end justify-between" style={{ gap: 40 }}>
          <PersonRow />
          <StatBlock width={166} />
        </div>
      </div>
    )
  }

  // Mobile (all colours): VERTICAL stack, smaller padding & quote
  return (
    <div
      className="flex flex-col"
      style={{
        ...fontStyle,
        width,
        background: bg,
        borderRadius: 12,
        padding,
        gap: 59,
      }}
    >
      <div className="flex flex-col" style={{ gap: 20 }}>
        <Tags />
        <StatBlock />
        <Quote size={24} lh={28} />
      </div>
      <PersonRow />
    </div>
  )
}

/* CTABanner — 1280×554, r:12, ink bg, p:40, vertical SPACE_BETWEEN */
function CTABanner() {
  return (
    <div
      className="flex flex-col justify-between rounded-[12px]"
      style={{
        ...fontStyle,
        width: 1280,
        height: 554,
        background: C.ink,
        padding: 40,
      }}
    >
      <div className="flex flex-col" style={{ gap: 0 }}>
        <div className="h-[51px] w-[51px] overflow-hidden rounded-full">
          <img src="/components/avatar.jpg" alt="" className="h-full w-full object-cover" />
        </div>
        <h3
          className="mt-6 max-w-[1100px]"
          style={{
            color: C.white,
            fontSize: 48,
            lineHeight: '56px',
            letterSpacing: '-0.02em',
            fontWeight: 400,
          }}
        >
          Get a senior designer inside your team.{' '}
          <a className="underline" href="#" style={{ color: C.white }}>Book an intro call</a> or{' '}
          <a className="underline" href="mailto:hi@otherland.studio" style={{ color: C.white }}>
            hi@otherland.studio
          </a>
        </h3>
      </div>
      <ul className="flex flex-col" style={{ gap: 8 }}>
        {[
          'Senior designer embedded in your team within 1–2 weeks',
          'Backed by product and design leads (60+ products)',
          'Faster delivery with AI-powered workflows',
        ].map((b) => (
          <li key={b} className="flex items-center" style={{ gap: 8 }}>
            <span className="flex h-6 w-6 items-center justify-center">
              <IconCheck />
            </span>
            <span style={{ color: C.textDim, fontSize: 15, lineHeight: '20px' }}>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* Domains — 1280×76 collapsed row · ink yellow tag at right */
function DomainsDemo() {
  const [open, setOpen] = useState(0)
  const items: Array<{ name: string; count: number; projects: Array<{ name: string; info: string; year: string }> }> = [
    {
      name: 'B2B SaaS',
      count: 7,
      projects: [
        { name: 'Asper', info: 'AI platform for planning purchases', year: '2026' },
        { name: 'Cricut', info: 'Software for cutting machines', year: '2022 – ongoing' },
        { name: 'Sides', info: 'SaaS platform for restaurant management', year: '2022–2024' },
        { name: 'eAuthor', info: 'Business learning and training materials', year: '2023' },
        { name: 'Accessia', info: 'Open cloud physical security platform', year: '2023' },
        { name: 'Sells AI', info: 'AI-powered sales widgets', year: '2022' },
        { name: 'B Lunch', info: 'Corporate food ordering platform', year: '2021' },
      ],
    },
    { name: 'Fintech', count: 3, projects: [
      { name: 'Stockpile', info: 'Investing platform', year: '2024' },
      { name: 'RAKBank', info: 'Mobile banking experience', year: '2023' },
      { name: 'Migros Bank', info: 'Web & mobile banking redesign', year: '2022' },
    ]},
    { name: 'Consumer', count: 2, projects: [
      { name: 'DRESSX', info: 'Digital fashion marketplace', year: '2024' },
      { name: 'Beanz', info: 'Loyalty rewards app', year: '2023' },
    ]},
  ]
  return (
    <div className="flex flex-col" style={{ width: '100%', maxWidth: 1280, gap: 8, ...fontStyle }}>
      {items.map((d, i) => (
        <DomainsRow
          key={d.name}
          domain={d}
          open={open === i}
          onToggle={() => setOpen(open === i ? -1 : i)}
        />
      ))}
    </div>
  )
}

function DomainsRow({
  domain,
  open,
  onToggle,
}: {
  domain: { name: string; count: number; projects: Array<{ name: string; info: string; year: string }> }
  open: boolean
  onToggle: () => void
}) {
  const [hover, setHover] = useState(false)
  return (
    <div
      className="rounded-[12px]"
      style={{
        background: hover ? C.surfaceLightHover : C.surfaceLight,
        padding: 20,
        transition: 'background-color 220ms cubic-bezier(0.4,0,0.2,1)',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button onClick={onToggle} className="flex w-full items-center justify-between" style={{ gap: 40 }}>
        <div className="flex items-center" style={{ gap: 12 }}>
          <span style={{ color: C.ink, fontSize: 28, lineHeight: '36px', fontWeight: 400 }}>{domain.name}</span>
          <span
            className="inline-flex items-center justify-center rounded-[4px] px-1.5"
            style={{
              background: C.ink,
              color: C.surfaceLight,
              height: 22,
              minWidth: 23,
              fontSize: 12,
              lineHeight: '14px',
              letterSpacing: '0.04em',
            }}
          >
            {domain.count}
          </span>
        </div>
        <span className="relative flex h-6 w-6 items-center justify-center" aria-hidden>
          <span
            className="absolute"
            style={{
              width: 14,
              height: 1.6,
              background: C.ink,
              borderRadius: 1,
              transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
              transition: 'transform 320ms cubic-bezier(0.4,0,0.2,1)',
            }}
          />
          <span
            className="absolute"
            style={{
              width: 14,
              height: 1.6,
              background: C.ink,
              borderRadius: 1,
              transform: open ? 'rotate(-45deg)' : 'rotate(90deg)',
              transition: 'transform 320ms cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        </span>
      </button>
      <div
        className="grid"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 360ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <ul
            className="mt-5 flex flex-col"
            style={{
              gap: 0,
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(-4px)',
              transition:
                'opacity 240ms cubic-bezier(0.4,0,0.2,1), transform 320ms cubic-bezier(0.4,0,0.2,1)',
              transitionDelay: open ? '120ms' : '0ms',
            }}
          >
            {domain.projects.map((p) => (
              <li
                key={p.name}
                className="grid items-center"
                style={{
                  gap: 32,
                  gridTemplateColumns: 'minmax(140px, 220px) 1fr minmax(110px, 170px) minmax(110px, 170px)',
                  paddingTop: 8,
                  paddingBottom: 8,
                }}
              >
                <span style={{ color: C.ink, fontSize: 20, lineHeight: '28px', letterSpacing: '-0.01em' }}>
                  {p.name}
                </span>
                <span style={{ color: C.textMuted, fontSize: 20, lineHeight: '28px', letterSpacing: '-0.01em' }}>
                  {p.info}
                </span>
                <span style={{ color: C.ink, fontSize: 20, lineHeight: '28px', letterSpacing: '-0.01em' }}>
                  → action
                </span>
                <span
                  style={{
                    color: C.textMuted,
                    fontSize: 20,
                    lineHeight: '28px',
                    letterSpacing: '-0.01em',
                    textAlign: 'right',
                  }}
                >
                  {p.year}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ======================================================================
   LAYOUT
   ====================================================================== */

/* Navbar — 702:2536
   3 variants:
   - desktop, mobile state=no   (1280×56)
   - mobile, mobile state=closed (359×44)
   - mobile, mobile state=opened (359×365) */
const NAV_LINKS = ['Other Land', 'Works', 'Services', 'About', 'Insights', 'Contacts']

function Navbar() {
  return (
    <div
      className="flex w-full items-center justify-between"
      style={{ ...fontStyle, width: '100%', maxWidth: 1280 }}
    >
      <div className="flex items-center" style={{ gap: 1 }}>
        <Logo />
        <span
          aria-hidden
          className="mx-2 inline-block"
          style={{ width: 1, height: 24, background: C.border }}
        />
        <div className="flex h-[44px] items-center rounded-[8px]" style={{ gap: 1 }}>
          {NAV_LINKS.map((l) => (
            <NavbarItem key={l} label={l} active={l === 'Works'} />
          ))}
        </div>
      </div>
      <ButtonPrimary>Book a call</ButtonPrimary>
    </div>
  )
}

/* Mobile navbar — closed (44h) or opened (365h) */
function NavbarMobile({ open: initialOpen = false }: { open?: boolean }) {
  const [open, setOpen] = useState(initialOpen)
  return (
    <div
      className="flex flex-col"
      style={{
        ...fontStyle,
        width: 359,
        gap: 4,
      }}
    >
      {/* top row: logo + toggle */}
      <div className="flex items-center justify-between" style={{ width: 359, height: 44 }}>
        <Logo />
        <NavbarItem
          variant="icon"
          icon={open ? 'close' : 'burger'}
          onClick={() => setOpen(!open)}
        />
      </div>

      {/* expanding menu */}
      <div
        className="grid"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 320ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div
            className="flex flex-col"
            style={{
              gap: 1,
              borderRadius: 8,
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(-4px)',
              transition:
                'opacity 220ms cubic-bezier(0.4,0,0.2,1), transform 320ms cubic-bezier(0.4,0,0.2,1)',
              transitionDelay: open ? '120ms' : '0ms',
            }}
          >
            {NAV_LINKS.map((l) => (
              <NavbarItem key={l} label={l} active={l === 'Works'} full />
            ))}
          </div>
          {/* Book a call full-width button */}
          <button
            className="mt-1 inline-flex h-[44px] w-full items-center justify-center rounded-[6px]"
            style={{
              ...fontStyle,
              background: C.ink,
              color: C.white,
              fontSize: 20,
              lineHeight: '28px',
              letterSpacing: '-0.01em',
              fontWeight: 400,
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(-4px)',
              transition:
                'opacity 220ms cubic-bezier(0.4,0,0.2,1), transform 320ms cubic-bezier(0.4,0,0.2,1), background-color 200ms',
              transitionDelay: open ? '180ms' : '0ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.inkHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.ink)}
          >
            Book a call
          </button>
        </div>
      </div>
    </div>
  )
}

/* NavbarItem (Works) — 702:2527
   4 states: Default | Hover | Active | icon
   Figma: bg = #f7f7f7 always; text muted (#808080) by default, ink (#1f1d1e) on hover/active.
   icon variant: 44×44 square containing X (24×24 frame with two ink bars at ±45°). */
function NavbarItem({
  label,
  active,
  variant = 'text',
  full,
  icon = 'close',
  onClick,
}: {
  label?: string
  active?: boolean
  variant?: 'text' | 'icon'
  full?: boolean
  icon?: 'close' | 'burger'
  onClick?: () => void
}) {
  const [hover, setHover] = useState(false)
  const isHighlighted = hover || active

  const sharedStyle: React.CSSProperties = {
    ...fontStyle,
    background: C.surfaceLight,
    transition:
      'background-color 200ms cubic-bezier(0.4,0,0.2,1), color 200ms cubic-bezier(0.4,0,0.2,1)',
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-[8px]"
        style={sharedStyle}
        aria-label={icon === 'burger' ? 'Open menu' : 'Close menu'}
      >
        {icon === 'burger' ? (
          <span className="flex flex-col" style={{ width: 16, gap: 4 }} aria-hidden>
            <span style={{ width: 16, height: 2, background: C.ink, borderRadius: 1 }} />
            <span style={{ width: 16, height: 2, background: C.ink, borderRadius: 1 }} />
            <span style={{ width: 16, height: 2, background: C.ink, borderRadius: 1 }} />
          </span>
        ) : (
          <span className="relative flex h-6 w-6 items-center justify-center" aria-hidden>
            <span
              className="absolute"
              style={{
                width: 16,
                height: 2,
                background: C.ink,
                borderRadius: 1,
                transform: 'rotate(45deg)',
              }}
            />
            <span
              className="absolute"
              style={{
                width: 16,
                height: 2,
                background: C.ink,
                borderRadius: 1,
                transform: 'rotate(-45deg)',
              }}
            />
          </span>
        )}
      </button>
    )
  }

  return (
    <a
      href="#"
      className={`inline-flex h-[44px] items-center justify-center rounded-[8px] ${full ? 'w-full' : ''}`}
      style={{
        ...sharedStyle,
        paddingLeft: 12,
        paddingRight: 12,
        color: isHighlighted ? C.ink : C.textMuted,
        fontSize: 20,
        lineHeight: '28px',
        letterSpacing: '-0.01em',
        fontWeight: 400,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {label}
    </a>
  )
}

/* All 4 states demo (Default / Hover / Active / icon) */
function NavbarItemStates() {
  return (
    <div className="flex items-end" style={{ gap: 24 }}>
      {(['Default', 'Hover', 'Active', 'icon'] as const).map((state) => (
        <div key={state} className="flex flex-col" style={{ gap: 10 }}>
          <span style={{ ...fontStyle, fontSize: 12, color: C.textMuted, letterSpacing: '0.04em' }}>
            {state.toUpperCase()}
          </span>
          <NavbarItemStateSample state={state} />
        </div>
      ))}
    </div>
  )
}

function NavbarItemStateSample({ state }: { state: 'Default' | 'Hover' | 'Active' | 'icon' }) {
  if (state === 'icon') return <NavbarItem variant="icon" />

  const isInk = state === 'Hover' || state === 'Active'
  return (
    <div
      className="inline-flex h-[44px] items-center justify-center rounded-[8px]"
      style={{
        ...fontStyle,
        background: C.surfaceLight,
        paddingLeft: 12,
        paddingRight: 12,
        color: isInk ? C.ink : C.textMuted,
        fontSize: 20,
        lineHeight: '28px',
        letterSpacing: '-0.01em',
        fontWeight: 400,
      }}
    >
      Works
    </div>
  )
}

/* Footer — 1280×216, p:40 vertical, 4 columns SPACE_BETWEEN, gap 4 column-internal */
function Footer() {
  const linkBase: React.CSSProperties = {
    ...fontStyle,
    color: C.ink,
    fontSize: 20,
    lineHeight: '28px',
    letterSpacing: '-0.01em',
    textDecoration: 'none',
  }
  const subBase: React.CSSProperties = {
    ...fontStyle,
    color: C.textMuted,
    fontSize: 15,
    lineHeight: '20px',
  }
  return (
    <div
      className="flex flex-col"
      style={{
        ...fontStyle,
        width: 1280,
        paddingTop: 40,
        paddingBottom: 40,
        gap: 40,
      }}
    >
      <div className="flex w-full items-start justify-between">
        <div className="flex flex-col" style={{ gap: 8 }}>
          <a href="#" style={linkBase}>Works</a>
          <a href="#" style={linkBase}>Services</a>
          <a href="#" style={linkBase}>About</a>
          <a href="#" style={linkBase}>Insights</a>
        </div>
        <div className="flex flex-col" style={{ gap: 4 }}>
          <a href="mailto:hi@otherland.studio" style={linkBase}>hi@otherland.studio</a>
          <span style={subBase}>(for inquiries)</span>
        </div>
        <div className="flex flex-col" style={{ gap: 4 }}>
          <span style={linkBase}>
            120 Walker St 3rd Floor,
            <br />
            New York, NY 10013
          </span>
          <a href="#" style={subBase}>Privacy policy</a>
        </div>
        <div className="flex flex-col" style={{ gap: 4 }}>
          <a href="#" style={linkBase}>Linkedin</a>
          <a href="#" style={linkBase}>Instagram</a>
          <span style={subBase}>© Other Land LLC</span>
        </div>
      </div>
    </div>
  )
}
