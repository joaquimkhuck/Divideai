import { ChevronLeft, Copy, LogOut, Trash2 } from "lucide-react";

import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { Card } from "@workspace/divide-ai-ds/components/ui/card";

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

export default function Perfil() {
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
          <h1 className="text-[26px] font-bold leading-tight">Perfil</h1>
        </div>
      </header>

      <main className="flex-1 space-y-4 px-6 pt-4 pb-6">
        {/* Identidade */}
        <Card className="flex items-center gap-4 p-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary text-xl font-bold">
            A
          </span>
          <div className="min-w-0">
            <p className="text-[17px] font-bold">Artur Bresser</p>
            <p className="truncate text-sm text-muted-foreground">
              artur.bresser@email.com
            </p>
          </div>
        </Card>

        {/* Chave Pix */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.06em] text-muted-foreground">
              Sua chave Pix
            </p>
            <button type="button" className="text-sm font-bold text-primary">
              Editar
            </button>
          </div>
          <button
            type="button"
            className="mt-2 flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left active:bg-secondary"
          >
            <span className="min-w-0 truncate text-[17px]">
              artur.bresser@pix.com.br
            </span>
            <span className="flex items-center gap-1 text-sm font-bold text-muted-foreground">
              <Copy className="h-4 w-4" />
              Copiar
            </span>
          </button>
          <p className="mt-2 text-sm text-muted-foreground">
            É ela que vai nas cobranças do WhatsApp.
          </p>
        </Card>

        {/* Estatísticas quietas */}
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.06em] text-muted-foreground">
            Seus rolês
          </p>
          <div className="mt-3 space-y-3">
            <div className="flex items-baseline justify-between">
              <p className="text-[17px]">Contas divididas</p>
              <p className="text-xl font-extrabold tabular-nums">12</p>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-baseline justify-between">
              <p className="text-[17px]">Total dividido</p>
              <p className="text-xl font-extrabold tabular-nums">
                R$ 3.184,60
              </p>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-baseline justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[17px]">Ainda te devem</p>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  Joaquim, Estevão e Lu · Bar do Zé
                </p>
              </div>
              <p className="shrink-0 text-xl font-extrabold tabular-nums">
                R$ 245,90
              </p>
            </div>
          </div>
        </Card>

        {/* Conta e dados */}
        <Card className="p-2">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-[17px] font-bold active:bg-secondary"
          >
            <LogOut className="h-5 w-5 text-muted-foreground" />
            Sair da conta
          </button>
          <div className="mx-3 h-px bg-border" />
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left active:bg-secondary"
          >
            <Trash2 className="h-5 w-5 shrink-0 text-muted-foreground" />
            <span>
              <span className="block text-[17px] font-bold">
                Apagar meus dados
              </span>
              <span className="block text-sm text-muted-foreground">
                Remove seus rolês e cobranças, quando quiser
              </span>
            </span>
          </button>
        </Card>
      </main>
    </div>
  );
}
