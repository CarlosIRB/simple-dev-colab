// src/modules/tasks/services/taskService.ts
import pool from '@/lib/db'
import { Project } from '@/modules/projects/models/project.model'
import { Task } from '@/modules/tasks/models/task.model'


export async function getTasksByProject(project_id: number): Promise<Task[]> {
  const result = await pool.query(`
    SELECT 
      t.*,
      u.username as assigned_user_name
    FROM tasks t
    LEFT JOIN users u ON u.id = t.assigned_to
    WHERE t.project_id = $1 
    ORDER BY t.priority ASC, t.id ASC
  `, [project_id])
  return result.rows
}

export async function getProjectByTaskId(task_id: number): Promise<number | null> {
  const result = await pool.query(
    "SELECT project_id FROM tasks WHERE id = $1",
    [task_id]
  );
  return result.rows[0]?.project_id || null
}

export async function createTask(project_id: number, title: string, priority: number, assigned_to: number | null): Promise<Task> {
  const result = await pool.query(
    'INSERT INTO tasks (project_id, title, priority, assigned_to) VALUES ($1, $2, $3, $4) RETURNING *',
    [project_id, title, priority, assigned_to]
  )
  return result.rows[0]
}

export async function updateTaskStatus(task_id: number, status: 'pending' | 'completed' | 'discarded'): Promise<Task | null> {
  const result = await pool.query(
    'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
    [status, task_id]
  )
  return result.rows[0] || null
}

export async function updateTask(task_id: number, fields: { title?: string; priority?: number; assigned_to?: number | null }): Promise<Task | null> {
  const setParts: string[] = []
  const values: any[] = []
  let idx = 1

  for (const [key, value] of Object.entries(fields)) {
    setParts.push(`${key} = $${idx}`)
    values.push(value)
    idx++
  }

  if (setParts.length === 0) return null

  values.push(task_id)
  const result = await pool.query(
    `UPDATE tasks SET ${setParts.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  )

  return result.rows[0] || null
}


export async function deleteTask(task_id:number){
  const result = await pool.query('DELETE FROM tasks WHERE id = $1', [task_id])
  return result
}