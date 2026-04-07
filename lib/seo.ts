import type { Metadata } from 'next'
import type { ArticleMeta, CategoryMeta } from './types'
import { absoluteUrl, formatDateISO } from './utils'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'AI Tools Hub'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aitoolshub.com'
const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
  'Expert reviews, comparisons, and guides for the best AI tools'

// ─── Base metadata ────────────────────────────────────────────────────────────

export function buildBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    openGraph: {
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: absoluteUrl('/og-default.png'),
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@aitoolshub',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
    alternates: {
      canonical: SITE_URL,
    },
  }
}

// ─── Article metadata ─────────────────────────────────────────────────────────

export function buildArticleMetadata(article: ArticleMeta): Metadata {
  const url = absoluteUrl(`/articles/${article.slug}/`)
  const ogImage = article.ogImage ?? article.coverImage ?? absoluteUrl('/og-default.png')

  return {
    title: article.title,
    description: article.description,
    authors: [{ name: article.author }],
    openGraph: {
      type: 'article',
      url,
      title: article.title,
      description: article.description,
      publishedTime: formatDateISO(article.publishedAt),
      modifiedTime: article.updatedAt ? formatDateISO(article.updatedAt) : undefined,
      authors: [article.author],
      tags: article.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.coverImageAlt ?? article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [ogImage],
    },
    alternates: {
      canonical: article.canonicalUrl ?? url,
    },
  }
}

// ─── Category metadata ────────────────────────────────────────────────────────

export function buildCategoryMetadata(category: CategoryMeta, articleCount: number): Metadata {
  const url = absoluteUrl(`/categories/${category.slug}/`)
  const title = `${category.name} — Reviews & Comparisons`
  const description =
    category.excerpt ??
    `${category.description} Reviews, comparisons, and guides. ${articleCount} article${articleCount === 1 ? '' : 's'}.`

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url,
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  }
}

// ─── Schema.org JSON-LD ───────────────────────────────────────────────────────

export interface WebSiteSchema {
  '@context': string
  '@type': 'WebSite'
  name: string
  url: string
  description: string
  potentialAction: {
    '@type': 'SearchAction'
    target: { '@type': 'EntryPoint'; urlTemplate: string }
    'query-input': string
  }
}

export function buildWebSiteSchema(): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/articles/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export interface ArticleSchema {
  '@context': string
  '@type': 'Article'
  headline: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  author: { '@type': 'Person'; name: string; url?: string }
  publisher: { '@type': 'Organization'; name: string; url: string }
  image?: { '@type': 'ImageObject'; url: string; width: number; height: number }
  keywords?: string
  articleSection?: string
}

export function buildArticleSchema(article: ArticleMeta): ArticleSchema {
  const url = absoluteUrl(`/articles/${article.slug}/`)
  const schema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url,
    datePublished: formatDateISO(article.publishedAt),
    dateModified: article.updatedAt
      ? formatDateISO(article.updatedAt)
      : formatDateISO(article.publishedAt),
    author: {
      '@type': 'Person',
      name: article.author,
      url: article.authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    keywords: article.tags?.join(', '),
    articleSection: article.category,
  }

  if (article.coverImage) {
    schema.image = {
      '@type': 'ImageObject',
      url: absoluteUrl(article.coverImage),
      width: 1200,
      height: 630,
    }
  }

  return schema
}

export interface BreadcrumbSchema {
  '@context': string
  '@type': 'BreadcrumbList'
  itemListElement: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item: string
  }>
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; href: string }>,
): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  }
}

export interface FAQSchema {
  '@context': string
  '@type': 'FAQPage'
  mainEntity: Array<{
    '@type': 'Question'
    name: string
    acceptedAnswer: { '@type': 'Answer'; text: string }
  }>
}

export function buildFAQSchema(faq: Array<{ question: string; answer: string }>): FAQSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}
