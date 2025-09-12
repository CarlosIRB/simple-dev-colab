// src/app/api/tasks/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/middleware/auth.middleware'
import pool from '@/lib/db'
import { getProjectByTaskId, deleteTask } from '@/modules/tasks/services/task.service'
import { getProjectById } from '@/modules/projects/services/project.service'
import { updateTask } from '@/modules/tasks/services/task.service'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = authMiddleware(request)
  if (auth instanceof NextResponse) return auth

  const task_id = Number(params.id)
  const body = await request.json()

  const updated = await updateTask(task_id, body)
  return NextResponse.json(updated)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = authMiddleware(request)
    if (auth instanceof NextResponse) return auth

    const { userId } = auth
    const task_id = Number(params.id)

    const project_id = await getProjectByTaskId(task_id)
    if (!project_id) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

    const project = await getProjectById(project_id)

    if (project?.created_by != userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    await deleteTask(task_id)

    return NextResponse.json({ message: 'Task deleted' })
  } catch (err: any) {
    console.error('Error DELETE /api/tasks/[id]:', err)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
