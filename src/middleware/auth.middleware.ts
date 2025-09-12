import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/modules/auth/services/auth.service'

export function authMiddleware(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.split(' ')[1]
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  
  // use x-user-id to get user_id in the NextRequest headers for the endpoints
  request.headers.set('x-user-id', payload.userId.toString())
  return NextResponse.next()
}
