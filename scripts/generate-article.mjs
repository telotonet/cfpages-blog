/**
 * generate-article.mjs
 *
 * Called by the GitHub Actions workflow 3x/day.
 * Flow:
 *   1. Read existing slugs → pass to Claude so it doesn't repeat topics
 *   2. Claude picks a fresh topic (or uses TOPIC_HINT env var)
 *   3. Claude writes a full publish-ready MDX article
 *   4. File is written to content/articles/
 *   5. GitHub Actions outputs: slug, title
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Anthropic from '@anthropic-ai/sdk'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const ARTICLES_DIR = path.join(ROOT, 'content', 'articles')
const CATEGORIES_DIR = path.join(ROOT, 'content', 'categories')
const SITE_URL = 'https://telotonet.com'

// ─── helpers ────────────────────────────────────────────────────────────────

function setOutput(name, value) {
  const ghOutput = process.env.GITHUB_OUTPUT
  if (ghOutput) fs.appendFileSync(ghOutput, `${name}=${value}\n`)
  else console.log(`OUTPUT ${name}=${value}`)
}

function getExistingArticles() {
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.mdx') && f !== 'placeholder.mdx')
    .map((f) => {
      const slug = f.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf8')
      const titleMatch = raw.match(/^title:\s*["']?(.+?)["']?\s*$/m)
      const title = titleMatch ? titleMatch[1].replace(/^["']|["']$/g, '') : slug
      return { slug, title, url: `${SITE_URL}/articles/${slug}/` }
    })
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

// ─── prompts ────────────────────────────────────────────────────────────────

function topicPickerPrompt(existingArticles, categories) {
  const categoryList = categories.map((c) => `• ${c.slug} — ${c.name}`).join('\n')
  const publishedList = existingArticles.length
    ? existingArticles.map((a) => `• ${a.title}`).join('\n')
    : '(none yet)'

  return `You run a B2B SaaS blog called Telotonet. It covers tools that small and mid-sized businesses use every day: cold email and deliverability, sales CRM and outbound automation, AI writing assistants, and productivity software.

Available categories:
${categoryList}

Already published (do NOT repeat or closely overlap with these):
${publishedList}

Pick ONE specific article topic that:
- Has strong search demand (people Googling specific tool names, comparisons, or how-to guides)
- Fits one of the categories above
- Is NOT already covered in the published list
- Is specific — not "best CRM tools" but "HubSpot vs Pipedrive for 10-person sales teams"

Reply with ONLY the topic title. No explanation, no list, no quotes. Just the title.
Example output: Woodpecker vs Lemlist: Cold Email Outreach Tool Comparison`
}

function articleWriterPrompt(topic, existingArticles, categories, today) {
  const categoryList = categories.map((c) => `${c.slug} (${c.name})`).join(', ')
  const internalLinks = existingArticles.length
    ? existingArticles.map((a) => `• "${a.title}" → ${a.url}`).join('\n')
    : '(none yet)'

  return `You are a senior B2B SaaS content writer. You write for Telotonet — a no-BS blog that helps business buyers evaluate software before they pay for it. The audience is operations managers, founders, sales leads, and marketing managers at companies with 5–200 employees. They are smart and busy. They don't want hype.

---

## YOUR TASK

Write a complete, publish-ready MDX article on this topic:
"${topic}"

---

## CONTENT RULES — follow every single one

### Length and structure
- 1600–2200 words total (count carefully — do not write less than 1600)
- Use ## for main sections (H2), ### for subsections (H3)
- Include at least ONE markdown table with real data (pricing, feature comparison, or specs)
- Include a short intro (2–3 sentences max) that states what the article covers and who it's for
- End with a "Bottom Line" or "Final Verdict" section (## heading) that gives a clear recommendation

### Writing style — critical
- Write like a senior practitioner talking to a peer, not like a marketing copywriter
- Be specific: use real product names, real pricing numbers, real limits, real API rate limits, real plan names
- Express genuine opinions: "X is better for Y because..." — don't hedge everything
- Vary sentence length deliberately: mix short punchy sentences with longer explanatory ones
- NEVER use these phrases: "delve into", "in today's landscape", "it's worth noting", "game-changer", "leverage", "utilize", "at the end of the day", "in conclusion", "seamlessly", "robust", "cutting-edge", "state-of-the-art", "revolutionize"
- NEVER use em-dashes (—). Use commas or restructure the sentence instead.
- No fluffy openers like "In the world of..." or "As businesses increasingly..."
- No "I" — write in second person (you/your) or third person
- No affiliate sales push. Never say "click here to buy" or "get started today". The goal is to inform, not convert.

### Internal links — VERY IMPORTANT
At least ONE internal link to an existing article on the site. Use the EXACT URLs below. Do not invent URLs. Do not use /blog/ — the correct path is always /articles/.

Existing articles you can link to:
${internalLinks}

Example of correct internal link in MDX:
[What is Email Warmup and How Does It Work](https://telotonet.com/articles/what-is-email-warmup/)

### FAQ section
At the end (before the Bottom Line), include a FAQ using this MDX component:

<FAQBlock
  faqs={[
    { question: "...", answer: "..." },
    { question: "...", answer: "..." },
    { question: "...", answer: "..." }
  ]}
/>

Questions should be real things people Google. Answers should be 2–4 sentences each.

---

## OUTPUT FORMAT

Return ONLY valid MDX. No code fences. No explanation. No preamble. Start the output with --- (the YAML frontmatter opening).

---

## FRONTMATTER — fill every field exactly as shown

---
title: "<article title>"
description: "<SEO meta description, 140–160 characters, include the main keyword naturally>"
excerpt: "<one sentence that summarizes what the reader will learn>"
publishedAt: "${today}"
author: "Alex"
category: "<pick the best slug from: ${categoryList}>"
coverImage: "https://images.unsplash.com/photo-<PHOTO_ID>?w=1200&h=630&fit=crop&auto=format"
coverImageAlt: "<short descriptive alt text for the cover image>"
tags: ["tag1", "tag2", "tag3", "tag4"]
draft: false
featured: false
articleType: "<one of: review | comparison | guide | best-of>"
affiliateDisclosure: true
faq:
  - question: "<question>"
    answer: "<answer>"
  - question: "<question>"
    answer: "<answer>"
  - question: "<question>"
    answer: "<answer>"
---

For the coverImage, use a real Unsplash photo ID. Pick one that visually fits the topic:
- Email/inbox/outreach: photo-1596526131083-e8c633c948d2
- Laptop/desk/work: photo-1499750310107-5fef28a66643
- Team/meeting/office: photo-1522071820081-009f0129c71c
- Data/charts/analytics: photo-1551288049-bebda4e38f71
- Writing/notes/docs: photo-1484788984921-03950022c9ef
- Sales/CRM/pipeline: photo-1560472354-b33ff0c44a43
- Communication/phone: photo-1423666639041-f56000c27a9a
- Productivity/planning: photo-1611532736597-de2d4265fba3
- AI/tech/code: photo-1677442135703-1787eea5ce01

---

Start the article body right after the closing --- of the frontmatter. Begin with <AffiliateDisclosureInline /> on its own line, then a blank line, then the article text.`
}

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')

  const existingArticles = getExistingArticles()
  const categories = getCategories()
  const today = todayISO()
  const topicHint = process.env.TOPIC_HINT || ''

  const client = new Anthropic({ apiKey })

  // ── Step 1: pick topic ──────────────────────────────────────────────────
  let topic
  if (topicHint) {
    topic = topicHint
    console.log(`Using provided topic: "${topic}"`)
  } else {
    console.log('Asking Claude to pick a topic...')
    const topicMsg = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 128,
      messages: [{ role: 'user', content: topicPickerPrompt(existingArticles, categories) }],
    })
    topic = topicMsg.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim()
      .replace(/^["']|["']$/g, '')
    console.log(`Claude picked topic: "${topic}"`)
  }

  // ── Step 2: write article ───────────────────────────────────────────────
  console.log('Generating article...')
  const articleMsg = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 5000,
    messages: [
      {
        role: 'user',
        content: articleWriterPrompt(topic, existingArticles, categories, today),
      },
    ],
  })

  let mdxContent = articleMsg.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()

  // Force-fix wrong internal link paths — Claude sometimes writes /blog/ instead of /articles/
  const before = mdxContent
  mdxContent = mdxContent.replaceAll('telotonet.com/blog/', 'telotonet.com/articles/')
  if (mdxContent !== before) {
    console.warn('Fixed: replaced /blog/ → /articles/ in generated content')
  }

  if (!mdxContent.startsWith('---')) {
    throw new Error(
      `Generated content does not start with frontmatter:\n${mdxContent.slice(0, 300)}`
    )
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
