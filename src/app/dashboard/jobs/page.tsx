import Link from 'next/link'
import { MOCK_JOBS } from '@/lib/mockData'
import { JobCard } from '@/components/forms/JobCard'

export default function MyJobsPage() {
  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-5 sm:mb-7">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-semibold">My Jobs</h1>
          <p className="text-sm text-text-secondary mt-1">Track and manage your posted jobs</p>
        </div>
        <Link href="/dashboard/post-job" className="btn-primary text-sm flex-shrink-0">+ Post Job</Link>
      </div>

      {/* Tabs — horizontally scrollable on mobile */}
      <div className="flex gap-0 border-b border-ui-border mb-5 overflow-x-auto scrollbar-none">
        {['Active (3)', 'Pending (1)', 'Completed (20)'].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 sm:px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap flex-shrink-0 ${
              i === 0
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        {MOCK_JOBS.map((job) => (
          <JobCard key={job.id} job={job} showApply={false} />
        ))}
      </div>
    </>
  )
}
