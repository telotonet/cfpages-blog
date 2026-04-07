import Image from 'next/image'
import type { ArticleMeta } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Clock, Calendar, RefreshCw } from 'lucide-react'
import { ARTICLE_TYPE_LABELS } from '@/lib/utils'

interface ArticleHeaderProps {
  article: ArticleMeta
  categoryName?: string
}

export function ArticleHeader({ article, categoryName }: ArticleHeaderProps) {
  const breadcrumbItems = [
    { label: 'Главная', href: '/' },
    { label: 'Статьи', href: '/articles/' },
    ...(article.category && categoryName
      ? [{ label: categoryName, href: `/categories/${article.category}/` }]
      : []),
    { label: article.title },
  ]

  return (
    <header className="article-header mb-10 lg:mb-12">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Badges */}
      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <Badge variant="accent">{ARTICLE_TYPE_LABELS[article.articleType]}</Badge>
        {article.featured && <Badge variant="warning">Рекомендуем</Badge>}
        {article.tags?.slice(0, 3).map((tag, index) => (
          <Badge key={`${tag}-${index}`} variant="muted">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Title */}
      <h1 className="mb-5 text-balance font-sans text-[2.35rem] font-bold leading-[1.04] tracking-[-0.035em] text-foreground sm:text-[3rem] lg:text-[3.85rem]">
        {article.title}
      </h1>

      {/* Description */}
      <p className="mb-7 max-w-[40rem] text-[1.125rem] leading-[1.68] text-muted-foreground sm:text-[1.22rem]">
        {article.description}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-border/80 py-4 text-[0.92rem] text-muted-foreground">
        <span className="font-medium text-foreground">{article.author}</span>
        <span aria-hidden="true" className="hidden text-border sm:inline">|</span>
        <span className="flex items-center gap-1.5">
          <Calendar size={14} aria-hidden="true" />
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        </span>
        {article.updatedAt && (
          <>
            <span aria-hidden="true" className="hidden text-border sm:inline">|</span>
            <span className="flex items-center gap-1.5">
              <RefreshCw size={14} aria-hidden="true" />
              Обновлено: <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
            </span>
          </>
        )}
        <span aria-hidden="true" className="hidden text-border sm:inline">|</span>
        <span className="flex items-center gap-1.5">
          <Clock size={14} aria-hidden="true" />
          {article.readingTime} мин чтения
        </span>
      </div>

      {/* Cover image — only render if a real path is provided */}
      {article.coverImage && article.coverImage.length > 0 && (
        <div className="relative mt-8 aspect-[21/9] overflow-hidden rounded-[1.5rem] border border-border/70 bg-gradient-to-br from-accent/10 via-muted to-accent/5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
          <Image
            src={article.coverImage}
            alt={article.coverImageAlt ?? article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
            onError={() => {}}
          />
        </div>
      )}
    </header>
  )
}
