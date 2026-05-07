import type { Category } from './types'

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export const categoryColors: Record<string, string> = {
  'Assistants':          '#ba8fff',
  'Writing & Content':   '#5166bf',
  'Creativity & Design': '#ff38f4',
  'Development':         '#4fc3f7',
  'Research & Analytics':'#c9e75d',
  'Product Management':  '#0fd79c',
  'Productivity':        '#b1b1d3',
  'Marketing':           '#eca911',
  'Sales':               '#ff5500',
  'Hiring & HR':         '#f65959',
}

export function getCategoryColor(category: string): string {
  return categoryColors[category] ?? '#b1b1d3'
}

/**
 * Strip footnote artifacts that AI enrichment sometimes leaves at the end
 * of generated descriptions: "[1]", "[12]", trailing " 1", etc.
 * Safe — only touches non-letter trailing tokens.
 */
export function cleanDescription(text: string | null | undefined): string {
  if (!text) return ''
  return text
    .replace(/\s*\[\d+\]\s*$/g, '')   // trailing "[1]" / "[42]"
    .replace(/\s+\d+\s*$/g, '')        // trailing " 1" / " 12"
    .trim()
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function buildHelpPrompt(tool: {
  name: string
  description: string | null
  use_cases: string[] | null
  website_url: string | null
}): string {
  const useCases = tool.use_cases?.join(', ') ?? ''
  const lines = [
    `I want to understand how ${tool.name} could fit into my life or work.`,
    `About this tool: ${tool.description ?? ''}`,
  ]
  if (useCases) lines.push(`Use cases: ${useCases}`)
  if (tool.website_url) lines.push(`Website: ${tool.website_url}`)
  lines.push(
    '',
    'Please:',
    '1. Based on what you know about me (my role, interests, past conversations), give me 2-3 specific ways this tool could help ME — not generic use cases, but tailored to my context.',
    '2. For each suggestion, briefly explain how I could integrate it into my existing workflow.',
    '3. Then ask me 1-2 clarifying questions to refine these suggestions further — for example, what specific problem I\'m trying to solve, or what I\'ve already tried.',
  )
  return lines.join('\n')
}
