import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

// Divide Aí — DESIGN.md §6/§2/§3:
// Etiquetas de status são cápsulas; rótulo mínimo 12 Regular, CAIXA ALTA, +6% de espaçamento.
// paid = Verde-salva (só o ato de confirmar), pending = Âmbar-fosco (o que falta decidir),
// error = Telha (falha de sistema, nunca "dívida").
const badgeVariants = cva(
  "whitespace-nowrap inline-flex items-center rounded-full px-3 py-1 text-xs uppercase tracking-[0.06em] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        paid: "bg-[#2E9E6B]/12 text-[#2E9E6B] dark:bg-[#43B383]/15 dark:text-[#43B383]",
        pending: "bg-[#C98A2D]/12 text-[#C98A2D] dark:bg-[#D9A050]/15 dark:text-[#D9A050]",
        error: "bg-destructive/10 text-destructive",
        outline: "border border-border bg-card text-muted-foreground",
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
