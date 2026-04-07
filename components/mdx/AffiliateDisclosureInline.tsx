import Link from 'next/link'
import { Info } from 'lucide-react'

export function AffiliateDisclosureInline() {
  return (
    <aside
      aria-label="Affiliate disclosure"
      className="not-prose mb-8 flex items-start gap-2.5 rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground"
    >
      <Info size={13} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
      <p>
        This article contains affiliate links. If you click through and sign up,
        we may earn a small commission at no extra cost to you.
        This helps keep the site running.{' '}
        <Link
          href="/affiliate-disclosure/"
          className="underline hover:text-foreground transition-colors"
        >
          Learn more about affiliate links
        </Link>
        .
      </p>
    </aside>
  )
}
