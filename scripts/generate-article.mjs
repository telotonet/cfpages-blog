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

// ─── article formats ────────────────────────────────────────────────────────
// Each format has a unique structure so articles don't all look the same.

const ARTICLE_FORMATS = [
  {
    name: 'honest-review',
    articleType: 'review',
    topicStyle: 'a deep honest review of ONE specific B2B SaaS tool — not a comparison',
    topicExample: 'Apollo.io Review: What It Actually Does Well (And Where It Falls Short)',
    structureInstructions: `Structure this as an honest tool review. Use this exact section order:
1. ## Who This Is For — 1 short paragraph, name the exact persona
2. ## What You Actually Get — what the tool does, with specific feature names and limits
3. ## Where It Shines — 2-3 concrete things it genuinely does better than alternatives, with specifics
4. ## Where It Disappoints — be honest, name real limitations, missing features, UX frustrations
5. ## Pricing: What You'll Actually Pay — break down real plan costs, what's in each tier, hidden limits
6. ## How It Compares — one markdown table: this tool vs 2-3 competitors, key metrics only
7. FAQ block (3 questions)
8. ## Verdict — one clear paragraph, name the exact type of company/team this is right for`,
  },
  {
    name: 'how-to-guide',
    articleType: 'guide',
    topicStyle: 'a practical step-by-step how-to guide — something people need to set up or configure',
    topicExample: 'How to Set Up Cold Email Sequences That Actually Get Replies',
    structureInstructions: `Structure this as a practical how-to guide. Use this exact section order:
1. ## What You Need Before Starting — tools, accounts, data needed; be specific
2. ## Step 1: [first concrete action] — numbered steps throughout, each with real details
3. ## Step 2: [next action] — include specific settings, values, configurations
4. ## Step 3: [next action] — include a real-world example or sample output where helpful
5. Continue steps until the task is fully done (4-6 steps total)
6. ## Common Mistakes to Avoid — 3-4 real mistakes people make, each with a fix
7. ## Results to Expect — real numbers, realistic timelines, what "success" looks like
8. FAQ block (3 questions)
9. ## Quick Recap — bullet list of the key steps, 1 line each`,
  },
  {
    name: 'tool-stack',
    articleType: 'best-of',
    topicStyle: 'a specific opinionated tool stack for ONE job-to-be-done — like "the exact stack for X"',
    topicExample: 'The Exact Cold Outbound Stack for a 2-Person Sales Team ($200/mo Budget)',
    structureInstructions: `Structure this as an opinionated stack recommendation. Use this exact section order:
1. ## The Problem This Stack Solves — 2-3 sentences: who this is for, what they're trying to accomplish
2. ## The Stack at a Glance — one markdown table: Tool | Purpose | Cost/mo | Free tier?
3. ## Tool 1: [Name] — why this one, what it does in this stack, key config tips
4. ## Tool 2: [Name] — same
5. ## Tool 3: [Name] — same (continue for each tool in the stack, 3-5 tools total)
6. ## How the Tools Connect — describe the actual workflow: data flows from X → Y → Z
7. ## Total Cost Breakdown — itemized monthly cost, what you get at each tier
8. ## What to Swap If Your Budget Is Different — alternatives for tighter or looser budgets
9. FAQ block (3 questions)
10. ## Bottom Line — who this stack is perfect for, who should look elsewhere`,
  },
  {
    name: 'comparison',
    articleType: 'comparison',
    topicStyle: 'a head-to-head comparison of TWO specific tools for a specific use case',
    topicExample: 'Lemlist vs Instantly: Which Cold Email Tool Is Better for Agency Outreach',
    structureInstructions: `Structure this as a real head-to-head, not a neutral "both are good" piece. Use this exact section order:
1. ## The Short Answer — 2-3 sentences giving a direct verdict upfront (don't make people scroll)
2. ## Who Each Tool Is Built For — a quick "Tool A is for X, Tool B is for Y" framing
3. ## Feature Comparison — one markdown table with 8-10 rows of specific features/limits/pricing
4. ## Where [Tool A] Wins — 3-4 specific things it genuinely does better, with real examples
5. ## Where [Tool B] Wins — same for tool B
6. ## Pricing Reality Check — actual cost at real usage volumes (not just plan names)
7. ## The Deal-Breakers — what would make you immediately pick one over the other
8. FAQ block (3 questions)
9. ## Final Verdict — direct recommendation for 2-3 specific reader types ("if you're X, get A; if you're Y, get B")`,
  },
  {
    name: 'contrarian-take',
    articleType: 'review',
    topicStyle: 'a contrarian opinion piece — why a popular tool is overrated, underrated, or misused',
    topicExample: 'Why Most Teams Are Using Notion Wrong (And What to Do Instead)',
    structureInstructions: `Structure this as a punchy opinion piece with a real point of view. Use this exact section order:
1. ## The Take — state the contrarian position directly in the first paragraph, no hedging
2. ## Why Everyone Assumes [common belief] — steelman the mainstream view fairly
3. ## Where That Goes Wrong — the specific evidence/experience that challenges it
4. ## What Actually Works — the alternative approach, with specifics
5. ## The Real Cost of [common approach] — quantify the downside: time, money, missed results
6. ## Who Should Still Use It the Old Way — be fair, name the exceptions
7. FAQ block (3 questions)
8. ## The Bottom Line — restate the take, name the action to take`,
  },
  {
    name: 'buyers-guide',
    articleType: 'best-of',
    topicStyle: 'a buyer\'s guide that helps someone choose the right tool for a specific situation — opinionated, not "it depends"',
    topicExample: 'How to Choose a CRM When You Have Under 5 Salespeople',
    structureInstructions: `Structure this as a decision-making guide. Use this exact section order:
1. ## Skip This If You Already Know What You Need — quick 3-bullet shortlist for people in a hurry
2. ## What Actually Matters When Choosing [tool category] — 4-5 criteria that separate good from bad choices, with why
3. ## The Options Worth Considering — one markdown table: Tool | Best for | Price | Weak spot
4. ## [Tool A]: The Right Choice When... — 1 short paragraph, name the specific situation
5. ## [Tool B]: The Right Choice When... — same (do this for 3-4 tools)
6. ## Red Flags to Watch Out For — pricing traps, lock-in risks, support issues
7. FAQ block (3 questions)
8. ## My Pick for Most Teams — give a direct recommendation for the most common case`,
  },
]

