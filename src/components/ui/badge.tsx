import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200 border',
  {
    variants: {
      variant: {
        default: 'bg-[rgba(255,255,255,0.06)] text-[#a09b8c] border-[rgba(255,255,255,0.08)]',
        secondary: 'bg-[rgba(255,255,255,0.04)] text-[#a09b8c] border-[rgba(255,255,255,0.06)]',
        destructive: 'bg-[rgba(239,68,68,0.1)] text-[#f87171] border-[rgba(239,68,68,0.15)]',
        success: 'bg-[rgba(34,197,94,0.1)] text-[#4ade80] border-[rgba(34,197,94,0.15)]',
        warning: 'bg-[rgba(217,119,6,0.1)] text-[#f0a830] border-[rgba(217,119,6,0.15)]',
        info: 'bg-[rgba(59,130,246,0.1)] text-[#6ba3f5] border-[rgba(59,130,246,0.15)]',
        pink: 'bg-[rgba(236,72,153,0.1)] text-[#f472b6] border-[rgba(236,72,153,0.15)]',
        purple: 'bg-[rgba(168,85,247,0.1)] text-[#c084fc] border-[rgba(168,85,247,0.15)]',
        teal: 'bg-[rgba(20,184,166,0.1)] text-[#2dd4bf] border-[rgba(20,184,166,0.15)]',
        outline: 'bg-transparent text-[#a09b8c] border-[rgba(255,255,255,0.1)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
