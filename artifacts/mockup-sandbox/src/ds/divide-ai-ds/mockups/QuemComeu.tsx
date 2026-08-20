import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { ItemCard } from "@workspace/divide-ai-ds/components/ui/item-card";

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

const AMIGOS = ["Joaquim", "Estevão", "Artur", "Marina", "Lu"];

interface ItemAtrib {
  descricao: string;
  valor: string;
  donos: string[];
}

const INICIAL: ItemAtrib[] = [
  { descricao: "Picanha ao ponto", valor: "R$ 89,90", donos: ["Joaquim", "Estevão", "Artur"] },
  { descricao: "Chopp Pilsen 500ml x4", valor: "R$ 59,60", donos: ["Joaquim", "Artur"] },
  { descricao: "Batata rústica", valor: "R$ 32,00", donos: [] },
  { descricao: "Moqueca de camarão", valor: "R$ 76,00", donos: ["Marina", "Lu"] },
  { descricao: "Couvert artístico x5", valor: "R$ 40,00", donos: AMIGOS },
];

export default function QuemComeu() {
  const [itens, setItens] = useState(INICIAL);

  const toggle = (idx: number, nome: string) => {
    setItens((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              ...item,
              donos: item.donos.includes(nome)
                ? item.donos.filter((d) => d !== nome)
                : [...item.donos, nome],
            }
          : item
      )
    );
  };

  const semDono = itens.filter((i) => i.donos.length === 0).length;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      <NunitoFont />

      <header className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Voltar" className="-ml-3 h-11 w-11">
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
        {itens.map((item, idx) => (
          <ItemCard
            key={item.descricao}
            description={item.descricao}
            value={item.valor}
            people={AMIGOS.map((nome) => ({
              name: nome,
              selected: item.donos.includes(nome),
            }))}
            unassignedLabel="SEM DONO"
            onTogglePerson={(nome) => toggle(idx, nome)}
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
        <Button size="lg">Ver quanto cada um paga</Button>
      </footer>
    </div>
  );
}
