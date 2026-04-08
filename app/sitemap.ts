import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

import { getAllArticles } from '@/lib/articles'
import { getAllCategories } from '@/lib/categories'
import { absoluteUrl } from '@/lib/utils'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://telotonet.com'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/articles/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact/`,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  const articles = getAllArticles()
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}/`,
    lastModified: new Date(article.updatedAt ?? article.publishedAt),
    changeFrequency: 'monthly',
    priority: article.featured ? 0.9 : 0.7,
  }))

  const categories = getAllCategories()
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...articlePages, ...categoryPages]
}
