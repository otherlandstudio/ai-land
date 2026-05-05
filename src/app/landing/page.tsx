'use client'

import { useState } from 'react'
import {
  AnimatedStat,
  ArticleCard,
  ButtonIntroCall,
  ButtonMoreWorks,
  C,
  CaseStudyCard,
  CTABanner,
  DomainsAccordion,
  type DomainItem,
  FAQItem,
  type FigmaIconName,
  FilterChip,
  fontStyle,
  FullBlog,
  LogoMarquee,
  Navbar,
  ServiceCard,
  SiteFooter,
  Tag,
  TestimonialFeatured,
} from '@/components/site'

/* ============================================================
   Static content — extracted from Figma node 719:996 (Desktop 1440)
   ============================================================ */

const SERVICES: Array<{ title: string; description: string }> = [
  {
    title: 'Product Design',
    description: 'Design AI capabilities people actually understand and trust.',
  },
  {
    title: 'Product Design',
    description: 'Design AI capabilities people actually understand and trust.',
  },
  {
    title: 'Product Design',
    description: 'Design AI capabilities people actually understand and trust.',
  },
  {
    title: 'Product Design',
    description: 'Design AI capabilities people actually understand and trust.',
  },
  {
    title: 'Product Design',
    description: 'Design AI capabilities people actually understand and trust.',
  },
  {
    title: 'Product Design',
    description: 'Design AI capabilities people actually understand and trust.',
  },
]

const CASE_STUDIES: Array<{ title: string; tags: string[] }> = [
  { title: 'Stockpile. Investing platform redesign', tags: ['Fintech', 'Web', 'Mobile'] },
  { title: 'DRESSX. Digital fashion marketplace', tags: ['Consumer', 'iOS', 'Brand'] },
  { title: 'Cricut. Software for cutting machines', tags: ['B2B SaaS', 'Web', 'Design system'] },
  { title: 'RAKBank. Mobile banking experience', tags: ['Fintech', 'Mobile'] },
  { title: 'Sides. Restaurant management SaaS', tags: ['B2B SaaS', 'Web'] },
  { title: 'Asper. AI planning purchases', tags: ['AI', 'Web'] },
]

const DOMAINS: DomainItem[] = [
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
  {
    name: 'Fintech',
    count: 3,
    projects: [
      { name: 'Stockpile', info: 'Investing platform', year: '2024' },
      { name: 'RAKBank', info: 'Mobile banking experience', year: '2023' },
      { name: 'Migros Bank', info: 'Web & mobile banking redesign', year: '2022' },
    ],
  },
  {
    name: 'Consumer',
    count: 2,
    projects: [
      { name: 'DRESSX', info: 'Digital fashion marketplace', year: '2024' },
      { name: 'Beanz', info: 'Loyalty rewards app', year: '2023' },
    ],
  },
  {
    name: 'AI products',
    count: 2,
    projects: [
      { name: 'Asper', info: 'AI platform for planning purchases', year: '2026' },
      { name: 'Sells AI', info: 'AI-powered sales widgets', year: '2022' },
    ],
  },
  {
    name: 'Healthtech',
    count: 1,
    projects: [{ name: 'Mobily Health', info: 'Telehealth & wellness app', year: '2024' }],
  },
  {
    name: 'Loyalty & Retail',
    count: 2,
    projects: [
      { name: 'Beanz', info: 'Loyalty rewards app', year: '2023' },
      { name: 'Takko', info: 'Retail loyalty redesign', year: '2022' },
    ],
  },
]

type Situation = {
  key: string
  label: string
  icon: FigmaIconName
  problem: string
  solution: string
}
const SITUATIONS: Situation[] = [
  {
    key: 'hiring',
    label: 'Hiring gap',
    icon: 'user-add',
    problem:
      "You need a designer now. But hiring takes 3 months, onboarding takes another month, and your roadmap doesn't care.",
    solution:
      'We embed a senior designer into your team within a week. No hiring loop. No interviews. No onboarding overhead. — just someone who shows up to standup on Monday and ships by Friday.',
  },
  {
    key: 'bottleneck',
    label: 'Design bottleneck',
    icon: 'prohibit',
    problem:
      'Engineering is shipping faster than design can think. Tickets pile up. Quality slips. Teams improvise UI on the fly.',
    solution:
      'We pair with your PM and engineers in cycles, ship production-ready Figma in days, and unblock the queue without hiring more people.',
  },
  {
    key: 'ai',
    label: 'AI feature not adopted',
    icon: 'sparkle',
    problem:
      "You shipped an AI feature and nobody uses it. The model works — the experience around it doesn't.",
    solution:
      'We design AI capabilities people actually trust: clear inputs, predictable outputs, recovery flows, and the right level of explainability.',
  },
  {
    key: 'complex',
    label: 'Complex UX',
    icon: 'warning',
    problem:
      'Your product handles real workflows: data, permissions, integrations. Generic templates fall apart.',
    solution:
      'We specialize in complex B2B and prosumer flows. We map the system, simplify what we can, and make the rest legible.',
  },
]

