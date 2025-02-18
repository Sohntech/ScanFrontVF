import { HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={twMerge('p-6 bg-gray-100 dark:bg-gray-800', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'

export default CardFooter