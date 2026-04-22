'use client'

import Image from 'next/image'

const ICONS: Record<string, string> = {
  'General services': '/icons/General Services.svg',
  'Healthcare services': '/icons/Healthcare Services.svg',
  'Lifestyle and entertainment': '/icons/lifestyle & Entertainment.svg',
  'Professional services': '/icons/Professional Services.svg',
  'Repair services': '/icons/Repair Services.svg',
  'Restaurant and lounges': '/icons/Restaurants & Lounges.svg',
  'Software development': '/icons/Software Development.svg',
  'Spa and beauty parlour': '/icons/Spa & Beauty Parlour.svg',
  'Tradesmen and retailers': '/icons/tradesmen & Retailer.svg',
  'Cleaning services': '/icons/Cleaning Services.svg',
  'Computer operation': '/icons/computer operations.svg',
  'Environmental services': '/icons/Environmental Services.svg',
  'Fashion services': '/icons/Fashion Services.svg',
}

interface CategoryIconProps {
  category: string
  size?: number
}

export function CategoryIcon({ category, size = 48 }: CategoryIconProps) {
  const iconSrc = ICONS[category]
  
  if (!iconSrc) {
    return (
      <div 
        className="rounded-xl bg-brand-light flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-brand-primary font-bold" style={{ fontSize: size * 0.4 }}>
          {category.charAt(0)}
        </span>
      </div>
    )
  }

  return (
    <div 
      className="rounded-xl overflow-hidden flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Image 
        src={iconSrc} 
        alt={category}
        width={size}
        height={size}
        className="w-full h-full object-cover"
        unoptimized
      />
    </div>
  )
}

export const CATEGORY_ICONS = ICONS