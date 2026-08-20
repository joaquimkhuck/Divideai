import { Check } from "lucide-react";

import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { Card } from "@workspace/divide-ai-ds/components/ui/card";
import { Input } from "@workspace/divide-ai-ds/components/ui/input";

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

// Aparece apenas DEPOIS da primeira conta dividida (guardrail do PRD).
export default function Entrar() {
  return (
    <div className="min-h-screen bg-background font-['Nunito',sans-serif] text-foreground flex flex-col">
      <NunitoFont />

      <header className="px-6 pt-14">
        {/* Selo calmo: a conta já fechou, isto é opcional */}
        <div className="inline-flex items-center gap-2 rounded-full bg-[#2E9E6B]/12 px-4 py-1.5">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2E9E6B] text-white">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <span className="text-sm font-bold text-[#2E9E6B]">
            Conta do Bar do Zé fechada
          </span>
        </div>

        <h1 className="mt-6 text-[26px] font-bold leading-tight">
          Quer guardar esse rolê?
        </h1>
      </header>

      <main className="flex-1 px-6 pt-6">
        <Card className="p-4">
          <p className="text-[17px] leading-relaxed">
            Com uma conta, seus rolês e cobranças ficam guardados — dá para ver
            quem ainda deve, mesmo depois que todo mundo foi embora.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="nome"
                className="text-xs uppercase tracking-[0.06em] text-muted-foreground"
              >
                Seu nome
              </label>
              <Input
                id="nome"
                className="mt-2 border-border"
                placeholder="Como os amigos te chamam"
                defaultValue="Artur"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-xs uppercase tracking-[0.06em] text-muted-foreground"
              >
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                className="mt-2 border-border"
                placeholder="voce@email.com"
              />
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Sem senha por enquanto: enviamos um link de acesso para o seu
            e-mail.
          </p>
        </Card>
      </main>

      {/* Zona do polegar */}
      <footer className="space-y-3 px-6 pb-10 pt-6">
        <Button size="lg">Guardar meus rolês</Button>
        <Button variant="ghost" size="lg" className="text-muted-foreground">
          Agora não
        </Button>
      </footer>
    </div>
  );
}
