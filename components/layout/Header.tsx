import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import { MobileNav } from './MobileNav'

const NAV_LINKS = [
  { href: '/articles/', label: 'Articles' },
  { href: '/categories/', label: 'Categories' },
  { href: '/about/', label: 'About' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-site items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-sans text-lg font-bold tracking-tight text-foreground hover:text-accent transition-colors"
          aria-label="AI Tools Hub — go to homepage"
        >
          <span className="text-accent" aria-hidden="true">▸</span>
          AI Tools Hub
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
