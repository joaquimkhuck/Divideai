import * as React from "react"

import { cn } from "../../lib/utils"

// Divide Aí — DESIGN.md §7 Campo de revisão:
// raio 16, fundo Papel, borda Linha-clara; em foco, borda Azul-profundo 2pt;
// erro (aria-invalid) marca a borda em Telha.
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl border border-input bg-card px-4 py-2 text-[17px] text-foreground transition-colors file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-2 focus-visible:border-primary aria-[invalid=true]:border-2 aria-[invalid=true]:border-destructive disabled:cursor-not-allowed disabled:bg-secondary disabled:text-muted-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
