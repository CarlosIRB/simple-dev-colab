// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { login } from '@/modules/auth/services/auth.service'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const result = await login(email, password)
    if (!result) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    return NextResponse.json(result)
  } catch (err: any) {
    console.error('Error POST /api/auth/login:', err)
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 })
  }
}