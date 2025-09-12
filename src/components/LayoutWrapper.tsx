'use client'

import { useAuth } from '../hooks/useAuth'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { isLoggedIn, isLoading } = useAuth()
  

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">Cargando...</div>
    </div>
  }
  
 
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen">
        {children}
      </main>
    )
  }
  

  return (
    <main className="container mx-auto px-6 py-8">
      {children}
    </main>
  )
}
