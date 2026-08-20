import { Check, Copy, Receipt } from "lucide-react";

import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { Card } from "@workspace/divide-ai-ds/components/ui/card";
import { SettlementRow } from "@workspace/divide-ai-ds/components/ui/settlement-row";

// Mesmo fechamento do Bar do Zé (total R$ 437,25); Joaquim sendo cobrado.
const people = [
  { name: "Joaquim", value: "R$ 96,58", paid: false },
  { name: "Estevão", value: "R$ 84,32", paid: false },
  { name: "Artur", value: "R$ 112,45", paid: false },
  { name: "Marina", value: "R$ 78,90", paid: true },
  { name: "Lu", value: "R$ 65,00", paid: false },
];

export default function Cobranca() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-['Nunito',sans-serif] text-foreground">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap"
      />

      {/* Tela de resultado ao fundo */}
      <div className="flex min-h-screen flex-col px-6 pb-8 pt-14" aria-hidden>
        <h1 className="text-[26px] font-bold leading-tight">Cada um paga</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bar do Zé · hoje, 21h40
        </p>
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
        </Card>
      </div>

      {/* Fundo escurecido 40% */}
      <div className="absolute inset-0 z-10 bg-black/40" />

      {/* Folha de cobrança */}
      <div className="absolute inset-x-0 bottom-0 z-20 rounded-t-[28px] bg-card shadow-[0_-8px_24px_rgba(31,35,40,0.12)]">
        <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-border" />
        <div className="px-6 pb-8 pt-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-bold">
              J
            </span>
            <p className="text-[17px] font-bold">Joaquim</p>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">Parte dele</p>
          <p className="mt-1 text-[44px] font-extrabold leading-none tabular-nums">
            R$ 96,58
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Bar do Zé · taxa de serviço incluída
          </p>

          {/* Chave Pix copiável */}
          <p className="mt-6 text-xs uppercase tracking-[0.06em] text-muted-foreground">
            Sua chave Pix
          </p>
          <button
            type="button"
            className="mt-2 flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left active:bg-secondary"
          >
            <span className="min-w-0 truncate text-[17px]">
              artur.bresser@pix.com.br
            </span>
            <span className="flex items-center gap-1 text-sm font-bold text-primary">
              <Copy className="h-4 w-4" />
              Copiar
            </span>
          </button>

          <div className="mt-8 flex flex-col gap-3">
            <Button size="lg">Cobrar no WhatsApp</Button>
            <Button variant="secondary" size="lg">
              <Check className="h-4 w-4" />
              Ele já pagou
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
