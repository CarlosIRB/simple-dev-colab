'use client'

import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', ...props },
  ref
) {
  const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:pointer-events-none disabled:opacity-50 h-9 px-4'
  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-black text-white hover:bg-zinc-800',
    secondary: 'bg-white text-black border border-gray-300 hover:bg-gray-50',
    ghost: 'bg-transparent text-black hover:bg-gray-100',
  }
  const merged = [base, variants[variant], className].filter(Boolean).join(' ')
  return <button ref={ref} className={merged} {...props} />
})

export default Button


