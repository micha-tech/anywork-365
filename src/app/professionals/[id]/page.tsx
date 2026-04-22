'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { MOCK_PROFESSIONALS } from '@/lib/mockData'
import { Avatar, Badge, Stars } from '@/components/ui'
import { Modal } from '@/components/ui/Modal'
import { getInitials } from '@/lib/utils'

const MOCK_REVIEWS = [
  { name: 'Mr Chukwu', rating: 5, text: 'Excellent work, very professional and punctual. Would hire again.', date: '2 weeks ago' },
  { name: 'Mrs Bello',  rating: 5, text: 'Did a fantastic job. Clean work and finished on time.',            date: '1 month ago' },
  { name: 'Alhaji K.',  rating: 4, text: 'Good work overall. Communicated well throughout the project.',     date: '2 months ago' },
]

export default function ProDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = use(params)
  const router = useRouter()
  const pro     = MOCK_PROFESSIONALS.find((p) => p.id === id)
  const [bookOpen, setBookOpen] = useState(false)
  const [booked,   setBooked]   = useState(false)
  const [startingChat, setStartingChat] = useState(false)

  if (!pro) notFound()

  const initials    = getInitials(pro.firstName, pro.lastName)
  const colorIndex  = MOCK_PROFESSIONALS.indexOf(pro)

  function handleBook(e: React.FormEvent) {
    e.preventDefault()
    setBookOpen(false)
    setBooked(true)
  }

  async function handleStartChat() {
    if (!pro) return
    setStartingChat(true)
    try {
      const res = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: pro.id }),
      })
      const data = await res.json()
      if (data.success) {
        router.push(`/messages?id=${data.data.conversation.id}`)
      } else {
        alert(data.error || 'Failed to start chat')
      }
    } catch {
      alert('Failed to start chat. Please try again.')
    } finally {
      setStartingChat(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <Link href="/professionals" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-primary mb-5">
        ← Back to Vendors
      </Link>

      {booked && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm">
          ✅ Booking request sent! {pro.firstName} will respond shortly.
        </div>
      )}

      {/* Mobile: sticky action bar */}
      <div className="sm:hidden bg-white border border-ui-border rounded-2xl p-4 mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar initials={initials} size="md" colorIndex={colorIndex} />
            {pro.isVerified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{pro.firstName} {pro.lastName}</p>
            {pro.rating && <Stars rating={pro.rating} />}
          </div>
        </div>
        <button
          onClick={() => setBookOpen(true)}
          disabled={booked}
          className="btn-primary px-5 py-2.5 flex-shrink-0"
        >
          {booked ? 'Requested ✓' : 'Book Now'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main */}
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-5">
          {/* Header card */}
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <Avatar initials={initials} size="lg" colorIndex={colorIndex} className="mb-4" />
                {pro.isVerified && (
                  <div className="absolute -bottom-2 left-8 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-lg sm:text-xl font-semibold">
                    {pro.firstName} {pro.lastName}
                  </h1>
                  {pro.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary mt-0.5">{pro.skills?.[0]} · {pro.city}</p>
                {pro.rating && (
                  <div className="mt-2">
                    <Stars rating={pro.rating} count={pro.reviewCount} />
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {pro.skills?.map((skill) => (
                    <Badge key={skill} variant="green">{skill}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {pro.bio && (
              <div className="mt-4 pt-4 border-t border-ui-border">
                <h2 className="font-medium text-sm mb-2">About</h2>
                <p className="text-sm text-text-secondary leading-relaxed">{pro.bio}</p>
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="card">
            <h2 className="font-medium text-base mb-4">
              Reviews{' '}
              <span className="text-text-secondary font-normal text-sm">({pro.reviewCount})</span>
            </h2>
            <div className="divide-y divide-ui-border">
              {MOCK_REVIEWS.map((r, i) => (
                <div key={i} className="py-4">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
                        {r.name[0]}
                      </div>
                      <span className="text-sm font-medium">{r.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stars rating={r.rating} />
                      <span className="text-xs text-text-secondary">{r.date}</span>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar — desktop only */}
        <div className="hidden sm:flex flex-col gap-5">
          <div className="card">
            <p className="text-xs text-text-secondary font-medium uppercase tracking-wide mb-4">
              Hire {pro.firstName}
            </p>
            <div className="space-y-2 text-sm mb-5">
              {[
                { label: 'Location',     value: pro.city },
                { label: 'Rating',       value: `${pro.rating?.toFixed(1)} / 5.0` },
                { label: 'Reviews',      value: String(pro.reviewCount) },
                { label: 'Availability', value: 'Available now' },
              ].map((r) => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-text-secondary">{r.label}</span>
                  <span className={`font-medium ${r.label === 'Availability' ? 'text-brand-primary' : ''}`}>
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setBookOpen(true)}
              disabled={booked}
              className="btn-primary w-full py-3 justify-center"
            >
              {booked ? 'Requested ✓' : `Book ${pro.firstName}`}
            </button>
            <button
              onClick={handleStartChat}
              disabled={startingChat}
              className="btn-ghost w-full py-2.5 justify-center mt-2 flex items-center gap-2"
            >
              {startingChat ? (
                <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Send Message
                </>
              )}
            </button>
          </div>

          {pro.isVerified && (
            <div className="card-sm bg-brand-light border-brand-primary/20">
              <p className="text-sm font-medium text-brand-active mb-1">✓ Verified Vendor</p>
              <p className="text-xs text-brand-active/70">Identity and credentials verified by Anywork365</p>
            </div>
          )}
        </div>
      </div>

      {/* Book Modal */}
      <Modal open={bookOpen} onClose={() => setBookOpen(false)} title={`Book ${pro.firstName} ${pro.lastName}`}>
        <form onSubmit={handleBook}>
          <div className="form-group">
            <label className="label">Describe your job *</label>
            <textarea
              className="input-field resize-y"
              rows={4}
              required
              placeholder="What do you need done? Include location, materials, and any specific requirements..."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-group">
              <label className="label">Your Budget (₦)</label>
              <input type="number" inputMode="numeric" className="input-field" min={1000} placeholder="50000" />
            </div>
            <div className="form-group">
              <label className="label">Preferred Date</label>
              <input type="date" className="input-field" min={new Date().toISOString().split('T')[0]} />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Your Location</label>
            <input type="text" className="input-field" placeholder="e.g. Lekki Phase 1, Lagos" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
            <button type="button" onClick={() => setBookOpen(false)} className="btn-ghost w-full sm:w-auto px-6 justify-center">Cancel</button>
            <button type="submit" className="btn-primary w-full sm:w-auto px-8 justify-center">Send Request</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}