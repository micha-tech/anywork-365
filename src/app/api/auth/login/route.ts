import { NextRequest, NextResponse } from 'next/server'
import { loginSchema } from '@/lib/validators/auth'
import { findUserByEmail } from '@/lib/mockData'
import { setSession } from '@/lib/auth'
import { verifyPassword } from '@/lib/auth-password'
import type { ApiResponse, AuthUser } from '@/types'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input with Zod
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    // ── In production: query your DB here ──────────────────────────
    // const user = await db.user.findUnique({ where: { email } })
    // For MVP/demo, accept a mock user or demo credentials
    const mockUser = findUserByEmail(email)

    // Demo shortcut: allow demo@anywork365.com / Demo1234
    const isDemoLogin =
      email === 'demo@anywork365.com' && password === 'Demo1234'

    if (!mockUser && !isDemoLogin) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify hashed password (or demo bypass)
    if (mockUser && !(await verifyPassword(password, mockUser.passwordHash))) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const authUser: AuthUser = isDemoLogin
      ? { id: 'demo-user', email, firstName: 'Emeka', lastName: 'Obi', role: 'client' }
      : { id: mockUser!.id, email, firstName: mockUser!.firstName, lastName: mockUser!.lastName, role: mockUser!.role }

    // Set httpOnly session cookie
    await setSession(authUser)

    return NextResponse.json<ApiResponse<AuthUser>>(
      { success: true, data: authUser, message: 'Login successful' },
      { status: 200 }
    )
  } catch (err) {
    console.error('[AUTH LOGIN]', err)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
