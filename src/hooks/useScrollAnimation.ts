'use client'

import { useEffect, useRef, useState } from 'react'

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px', once = true } = options
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.unobserve(element)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, isVisible }
}

export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const scrolled = window.scrollY
      const elementTop = rect.top + scrolled
      const relativeScroll = scrolled - elementTop + window.innerHeight
      setOffset(relativeScroll * speed * 0.1)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return { ref, offset }
}

export function useStaggeredAnimation(itemCount: number, options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px', once = true } = options
  const ref = useRef<HTMLElement>(null)
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(itemCount).fill(false))

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const children = element.querySelectorAll('[data-animate-item]')
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-animate-item') || '0', 10)
            setVisibleItems(prev => {
              const newState = [...prev]
              newState[index] = true
              return newState
            })
            if (once) {
              observer.unobserve(entry.target)
            }
          } else if (!once) {
            const index = parseInt(entry.target.getAttribute('data-animate-item') || '0', 10)
            setVisibleItems(prev => {
              const newState = [...prev]
              newState[index] = false
              return newState
            })
          }
        })
      },
      { threshold, rootMargin }
    )

    children.forEach(child => observer.observe(child))
    return () => observer.disconnect()
  }, [threshold, rootMargin, once, itemCount])

  return { ref, visibleItems }
}