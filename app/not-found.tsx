import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p
        className="mb-2 font-sans text-8xl font-black text-accent/20 sm:text-9xl"
        aria-hidden="true"
      >
        404
      </p>
      <h1 className="mb-3 font-sans text-2xl font-bold text-foreground sm:text-3xl">
        Страница не найдена
      </h1>
      <p className="mb-8 max-w-sm text-muted-foreground">
        Возможно, ссылка устарела или страница была перемещена.
        Попробуйте начать с главной.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button href="/" size="lg">
          На главную
        </Button>
        <Button href="/articles/" size="lg" variant="outline">
          Все статьи
        </Button>
      </div>
    </div>
  )
}
