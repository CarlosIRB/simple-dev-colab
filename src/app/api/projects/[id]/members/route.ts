// src/app/api/projects/[id]/members/route.ts
import { NextResponse, NextRequest } from 'next/server'
import{ addUserToProject, getProjectMembers } from '@/modules/projects/services/project.service'
import { authMiddleware } from '@/middleware/auth.middleware'
import { getUserByEmail } from '@/modules/users/services/user.service'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = authMiddleware(request)
  if (auth instanceof NextResponse) return auth

  const project_id = Number(params.id)

  const result = await getProjectMembers(project_id)

  return NextResponse.json(result)
}


export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const auth = authMiddleware(request)
    if (auth instanceof NextResponse) return auth
    const { userId: _ } = auth
  
    const project_id = Number(params.id)
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })
  
    const user = await getUserByEmail(email)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  
    await addUserToProject(project_id, user.id)
  
    return NextResponse.json({ message: 'User added successfully' })
  }