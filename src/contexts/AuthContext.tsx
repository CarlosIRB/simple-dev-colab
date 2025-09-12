'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  username: string
  email: string
}

interface AuthState {
  isLoading: boolean
  isLoggedIn: boolean
  user: User | null
}

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function parseJwt(token: string | null): any {
  if (!token) return null
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isLoggedIn: false,
    user: null
  })
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const payload = parseJwt(token)

    if (payload?.id && payload?.username) {
      setAuthState({
        isLoading: false,
        isLoggedIn: true,
        user: {
          id: payload.id,
          username: payload.username,
          email: payload.email
        }
      })
    } else {
      setAuthState({
        isLoading: false,
        isLoggedIn: false,
        user: null
      })
    }
  }, [])

  function login(token: string, user: User) {
    localStorage.setItem('token', token)
    setAuthState({
      isLoading: false,
      isLoggedIn: true,
      user
    })
  }

  function logout() {
    localStorage.removeItem('token')
    setAuthState({
      isLoading: false,
      isLoggedIn: false,
      user: null
    })
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
