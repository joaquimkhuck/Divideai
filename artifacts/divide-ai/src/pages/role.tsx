import { useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Receipt, ChevronLeft, Trash2, Copy } from "lucide-react";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { Card } from "@workspace/divide-ai-ds/components/ui/card";
import { Badge } from "@workspace/divide-ai-ds/components/ui/badge";
import { SettlementRow } from "@workspace/divide-ai-ds/components/ui/settlement-row";
import {
  ChargeSheet,
  ChargeSheetContent,
  ChargeSheetTitle,
  ChargeSheetDescription,
  ChargeSheetPixField,
} from "@workspace/divide-ai-ds/components/ui/charge-sheet";
import {
  useGetBill,
  getGetBillQueryKey,
  useSetPersonPaid,
  useDeleteBill,
  getListBillsQueryKey,
  getGetStatsQueryKey,
} from "@workspace/api-client-react";
import type { Bill, BillPerson } from "@workspace/api-client-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PhoneShell } from "@/components/phone-shell";
import { formatCents } from "@/lib/money";
import { formatShortDay, formatRoleDate } from "@/lib/date";
import { useToast } from "@/hooks/use-toast";

const PIX_KEY = "divideai@pix.com.br";

export default function Role() {
  const params = useParams<{ id: string }>();
  const billId = Number(params.id);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selected, setSelected] = useState<BillPerson | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: bill, isLoading, isError } = useGetBill(billId, {
    query: {
      enabled: Number.isFinite(billId),
      queryKey: getGetBillQueryKey(billId),
    },
  });

  const setPaid = useSetPersonPaid();
  const deleteBill = useDeleteBill();

  const peopleSum = useMemo(
    () => (bill?.people ?? []).reduce((s, p) => s + p.amountCents, 0),
    [bill]
  );
  const closesToCent = bill ? peopleSum === bill.totalCents : false;

  const pendingCount = (bill?.people ?? []).filter((p) => !p.paid).length;

  const markPaid = (person: BillPerson, paid: boolean) => {
    setPaid.mutate(
      { id: billId, personId: person.id, data: { paid } },
      {
        onSuccess: (updated: Bill) => {
          queryClient.setQueryData(getGetBillQueryKey(billId), updated);
          queryClient.invalidateQueries({ queryKey: getListBillsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
          setSelected(null);
        },
        onError: () =>
          toast({
            title: "Não consegui atualizar",
            variant: "destructive",
          }),
      }
    );
  };

  const cobrarWhatsapp = (person: BillPerson) => {
    const place = bill?.restaurantName ? ` do ${bill.restaurantName}` : "";
    const msg = `Oi, ${person.name}! Fechei a conta${place} no Divide Aí. Sua parte deu ${formatCents(
      person.amountCents
    )}. Pode mandar no Pix: ${PIX_KEY} 🙏`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const removerRole = () => {
    deleteBill.mutate(
      { id: billId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBillsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
          setConfirmDelete(false);
          setLocation("/roles");
        },
        onError: () =>
          toast({ title: "Não consegui apagar", variant: "destructive" }),
      }
    );
  };

  if (isLoading) {
    return (
      <PhoneShell className="px-6 pb-8 pt-14">
        <div className="h-6 w-40 animate-pulse rounded-full bg-secondary" />
        <div className="mt-6 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-3xl bg-secondary"
            />
          ))}
        </div>
      </PhoneShell>
    );
  }

  if (isError || !bill) {
    return (
      <PhoneShell className="px-6 pb-8 pt-14">
        <div className="-ml-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Voltar"
            onClick={() => setLocation("/roles")}
          >
            <ChevronLeft />
          </Button>
          <p className="text-sm text-muted-foreground">Rolês anteriores</p>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <h1 className="text-[26px] font-bold">Rolê não encontrado</h1>
          <p className="text-[17px] text-muted-foreground">
            Essa conta pode ter sido apagada.
          </p>
          <Button
            size="lg"
            className="mt-4 max-w-xs"
            onClick={() => setLocation("/roles")}
          >
            Ver rolês
          </Button>
        </div>
      </PhoneShell>
    );
  }

  const title = bill.restaurantName ?? "Rolê";
  const subtitle = `${bill.people.length} ${
    bill.people.length === 1 ? "pessoa" : "pessoas"
  } · ${formatRoleDate(bill.createdAt)}`;

  return (
    <PhoneShell className="px-6 pb-8 pt-10">
      <div className="-ml-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Voltar"
            data-testid="button-back"
            onClick={() => setLocation("/roles")}
          >
            <ChevronLeft />
          </Button>
          <p className="text-sm text-muted-foreground">Rolês anteriores</p>
        </div>
        <button
          type="button"
          aria-label="Apagar rolê"
          data-testid="button-delete-role"
          onClick={() => setConfirmDelete(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground active:bg-secondary"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <h1 className="mt-2 text-[26px] font-bold leading-tight">
        {title} · {formatShortDay(bill.createdAt)}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>

      {/* Settlement rows — tap a person to charge them */}
      <Card className="mt-6 px-4">
        <div className="flex items-center justify-between border-b border-border py-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Receipt className="h-4 w-4" />
            <span className="text-sm">Total da conta</span>
          </div>
          <span
            className="text-xl font-extrabold tabular-nums"
            data-testid="text-total"
          >
            {formatCents(bill.totalCents)}
          </span>
        </div>
        <div className="divide-y divide-border">
          {bill.people.map((p) => (
            <button
              key={p.id}
              type="button"
              data-testid={`row-person-${p.id}`}
              onClick={() => setSelected(p)}
              className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
            >
              <SettlementRow
                name={p.name}
                value={formatCents(p.amountCents)}
                paid={p.paid}
              />
            </button>
          ))}
        </div>
      </Card>

      {/* Guardrail do centavo */}
      <Card className="mt-4 p-4">
        <p className="text-sm text-muted-foreground">
          Taxa de serviço {bill.serviceFeePercent}% e couvert já divididos
        </p>
        {closesToCent && (
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-[#2E9E6B]/12 px-3 py-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2E9E6B] text-white">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <p className="text-sm font-bold text-[#2E9E6B]">
              Fecha com o total, no centavo
            </p>
          </div>
        )}
      </Card>

      {/* Items */}
      <Card className="mt-4 p-4">
        <p className="text-xs uppercase tracking-[0.06em] text-muted-foreground">
          Itens da conta
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {bill.items.map((it) => (
            <div
              key={it.id}
              className="flex items-baseline justify-between gap-4"
            >
              <p className="min-w-0 truncate text-sm text-muted-foreground">
                {it.quantity > 1 ? `${it.description} (${it.quantity}x)` : it.description}
              </p>
              <p className="shrink-0 text-sm font-extrabold tabular-nums text-muted-foreground">
                {formatCents(it.totalCents)}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Footer status */}
      <div className="mt-auto pt-8">
        {bill.settled ? (
          <div className="flex items-center justify-center gap-2">
            <Badge variant="paid">Fechado</Badge>
            <p className="text-sm text-muted-foreground">Todo mundo pagou</p>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            {pendingCount === 1
              ? "Falta 1 pessoa pagar"
              : `Faltam ${pendingCount} pessoas pagar`}
          </p>
        )}
      </div>

      {/* Charge sheet */}
      <ChargeSheet
        open={selected !== null}
        onOpenChange={(o) => !o && setSelected(null)}
      >
        <ChargeSheetContent>
          {selected && (
            <div className="px-6 pb-8 pt-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-bold">
                  {selected.name.charAt(0).toUpperCase()}
                </span>
                <ChargeSheetTitle className="text-[17px] font-bold">
                  {selected.name}
                </ChargeSheetTitle>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">Parte dele</p>
              <p
                className="mt-1 text-[44px] font-extrabold leading-none tabular-nums"
                data-testid="text-charge-value"
              >
                {formatCents(selected.amountCents)}
              </p>
              <ChargeSheetDescription className="mt-2 text-sm text-muted-foreground">
                {bill.restaurantName ? `${bill.restaurantName} · ` : ""}taxa de
                serviço incluída
              </ChargeSheetDescription>

              <div className="mt-6">
                <ChargeSheetPixField
                  pixKey={PIX_KEY}
                  label="Sua chave Pix"
                  data-testid="button-copy-pix"
                  onCopied={() =>
                    toast({ title: "Chave Pix copiada" })
                  }
                />
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <Button
                  size="lg"
                  data-testid="button-whatsapp"
                  onClick={() => cobrarWhatsapp(selected)}
                >
                  Cobrar no WhatsApp
                </Button>
                {selected.paid ? (
                  <Button
                    variant="secondary"
                    size="lg"
                    data-testid="button-mark-unpaid"
                    disabled={setPaid.isPending}
                    onClick={() => markPaid(selected, false)}
                  >
                    <Copy className="h-4 w-4" />
                    Desmarcar pagamento
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="lg"
                    data-testid="button-mark-paid"
                    disabled={setPaid.isPending}
                    onClick={() => markPaid(selected, true)}
                  >
                    <Check className="h-4 w-4" />
                    Ele já pagou
                  </Button>
                )}
              </div>
            </div>
          )}
        </ChargeSheetContent>
      </ChargeSheet>

      {/* Delete confirm */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar este rolê?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso remove a conta e o fechamento de todo mundo. Não dá pra
              desfazer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">
              Agora não
            </AlertDialogCancel>
            <AlertDialogAction
              data-testid="button-confirm-delete"
              onClick={(e) => {
                e.preventDefault();
                removerRole();
              }}
            >
              Apagar rolê
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PhoneShell>
  );
}
