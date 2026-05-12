import { NextRequest, NextResponse } from 'next/server'
import { setSession } from '@/lib/auth'
import { auth as adminAuth } from '@/lib/firebase/admin'
import { getUserByUid } from '@/lib/queries'
import type { ApiResponse, AuthUser } from '@/types'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json()
    if (!idToken) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'ID token is required' },
        { status: 400 }
      )
    }

    const decoded = await adminAuth.verifyIdToken(idToken)
    const uid = decoded.uid

    const profile = await getUserByUid(uid)
    if (!profile) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    await setSession(profile)

    return NextResponse.json<ApiResponse<AuthUser>>(
      { success: true, data: profile },
      { status: 200 }
    )
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  }
}