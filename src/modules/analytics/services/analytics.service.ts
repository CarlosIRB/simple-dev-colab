// src/modules/analytics/services/analyticsService.ts
import pool from '@/lib/db'
import { ProjectAnalytics } from '@/modules/analytics/models/analytics.model'



// Obtener proyectos donde el usuario está agregado
export async function getUserProjects(user_id: number): Promise<{ id: number; name: string }[]> {
  const result = await pool.query(`
    SELECT p.id, p.name
    FROM projects p
    JOIN project_members pm ON pm.project_id = p.id
    WHERE pm.user_id = $1
    ORDER BY p.id ASC
  `, [user_id])

  return result.rows
}

// Obtener estadísticas de tareas por proyecto
export async function getProjectAnalytics(user_id: number): Promise<ProjectAnalytics[]> {
  const result = await pool.query(`
    SELECT 
      p.id AS project_id,
      p.name AS project_name,
      COUNT(t.id) AS total_tasks,
      COUNT(CASE WHEN t.status='completed' THEN 1 END) AS completed_tasks,
      COUNT(CASE WHEN t.status='pending' THEN 1 END) AS pending_tasks,
      COUNT(CASE WHEN t.status='discarded' THEN 1 END) AS discarded_tasks
    FROM projects p
    LEFT JOIN tasks t ON t.project_id = p.id
    JOIN project_members pm ON pm.project_id = p.id
    WHERE pm.user_id = $1
    GROUP BY p.id
    ORDER BY p.id ASC
  `, [user_id])

  return result.rows
}
