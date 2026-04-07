import Link from 'next/link'

const FOOTER_LINKS = [
  {
    title: 'Контент',
    links: [
      { href: '/articles/', label: 'Все статьи' },
      { href: '/categories/', label: 'Категории' },
    ],
  },
  {
    title: 'О сайте',
    links: [
      { href: '/about/', label: 'О нас' },
      { href: '/contact/', label: 'Контакты' },
      { href: '/editorial-policy/', label: 'Редполитика' },
      { href: '/affiliate-disclosure/', label: 'Партнёрские ссылки' },
    ],
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/30" aria-label="Подвал сайта">
      <div className="mx-auto max-w-site px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-sans text-base font-bold text-foreground hover:text-accent transition-colors"
            >
              <span className="text-accent" aria-hidden="true">▸</span>
              AI Tools Hub
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Честные обзоры, сравнения и гайды по лучшим AI-инструментам.
              Помогаем выбрать подходящий инструмент для вашей задачи.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Сайт содержит партнёрские ссылки.{' '}
              <Link href="/affiliate-disclosure/" className="underline hover:text-foreground">
                Подробнее
              </Link>
            </p>
          </div>

          {/* Nav sections */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {currentYear} AI Tools Hub. Все права защищены.</p>
          <p>
            Контент носит информационный характер.{' '}
            <Link href="/editorial-policy/" className="underline hover:text-foreground">
              Редполитика
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
