import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/middleware/auth.middleware'
import { getUserTaskAnalytics } from '@/modules/analytics/services/analytics.service'

export async function GET(req: NextRequest) {
  const auth = authMiddleware(req)
  if (auth instanceof NextResponse) return auth

  const { userId } = auth
  if (!userId) return NextResponse.json({ error: 'Missing user_id' }, { status: 401 })

  const stats = await getUserTaskAnalytics(userId)
  return NextResponse.json(stats)
}
