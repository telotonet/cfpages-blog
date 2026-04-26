import { cn } from '@/lib/utils'

interface NoticeProps {
  children: React.ReactNode
  className?: string
}

// Lightweight text-only notice for short disclaimers or notes.
export function Notice({ children, className }: NoticeProps) {
  return (
    <aside
      role="note"
      className={cn(
        'not-prose my-8 rounded-[1rem] border border-border/80 bg-muted/60 px-4 py-3.5 text-[0.85rem] leading-[1.65] text-muted-foreground sm:px-5',
        className
      )}
    >
      {children}
    </aside>
  )
}
