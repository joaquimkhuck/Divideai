import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Check } from "lucide-react";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { ScanProgress } from "@workspace/divide-ai-ds/components/ui/scan-progress";
import { useAnalyzeBill, ApiError } from "@workspace/api-client-react";
import type { BillDraft } from "@workspace/api-client-react";
import { PhoneShell } from "@/components/phone-shell";
import { useDraft, newItemKey } from "@/store/draft";
import { isNative } from "@/lib/native";

const STATUS = [
  "Lendo a conta…",
  "Separando os itens…",
  "Conferindo os centavos…",
];

export default function Leitura() {
  const [location, setLocation] = useLocation();
  const { draft, setDraft } = useDraft();
  const [passo, setPasso] = useState(0);
  const [achados, setAchados] = useState<string[]>([]);
  const [foto, setFoto] = useState<string | undefined>(draft.photoPreview ?? undefined);
  const startedRef = useRef(false);

  const analyze = useAnalyzeBill();
  const analyzeRef = useRef(analyze.mutate);
  analyzeRef.current = analyze.mutate;

  // Rotate the status label while the AI reads.
  useEffect(() => {
    const t = setInterval(
      () => setPasso((p) => Math.min(p + 1, STATUS.length - 1)),
      2500
    );
    return () => clearInterval(t);
  }, []);

  // Kick off analysis once, from the image passed via navigation state or draft.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const navState = (window.history.state?.state ?? {}) as {
      imageBase64?: string;
    };
    const imageBase64 = navState.imageBase64 ?? draft.photoPreview ?? "";

    if (!imageBase64) {
      setLocation("/");
      return;
    }
    setFoto(imageBase64);

    analyzeRef.current(
      { data: { imageBase64 } },
      {
        onSuccess: (result: BillDraft) => {
          const found: string[] = [];
          if (result.restaurantName) found.push(result.restaurantName);
          found.push(
            `${result.items.length} ${
              result.items.length === 1 ? "item encontrado" : "itens encontrados"
            }`
          );
          if (result.serviceFeePercent > 0) {
            found.push(`Taxa de serviço de ${result.serviceFeePercent}%`);
          }
          setAchados(found);

          setDraft((d) => ({
            ...d,
            restaurantName: result.restaurantName ?? null,
            serviceFeePercent: result.serviceFeePercent,
            couvertCents: result.couvertCents,
            detectedTotalCents: result.detectedTotalCents ?? null,
            items: result.items.map((it) => ({
              key: newItemKey(),
              description: it.description,
              quantity: it.quantity,
              unitPriceCents: it.unitPriceCents,
              personIndexes: [],
            })),
          }));

          // Small beat so the "found" lines register before advancing.
          window.setTimeout(() => setLocation("/revisar"), 900);
        },
        onError: (err: Error) => {
          // 402: conta sem créditos. No iOS (v1 sem compra de créditos,
          // regra 3.1.1) mostra um aviso neutro em vez da tela de compra.
          if (err instanceof ApiError && err.status === 402) {
            if (isNative) {
              setLocation("/erro-leitura", {
                replace: true,
                state: { semCreditos: true },
              });
            } else {
              setLocation("/creditos", { replace: true });
            }
            return;
          }
          const rateLimited = err instanceof ApiError && err.status === 429;
          setLocation("/erro-leitura", {
            state: { rateLimited },
          });
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const done = achados.length > 0;

  return (
    <PhoneShell>
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        {foto ? (
          <div
            role="status"
            aria-label={done ? "Conta lida" : STATUS[passo]}
            className="relative w-full max-w-56 overflow-hidden rounded-3xl bg-foreground/90 shadow-[0_8px_24px_rgba(31,35,40,0.12)]"
            style={{ aspectRatio: "3 / 4" }}
          >
            <img
              src={foto}
              alt="Foto da conta"
              className="h-full w-full object-cover opacity-80"
            />
            {!done && (
              <div
                aria-hidden="true"
                className="absolute inset-x-0 h-16 -translate-y-full bg-gradient-to-b from-transparent to-primary/35 motion-reduce:hidden"
                style={{ animation: "divideai-scan 2.2s ease-in-out infinite" }}
              >
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary shadow-[0_0_12px_2px_rgba(42,92,255,0.6)]" />
              </div>
            )}
          </div>
        ) : (
          <ScanProgress size={128} label={STATUS[passo]} />
        )}

        <p className="mt-8 text-[20px] font-bold">
          {done ? "Conta lida" : "Lendo a sua conta"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {done ? "Abrindo os itens para você revisar" : "Costuma levar uns 8 segundos"}
        </p>

        <ol className="mt-6 w-full max-w-64 space-y-3">
          {STATUS.map((etapa, i) => {
            const estado = done || i < passo ? "feito" : i === passo ? "agora" : "depois";
            return (
              <li key={etapa} className="flex items-center gap-3 text-sm">
                {estado === "feito" ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2E9E6B] text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                ) : estado === "agora" ? (
                  <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-border border-t-primary [animation-duration:0.9s]" />
                ) : (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  </span>
                )}
                <span
                  className={
                    estado === "depois" ? "text-muted-foreground/60" : estado === "agora" ? "font-bold" : "text-muted-foreground"
                  }
                >
                  {etapa.replace("…", "")}
                </span>
              </li>
            );
          })}
        </ol>

        <div
          className="mt-6 min-h-16 w-full max-w-64 space-y-2 border-t border-border pt-4 empty:border-transparent"
          aria-live="polite"
        >
          {achados.map((linha) => (
            <div
              key={linha}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#2E9E6B] text-white">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              {linha}
            </div>
          ))}
        </div>
      </main>

      <footer className="flex justify-center px-6 pb-12">
        <Button
          variant="ghost"
          data-testid="button-cancel-scan"
          onClick={() => setLocation("/")}
          className="min-h-12 rounded-full px-6 text-sm text-muted-foreground"
        >
          Cancelar leitura
        </Button>
      </footer>
    </PhoneShell>
  );
}
