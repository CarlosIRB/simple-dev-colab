import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button Component - Tests Simples', () => {
  it('debería renderizar el texto correctamente', () => {
    render(<Button>Mi Botón</Button>)
    expect(screen.getByText('Mi Botón')).toBeInTheDocument()
  })

  it('debería ser un elemento button', () => {
    render(<Button>Test</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('debería aplicar clases CSS básicas', () => {
    render(<Button>Test</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
  })

  it('debería estar deshabilitado cuando se pasa disabled', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('debería manejar clicks', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    button.click()
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
