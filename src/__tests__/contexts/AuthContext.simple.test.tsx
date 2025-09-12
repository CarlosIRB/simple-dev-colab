import { render, screen, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ReactNode } from 'react'

// Componente de prueba simple
function TestComponent() {
  const { isLoggedIn, user, login, logout } = useAuth()
  
  return (
    <div>
      <div data-testid="status">
        {isLoggedIn ? 'logged-in' : 'logged-out'}
      </div>
      <div data-testid="username">
        {user ? user.username : 'no-user'}
      </div>
      <button 
        data-testid="login-btn"
        onClick={() => login('token123', { 
          id: 1, 
          username: 'testuser', 
          email: 'test@test.com' 
        })}
      >
        Login
      </button>
      <button 
        data-testid="logout-btn"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  )
}

function TestWrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

describe('AuthContext - Tests Simples', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('debería mostrar estado inicial', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    expect(screen.getByTestId('status')).toHaveTextContent('logged-out')
    expect(screen.getByTestId('username')).toHaveTextContent('no-user')
  })

  it('debería hacer login correctamente', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    const loginBtn = screen.getByTestId('login-btn')
    
    act(() => {
      loginBtn.click()
    })

    expect(screen.getByTestId('status')).toHaveTextContent('logged-in')
    expect(screen.getByTestId('username')).toHaveTextContent('testuser')
  })

  it('debería hacer logout correctamente', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    // Primero hacer login
    const loginBtn = screen.getByTestId('login-btn')
    act(() => {
      loginBtn.click()
    })

    // Luego hacer logout
    const logoutBtn = screen.getByTestId('logout-btn')
    act(() => {
      logoutBtn.click()
    })

    expect(screen.getByTestId('status')).toHaveTextContent('logged-out')
    expect(screen.getByTestId('username')).toHaveTextContent('no-user')
  })

  it('debería guardar token en localStorage al hacer login', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    const loginBtn = screen.getByTestId('login-btn')
    
    act(() => {
      loginBtn.click()
    })

    expect(localStorage.getItem('token')).toBe('token123')
  })

  it('debería limpiar localStorage al hacer logout', () => {
    // Simular que ya hay un token
    localStorage.setItem('token', 'existing-token')
    
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    const logoutBtn = screen.getByTestId('logout-btn')
    
    act(() => {
      logoutBtn.click()
    })

    expect(localStorage.getItem('token')).toBeNull()
  })
})
