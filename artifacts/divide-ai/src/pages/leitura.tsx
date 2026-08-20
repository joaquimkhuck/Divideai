import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Check } from "lucide-react";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { ScanProgress } from "@workspace/divide-ai-ds/components/ui/scan-progress";
import { useAnalyzeBill, ApiError } from "@workspace/api-client-react";
import type { BillDraft } from "@workspace/api-client-react";
import { PhoneShell } from "@/components/phone-shell";
import { useDraft, newItemKey } from "@/store/draft";

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
  const startedRef = useRef(false);

  const analyze = useAnalyzeBill();
  const analyzeRef = useRef(analyze.mutate);
  analyzeRef.current = analyze.mutate;

  // Rotate the status label while the AI reads.
  useEffect(() => {
    const t = setInterval(
      () => setPasso((p) => Math.min(p + 1, STATUS.length - 1)),
      1600
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
          const rateLimited = err instanceof ApiError && err.status === 429;
          setLocation("/erro-leitura", {
            state: { rateLimited },
          });
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <PhoneShell>
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <ScanProgress
          size={128}
          src={draft.photoPreview ?? undefined}
          label={STATUS[Math.min(passo, STATUS.length - 1)]}
        />

        <div
          className="mt-8 min-h-24 w-full max-w-64 space-y-2"
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
