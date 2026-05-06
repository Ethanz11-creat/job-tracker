import * as React from 'react'
import { cn } from '../../lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-lg border bg-transparent px-3 py-2 text-sm transition-all duration-200 placeholder:text-[#6b6558] focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 resize-y',
          className
        )}
        style={{
          borderColor: 'rgba(255,255,255,0.08)',
          color: '#e8e6e1',
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
