/**
 * generate-article.mjs
 *
 * Called by the GitHub Actions workflow.
 * - Reads existing article slugs to avoid duplicates
 * - Reads category list
 * - Calls Claude API to write a new MDX article
 * - Writes the file to content/articles/
 * - Sets GitHub Actions outputs: slug, title
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Anthropic from '@anthropic-ai/sdk'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const ARTICLES_DIR = path.join(ROOT, 'content', 'articles')
const CATEGORIES_DIR = path.join(ROOT, 'content', 'categories')

// ─── helpers ────────────────────────────────────────────────────────────────

function setOutput(name, value) {
  const ghOutput = process.env.GITHUB_OUTPUT
  if (ghOutput) {
    fs.appendFileSync(ghOutput, `${name}=${value}\n`)
  } else {
    console.log(`OUTPUT ${name}=${value}`)
  }
}

function getExistingSlugs() {
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.mdx') && f !== 'placeholder.mdx')
    .map((f) => f.replace('.mdx', ''))
}

function getCategories() {
  return fs
    .readdirSync(CATEGORIES_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const data = JSON.parse(fs.readFileSync(path.join(CATEGORIES_DIR, f), 'utf8'))
      return { slug: f.replace('.json', ''), name: data.name }
    })
}

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

// ─── topic pool ─────────────────────────────────────────────────────────────
// Add new topics here; already-published slugs are automatically skipped.

const TOPIC_POOL = [
  { hint: 'Apollo.io vs Hunter.io for B2B lead generation', category: 'sales-crm' },
  { hint: 'Lemlist review — cold email outreach tool', category: 'email-tools' },
  { hint: 'Notion vs Coda for team knowledge management', category: 'productivity' },
  { hint: 'Surfer SEO review for content teams', category: 'ai-writing' },
  { hint: 'Clay.com review — data enrichment and outbound automation', category: 'sales-crm' },
  { hint: 'Instantly vs Smartlead — cold email platform comparison', category: 'email-tools' },
  { hint: 'Writesonic vs Jasper for long-form content', category: 'ai-writing' },
  { hint: 'HubSpot Sales Hub vs Pipedrive CRM comparison', category: 'sales-crm' },
  { hint: 'Otter.ai review — AI meeting transcription', category: 'productivity' },
  { hint: 'Mailreach vs Lemwarm email warmup comparison', category: 'email-tools' },
  { hint: 'Ahrefs vs Semrush for B2B SEO', category: 'ai-writing' },
  { hint: 'Fireflies.ai review — meeting notes and summaries', category: 'productivity' },
  { hint: 'Reply.io review — sales engagement platform', category: 'sales-crm' },
  { hint: 'Grammarly Business vs ProWritingAid for teams', category: 'ai-writing' },
  { hint: 'Linear vs Jira for product and engineering teams', category: 'productivity' },
  { hint: 'Woodpecker cold email tool review', category: 'email-tools' },
  { hint: 'Outreach vs Salesloft sales engagement comparison', category: 'sales-crm' },
  { hint: 'Fathom vs Otter AI meeting assistant comparison', category: 'productivity' },
  { hint: 'ZoomInfo vs Apollo.io — B2B data platform comparison', category: 'sales-crm' },
  { hint: 'Unbounce vs Instapage landing page builder comparison', category: 'ai-writing' },
]

function pickTopic(existingSlugs, topicHint) {
  if (topicHint) {
    return { hint: topicHint, category: 'productivity' } // caller can refine category via hint
  }
  const remaining = TOPIC_POOL.filter((t) => {
    // rough slug match: lowercase, spaces→hyphens, strip punctuation
    const approxSlug = t.hint.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/ +/g, '-')
    return !existingSlugs.some((s) => s.includes(approxSlug.split('-')[0]))
  })
  if (remaining.length === 0) {
    throw new Error('All topics in the pool have been published. Add more to TOPIC_POOL.')
  }
  return remaining[Math.floor(Math.random() * remaining.length)]
}

// ─── Claude prompt ───────────────────────────────────────────────────────────

function buildPrompt({ hint, category, categories, existingSlugs, today }) {
  const categoryNames = categories.map((c) => `${c.slug} (${c.name})`).join(', ')
  const slugList = existingSlugs.join(', ')

  return `You are a B2B SaaS content writer for Telotonet — a blog covering email tools, sales CRM, AI writing, and productivity software for small and mid-sized businesses.

Write a complete, publish-ready MDX article for the following topic: "${hint}"

## Article requirements
- Length: 1500–2000 words
- Tone: Direct, practical, no fluff. Write like a senior practitioner explaining something to a peer.
- Anti-AI patterns: vary sentence length, use specific numbers, name real products, express genuine opinions, avoid em-dashes, avoid phrases like "delve into", "in today's landscape", "it's worth noting", "game-changer"
- Structure: use ## H2 headings, a few ### H3s where appropriate, include at least one markdown table
- No affiliate sales language; focus on helping the reader make an informed decision
- End with an internal cross-link to one of the existing articles: ${slugList}

## Output format
Return ONLY valid MDX — no code fences, no explanation, no preamble. The file must start with the YAML frontmatter block and end with the article body.

## Frontmatter schema (fill all fields correctly):
---
title: "<descriptive article title>"
description: "<155-char SEO meta description>"
excerpt: "<one-sentence summary>"
publishedAt: "${today}"
author: "Alex"
category: "<one of: ${categoryNames}>"
coverImage: "<a real Unsplash photo URL in format: https://images.unsplash.com/photo-XXXXXXXXXXXXX-XXXXXXXXXXXX?w=1200&h=630&fit=crop&auto=format>"
coverImageAlt: "<short alt text>"
tags: ["tag1", "tag2", "tag3", "tag4"]
draft: false
featured: false
articleType: "<one of: review | comparison | guide | best-of>"
affiliateDisclosure: true
faq:
  - question: "<common question>"
    answer: "<concise answer>"
  - question: "<common question>"
    answer: "<concise answer>"
  - question: "<common question>"
    answer: "<concise answer>"
---

<AffiliateDisclosureInline />

[article body in MDX]

For the Unsplash image, pick a relevant real photo ID. Some safe options by topic:
- Email/inbox: photo-1596526131083-e8c633c948d2
- Laptop/work: photo-1499750310107-5fef28a66643
- Meeting/team: photo-1522071820081-009f0129c71c
- Data/analytics: photo-1551288049-bebda4e38f71
- Writing/notes: photo-1484788984921-03950022c9ef
- CRM/sales: photo-1560472354-b33ff0c44a43
- Phone/communication: photo-1423666639041-f56000c27a9a
Pick the most relevant one or use a different real Unsplash photo ID.
`
}

// ─── extract slug + title from MDX ──────────────────────────────────────────

function extractFrontmatter(mdx) {
  const match = mdx.match(/^---\n([\s\S]*?)\n---/)
  if (!match) throw new Error('No frontmatter found in generated MDX')
  const fm = match[1]

  const titleMatch = fm.match(/^title:\s*["']?(.+?)["']?\s*$/m)
  const title = titleMatch ? titleMatch[1].replace(/^["']|["']$/g, '') : 'untitled'

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/ +/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)

  return { title, slug }
}

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')

  const existingSlugs = getExistingSlugs()
  const categories = getCategories()
  const today = todayISO()
  const topicHint = process.env.TOPIC_HINT || ''

  const topic = pickTopic(existingSlugs, topicHint)
  console.log(`Generating article for topic: "${topic.hint}"`)

  const client = new Anthropic({ apiKey })

  const prompt = buildPrompt({
    hint: topic.hint,
    category: topic.category,
    categories,
    existingSlugs,
    today,
  })

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const mdxContent = message.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()

  if (!mdxContent.startsWith('---')) {
    throw new Error(`Generated content does not start with frontmatter:\n${mdxContent.slice(0, 200)}`)
  }

  const { title, slug } = extractFrontmatter(mdxContent)
  const filename = `${slug}.mdx`
  const filepath = path.join(ARTICLES_DIR, filename)

  if (fs.existsSync(filepath)) {
    throw new Error(`File already exists: ${filepath}`)
  }

  fs.writeFileSync(filepath, mdxContent, 'utf8')
  console.log(`Written: ${filepath}`)

  setOutput('slug', slug)
  setOutput('title', title)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
