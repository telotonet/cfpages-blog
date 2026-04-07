'use client'

import { useState } from 'react'
import type { ArticleMeta } from '@/lib/types'
import type { CategoryMeta } from '@/lib/types'
import { ArticleCard } from '@/components/article/ArticleCard'
import { cn } from '@/lib/utils'

interface ArticlesClientProps {
  articles: ArticleMeta[]
  categories: CategoryMeta[]
}

export function ArticlesClient({ articles, categories }: ArticlesClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = activeCategory
    ? articles.filter((a) => a.category === activeCategory)
    : articles

  return (
    <>
      {/* Category filter */}
      {categories.length > 0 && (
        <div
          className="mb-8 flex flex-wrap gap-2"
          role="group"
          aria-label="Фильтр по категориям"
        >
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            aria-pressed={activeCategory === null}
            className={cn(
              'inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
              activeCategory === null
                ? 'bg-accent text-accent-foreground'
                : 'border text-muted-foreground hover:border-accent hover:text-accent'
            )}
          >
            Все ({articles.length})
          </button>
          {categories.map((cat) => {
            const count = articles.filter((a) => a.category === cat.slug).length
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                aria-pressed={activeCategory === cat.slug}
                className={cn(
                  'inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
                  activeCategory === cat.slug
                    ? 'bg-accent text-accent-foreground'
                    : 'border text-muted-foreground hover:border-accent hover:text-accent'
                )}
              >
                {cat.name} ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* Articles grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">В этой категории пока нет статей.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </>
  )
}
