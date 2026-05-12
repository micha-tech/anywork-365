import { NextRequest, NextResponse } from 'next/server'
import { signupSchema } from '@/lib/validators/auth'
import { setSession } from '@/lib/auth'
import { auth as adminAuth } from '@/lib/firebase/admin'
import { createUser, createBusiness } from '@/lib/queries'
import type { ApiResponse, AuthUser } from '@/types'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = signupSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, phone, password, role, city } = parsed.data

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
      phoneNumber: phone,
    })

    await createUser({
      uid: userRecord.uid,
      email,
      fullName: `${firstName} ${lastName}`,
      phoneNumber: phone,
      state: city || 'Lagos',
    })

    if (role === 'vendor') {
      await createBusiness({
        uid: userRecord.uid,
        businessName: `${firstName} ${lastName}`,
        businessContact: phone,
        state: city || 'Lagos',
      })
    }

    const authUser: AuthUser = {
      id: userRecord.uid,
      email,
      firstName,
      lastName,
      role,
      phone,
      city: city || 'Lagos',
    }

    await setSession(authUser)

    return NextResponse.json<ApiResponse<AuthUser>>(
      { success: true, data: authUser, message: 'Account created successfully' },
      { status: 201 }
    )
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string }
    console.error('[AUTH SIGNUP]', e)
    let message = 'Internal server error'
    if (e?.code === 'auth/email-already-exists') message = 'An account with this email already exists'
    else if (e?.message) message = e.message

    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 400 }
    )
  }
}