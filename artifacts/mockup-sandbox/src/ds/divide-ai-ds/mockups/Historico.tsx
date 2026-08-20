import { Camera } from "lucide-react";

import { Badge } from "@workspace/divide-ai-ds/components/ui/badge";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { Card } from "@workspace/divide-ai-ds/components/ui/card";

type Role = {
  place: string;
  date: string;
  total: string;
  people: string[];
  pending?: { count: number; who: string };
};

const roles: Role[] = [
  {
    place: "Bar do Zé",
    date: "Hoje, 21h40",
    total: "R$ 437,25",
    people: ["Joaquim", "Estevão", "Artur", "Marina", "Lu"],
    pending: { count: 4, who: "Joaquim, Estevão, Artur e Lu" },
  },
  {
    place: "Cantina da Nona",
    date: "Sábado, 14 jun",
    total: "R$ 312,80",
    people: ["Artur", "Marina", "Lu"],
    pending: { count: 1, who: "Só a Lu ainda deve" },
  },
  {
    place: "Sushi Naka",
    date: "Sexta, 6 jun",
    total: "R$ 589,40",
    people: ["Joaquim", "Estevão", "Artur", "Marina"],
  },
  {
    place: "Pizzaria Bráz",
    date: "29 mai",
    total: "R$ 264,00",
    people: ["Joaquim", "Marina", "Lu"],
  },
];

function AvatarStack({ names }: { names: string[] }) {
  return (
    <div className="flex -space-x-2">
      {names.map((n) => (
        <span
          key={n}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-secondary text-xs font-bold text-foreground"
        >
          {n.charAt(0)}
        </span>
      ))}
    </div>
  );
}

function RoleCard({ role }: { role: Role }) {
  const settled = !role.pending;
  return (
    <Card className={settled ? "p-4 opacity-80" : "p-4"}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[17px] font-bold">{role.place}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{role.date}</p>
        </div>
        <p className="shrink-0 text-xl font-extrabold tabular-nums">
          {role.total}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <AvatarStack names={role.people} />
        {role.pending ? (
          <Badge variant="pending">Pendente</Badge>
        ) : (
          <Badge variant="paid">Fechado</Badge>
        )}
      </div>
      {role.pending && (
        <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground">
          {role.pending.count === 1
            ? role.pending.who
            : `${role.pending.who} ainda devem`}
        </p>
      )}
    </Card>
  );
}

export default function Historico() {
  return (
    <div className="min-h-screen bg-background font-['Nunito',sans-serif] text-foreground">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap"
      />
      <div className="flex min-h-screen flex-col px-6 pb-8 pt-14">
        <h1 className="text-[26px] font-bold leading-tight">Seus rolês</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          2 contas com cobrança pendente
        </p>

        <div className="mt-6 flex flex-col gap-4">
          {roles.map((r) => (
            <RoleCard key={r.place} role={r} />
          ))}
        </div>

        <div className="mt-auto pt-8">
          <Button size="lg">
            <Camera className="h-5 w-5" />
            Fotografar nova conta
          </Button>
        </div>
      </div>
    </div>
  );
}
