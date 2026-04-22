/**
 * GET /api/wallet
 * Returns the authenticated user's wallet balance and info
 */
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getOrCreateWallet, getUserTransactions } from '@/lib/wallet'
import type { ApiResponse } from '@/types'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    )
  }

  const wallet       = getOrCreateWallet(session.id)
  const transactions = getUserTransactions(session.id)

  return NextResponse.json(
    { success: true, data: { wallet, transactions } },
    { status: 200 }
  )
}