const ARTICLES = [
  {
    title: 'AI Workflows and Modern Application Design Patterns',
    author: 'by Vadym Oliinyk, Product Designer',
    tag: 'article',
  },
  {
    title: 'Product Strategy beyond Buzzwords',
    author: 'by Zack Bolton, Product Strategist',
    tag: 'podcast',
  },
  {
    title: 'What We Learned Designing FoodTech Products',
    author: 'by Name Surname, Role',
    tag: 'article',
  },
]

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: 'What is an embedded designer?',
    a: 'A senior designer who joins your team in 1–2 weeks, attends your standups, ships in your tools, and works as part of your product org for the duration of the engagement.',
  },
  {
    q: 'How fast can we start?',
    a: "Within 1–2 weeks. We've already done the recruiting, vetting and onboarding work — you just brief and we ship.",
  },
  {
    q: 'How do you measure success?',
    a: 'We agree on a small number of outcomes upfront (activation, conversion, time-to-ship, NPS, etc.) and review every two weeks. Designers are accountable to product metrics, not pixel volume.',
  },
  {
    q: 'Can we replace our existing designer?',
    a: 'No — and we recommend not doing it that way. We embed alongside your in-house team and elevate their work, not displace it.',
  },
  {
    q: 'What does pricing look like?',
    a: 'Flat monthly fee per embedded designer. Paused or extended in monthly increments. No per-deliverable fees, no scoping rabbit holes.',
  },
  {
    q: 'Which tools do you work in?',
    a: 'Figma is home. We also work in Linear, Notion, Slack, GitHub, Webflow, Framer, Storybook, and a long tail of AI tools we keep current with.',
  },
  {
    q: 'Do you sign NDAs?',
    a: 'Yes. We sign NDAs and your MSA before any work begins.',
  },
  {
    q: 'What if it does not work out?',
    a: "If after the first 30 days the fit isn't right, we re-match within a week or end the engagement. No drama, no clawbacks.",
  },
]

/* ============================================================
   Layout helpers — match Figma container 1280 inside frame 1440
   ============================================================ */

function Container({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div className={`mx-auto w-full max-w-[1440px] px-10 lg:px-20 ${className}`} style={style}>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        ...fontStyle,
        color: C.ink,
        fontSize: 12,
        lineHeight: '14px',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </div>
  )
}

function SectionTitle({ children, maxWidth = 750 }: { children: React.ReactNode; maxWidth?: number }) {
  return (
    <h2
      style={{
        ...fontStyle,
        color: C.ink,
        fontSize: 48,
        lineHeight: '56px',
        letterSpacing: '-0.02em',
        fontWeight: 400,
        maxWidth,
      }}
    >
      {children}
    </h2>
  )
}

/* Yellow inline word highlight — matches B2B / AI startups / startups / scale-ups in Figma */
function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: C.yellow,
        color: C.ink,
        borderRadius: 8,
        padding: '0 12px',
        marginLeft: 4,
        marginRight: 4,
      }}
    >
      {children}
    </span>
  )
}

