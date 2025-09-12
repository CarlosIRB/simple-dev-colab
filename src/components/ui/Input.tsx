'use client'

import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref
) {
  const baseClasses = 'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200'
  const merged = className ? baseClasses + ' ' + className : baseClasses
  return <input ref={ref} className={merged} {...props} />
})

export default Input


