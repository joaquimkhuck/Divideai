import { useEffect } from "react";
import { useLocation } from "wouter";
import { Check } from "lucide-react";
import { useAuth } from "@clerk/react";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { Card } from "@workspace/divide-ai-ds/components/ui/card";
import { PhoneShell } from "@/components/phone-shell";

export const ENTRAR_DISMISSED_KEY = "divideai_entrar_dismissed";

// Aparece apenas DEPOIS da primeira conta dividida (guardrail do PRD).
export default function Entrar() {
  const [, setLocation] = useLocation();
  const { isLoaded, isSignedIn } = useAuth();

  const navState = (window.history.state?.state ?? {}) as {
    restaurantName?: string | null;
    from?: string;
  };
  const backTo = navState.from ?? "/";

  // Já entrou? Esta tela não tem mais função.
  useEffect(() => {
    if (isLoaded && isSignedIn) setLocation("/perfil", { replace: true });
  }, [isLoaded, isSignedIn, setLocation]);

  const dismiss = () => {
    localStorage.setItem(ENTRAR_DISMISSED_KEY, "1");
    setLocation(backTo);
  };

  return (
    <PhoneShell>
      <header className="px-6 pt-14">
        {/* Selo calmo: a conta já fechou, isto é opcional */}
        <div className="inline-flex items-center gap-2 rounded-full bg-[#2E9E6B]/12 px-4 py-1.5">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2E9E6B] text-white">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <span className="text-sm font-bold text-[#2E9E6B]" data-testid="text-entrar-badge">
            {navState.restaurantName
              ? `Conta do ${navState.restaurantName} fechada`
              : "Sua conta fechada"}
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
          <p className="mt-4 text-sm text-muted-foreground">
            Os rolês que você já dividiu neste aparelho vêm junto,
            automaticamente.
          </p>
        </Card>
      </main>

      {/* Zona do polegar */}
      <footer className="space-y-3 px-6 pb-10 pt-6">
        <Button
          size="lg"
          data-testid="button-criar-conta"
          onClick={() => setLocation("/sign-up")}
        >
          Guardar meus rolês
        </Button>
        <Button
          variant="secondary"
          size="lg"
          data-testid="button-ja-tenho-conta"
          onClick={() => setLocation("/sign-in")}
        >
          Já tenho conta
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="text-muted-foreground"
          data-testid="button-agora-nao"
          onClick={dismiss}
        >
          Agora não
        </Button>
      </footer>
    </PhoneShell>
  );
}
