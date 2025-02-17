// CardTitle.tsx
import { HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3 
        ref={ref} 
        className={twMerge('text-lg font-medium text-gray-900 dark:text-white', className)}
        {...props}
      >
        {children}
      </h3>
    )
  }
)

CardTitle.displayName = 'CardTitle'

export default CardTitle