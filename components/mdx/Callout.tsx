import { cn } from '@/lib/utils'
import { Info, AlertTriangle, CheckCircle, Zap } from 'lucide-react'

type CalloutType = 'info' | 'warning' | 'success' | 'tip'

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: React.ReactNode
}

const config = {
  info: {
    icon: Info,
    classes: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30',
    iconClass: 'text-blue-500',
    titleClass: 'text-blue-700 dark:text-blue-400',
  },
  warning: {
    icon: AlertTriangle,
    classes: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30',
    iconClass: 'text-amber-500',
    titleClass: 'text-amber-700 dark:text-amber-400',
  },
  success: {
    icon: CheckCircle,
    classes: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30',
    iconClass: 'text-green-500',
    titleClass: 'text-green-700 dark:text-green-400',
  },
  tip: {
    icon: Zap,
    classes: 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30',
    iconClass: 'text-purple-500',
    titleClass: 'text-purple-700 dark:text-purple-400',
  },
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const { icon: Icon, classes, iconClass, titleClass } = config[type]

  return (
    <aside
      role="note"
      className={cn(
        'not-prose my-8 rounded-[1.2rem] border p-5 text-[0.98rem] shadow-[0_20px_40px_-38px_rgba(15,23,42,0.35)]',
        classes
      )}
    >
      <div className="flex gap-3.5">
        <Icon size={18} className={cn('mt-1 flex-shrink-0', iconClass)} aria-hidden="true" />
        <div className="flex-1 space-y-1.5">
          {title && (
            <p className={cn('font-sans text-[0.92rem] font-semibold uppercase tracking-[0.08em]', titleClass)}>{title}</p>
          )}
          <div className="leading-[1.7] text-foreground/88">{children}</div>
        </div>
      </div>
    </aside>
  )
}
