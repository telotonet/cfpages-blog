import Link from 'next/link'
import Image from 'next/image'
import type { ArticleMeta } from '@/lib/types'
import { formatDate, ARTICLE_TYPE_LABELS } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Clock } from 'lucide-react'

interface ArticleCardProps {
  article: ArticleMeta
  featured?: boolean
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const href = `/articles/${article.slug}/`

  if (featured) {
    return (
      <article className="group relative overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
        <Link href={href} className="absolute inset-0 z-10" aria-label={article.title} />

        <div className="grid md:grid-cols-2">
          {/* Cover image */}
          <div className="relative aspect-[16/9] overflow-hidden bg-muted md:aspect-auto md:min-h-[260px]">
            {article.coverImage && article.coverImage.length > 0 ? (
              <Image
                src={article.coverImage}
                alt={article.coverImageAlt ?? article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5">
                <span className="text-4xl font-bold text-accent/20">AI</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-6 lg:p-8">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="accent">{ARTICLE_TYPE_LABELS[article.articleType]}</Badge>
              {article.featured && (
                <Badge variant="warning">Рекомендуем</Badge>
              )}
            </div>
            <h2 className="mb-2 font-sans text-xl font-bold leading-tight tracking-tight text-foreground group-hover:text-accent transition-colors lg:text-2xl">
              {article.title}
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{formatDate(article.publishedAt)}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock size={12} aria-hidden="true" />
                {article.readingTime} мин
              </span>
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
      <Link href={href} className="absolute inset-0 z-10" aria-label={article.title} />

      {/* Cover */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {article.coverImage && article.coverImage.length > 0 ? (
          <Image
            src={article.coverImage}
            alt={article.coverImageAlt ?? article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5">
            <span className="text-3xl font-bold text-accent/20">AI</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2.5 flex items-center gap-2">
          <Badge variant="muted">{ARTICLE_TYPE_LABELS[article.articleType]}</Badge>
        </div>
        <h2 className="mb-2 font-sans text-base font-semibold leading-snug tracking-tight text-foreground group-hover:text-accent transition-colors">
          {article.title}
        </h2>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{formatDate(article.publishedAt)}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock size={12} aria-hidden="true" />
            {article.readingTime} мин
          </span>
        </div>
      </div>
    </article>
  )
}
