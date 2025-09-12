// src/app/api/analytics/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { getProjectAnalytics } from '@/modules/analytics/services/analytics.service'
import { authMiddleware } from '@/middleware/auth.middleware'


export async function GET(request: NextRequest) {
  try {
    const auth = authMiddleware(request);
    if (auth instanceof NextResponse) return auth;
    const { userId } = auth
    const user_id = userId
    if (!user_id) {
      return NextResponse.json({ error: 'Missing user_id' }, { status: 401 })
    }

    const analytics = await getProjectAnalytics(user_id)
    return NextResponse.json(analytics)
  } catch (err: any) {
    console.error('Error GET /api/analytics:', err)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
