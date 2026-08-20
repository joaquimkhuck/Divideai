import * as React from "react"

import { cn } from "../../lib/utils"
import { Button } from "./button"

// Divide Aí — DESIGN.md §7 Estado vazio:
// sem ilustração na v1 — título Bold 26 + uma frase Regular 17 + botão primário.
export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, title, description, actionLabel, onAction, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center gap-2 px-6 py-12 text-center",
        className
      )}
      {...props}
    >
      <h2 className="text-[26px] font-bold text-foreground">{title}</h2>
      <p className="max-w-xs text-[17px] text-muted-foreground">{description}</p>
      {actionLabel && (
        <Button size="lg" className="mt-6 max-w-xs" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
