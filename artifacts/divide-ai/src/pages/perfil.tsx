import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Copy, LogOut, Trash2 } from "lucide-react";
import { useAuth, useClerk, useUser } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { Card } from "@workspace/divide-ai-ds/components/ui/card";
import { Input } from "@workspace/divide-ai-ds/components/ui/input";
import {
  useGetAccount,
  getGetAccountQueryKey,
  useUpdateAccount,
  useDeleteAccountData,
  useGetStats,
  getGetStatsQueryKey,
} from "@workspace/api-client-react";
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
import { useToast } from "@/hooks/use-toast";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function listNames(names: string[]): string {
  const unique = [...new Set(names)];
  if (unique.length <= 1) return unique[0] ?? "";
  if (unique.length === 2) return `${unique[0]} e ${unique[1]}`;
  return `${unique.slice(0, 2).join(", ")} e ${unique.length === 2 ? unique[1] : unique[2]}`;
}

export default function Perfil() {
  const [, setLocation] = useLocation();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editingPix, setEditingPix] = useState(false);
  const [pixDraft, setPixDraft] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) setLocation("/entrar", { replace: true });
  }, [isLoaded, isSignedIn, setLocation]);

  const enabled = Boolean(isLoaded && isSignedIn);
  const { data: account } = useGetAccount({
    query: { queryKey: getGetAccountQueryKey(), enabled },
  });
  const { data: stats } = useGetStats({
    query: { queryKey: getGetStatsQueryKey(), enabled },
  });
  const updateAccount = useUpdateAccount();
  const deleteData = useDeleteAccountData();

  const name = user?.fullName || user?.firstName || "Você";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const initial = (name || email || "?").trim().charAt(0).toUpperCase();

  const pendingSummary = useMemo(() => {
    const people = stats?.pendingPeople ?? [];
    if (people.length === 0) return null;
    const names = listNames(people.map((p) => p.name));
    const places = [
      ...new Set(people.map((p) => p.restaurantName).filter(Boolean)),
    ];
    return places.length > 0 ? `${names} · ${places[0]}` : names;
  }, [stats]);

  const savePix = () => {
    const value = pixDraft.trim();
    updateAccount.mutate(
      { data: { pixKey: value === "" ? null : value } },
      {
        onSuccess: (updated) => {
          queryClient.setQueryData(getGetAccountQueryKey(), updated);
          setEditingPix(false);
          toast({ title: "Chave Pix salva" });
        },
        onError: () =>
          toast({ title: "Não consegui salvar", variant: "destructive" }),
      }
    );
  };

  const copyPix = async () => {
    if (!account?.pixKey) return;
    try {
      await navigator.clipboard.writeText(account.pixKey);
      toast({ title: "Chave Pix copiada" });
    } catch {
      toast({ title: "Não consegui copiar", variant: "destructive" });
    }
  };

  const apagarDados = () => {
    deleteData.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        setConfirmDelete(false);
        toast({ title: "Seus dados foram apagados" });
        setLocation("/");
      },
      onError: () =>
        toast({ title: "Não consegui apagar", variant: "destructive" }),
    });
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
            onClick={() => setLocation("/")}
          >
            <ChevronLeft />
          </Button>
          <h1 className="text-[26px] font-bold leading-tight">Perfil</h1>
        </div>
      </header>

      <main className="flex-1 space-y-4 px-6 pb-6 pt-4">
        {/* Identidade */}
        <Card className="flex items-center gap-4 p-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary text-xl font-extrabold">
            {initial}
          </span>
          <div className="min-w-0">
            <p className="text-[17px] font-bold" data-testid="text-nome">
              {name}
            </p>
            <p className="truncate text-sm text-muted-foreground" data-testid="text-email">
              {email}
            </p>
          </div>
        </Card>

        {/* Chave Pix */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.06em] text-muted-foreground">
              Sua chave Pix
            </p>
            {!editingPix && (
              <button
                type="button"
                className="text-sm font-bold text-primary"
                data-testid="button-editar-pix"
                onClick={() => {
                  setPixDraft(account?.pixKey ?? "");
                  setEditingPix(true);
                }}
              >
                {account?.pixKey ? "Editar" : "Adicionar"}
              </button>
            )}
          </div>

          {editingPix ? (
            <div className="mt-3 space-y-3">
              <Input
                value={pixDraft}
                onChange={(e) => setPixDraft(e.target.value)}
                placeholder="E-mail, CPF, telefone ou chave aleatória"
                data-testid="input-pix"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={savePix}
                  disabled={updateAccount.isPending}
                  data-testid="button-salvar-pix"
                >
                  Salvar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingPix(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : account?.pixKey ? (
            <button
              type="button"
              onClick={copyPix}
              data-testid="button-copiar-pix"
              className="mt-3 flex w-full items-center justify-between rounded-2xl border border-border px-4 py-3 text-left"
            >
              <span className="truncate text-[15px] font-bold">
                {account.pixKey}
              </span>
              <span className="ml-3 inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
                <Copy className="h-4 w-4" />
                Copiar
              </span>
            </button>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Nenhuma chave ainda.
            </p>
          )}
          <p className="mt-3 text-sm text-muted-foreground">
            É ela que vai nas cobranças do WhatsApp.
          </p>
        </Card>

        {/* Créditos */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.06em] text-muted-foreground">
                Créditos
              </p>
              <p className="mt-1 text-[17px] font-bold tabular-nums" data-testid="text-creditos">
                {account
                  ? `${account.creditBalance} ${account.creditBalance === 1 ? "conta" : "contas"} restantes`
                  : "…"}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              data-testid="button-ver-creditos"
              onClick={() => setLocation("/creditos")}
            >
              Ver créditos
            </Button>
          </div>
        </Card>

        {/* Seus rolês */}
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.06em] text-muted-foreground">
            Seus rolês
          </p>
          <div className="mt-2 divide-y divide-border">
            <div className="flex items-center justify-between py-3">
              <p className="text-[15px]">Contas divididas</p>
              <p className="font-bold tabular-nums" data-testid="text-stat-contas">
                {stats?.billCount ?? 0}
              </p>
            </div>
            <div className="flex items-center justify-between py-3">
              <p className="text-[15px]">Total dividido</p>
              <p className="font-bold tabular-nums" data-testid="text-stat-total">
                {formatCents(stats?.totalSplitCents ?? 0)}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="text-[15px]">Ainda te devem</p>
                {pendingSummary && (
                  <p className="truncate text-sm text-muted-foreground">
                    {pendingSummary}
                  </p>
                )}
              </div>
              <p className="shrink-0 font-bold tabular-nums" data-testid="text-stat-pendente">
                {formatCents(stats?.pendingCents ?? 0)}
              </p>
            </div>
          </div>
        </Card>

        {/* Conta e dados */}
        <Card className="p-2">
          <button
            type="button"
            data-testid="button-sair"
            onClick={() => void signOut({ redirectUrl: basePath || "/" })}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] font-bold"
          >
            <LogOut className="h-4 w-4 text-muted-foreground" />
            Sair da conta
          </button>
          <div className="mx-4 border-t border-border" />
          <button
            type="button"
            data-testid="button-apagar-dados"
            onClick={() => setConfirmDelete(true)}
            className="flex w-full items-start gap-3 rounded-2xl px-4 py-3 text-left"
          >
            <Trash2 className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <span>
              <span className="block text-[15px] font-bold text-destructive">
                Apagar meus dados
              </span>
              <span className="block text-sm text-muted-foreground">
                Remove seus rolês e cobranças, quando quiser
              </span>
            </span>
          </button>
        </Card>
      </main>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar todos os seus dados?</AlertDialogTitle>
            <AlertDialogDescription>
              Todos os seus rolês, cobranças e sua chave Pix serão removidos.
              Isso não pode ser desfeito.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              data-testid="button-confirmar-apagar"
              onClick={apagarDados}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Apagar tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PhoneShell>
  );
}
