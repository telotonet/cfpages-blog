import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure',
  description: 'Information about affiliate links and commissions on Telotonet.',
  alternates: { canonical: '/affiliate-disclosure/' },
  robots: { index: true, follow: false },
}

export default function AffiliateDisclosurePage() {
  return (
    <div className="mx-auto max-w-site px-4 py-10 sm:px-6">
      <div className="mb-6">
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }, { label: 'Affiliate Disclosure' }]}
        />
      </div>

      <div className="mx-auto max-w-[72ch]">
        <h1 className="mb-6 font-sans text-3xl font-bold tracking-tight text-foreground">
          Affiliate Disclosure
        </h1>

        <div className="prose prose-base dark:prose-invert max-w-none article-body">
          <p>
            Last updated: January 2025.
          </p>

          <h2>What are affiliate links</h2>
          <p>
            Some links on this site are affiliate links. This means that if you click a link
            and make a purchase or sign up for a subscription, Telotonet may receive a small
            commission from the company at no additional cost to you.
          </p>

          <h2>How this affects you</h2>
          <p>
            Affiliate links <strong>do not increase the price</strong> you pay. The cost is
            identical to going directly to the company's website.
          </p>

          <h2>How this affects our reviews</h2>
          <p>
            Affiliate relationships <strong>do not influence</strong> our ratings, rankings,
            or recommendations. We write honestly about products — including their
            weaknesses — regardless of whether an affiliate program exists. Tools without
            affiliate programs are reviewed the same way if they are worth covering.
          </p>

          <h2>How we label affiliate content</h2>
          <p>
            Any article containing affiliate links includes a clear disclosure notice at the
            top of the page. You will always know when affiliate links are present.
          </p>

          <h2>Compliance</h2>
          <p>
            We comply with FTC guidelines on affiliate disclosure. If you have questions
            about our affiliate policy, reach out via the{' '}
            <a href="/contact/">contact page</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
