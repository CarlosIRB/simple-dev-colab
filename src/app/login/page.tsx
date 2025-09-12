'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error')
      
  
      login(data.token, data.user)
      router.push('/projects')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">
            {mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <Label>Nombre de usuario</Label>
                <Input value={username} onChange={e => setUsername(e.target.value)} required />
              </div>
            )}
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>Contraseña</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              {mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            {mode === 'login'
              ? <>¿No tienes cuenta? <button onClick={() => setMode('register')} className="text-blue-500">Regístrate</button></>
              : <>¿Ya tienes cuenta? <button onClick={() => setMode('login')} className="text-blue-500">Inicia sesión</button></>
            }
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
