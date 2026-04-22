import Link from 'next/link'
import { MOCK_JOBS } from '@/lib/mockData'
import { JobCard } from '@/components/forms/JobCard'
import { EmptyState } from '@/components/ui'
import { JOB_CATEGORIES, NIGERIAN_CITIES } from '@/types'

interface Props {
  searchParams?: Promise<{ search?: string; category?: string; city?: string }>
}

export default async function JobsPage({ searchParams }: Props) {
  const { search, category, city } = (await searchParams) ?? {}

  const filtered = MOCK_JOBS.filter((j) => {
    const matchSearch = !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.description.toLowerCase().includes(search.toLowerCase())
    const matchCat  = !category || j.category === category
    const matchCity = !city || j.city === city
    return matchSearch && matchCat && matchCity
  })

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-ui-border px-4 sm:px-6 py-5 sm:py-7">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-semibold mb-1">Browse Jobs</h1>
            <p className="text-sm text-text-secondary">Open opportunities across Nigeria</p>
          </div>
          <Link href="/dashboard/post-job" className="btn-primary text-sm flex-shrink-0">
            + Post Job
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Search + filters — stacks on mobile */}
        <form className="flex flex-col gap-2 sm:gap-3 mb-6" method="GET">
          <input
            name="search"
            defaultValue={search}
            className="input-field w-full"
          />
          <div className="flex gap-2">
            <select name="category" defaultValue={category} className="input-field flex-1 appearance-none">
              <option value="">All Categories</option>
              {JOB_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select name="city" defaultValue={city} className="input-field flex-1 appearance-none">
              <option value="">All Cities</option>
              {NIGERIAN_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button type="submit" className="btn-primary px-5 flex-shrink-0">Go</button>
          </div>
        </form>

        {/* Results */}
        {filtered.length > 0 ? (
          <>
            <p className="text-sm text-text-secondary mb-4">{filtered.length} jobs found</p>
            <div className="flex flex-col gap-3 sm:gap-4">
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon="💼"
            title="No jobs found"
            description="Try different search terms or browse all jobs"
            action={<Link href="/jobs" className="btn-outline px-6">Clear filters</Link>}
          />
        )}
      </div>
    </div>
  )
}
