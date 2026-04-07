import Link from 'next/link'
import { Info } from 'lucide-react'

export function AffiliateDisclosureInline() {
  return (
    <aside
      aria-label="Партнёрское раскрытие"
      className="not-prose mb-8 flex items-start gap-2.5 rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground"
    >
      <Info size={13} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
      <p>
        Эта статья содержит партнёрские ссылки. Если вы перейдёте по ним и оформите подписку,
        мы получим небольшую комиссию без дополнительных затрат для вас.
        Это помогает поддерживать сайт.{' '}
        <Link
          href="/affiliate-disclosure/"
          className="underline hover:text-foreground transition-colors"
        >
          Подробнее о партнёрских ссылках
        </Link>
        .
      </p>
    </aside>
  )
}
