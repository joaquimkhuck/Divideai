import { useState } from 'react';
import { PersonChip } from '../../components/ui/person-chip';
import { Stack, Guidelines } from '../parts';

const NAMES = ['Joaquim Huck', 'Estevão Antunes', 'Artur Bresser', 'Marina'];

export function PersonChipDemo() {
  const [selected, setSelected] = useState<string[]>(['Joaquim Huck']);
  const toggle = (name: string) =>
    setSelected((current) =>
      current.includes(name)
        ? current.filter((n) => n !== name)
        : [...current, name],
    );

  return (
    <div className="space-y-8 rounded-xl border bg-card p-6 text-card-foreground">
      <Stack label="Quem comeu isto? (interativo — toque para atribuir)">
        <div className="flex flex-wrap gap-2">
          {NAMES.map((name) => (
            <PersonChip
              key={name}
              name={name}
              selected={selected.includes(name)}
              onClick={() => toggle(name)}
            />
          ))}
        </div>
      </Stack>
      <Stack label="Estados">
        <div className="flex flex-wrap gap-2">
          <PersonChip name="Selecionado" selected />
          <PersonChip name="Disponível" />
          <PersonChip name="Desabilitado" disabled />
        </div>
      </Stack>
      <Guidelines
        items={[
          { kind: 'do', text: 'Use chips de pessoa para qualquer atribuição — é o gesto que o usuário aprende uma vez e repete sempre.' },
          { kind: 'do', text: 'Avatares são círculos com a inicial do nome sobre fundo neutro — cadastro instantâneo, sem foto na v1.' },
        ]}
      />
    </div>
  );
}
