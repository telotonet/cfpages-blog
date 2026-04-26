// ─── Article types ────────────────────────────────────────────────────────────

export type ArticleType = 'best-of' | 'review' | 'comparison' | 'tutorial'

export interface FAQItem {
  question: string
  answer: string
}

export interface ArticleFrontmatter {
  title: string
  description: string
  excerpt: string
  publishedAt: string
  updatedAt?: string
  author: string
  authorUrl?: string
  category: string
  tags: string[]
  coverImage?: string
  coverImageAlt?: string
  draft: boolean
  featured: boolean
  articleType: ArticleType
  relatedSlugs?: string[]
  faq?: FAQItem[]
  canonicalUrl?: string
  ogImage?: string
}

export interface ArticleMeta extends ArticleFrontmatter {
  slug: string
  readingTime: number
}

export interface Article extends ArticleMeta {
  content: string
}

// ─── Category types ───────────────────────────────────────────────────────────

export interface CategoryMeta {
  slug: string
  name: string
  description: string
  excerpt?: string
  coverImage?: string
  color?: string
  icon?: string
}

// ─── TOC types ────────────────────────────────────────────────────────────────

export interface TOCItem {
  id: string
  text: string
  level: 2 | 3
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  perPage: number
  total: number
}
