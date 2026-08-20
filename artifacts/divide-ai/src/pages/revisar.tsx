import { useLocation } from "wouter";
import { ChevronLeft, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { Card } from "@workspace/divide-ai-ds/components/ui/card";
import { Input } from "@workspace/divide-ai-ds/components/ui/input";
import { cn } from "@workspace/divide-ai-ds/lib/utils";
import { PhoneShell } from "@/components/phone-shell";
import {
  useDraft,
  newItemKey,
  draftSubtotalCents,
  draftTotalCents,
  draftFeeCents,
  type DraftItem,
} from "@/store/draft";
import { formatCents, centsToInput, maskBRL, inputToCents } from "@/lib/money";

export default function Revisar() {
  const [, setLocation] = useLocation();
  const { draft, setDraft } = useDraft();

  const updateItem = (key: string, patch: Partial<DraftItem>) => {
    setDraft((d) => ({
      ...d,
      items: d.items.map((it) => (it.key === key ? { ...it, ...patch } : it)),
    }));
  };

  const removeItem = (key: string) => {
    setDraft((d) => ({ ...d, items: d.items.filter((it) => it.key !== key) }));
  };

  const addItem = () => {
    setDraft((d) => ({
      ...d,
      items: [
        ...d.items,
        {
          key: newItemKey(),
          description: "",
          quantity: 1,
          unitPriceCents: 0,
          personIndexes: [],
        },
      ],
    }));
  };

  const subtotal = draftSubtotalCents(draft);
  const feeCents = draftFeeCents(draft);
  const total = draftTotalCents(draft);

  const mismatch =
    draft.detectedTotalCents != null &&
    Math.abs(draft.detectedTotalCents - total) > 1;

  const canContinue =
    draft.items.length > 0 &&
    draft.items.every((it) => it.description.trim() && it.unitPriceCents >= 0);

  return (
    <PhoneShell>
      <header className="flex items-center gap-2 px-6 pt-6 pb-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Voltar"
          data-testid="button-back"
          onClick={() => setLocation("/")}
          className="-ml-3 h-11 w-11"
        >
          <ChevronLeft />
        </Button>
        <h1 className="text-[26px] font-bold leading-tight">Confira a conta</h1>
      </header>

      <main className="flex-1 space-y-4 px-6 pb-4">
        <Card className="overflow-hidden">
          {draft.photoPreview ? (
            <div className="relative m-4 mb-0 h-28 overflow-hidden rounded-2xl bg-secondary">
              <img
                src={draft.photoPreview}
                alt="Foto da conta"
                className="h-full w-full object-cover"
              />
              <span className="absolute right-3 top-3 rounded-full bg-card px-3 py-1 text-xs uppercase tracking-[0.06em] text-muted-foreground shadow-[0_2px_8px_rgba(31,35,40,0.06)]">
                Foto da conta
              </span>
            </div>
          ) : null}

          <div className="space-y-4 p-4">
            <div className="flex items-center gap-2 px-1 text-xs uppercase tracking-[0.06em] text-muted-foreground">
              <span className="min-w-0 flex-1">Item</span>
              <span className="w-12 shrink-0 text-center">Qtd</span>
              <span className="w-[88px] shrink-0 text-right">Valor</span>
              <span className="w-8 shrink-0" />
            </div>

            {draft.items.map((item) => (
              <div key={item.key} className="flex items-center gap-2">
                <Input
                  value={item.description}
                  onChange={(e) =>
                    updateItem(item.key, { description: e.target.value })
                  }
                  placeholder="Descrição do item"
                  aria-label="Descrição do item"
                  data-testid={`input-desc-${item.key}`}
                  className="h-11 min-w-0 flex-1 text-[15px]"
                />
                <Input
                  value={String(item.quantity)}
                  onChange={(e) =>
                    updateItem(item.key, {
                      quantity: Math.max(
                        1,
                        Number(e.target.value.replace(/\D/g, "")) || 1
                      ),
                    })
                  }
                  aria-label="Quantidade"
                  inputMode="numeric"
                  data-testid={`input-qty-${item.key}`}
                  className="h-11 w-12 shrink-0 px-0 text-center text-[15px] tabular-nums"
                />
                <Input
                  value={centsToInput(item.unitPriceCents)}
                  onChange={(e) =>
                    updateItem(item.key, {
                      unitPriceCents: inputToCents(maskBRL(e.target.value)),
                    })
                  }
                  aria-label="Valor unitário"
                  inputMode="decimal"
                  data-testid={`input-price-${item.key}`}
                  className={cn(
                    "h-11 w-[88px] shrink-0 px-3 text-right text-[15px] font-extrabold tabular-nums"
                  )}
                />
                <button
                  type="button"
                  aria-label="Remover item"
                  data-testid={`button-remove-${item.key}`}
                  onClick={() => removeItem(item.key)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground active:bg-secondary"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            <Button
              variant="ghost"
              data-testid="button-add-item"
              onClick={addItem}
              className="min-h-11 gap-2 rounded-full px-4 text-sm text-primary"
            >
              <Plus className="size-4" />
              Adicionar item
            </Button>
          </div>
        </Card>

        {/* Service fee + couvert */}
        <Card className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[17px]">Taxa de serviço</p>
            <div className="flex items-center gap-2">
              <Input
                value={String(draft.serviceFeePercent)}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    serviceFeePercent: Math.max(
                      0,
                      Number(e.target.value.replace(/\D/g, "")) || 0
                    ),
                  }))
                }
                inputMode="numeric"
                aria-label="Porcentagem da taxa de serviço"
                data-testid="input-service-fee"
                className="h-11 w-16 px-3 text-right text-[15px] tabular-nums"
              />
              <span className="text-[17px] text-muted-foreground">%</span>
              <p className="w-[88px] text-right text-xl font-extrabold tabular-nums">
                {formatCents(feeCents)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-[17px]">Couvert</p>
            <Input
              value={centsToInput(draft.couvertCents)}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  couvertCents: inputToCents(maskBRL(e.target.value)),
                }))
              }
              inputMode="decimal"
              aria-label="Valor do couvert"
              data-testid="input-couvert"
              className="h-11 w-[120px] px-3 text-right text-[15px] font-extrabold tabular-nums"
            />
          </div>

          <div className="h-px w-full bg-border" />

          <div className="flex items-baseline justify-between">
            <p className="text-[17px] font-bold">Total da mesa</p>
            <p
              className="text-[28px] font-extrabold tabular-nums leading-none"
              data-testid="text-running-total"
            >
              {formatCents(total)}
            </p>
          </div>

          {mismatch && (
            <div className="flex items-start gap-2 rounded-2xl bg-[#C98A2D]/12 px-3 py-2">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: "#C98A2D" }}
              />
              <p className="text-sm" style={{ color: "#C98A2D" }}>
                A conta imprimiu {formatCents(draft.detectedTotalCents ?? 0)}. Se
                não bater, confira os itens acima.
              </p>
            </div>
          )}
        </Card>
      </main>

      <footer className="px-6 pb-8 pt-2">
        <Button
          size="lg"
          data-testid="button-continue"
          disabled={!canContinue}
          onClick={() => setLocation("/pessoas")}
        >
          Está tudo certo
        </Button>
      </footer>
    </PhoneShell>
  );
}
