import Link from 'next/link'
import { listVacancies } from '@/lib/queries'
import { JobCard } from '@/components/forms/JobCard'
import type { Job } from '@/types'

export const dynamic = 'force-dynamic'

function vacancyToJob(v: Awaited<ReturnType<typeof listVacancies>>[number]): Job {
  return {
    id: String(v.vacancy_id),
    title: v.vacancy_title,
    description: v.job_description,
    category: 'Professional services' as Job['category'],
    budget: 0,
    city: v.vacancy_location,
    status: v.closed ? ('completed' as Job['status']) : ('open' as Job['status']),
    timeline: 'flexible',
    posterId: '',
    posterName: '',
    businessName: '',
    businessAddress: '',
    jobType: v.work_type === 'Remote' ? 'contract' : 'full-time',
    closingDate: v.closing_date || '',
    applicationCount: 0,
    createdAt: v.date_created,
  }
}

export default async function MyJobsPage() {
  const vacancies = await listVacancies()
  const jobs = vacancies.map(vacancyToJob)

  const activeJobs = jobs.filter((j) => j.status === 'open')
  const pendingJobs: Job[] = []
  const completedJobs = jobs.filter((j) => j.status === 'completed')

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-5 sm:mb-7">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-semibold">My Jobs</h1>
          <p className="text-sm text-text-secondary mt-1">Track and manage your posted jobs</p>
        </div>
        <Link href="/dashboard/post-job" className="btn-primary text-sm flex-shrink-0">+ Post Job</Link>
      </div>

      <div className="flex gap-0 border-b border-ui-border mb-5 overflow-x-auto scrollbar-none">
        {[
          `Active (${activeJobs.length})`,
          `Pending (${pendingJobs.length})`,
          `Completed (${completedJobs.length})`,
        ].map((tab, i) => (
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
        {jobs.length === 0 ? (
          <p className="text-sm text-text-secondary py-8 text-center">No jobs posted yet</p>
        ) : jobs.map((job) => (
          <JobCard key={job.id} job={job} showApply={false} />
        ))}
      </div>
    </>
  )
}