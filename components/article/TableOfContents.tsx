import type { TOCItem } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TableOfContentsProps {
  items: TOCItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length < 2) return null

  return (
    <nav
      aria-label="Содержание статьи"
      className="article-toc rounded-[1.25rem] border border-border/80 bg-card/88 p-5 shadow-[0_20px_40px_-36px_rgba(15,23,42,0.4)] backdrop-blur-sm"
    >
      <p className="mb-3 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Содержание
      </p>
      <ol className="space-y-1">
        {items.map((item, index) => (
          <li
            key={`${item.id}-${index}`}
            className={cn(
              'text-[0.94rem] leading-[1.45]',
              item.level === 3 && 'ml-3'
            )}
          >
            <a
              href={`#${item.id}`}
              className={cn(
                'block rounded-lg px-2.5 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                item.level === 3 && 'py-1.5 text-[0.88rem]'
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
