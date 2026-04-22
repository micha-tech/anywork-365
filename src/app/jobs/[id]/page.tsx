'use client'

import { use, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MOCK_JOBS } from '@/lib/mockData'
import { Badge } from '@/components/ui'
import { Modal } from '@/components/ui/Modal'
import { formatCurrency, timeAgo } from '@/lib/utils'

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const job = MOCK_JOBS.find((j) => j.id === id)
  const [applyOpen, setApplyOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!job) notFound()

  function handleApply(e: React.FormEvent) {
    e.preventDefault()
    setApplyOpen(false)
    setSubmitted(true)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-primary mb-5">
        ← Back to Jobs
      </Link>

      {submitted && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm">
          ✅ Application submitted! The client will review and get back to you.
        </div>
      )}

      {/* Mobile: budget sticky bar */}
      <div className="sm:hidden bg-white border border-ui-border rounded-2xl p-4 mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-text-secondary">Budget</p>
          <p className="text-xl font-semibold text-brand-primary">{formatCurrency(job.budget)}</p>
        </div>
        <button
          onClick={() => setApplyOpen(true)}
          disabled={submitted}
          className="btn-primary px-6 py-2.5 flex-shrink-0"
        >
          {submitted ? 'Applied ✓' : 'Apply Now'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-5">
          <div className="card">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h1 className="font-display text-lg sm:text-xl font-semibold text-text-primary leading-snug">
                {job.title}
              </h1>
              <Badge variant={job.status === 'open' ? 'green' : 'gray'} className="flex-shrink-0 capitalize">
                {job.status}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="gray">{job.category}</Badge>
              {job.timeline === 'urgent' && <Badge variant="red">Urgent</Badge>}
              <span className="text-xs text-text-secondary flex items-center">{timeAgo(job.createdAt)}</span>
            </div>

            <h2 className="font-medium text-sm mb-2">Job Description</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{job.description}</p>
          </div>

          <div className="card">
            <h2 className="font-medium text-sm mb-3">What we&apos;re looking for</h2>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              {[
                'Verified and licensed professional',
                `Minimum 2 years experience in ${job.category}`,
                `Available in ${job.city}`,
                job.timeline === 'urgent' ? 'Can start within 48 hours' : 'Reliable and communicative',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-brand-primary mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar — desktop only */}
        <div className="hidden sm:flex flex-col gap-5">
          <div className="card">
            <p className="text-xs text-text-secondary font-medium uppercase tracking-wide mb-1">Budget</p>
            <p className="font-display text-2xl font-semibold text-brand-primary mb-4">
              {formatCurrency(job.budget)}
            </p>
            <div className="space-y-2 text-sm mb-5">
              {[
                { label: 'Location',    value: job.city },
                { label: 'Timeline',   value: job.timeline.replace('_', ' ') },
                { label: 'Applicants', value: String(job.applicationCount) },
                { label: 'Posted by',  value: job.posterName },
              ].map((r) => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-text-secondary">{r.label}</span>
                  <span className="font-medium capitalize">{r.value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setApplyOpen(true)}
              disabled={submitted}
              className="btn-primary w-full py-3 justify-center"
            >
              {submitted ? 'Applied ✓' : 'Apply for this job'}
            </button>
            <button className="btn-ghost w-full py-2.5 justify-center mt-2">Save job</button>
          </div>

          <div className="card">
            <h3 className="font-medium text-sm mb-3">About the Client</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {job.posterName[0]}
              </div>
              <div>
                <p className="text-sm font-medium">{job.posterName}</p>
                <p className="text-xs text-text-secondary">{job.city}</p>
              </div>
            </div>
            <div className="text-xs text-text-secondary space-y-1.5">
              <p>⭐ Verified client</p>
              <p>📋 12 jobs posted</p>
              <p>✅ 10 jobs completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal open={applyOpen} onClose={() => setApplyOpen(false)} title="Apply for this job">
        <form onSubmit={handleApply}>
          <div className="form-group">
            <label className="label">Cover Letter *</label>
            <textarea
              className="input-field resize-y"
              rows={5}
              required
              placeholder="Introduce yourself and explain why you&apos;re the right fit. Mention relevant experience..."
            />
          </div>
          <div className="form-group">
            <label className="label">Your Proposed Rate (₦) *</label>
            <input
              type="number"
              inputMode="numeric"
              className="input-field"
              required
              min={1000}
              placeholder={String(Math.round(job.budget * 0.9))}
            />
            <p className="text-xs text-text-secondary mt-1.5">Client budget: {formatCurrency(job.budget)}</p>
          </div>
          <div className="form-group">
            <label className="label">Availability</label>
            <select className="input-field appearance-none">
              <option value="immediately">Available immediately</option>
              <option value="within_3_days">Within 3 days</option>
              <option value="within_a_week">Within a week</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
            <button type="button" onClick={() => setApplyOpen(false)} className="btn-ghost w-full sm:w-auto px-6 justify-center">Cancel</button>
            <button type="submit" className="btn-primary w-full sm:w-auto px-8 justify-center">Submit Application</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
