import * as React from "react"

import { cn } from "../../lib/utils"
import { Card } from "./card"
import { Badge } from "./badge"
import { PersonChip } from "./person-chip"

// Divide Aí — DESIGN.md §7 Cartão de item:
// Papel, raio 24. Linha única: descrição Regular 17 à esquerda, valor ExtraBold 20 à
// direita (Grafite, tabular, sempre com centavos). Abaixo, chips das pessoas atribuídas.
// Item sem dono ganha etiqueta Âmbar "SEM DONO".
export interface ItemCardPerson {
  name: string
  selected?: boolean
}

export interface ItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  description: string
  /** Valor já formatado, sempre com centavos — ex.: "R$ 30,00" */
  value: string
  people?: ItemCardPerson[]
  unassignedLabel?: string
  onTogglePerson?: (name: string) => void
}

const ItemCard = React.forwardRef<HTMLDivElement, ItemCardProps>(
  (
    {
      className,
      description,
      value,
      people = [],
      unassignedLabel = "SEM DONO",
      onTogglePerson,
      ...props
    },
    ref
  ) => {
    const hasOwner = people.some((p) => p.selected)
    return (
      <Card ref={ref} className={cn("p-4", className)} {...props}>
        <div className="flex items-baseline justify-between gap-4">
          <p className="min-w-0 truncate text-[17px] text-foreground">
            {description}
          </p>
          <p className="shrink-0 text-xl font-extrabold tabular-nums text-foreground">
            {value}
          </p>
        </div>
        {(people.length > 0 || !hasOwner) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {people.map((person) => (
              <PersonChip
                key={person.name}
                name={person.name}
                selected={person.selected}
                onClick={
                  onTogglePerson ? () => onTogglePerson(person.name) : undefined
                }
              />
            ))}
            {!hasOwner && <Badge variant="pending">{unassignedLabel}</Badge>}
          </div>
        )}
      </Card>
    )
  }
)
ItemCard.displayName = "ItemCard"

export { ItemCard }
