/**
 * GET /api/users
 * Get user by ID
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { findUserById } from '@/lib/users'
import type { ApiResponse, User } from '@/types'

const schema = z.object({
  id: z.string().min(1, 'User ID is required'),
})

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

  const user = findUserById(id)
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