'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FAQItem } from '@/lib/types'

interface FAQBlockProps {
  items: FAQItem[]
  title?: string
}

function FAQItemComponent({ item, index }: { item: FAQItem; index: number }) {
  const [open, setOpen] = useState(false)
  const id = `faq-${index}`

  return (
    <div className="border-b last:border-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 py-4 text-left font-sans text-sm font-medium text-foreground hover:text-accent transition-colors"
      >
        <span>{item.question}</span>
        <ChevronDown
          size={16}
          className={cn(
            'mt-0.5 flex-shrink-0 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      <div
        id={id}
        role="region"
        aria-labelledby={`faq-btn-${index}`}
        className={cn(
          'overflow-hidden text-sm text-muted-foreground leading-relaxed',
          'transition-all duration-200',
          open ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        {item.answer}
      </div>
    </div>
  )
}

export function FAQBlock({ items, title = 'Frequently Asked Questions' }: FAQBlockProps) {
  if (!items?.length) return null

  return (
    <section
      aria-label={title}
      className="not-prose my-8 rounded-xl border bg-card p-6"
    >
      <h2 className="mb-4 font-sans text-lg font-semibold text-foreground">{title}</h2>
      <div>
        {items.map((item, index) => (
          <FAQItemComponent key={index} item={item} index={index} />
        ))}
      </div>
    </section>
  )
}
