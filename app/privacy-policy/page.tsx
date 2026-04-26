import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Telotonet collects and uses basic site data, cookies, analytics, and advertising signals.',
  alternates: { canonical: '/privacy-policy/' },
  robots: { index: true, follow: false },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-site px-4 py-10 sm:px-6">
      <div className="mb-6">
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]}
        />
      </div>

      <div className="mx-auto max-w-[72ch]">
        <h1 className="mb-6 font-sans text-3xl font-bold tracking-tight text-foreground">
          Privacy Policy
        </h1>

        <div className="prose prose-base dark:prose-invert max-w-none article-body">
          <p>Last updated: April 2026.</p>

          <p>
            Telotonet collects limited website usage data to understand traffic, improve the
            site experience, and support analytics and advertising features.
          </p>

          <h2>What data we collect</h2>
          <p>We may collect basic technical and usage information, including:</p>
          <ul>
            <li>pages viewed and approximate visit timing</li>
            <li>referring source, browser, device type, and country-level location data</li>
            <li>cookie and consent preferences you set on the site</li>
          </ul>

          <h2>Cookies and similar technologies</h2>
          <p>
            The site may use cookies or similar technologies for analytics, consent management,
            advertising, and site performance. You can accept or reject optional cookies through
            the cookie banner shown on the site.
          </p>

          <h2>Analytics and advertising</h2>
          <p>
            We use Google Analytics to understand traffic patterns and Google AdSense or similar
            advertising services to support the site. These services may process limited data in
            accordance with their own policies and the consent choices you make on this site.
          </p>

          <h2>How we use information</h2>
          <p>Collected information may be used to:</p>
          <ul>
            <li>measure traffic and content performance</li>
            <li>maintain site reliability and security</li>
            <li>support advertising and monetization features</li>
            <li>respond to messages sent to us directly</li>
          </ul>

          <h2>Email contact</h2>
          <p>
            If you contact us by email, we receive the information you include in your message.
            We use that information only to respond and handle the request.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about this policy, contact{' '}
            <a href="mailto:telotonet@gmail.com">telotonet@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
