import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent gradient-primary text-primary-foreground hover:scale-105 glow-primary",
        secondary: "border-transparent gradient-secondary text-secondary-foreground hover:scale-105 glow-secondary",
        accent: "border-transparent gradient-accent text-accent-foreground hover:scale-105 glow-accent",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:scale-105",
        outline: "text-foreground border-primary/30 hover:border-primary/60 hover:bg-primary/10 hover:scale-105",
        success: "border-transparent bg-success text-success-foreground hover:scale-105",
        warning: "border-transparent bg-warning text-warning-foreground hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
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
