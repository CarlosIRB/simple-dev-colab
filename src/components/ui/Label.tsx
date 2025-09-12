'use client'

import React from 'react'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, ...props },
  ref
) {
  const base = 'block text-sm font-medium text-gray-700'
  const merged = className ? base + ' ' + className : base
  return <label ref={ref} className={merged} {...props} />
})

export default Label
