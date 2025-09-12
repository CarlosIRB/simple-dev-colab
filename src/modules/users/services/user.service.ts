// src/modules/users/services/userService.ts
import pool from '@/lib/db'
import bcrypt from 'bcrypt'
import { User } from '@/modules/users/models/user.model'


export async function getAllUsers(): Promise<User[]> {
  const result = await pool.query('SELECT id, username, email, created_at FROM users ORDER BY id ASC')
  return result.rows
}


export async function createUser(username: string, email: string, password: string): Promise<User> {

  const password_hash = await bcrypt.hash(password, 10)

  const result = await pool.query(
    'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
    [username, email, password_hash]
  )

  return result.rows[0]
}

export async function getUserById(id: number): Promise<User | null> {
  const result = await pool.query(
    'SELECT id, username, email, created_at FROM users WHERE id = $1',
    [id]
  )
  return result.rows[0] || null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  
  const result = await pool.query('SELECT id FROM users WHERE email = $1', [email])
  return result.rows[0] || null
}

export async function searchUsersByEmail(email: string, user_id:number): Promise<User[]>{
  const result = await pool.query(
    'SELECT id, email FROM users WHERE email ILIKE $1 AND id != $2 LIMIT 5',
    [`%${email}%`, user_id]
  )
  return result.rows
}

// login verification
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  const user = result.rows[0]
  if (!user) return null

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) return null

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    created_at: user.created_at,
  }
}
