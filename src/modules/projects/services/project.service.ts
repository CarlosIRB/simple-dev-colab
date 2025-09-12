// src/modules/projects/services/projectService.ts
import pool from '@/lib/db'
import { Project } from '@/modules/projects/models/project.model'

export async function getAllProjects(): Promise<Project[]> {
  const result = await pool.query(`
    SELECT id, name, description, created_by, created_at
    FROM projects
    ORDER BY id ASC
  `)
  return result.rows
}

export async function createProject(name: string, description: string | null, created_by: number): Promise<Project> {
  const result = await pool.query(
    'INSERT INTO projects (name, description, created_by) VALUES ($1, $2, $3) RETURNING id, name, description, created_by, created_at',
    [name, description, created_by]
  )
  return result.rows[0]
}

export async function getProjectById(id: number): Promise<Project | null> {
  const result = await pool.query(
    'SELECT id, name, description, created_by, created_at FROM projects WHERE id = $1',
    [id]
  )
  return result.rows[0] || null
}

// Obtener proyectos en los que el usuario está agregado
export async function getUserProjects(user_id: number): Promise<Project[]> {
  const result = await pool.query(`
    SELECT p.id, p.name, p.description, p.created_by, p.created_at
    FROM projects p
    JOIN project_members pm ON pm.project_id = p.id
    WHERE pm.user_id = $1
    ORDER BY p.id ASC
  `, [user_id])
  return result.rows
}

// Agregar usuario a un proyecto
export async function addUserToProject(project_id: number, user_id: number) {
  await pool.query(`
    INSERT INTO project_members (project_id, user_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `, [project_id, user_id])
}
