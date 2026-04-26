import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Editorial Policy',
  description: 'How Telotonet selects, tests, and publishes content about B2B SaaS and AI tools.',
  alternates: { canonical: '/editorial-policy/' },
  robots: { index: true, follow: false },
}

export default function EditorialPolicyPage() {
  return (
    <div className="mx-auto max-w-site px-4 py-10 sm:px-6">
      <div className="mb-6">
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }, { label: 'Editorial Policy' }]}
        />
      </div>

      <div className="mx-auto max-w-[72ch]">
        <h1 className="mb-6 font-sans text-3xl font-bold tracking-tight text-foreground">
          Editorial Policy
        </h1>

        <div className="prose prose-base dark:prose-invert max-w-none article-body">
          <p>
            Last updated: January 2025.
          </p>

          <h2>How we select topics</h2>
          <p>
            Topics are chosen based on relevance, reader demand, and practical value for small
            business teams. We focus on software decisions where pricing, limits, workflow fit,
            and tradeoffs matter.
          </p>

          <h2>Research process</h2>
          <p>
            Reviews, comparisons, and guides are based on product research, public documentation,
            pricing pages, changelogs, product interfaces when accessible, and editorial analysis.
            We revise content when important details change.
          </p>

          <h2>Editorial independence</h2>
          <p>
            We do not sell rankings or publish paid reviews disguised as editorial content. If we
            ever run advertising or sponsorships, they are handled separately from editorial
            decisions.
          </p>

          <h2>Keeping content current</h2>
          <p>
            SaaS tools update frequently. We aim to revise articles when a product changes
            significantly — pricing, core features, or terms of service. The last updated date
            is shown at the top of each article.
          </p>

          <h2>Corrections</h2>
          <p>
            If you find a factual error, please let us know via the{' '}
            <a href="/contact/">contact page</a>. We will review and correct it with a note
            if needed.
          </p>

          <h2>What we do not publish</h2>
          <ul>
            <li>Paid reviews or paid rankings</li>
            <li>Native advertising without clear labeling</li>
            <li>Misleading claims about products, pricing, or capabilities</li>
            <li>Low-value content created only to fill space</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
