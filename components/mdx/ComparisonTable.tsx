import { CheckCircle, XCircle, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ComparisonRow {
  feature: string
  [tool: string]: string | boolean | null
}

interface ComparisonTableProps {
  tools: string[]
  rows: ComparisonRow[]
  caption?: string
}

function CellValue({ value }: { value: string | boolean | null }) {
  if (value === true)
    return <CheckCircle size={16} className="mx-auto text-green-500" aria-label="Yes" />
  if (value === false)
    return <XCircle size={16} className="mx-auto text-red-400" aria-label="No" />
  if (value === null || value === '')
    return <Minus size={14} className="mx-auto text-muted-foreground/50" aria-label="N/A" />
  return <span>{value}</span>
}

export function ComparisonTable({ tools, rows, caption }: ComparisonTableProps) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        {caption && (
          <caption className="mb-2 text-left text-xs text-muted-foreground px-4 py-2">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="border-b bg-muted/60">
            <th className="px-4 py-3 text-left font-sans font-semibold text-foreground">
              Feature
            </th>
            {tools.map((tool) => (
              <th
                key={tool}
                className="px-4 py-3 text-center font-sans font-semibold text-foreground"
              >
                {tool}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                'border-b last:border-0',
                rowIndex % 2 === 0 ? 'bg-transparent' : 'bg-muted/20'
              )}
            >
              <td className="px-4 py-3 font-medium text-foreground/90">{row.feature}</td>
              {tools.map((tool) => (
                <td key={tool} className="px-4 py-3 text-center text-foreground/80">
                  <CellValue value={row[tool] as string | boolean | null} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
