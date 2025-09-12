// src/app/api/projects/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server'
import{ getProjectById } from '@/modules/projects/services/project.service'
import { authMiddleware } from '@/middleware/auth.middleware'
import { getUserByEmail } from '@/modules/users/services/user.service'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = authMiddleware(request)
  if (auth instanceof NextResponse) return auth

  const project_id = Number(params.id)

  const result = await getProjectById(project_id)

  return NextResponse.json(result)
}
