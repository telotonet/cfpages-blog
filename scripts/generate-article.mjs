/**
 * generate-article.mjs
 *
 * Called by the GitHub Actions workflow.
 * - Reads existing article slugs so Claude avoids duplicates
 * - Calls Claude API twice:
 *     1. Pick a topic (or use TOPIC_HINT if provided)
 *     2. Write the full MDX article
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

  const client = new Anthropic({ apiKey })
  const categoryNames = categories.map((c) => `${c.slug} (${c.name})`).join(', ')
  const slugList = existingSlugs.length ? existingSlugs.join(', ') : '(none yet)'

  // ── Step 1: pick a topic ────────────────────────────────────────────────
  let topic
  if (topicHint) {
    topic = topicHint
    console.log(`Using provided topic: "${topic}"`)
  } else {
    console.log('Asking Claude to pick a topic...')
    const topicMsg = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: `You run a B2B SaaS blog called Telotonet covering: email deliverability tools, sales CRM, AI writing assistants, and productivity software for small and mid-sized businesses.

Already published articles (do NOT repeat these): ${slugList}

Pick ONE specific, high-value article topic that:
- Has not been covered yet
- Would rank well on Google (specific tool names, comparisons, or practical guides)
- Fits one of the categories: ${categoryNames}

Reply with just the topic title — no explanation, no list, just the title. Example: "Woodpecker vs Lemlist: Cold Email Tool Comparison for 2025"`,
        },
      ],
    })
    topic = topicMsg.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim()
      .replace(/^["']|["']$/g, '')
    console.log(`Claude picked topic: "${topic}"`)
  }

  // ── Step 2: write the article ───────────────────────────────────────────
  const articlePrompt = `You are a B2B SaaS content writer for Telotonet — a blog covering email tools, sales CRM, AI writing, and productivity software for small and mid-sized businesses.

Write a complete, publish-ready MDX article on this topic: "${topic}"

## Article requirements
- Length: 1500–2000 words
- Tone: Direct, practical, no fluff. Write like a senior practitioner explaining something to a peer.
- Anti-AI patterns: vary sentence length, use specific numbers, name real products, express genuine opinions, avoid em-dashes, avoid phrases like "delve into", "in today's landscape", "it's worth noting", "game-changer"
- Structure: ## H2 headings, a few ### H3s where appropriate, at least one markdown table with real data
- No affiliate sales language; help the reader make an informed decision
- End with one internal cross-link to an existing article: ${slugList}

## Output format
Return ONLY valid MDX — no code fences, no explanation, no preamble. Start with --- frontmatter.

## Frontmatter schema:
---
title: "<descriptive article title>"
description: "<155-char SEO meta description>"
excerpt: "<one sentence summary>"
publishedAt: "${today}"
author: "Alex"
category: "<slug from: ${categoryNames}>"
coverImage: "<real Unsplash URL: https://images.unsplash.com/photo-XXXXXXXXXXXXXXXXXX?w=1200&h=630&fit=crop&auto=format>"
coverImageAlt: "<short alt text>"
tags: ["tag1", "tag2", "tag3", "tag4"]
draft: false
featured: false
articleType: "<review | comparison | guide | best-of>"
affiliateDisclosure: true
faq:
  - question: "<question>"
    answer: "<answer>"
  - question: "<question>"
    answer: "<answer>"
  - question: "<question>"
    answer: "<answer>"
---

<AffiliateDisclosureInline />

[article body]

Unsplash photo IDs by topic (pick the most relevant or use your own real ID):
- Email/inbox: photo-1596526131083-e8c633c948d2
- Laptop/work: photo-1499750310107-5fef28a66643
- Meeting/team: photo-1522071820081-009f0129c71c
- Data/analytics: photo-1551288049-bebda4e38f71
- Writing/notes: photo-1484788984921-03950022c9ef
- CRM/sales: photo-1560472354-b33ff0c44a43`

  console.log('Generating article...')
  const articleMsg = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    messages: [{ role: 'user', content: articlePrompt }],
  })

  const mdxContent = articleMsg.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()

  if (!mdxContent.startsWith('---')) {
    throw new Error(`Generated content does not start with frontmatter:\n${mdxContent.slice(0, 300)}`)
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
