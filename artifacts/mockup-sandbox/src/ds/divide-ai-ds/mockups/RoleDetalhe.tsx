import { ChevronLeft, Receipt } from "lucide-react";

import { Badge } from "@workspace/divide-ai-ds/components/ui/badge";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { Card } from "@workspace/divide-ai-ds/components/ui/card";
import { SettlementRow } from "@workspace/divide-ai-ds/components/ui/settlement-row";

// Bar do Zé — 96,58 + 84,32 + 112,45 + 78,90 + 65,00 = 437,25
const people = [
  { name: "Joaquim", value: "R$ 96,58", paid: true },
  { name: "Estevão", value: "R$ 84,32", paid: false },
  { name: "Artur", value: "R$ 112,45", paid: true },
  { name: "Marina", value: "R$ 78,90", paid: true },
  { name: "Lu", value: "R$ 65,00", paid: true },
];

const items = [
  { desc: "Picanha na chapa", value: "R$ 129,90" },
  { desc: "Porção de fritas com queijo", value: "R$ 42,00" },
  { desc: "Chopp claro (8 un.)", value: "R$ 96,00" },
  { desc: "Caipirinha de limão (3 un.)", value: "R$ 66,00" },
  { desc: "Pastel de carne (6 un.)", value: "R$ 36,60" },
  { desc: "Água com gás (3 un.)", value: "R$ 27,00" },
];

export default function RoleDetalhe() {
  return (
    <div className="min-h-screen bg-background font-['Nunito',sans-serif] text-foreground">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap"
      />
      <div className="flex min-h-screen flex-col px-6 pb-8 pt-10">
        {/* Voltar + título */}
        <div className="flex items-center gap-1 -ml-2">
          <Button variant="ghost" size="icon" aria-label="Voltar">
            <ChevronLeft />
          </Button>
          <p className="text-sm text-muted-foreground">Rolês anteriores</p>
        </div>
        <h1 className="mt-2 text-[26px] font-bold leading-tight">
          Bar do Zé · 14/08
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          5 pessoas · falta só o Estevão
        </p>

        {/* Recibo calmo: total + linhas de fechamento */}
        <Card className="mt-6 px-4">
          <div className="flex items-center justify-between border-b border-border py-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Receipt className="h-4 w-4" />
              <span className="text-sm">Total da conta</span>
            </div>
            <span className="text-xl font-extrabold tabular-nums">
              R$ 437,25
            </span>
          </div>
          <div className="divide-y divide-border">
            {people.map((p) =>
              p.paid ? (
                <SettlementRow
                  key={p.name}
                  name={p.name}
                  value={p.value}
                  paid
                />
              ) : (
                <div key={p.name} className="flex items-center gap-3 py-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-bold">
                    {p.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[17px] font-bold">{p.name}</p>
                    <Badge variant="pending" className="mt-1">
                      Pendente
                    </Badge>
                  </div>
                  <p className="shrink-0 text-xl font-extrabold tabular-nums">
                    {p.value}
                  </p>
                </div>
              )
            )}
          </div>
        </Card>

        {/* Itens da conta — colapsados, quietos */}
        <Card className="mt-4 p-4">
          <p className="text-xs uppercase tracking-[0.06em] text-muted-foreground">
            Itens da conta
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {items.map((it) => (
              <div
                key={it.desc}
                className="flex items-baseline justify-between gap-4"
              >
                <p className="min-w-0 truncate text-sm text-muted-foreground">
                  {it.desc}
                </p>
                <p className="shrink-0 text-sm font-extrabold tabular-nums text-muted-foreground">
                  {it.value}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground">
            Taxa de serviço 10% (R$ 39,75) já dividida
          </p>
        </Card>

        {/* Ação principal na zona do polegar */}
        <div className="mt-auto pt-8">
          <p className="mb-3 text-center text-sm text-muted-foreground">
            Estevão ainda deve R$ 84,32
          </p>
          <Button size="lg">Cobrar de novo</Button>
        </div>
      </div>
    </div>
  );
}
