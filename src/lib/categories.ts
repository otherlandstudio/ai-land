import { CATEGORIES, type Category } from './types'

/**
 * Категорії → SEO-сторінки. Слаг детермінований (lowercase, `&`/пробіли → `-`),
 * тож `Writing & Content` → `writing-content`. Плюс унікальний SEO-копірайт на кожну.
 */

export function categorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, ' ')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const SLUG_TO_CATEGORY = new Map<string, Category>(
  CATEGORIES.map((c) => [categorySlug(c), c]),
)

export function categoryFromSlug(slug: string): Category | null {
  return SLUG_TO_CATEGORY.get(slug) ?? null
}

export function allCategorySlugs(): string[] {
  return CATEGORIES.map(categorySlug)
}

type Seo = { title: string; description: string; heading: string; intro: string }

/** Унікальні title/description/H1 для індексації кожної категорії. */
export const CATEGORY_SEO: Record<Category, Seo> = {
  Assistants: {
    title: 'AI Assistants — Curated AI Tools',
    description:
      'Hand-picked AI assistants and copilots that actually help — chatbots, agents and virtual helpers, described in plain language.',
    heading: 'AI Assistants',
    intro: 'Copilots, chatbots and agents that get real work done.',
  },
  'Writing & Content': {
    title: 'AI Writing & Content Tools — Curated Directory',
    description:
      'The best AI writing and content tools — copywriting, editing, blogging and content generation, hand-picked and explained simply.',
    heading: 'AI Writing & Content Tools',
    intro: 'Write, edit and generate content faster with AI.',
  },
  'Creativity & Design': {
    title: 'AI Creativity & Design Tools — Curated Directory',
    description:
      'AI tools for design, images, video and creative work — hand-picked and described in plain language.',
    heading: 'AI Creativity & Design Tools',
    intro: 'Image, video and design tools powered by AI.',
  },
  Development: {
    title: 'AI Development Tools — Curated Directory',
    description:
      'AI coding and developer tools — code generation, review, testing and automation, hand-picked for real workflows.',
    heading: 'AI Development Tools',
    intro: 'Code, ship and automate with AI-powered dev tools.',
  },
  'Research & Analytics': {
    title: 'AI Research & Analytics Tools — Curated Directory',
    description:
      'AI tools for research, data and analytics — insights, dashboards and analysis, hand-picked and explained simply.',
    heading: 'AI Research & Analytics Tools',
    intro: 'Turn data into insight with AI research and analytics tools.',
  },
  'Product Management': {
    title: 'AI Product Management Tools — Curated Directory',
    description:
      'AI tools for product managers — roadmaps, feedback, specs and planning, hand-picked for real product teams.',
    heading: 'AI Product Management Tools',
    intro: 'Plan, prioritise and ship product with AI.',
  },
  Productivity: {
    title: 'AI Productivity Tools — Curated Directory',
    description:
      'AI productivity tools that save time — notes, tasks, meetings and workflows, hand-picked and described in plain language.',
    heading: 'AI Productivity Tools',
    intro: 'Do more in less time with AI productivity tools.',
  },
  Marketing: {
    title: 'AI Marketing Tools — Curated Directory',
    description:
      'The best AI marketing tools — SEO, ads, social, email and personalization, hand-picked for marketers.',
    heading: 'AI Marketing Tools',
    intro: 'Grow faster with AI marketing tools.',
  },
  Sales: {
    title: 'AI Sales Tools — Curated Directory',
    description:
      'AI sales tools that close more deals — outreach, CRM, coaching and lead gen, hand-picked and explained simply.',
    heading: 'AI Sales Tools',
    intro: 'Prospect, coach and close with AI sales tools.',
  },
  'Hiring & HR': {
    title: 'AI Hiring & HR Tools — Curated Directory',
    description:
      'AI tools for hiring and HR — recruiting, interviews, screening and people ops, hand-picked for real teams.',
    heading: 'AI Hiring & HR Tools',
    intro: 'Hire and manage people better with AI.',
  },
  Finance: {
    title: 'AI Finance Tools — Curated Directory',
    description:
      'AI finance tools — accounting, forecasting, spend and analysis, hand-picked and described in plain language.',
    heading: 'AI Finance Tools',
    intro: 'Manage money smarter with AI finance tools.',
  },
}
