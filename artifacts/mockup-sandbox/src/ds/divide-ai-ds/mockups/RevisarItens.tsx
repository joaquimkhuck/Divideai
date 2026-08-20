import { ChevronLeft } from "lucide-react";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { Card } from "@workspace/divide-ai-ds/components/ui/card";
import { Input } from "@workspace/divide-ai-ds/components/ui/input";
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

interface Item {
  descricao: string;
  qtd: string;
  valor: string; // formatted "89,90"
  erro?: string;
}

const ITENS: Item[] = [
  { descricao: "Picanha ao ponto", qtd: "1", valor: "89,90" },
  { descricao: "Chopp Pilsen 500ml", qtd: "4", valor: "59,60" },
  {
    descricao: "Batata rústica",
    qtd: "1",
    valor: "32,00",
    erro: "A foto ficou borrada nesta linha — confira se o valor é R$ 32,00 mesmo.",
  },
  { descricao: "Moqueca de camarão", qtd: "1", valor: "76,00" },
  { descricao: "Couvert artístico", qtd: "5", valor: "40,00" },
];

function LinhaItem({ item }: { item: Item }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          defaultValue={item.descricao}
          aria-label="Descrição do item"
          aria-invalid={item.erro ? true : undefined}
          className="h-11 min-w-0 flex-1 text-[15px]"
        />
        <Input
          defaultValue={item.qtd}
          aria-label="Quantidade"
          inputMode="numeric"
          className="h-11 w-12 shrink-0 px-0 text-center text-[15px] tabular-nums"
        />
        <Input
          defaultValue={item.valor}
          aria-label="Valor"
          inputMode="decimal"
          aria-invalid={item.erro ? true : undefined}
          className={cn(
            "h-11 w-[88px] shrink-0 px-3 text-right text-[15px] font-extrabold tabular-nums"
          )}
        />
      </div>
      {item.erro && (
        <p className="px-1 text-sm text-destructive">{item.erro}</p>
      )}
    </div>
  );
}

export default function RevisarItens() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      <NunitoFont />

      <header className="flex items-center gap-2 px-6 pt-6 pb-4">
        <Button variant="ghost" size="icon" aria-label="Voltar" className="-ml-3 h-11 w-11">
          <ChevronLeft />
        </Button>
        <h1 className="text-[26px] font-bold leading-tight">Confira a conta</h1>
      </header>

      <main className="flex-1 space-y-4 px-6 pb-4">
        {/* Bill photo + items live in the same card */}
        <Card className="overflow-hidden">
          <div className="relative m-4 mb-0 h-28 overflow-hidden rounded-2xl bg-secondary">
            {/* stylized bill photo placeholder */}
            <div className="flex h-full flex-col justify-center gap-2 bg-[#EDEBE6] px-6">
              <div className="h-1.5 w-1/2 rounded-full bg-border" />
              <div className="h-1.5 w-4/5 rounded-full bg-border" />
              <div className="h-1.5 w-2/3 rounded-full bg-border" />
              <div className="h-1.5 w-3/4 rounded-full bg-border" />
            </div>
            <span className="absolute right-3 top-3 rounded-full bg-card px-3 py-1 text-xs uppercase tracking-[0.06em] text-muted-foreground shadow-[0_2px_8px_rgba(31,35,40,0.06)]">
              Foto da conta
            </span>
          </div>

          <div className="space-y-4 p-4">
            <div className="flex items-center gap-2 px-1 text-xs uppercase tracking-[0.06em] text-muted-foreground">
              <span className="min-w-0 flex-1">Item</span>
              <span className="w-12 shrink-0 text-center">Qtd</span>
              <span className="w-[88px] shrink-0 text-right">Valor</span>
            </div>
            {ITENS.map((item) => (
              <LinhaItem key={item.descricao} item={item} />
            ))}
          </div>
        </Card>

        {/* Extras + running total */}
        <Card className="space-y-3 p-4">
          <div className="flex items-baseline justify-between">
            <p className="text-[17px]">Taxa de serviço 10%</p>
            <p className="text-xl font-extrabold tabular-nums">R$ 29,75</p>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-sm text-muted-foreground">
              Couvert artístico já incluído nos itens
            </p>
          </div>
          <div className="h-px w-full bg-border" />
          <div className="flex items-baseline justify-between">
            <p className="text-[17px] font-bold">Total da mesa</p>
            <p className="text-[28px] font-extrabold tabular-nums leading-none">
              R$ 327,25
            </p>
          </div>
        </Card>
      </main>

      <footer className="px-6 pb-8 pt-2">
        <Button size="lg">Está tudo certo</Button>
      </footer>
    </div>
  );
}
