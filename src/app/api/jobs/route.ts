import { NextRequest, NextResponse } from 'next/server'
import { MOCK_JOBS } from '@/lib/mockData'
import { jobPostSchema } from '@/lib/validators/job'
import { getSession } from '@/lib/auth'
import type { ApiResponse, Job, JobCategory } from '@/types'

// In-memory store (replace with DB in production)
const jobStore: Job[] = [...MOCK_JOBS]

// ─── GET /api/jobs ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search   = searchParams.get('search')?.toLowerCase()
  const category = searchParams.get('category')
  const city     = searchParams.get('city')

  let jobs = [...jobStore]

  if (search) {
    jobs = jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(search) ||
        j.description.toLowerCase().includes(search)
    )
  }
  if (category) jobs = jobs.filter((j) => j.category === category)
  if (city)     jobs = jobs.filter((j) => j.city === city)

  // Sort newest first
  jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json<ApiResponse<Job[]>>(
    { success: true, data: jobs },
    { status: 200 }
  )
}

// ─── POST /api/jobs ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const session = await getSession()
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await req.json()

    const parsed = jobPostSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const newJob: Job = {
      id: `job-${Date.now()}`,
      ...parsed.data,
      category: parsed.data.category as JobCategory,
      status: 'open',
      posterId: session.id,
      posterName: `${session.firstName} ${session.lastName}`,
      businessName: parsed.data.businessName || '',
      businessAddress: parsed.data.businessAddress || '',
      jobType: parsed.data.jobType || 'full-time',
      closingDate: parsed.data.closingDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      applicationCount: 0,
      createdAt: new Date().toISOString(),
    }

    // ── In production: await db.job.create({ data: newJob }) ──────────
    jobStore.unshift(newJob)

    return NextResponse.json<ApiResponse<Job>>(
      { success: true, data: newJob, message: 'Job posted successfully' },
      { status: 201 }
    )
  } catch (err) {
    console.error('[JOBS POST]', err)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
