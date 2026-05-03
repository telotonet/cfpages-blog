import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Alex',
  description:
    'Alex writes and updates Telotonet articles about B2B SaaS tools, pricing, implementation tradeoffs, and workflow fit for small teams.',
  alternates: { canonical: '/authors/alex/' },
}

export default function AlexAuthorPage() {
  return (
    <div className="mx-auto max-w-site px-4 py-10 sm:px-6">
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about/' },
            { label: 'Alex' },
          ]}
        />
      </div>

      <div className="mx-auto max-w-[72ch]">
        <h1 className="mb-4 font-sans text-3xl font-bold tracking-tight text-foreground">
          Alex
        </h1>

        <div className="prose prose-base dark:prose-invert max-w-none article-body">
          <p>
            Alex writes and updates reviews, comparisons, and setup guides for B2B SaaS tools on
            Telotonet. The editorial focus is practical software evaluation for small teams:
            pricing, limits, workflow fit, admin tradeoffs, and where a tool is likely to break
            down in real use.
          </p>

          <p>
            Articles are based on product research, product documentation, changelogs, pricing
            pages, and editorial analysis intended to help readers compare tools faster and make
            clearer purchase decisions.
          </p>

          <p>
            For corrections or editorial questions, contact{' '}
            <a href="mailto:telotonet@gmail.com">telotonet@gmail.com</a> or visit the{' '}
            <Link href="/contact/">contact page</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
