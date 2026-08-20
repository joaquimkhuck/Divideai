import { Camera, ChevronLeft } from "lucide-react";

import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { EmptyState } from "@workspace/divide-ai-ds/components/ui/empty-state";

export default function EstadoVazio() {
  return (
    <div className="min-h-screen bg-background font-['Nunito',sans-serif] text-foreground">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap"
      />
      <div className="flex min-h-screen flex-col px-6 pb-8 pt-10">
        {/* Chrome do Histórico */}
        <div className="-ml-2 flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Voltar">
            <ChevronLeft />
          </Button>
          <p className="text-sm text-muted-foreground">Início</p>
        </div>
        <h1 className="mt-2 text-[26px] font-bold leading-tight">Seus rolês</h1>

        {/* O vazio como respiro — Névoa generosa, sem ilustração */}
        <div className="flex flex-1 items-center justify-center">
          <EmptyState
            title="Nenhum rolê ainda"
            description="Fotografe a primeira conta e a mesa fecha em segundos."
          />
        </div>

        {/* Ação principal na zona do polegar */}
        <div className="pt-8">
          <Button size="lg">
            <Camera className="h-5 w-5" />
            Fotografar a primeira conta
          </Button>
        </div>
      </div>
    </div>
  );
}
