import Link from 'next/link'
import type { ArticleMeta } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface AuthorBoxProps {
  article: ArticleMeta
}

export function AuthorBox({ article }: AuthorBoxProps) {
  return (
    <aside
      aria-label="Об авторе"
      className="mt-10 rounded-xl border bg-muted/30 p-6"
    >
      <div className="flex items-start gap-4">
        {/* Avatar placeholder */}
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 font-sans text-lg font-bold text-accent"
          aria-hidden="true"
        >
          {article.author.charAt(0).toUpperCase()}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {article.authorUrl ? (
              <Link
                href={article.authorUrl}
                className="font-sans text-sm font-semibold text-foreground hover:text-accent transition-colors"
                rel="author"
              >
                {article.author}
              </Link>
            ) : (
              <span className="font-sans text-sm font-semibold text-foreground">
                {article.author}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              · Опубликовано {formatDate(article.publishedAt)}
            </span>
            {article.updatedAt && (
              <span className="text-xs text-muted-foreground">
                · Обновлено {formatDate(article.updatedAt)}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Автор обзоров и сравнений AI-инструментов. Тестирует продукты и пишет честные материалы.
          </p>
        </div>
      </div>
    </aside>
  )
}
