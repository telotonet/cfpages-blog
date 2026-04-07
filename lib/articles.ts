import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { Article, ArticleMeta, ArticleFrontmatter, TOCItem } from './types'

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')

// ─── File discovery ───────────────────────────────────────────────────────────

function getArticleFilenames(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return []
  return fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.mdx'))
}

// ─── Single article ───────────────────────────────────────────────────────────

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const stats = readingTime(content)

  const frontmatter = data as ArticleFrontmatter

  return {
    ...frontmatter,
    slug,
    readingTime: Math.ceil(stats.minutes),
    content,
  }
}

// ─── All articles ─────────────────────────────────────────────────────────────

export interface GetArticlesOptions {
  includeDrafts?: boolean
  category?: string
  tag?: string
  limit?: number
  featured?: boolean
}

export function getAllArticles(options: GetArticlesOptions = {}): ArticleMeta[] {
  const filenames = getArticleFilenames()

  const articles = filenames
    .map((filename): ArticleMeta | null => {
      const slug = filename.replace(/\.mdx$/, '')
      const filePath = path.join(ARTICLES_DIR, filename)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(raw)
      const stats = readingTime(content)

      return {
        ...(data as ArticleFrontmatter),
        slug,
        readingTime: Math.ceil(stats.minutes),
      }
    })
    .filter((a): a is ArticleMeta => a !== null)
    .filter((a) => options.includeDrafts || !a.draft)
    .filter((a) => !options.category || a.category === options.category)
    .filter((a) => !options.tag || a.tags?.includes(options.tag))
    .filter((a) => options.featured === undefined || a.featured === options.featured)

  const sorted = articles.sort((a, b) => {
    // Featured articles first
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    // Then by date, newest first
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  })

  return options.limit ? sorted.slice(0, options.limit) : sorted
}

// ─── Related articles ─────────────────────────────────────────────────────────

export function getRelatedArticles(
  slug: string,
  relatedSlugs: string[] = [],
  fallbackCategory?: string,
  limit = 3,
): ArticleMeta[] {
  if (relatedSlugs.length > 0) {
    const explicit = relatedSlugs
      .map((s) => {
        const a = getArticleBySlug(s)
        if (!a || a.draft) return null
        return a as ArticleMeta
      })
      .filter((a): a is ArticleMeta => a !== null)
      .slice(0, limit)

    if (explicit.length >= limit) return explicit
  }

  // Fallback: same category, excluding current
  const fallback = getAllArticles({ category: fallbackCategory })
    .filter((a) => a.slug !== slug)
    .slice(0, limit)

  return fallback
}

// ─── All slugs (for generateStaticParams) ────────────────────────────────────

export function getAllArticleSlugs(): string[] {
  return getArticleFilenames().map((f) => f.replace(/\.mdx$/, ''))
}

// ─── TOC extraction ───────────────────────────────────────────────────────────

export function extractTOC(content: string): TOCItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const items: TOCItem[] = []
  const slugCounts = new Map<string, number>()
  let match: RegExpExecArray | null

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3
    const raw = match[2].trim()
    // Strip common markdown/MDX markers while preserving readable heading text.
    const text = raw
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_`~]/g, '')
      .replace(/<[^>]+>/g, '')
      .trim()

    const baseId = text
      .toLowerCase()
      .replace(/[()[\]{}:;,.!?/\\]+/g, ' ')
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'section'

    const seenCount = slugCounts.get(baseId) ?? 0
    slugCounts.set(baseId, seenCount + 1)
    const id = seenCount === 0 ? baseId : `${baseId}-${seenCount + 1}`

    items.push({ id, text, level })
  }

  return items
}

// ─── All tags ─────────────────────────────────────────────────────────────────

export function getAllTags(): string[] {
  const articles = getAllArticles()
  const tagSet = new Set<string>()
  for (const a of articles) {
    for (const tag of a.tags ?? []) {
      tagSet.add(tag)
    }
  }
  return Array.from(tagSet).sort()
}
