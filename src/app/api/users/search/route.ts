import { NextResponse, NextRequest } from 'next/server'
import { searchUsersByEmail } from '@/modules/users/services/user.service'
import { authMiddleware } from '@/middleware/auth.middleware'

export async function GET(request: NextRequest) {
  const auth = authMiddleware(request)
  if (auth instanceof NextResponse) return auth
  const { userId } = auth

  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  if (!email) return NextResponse.json({ results: [] })

  const result = await searchUsersByEmail(email, userId)

  return NextResponse.json({ results: result })
}