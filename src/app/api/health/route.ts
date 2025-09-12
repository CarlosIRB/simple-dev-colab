import { NextResponse } from 'next/server'
import { testConnection } from '@/lib/db'

export async function GET() {
  await testConnection()
  return NextResponse.json({ status: 'ok' })
}
