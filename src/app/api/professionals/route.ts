import { NextRequest, NextResponse } from 'next/server'
import { listVendors } from '@/lib/queries'
import type { ApiResponse, User } from '@/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') || undefined
  const state = searchParams.get('city') || undefined
  const search = searchParams.get('search') || undefined
  const limit = parseInt(searchParams.get('limit') || '0')

  const vendors = await listVendors({ category, state, search })
  const sliced = limit > 0 ? vendors.slice(0, limit) : vendors

  return NextResponse.json<ApiResponse<User[]>>(
    { success: true, data: sliced },
    { status: 200 }
  )
}