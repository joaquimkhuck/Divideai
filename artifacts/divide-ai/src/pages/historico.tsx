import { useLocation } from "wouter";
import { Camera, ChevronLeft } from "lucide-react";
import { Badge } from "@workspace/divide-ai-ds/components/ui/badge";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { Card } from "@workspace/divide-ai-ds/components/ui/card";
import { EmptyState } from "@workspace/divide-ai-ds/components/ui/empty-state";
import {
  useListBills,
  getListBillsQueryKey,
  useGetStats,
  getGetStatsQueryKey,
} from "@workspace/api-client-react";
import type { Bill } from "@workspace/api-client-react";
import { PhoneShell } from "@/components/phone-shell";
import { formatCents } from "@/lib/money";
import { formatRoleDate } from "@/lib/date";

function AvatarStack({ names }: { names: string[] }) {
  return (
    <div className="flex -space-x-2">
      {names.slice(0, 6).map((n, i) => (
        <span
          key={`${n}-${i}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-secondary text-xs font-bold text-foreground"
        >
          {n.charAt(0).toUpperCase()}
        </span>
      ))}
    </div>
  );
}

function RoleCard({ bill, onOpen }: { bill: Bill; onOpen: () => void }) {
  const pending = bill.people.filter((p) => !p.paid);
  const settled = bill.settled || pending.length === 0;
  const names = pending.map((p) => p.name);
  const whoText =
    names.length === 0
      ? ""
      : names.length === 1
        ? `${names[0]} ainda deve`
        : names.length <= 3
          ? `${names.slice(0, -1).join(", ")} e ${names[names.length - 1]} ainda devem`
          : `${names.slice(0, 2).join(", ")} e mais ${names.length - 2} ainda devem`;

  return (
    <button
      type="button"
      data-testid={`card-role-${bill.id}`}
      onClick={onOpen}
      className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-3xl"
    >
      <Card className={settled ? "p-4 opacity-80" : "p-4"}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[17px] font-bold">
              {bill.restaurantName ?? "Rolê"}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {formatRoleDate(bill.createdAt)}
            </p>
          </div>
          <p className="shrink-0 text-xl font-extrabold tabular-nums">
            {formatCents(bill.totalCents)}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <AvatarStack names={bill.people.map((p) => p.name)} />
          {settled ? (
            <Badge variant="paid">Fechado</Badge>
          ) : (
            <Badge variant="pending">Pendente</Badge>
          )}
        </div>
        {!settled && whoText && (
          <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground">
            {whoText}
          </p>
        )}
      </Card>
    </button>
  );
}

export default function Historico() {
  const [, setLocation] = useLocation();

  const { data: bills, isLoading } = useListBills({
    query: { queryKey: getListBillsQueryKey() },
  });
  const { data: stats } = useGetStats({
    query: { queryKey: getGetStatsQueryKey() },
  });

  const pendingBills = (bills ?? []).filter((b) => !b.settled).length;

  return (
    <PhoneShell className="px-6 pb-8 pt-10">
      <div className="-ml-2 flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Voltar"
          data-testid="button-home"
          onClick={() => setLocation("/")}
        >
          <ChevronLeft />
        </Button>
        <p className="text-sm text-muted-foreground">Início</p>
      </div>
      <h1 className="mt-2 text-[26px] font-bold leading-tight">Seus rolês</h1>
      {(bills?.length ?? 0) > 0 && (
        <p className="mt-1 text-sm text-muted-foreground">
          {pendingBills === 0
            ? "Tudo fechado por aqui"
            : pendingBills === 1
              ? "1 conta com cobrança pendente"
              : `${pendingBills} contas com cobrança pendente`}
          {stats && stats.pendingCents > 0
            ? ` · ${formatCents(stats.pendingCents)}`
            : ""}
        </p>
      )}

      {isLoading ? (
        <div className="mt-6 flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-3xl bg-secondary"
            />
          ))}
        </div>
      ) : (bills?.length ?? 0) === 0 ? (
        <>
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              title="Nenhum rolê ainda"
              description="Fotografe a primeira conta e a mesa fecha em segundos."
            />
          </div>
          <div className="pt-8">
            <Button
              size="lg"
              data-testid="button-first-bill"
              onClick={() => setLocation("/")}
            >
              <Camera className="h-5 w-5" />
              Fotografar a primeira conta
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-4">
            {(bills ?? []).map((b) => (
              <RoleCard
                key={b.id}
                bill={b}
                onOpen={() => setLocation(`/role/${b.id}`)}
              />
            ))}
          </div>
          <div className="mt-auto pt-8">
            <Button
              size="lg"
              data-testid="button-new-bill"
              onClick={() => setLocation("/")}
            >
              <Camera className="h-5 w-5" />
              Fotografar nova conta
            </Button>
          </div>
        </>
      )}
    </PhoneShell>
  );
}
