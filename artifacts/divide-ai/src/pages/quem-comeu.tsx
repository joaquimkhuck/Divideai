import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { ItemCard } from "@workspace/divide-ai-ds/components/ui/item-card";
import {
  useCreateBill,
  getListBillsQueryKey,
  getGetStatsQueryKey,
} from "@workspace/api-client-react";
import type { Bill } from "@workspace/api-client-react";
import { PhoneShell } from "@/components/phone-shell";
import { useDraft } from "@/store/draft";
import { formatCents } from "@/lib/money";
import { useToast } from "@/hooks/use-toast";

export default function QuemComeu() {
  const [, setLocation] = useLocation();
  const { draft, setDraft } = useDraft();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createBill = useCreateBill();

  const people = draft.people;

  const togglePerson = (itemKey: string, personIndex: number) => {
    setDraft((d) => ({
      ...d,
      items: d.items.map((it) => {
        if (it.key !== itemKey) return it;
        const has = it.personIndexes.includes(personIndex);
        return {
          ...it,
          personIndexes: has
            ? it.personIndexes.filter((i) => i !== personIndex)
            : [...it.personIndexes, personIndex],
        };
      }),
    }));
  };

  const semDono = draft.items.filter((i) => i.personIndexes.length === 0).length;
  const allAssigned = semDono === 0 && draft.items.length > 0;

  const criar = () => {
    createBill.mutate(
      {
        data: {
          restaurantName: draft.restaurantName,
          serviceFeePercent: draft.serviceFeePercent,
          couvertCents: draft.couvertCents,
          items: draft.items.map((it) => ({
            description: it.description,
            quantity: it.quantity,
            unitPriceCents: it.unitPriceCents,
            personIndexes: it.personIndexes,
          })),
          people: draft.people.map((name) => ({ name })),
        },
      },
      {
        onSuccess: (bill: Bill) => {
          queryClient.invalidateQueries({ queryKey: getListBillsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
          setLocation(`/role/${bill.id}`);
        },
        onError: () => {
          toast({
            title: "Não consegui fechar a conta",
            description: "Tente de novo em instantes.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <PhoneShell>
      <header className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Voltar"
            data-testid="button-back"
            onClick={() => setLocation("/pessoas")}
            className="-ml-3 h-11 w-11"
          >
            <ChevronLeft />
          </Button>
          <h1 className="text-[26px] font-bold leading-tight">
            Quem comeu o quê?
          </h1>
        </div>
        <p className="mt-1 pl-8 text-sm text-muted-foreground">
          Toque nos amigos que dividiram cada item
        </p>
      </header>

      <main className="flex-1 space-y-4 px-6 pb-4">
        {draft.items.map((item) => (
          <ItemCard
            key={item.key}
            data-testid={`card-item-${item.key}`}
            description={
              item.quantity > 1
                ? `${item.description} x${item.quantity}`
                : item.description
            }
            value={formatCents(item.quantity * item.unitPriceCents)}
            people={people.map((name, idx) => ({
              name,
              selected: item.personIndexes.includes(idx),
            }))}
            unassignedLabel="SEM DONO"
            onTogglePerson={(name) =>
              togglePerson(item.key, people.indexOf(name))
            }
          />
        ))}
      </main>

      <footer className="space-y-2 px-6 pb-8 pt-2">
        {semDono > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            {semDono === 1
              ? "Falta decidir 1 item para fechar a conta"
              : `Faltam decidir ${semDono} itens para fechar a conta`}
          </p>
        )}
        <Button
          size="lg"
          data-testid="button-close-bill"
          disabled={!allAssigned || createBill.isPending}
          onClick={criar}
        >
          {createBill.isPending ? "Fechando…" : "Ver quanto cada um paga"}
        </Button>
      </footer>
    </PhoneShell>
  );
}
