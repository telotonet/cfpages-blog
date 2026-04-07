import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Telotonet editorial team for corrections, partnerships, or article suggestions.',
  alternates: { canonical: '/contact/' },
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-site px-4 py-10 sm:px-6">
      <div className="mb-6">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
      </div>

      <div className="mx-auto max-w-[72ch]">
        <h1 className="mb-4 font-sans text-3xl font-bold tracking-tight text-foreground">
          Contact
        </h1>
        <p className="mb-8 text-muted-foreground">
          Found an error, have a question, or want to suggest a review topic?
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          {[
            {
              title: 'Content & editorial',
              text: 'Found an inaccuracy, want to suggest a topic, or submit an article for consideration.',
              hint: 'Subject: [Content]',
            },
            {
              title: 'Partnerships & advertising',
              text: 'Discuss sponsored content, affiliate programs, or other collaboration opportunities.',
              hint: 'Subject: [Partnership]',
            },
            {
              title: 'Technical issues',
              text: 'Site not working correctly, broken link, or other technical problems.',
              hint: 'Subject: [Technical]',
            },
            {
              title: 'Other',
              text: 'Anything that does not fit the categories above.',
              hint: '',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border bg-card p-5">
              <h2 className="mb-1.5 font-sans text-sm font-semibold text-foreground">
                {item.title}
              </h2>
              <p className="mb-2 text-sm text-muted-foreground">{item.text}</p>
              {item.hint && (
                <p className="text-xs text-muted-foreground/70">{item.hint}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border bg-muted/40 p-6">
          <p className="text-sm text-muted-foreground">
            We do not publish paid reviews or sell spots in rankings.
            All content is the result of independent testing and editorial work.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please read our{' '}
            <a
              href="/editorial-policy/"
              className="text-accent underline hover:no-underline"
            >
              editorial policy
            </a>{' '}
            before reaching out with a proposal.
          </p>
        </div>
      </div>
    </div>
  )
}
