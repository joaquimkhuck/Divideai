import { ImageOff, Sun, Maximize2, Hand, Keyboard } from "lucide-react";

import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { Card } from "@workspace/divide-ai-ds/components/ui/card";

const checks = [
  { icon: Sun, text: "Boa luz — evite sombra sobre o papel" },
  { icon: Maximize2, text: "A conta inteira dentro da foto" },
  { icon: Hand, text: "Sem dedo ou copo na frente" },
];

export default function ErroLeitura() {
  return (
    <div className="min-h-screen bg-background font-['Nunito',sans-serif] text-foreground">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap"
      />
      <div className="flex min-h-screen flex-col px-6 pb-8 pt-14">
        <h1 className="text-[26px] font-bold leading-tight">
          Não consegui ler essa foto
        </h1>

        {/* Miniatura com anel Telha — o único momento do Telha */}
        <div className="mt-8 flex justify-center">
          <div className="flex flex-col items-center">
            <div
              className="flex items-center justify-center rounded-2xl bg-card shadow-[0_2px_8px_rgba(31,35,40,0.06)]"
              style={{ width: 128, height: 160, border: "2px solid #C4472F" }}
            >
              <ImageOff className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <span
              className="-mt-3 whitespace-nowrap rounded-full px-3 py-1 text-xs uppercase tracking-[0.06em] text-white"
              style={{ backgroundColor: "#C4472F" }}
            >
              Sem leitura
            </span>
          </div>
        </div>

        {/* O que conferir — prático, sem alarme */}
        <Card className="mt-10 p-4">
          <p className="text-xs uppercase tracking-[0.06em] text-muted-foreground">
            Vale conferir
          </p>
          <div className="mt-3 flex flex-col gap-3">
            {checks.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </span>
                <p className="text-[17px]">{text}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Crédito preservado — dito baixinho */}
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Nenhum crédito foi usado — só leituras que funcionam contam.
        </p>

        {/* Ações na zona do polegar */}
        <div className="mt-auto flex flex-col gap-3 pt-8">
          <Button size="lg">Tentar outra foto</Button>
          <Button variant="secondary" size="lg">
            <Keyboard className="h-5 w-5" />
            Digitar itens na mão
          </Button>
        </div>
      </div>
    </div>
  );
}