function pickFormat() {
  return ARTICLE_FORMATS[Math.floor(Math.random() * ARTICLE_FORMATS.length)]
}

function topicPickerPrompt(existingArticles, categories, format) {
  const categoryList = categories.map((c) => `• ${c.slug} — ${c.name}`).join('\n')
  const publishedList = existingArticles.length
    ? existingArticles.map((a) => `• ${a.title}`).join('\n')
    : '(none yet)'

  return `You run a B2B SaaS blog called Telotonet. It covers tools that small and mid-sized businesses use every day: cold email and deliverability, sales CRM and outbound automation, AI writing assistants, and productivity software.

Available categories:
${categoryList}

Already published (do NOT repeat or closely overlap with these):
${publishedList}

Today's article format: ${format.topicStyle}
Example of a good title for this format: "${format.topicExample}"

Pick ONE specific topic in this format that:
- Has real search demand
- Fits one of the categories above
- Is NOT already covered in the published list
- Uses specific tool names or concrete situations — no generic titles

Reply with ONLY the topic title. No explanation, no quotes. Just the title.`
}

function articleWriterPrompt(topic, format, existingArticles, categories, today) {
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

## STRUCTURE — follow this exactly, do not reorder or skip sections

${format.structureInstructions}

---

## WRITING RULES — every single one applies

- 1600–2200 words total. Do not write less than 1600.
- Write like a senior practitioner talking to a peer. Not a marketing copywriter.
- Be specific: real product names, real prices, real plan limits, real numbers.
- Express genuine opinions. "X is better for Y because..." — no endless hedging.
- Vary sentence length. Short punchy sentences mixed with longer explanations.
- BANNED phrases (never use): "delve into", "in today's landscape", "it's worth noting", "game-changer", "leverage", "utilize", "at the end of the day", "in conclusion", "seamlessly", "robust", "cutting-edge", "revolutionize", "unlock", "empower", "streamline"
- NEVER use em-dashes (—). Use commas or restructure instead.
- No fluffy openers like "In the world of..." or "As businesses increasingly..."
- Write in second person (you/your) or third person. Never "I".
- No affiliate push. Never "click here to buy", "get started today", "sign up now".

---

## INTERNAL LINKS — critical rule

Include at least ONE internal link. Use ONLY the exact URLs listed below. Do NOT invent URLs. Do NOT use /blog/ — the only correct path format is /articles/{slug}/.

${internalLinks}

Correct format: [Article Title](https://telotonet.com/articles/slug-here/)

---

## FAQ BLOCK

Include a FAQBlock component with 3 questions that people actually Google:

<FAQBlock
  faqs={[
    { question: "...", answer: "..." },
    { question: "...", answer: "..." },
    { question: "...", answer: "..." }
  ]}
/>

Each answer: 2–4 sentences, direct and specific.

---

## OUTPUT FORMAT

Return ONLY valid MDX. No code fences. No explanation. No preamble. Start with ---.

---

## FRONTMATTER

---
title: "<article title>"
description: "<SEO meta description, 140–160 characters>"
excerpt: "<one sentence summary>"
publishedAt: "${today}"
author: "Alex"
category: "<slug from: ${categoryList}>"
coverImage: "https://images.unsplash.com/photo-<PHOTO_ID>?w=1200&h=630&fit=crop&auto=format"
coverImageAlt: "<alt text>"
tags: ["tag1", "tag2", "tag3", "tag4"]
draft: false
featured: false
articleType: "${format.articleType}"
affiliateDisclosure: true
faq:
  - question: "<question>"
    answer: "<answer>"
  - question: "<question>"
    answer: "<answer>"
  - question: "<question>"
    answer: "<answer>"
---

Unsplash photo IDs:
- Email/outreach: photo-1596526131083-e8c633c948d2
- Laptop/work: photo-1499750310107-5fef28a66643
- Team/office: photo-1522071820081-009f0129c71c
- Data/analytics: photo-1551288049-bebda4e38f71
- Writing/docs: photo-1484788984921-03950022c9ef
- Sales/CRM: photo-1560472354-b33ff0c44a43
- Communication: photo-1423666639041-f56000c27a9a
- Planning: photo-1611532736597-de2d4265fba3
- AI/tech: photo-1677442135703-1787eea5ce01

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
  const format = pickFormat()

  console.log(`Article format: ${format.name}`)

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
      messages: [{ role: 'user', content: topicPickerPrompt(existingArticles, categories, format) }],
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
    model: 'claude-haiku-4-5',
    max_tokens: 5000,
    messages: [
      {
        role: 'user',
        content: articleWriterPrompt(topic, format, existingArticles, categories, today),
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
