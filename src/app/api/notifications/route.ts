/**
 * POST /api/notifications/subscribe
 * Save push subscription for user
 * 
 * GET /api/notifications
 * Get user notifications
 * 
 * POST /api/notifications/read
 * Mark notifications as read
 */
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  savePushSubscription
} from '@/lib/chat'
import type { ApiResponse } from '@/types'

export async function GET(_req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const notifications = getUserNotifications(session.id)
    const unreadCount = getUnreadNotificationCount(session.id)

    return NextResponse.json({
      success: true,
      data: { notifications, unreadCount },
    })
  } catch (error) {
    console.error('Notifications GET error:', error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await req.json()
    
    // Handle push subscription
    if (body.endpoint && body.keys) {
      const subscription = savePushSubscription(session.id, {
        endpoint: body.endpoint,
        keys: body.keys,
      })
      return NextResponse.json({
        success: true,
        data: { subscription },
      })
    }

    // Handle mark as read
    if (body.notificationId) {
      markNotificationAsRead(body.notificationId)
    } else if (body.markAllRead) {
      markAllNotificationsAsRead(session.id)
    }

    const notifications = getUserNotifications(session.id)
    const unreadCount = getUnreadNotificationCount(session.id)

    return NextResponse.json({
      success: true,
      data: { notifications, unreadCount },
    })
  } catch (error) {
    console.error('Notifications POST error:', error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}