// src/modules/auth/services/auth.service.ts
import pool from '@/lib/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'
const SALT_ROUNDS = 10

export async function register(username: string, email: string, password: string) {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS)
  try {
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3) RETURNING id, username, email`,
      [username, email, hashed]
    )
    const user = result.rows[0]
    const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '7d' })
    return { token, user }
  } catch (err: any) {
    if (err.code === '23505') throw new Error('Email or username already exists')
    throw err
  }
}

export async function login(email: string, password: string) {
  const res = await pool.query('SELECT id, username, email, password_hash FROM users WHERE email = $1', [email])
  const user = res.rows[0]
  if (!user) return null

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) return null

  const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '7d' })
  return { token, user: { id: user.id, username: user.username, email: user.email } }
}

export function verifyToken(token: string): { id: number; email: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number; email: string }
    return payload
  } catch {
    return null
  }
}
