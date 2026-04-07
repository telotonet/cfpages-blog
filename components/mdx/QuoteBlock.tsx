interface QuoteBlockProps {
  children: React.ReactNode
  author?: string
  source?: string
}

export function QuoteBlock({ children, author, source }: QuoteBlockProps) {
  return (
    <figure className="not-prose my-8">
      <blockquote className="relative overflow-hidden rounded-[1.4rem] border border-border/80 bg-[linear-gradient(135deg,rgba(99,102,241,0.08),rgba(255,255,255,0.76))] px-6 py-6 shadow-[0_24px_50px_-40px_rgba(15,23,42,0.35)]">
        <div className="mb-4 h-px w-14 bg-accent/55" aria-hidden="true" />
        <div className="font-serif text-[1.12rem] italic leading-[1.72] text-foreground/92 sm:text-[1.2rem]">
          {children}
        </div>
      </blockquote>
      {(author || source) && (
        <figcaption className="mt-3 pl-1 text-[0.92rem] text-muted-foreground">
          {author && <span className="font-medium text-foreground">— {author}</span>}
          {source && <span>, {source}</span>}
        </figcaption>
      )}
    </figure>
  )
}
