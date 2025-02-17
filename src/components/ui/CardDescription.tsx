// CardDescription.tsx
import { HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p 
        ref={ref} 
        className={twMerge('text-sm text-gray-500 dark:text-gray-400', className)}
        {...props}
      >
        {children}
      </p>
    )
  }
)

CardDescription.displayName = 'CardDescription'

export default CardDescription