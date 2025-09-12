import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button Component', () => {
  it('debería renderizar correctamente', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('debería aplicar la variante primary por defecto', () => {
    render(<Button>Primary Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-black', 'text-white')
  })

  it('debería aplicar la variante secondary correctamente', () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-white', 'text-black', 'border')
  })

  it('debería aplicar la variante ghost correctamente', () => {
    render(<Button variant="ghost">Ghost Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-transparent', 'text-black')
  })

  it('debería estar deshabilitado cuando se pasa la prop disabled', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:opacity-50')
  })

  it('debería aceptar clases personalizadas', () => {
    render(<Button className="custom-class">Custom Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('debería pasar todas las props HTML del botón', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick} type="submit">Submit Button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveAttribute('type', 'submit')
    button.click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
