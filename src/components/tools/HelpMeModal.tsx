'use client'

import { useEffect, useState } from 'react'
import { buildHelpPrompt } from '@/lib/utils'
import type { Tool } from '@/lib/types'
import { useScrollLock } from '@/hooks/useScrollLock'

interface HelpMeModalProps {
  tool: Tool
  open: boolean
  onClose: () => void
}

const C = {
  surface: '#141414',
  surfaceHover: '#1f1f1f',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.18)',
  text: '#ffffff',
  textDim: '#a0a0a8',
  textMuted: '#6a6a72',
  yellow: '#ffff57',
}
const fontMono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const
const fontSans = { fontFamily: 'var(--font-inter), ui-sans-serif, system-ui' } as const

const AI_SERVICES = [
  {
    name: 'ChatGPT',
    Logo: ChatGPTLogo,
    buildUrl: (p: string) => `https://chatgpt.com/?q=${encodeURIComponent(p)}`,
  },
  {
    name: 'Claude',
    Logo: ClaudeLogo,
    buildUrl: (p: string) => `https://claude.ai/new?q=${encodeURIComponent(p)}`,
  },
  {
    name: 'Perplexity',
    Logo: PerplexityLogo,
    buildUrl: (p: string) => `https://www.perplexity.ai/?q=${encodeURIComponent(p)}`,
  },
]

function ChatGPTLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22.282 9.821a6 6 0 0 0-.516-4.91 6.05 6.05 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a6 6 0 0 0-3.998 2.9 6.05 6.05 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.05 6.05 0 0 0 6.515 2.9A6 6 0 0 0 13.26 24a6.06 6.06 0 0 0 5.772-4.206 6 6 0 0 0 3.997-2.9 6.06 6.06 0 0 0-.747-7.073M13.26 22.43a4.48 4.48 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.8.8 0 0 0 .392-.681v-6.737l2.02 1.168a.07.07 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494M3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.77.77 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646M2.34 7.896a4.5 4.5 0 0 1 2.366-1.973V11.6a.77.77 0 0 0 .388.677l5.815 3.354-2.02 1.168a.08.08 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.08.08 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667m2.01-3.023l-.141-.085-4.774-2.782a.78.78 0 0 0-.785 0L9.409 9.23V6.897a.07.07 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.8.8 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5Z" />
    </svg>
  )
}

function ClaudeLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
    </svg>
  )
}

function PerplexityLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z" />
    </svg>
  )
}

export default function HelpMeModal({ tool, open, onClose }: HelpMeModalProps) {
  const prompt = buildHelpPrompt(tool)
  useScrollLock(open)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto px-4 py-4 sm:items-center sm:py-8"
      style={{
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        ...fontSans,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="w-full max-w-[520px] overflow-y-auto overflow-x-hidden"
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 24,
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          maxHeight: 'calc(100vh - 32px)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between"
          style={{
            padding: '28px 28px 20px',
            borderBottom: `1px solid ${C.border}`,
            gap: 16,
          }}
        >
          <div className="min-w-0">
            <div
              className="inline-flex items-center"
              style={{
                ...fontMono,
                gap: 8,
                color: C.yellow,
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              <SparkleIcon />
              Ask AI
            </div>
            <h3
              style={{
                ...fontSans,
                color: C.text,
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: '-0.01em',
                lineHeight: '28px',
                marginBottom: 6,
              }}
            >
              How can {tool.name} help me?
            </h3>
            <p style={{ color: C.textDim, fontSize: 14, lineHeight: '22px' }}>
              Open in your favourite AI — it&apos;ll suggest 2–3 ways this tool fits your
              workflow, then ask a couple of clarifying questions.
            </p>
          </div>
          <CloseButton onClick={onClose} />
        </div>

        {/* AI service buttons */}
        <div className="flex flex-col" style={{ padding: 20, gap: 8 }}>
          {AI_SERVICES.map((s) => (
            <ServiceRow
              key={s.name}
              name={s.name}
              Logo={s.Logo}
              href={s.buildUrl(prompt)}
              toolName={tool.name}
            />
          ))}
        </div>

        {/* Prompt preview */}
        <div style={{ padding: '0 28px 24px' }}>
          <details className="group">
            <summary
              className="cursor-pointer select-none"
              style={{
                ...fontMono,
                color: C.textMuted,
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                transition: 'color 160ms',
              }}
            >
              View prompt sent to AI ↓
            </summary>
            <div
              style={{
                ...fontMono,
                marginTop: 12,
                color: C.textDim,
                background: '#0e0e12',
                borderRadius: 12,
                padding: 16,
                fontSize: 12,
                lineHeight: '20px',
                whiteSpace: 'pre-wrap',
                border: `1px solid ${C.border}`,
              }}
            >
              {prompt}
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}

function ServiceRow({
  name,
  Logo,
  href,
  toolName,
}: {
  name: string
  Logo: React.ComponentType
  href: string
  toolName: string
}) {
  const [hover, setHover] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex items-center"
      style={{
        ...fontSans,
        gap: 14,
        padding: '14px 16px',
        background: hover ? C.surfaceHover : 'transparent',
        border: `1px solid ${hover ? C.borderStrong : C.border}`,
        borderRadius: 14,
        transition:
          'background-color 200ms cubic-bezier(0.4,0,0.2,1), border-color 200ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <span
        className="flex items-center justify-center shrink-0"
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${C.border}`,
          color: C.text,
        }}
      >
        <Logo />
      </span>
      <div className="min-w-0 flex-1">
        <div style={{ color: C.text, fontSize: 14, fontWeight: 500 }}>Open in {name}</div>
        <div style={{ color: C.textDim, fontSize: 12, marginTop: 2 }}>
          See how {toolName} fits your workflow
        </div>
      </div>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        style={{
          color: C.textDim,
          transform: hover ? 'translate(2px,-2px)' : 'translate(0,0)',
          transition: 'transform 220ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <path
          d="M3 11L11 3M5 3h6v6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  )
}

function CloseButton({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Close"
      className="flex items-center justify-center shrink-0"
      style={{
        width: 36,
        height: 36,
        borderRadius: 999,
        background: hover ? 'rgba(255,255,255,0.06)' : 'transparent',
        border: `1px solid ${hover ? C.borderStrong : C.border}`,
        color: hover ? C.text : C.textDim,
        transition: 'background-color 180ms, border-color 180ms, color 180ms',
      }}
    >
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  )
}

function SparkleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M6 1l1 2.5 2.5 1L7 5.5 6 8 5 5.5 2.5 4.5 5 3.5 6 1z"
        fill="currentColor"
      />
    </svg>
  )
}
