import { render, screen, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ReactNode } from 'react'

// Componente de prueba para usar el hook
function TestComponent() {
  const { isLoggedIn, user, login, logout } = useAuth()
  
  return (
    <div>
      <div data-testid="isLoggedIn">{isLoggedIn ? 'true' : 'false'}</div>
      <div data-testid="user">{user ? user.username : 'null'}</div>
      <button onClick={() => login('token123', { id: 1, username: 'testuser', email: 'test@test.com' })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

// Wrapper para el provider
function TestWrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

describe('AuthContext', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('debería mostrar estado inicial de carga', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    // Inicialmente debería estar cargando
    expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('false')
    expect(screen.getByTestId('user')).toHaveTextContent('null')
  })

  it('debería hacer login correctamente', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    const loginButton = screen.getByText('Login')
    
    act(() => {
      loginButton.click()
    })

    expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('true')
    expect(screen.getByTestId('user')).toHaveTextContent('testuser')
    expect(localStorage.getItem('token')).toBe('token123')
  })

  it('debería hacer logout correctamente', () => {
    // Primero hacer login
    localStorage.setItem('token', 'token123')
    
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    const logoutButton = screen.getByText('Logout')
    
    act(() => {
      logoutButton.click()
    })

    expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('false')
    expect(screen.getByTestId('user')).toHaveTextContent('null')
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('debería cargar usuario desde localStorage al inicializar', () => {
    // Simular un token válido en localStorage
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImlhdCI6MTYzOTU2MDAwMCwiZXhwIjoxNjQwMTY0ODAwfQ.test'
    
    // Mock de atob para decodificar el JWT
    const originalAtob = global.atob
    global.atob = jest.fn().mockReturnValue('{"id":1,"email":"test@test.com","username":"testuser","iat":1639560000,"exp":1640164800}')
    
    localStorage.setItem('token', mockToken)

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('true')
    expect(screen.getByTestId('user')).toHaveTextContent('testuser')

    // Restaurar atob
    global.atob = originalAtob
  })
})
