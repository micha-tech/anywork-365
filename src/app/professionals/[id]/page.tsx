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
  { 
    name: 'Mr Chukwu', 
    overallRating: 5, 
    ratings: { quality: 5, punctuality: 5, communication: 5, value: 4 },
    text: 'Excellent work, very professional and punctual. Would hire again.', 
    date: '2 weeks ago' 
  },
  { 
    name: 'Mrs Bello',  
    overallRating: 5, 
    ratings: { quality: 5, punctuality: 4, communication: 5, value: 5 },
    text: 'Did a fantastic job. Clean work and finished on time.',            
    date: '1 month ago' 
  },
  { 
    name: 'Alhaji K.',  
    overallRating: 4, 
    ratings: { quality: 4, punctuality: 4, communication: 4, value: 4 },
    text: 'Good work overall. Communicated well throughout the project.',     
    date: '2 months ago' 
  },
]

export default function ProDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = use(params)
  const router = useRouter()
  const pro     = MOCK_PROFESSIONALS.find((p) => p.id === id)
  const [bookOpen, setBookOpen] = useState(false)
  const [booked,   setBooked]   = useState(false)
  const [startingChat, setStartingChat] = useState(false)
  const [calling, setCalling] = useState<'voice' | 'video' | null>(null)
  const [quickConnecting, setQuickConnecting] = useState(false)

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

function handleCall(type: 'voice' | 'video') {
    if (!pro?.phone) {
      alert('This vendor has not shared their phone number')
      return
    }
    setCalling(type)
    const phone = pro.phone
    const countryCode = pro.countryCode
    
    setTimeout(() => {
      try {
        const phoneNumber = formatPhoneForWhatsApp(phone, countryCode)
        let url: string
        
        if (type === 'video') {
          const message = encodeURIComponent(`Hi ${pro.firstName}, I'd like a video call`)
          url = `https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`
        } else {
          url = `tel:${phoneNumber}`
        }
        
        window.open(url, '_blank', 'noopener,noreferrer')
      } catch {
        alert('Failed to initiate call. Please try again.')
      } finally {
        setCalling(null)
      }
    }, 300)
  }

  function formatPhoneForWhatsApp(phone: string, countryCode?: string): string {
    let cleaned = phone.replace(/\D/g, '')
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1)
    }
    if (!countryCode) {
      countryCode = '+234'
    }
    if (!countryCode.startsWith('+')) {
      countryCode = '+' + countryCode.replace(/\D/g, '')
    }
    return countryCode + cleaned
  }

  function handleQuickConnect() {
    if (!pro?.phone) {
      alert('This vendor has not shared their phone number')
      return
    }
    setQuickConnecting(true)
    const phone = pro.phone
    const countryCode = pro.countryCode
    
    setTimeout(() => {
      try {
        const phoneNumber = formatPhoneForWhatsApp(phone, countryCode)
        const message = encodeURIComponent(`Hi ${pro.firstName}, I found your profile on Anywork365 and I'm interested in your services. Can we discuss?`)
        const url = `https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`
        
        const whatsappWebUrl = `https://web.whatsapp.com/send?phone=${phoneNumber.replace('+', '')}&text=${message}`
        
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        
        const targetUrl = isMobile ? url : whatsappWebUrl
        
        window.open(targetUrl, '_blank', 'noopener,noreferrer')
      } catch {
        alert('Failed to open WhatsApp. Please try again.')
      } finally {
        setQuickConnecting(false)
      }
    }, 500)
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
                {pro.verificationTier && (
                  <div className={`absolute -bottom-2 left-8 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white ${
                    pro.verificationTier === 'premium' ? 'bg-amber-500' : 
                    pro.verificationTier === 'verified' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}>
                    {pro.verificationTier === 'premium' ? (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-lg sm:text-xl font-semibold">
                    {pro.firstName} {pro.lastName}
                  </h1>
                  {pro.isFeatured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.798 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.798-2.034a1 1 0 00-1.175 0l-2.798 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Featured
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
                      <Stars rating={r.overallRating} />
                      <span className="text-xs text-text-secondary">{r.date}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-text-secondary mb-2">
                    <span className="flex items-center gap-1">
                      <span className="text-gray-400">Quality:</span>
                      <Stars rating={r.ratings.quality} />
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-gray-400">Time:</span>
                      <Stars rating={r.ratings.punctuality} />
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-gray-400">Comms:</span>
                      <Stars rating={r.ratings.communication} />
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-gray-400">Value:</span>
                      <Stars rating={r.ratings.value} />
                    </span>
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
                { label: 'Tier',        value: pro.verificationTier ? pro.verificationTier.charAt(0).toUpperCase() + pro.verificationTier.slice(1) : 'Basic' },
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

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => handleCall('voice')}
                disabled={calling !== null}
                className="btn-ghost py-2.5 justify-center flex items-center gap-2 text-sm disabled:opacity-50"
              >
                {calling === 'voice' ? (
                  <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
                  </svg>
                )}
                Call
              </button>
              <button
                onClick={() => handleCall('video')}
                disabled={calling !== null}
                className="btn-ghost py-2.5 justify-center flex items-center gap-2 text-sm disabled:opacity-50"
              >
                {calling === 'video' ? (
                  <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
                Video
              </button>
            </div>

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

            <button
              onClick={handleQuickConnect}
              disabled={quickConnecting}
              className="w-full py-2.5 justify-center mt-2 flex items-center gap-2 text-sm font-medium bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-70"
            >
              {quickConnecting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.837 2.795-7.26 8.072-7.26 4.236 0 7.531 3.021 7.531 7.061 0 4.206-2.647 7.575-6.326 7.575-1.351 0-2.612-.703-3.443-1.529-.138-.218-.16-.408-.116-.598l.115-.665c.069-.534.253-.946.549-1.277 1.618-1.811 3.305-3.373 4.596-4.178.391-.246.868-.377 1.318-.235.641.199 1.323.475 1.757.846.694.591 1.125 1.58 1.048 2.589-.105 1.375-1.106 2.462-2.043 2.462-.188 0-.361-.017-.535-.052.92 2.839 2.704 5.197 5.113 5.197 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Quick Connect (WhatsApp)
                </>
              )}
            </button>
          </div>

          {pro.verificationTier && pro.verificationTier !== 'basic' && (
            <div className={`card-sm ${pro.verificationTier === 'premium' ? 'bg-amber-50 border-amber-300' : 'bg-brand-light border-brand-primary/20'}`}>
              <p className={`text-sm font-medium ${pro.verificationTier === 'premium' ? 'text-amber-700' : 'text-brand-active'} mb-1`}>
                {pro.verificationTier === 'premium' ? '⭐ Premium Vendor' : '✓ Verified Vendor'}
              </p>
              <p className={`text-xs ${pro.verificationTier === 'premium' ? 'text-amber-600/70' : 'text-brand-active/70'}`}>
                {pro.verificationTier === 'premium' 
                  ? 'Top-rated, priority support, and featured listings' 
                  : 'Identity and credentials verified by Anywork365'}
              </p>
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