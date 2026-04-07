import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Свяжитесь с редакцией AI Tools Hub по вопросам сотрудничества или обратной связи.',
  alternates: { canonical: '/contact/' },
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-site px-4 py-10 sm:px-6">
      <div className="mb-6">
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Контакты' }]} />
      </div>

      <div className="mx-auto max-w-[72ch]">
        <h1 className="mb-4 font-sans text-3xl font-bold tracking-tight text-foreground">
          Контакты
        </h1>
        <p className="mb-8 text-muted-foreground">
          Есть вопрос, нашли ошибку или хотите предложить тему для обзора?
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          {[
            {
              title: 'По вопросам контента',
              text: 'Нашли неточность, хотите предложить тему или статью для рассмотрения.',
              hint: 'Тема письма: [Контент]',
            },
            {
              title: 'Партнёрство и реклама',
              text: 'Обсудить нативное размещение, партнёрскую программу или другое сотрудничество.',
              hint: 'Тема письма: [Партнёрство]',
            },
            {
              title: 'Технические вопросы',
              text: 'Сайт работает некорректно, сломана ссылка или другие технические проблемы.',
              hint: 'Тема письма: [Техника]',
            },
            {
              title: 'Другое',
              text: 'Любые другие вопросы, которые не попадают в вышеперечисленные категории.',
              hint: '',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border bg-card p-5">
              <h2 className="mb-1.5 font-sans text-sm font-semibold text-foreground">
                {item.title}
              </h2>
              <p className="mb-2 text-sm text-muted-foreground">{item.text}</p>
              {item.hint && (
                <p className="text-xs text-muted-foreground/70">{item.hint}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border bg-muted/40 p-6">
          <p className="text-sm text-muted-foreground">
            Мы не публикуем платные обзоры и не продаём места в рейтингах.
            Все материалы — результат самостоятельного тестирования и редакторской работы.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Прочитайте нашу{' '}
            <a
              href="/editorial-policy/"
              className="text-accent underline hover:no-underline"
            >
              редакционную политику
            </a>{' '}
            перед тем, как отправлять предложение.
          </p>
        </div>
      </div>
    </div>
  )
}
