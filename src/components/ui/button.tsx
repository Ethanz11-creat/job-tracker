import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e]/20 disabled:pointer-events-none disabled:opacity-50 rounded-lg relative overflow-hidden group',
  {
    variants: {
      variant: {
        default:
          'border border-[rgba(201,169,110,0.3)] text-[#c9a96e] hover:border-[rgba(201,169,110,0.5)] hover:text-[#d4b87d]',
        destructive:
          'border border-[rgba(239,68,68,0.3)] text-[#f87171] hover:border-[rgba(239,68,68,0.5)] hover:text-[#fca5a5]',
        outline:
          'border border-[rgba(255,255,255,0.08)] bg-transparent text-[#a09b8c] hover:border-[rgba(255,255,255,0.15)] hover:text-[#e8e6e1] hover:bg-[rgba(255,255,255,0.03)]',
        secondary:
          'border border-[rgba(255,255,255,0.06)] text-[#a09b8c] hover:text-[#e8e6e1] hover:bg-[rgba(255,255,255,0.04)]',
        ghost:
          'hover:bg-[rgba(255,255,255,0.04)] text-[#a09b8c] hover:text-[#e8e6e1]',
        link: 'text-[#c9a96e] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-11 px-6',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
