import { useState } from 'react';
import { Camera } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ItemCard } from '../components/ui/item-card';
import { PersonChip } from '../components/ui/person-chip';
import { Guidelines } from './parts';

const CORE_SWATCHES = [
  { name: 'Primary · Azul-profundo', className: 'bg-primary' },
  { name: 'Secondary', className: 'bg-secondary' },
  { name: 'Accent', className: 'bg-accent' },
] as const;

const SUPPORTING_SWATCHES = [
  { name: 'Background · Névoa', className: 'border bg-background' },
  { name: 'Card · Papel', className: 'border bg-card' },
  { name: 'Foreground · Grafite', className: 'bg-foreground' },
  { name: 'Muted fg · Cinza-pedra', className: 'bg-muted-foreground' },
  { name: 'Border · Linha-clara', className: 'border bg-border' },
  { name: 'Positivo · Verde-salva', className: 'bg-[#2E9E6B]' },
  { name: 'Atenção · Âmbar-fosco', className: 'bg-[#C98A2D]' },
  { name: 'Erro · Telha', className: 'bg-destructive' },
] as const;

const TYPE_SCALE = [
  { label: 'Número-herói · 44 ExtraBold', className: 'text-[44px] font-extrabold tabular-nums leading-none', sample: 'R$ 87,50' },
  { label: 'Título de tela · 26 Bold', className: 'text-[26px] font-bold', sample: 'Quem comeu o quê?' },
  { label: 'Valor em lista · 20 ExtraBold', className: 'text-xl font-extrabold tabular-nums', sample: 'R$ 30,00' },
  { label: 'Corpo · 17 Regular', className: 'text-[17px]', sample: 'Picanha ao ponto' },
  { label: 'Legenda · 14 Regular', className: 'text-sm text-muted-foreground', sample: 'Taxa de serviço incluída' },
  { label: 'Rótulo mínimo · 12 caps +6%', className: 'text-xs uppercase tracking-[0.06em] text-muted-foreground', sample: 'Pendente' },
] as const;

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="space-y-2">
      <div className={`h-16 rounded-lg ${name.includes('Névoa') || name.includes('Papel') || name.includes('Linha') ? '' : ''} ${className}`} />
      <p className="text-sm font-medium">{name}</p>
    </div>
  );
}

