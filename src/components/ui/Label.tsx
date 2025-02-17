// Label.tsx
import React, { LabelHTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <label 
        ref={ref} 
        className={twMerge('text-sm font-medium text-gray-700 dark:text-gray-300', className)}
        {...props}
      >
        {children}
      </label>
    )
  }
)

Label.displayName = 'Label'

export default Label