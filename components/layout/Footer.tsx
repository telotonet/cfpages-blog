import Link from 'next/link'

const FOOTER_LINKS = [
  {
    title: 'Content',
    links: [
      { href: '/articles/', label: 'All Articles' },
      { href: '/categories/', label: 'Categories' },
    ],
  },
  {
    title: 'About',
    links: [
      { href: '/about/', label: 'About Us' },
      { href: '/contact/', label: 'Contact' },
      { href: '/editorial-policy/', label: 'Editorial Policy' },
      { href: '/affiliate-disclosure/', label: 'Affiliate Disclosure' },
    ],
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/30" aria-label="Site footer">
      <div className="mx-auto max-w-site px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-sans text-base font-bold text-foreground hover:text-accent transition-colors"
            >
              <span className="text-accent" aria-hidden="true">▸</span>
              AI Tools Hub
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Honest reviews, comparisons, and guides for the best B2B SaaS and AI tools.
              We help you choose the right software for your business.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              This site contains affiliate links.{' '}
              <Link href="/affiliate-disclosure/" className="underline hover:text-foreground">
                Learn more
              </Link>
            </p>
          </div>

          {/* Nav sections */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {currentYear} AI Tools Hub. All rights reserved.</p>
          <p>
            Content is for informational purposes only.{' '}
            <Link href="/editorial-policy/" className="underline hover:text-foreground">
              Editorial Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