/* ============================================================
   Page
   ============================================================ */

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [activeSituation, setActiveSituation] = useState(SITUATIONS[0].key)
  const situation = SITUATIONS.find((s) => s.key === activeSituation) ?? SITUATIONS[0]

  return (
    <main className="min-h-screen bg-white" style={{ ...fontStyle, color: C.ink }}>
      {/* ─────────────────────────────────────────── Navbar */}
      <header className="sticky top-0 z-30 bg-white">
        <Container className="py-3">
          <Navbar activeLabel="Other Land" />
        </Container>
      </header>

      {/* ─────────────────────────────────────────── 1. Hero text */}
      <section style={{ paddingTop: 148 }}>
        <Container>
          <div className="flex flex-wrap items-start justify-between" style={{ gap: 40 }}>
            <h1
              className="max-w-[850px]"
              style={{
                ...fontStyle,
                color: C.ink,
                fontSize: 48,
                lineHeight: '56px',
                letterSpacing: '-0.02em',
                fontWeight: 400,
              }}
            >
              Design for <Highlight>B2B</Highlight> and <Highlight>AI startups.</Highlight> Senior product
              designers embedded into your team
            </h1>
            <FullBlog />
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────── 2. Hero image */}
      <section style={{ paddingTop: 64 }}>
        <Container>
          <div
            className="rounded-[12px]"
            style={{
              width: '100%',
              aspectRatio: '1280 / 730',
              background:
                'linear-gradient(135deg, #1f1d1e 0%, #312f30 50%, #1f1d1e 100%)',
            }}
          />
        </Container>
      </section>

      {/* ─────────────────────────────────────────── 3. Client logos */}
      <section style={{ paddingTop: 0 }}>
        <Container>
          <LogoMarquee />
        </Container>
      </section>

      {/* ─────────────────────────────────────────── 4. We act as a design partner */}
      <section style={{ paddingTop: 80 }}>
        <Container>
          <div className="flex flex-wrap items-start justify-between" style={{ gap: 40 }}>
            <h2
              className="max-w-[760px]"
              style={{
                ...fontStyle,
                color: C.ink,
                fontSize: 48,
                lineHeight: '56px',
                letterSpacing: '-0.02em',
                fontWeight: 400,
              }}
            >
              We act as a design partner for <Highlight>startups</Highlight> and{' '}
              <Highlight>scale-ups.</Highlight> Working inside your team
            </h2>
            <div className="flex flex-col" style={{ gap: 24, minWidth: 292 }}>
              <Stat number="56+" label="Products we design and shipped since 2017" />
              <Stat number="14.4m" label="App users on a single product we designed" />
            </div>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────── 5. Service cards */}
      <section style={{ paddingTop: 96 }}>
        <Container>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <ServiceCard key={i} title={s.title} description={s.description} />
            ))}
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────── 6. Header — Built with partners */}
      <section style={{ paddingTop: 160 }} id="works">
        <Container className="text-center">
          <SectionLabel>Our recent works ↗</SectionLabel>
          <div className="mt-4 flex justify-center">
            <SectionTitle>Here&apos;s what we&apos;ve built with our partners</SectionTitle>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────── 7. Case studies grid */}
      <section style={{ paddingTop: 64 }}>
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {CASE_STUDIES.map((cs, i) => (
              <CaseStudyCard key={i} title={cs.title} tags={cs.tags} />
            ))}
          </div>
          <div className="mt-12">
            <ButtonMoreWorks count={52}>More works</ButtonMoreWorks>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────── 8. Header — Multiple domains */}
      <section style={{ paddingTop: 160 }} id="domains">
        <Container className="text-center">
          <SectionLabel>Our designs are used by 80M+ people worldwide</SectionLabel>
          <div className="mt-4 flex justify-center">
            <SectionTitle>We&apos;ve improved products across multiple domains</SectionTitle>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────── 9. Domains accordion */}
      <section style={{ paddingTop: 48 }}>
        <Container>
          <DomainsAccordion items={DOMAINS} defaultOpen={0} />
        </Container>
      </section>

      {/* ─────────────────────────────────────────── 10. Header — Most clients stay */}
      <section style={{ paddingTop: 160 }} id="testimonials">
        <Container className="text-center">
          <div className="flex justify-center">
            <SectionTitle>
              Most clients come for the design.
              <br />
              They stay for the partnership
            </SectionTitle>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────── 11. Testimonials */}
      <section style={{ paddingTop: 48 }}>
        <Container>
          <div className="flex flex-col" style={{ gap: 8 }}>
            <TestimonialFeatured
              colour="yellow"
              platform="desktop"
              quote="We've worked with Other Land for over two years. They integrated smoothly, took ownership of the design side, and consistently delivered strong UX/UI solutions."
              name="Samantha Park"
              role="Product Manager, Stockpile"
              stat="12.3m"
              statLabel="App users on a single product we designed"
            />
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              <TestimonialFeatured
                colour="gray"
                platform="desktop"
                fullWidth
                quote="This is my third time working with Other Land, and I'd gladly partner with them again. They focus on real product value, move fast, and integrate seamlessly. No fluff, just smart, metrics-oriented design that drives results."
                name="James Holloway"
                role="VP Product, Cricut"
                stat="+240%"
                statLabel="Conversion lift on the redesigned funnel"
              />
              <TestimonialFeatured
                colour="white"
                platform="desktop"
                fullWidth
                quote="We have been matched with an incredible designer Vlad, whose work brought a clear upgrade in both usability and visual quality. His attention to detail and high standards truly impressed us."
                name="Eric Wagner"
                role="CTO, DRESSX"
                stat="+5.7m"
                statLabel="App users acquired post-redesign"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────── 12. Header + 13. Situations (combined per Figma DS) */}
      <section style={{ paddingTop: 160, paddingBottom: 32 }}>
        <Container>
          <div className="mx-auto flex flex-col items-center" style={{ maxWidth: 838, gap: 32 }}>
            {/* Two-color centered title */}
            <h2
              className="text-center"
              style={{
                ...fontStyle,
                fontSize: 48,
                lineHeight: '56px',
                letterSpacing: '-0.02em',
                fontWeight: 400,
                maxWidth: 720,
              }}
            >
              <span style={{ color: C.ink }}>We&apos;ve been inside enough startups</span>{' '}
              <span style={{ color: C.textDim }}>to know exactly what breaks</span>
            </h2>

            {/* Pill-shaped tab bar with shared bg */}
            <div
              className="flex flex-wrap items-center"
              style={{
                background: C.surfaceLight,
                borderRadius: 16,
                padding: 6,
                gap: 4,
              }}
            >
              {SITUATIONS.map((s) => (
                <FilterChip
                  key={s.key}
                  icon={s.icon}
                  active={activeSituation === s.key}
                  onClick={() => setActiveSituation(s.key)}
                >
                  {s.label}
                </FilterChip>
              ))}
            </div>

            {/* Shared content card — switches with smooth fade as user clicks tabs */}
            <div
              className="w-full rounded-[24px]"
              style={{
                background: C.surfaceLight,
                padding: 64,
              }}
            >
              <div
                key={situation.key}
                className="mx-auto flex flex-col"
                style={{
                  maxWidth: 640,
                  gap: 32,
                  animation: 'situations-fade 280ms cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                <div className="flex flex-col" style={{ gap: 12 }}>
                  <span style={{ alignSelf: 'flex-start' }}>
                    <Tag variant="surface">Problem</Tag>
                  </span>
                  <p
                    style={{
                      ...fontStyle,
                      color: C.ink,
                      fontSize: 20,
                      lineHeight: '28px',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {situation.problem}
                  </p>
                </div>
                <div className="flex flex-col" style={{ gap: 12 }}>
                  <span style={{ alignSelf: 'flex-start' }}>
                    <Tag variant="accent">Solution</Tag>
                  </span>
                  <p
                    style={{
                      ...fontStyle,
                      color: C.ink,
                      fontSize: 20,
                      lineHeight: '28px',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {situation.solution}
                  </p>
                </div>
              </div>
            </div>

            <SectionLabel>If you&apos;re in one of these situations — we&apos;ve solved it before</SectionLabel>
          </div>
        </Container>
        <style jsx>{`
          @keyframes situations-fade {
            from {
              opacity: 0;
              transform: translateY(6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </section>

      {/* ─────────────────────────────────────────── 14. Header — Insights */}
      <section style={{ paddingTop: 160 }} id="insights">
        <Container className="text-center">
          <div className="flex justify-center">
            <SectionTitle>Explore our insights</SectionTitle>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────── 15. Articles */}
      <section style={{ paddingTop: 48 }}>
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.map((a, i) => (
              <ArticleCard key={i} title={a.title} author={a.author} tag={a.tag} />
            ))}
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────── 16. CTA Banner */}
      <section style={{ paddingTop: 160 }} id="contact">
        <Container>
          <CTABanner />
        </Container>
      </section>

      {/* ─────────────────────────────────────────── 17. Header — FAQ */}
      <section style={{ paddingTop: 160 }} id="faq">
        <Container className="text-center">
          <div className="flex justify-center">
            <SectionTitle>You have questions, we have answers.</SectionTitle>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────── 18. FAQ + Book intro */}
      <section style={{ paddingTop: 48, paddingBottom: 96 }}>
        <Container>
          <div className="mx-auto flex flex-col" style={{ maxWidth: 838, gap: 16 }}>
            {FAQS.map((f, i) => (
              <FAQItem
                key={f.q}
                question={f.q}
                answer={f.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
            <div className="mt-6 flex justify-center">
              <ButtonIntroCall>Book an intro call</ButtonIntroCall>
            </div>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────── Footer */}
      <Container>
        <SiteFooter />
      </Container>
    </main>
  )
}

/* Big stat block (4. Design partner) */
function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <div
        style={{
          ...fontStyle,
          color: C.ink,
          fontSize: 66,
          lineHeight: '64px',
          letterSpacing: '-0.02em',
          fontWeight: 400,
        }}
      >
        <AnimatedStat value={number} />
      </div>
      <div
        style={{
          ...fontStyle,
          color: C.ink,
          fontSize: 12,
          lineHeight: '14px',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          maxWidth: 220,
        }}
      >
        {label}
      </div>
    </div>
  )
}
