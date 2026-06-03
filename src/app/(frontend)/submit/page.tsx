'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/types'

type Status = 'idle' | 'loading' | 'success' | 'error'

const C = {
  bg: '#141414',
  surface: '#15151a',
  surfaceHover: '#1c1c22',
  cardBg: '#222222',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.18)',
  text: '#ffffff',
  textDim: '#a0a0a8',
  textMuted: '#6a6a72',
  yellow: '#ffff57',
  error: '#f65959',
}
const fontMono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const
const fontSans = { fontFamily: 'var(--font-inter), ui-sans-serif, system-ui' } as const

const inputStyle: React.CSSProperties = {
  ...fontSans,
  width: '100%',
  background: 'rgba(255,255,255,0.03)',
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  padding: '14px 16px',
  fontSize: 15,
  color: C.text,
  outline: 'none',
  transition: 'border-color 200ms cubic-bezier(0.4,0,0.2,1), background-color 200ms',
}

const labelStyle: React.CSSProperties = {
  ...fontMono,
  display: 'block',
  fontSize: 11,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: C.textDim,
  marginBottom: 10,
}

export default function SubmitPage() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [submittedName, setSubmittedName] = useState('')

  const [form, setForm] = useState({
    tool_name: '',
    website_url: '',
    category: '',
    description: '',
    your_name: '',
    your_email: '',
    hp: '',
  })

  const MAX_DESC = 280
  const descLen = form.description.length

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.hp) return
    if (
      !form.tool_name.trim() ||
      !form.website_url.trim() ||
      !form.category ||
      form.description.length < 20
    )
      return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/submit-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSubmittedName(form.tool_name)
        setStatus('success')
      } else {
        throw new Error('Server error')
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100vh', ...fontSans }}>
      {/* Wide top row */}
      <header
        className="mx-auto flex items-center justify-between"
        style={{
          maxWidth: 1440,
          paddingLeft: 40,
          paddingRight: 40,
          paddingTop: 30,
          paddingBottom: 56,
        }}
      >
        <Link href="/" className="inline-flex items-baseline">
          <span
            style={{
              ...fontSans,
              color: C.text,
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            AI Land
          </span>
          <span
            style={{
              ...fontSans,
              color: C.textDim,
              fontSize: 20,
              fontWeight: 500,
              marginLeft: 8,
            }}
          >
            {' '}/ Submit a tool.
          </span>
        </Link>
      </header>

      <main className="mx-auto" style={{ maxWidth: 1100, paddingLeft: 32, paddingRight: 32 }}>
        {/* Hero */}
        <section style={{ marginBottom: 56 }}>
          <div
            className="inline-flex items-center"
            style={{
              ...fontMono,
              gap: 8,
              color: C.yellow,
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            <SparkleIcon />
            Submit a tool
          </div>
          <h1
            style={{
              ...fontSans,
              fontSize: 40,
              lineHeight: '52px',
              letterSpacing: '-0.02em',
              fontWeight: 600,
              color: C.text,
              maxWidth: 760,
            }}
          >
            <span style={{ color: C.text }}>Add your tool to AI Land.</span>
            <br />
            <span style={{ color: C.textDim, fontWeight: 500 }}>
              We review every submission manually.
            </span>
          </h1>
        </section>

        {/* Two-column: form + sidebar */}
        <section
          className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]"
          style={{ paddingBottom: 120 }}
        >
          {/* FORM CARD */}
          <article
            style={{
              background: C.cardBg,
              borderRadius: 24,
              padding: 32,
            }}
          >
            {status === 'success' ? (
              <SuccessState
                name={submittedName}
                onAnother={() => {
                  setStatus('idle')
                  setForm((f) => ({ ...f, tool_name: '', website_url: '', description: '' }))
                }}
              />
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Honeypot */}
                <input
                  type="text"
                  name="hp"
                  value={form.hp}
                  onChange={(e) => set('hp', e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <Field label="Tool name" required>
                  <FormInput
                    type="text"
                    value={form.tool_name}
                    onChange={(v) => set('tool_name', v)}
                    placeholder="e.g. Notion AI"
                    required
                  />
                </Field>

                <Field label="Website URL" required>
                  <FormInput
                    type="url"
                    value={form.website_url}
                    onChange={(v) => set('website_url', v)}
                    placeholder="https://…"
                    required
                  />
                </Field>

                <Field label="Category" required>
                  <FormSelect
                    value={form.category}
                    onChange={(v) => set('category', v)}
                    options={CATEGORIES}
                    placeholder="Select a category…"
                  />
                </Field>

                <Field label="Description" required hint={`${descLen}/${MAX_DESC}`}>
                  <FormTextarea
                    value={form.description}
                    onChange={(v) => set('description', v)}
                    placeholder="What does this tool do? What problem does it solve?"
                    maxLength={MAX_DESC}
                    rows={4}
                  />
                </Field>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Your name">
                    <FormInput
                      type="text"
                      value={form.your_name}
                      onChange={(v) => set('your_name', v)}
                      placeholder="Optional"
                    />
                  </Field>
                  <Field label="Email">
                    <FormInput
                      type="email"
                      value={form.your_email}
                      onChange={(v) => set('your_email', v)}
                      placeholder="Optional"
                    />
                  </Field>
                </div>

                {status === 'error' && (
                  <div
                    style={{
                      ...fontSans,
                      background: 'rgba(246,89,89,0.06)',
                      border: `1px solid ${C.error}40`,
                      borderRadius: 12,
                      padding: '12px 16px',
                      fontSize: 13,
                      color: C.error,
                    }}
                  >
                    {errorMsg}
                  </div>
                )}

                <SubmitButton loading={status === 'loading'} />
              </form>
            )}
          </article>

          {/* SIDEBAR */}
          <aside className="flex flex-col" style={{ gap: 16 }}>
            <SidebarBlock title="How it works">
              {[
                { n: '1', title: 'You submit', desc: 'Fill the form with your tool details.' },
                { n: '2', title: 'We review', desc: 'Our team checks it within 48 hours.' },
                { n: '3', title: 'Published', desc: 'Your tool goes live on AI Land.' },
              ].map((step) => (
                <div key={step.n} className="flex" style={{ gap: 12, marginBottom: 16 }}>
                  <span
                    className="flex shrink-0 items-center justify-center rounded-full"
                    style={{
                      ...fontMono,
                      width: 26,
                      height: 26,
                      background: C.yellow,
                      color: '#0a0a0c',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {step.n}
                  </span>
                  <div>
                    <div style={{ color: C.text, fontSize: 14, fontWeight: 500 }}>{step.title}</div>
                    <div style={{ color: C.textDim, fontSize: 13, marginTop: 2 }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </SidebarBlock>

            <SidebarBlock title="What we look for">
              <ul className="flex flex-col" style={{ gap: 10 }}>
                {[
                  'Actually uses AI (not just "powered by AI")',
                  'Solves a real, specific problem',
                  'Has a working product (not coming soon)',
                  'Clear use cases — what users actually do with it',
                ].map((item) => (
                  <li key={item} className="flex" style={{ gap: 10 }}>
                    <CheckIcon />
                    <span style={{ color: C.textDim, fontSize: 13, lineHeight: '20px' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </SidebarBlock>

            <p
              style={{
                ...fontMono,
                color: C.textMuted,
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textAlign: 'center',
                lineHeight: '18px',
              }}
            >
              Quality over quantity.
            </p>
          </aside>
        </section>
      </main>

    </div>
  )
}

/* =================================================== FIELDS */

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="flex items-center justify-between" style={labelStyle}>
        <span>
          {label}
          {required && <span style={{ color: C.error, marginLeft: 4 }}>*</span>}
        </span>
        {hint && <span style={{ color: C.textMuted, letterSpacing: '0.04em' }}>{hint}</span>}
      </label>
      {children}
    </div>
  )
}

function FormInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  const [focus, setFocus] = useState(false)
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      placeholder={placeholder}
      required={required}
      style={{
        ...inputStyle,
        borderColor: focus ? C.borderStrong : C.border,
      }}
    />
  )
}

function FormSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  options: readonly string[]
  placeholder: string
}) {
  const [focus, setFocus] = useState(false)
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        required
        style={{
          ...inputStyle,
          appearance: 'none',
          paddingRight: 40,
          borderColor: focus ? C.borderStrong : C.border,
          color: value ? C.text : C.textMuted,
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <span
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
        style={{ color: C.textDim }}
      >
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  )
}

function FormTextarea({
  value,
  onChange,
  placeholder,
  maxLength,
  rows,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  maxLength?: number
  rows?: number
}) {
  const [focus, setFocus] = useState(false)
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      placeholder={placeholder}
      maxLength={maxLength}
      rows={rows}
      required
      style={{
        ...inputStyle,
        resize: 'none',
        lineHeight: '24px',
        borderColor: focus ? C.borderStrong : C.border,
      }}
    />
  )
}

/* =================================================== SUBMIT BUTTON */

function SubmitButton({ loading }: { loading: boolean }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="submit"
      disabled={loading}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex w-full items-center justify-center"
      style={{
        ...fontSans,
        height: 56,
        borderRadius: 999,
        background: hover && !loading ? '#f0f0f0' : '#ffffff',
        color: '#0a0a0c',
        fontSize: 15,
        fontWeight: 500,
        gap: 12,
        opacity: loading ? 0.7 : 1,
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'background-color 220ms cubic-bezier(0.4,0,0.2,1), opacity 200ms',
      }}
    >
      {loading ? (
        <>
          <span
            className="inline-block animate-spin rounded-full"
            style={{
              width: 16,
              height: 16,
              border: '2px solid rgba(0,0,0,0.2)',
              borderTopColor: '#0a0a0c',
            }}
          />
          Submitting…
        </>
      ) : (
        <>
          Submit for review
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            style={{
              transform: hover ? 'translate(2px,-2px)' : 'translate(0,0)',
              transition: 'transform 220ms cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <path
              d="M3 11L11 3M5 3h6v6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </>
      )}
    </button>
  )
}

/* =================================================== SUCCESS */

function SuccessState({ name, onAnother }: { name: string; onAnother: () => void }) {
  return (
    <div className="flex flex-col items-center text-center" style={{ padding: '40px 24px' }}>
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ background: 'rgba(255,255,87,0.08)', border: `1px solid rgba(255,255,87,0.24)` }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M5 11l4 4 8-8"
            stroke={C.yellow}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2
        style={{
          ...fontSans,
          color: C.text,
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          marginBottom: 12,
        }}
      >
        {name} submitted
      </h2>
      <p
        style={{
          color: C.textDim,
          fontSize: 14,
          lineHeight: '22px',
          marginBottom: 32,
          maxWidth: 340,
        }}
      >
        We&apos;ll review it and publish within 48 hours if it&apos;s a good fit.
      </p>
      <div className="flex flex-wrap items-center justify-center" style={{ gap: 10 }}>
        <button
          onClick={onAnother}
          className="inline-flex items-center rounded-full"
          style={{
            ...fontMono,
            height: 44,
            paddingLeft: 20,
            paddingRight: 20,
            border: `1px solid ${C.border}`,
            color: C.text,
            fontSize: 12,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontWeight: 500,
            background: 'transparent',
          }}
        >
          Submit another
        </button>
        <Link
          href="/"
          className="inline-flex items-center rounded-full"
          style={{
            ...fontMono,
            height: 44,
            paddingLeft: 20,
            paddingRight: 20,
            background: '#ffffff',
            color: '#0a0a0c',
            fontSize: 12,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          Browse tools
        </Link>
      </div>
    </div>
  )
}

/* =================================================== SIDEBAR */

function SidebarBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: 24,
      }}
    >
      <h3
        style={{
          ...fontMono,
          fontSize: 11,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: C.textDim,
          marginBottom: 16,
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  )
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={{ flexShrink: 0, marginTop: 4, color: C.yellow }}
    >
      <path
        d="M2 7l3.5 3.5L12 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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

