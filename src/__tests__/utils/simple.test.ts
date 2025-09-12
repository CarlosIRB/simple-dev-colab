// Tests simples para funciones utilitarias básicas

describe('Funciones Utilitarias Simples', () => {
  it('debería sumar números correctamente', () => {
    const sumar = (a: number, b: number) => a + b
    expect(sumar(2, 3)).toBe(5)
    expect(sumar(-1, 1)).toBe(0)
    expect(sumar(0, 0)).toBe(0)
  })

  it('debería validar emails correctamente', () => {
    const validarEmail = (email: string) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return regex.test(email)
    }

    expect(validarEmail('test@example.com')).toBe(true)
    expect(validarEmail('user@domain.co')).toBe(true)
    expect(validarEmail('invalid-email')).toBe(false)
    expect(validarEmail('')).toBe(false)
    expect(validarEmail('test@')).toBe(false)
  })

  it('debería formatear fechas correctamente', () => {
    const formatearFecha = (fecha: Date) => {
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }

    // Usar una fecha específica que no dependa de la zona horaria
    const fecha = new Date(2024, 0, 15) // 15 de enero de 2024
    expect(formatearFecha(fecha)).toBe('15/01/2024')
  })

  it('debería capitalizar strings', () => {
    const capitalizar = (texto: string) => {
      return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
    }

    expect(capitalizar('hola mundo')).toBe('Hola mundo')
    expect(capitalizar('TEST')).toBe('Test')
    expect(capitalizar('a')).toBe('A')
  })

  it('debería generar IDs únicos', () => {
    const generarId = () => {
      return Math.random().toString(36).substr(2, 9)
    }

    const id1 = generarId()
    const id2 = generarId()
    
    expect(id1).toBeDefined()
    expect(id2).toBeDefined()
    expect(id1).not.toBe(id2)
    expect(id1.length).toBe(9)
  })
})
