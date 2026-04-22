'use client'

import { useState, useEffect } from 'react'
import type { AuthUser } from '@/types'

interface CurrentUserState {
  user: AuthUser | null
  loading: boolean
}

export function useCurrentUser(): CurrentUserState {
  const [state, setState] = useState<CurrentUserState>({ user: null, loading: true })

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setState({ user: data?.data ?? null, loading: false })
      })
      .catch(() => setState({ user: null, loading: false }))
  }, [])

  return state
}

// Derive initials from first + last name, e.g. "Michael Eze" → "ME"
export function getInitialsFromUser(user: AuthUser | null): string {
  if (!user) return '??'
  const first = user.firstName?.[0] ?? ''
  const last  = user.lastName?.[0]  ?? ''
  return `${first}${last}`.toUpperCase()
}
