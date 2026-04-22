import { NextRequest, NextResponse } from 'next/server'
import { signupSchema } from '@/lib/validators/auth'
import { findUserByEmail, createUser } from '@/lib/mockData'
import { setSession } from '@/lib/auth'
import { hashPassword } from '@/lib/auth-password'
import type { ApiResponse, AuthUser } from '@/types'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate with Zod
    const parsed = signupSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, phone, password, role, city } = parsed.data

    // Check email uniqueness
    // ── In production: await db.user.findUnique({ where: { email } }) ──
    if (findUserByEmail(email)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password securely
    const passwordHash = await hashPassword(password)

    // ── In production: await db.user.create({ data: { ... } }) ──────
    const user = createUser({ firstName, lastName, email, phone, role, city, passwordHash })

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone,
      city: user.city,
    }

    // Auto-login after signup
    await setSession(authUser)

    return NextResponse.json<ApiResponse<AuthUser>>(
      { success: true, data: authUser, message: 'Account created successfully' },
      { status: 201 }
    )
  } catch (err) {
    console.error('[AUTH SIGNUP]', err)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
