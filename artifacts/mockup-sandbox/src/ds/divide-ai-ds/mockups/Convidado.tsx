import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@workspace/divide-ai-ds/lib/utils";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { Card } from "@workspace/divide-ai-ds/components/ui/card";
import { Avatar, AvatarFallback } from "@workspace/divide-ai-ds/components/ui/avatar";

function NunitoFont() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap"
      />
    </>
  );
}

interface Item {
  descricao: string;
  valor: number; // em centavos
  divididoPor: number;
}

const ITENS: Item[] = [
  { descricao: "Picanha ao ponto", valor: 8990, divididoPor: 3 },
  { descricao: "Moqueca de camarão", valor: 7600, divididoPor: 2 },
  { descricao: "Chopp Pilsen 500ml x4", valor: 5960, divididoPor: 2 },
  { descricao: "Batata rústica", valor: 3200, divididoPor: 1 },
  { descricao: "Caipirinha de limão", valor: 2490, divididoPor: 1 },
  { descricao: "Couvert artístico x5", valor: 4000, divididoPor: 5 },
];

const brl = (cents: number) =>
  "R$ " +
  (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function Convidado() {
  const [meus, setMeus] = useState<string[]>([
    "Moqueca de camarão",
    "Couvert artístico x5",
  ]);

  const toggle = (d: string) =>
    setMeus((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]));

  const total = ITENS.filter((i) => meus.includes(i.descricao)).reduce(
    (s, i) => s + Math.round(i.valor / i.divididoPor),
    0
  );

  return (
    <div className="min-h-screen bg-background font-['Nunito',sans-serif] text-foreground flex flex-col">
      <NunitoFont />

      <header className="px-6 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-secondary text-sm font-bold text-foreground">
              M
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-[26px] font-bold leading-tight">
              Marina, marque o que você comeu
            </h1>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Bar do Zé · convidada por Joaquim · sem login, prometido
        </p>
      </header>

      <main className="flex-1 space-y-4 overflow-y-auto px-6 pb-40">
        {ITENS.map((item) => {
          const marcado = meus.includes(item.descricao);
          return (
            <Card
              key={item.descricao}
              role="button"
              tabIndex={0}
              aria-pressed={marcado}
              onClick={() => toggle(item.descricao)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(item.descricao);
                }
              }}
              className={cn(
                "cursor-pointer select-none p-4 transition-colors",
                marcado && "border-2 border-primary"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors",
                    marcado
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card"
                  )}
                  aria-hidden="true"
                >
                  {marcado && <Check className="h-4 w-4" strokeWidth={3} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[17px]">{item.descricao}</p>
                  {item.divididoPor > 1 && (
                    <p className="text-sm text-muted-foreground">
                      Dividido por {item.divididoPor} · sua parte{" "}
                      {brl(Math.round(item.valor / item.divididoPor))}
                    </p>
                  )}
                </div>
                <span className="text-xl font-extrabold tabular-nums">
                  {brl(item.valor)}
                </span>
              </div>
            </Card>
          );
        })}
      </main>

      {/* Live share total — anchored sheet in the thumb zone */}
      <footer className="fixed inset-x-0 bottom-0 rounded-t-[28px] bg-card px-6 pb-8 pt-5 shadow-[0_-4px_24px_rgba(31,35,40,0.12)]">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.06em] text-muted-foreground">
              Sua parte
            </p>
            <p className="mt-1 text-[44px] font-extrabold leading-none tabular-nums">
              {brl(total)}
            </p>
          </div>
          <p className="pb-1 text-sm text-muted-foreground">
            {meus.length} {meus.length === 1 ? "item" : "itens"}
          </p>
        </div>
        <Button size="lg" className="mt-4" disabled={meus.length === 0}>
          Confirmar minha parte
        </Button>
      </footer>
    </div>
  );
}
