'use client'

import Link from 'next/link'
import { MOCK_JOBS } from '@/lib/mockData'
import { Badge } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import { useCurrentUser } from '@/hooks/useCurrentUser'

const METRICS = [
  { label: 'Active Jobs',    value: '3',  change: '↑ 1 new this week' },
  { label: 'Applications',   value: '12', change: '↑ 4 new today' },
  { label: 'Hired Pros',     value: '7',  change: '↑ 2 this month' },
  { label: 'Jobs Completed', value: '24', change: 'All time' },
]

const RECENT_ACTIVITY = [
  { initials: 'AO', color: 'bg-brand-primary', text: 'Adaeze Okeke applied to Electrical Wiring', sub: '⭐ 4.9 · Lagos', time: '2h ago' },
  { initials: 'KM', color: 'bg-blue-600',      text: 'Kola Musa completed Plumbing Repair',       sub: 'Ready for review', time: '5h ago' },
  { initials: 'TJ', color: 'bg-amber-500',     text: 'Tunde James applied to AC Installation',    sub: '⭐ 4.7 · Abuja',  time: '1d ago' },
]

export default function DashboardPage() {
  const { user, loading } = useCurrentUser()

  const greeting = loading
    ? 'Good morning 👋'
    : `Good morning, ${user?.firstName ?? 'there'} 👋`

  return (
    <>
      <div className="mb-5 sm:mb-7">
        <h1 className="font-display text-xl sm:text-2xl font-semibold">{greeting}</h1>
        <p className="text-sm text-text-secondary mt-1">Here&apos;s what&apos;s happening with your projects</p>
      </div>

      {/* Metrics — 2 cols on all sizes */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-7">
        {METRICS.map((m) => (
          <div key={m.label} className="bg-white border border-ui-border rounded-xl p-4 sm:p-5">
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wide leading-tight">{m.label}</p>
            <p className="font-display text-2xl sm:text-3xl font-semibold text-text-primary my-1">{m.value}</p>
            <p className="text-xs text-brand-primary">{m.change}</p>
          </div>
        ))}
      </div>

      {/* Activity + Active Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="card">
          <h2 className="font-medium text-base mb-4">Recent Activity</h2>
          <div className="divide-y divide-ui-border">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${a.color}`}>
                  {a.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary leading-snug">{a.text}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{a.sub}</p>
                </div>
                <p className="text-xs text-text-secondary whitespace-nowrap">{a.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-base">Active Jobs</h2>
            <Link href="/dashboard/jobs" className="text-xs text-brand-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-ui-border">
            {MOCK_JOBS.slice(0, 3).map((job) => (
              <div key={job.id} className="py-3">
                <p className="text-sm font-medium text-text-primary leading-snug">{job.title}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <Badge variant="green">Open</Badge>
                  <span className="text-xs text-text-secondary">{job.city}</span>
                  <span className="text-xs font-semibold text-brand-primary ml-auto">
                    {formatCurrency(job.budget)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { href: '/dashboard/post-job', emoji: '📋', label: 'Post a Job',    sub: 'Attract vendors' },
          { href: '/professionals',      emoji: '🔍', label: 'Find Vendors',  sub: 'Browse vendors nearby' },
          { href: '/dashboard/profile',  emoji: '✏️', label: 'Edit Profile',  sub: 'Update your info' },
        ].map((a) => (
          <Link key={a.href} href={a.href} className="card hover:border-brand-primary transition-colors text-center py-5 sm:py-8">
            <div className="text-xl sm:text-2xl mb-2">{a.emoji}</div>
            <p className="font-medium text-xs sm:text-sm">{a.label}</p>
            <p className="text-xs text-text-secondary mt-1 hidden sm:block">{a.sub}</p>
          </Link>
        ))}
      </div>
    </>
  )
}
