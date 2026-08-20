import { Check, Receipt } from "lucide-react";

import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { Card } from "@workspace/divide-ai-ds/components/ui/card";
import { SettlementRow } from "@workspace/divide-ai-ds/components/ui/settlement-row";

// Bar do Zé — subtotal R$ 397,50 + taxa de serviço 10% (R$ 39,75) = R$ 437,25
// 96,58 + 84,32 + 112,45 + 78,90 + 65,00 = 437,25 (fecha no centavo)
const people = [
  { name: "Joaquim", value: "R$ 96,58", paid: false },
  { name: "Estevão", value: "R$ 84,32", paid: false },
  { name: "Artur", value: "R$ 112,45", paid: false },
  { name: "Marina", value: "R$ 78,90", paid: true },
  { name: "Lu", value: "R$ 65,00", paid: false },
];

export default function Resultado() {
  return (
    <div className="min-h-screen bg-background font-['Nunito',sans-serif] text-foreground">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap"
      />
      <div className="flex min-h-screen flex-col px-6 pb-8 pt-14">
        {/* Título — o único texto direto sobre a Névoa */}
        <h1 className="text-[26px] font-bold leading-tight">Cada um paga</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bar do Zé · hoje, 21h40
        </p>

        {/* Linhas de fechamento */}
        <Card className="mt-6 px-4">
          <div className="divide-y divide-border">
            {people.map((p) => (
              <SettlementRow
                key={p.name}
                name={p.name}
                value={p.value}
                paid={p.paid}
              />
            ))}
          </div>
        </Card>

        {/* Total + guardrail do centavo */}
        <Card className="mt-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Receipt className="h-4 w-4" />
              <span className="text-sm">Total da conta</span>
            </div>
            <span className="text-xl font-extrabold tabular-nums">
              R$ 437,25
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Taxa de serviço 10% (R$ 39,75) e couvert já divididos
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-[#2E9E6B]/12 px-3 py-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2E9E6B] text-white">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <p className="text-sm font-bold text-[#2E9E6B]">
              Fecha com o total, no centavo
            </p>
          </div>
        </Card>

        {/* Ação principal na zona do polegar */}
        <div className="mt-auto pt-8">
          <p className="mb-3 text-center text-sm text-muted-foreground">
            Marina já pagou · faltam 4 pessoas
          </p>
          <Button size="lg">Cobrar quem falta</Button>
        </div>
      </div>
    </div>
  );
}
