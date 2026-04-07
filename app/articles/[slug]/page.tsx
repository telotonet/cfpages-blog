import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getArticleBySlug,
  getAllArticleSlugs,
  getRelatedArticles,
  extractTOC,
} from '@/lib/articles'
import { getCategoryBySlug } from '@/lib/categories'
import {
  buildArticleMetadata,
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFAQSchema,
} from '@/lib/seo'
import { compileMDXContent } from '@/lib/mdx'
import { mdxComponents } from '@/components/mdx'
import { ArticleHeader } from '@/components/article/ArticleHeader'
import { TableOfContents } from '@/components/article/TableOfContents'
import { RelatedArticles } from '@/components/article/RelatedArticles'
import { AuthorBox } from '@/components/article/AuthorBox'
import { AffiliateDisclosureInline } from '@/components/mdx/AffiliateDisclosureInline'
import { FAQBlock } from '@/components/mdx/FAQBlock'
import { JsonLd } from '@/components/seo/JsonLd'

// Next.js 15: params is a Promise
interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article || article.draft) return {}
  return buildArticleMetadata(article)
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article || article.draft) {
    notFound()
  }

  const category = article.category ? getCategoryBySlug(article.category) : null
  const relatedArticles = getRelatedArticles(
    article.slug,
    article.relatedSlugs,
    article.category,
    3
  )
  const toc = extractTOC(article.content)

  const content = await compileMDXContent(article.content, {
    components: mdxComponents,
  })

  const articleSchema = buildArticleSchema(article)
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Главная', href: '/' },
    { name: 'Статьи', href: '/articles/' },
    ...(category ? [{ name: category.name, href: `/categories/${category.slug}/` }] : []),
    { name: article.title, href: `/articles/${article.slug}/` },
  ])

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      {article.faq && article.faq.length > 0 && (
        <JsonLd data={buildFAQSchema(article.faq)} />
      )}

      <div className="article-page-shell">
        <div className="mx-auto max-w-site px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-[76rem]">
            <ArticleHeader article={article} categoryName={category?.name} />

            <div className="article-reading-grid">
              <aside className="article-rail">
                <div className="article-rail-inner">
                  <TableOfContents items={toc} />
                </div>
              </aside>

              <div className="article-main">
                {article.affiliateDisclosure && <AffiliateDisclosureInline />}
                <article
                  className="article-body prose prose-base max-w-none dark:prose-invert"
                  aria-label={`Статья: ${article.title}`}
                >
                  {content}
                </article>
                {article.faq && article.faq.length > 0 && (
                  <FAQBlock items={article.faq} />
                )}
                <AuthorBox article={article} />
                <RelatedArticles articles={relatedArticles} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
