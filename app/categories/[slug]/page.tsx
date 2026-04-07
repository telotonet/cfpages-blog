import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategoryBySlug, getAllCategorySlugs } from '@/lib/categories'
import { getAllArticles } from '@/lib/articles'
import { buildCategoryMetadata, buildBreadcrumbSchema } from '@/lib/seo'
import { ArticleCard } from '@/components/article/ArticleCard'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'

// Next.js 15: params is a Promise
interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}
  const articles = getAllArticles({ category: slug })
  return buildCategoryMetadata(category, articles.length)
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const articles = getAllArticles({ category: slug })

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Главная', href: '/' },
    { name: 'Категории', href: '/categories/' },
    { name: category.name, href: `/categories/${category.slug}/` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <div className="mx-auto max-w-site px-4 py-10 sm:px-6">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'Главная', href: '/' },
              { label: 'Категории', href: '/categories/' },
              { label: category.name },
            ]}
          />
        </div>

        <div className="mb-8">
          <h1 className="mb-2 font-sans text-3xl font-bold tracking-tight text-foreground">
            {category.name}
          </h1>
          <p className="text-muted-foreground">
            {category.description}
            {articles.length > 0 && (
              <span className="ml-2 text-sm">— {articles.length} материалов</span>
            )}
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">В этой категории пока нет статей.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
