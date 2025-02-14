import { HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          'bg-white shadow rounded-lg overflow-hidden',
          className
        )}
        {...props}
      >
        {title && (
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {title}
            </h3>
          </div>
        )}
        <div className="px-4 py-5 sm:p-6">{children}</div>
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card