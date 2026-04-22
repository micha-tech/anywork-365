/**
 * GET /api/wallet/banks
 * Returns list of Nigerian banks from Paystack
 * Cached for 24 hours to avoid hammering Paystack API
 */
import { NextResponse } from 'next/server'
import { listBanks } from '@/lib/paystack'
import type { ApiResponse, NigerianBank } from '@/types'

// Simple in-memory cache
let cachedBanks: NigerianBank[] | null = null
let cacheTime  = 0
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

export async function GET() {
  try {
    const now = Date.now()

    if (cachedBanks && now - cacheTime < CACHE_TTL) {
      return NextResponse.json<ApiResponse<NigerianBank[]>>(
        { success: true, data: cachedBanks },
        { status: 200, headers: { 'Cache-Control': 'public, max-age=86400' } }
      )
    }

    const result = await listBanks()
    cachedBanks  = result.data
    cacheTime    = now

    return NextResponse.json<ApiResponse<NigerianBank[]>>(
      { success: true, data: cachedBanks },
      { status: 200, headers: { 'Cache-Control': 'public, max-age=86400' } }
    )
  } catch (err) {
    console.error('[BANKS LIST]', err)
    // Return a fallback list of major Nigerian banks if Paystack is down
    return NextResponse.json<ApiResponse<NigerianBank[]>>(
      {
        success: true,
        data: [
          { id: 1,  name: 'Access Bank',         code: '044', slug: 'access-bank' },
          { id: 2,  name: 'First Bank of Nigeria', code: '011', slug: 'first-bank-of-nigeria' },
          { id: 3,  name: 'GTBank',               code: '058', slug: 'gtbank' },
          { id: 4,  name: 'Zenith Bank',          code: '057', slug: 'zenith-bank' },
          { id: 5,  name: 'UBA',                  code: '033', slug: 'uba' },
          { id: 6,  name: 'Sterling Bank',        code: '232', slug: 'sterling-bank' },
          { id: 7,  name: 'Opay',                 code: '100004', slug: 'opay' },
          { id: 8,  name: 'Kuda Bank',            code: '50211', slug: 'kuda-bank' },
          { id: 9,  name: 'Moniepoint',           code: '50515', slug: 'moniepoint-mfb' },
          { id: 10, name: 'Palmpay',              code: '999991', slug: 'palmpay' },
        ],
      },
      { status: 200 }
    )
  }
}
