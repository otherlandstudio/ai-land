// AI enrichment via OpenRouter (gpt-4o)
// Generates only what AI Land actually needs: slug + use_cases.
// Everything else (name, category, description, website_url) comes from discovery.

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Strip Perplexity-style citation markers like "fact[4]" or "...analytics[4][5]"
export function stripCitations(text) {
  if (!text) return text
  return text
    .replace(/\s*\[\d+\](\[\d+\])*\s*$/g, '')
    .replace(/\s*\[\d+\]/g, '')
    .trim()
}

function parseJSON(content) {
  const match = content.match(/```(?:json)?\n?([\s\S]+?)\n?```/)
  try {
    return JSON.parse(match ? match[1] : content)
  } catch {
    const objMatch = content.match(/\{[\s\S]+\}/)
    return objMatch ? JSON.parse(objMatch[0]) : null
  }
}

export async function enrichTool(tool) {
  const prompt = `Enrich this AI tool. Return ONLY a JSON object, no markdown:
{
  "slug": "lowercase-kebab-slug-max-40-chars",
  "use_cases": ["Use case 1", "Use case 2", "Use case 3", "Use case 4"],
  "search_description": "Long search-only description, up to 1000 chars"
}

use_cases: each one is a short, specific scenario (max 60 chars) — what a user would actually do with the tool.

search_description: a richer paragraph (700–1000 chars) packed with synonyms, technologies, target roles, and concrete tasks the tool addresses. This text is NEVER displayed on the site — it only feeds the search index, so write it for keyword coverage rather than reading flow. Mention industries, related categories, alternatives this tool competes with, and natural-language phrases users might type when looking for a tool like this.

Tool:
Name: ${tool.name}
URL: ${tool.website_url}
Description: ${tool.description}
Category: ${tool.category}`

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter enrich error: ${err}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content ?? ''
  const enriched = parseJSON(content)

  if (!enriched) throw new Error(`Failed to parse enrichment: ${content}`)

  return {
    name: tool.name,
    slug: enriched.slug ?? generateSlug(tool.name),
    category: tool.category,
    description: stripCitations(tool.description),
    website_url: tool.website_url,
    use_cases: Array.isArray(enriched.use_cases) ? enriched.use_cases : [],
    search_description: typeof enriched.search_description === 'string'
      ? enriched.search_description.slice(0, 1100)
      : null,
  }
}
