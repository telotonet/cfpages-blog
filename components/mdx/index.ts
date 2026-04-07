import type { MDXComponents } from 'mdx/types'
import { Callout } from './Callout'
import { Notice } from './Notice'
import { ProsCons } from './ProsCons'
import { ComparisonTable } from './ComparisonTable'
import { CTABox } from './CTABox'
import { FAQBlock } from './FAQBlock'
import { AffiliateDisclosureInline } from './AffiliateDisclosureInline'
import { ImageBlock } from './ImageBlock'
import { QuoteBlock } from './QuoteBlock'
import { ToolSummaryCard } from './ToolSummaryCard'

export const mdxComponents: MDXComponents = {
  // Custom components available inside all MDX files
  Callout,
  Notice,
  ProsCons,
  ComparisonTable,
  CTABox,
  FAQBlock,
  AffiliateDisclosureInline,
  ImageBlock,
  QuoteBlock,
  ToolSummaryCard,
}

export {
  Callout,
  Notice,
  ProsCons,
  ComparisonTable,
  CTABox,
  FAQBlock,
  AffiliateDisclosureInline,
  ImageBlock,
  QuoteBlock,
  ToolSummaryCard,
}
