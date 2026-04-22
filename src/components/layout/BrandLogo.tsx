'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type BrandLogoProps = {
  className?: string
  href?: string
  imageClassName?: string
  priority?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_STYLES = {
  sm: {
    wrapper: 'h-10 max-w-[140px] sm:max-w-[160px]',
    image: 'h-full w-auto max-w-full',
  },
  md: {
    wrapper: 'h-11 max-w-[160px] sm:h-12 sm:max-w-[220px]',
    image: 'h-full w-auto max-w-full',
  },
  lg: {
    wrapper: 'h-14 max-w-[220px] sm:h-16 sm:max-w-[280px]',
    image: 'h-full w-auto max-w-full',
  },
} as const

export function BrandLogo({
  className,
  href = '/',
  imageClassName,
  priority = false,
  size = 'md',
}: BrandLogoProps) {
  const styles = SIZE_STYLES[size]

  const content = (
    <span className={cn('inline-flex min-w-0 items-center', styles.wrapper, className)}>
      <Image
        src="/anyworks-logo.png"
        alt="Anywork365.ng"
        width={640}
        height={128}
        priority={priority}
        sizes="(max-width: 640px) 140px, (max-width: 1024px) 220px, 280px"
        className={cn('block', styles.image, imageClassName)}
      />
    </span>
  )

  if (!href) return content

  return (
    <Link href={href} className="inline-flex min-w-0 items-center">
      {content}
    </Link>
  )
}
