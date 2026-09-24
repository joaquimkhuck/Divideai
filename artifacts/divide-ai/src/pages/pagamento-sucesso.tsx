import { useEffect } from "react";
import { CheckCircle2, ChevronLeft, CreditCard } from "lucide-react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  getGetCheckoutSessionQueryKey,
  useGetCheckoutSession,
  getGetBillQueryKey,
  getListBillsQueryKey,
  getGetStatsQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { Card } from "@workspace/divide-ai-ds/components/ui/card";
import { PhoneShell } from "@/components/phone-shell";
import { formatCents } from "@/lib/money";

export default function PagamentoSucesso() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const sessionId = new URLSearchParams(window.location.search).get("session_id") ?? "";
  const { data, isLoading, isError } = useGetCheckoutSession(sessionId, {
    query: {
      enabled: Boolean(sessionId),
      retry: false,
      queryKey: getGetCheckoutSessionQueryKey(sessionId),
    },
  });

  const pago = data?.paymentStatus === "paid";
  const voltarAoRole = () =>
    setLocation(data ? `/role/${data.billId}` : "/");

  // A pessoa já foi marcada como paga no servidor (ver checkout-session route);
  // invalida o rolê pra ele refletir isso assim que o usuário voltar.
  useEffect(() => {
    if (pago && data) {
      queryClient.invalidateQueries({ queryKey: getGetBillQueryKey(data.billId) });
      queryClient.invalidateQueries({ queryKey: getListBillsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
    }
  }, [pago, data, queryClient]);

  return (
    <PhoneShell className="px-6 pb-8 pt-14">
      <button
        type="button"
        className="-ml-2 flex items-center gap-1 self-start text-sm text-muted-foreground"
        onClick={voltarAoRole}
      >
        <ChevronLeft className="h-4 w-4" />
        Rolê
      </button>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {isLoading ? (
          <>
            <div className="h-16 w-16 animate-pulse rounded-full bg-secondary" />
            <div className="mt-6 h-8 w-56 animate-pulse rounded-full bg-secondary" />
          </>
        ) : isError || !data ? (
          <>
            <CreditCard className="h-12 w-12 text-muted-foreground/60" />
            <h1 className="mt-6 text-[26px] font-bold">Não consegui confirmar</h1>
            <p className="mt-3 max-w-xs text-[17px] text-muted-foreground">
              Volte ao rolê e confira o status do pagamento.
            </p>
          </>
        ) : (
          <>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2E9E6B]/12">
              <CheckCircle2 className="h-9 w-9 text-[#2E9E6B]" />
            </span>
            <h1 className="mt-6 text-[26px] font-bold">
              {pago ? "Pagamento aprovado" : "Pagamento recebido"}
            </h1>
            <p className="mt-3 max-w-xs text-[17px] text-muted-foreground">
              {data.amountTotal
                ? `${formatCents(data.amountTotal)} confirmado no Stripe${
                    data.personName ? ` · parte de ${data.personName}` : ""
                  }${data.restaurantName ? ` no ${data.restaurantName}` : ""}.`
                : "A sessão foi processada no Stripe."}
            </p>
            <Card className="mt-8 w-full p-4 text-left">
              <p className="text-xs uppercase tracking-[0.06em] text-muted-foreground">
                Status
              </p>
              <p className="mt-2 font-bold">
                {data.paymentStatus === "paid"
                  ? "Pago"
                  : data.paymentStatus ?? data.status ?? "Em processamento"}
              </p>
            </Card>
          </>
        )}
      </div>

      <Button size="lg" onClick={voltarAoRole}>
        Voltar ao rolê
      </Button>
    </PhoneShell>
  );
}
