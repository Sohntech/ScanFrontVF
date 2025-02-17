// CardHeader.tsx
import React, { HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={twMerge('p-6', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

export default CardHeader