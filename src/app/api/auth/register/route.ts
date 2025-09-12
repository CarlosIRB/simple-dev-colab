// src/app/api/auth/register/route.ts

import { NextResponse } from 'next/server'
import { register } from '@/modules/auth/services/auth.service'

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()
    if (!username || !email || !password)
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const result = await register(username, email, password)
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('Error POST /api/auth/register:', err)
    return NextResponse.json({ error: err.message || 'Failed to register' }, { status: 500 })
  }
}
