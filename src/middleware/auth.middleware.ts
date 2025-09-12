import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/modules/auth/services/auth.service'

// Retorna NextResponse (error) o { userId } en éxito
export function authMiddleware(request: NextRequest): NextResponse | { userId: number } {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.split(' ')[1]
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

  return { userId: Number(payload.id) }
}
