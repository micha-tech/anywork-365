'use client'

import Image from 'next/image'
import Link from 'next/link'
import { JOB_CATEGORIES, NIGERIAN_CITIES } from '@/types'
import { MOCK_JOBS, MOCK_PROFESSIONALS } from '@/lib/mockData'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { CategoryIcon, CATEGORY_ICONS } from '@/components/ui/CategoryIcon'

const TRUST_POINTS = [
  'Find trusted, skilled hands for everyday and specialist jobs.',
  'Designed to feel fast and simple on mobile.',
  'Start in minutes whether you want to hire or get hired.',
]

export default function HomePage() {
  const { user, loading } = useCurrentUser()
  
  const displayCategories = JOB_CATEGORIES.slice(0, 12)
  const latestJobs = MOCK_JOBS.slice(0, 6)
  const latestVendors = MOCK_PROFESSIONALS.slice(0, 6)

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

            <form action="/jobs" method="GET" className="mt-6 flex flex-col gap-3 sm:flex-row">
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
            <Link href="/jobs" className="text-sm font-medium text-brand-primary hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {displayCategories.map((service) => (
              <Link
                key={service}
                href={`/jobs?category=${encodeURIComponent(service)}`}
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
                Latest Jobs
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
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    {job.category}
                  </span>
                  <span className="text-xs text-text-secondary">{job.city}</span>
                </div>
                <h3 className="font-medium text-text-primary line-clamp-1 mb-1">{job.title}</h3>
                <p className="text-sm text-text-secondary line-clamp-2 mb-3">{job.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-ui-border">
                  <span className="text-sm font-semibold text-brand-primary">₦{job.budget.toLocaleString()}</span>
                  <span className="text-xs text-text-secondary">{job.applicationCount} applied</span>
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
            {latestVendors.map((vendor, i) => (
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
    </div>
  )
}