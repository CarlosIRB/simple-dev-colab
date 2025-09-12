'use client'

import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'

export default function Navigation() {
  const { isLoading, isLoggedIn, user, logout } = useAuth()

  // mientras determinamos el estado, no renderizamos nada
  if (isLoading) return null

  // si no está logueado, no mostrar barra
  if (!isLoggedIn) return null

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">Simple Dev Colab</h1>
      <div className="space-x-4 flex items-center gap-4">
        <Link href="/projects" className="hover:underline">
          Projects
        </Link>
        <Link href="/analytics" className="hover:underline">
          Analytics
        </Link>
        {user?.username && (
          <span className="text-sm text-gray-700">
            Hola, <strong>{user.username}</strong>
          </span>
        )}
        <button
          onClick={logout}
          className="text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
