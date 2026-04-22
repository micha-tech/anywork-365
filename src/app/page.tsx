'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { JOB_CATEGORIES, NIGERIAN_CITIES } from '@/types'
import { MOCK_JOBS, MOCK_PROFESSIONALS } from '@/lib/mockData'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { CategoryIcon, CATEGORY_ICONS } from '@/components/ui/CategoryIcon'
import { getInitials } from '@/lib/utils'

const TRUST_POINTS = [
  'Find trusted, skilled hands for everyday and specialist jobs.',
  'Designed to feel fast and simple on mobile.',
  'Start in minutes whether you want to hire or get hired.',
]

export default function HomePage() {
  const { user, loading } = useCurrentUser()
  
  const displayCategories = JOB_CATEGORIES.slice(0, 12)
  const featuredVendors = MOCK_PROFESSIONALS.slice(0, 8)
  const latestJobs = MOCK_JOBS.slice(0, 6)

  const [favorites, setFavorites] = useState<string[]>([])

  function toggleFavorite(e: React.MouseEvent, vendorId: string) {
    e.preventDefault()
    setFavorites(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    )
  }

  function StarRating({ rating }: { rating: number }) {
    return (
      <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map((star) => (
          <svg 
            key={star}
            className={`w-3.5 h-3.5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.798 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.798-2.034a1 1 0 00-1.175 0l-2.798 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-[#eef4f2]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,79,74,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,214,102,0.22),transparent_26%),linear-gradient(180deg,#f8fbfa_0%,#eef4f2_52%,#e5efed_100%)]" />

        <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8 lg:py-16">
          <div className="max-w-xl">
            <div className="inline-flex rounded-full border border-[#bfd1cd] bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
              Hire or get hired
            </div>

            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-text-primary sm:text-5xl lg:text-6xl">
              Welcome to Anywork365.
            </h1>

            <p className="mt-4 text-lg leading-8 text-text-secondary">
              Find trusted, skilled hands for any job. Clean, fast, and easy to use from your phone.
            </p>

            <form action="/professionals" method="GET" className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                name="search"
                placeholder="What service do you need?"
                className="flex-1 min-h-[52px] rounded-2xl border border-brand-primary bg-white px-5 py-3 text-base text-text-primary placeholder-text-secondary focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
              <select
                name="city"
                className="min-h-[52px] rounded-2xl border border-brand-primary bg-white px-4 py-3 text-base text-text-primary focus:border-brand-primary focus:outline-none"
              >
                <option value="">All cities</option>
                {NIGERIAN_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                type="submit"
                className="min-h-[52px] rounded-2xl bg-brand-primary px-6 text-base font-semibold text-white transition-colors hover:bg-brand-hover"
              >
                Search
              </button>
            </form>

            {!loading && !user && (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-brand-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
                >
                  Sign up
                </Link>
                <Link
                  href="/login"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-brand-primary bg-white px-6 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-light"
                >
                  Sign in
                </Link>
              </div>
            )}

            <ul className="mt-6 space-y-3">
              {TRUST_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-6 text-text-secondary">
                  <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-[#ffd666]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[480px]">
              <div className="absolute inset-x-10 bottom-4 top-8 rounded-[44px] bg-[radial-gradient(circle,rgba(15,79,74,0.14),transparent_68%)] blur-3xl" />
              <Image
                src="/phone-hand.webp"
                alt="Anywork365 mobile homepage shown on a phone in hand"
                width={760}
                height={980}
                priority
                className="relative z-10 h-auto w-full object-contain drop-shadow-[0_28px_45px_rgba(7,33,31,0.22)]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#d5e1de] bg-white/80 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-primary">
                Services
              </p>
              <h2 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-text-primary">
                Browse by category
              </h2>
            </div>
            <Link href="/professionals" className="text-sm font-medium text-brand-primary hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {displayCategories.map((service) => (
              <Link
                key={service}
                href={`/professionals?category=${encodeURIComponent(service)}`}
                className="flex flex-col items-center justify-center rounded-xl border border-[#cfe0dc] bg-[#f8faf9] p-4 text-center transition-all hover:border-brand-primary hover:shadow-md hover:-translate-y-0.5"
              >
                <CategoryIcon category={service} size={48} />
                <span className="text-xs font-medium text-text-primary line-clamp-2 mt-2">{service}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#d5e1de] bg-white/80 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-primary">
                Career
              </p>
              <h2 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-text-primary">
                Browse Jobs
              </h2>
            </div>
            <Link href="/jobs" className="text-sm font-medium text-brand-primary hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="card hover:border-brand-primary transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-medium text-brand-primary">
                    {job.category}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    job.jobType === 'full-time' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {job.jobType === 'full-time' ? 'Full-time' : 'Contract'}
                  </span>
                </div>
                <h3 className="font-medium text-text-primary line-clamp-1 mb-1">{job.title}</h3>
                <p className="text-sm text-text-secondary line-clamp-1 mb-2">{job.businessName}</p>
                <div className="flex items-center gap-1 text-xs text-text-secondary mb-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="line-clamp-1">{job.businessAddress}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-ui-border">
                  <span className="text-xs text-text-secondary">
                    Closes: {new Date(job.closingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-xs text-text-secondary">{job.applicationCount} applicants</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#d5e1de] bg-white/80 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-primary">
                Top Vendors
              </p>
              <h2 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-text-primary">
                Find Vendors
              </h2>
            </div>
            <Link href="/professionals" className="text-sm font-medium text-brand-primary hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredVendors.map((vendor, i) => (
              <Link
                key={vendor.id}
                href={`/professionals/${vendor.id}`}
                className="card hover:border-brand-primary transition-all hover:-translate-y-0.5 text-center"
              >
                <div className="relative inline-block mb-2">
                  <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center text-lg font-semibold text-white ${
                    ['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500', 'bg-cyan-500'][i % 6]
                  }`}>
                    {vendor.firstName[0]}{vendor.lastName[0]}
                  </div>
                  {vendor.isVerified && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-text-primary text-sm line-clamp-1 mb-1 flex items-center justify-center gap-1">
                  {vendor.firstName} {vendor.lastName}
                  {vendor.isVerified && (
                    <svg className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  )}
                </h3>
                <p className="text-xs text-text-secondary line-clamp-1 mb-2">{vendor.city}</p>
                {vendor.rating && (
                  <div className="flex items-center justify-center gap-1 text-xs">
                    <span className="text-amber-500">★</span>
                    <span className="font-medium text-text-primary">{vendor.rating}</span>
                    <span className="text-text-secondary">({vendor.reviewCount})</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#d5e1de] bg-white/80 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-primary">
                Featured
              </p>
              <h2 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-text-primary">
                Top Rated Vendors
              </h2>
            </div>
            <Link href="/professionals" className="text-sm font-medium text-brand-primary hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredVendors.map((vendor, idx) => (
              <Link
                key={vendor.id}
                href={`/professionals/${vendor.id}`}
                className="card hover:border-brand-primary transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-brand-primary flex items-center justify-center text-white font-semibold text-lg">
                      {getInitials(vendor.firstName, vendor.lastName)}
                    </div>
                    {vendor.isVerified && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-text-primary truncate">{vendor.firstName} {vendor.lastName}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-text-secondary">{vendor.city}</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => toggleFavorite(e, vendor.id)}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <svg 
                      className={`w-5 h-5 ${favorites.includes(vendor.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-brand-light px-2 py-0.5 text-xs font-medium text-brand-primary">
                    {vendor.skills?.[0]}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <StarRating rating={Math.round(vendor.rating || 4)} />
                  <button 
                    onClick={(e) => { e.preventDefault() }}
                    className="text-sm text-brand-primary hover:underline"
                  >
                    {vendor.reviewCount} reviews
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}