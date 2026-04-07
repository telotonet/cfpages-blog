import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/articles'
import { getAllCategories } from '@/lib/categories'
import { ArticlesClient } from './ArticlesClient'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Все статьи',
  description:
    'Обзоры, сравнения и гайды по лучшим AI-инструментам. Находите подходящие инструменты для своих задач.',
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
          items={[{ label: 'Главная', href: '/' }, { label: 'Статьи' }]}
        />
      </div>

      <div className="mb-8">
        <h1 className="mb-2 font-sans text-3xl font-bold tracking-tight text-foreground">
          Все статьи
        </h1>
        <p className="text-muted-foreground">
          Обзоры, сравнения и гайды по AI-инструментам
          <span className="ml-2 text-sm">— {articles.length} материалов</span>
        </p>
      </div>

      {/* Client component handles category filter + rendering */}
      <ArticlesClient articles={articles} categories={categories} />
    </div>
  )
}
