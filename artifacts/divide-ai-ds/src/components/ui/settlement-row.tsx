import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "../../lib/utils"
import { Avatar, AvatarFallback } from "./avatar"

// Divide Aí — DESIGN.md §7 Linha de fechamento:
// nome (Bold 17) à esquerda, valor (ExtraBold 20, Grafite, tabular) à direita —
// par inseparável, nunca linha pontilhada. Pagamento confirmado: selo circular
// Verde-salva com ✓ à direita do valor e linha inteira a 60% de opacidade.
export interface SettlementRowProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  /** Valor já formatado, sempre com centavos — ex.: "R$ 43,75" */
  value: string
  paid?: boolean
}

const SettlementRow = React.forwardRef<HTMLDivElement, SettlementRowProps>(
  ({ className, name, value, paid = false, ...props }, ref) => {
    const initial = name.trim().charAt(0).toUpperCase()
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-3 py-4 transition-opacity",
          paid && "opacity-60",
          className
        )}
        {...props}
      >
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-secondary text-sm font-bold text-foreground">
            {initial}
          </AvatarFallback>
        </Avatar>
        <p className="min-w-0 flex-1 truncate text-[17px] font-bold text-foreground">
          {name}
        </p>
        <p className="shrink-0 text-xl font-extrabold tabular-nums text-foreground">
          {value}
        </p>
        {paid && (
          <span
            aria-label="Pagamento confirmado"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2E9E6B] text-white dark:bg-[#43B383]"
          >
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
        )}
      </div>
    )
  }
)
SettlementRow.displayName = "SettlementRow"

export { SettlementRow }
