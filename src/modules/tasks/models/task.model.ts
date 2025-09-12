export type Task = {
    id: number
    project_id: number
    title: string
    priority: number
    assigned_to: number | null
    status: 'pending' | 'completed' | 'discarded'
    created_at: string
    updated_at: string
  }