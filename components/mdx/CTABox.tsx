import Link from 'next/link'
import { ExternalLink, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CTABoxProps {
  title: string
  description?: string
  href: string
  label: string
  badge?: string
  external?: boolean
  variant?: 'default' | 'prominent'
}

export function CTABox({
  title,
  description,
  href,
  label,
  badge,
  external,
  variant = 'default',
}: CTABoxProps) {
  const isExternal = external || href.startsWith('http')

  return (
    <aside
      className={cn(
        'not-prose my-10 overflow-hidden rounded-[1.5rem] border p-6 shadow-[0_28px_70px_-46px_rgba(15,23,42,0.35)] sm:p-7',
        variant === 'prominent'
          ? 'border-accent/30 bg-[linear-gradient(135deg,rgba(99,102,241,0.12),rgba(255,255,255,0.92))]'
          : 'border-border bg-[linear-gradient(135deg,rgba(148,163,184,0.08),rgba(255,255,255,0.92))]'
      )}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-sans text-[1.08rem] font-semibold leading-[1.3] text-foreground">{title}</p>
            {badge && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="max-w-[34rem] text-[0.98rem] leading-[1.65] text-muted-foreground">{description}</p>
          )}
        </div>

        <Link
          href={href}
          className={cn(
            'inline-flex min-h-11 flex-shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors',
            'bg-foreground text-background hover:bg-foreground/92',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'
          )}
          {...(isExternal
            ? { target: '_blank', rel: 'noopener noreferrer nofollow' }
            : {})}
        >
          {label}
          {isExternal ? (
            <ExternalLink size={14} aria-hidden="true" />
          ) : (
            <ArrowRight size={14} aria-hidden="true" />
          )}
        </Link>
      </div>
    </aside>
  )
}
