import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Basic terms for using Telotonet and its informational software review content.',
  alternates: { canonical: '/terms/' },
  robots: { index: true, follow: false },
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-site px-4 py-10 sm:px-6">
      <div className="mb-6">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Terms of Use' }]} />
      </div>

      <div className="mx-auto max-w-[72ch]">
        <h1 className="mb-6 font-sans text-3xl font-bold tracking-tight text-foreground">
          Terms of Use
        </h1>

        <div className="prose prose-base dark:prose-invert max-w-none article-body">
          <p>Last updated: April 2026.</p>

          <p>
            By using Telotonet, you agree to use the site for lawful purposes and understand that
            the content is provided for general informational purposes only.
          </p>

          <h2>No professional advice</h2>
          <p>
            Content on this site does not constitute legal, financial, tax, or professional
            advice. You are responsible for evaluating any software, vendor, or workflow before
            making a purchase decision.
          </p>

          <h2>Content accuracy</h2>
          <p>
            We aim to keep information current, but software products change frequently. We do
            not guarantee that every article, price, feature description, or limitation is always
            complete, current, or error-free.
          </p>

          <h2>Third-party services and links</h2>
          <p>
            The site may link to third-party websites or services. We are not responsible for the
            content, availability, or policies of those third parties.
          </p>

          <h2>Intellectual property</h2>
          <p>
            Unless otherwise stated, site content and branding belong to Telotonet. You may not
            republish or commercially reuse substantial parts of the site without permission.
          </p>

          <h2>Contact</h2>
          <p>
            For questions about these terms, contact{' '}
            <a href="mailto:telotonet@gmail.com">telotonet@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
