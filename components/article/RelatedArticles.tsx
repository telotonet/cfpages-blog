import Link from 'next/link'
import type { ArticleMeta } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Clock, ArrowRight } from 'lucide-react'

interface RelatedArticlesProps {
  articles: ArticleMeta[]
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null

  return (
    <section aria-label="Похожие статьи" className="mt-12 border-t pt-10">
      <h2 className="mb-6 font-sans text-xl font-semibold text-foreground">
        Читайте также
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <article
            key={article.slug}
            className="group rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow"
          >
            <Link href={`/articles/${article.slug}/`} className="block">
              <h3 className="mb-2 font-sans text-sm font-semibold leading-snug text-foreground group-hover:text-accent transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="mb-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatDate(article.publishedAt)}</span>
                <span className="flex items-center gap-1">
                  <Clock size={11} aria-hidden="true" />
                  {article.readingTime} мин
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
