import { useState } from "react";
import { Check, ChevronLeft } from "lucide-react";

import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { Card } from "@workspace/divide-ai-ds/components/ui/card";
import { cn } from "@workspace/divide-ai-ds/lib/utils";

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

const PACOTES = [
  { contas: 5, preco: "R$ 5,00", porConta: "R$ 1,00 por conta" },
  { contas: 15, preco: "R$ 13,50", porConta: "R$ 0,90 por conta" },
  { contas: 40, preco: "R$ 32,00", porConta: "R$ 0,80 por conta" },
];

export default function Creditos() {
  const [escolhido, setEscolhido] = useState(1);

  return (
    <div className="min-h-screen bg-background font-['Nunito',sans-serif] text-foreground flex flex-col">
      <NunitoFont />

      <header className="px-6 pt-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Voltar"
            className="-ml-3 h-11 w-11"
          >
            <ChevronLeft />
          </Button>
          <h1 className="text-[26px] font-bold leading-tight">Créditos</h1>
        </div>
      </header>

      <main className="flex-1 space-y-4 px-6 pt-4">
        {/* Saldo como número-herói */}
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.06em] text-muted-foreground">
            Seu saldo
          </p>
          <p className="mt-2 text-[44px] font-extrabold leading-none tabular-nums">
            3 contas
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            restantes para analisar. Cada foto de conta lida usa 1 crédito —
            cerca de R$ 1,00 por conta depois das gratuitas.
          </p>
        </Card>

        {/* Pacotes */}
        <div className="space-y-3">
          {PACOTES.map((p, i) => {
            const ativo = i === escolhido;
            return (
              <button
                key={p.contas}
                type="button"
                onClick={() => setEscolhido(i)}
                aria-pressed={ativo}
                className={cn(
                  "flex w-full items-center justify-between rounded-3xl bg-card p-4 text-left shadow-[0_2px_8px_rgba(31,35,40,0.06)] transition-colors",
                  ativo ? "border-2 border-primary" : "border border-border"
                )}
              >
                <div>
                  <p className="text-[17px] font-bold">{p.contas} contas</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {p.porConta}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xl font-extrabold tabular-nums">
                    {p.preco}
                  </p>
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full",
                      ativo
                        ? "bg-primary text-primary-foreground"
                        : "border border-border"
                    )}
                  >
                    {ativo && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <p className="px-2 text-center text-sm text-muted-foreground">
          Os créditos não vencem. Você usa quando o rolê acontecer.
        </p>
      </main>

      {/* Zona do polegar */}
      <footer className="px-6 pb-10 pt-6">
        <Button size="lg">
          Comprar {PACOTES[escolhido].contas} contas · {PACOTES[escolhido].preco}
        </Button>
      </footer>
    </div>
  );
}
