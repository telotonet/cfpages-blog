import { CheckCircle, XCircle } from 'lucide-react'

interface ProsConsProps {
  pros: string[]
  cons: string[]
  prosTitle?: string
  consTitle?: string
}

export function ProsCons({
  pros,
  cons,
  prosTitle = 'Pros',
  consTitle = 'Cons',
}: ProsConsProps) {
  return (
    <div className="not-prose my-8 grid gap-4 lg:grid-cols-2">
      {/* Pros */}
      <div className="rounded-[1.25rem] border border-green-200/90 bg-green-50/90 p-5 shadow-[0_24px_48px_-40px_rgba(22,163,74,0.45)] dark:border-green-800 dark:bg-green-950/20">
        <p className="mb-3 flex items-center gap-2 font-sans text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-green-700 dark:text-green-400">
          <CheckCircle size={15} aria-hidden="true" />
          {prosTitle}
        </p>
        <ul className="space-y-2.5">
          {pros.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[0.98rem] leading-[1.6] text-foreground/90">
              <CheckCircle
                size={14}
                className="mt-0.5 flex-shrink-0 text-green-500"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Cons */}
      <div className="rounded-[1.25rem] border border-red-200/90 bg-red-50/90 p-5 shadow-[0_24px_48px_-40px_rgba(239,68,68,0.4)] dark:border-red-800 dark:bg-red-950/20">
        <p className="mb-3 flex items-center gap-2 font-sans text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-red-700 dark:text-red-400">
          <XCircle size={15} aria-hidden="true" />
          {consTitle}
        </p>
        <ul className="space-y-2.5">
          {cons.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[0.98rem] leading-[1.6] text-foreground/90">
              <XCircle
                size={14}
                className="mt-0.5 flex-shrink-0 text-red-500"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
