import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getUserFullByUid } from '@/lib/queries'
import type { ApiResponse } from '@/types'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    )
  }

  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'User ID is required' },
      { status: 400 }
    )
  }

  const user = await getUserFullByUid(id)
  if (!user) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'User not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    data: { user: { id: user.id, firstName: user.firstName, lastName: user.lastName, role: user.role, isVerified: user.isVerified } },
  })
}