import Link from 'next/link'
import { Badge } from '@/components/ui'
import { formatCurrency, timeAgo } from '@/lib/utils'
import type { Job } from '@/types'

interface JobCardProps {
  job: Job
  showApply?: boolean
}

export function JobCard({ job, showApply = true }: JobCardProps) {
  return (
    <div className="card hover:border-brand-primary transition-colors">
      {/* Title row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <Link href={`/jobs/${job.id}`} className="flex-1 min-w-0">
          <h3 className="font-medium text-text-primary hover:text-brand-primary transition-colors text-sm sm:text-base leading-snug">
            {job.title}
          </h3>
        </Link>
        {/* Budget — always visible top-right */}
        <div className="text-right flex-shrink-0">
          <p className="text-base sm:text-lg font-semibold text-brand-primary leading-tight">
            {formatCurrency(job.budget)}
          </p>
          <p className="text-xs text-text-secondary mt-0.5">{job.city}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-3">
        {job.description}
      </p>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-ui-border">
        <Badge variant="gray">{job.category}</Badge>
        <Badge variant="green">Open</Badge>
        {job.timeline === 'urgent' && <Badge variant="red">Urgent</Badge>}
        <span className="text-xs text-text-secondary">
          {job.applicationCount} applicants
        </span>
        <span className="text-xs text-text-secondary ml-auto">
          {timeAgo(job.createdAt)}
        </span>
      </div>

      {/* Poster + apply */}
      {showApply && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-ui-border gap-3">
          <span className="text-xs text-text-secondary truncate">
            Posted by {job.posterName}
          </span>
          <Link
            href={`/jobs/${job.id}`}
            className="btn-primary text-xs px-4 py-2 min-h-[36px] flex-shrink-0"
          >
            Apply
          </Link>
        </div>
      )}
    </div>
  )
}
