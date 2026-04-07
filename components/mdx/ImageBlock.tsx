import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageBlockProps {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
}

export function ImageBlock({
  src,
  alt,
  caption,
  width = 1200,
  height = 630,
  priority = false,
  className,
}: ImageBlockProps) {
  return (
    <figure className={cn('not-prose my-10', className)}>
      <div className="overflow-hidden rounded-[1.35rem] border border-border/80 bg-muted shadow-[0_32px_70px_-52px_rgba(15,23,42,0.32)]">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="h-auto w-full object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 960px"
        />
      </div>
      {caption && (
        <figcaption className="mx-auto mt-3 max-w-[38rem] text-center text-[0.84rem] leading-[1.55] text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
