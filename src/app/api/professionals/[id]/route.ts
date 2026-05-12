import { NextRequest, NextResponse } from 'next/server'
import { getVendorByUid, getReviewsByBusiness, getBusinessByUid } from '@/lib/queries'
import type { ApiResponse } from '@/types'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const vendor = await getVendorByUid(id)
  if (!vendor) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Vendor not found' },
      { status: 404 }
    )
  }

  const business = await getBusinessByUid(id)
  const reviews = business ? await getReviewsByBusiness(business.businessId) : []

  return NextResponse.json({
    success: true,
    data: { vendor, reviews },
  })
}