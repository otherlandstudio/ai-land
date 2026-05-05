'use client'

/* ======================================================================
   Site components — extracted 1:1 from src/app/components/page.tsx.
   Reused across /components (style guide) and /landing (real page).
   File EGHpyw3BfFgVioOCbKWHzK · Page 6.
   ====================================================================== */

import { useEffect, useRef, useState } from 'react'

export const C = {
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

export const fontStyle = { fontFamily: C.bodyFont } as const

/* ======================================================================
   ATOMS
   ====================================================================== */

export function Logo() {
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

export function LogoCircle() {
  return (
    <div className="h-[48px] w-[48px] overflow-hidden rounded-full">
      <img src="/components/logo-ol.png" alt="OL" className="h-full w-full object-cover" />
    </div>
  )
}

export type TagVariant = 'accent' | 'surface' | 'dark' | 'subtle' | 'overlay'

export function Tag({
  children,
  variant,
}: {
  children: React.ReactNode
  variant: TagVariant
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

export type FigmaIconName =
  | 'plus'
  | 'burger'
  | 'close'
  | 'arrow'
  | 'prohibit'
  | 'user-add'
  | 'sparkle'
  | 'warning'
  | 'check'

export function FigmaIcon({
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

const stroke = {
  stroke: C.ink,
  strokeWidth: 2,
  fill: 'none' as const,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="9" fill={C.ink} />
      <path
        d="M5.5 10.5L8.5 13.5L14.5 6.5"
        stroke="#fff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ======================================================================
   BUTTONS & CTAs
   ====================================================================== */

export function ButtonPrimary({
  children,
  forceHover,
  onClick,
}: {
  children: React.ReactNode
  forceHover?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
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

export function ButtonIntroCall({
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

export function ButtonMoreWorks({
  children,
  count,
}: {
  children: React.ReactNode
  count: number
}) {
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
   FILTER CHIP — used in "Situations" section
   ====================================================================== */

export function FilterChip({
  children,
  active,
  onClick,
  icon,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
  /** Optional Figma icon name. Defaults to chevron-down (rotates 180° when active). */
  icon?: FigmaIconName
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
      {icon ? (
        <FigmaIcon name={icon} size={20} />
      ) : (
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
      )}
      <span style={{ fontSize: 15, lineHeight: '20px', fontWeight: 400 }}>{children}</span>
    </button>
  )
}

/* ======================================================================
   WorkRow — Project list row
   ====================================================================== */

export function WorkRow({
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
  const isHover = forceHover || state === 'hover' || (interactive && hover && !state)

  const baseText: React.CSSProperties = {
    fontSize: 20,
    lineHeight: '28px',
    letterSpacing: '-0.01em',
    fontWeight: 400,
  }
  const transitionColor = 'color 200ms cubic-bezier(0.4,0,0.2,1)'
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
      <div style={{ ...baseText, color: dimColor, flex: 1, transition: transitionColor }}>{info}</div>
      {(showAction || showYear) && (
        <div className="flex items-center" style={{ gap: 32 }}>
          {showAction && (
            <span style={{ ...baseText, color: C.ink, width: 170, display: 'inline-block' }}>{action}</span>
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

export function BlogCard({
  title = 'Research: How AI changes UX patterns',
  image = '/components/blog-1.png',
  href = '#',
  forceHover,
}: {
  title?: string
  image?: string
  href?: string
  forceHover?: boolean
}) {
  const [hover, setHover] = useState(false)
  const isHover = forceHover || hover
  return (
    <a
      href={href}
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

export function FullBlog({
  label = 'last updates:',
  items = [
    { title: 'Research: How AI changes UX patterns', image: '/components/blog-1.png', href: '#' },
    { title: 'Our AI tools library', image: '/components/blog-2.png', href: '/' },
  ],
}: {
  label?: string
  items?: Array<{ title: string; image: string; href?: string }>
} = {}) {
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
        {label}
      </div>
      {items.map((it) => (
        <BlogCard key={it.title} title={it.title} image={it.image} href={it.href} />
      ))}
    </div>
  )
}

export function ServiceCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div
      className="flex flex-col justify-end rounded-[12px]"
      style={{
        width: '100%',
        minHeight: 216,
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

export function ArticleCard({
  title = 'Title. Exampled line on very long text and descriptions',
  author = 'by Name Surname, Role',
  tag = 'article',
  image,
}: {
  title?: string
  author?: string
  tag?: string
  image?: string
} = {}) {
  return (
    <div className="flex flex-col" style={{ width: '100%', gap: 12, ...fontStyle }}>
      <div
        className="rounded-[12px]"
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          background: image
            ? `center / cover no-repeat url(${image})`
            : 'linear-gradient(135deg, #1f1d1e 0%, #312f30 60%, #1f1d1e 100%)',
        }}
      >
        <div className="p-4">
          <Tag variant="surface">{tag}</Tag>
        </div>
      </div>
      <div style={{ color: C.ink, fontSize: 20, lineHeight: '28px', letterSpacing: '-0.01em' }}>
        {title}
      </div>
      <div style={{ color: C.textDim, fontSize: 15, lineHeight: '20px' }}>{author}</div>
    </div>
  )
}

export function CaseStudyCard({
  title = 'Project name. Description',
  tags = ['Label', 'Label', 'Label'],
  image,
}: {
  title?: string
  tags?: string[]
  image?: string
} = {}) {
  return (
    <div className="flex flex-col" style={{ width: '100%', gap: 12, ...fontStyle }}>
      <div
        className="rounded-[12px]"
        style={{
          width: '100%',
          aspectRatio: '636 / 441',
          background: image
            ? `center / cover no-repeat url(${image})`
            : 'linear-gradient(135deg, #1f1d1e 0%, #312f30 60%, #1f1d1e 100%)',
        }}
      />
      <div style={{ color: C.ink, fontSize: 28, lineHeight: '36px' }}>{title}</div>
      <div className="flex flex-wrap gap-1">
        {tags.map((t, i) => (
          <Tag key={i} variant={i === 0 ? 'accent' : 'surface'}>
            {t}
          </Tag>
        ))}
      </div>
    </div>
  )
}

/* ======================================================================
   FAQ
   ====================================================================== */

export function FAQItem({
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

/* ======================================================================
   AnimatedStat
   ====================================================================== */

export function AnimatedStat({
  value,
  durationMs = 900,
  startRatio = 0.75,
  className,
  style,
}: {
  value: string
  durationMs?: number
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

/* ======================================================================
   TestimonialFeatured
   ====================================================================== */

export type TestimonialColour = 'yellow' | 'gray' | 'white'
export type TestimonialPlatform = 'desktop' | 'mobile'

const TESTIMONIAL_BG: Record<TestimonialColour, string> = {
  yellow: C.yellow,
  gray: C.surfaceLight,
  white: C.white,
}

export function TestimonialFeatured({
  colour = 'yellow',
  platform = 'desktop',
  quote,
  name = 'Samantha Park',
  role = 'Product Manager, Stockpile',
  stat,
  statLabel = 'App users on a single product we designed',
  avatar1 = '/components/avatar.jpg',
  avatar2 = '/components/avatar.jpg',
  fullWidth,
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
  /** stretch desktop card to 100% (used when 2 cards share a row) */
  fullWidth?: boolean
}) {
  const bg = TESTIMONIAL_BG[colour]
  const isMobile = platform === 'mobile'
  const isYellowDesktop = !isMobile && colour === 'yellow'
  const padding = isMobile ? 20 : 40
  const width = fullWidth || !isMobile ? '100%' : 359

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
    <div className="flex flex-col shrink-0" style={{ width: w, minWidth: w, gap: 8 }}>
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
          minHeight: 370,
        }}
      >
        <div className="flex flex-col" style={{ gap: 20 }}>
          <Tags />
          <Quote size={24} lh={28} />
        </div>
        <div className="flex items-end justify-between" style={{ gap: 40 }}>
          <PersonRow />
          <StatBlock width={200} />
        </div>
      </div>
    )
  }

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

/* ======================================================================
   CTABanner
   ====================================================================== */

export function CTABanner({
  bullets = [
    'Senior designer embedded in your team within 1–2 weeks',
    'Backed by product and design leads (60+ products)',
    'Faster delivery with AI-powered workflows',
  ],
}: {
  bullets?: string[]
} = {}) {
  return (
    <div
      className="flex flex-col justify-between rounded-[12px]"
      style={{
        ...fontStyle,
        width: '100%',
        minHeight: 554,
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
          <a className="underline" href="#" style={{ color: C.white }}>
            Book an intro call
          </a>{' '}
          or{' '}
          <a className="underline" href="mailto:hi@otherland.studio" style={{ color: C.white }}>
            hi@otherland.studio
          </a>
        </h3>
      </div>
      <ul className="flex flex-col" style={{ gap: 8 }}>
        {bullets.map((b) => (
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

/* ======================================================================
   Domains accordion
   ====================================================================== */

export type DomainItem = {
  name: string
  count: number
  projects: Array<{ name: string; info: string; year: string }>
}

export function DomainsRow({
  domain,
  open,
  onToggle,
}: {
  domain: DomainItem
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
          <span style={{ color: C.ink, fontSize: 28, lineHeight: '36px', fontWeight: 400 }}>
            {domain.name}
          </span>
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

export function DomainsAccordion({ items, defaultOpen = 0 }: { items: DomainItem[]; defaultOpen?: number }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="flex flex-col" style={{ width: '100%', gap: 8, ...fontStyle }}>
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

/* ======================================================================
   LogoMarquee
   ====================================================================== */

export const CLIENT_LOGOS = [
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

export function LogoMarquee({ speedSec = 30 }: { speedSec?: number }) {
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
          <div className="flex shrink-0 items-center" style={{ gap: 40 }}>
            {trackContent}
          </div>
          <div className="flex shrink-0 items-center" style={{ gap: 40 }} aria-hidden>
            {trackContent}
          </div>
        </div>
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
   Navbar
   ====================================================================== */

export const NAV_LINKS = ['Other Land', 'Works', 'Services', 'About', 'Insights', 'Contacts']

export function Navbar({
  activeLabel = 'Works',
  onBookCall,
}: {
  activeLabel?: string
  onBookCall?: () => void
} = {}) {
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
            <NavbarItem key={l} label={l} active={l === activeLabel} />
          ))}
        </div>
      </div>
      <ButtonPrimary onClick={onBookCall}>Book a call</ButtonPrimary>
    </div>
  )
}

export function NavbarMobile({ open: initialOpen = false }: { open?: boolean }) {
  const [open, setOpen] = useState(initialOpen)
  return (
    <div className="flex flex-col" style={{ ...fontStyle, width: '100%', gap: 4 }}>
      <div className="flex items-center justify-between" style={{ width: '100%', height: 44 }}>
        <Logo />
        <NavbarItem variant="icon" icon={open ? 'close' : 'burger'} onClick={() => setOpen(!open)} />
      </div>
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

export function NavbarItem({
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
              style={{ width: 16, height: 2, background: C.ink, borderRadius: 1, transform: 'rotate(45deg)' }}
            />
            <span
              className="absolute"
              style={{ width: 16, height: 2, background: C.ink, borderRadius: 1, transform: 'rotate(-45deg)' }}
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

/* ======================================================================
   SiteFooter (Otherland — 4 columns)
   ====================================================================== */

export function SiteFooter() {
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
        width: '100%',
        paddingTop: 40,
        paddingBottom: 40,
        gap: 40,
      }}
    >
      <div className="flex w-full flex-wrap items-start justify-between" style={{ gap: 40 }}>
        <div className="flex flex-col" style={{ gap: 8 }}>
          <a href="#works" style={linkBase}>Works</a>
          <a href="#services" style={linkBase}>Services</a>
          <a href="#about" style={linkBase}>About</a>
          <a href="#insights" style={linkBase}>Insights</a>
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
