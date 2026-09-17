import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Check, ChevronLeft } from "lucide-react";
import { useAuth } from "@clerk/react";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { Card } from "@workspace/divide-ai-ds/components/ui/card";
import { cn } from "@workspace/divide-ai-ds/lib/utils";
import {
  useGetAccount,
  getGetAccountQueryKey,
  useGetCreditPackages,
  getGetCreditPackagesQueryKey,
  useCreateCreditsCheckoutSession,
} from "@workspace/api-client-react";
import { PhoneShell } from "@/components/phone-shell";
import { useToast } from "@/hooks/use-toast";
import { formatCents } from "@/lib/money";

export default function Creditos() {
  const [, setLocation] = useLocation();
  const { isLoaded, isSignedIn } = useAuth();
  const { toast } = useToast();
  const [escolhido, setEscolhido] = useState(1);

  // Créditos são da conta — sem conta, primeiro a tela de entrar.
  useEffect(() => {
    if (isLoaded && !isSignedIn) setLocation("/entrar", { replace: true });
  }, [isLoaded, isSignedIn, setLocation]);

  const { data: account, isLoading } = useGetAccount({
    query: {
      queryKey: getGetAccountQueryKey(),
      enabled: Boolean(isLoaded && isSignedIn),
    },
  });

  const { data: packagesData } = useGetCreditPackages({
    query: {
      queryKey: getGetCreditPackagesQueryKey(),
      enabled: Boolean(isLoaded && isSignedIn),
    },
  });

  const checkout = useCreateCreditsCheckoutSession();

  const pacotes = packagesData?.packages ?? [];
  const escolhidoIndex = Math.min(escolhido, Math.max(pacotes.length - 1, 0));
  const pacoteEscolhido = pacotes[escolhidoIndex];

  const saldo = account?.creditBalance ?? 0;

  const comprar = () => {
    if (!pacoteEscolhido) return;
    checkout.mutate(
      { data: { packageId: pacoteEscolhido.id } },
      {
        onSuccess: ({ url }) => window.location.assign(url),
        onError: () =>
          toast({
            title: "Não consegui abrir o pagamento",
            description: "Confira se o Stripe está configurado em modo teste.",
            variant: "destructive",
          }),
      },
    );
  };

  return (
    <PhoneShell>
      <header className="px-6 pt-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Voltar"
            className="-ml-3 h-11 w-11"
            data-testid="button-voltar"
            onClick={() => history.back()}
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
          <p
            className="mt-2 text-[44px] font-extrabold leading-none tabular-nums"
            data-testid="text-saldo"
          >
            {isLoading
              ? "…"
              : `${saldo} ${saldo === 1 ? "conta" : "contas"}`}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            restantes para analisar. Cada foto de conta lida usa 1 crédito —
            cerca de R$ 1,00 por conta depois das gratuitas.
          </p>
        </Card>

        {/* Pacotes */}
        <div className="space-y-3">
          {pacotes.map((p, i) => {
            const ativo = i === escolhidoIndex;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setEscolhido(i)}
                aria-pressed={ativo}
                data-testid={`button-pacote-${p.credits}`}
                className={cn(
                  "flex w-full items-center justify-between rounded-3xl bg-card p-4 text-left shadow-[0_2px_8px_rgba(31,35,40,0.06)] transition-colors",
                  ativo ? "border-2 border-primary" : "border border-border"
                )}
              >
                <div>
                  <p className="text-[17px] font-bold">{p.credits} contas</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {formatCents(Math.round(p.amountCents / p.credits))} por conta
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xl font-extrabold tabular-nums">
                    {formatCents(p.amountCents)}
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
        <Button
          size="lg"
          data-testid="button-comprar"
          disabled={!pacoteEscolhido || checkout.isPending}
          onClick={comprar}
        >
          {checkout.isPending
            ? "Abrindo pagamento..."
            : pacoteEscolhido
              ? `Comprar ${pacoteEscolhido.credits} contas · ${formatCents(pacoteEscolhido.amountCents)}`
              : "Comprar"}
        </Button>
      </footer>
    </PhoneShell>
  );
}
