'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useCurrentUser, getInitialsFromUser } from '@/hooks/useCurrentUser'
import { BrandLogo } from '@/components/layout/BrandLogo'
import { usePushNotifications } from '@/hooks/usePushNotifications'

const PUBLIC_NAV = [
  { href: '/professionals', label: 'Find Vendors' },
  { href: '/jobs',          label: 'Browse Jobs' },
]

const AUTH_NAV = [
  { href: '/professionals', label: 'Find Vendors' },
  { href: '/jobs',          label: 'Browse Jobs' },
  { href: '/messages',      label: 'Messages' },
  { href: '/dashboard',     label: 'Dashboard' },
]

function NotificationBell({ unreadCount, onClick }: { unreadCount: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-xl hover:bg-brand-light transition-colors"
      aria-label="Notifications"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  )
}

export function Navbar() {
  const pathname             = usePathname()
  const router               = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { user, loading }    = useCurrentUser()
  const hideNavbar = pathname === '/login' || pathname === '/signup'

  const isLoggedIn = !loading && !!user
  const navLinks   = isLoggedIn ? AUTH_NAV : PUBLIC_NAV
  const initials   = getInitialsFromUser(user)

  const handleConversationOpen = useCallback((conversationId: string) => {
    router.push(`/messages?id=${conversationId}`)
  }, [router])

  usePushNotifications(handleConversationOpen)

  useEffect(() => {
    if (!user) return

    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications')
        if (!res.ok) {
          console.log('Notifications fetch not OK:', res.status)
          return
        }
        const text = await res.text()
        if (!text) return
        const data = JSON.parse(text)
        if (data.success) {
          setUnreadCount(data.data.unreadCount)
        }
      } catch (e) {
        console.error('Failed to fetch notifications:', e)
      }
    }

    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [user])

  useEffect(() => { setMenuOpen(false); setDropOpen(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  if (hideNavbar) return null

  async function handleLogout() {
    await fetch('/api/auth/me', { method: 'POST' })
    // use the logout endpoint
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-ui-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 h-16">

            {/* Logo */}
            <BrandLogo
              size="md"
              priority
              className="min-w-0 flex-1 md:flex-none"
              imageClassName="object-contain"
            />

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium px-3.5 py-2 rounded-xl transition-colors',
                    pathname.startsWith(link.href)
                      ? 'text-brand-primary bg-brand-light'
                      : 'text-text-secondary hover:text-brand-primary hover:bg-brand-light'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop right side */}
            <div className="hidden md:flex items-center gap-2">
              {isLoggedIn && (
                <NotificationBell
                  unreadCount={unreadCount}
                  onClick={() => router.push('/messages')}
                />
              )}
              {isLoggedIn ? (
                /* ── Logged in: avatar dropdown ────────────────────── */
                <div className="relative">
                  <button
                    onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-brand-light transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-brand-primary flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {user?.avatarUrl
                        ? <Image src={user.avatarUrl} alt={initials} width={32} height={32} className="w-full h-full object-cover" unoptimized={user.avatarUrl.startsWith('/uploads/')} />
                        : initials}
                    </div>
                    <span className="text-sm font-medium text-text-primary">{user?.firstName}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  {dropOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-ui-border rounded-2xl shadow-lg py-1.5 z-50">
                      <div className="px-4 py-2.5 border-b border-ui-border">
                        <p className="text-sm font-medium text-text-primary">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-text-secondary capitalize">{user?.role}</p>
                      </div>
                      {[
                        { href: '/dashboard',         label: 'Dashboard' },
                        { href: '/messages',           label: 'Messages' },
                        { href: '/dashboard/wallet',  label: 'Wallet' },
                        { href: '/dashboard/profile', label: 'My Profile' },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center px-4 py-2.5 text-sm text-text-secondary hover:bg-brand-light hover:text-brand-primary transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <div className="border-t border-ui-border mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Logged out: only on homepage ──────────────────── */
                pathname === '/' && (
                  <>
                    <Link href="/login"  className="btn-ghost  text-sm py-2">Log in</Link>
                    <Link href="/signup" className="btn-primary text-sm py-2">Sign up</Link>
                  </>
                )
              )}
            </div>

            {/* Mobile right side */}
            <div className="flex md:hidden flex-shrink-0 items-center gap-2">
              {isLoggedIn && (
                <NotificationBell
                  unreadCount={unreadCount}
                  onClick={() => router.push('/messages')}
                />
              )}
              {isLoggedIn ? (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-brand-primary flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {user?.avatarUrl
                    ? <Image src={user.avatarUrl} alt={initials} width={32} height={32} className="w-full h-full object-cover" unoptimized={user.avatarUrl.startsWith('/uploads/')} />
                    : initials}
                </div>
              ) : pathname === '/' ? (
                <Link href="/signup" className="btn-primary text-xs px-3 py-2 min-h-[36px]">
                  Sign up
                </Link>
              ) : null}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                className="w-10 h-10 flex items-center justify-center rounded-xl text-text-secondary hover:bg-brand-light hover:text-brand-primary transition-colors"
              >
                {menuOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="3" y1="6"  x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ top: '64px' }}>
          <div className="absolute inset-0 bg-black/30" onClick={() => setMenuOpen(false)} />
          <div className="relative bg-white border-b border-ui-border shadow-lg">
            <nav className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    pathname.startsWith(link.href)
                      ? 'bg-brand-light text-brand-primary'
                      : 'text-text-primary hover:bg-brand-light hover:text-brand-primary'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {isLoggedIn && (
                <>
                  <Link href="/dashboard/wallet" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-primary hover:bg-brand-light hover:text-brand-primary">
                    Wallet
                  </Link>
                  <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-primary hover:bg-brand-light hover:text-brand-primary">
                    My Profile
                  </Link>
                  <div className="border-t border-ui-border mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50"
                    >
                      Log out
                    </button>
                  </div>
                </>
              )}

              {!isLoggedIn && pathname === '/' && (
                <div className="border-t border-ui-border mt-2 pt-3 flex flex-col gap-2">
                  <Link href="/login"  className="btn-ghost  w-full justify-center py-3">Log in</Link>
                  <Link href="/signup" className="btn-primary w-full justify-center py-3">Sign up</Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {dropOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setDropOpen(false)} />
      )}
    </>
  )
}
