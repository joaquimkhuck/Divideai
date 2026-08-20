import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { Card } from "@workspace/divide-ai-ds/components/ui/card";
import { Input } from "@workspace/divide-ai-ds/components/ui/input";
import { PersonChip } from "@workspace/divide-ai-ds/components/ui/person-chip";
import { PhoneShell } from "@/components/phone-shell";
import { useDraft } from "@/store/draft";

export default function Pessoas() {
  const [, setLocation] = useLocation();
  const { draft, setDraft } = useDraft();
  const [nome, setNome] = useState("");

  const pessoas = draft.people;

  const adicionar = (n: string) => {
    const limpo = n.trim();
    if (!limpo || pessoas.includes(limpo)) return;
    setDraft((d) => ({ ...d, people: [...d.people, limpo] }));
    setNome("");
  };

  const remover = (n: string) => {
    setDraft((d) => {
      const idx = d.people.indexOf(n);
      if (idx === -1) return d;
      const nextPeople = d.people.filter((x) => x !== n);
      // Re-map item ownership indexes after removing a person.
      const nextItems = d.items.map((it) => ({
        ...it,
        personIndexes: it.personIndexes
          .filter((i) => i !== idx)
          .map((i) => (i > idx ? i - 1 : i)),
      }));
      return { ...d, people: nextPeople, items: nextItems };
    });
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
            onClick={() => setLocation("/revisar")}
            className="-ml-3 h-11 w-11"
          >
            <ChevronLeft />
          </Button>
          <h1 className="text-[26px] font-bold leading-tight">
            Quem tá na mesa?
          </h1>
        </div>
        <p className="mt-1 pl-8 text-sm text-muted-foreground">
          Só o primeiro nome. Sem cadastro, sem senha.
        </p>
      </header>

      <main className="flex-1 space-y-4 px-6">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            adicionar(nome);
          }}
        >
          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite um nome e toque em +"
            aria-label="Nome da pessoa"
            data-testid="input-person-name"
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Adicionar pessoa"
            data-testid="button-add-person"
            disabled={!nome.trim()}
            className="shrink-0"
          >
            <Plus />
          </Button>
        </form>

        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.06em] text-muted-foreground">
            Na mesa · {pessoas.length}
          </p>
          {pessoas.length > 0 ? (
            <>
              <div className="mt-3 flex flex-wrap gap-2">
                {pessoas.map((n) => (
                  <PersonChip
                    key={n}
                    name={n}
                    selected
                    aria-label={`Remover ${n}`}
                    data-testid={`chip-person-${n}`}
                    onClick={() => remover(n)}
                  />
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Toque num nome para tirar da mesa
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Adicione pelo menos duas pessoas para dividir.
            </p>
          )}
        </Card>
      </main>

      <footer className="space-y-2 px-6 pb-8 pt-6">
        <p className="text-center text-sm text-muted-foreground">
          Dá pra adicionar mais gente depois
        </p>
        <Button
          size="lg"
          data-testid="button-continue"
          disabled={pessoas.length < 2}
          onClick={() => setLocation("/quem-comeu")}
        >
          {pessoas.length >= 2
            ? `Dividir entre ${pessoas.length} pessoas`
            : "Dividir entre a mesa"}
        </Button>
      </footer>
    </PhoneShell>
  );
}
