// src/app/api/users/route.ts
import { NextResponse } from 'next/server'
import { getAllUsers, createUser } from '@/modules/users/services/user.service'

export async function GET() {
  try {
    const users = await getAllUsers()
    return NextResponse.json(users)
  } catch (err: any) {
    console.error('Error GET /api/users:', err)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email, password } = body

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const user = await createUser(username, email, password)
    return NextResponse.json(user, { status: 201 })
  } catch (err: any) {
    console.error('Error POST /api/users:', err)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
