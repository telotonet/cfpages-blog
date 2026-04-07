import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/articles'
import { getAllCategories } from '@/lib/categories'
import { ArticlesClient } from './ArticlesClient'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'All Articles',
  description:
    'Reviews, comparisons, and guides for the best B2B SaaS and AI tools. Find the right software for your business.',
  alternates: { canonical: '/articles/' },
}

// Static export: render all articles server-side, filter client-side
export default function ArticlesPage() {
  const articles = getAllArticles()
  const categories = getAllCategories()

  return (
    <div className="mx-auto max-w-site px-4 py-10 sm:px-6">
      <div className="mb-6">
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }, { label: 'Articles' }]}
        />
      </div>

      <div className="mb-8">
        <h1 className="mb-2 font-sans text-3xl font-bold tracking-tight text-foreground">
          All Articles
        </h1>
        <p className="text-muted-foreground">
          Reviews, comparisons, and guides for B2B SaaS tools
          <span className="ml-2 text-sm">— {articles.length} articles</span>
        </p>
      </div>

      {/* Client component handles category filter + rendering */}
      <ArticlesClient articles={articles} categories={categories} />
    </div>
  )
}
