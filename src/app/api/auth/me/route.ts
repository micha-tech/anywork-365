import { NextResponse } from 'next/server'
import { getSession, clearSession } from '@/lib/auth'
import { mergeStoredProfile } from '@/lib/profileStore'
import type { ApiResponse, AuthUser } from '@/types'

export const runtime = 'nodejs'

// GET /api/auth/me
export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
    )
  }
  const hydratedSession = await mergeStoredProfile(session)
  return NextResponse.json<ApiResponse<AuthUser>>(
    { success: true, data: hydratedSession },
    { status: 200 }
  )
}

// POST /api/auth/logout
export async function POST() {
  await clearSession()
  return NextResponse.json<ApiResponse<null>>(
    { success: true, message: 'Logged out' },
    { status: 200 }
  )
}
