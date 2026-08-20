import * as React from "react"

import { cn } from "../../lib/utils"
import { Avatar, AvatarFallback } from "./avatar"

// Divide Aí — DESIGN.md §7 Chip de pessoa:
// cápsula de 36pt: avatar circular com inicial + primeiro nome em Bold 14.
// Selecionado: fundo Azul-profundo, texto branco. Não selecionado: Papel + borda Linha-clara.
// Avatares são sempre círculos com a inicial sobre fundo neutro (sem foto na v1).
export interface PersonChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string
  selected?: boolean
}

const PersonChip = React.forwardRef<HTMLButtonElement, PersonChipProps>(
  ({ className, name, selected = false, ...props }, ref) => {
    const firstName = name.trim().split(/\s+/)[0] ?? ""
    const initial = firstName.charAt(0).toUpperCase()
    return (
      <button
        type="button"
        ref={ref}
        aria-pressed={selected}
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-full pl-1 pr-3.5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
          selected
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-card text-foreground active:bg-secondary",
          className
        )}
        {...props}
      >
        <Avatar className="h-7 w-7">
          <AvatarFallback
            className={cn(
              "text-xs font-bold",
              selected
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-secondary text-foreground"
            )}
          >
            {initial}
          </AvatarFallback>
        </Avatar>
        {firstName}
      </button>
    )
  }
)
PersonChip.displayName = "PersonChip"

export { PersonChip }
