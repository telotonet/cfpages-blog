import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllCategories } from '@/lib/categories'
import { getAllArticles } from '@/lib/articles'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse all categories of B2B SaaS and AI tool reviews on Telotonet.',
  alternates: { canonical: '/categories/' },
}

export default function CategoriesPage() {
  const categories = getAllCategories()
  const allArticles = getAllArticles()

  // Count articles per category
  const countByCategory = allArticles.reduce<Record<string, number>>((acc, article) => {
    acc[article.category] = (acc[article.category] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="mx-auto max-w-site px-4 py-10 sm:px-6">
      <div className="mb-6">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Categories' }]} />
      </div>

      <div className="mb-8">
        <h1 className="mb-2 font-sans text-3xl font-bold tracking-tight text-foreground">
          Categories
        </h1>
        <p className="text-muted-foreground">Browse by topic — find the tool you need</p>
      </div>

      {categories.length === 0 ? (
        <p className="text-muted-foreground">No categories added yet.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const count = countByCategory[category.slug] ?? 0
            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}/`}
                className="group block rounded-xl border bg-card p-6 hover:shadow-md transition-shadow"
              >
                <h2 className="mb-2 font-sans text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                  {category.name}
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {category.description}
                </p>
                <span className="text-xs text-muted-foreground">
                  {count} {count === 1 ? 'article' : 'articles'}
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
