'use client'

import { useEffect, useRef, useState } from 'react'
import type { TOCItem } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TableOfContentsProps {
  items: TOCItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (items.length < 2) return

    const headingIds = items.map((item) => item.id)

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    )

    headingIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observerRef.current!.observe(el)
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [items])

  if (items.length < 2) return null

  return (
    <nav aria-label="Содержание статьи">
      <p className="mb-3 px-2 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Содержание
      </p>
      <ol className="space-y-0.5">
        {items.map((item, index) => {
          const isActive = activeId === item.id
          return (
            <li
              key={`${item.id}-${index}`}
              className={cn(item.level === 3 && 'ml-3')}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  setActiveId(item.id)
                }}
                className={cn(
                  'block rounded-lg px-2.5 py-1.5 text-[0.875rem] leading-snug transition-colors',
                  item.level === 3 && 'text-[0.825rem]',
                  isActive
                    ? 'bg-accent/10 font-medium text-accent'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {item.text}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
