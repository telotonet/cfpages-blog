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
            We write about tools we have tested ourselves. Topics are chosen by the editorial
            team based on relevance, reader demand, and practical value. We do not accept
            commissioned articles.
          </p>

          <h2>Testing process</h2>
          <p>
            Before publishing a review or comparison, we create an account and use the product
            in real work scenarios. For paid plans, we either use trial periods or purchase a
            subscription. We test against the claims made on the product's website.
          </p>

          <h2>Affiliate links and objectivity</h2>
          <p>
            Some links on this site are affiliate links. This means we may receive a commission
            if you click through and sign up. Affiliate relationships <strong>do not influence</strong> our
            ratings, rankings, or recommendations.
          </p>
          <p>
            All articles containing affiliate links include a clear disclosure at the top.
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
            <li>Content written without testing the product</li>
            <li>Comparisons based solely on vendor marketing materials</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
