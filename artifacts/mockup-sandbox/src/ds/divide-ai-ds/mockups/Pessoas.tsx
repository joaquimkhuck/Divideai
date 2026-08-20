import { useState } from "react";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { Card } from "@workspace/divide-ai-ds/components/ui/card";
import { Input } from "@workspace/divide-ai-ds/components/ui/input";
import { PersonChip } from "@workspace/divide-ai-ds/components/ui/person-chip";

function NunitoFont() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap"
      />
    </>
  );
}

const RECENTES = ["Estevão", "Artur", "Marina", "Lu"];

export default function Pessoas() {
  const [pessoas, setPessoas] = useState<string[]>(["Joaquim", "Marina"]);
  const [nome, setNome] = useState("");

  const adicionar = (n: string) => {
    const limpo = n.trim();
    if (!limpo || pessoas.includes(limpo)) return;
    setPessoas((p) => [...p, limpo]);
    setNome("");
  };

  const remover = (n: string) => setPessoas((p) => p.filter((x) => x !== n));

  const sugeridos = RECENTES.filter((n) => !pessoas.includes(n));

  return (
    <div className="min-h-screen bg-background font-['Nunito',sans-serif] text-foreground flex flex-col">
      <NunitoFont />

      <header className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Voltar" className="-ml-3 h-11 w-11">
            <ChevronLeft />
          </Button>
          <h1 className="text-[26px] font-bold leading-tight">Quem tá na mesa?</h1>
        </div>
        <p className="mt-1 pl-8 text-sm text-muted-foreground">
          Só o primeiro nome. Sem cadastro, sem senha.
        </p>
      </header>

      <main className="flex-1 space-y-4 px-6">
        {/* Quick add */}
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
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Adicionar pessoa"
            disabled={!nome.trim()}
            className="shrink-0"
          >
            <Plus />
          </Button>
        </form>

        {/* People at the table */}
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.06em] text-muted-foreground">
            Na mesa · {pessoas.length}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {pessoas.map((n) => (
              <PersonChip
                key={n}
                name={n}
                selected
                aria-label={`Remover ${n}`}
                onClick={() => remover(n)}
              />
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Toque num nome para tirar da mesa
          </p>
        </Card>

        {/* Suggested from past rolês */}
        {sugeridos.length > 0 && (
          <Card className="p-4">
            <p className="text-xs uppercase tracking-[0.06em] text-muted-foreground">
              Dos últimos rolês
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {sugeridos.map((n) => (
                <PersonChip
                  key={n}
                  name={n}
                  aria-label={`Adicionar ${n}`}
                  onClick={() => adicionar(n)}
                />
              ))}
            </div>
          </Card>
        )}
      </main>

      <footer className="space-y-2 px-6 pb-8 pt-6">
        <p className="text-center text-sm text-muted-foreground">
          Dá pra adicionar mais gente depois
        </p>
        <Button size="lg" disabled={pessoas.length < 2}>
          Dividir entre {pessoas.length} pessoas
        </Button>
      </footer>
    </div>
  );
}
