import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Telotonet publishes practical reviews, comparisons, and guides for B2B SaaS and AI tools used by business teams.',
  alternates: { canonical: '/about/' },
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-site px-4 py-10 sm:px-6">
      <div className="mb-6">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
      </div>

      <div className="mx-auto max-w-[72ch]">
        <h1 className="mb-6 font-sans text-3xl font-bold tracking-tight text-foreground">
          About Us
        </h1>

        <div className="prose prose-base dark:prose-invert max-w-none article-body">
          <p>
            <strong>Telotonet</strong> is an independent review and comparison site focused on
            B2B SaaS tools — email deliverability, sales automation, CRM, AI writing, and
            productivity software. We help business owners, marketers, and operators cut through
            the noise and pick the right tools.
          </p>

          <h2>What we do</h2>
          <p>
            We publish practical reviews, comparisons, and setup guides designed to help small
            teams evaluate software more quickly. Our goal is to summarize the tradeoffs clearly,
            surface important limits, and make product research easier to navigate.
          </p>

          <h2>Our principles</h2>
          <ul>
            <li>
              <strong>Independent.</strong> We never sell spots in rankings or accept paid reviews.
            </li>
            <li>
              <strong>Clear.</strong> We separate editorial content from advertising or partnership
              discussions.
            </li>
            <li>
              <strong>Current.</strong> SaaS tools change fast. We update articles when pricing
              or features shift, and always show the last updated date.
            </li>
          </ul>

          <h2>Who this site is for</h2>
          <p>
            Anyone who wants to make an informed decision: whether a tool is worth paying for,
            which option fits a specific use case, and how competing products actually compare
            in practice.
          </p>

          <h2>Get in touch</h2>
          <p>
            For corrections, questions, or article suggestions, visit the{' '}
            <a href="/contact/">contact page</a> or email{' '}
            <a href="mailto:telotonet@gmail.com">telotonet@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
