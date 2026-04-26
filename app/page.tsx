import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'
import { getAllCategories } from '@/lib/categories'
import { buildWebSiteSchema } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { ArticleCard } from '@/components/article/ArticleCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  const featuredArticles = getAllArticles({ featured: true, limit: 1 })
  const latestArticles = getAllArticles({ limit: 6 })
  const categories = getAllCategories()

  const heroArticle = featuredArticles[0] ?? latestArticles[0]

  return (
    <>
      <JsonLd data={buildWebSiteSchema()} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section aria-labelledby="hero-heading" className="border-b bg-muted/20">
        <div className="mx-auto max-w-site px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="accent" className="mb-4">
              B2B Software Reviews & Comparisons
            </Badge>
            <h1
              id="hero-heading"
              className="mb-5 font-sans text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Pick the right{' '}
              <span className="text-accent">software</span>{' '}
              before you pay for it
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Reviews and comparisons of B2B SaaS tools — email deliverability, CRM,
              AI writing, and productivity. Pricing, limits, and what the landing page leaves out.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button href="/articles/" size="lg">
                All Articles
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
              <Button href="/categories/" size="lg" variant="outline">
                Browse Categories
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured article ──────────────────────────────────────────────── */}
      {heroArticle && (
        <section aria-labelledby="featured-heading" className="border-b">
          <div className="mx-auto max-w-site px-4 py-12 sm:px-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 id="featured-heading" className="font-sans text-lg font-semibold text-foreground">
                Featured
              </h2>
              <Link
                href="/articles/"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                All articles →
              </Link>
            </div>
            <ArticleCard article={heroArticle} featured />
          </div>
        </section>
      )}

      {/* ── Latest articles ───────────────────────────────────────────────── */}
      <section aria-labelledby="latest-heading">
        <div className="mx-auto max-w-site px-4 py-12 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 id="latest-heading" className="font-sans text-lg font-semibold text-foreground">
              Latest Articles
            </h2>
            <Link
              href="/articles/"
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              All articles →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section aria-labelledby="categories-heading" className="border-t bg-muted/20">
          <div className="mx-auto max-w-site px-4 py-12 sm:px-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 id="categories-heading" className="font-sans text-lg font-semibold text-foreground">
                Categories
              </h2>
              <Link
                href="/categories/"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                All categories →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}/`}
                  className="group rounded-xl border bg-card p-5 hover:shadow-sm transition-shadow"
                >
                  <div className="mb-2 font-sans text-base font-semibold text-foreground group-hover:text-accent transition-colors">
                    {category.name}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Trust section ─────────────────────────────────────────────────── */}
      <section aria-label="How we work" className="border-t">
        <div className="mx-auto max-w-site px-4 py-12 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Practical',
                text: 'Articles focus on real buying questions: pricing, limits, workflow fit, and where each tool is a bad fit.',
              },
              {
                title: 'Specific',
                text: 'We focus on concrete details: what you get at each tier, what the limits actually are, and what the fine print says.',
              },
              {
                title: 'Updated',
                text: 'SaaS pricing and features change. Articles are revised when something significant shifts, and the last updated date is always visible.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border bg-card p-5">
                <h3 className="mb-2 font-sans text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
