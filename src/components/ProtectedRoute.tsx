'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isLoggedIn, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Si no está cargando y no está logueado, redirigir a login
    if (!isLoading && !isLoggedIn) {
      router.push('/login')
    }
  }, [isLoading, isLoggedIn, router])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Verificando autenticación...</div>
      </div>
    )
  }

  // Si no está logueado, mostrar fallback o nada (se redirigirá)
  if (!isLoggedIn) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Redirigiendo al login...</div>
      </div>
    )
  }

  // Si está logueado, mostrar el contenido protegido
  return <>{children}</>
}
