'use client'

import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  const base = 'rounded-lg border border-gray-200 bg-white shadow-sm'
  const merged = className ? base + ' ' + className : base
  return <div className={merged} {...props} />
}

export function CardContent({ className, ...props }: CardContentProps) {
  const base = 'p-6'
  const merged = className ? base + ' ' + className : base
  return <div className={merged} {...props} />
}

export default Card


