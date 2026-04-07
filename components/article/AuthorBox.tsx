import Image from 'next/image'
import Link from 'next/link'
import type { ArticleMeta } from '@/lib/types'
import { formatDate } from '@/lib/utils'

const AUTHOR_AVATAR = 'https://avatars.githubusercontent.com/u/84102215?v=4'

interface AuthorBoxProps {
  article: ArticleMeta
}

export function AuthorBox({ article }: AuthorBoxProps) {
  return (
    <aside
      aria-label="About the author"
      className="mt-10 rounded-xl border bg-muted/30 p-6"
    >
      <div className="flex items-start gap-4">
        {/* Author avatar */}
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full" aria-hidden="true">
          <Image
            src={AUTHOR_AVATAR}
            alt={article.author}
            fill
            className="object-cover"
            sizes="48px"
          />
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
              · Published {formatDate(article.publishedAt)}
            </span>
            {article.updatedAt && (
              <span className="text-xs text-muted-foreground">
                · Updated {formatDate(article.updatedAt)}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Reviews and comparisons of B2B SaaS tools. Tests products and writes about what actually matters.
          </p>
        </div>
      </div>
    </aside>
  )
}