export function OverviewPage() {
  const [selected, setSelected] = useState<string[]>(['Joaquim']);
  const toggle = (name: string) =>
    setSelected((current) =>
      current.includes(name)
        ? current.filter((n) => n !== name)
        : [...current, name],
    );

  return (
    <div className="space-y-4">
      <section className="rounded-xl border bg-card p-5 text-card-foreground">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Imediato, redondo, calmo
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          A atitude do Shazam na mesa do restaurante: uma tela quase vazia, um
          gesto central que resolve tudo, resultado em segundos. Superfícies
          neutras, ação em acento, dinheiro em tinta escura.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {CORE_SWATCHES.map((swatch) => (
            <Swatch key={swatch.name} {...swatch} />
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border bg-card p-5 text-card-foreground">
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Botões — herói, primário, secundário
          </h2>
          <div className="mt-4 flex items-center gap-6">
            <Button variant="hero" aria-label="Fotografar a conta">
              <Camera />
            </Button>
            <div className="flex-1 space-y-3">
              <Button size="lg">Dividir a conta</Button>
              <Button variant="secondary" size="lg">
                Agora não
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-5 text-card-foreground">
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Campo de revisão e etiquetas de status
          </h2>
          <div className="mt-4 space-y-3">
            <Input placeholder="Descrição do item" />
            <Input aria-invalid="true" defaultValue="P1c4nh4 a0 p0nt0" />
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="paid">Pago</Badge>
              <Badge variant="pending">Pendente</Badge>
              <Badge variant="pending">Sem dono</Badge>
              <Badge variant="error">Falha na leitura</Badge>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-xl border bg-background p-5">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Cartão de item e chips de pessoa (interativo)
        </h2>
        <div className="mt-4 max-w-md space-y-4">
          <ItemCard
            description="Picanha ao ponto"
            value="R$ 87,50"
            people={[
              { name: 'Joaquim', selected: selected.includes('Joaquim') },
              { name: 'Estevão', selected: selected.includes('Estevão') },
              { name: 'Artur', selected: selected.includes('Artur') },
            ]}
            onTogglePerson={toggle}
          />
          <ItemCard
            description="Couvert artístico"
            value="R$ 15,00"
            people={[{ name: 'Joaquim' }, { name: 'Estevão' }]}
          />
          <div className="flex flex-wrap gap-2">
            <PersonChip name="Marina" selected />
            <PersonChip name="Pedro" />
          </div>
        </div>
      </section>
    </div>
  );
}

export function ColorsPage() {
  return (
    <div className="space-y-8 rounded-xl border bg-card p-6 text-card-foreground">
      <section className="space-y-4">
        <div>
          <h2 className="font-semibold">Paleta central</h2>
          <p className="text-sm text-muted-foreground">
            Paleta neutra com um único acento. O Azul-profundo aparece uma vez
            por tela, na ação principal — nunca em dois elementos competindo.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {CORE_SWATCHES.map((swatch) => (
            <Swatch key={swatch.name} {...swatch} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-semibold">Papéis por situação, não por estética</h2>
          <p className="text-sm text-muted-foreground">
            Superfícies neutras, ação em acento, dinheiro em tinta escura.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {SUPPORTING_SWATCHES.map((swatch) => (
            <Swatch key={swatch.name} {...swatch} />
          ))}
        </div>
      </section>

      <Guidelines
        items={[
          { kind: 'do', text: 'Dinheiro é sempre Grafite, em qualquer contexto — dívida não é vermelha, crédito não é verde.' },
          { kind: 'do', text: 'Verde-salva apenas no ato de confirmar; Âmbar marca o que ainda precisa de decisão.' },
          { kind: 'dont', text: 'Vermelho para valores devidos — Telha é só para erro de sistema.' },
          { kind: 'dont', text: 'Cor, raio ou espaçamento fora das tabelas do DESIGN.md sem registrar a mudança lá primeiro.' },
        ]}
      />
    </div>
  );
}

export function FontsPage() {
  return (
    <div className="space-y-8 rounded-xl border bg-card p-6 text-card-foreground">
      <section>
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Família única — Nunito
        </h2>
        <p className="mt-4 text-4xl font-extrabold">R$ 87,50 fecha no centavo</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Terminais arredondados, a mesma personalidade dos cantos do app.
          Hierarquia se faz com peso e tamanho — nunca com uma segunda família.
        </p>
      </section>

      <section className="space-y-4 border-t pt-6">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Escala
        </h2>
        {TYPE_SCALE.map((entry) => (
          <div key={entry.label} className="grid gap-2 sm:grid-cols-[220px_1fr]">
            <span className="pt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {entry.label}
            </span>
            <p className={entry.className}>{entry.sample}</p>
          </div>
        ))}
      </section>

      <Guidelines
        items={[
          { kind: 'do', text: 'Valores em dinheiro sempre em ExtraBold, sempre com centavos ("R$ 30,00", nunca "R$ 30"), com algarismos tabulares.' },
          { kind: 'do', text: 'Máximo de dois tamanhos de texto por cartão.' },
          { kind: 'dont', text: 'Fonte fina, condensada ou uma segunda família — Light e Thin são proibidos.' },
        ]}
      />
    </div>
  );
}

export function LayoutPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-xl border bg-card p-6 text-card-foreground">
        <h2 className="font-semibold">Grade de 8</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Todo espaçamento é múltiplo de 8pt: 8, 16, 24, 32, 48. O 4pt existe só
          para ajuste fino interno. Margem lateral de tela: 24pt. Entre cartões:
          16pt. Uma coluna, sempre.
        </p>
        <div className="mt-6 space-y-4">
          {[
            { label: '8', className: 'w-2' },
            { label: '16', className: 'w-4' },
            { label: '24', className: 'w-6' },
            { label: '32', className: 'w-8' },
            { label: '48', className: 'w-12' },
          ].map((space) => (
            <div key={space.label} className="flex items-center gap-4">
              <span className="w-8 text-xs text-muted-foreground">
                {space.label}
              </span>
              <div className={`h-3 rounded-full bg-primary ${space.className}`} />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6 text-card-foreground">
        <h2 className="font-semibold">Tudo é redondo — e está tabelado</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Raio mínimo 16pt. Em dúvida, arredonde mais.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4">
          {[
            { label: 'Campos · 16pt', className: 'rounded-2xl' },
            { label: 'Cartões · 24pt', className: 'rounded-3xl' },
            { label: 'Folha modal · 28pt (topo)', className: 'rounded-t-[28px]' },
            { label: 'Botões · cápsula', className: 'rounded-full' },
          ].map((radius) => (
            <div
              key={radius.label}
              className={`flex h-24 items-end border bg-muted p-3 ${radius.className}`}
            >
              <span className="text-xs font-medium">{radius.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Guidelines
            items={[
              { kind: 'do', text: 'A ação principal mora no terço inferior — zona do polegar.' },
              { kind: 'dont', text: 'Sombras coloridas, brilhos, vidro fosco ou paralaxe — profundidade serve à hierarquia.' },
              { kind: 'dont', text: 'Elemento solto: todo conteúdo vive em cartão ou lista; a Névoa só recebe o título da tela.' },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
