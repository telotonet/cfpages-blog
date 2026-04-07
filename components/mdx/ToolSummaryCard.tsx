import Link from 'next/link'
import { ExternalLink, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToolSummaryCardProps {
  name: string
  description: string
  href: string
  badge?: string
  rating?: number // 1-5
  pricing?: string
  bestFor?: string
  variant?: 'default' | 'top-pick'
}

export function ToolSummaryCard({
  name,
  description,
  href,
  badge,
  rating,
  pricing,
  bestFor,
  variant = 'default',
}: ToolSummaryCardProps) {
  const isExternal = href.startsWith('http')

  return (
    <aside
      className={cn(
        'not-prose my-6 overflow-hidden rounded-xl border',
        variant === 'top-pick' && 'border-accent/40 ring-1 ring-accent/20'
      )}
    >
      {variant === 'top-pick' && (
        <div className="bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground">
          Top Pick
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-sans text-base font-bold text-foreground">{name}</h3>
              {badge && (
                <span className="rounded-full bg-accent-subtle px-2 py-0.5 text-xs font-medium text-accent">
                  {badge}
                </span>
              )}
            </div>

            {rating !== undefined && (
              <div className="mt-1 flex items-center gap-1" aria-label={`Rating: ${rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={cn(
                      i < rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'
                    )}
                    aria-hidden="true"
                  />
                ))}
                <span className="ml-1 text-xs text-muted-foreground">{rating}/5</span>
              </div>
            )}
          </div>

          <Link
            href={href}
            className={cn(
              'flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold',
              'bg-accent text-accent-foreground hover:bg-accent/90 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
            )}
            {...(isExternal
              ? { target: '_blank', rel: 'noopener noreferrer nofollow' }
              : {})}
          >
            Visit
            <ExternalLink size={11} aria-hidden="true" />
          </Link>
        </div>

        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{description}</p>

        {(pricing || bestFor) && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {pricing && (
              <span>
                <span className="font-medium text-foreground">Price:</span> {pricing}
              </span>
            )}
            {bestFor && (
              <span>
                <span className="font-medium text-foreground">Best for:</span> {bestFor}
              </span>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
