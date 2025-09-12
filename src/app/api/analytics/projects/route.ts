import { NextRequest, NextResponse } from 'next/server';
import { getProjectAnalytics } from '@/modules/analytics/services/analytics.service';
import { authMiddleware } from '@/middleware/auth.middleware';

export async function GET(req: NextRequest) {
  const auth = authMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  const { userId } = auth;
  if (!userId) return NextResponse.json({ error: 'Missing user_id' }, { status: 401 });

  const analytics = await getProjectAnalytics(userId);
  return NextResponse.json(analytics);
}
