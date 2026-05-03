import type { MDXComponents } from 'mdx/types'
import { Callout } from './Callout'
import { Notice } from './Notice'
import { ProsCons } from './ProsCons'
import { ComparisonTable } from './ComparisonTable'
import { CTABox } from './CTABox'
import { FAQBlock } from './FAQBlock'
import { ImageBlock } from './ImageBlock'
import { ToolSummaryCard } from './ToolSummaryCard'

export const mdxComponents: MDXComponents = {
  // Custom components available inside all MDX files
  Callout,
  Notice,
  ProsCons,
  ComparisonTable,
  CTABox,
  FAQBlock,
  ImageBlock,
  ToolSummaryCard,
}

export {
  Callout,
  Notice,
  ProsCons,
  ComparisonTable,
  CTABox,
  FAQBlock,
  ImageBlock,
  ToolSummaryCard,
}
