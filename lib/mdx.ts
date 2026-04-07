import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import type { MDXComponents } from 'mdx/types'

// MDX components are imported lazily to avoid circular dependencies
// They are passed from the calling page component

export interface CompileMDXOptions {
  components?: MDXComponents
}

export async function compileMDXContent(source: string, options: CompileMDXOptions = {}) {
  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              // prepend: inserts aria-hidden '#' before heading text — clean semantics
              behavior: 'prepend',
              properties: {
                ariaHidden: 'true',
                tabIndex: -1,
                className: ['anchor-link'],
              },
              content: { type: 'text', value: '#' },
            },
          ],
          rehypeHighlight,
        ],
      },
    },
    components: options.components ?? {},
  })

  return content
}
