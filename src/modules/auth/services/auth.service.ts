import jwt from 'jsonwebtoken'
import { authenticateUser } from '@/modules/users/services/user.service'
import { User } from '@/modules/users/models/user.model'

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'
const JWT_EXPIRES_IN = '8h'

export async function login(email: string, password: string): Promise<{ user: User; token: string } | null> {
  const user = await authenticateUser(email, password)
  if (!user) return null

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  return { user, token }
}

export function verifyToken(token: string): { userId: number; email: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; email: string }
    return payload
  } catch {
    return null
  }
}
