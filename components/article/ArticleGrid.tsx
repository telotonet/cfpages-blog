import type { ArticleMeta } from '@/lib/types'
import { ArticleCard } from './ArticleCard'

interface ArticleGridProps {
  articles: ArticleMeta[]
  showFeatured?: boolean
}

export function ArticleGrid({ articles, showFeatured = false }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Статей пока нет.</p>
      </div>
    )
  }

  const [first, ...rest] = articles

  // Show first article as featured hero card if showFeatured is true
  if (showFeatured && articles.length > 0 && first.featured) {
    return (
      <div className="space-y-8">
        <ArticleCard article={first} featured />
        {rest.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  )
}
