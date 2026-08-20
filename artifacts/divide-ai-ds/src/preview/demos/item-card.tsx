import { useState } from 'react';
import { ItemCard } from '../../components/ui/item-card';
import { Stack, Guidelines } from '../parts';

export function ItemCardDemo() {
  const [selected, setSelected] = useState<string[]>(['Joaquim']);
  const toggle = (name: string) =>
    setSelected((current) =>
      current.includes(name)
        ? current.filter((n) => n !== name)
        : [...current, name],
    );

  return (
    <div className="space-y-8 rounded-xl border bg-background p-6">
      <Stack label="Item atribuído (interativo)">
        <div className="max-w-md">
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
        </div>
      </Stack>
      <Stack label="Item sem dono — etiqueta Âmbar guia o olho">
        <div className="max-w-md">
          <ItemCard
            description="Couvert artístico"
            value="R$ 15,00"
            people={[{ name: 'Joaquim' }, { name: 'Estevão' }]}
          />
        </div>
      </Stack>
      <Stack label="Item simples">
        <div className="max-w-md">
          <ItemCard
            description="Suco de laranja"
            value="R$ 12,00"
            people={[{ name: 'Marina', selected: true }]}
          />
        </div>
      </Stack>
      <Guidelines
        items={[
          { kind: 'do', text: 'Valores sempre em ExtraBold, com centavos, em Grafite — "R$ 30,00", nunca "R$ 30".' },
          { kind: 'do', text: 'Nome e valor formam par inseparável na mesma linha — nunca separados por linha pontilhada.' },
          { kind: 'dont', text: 'Tabela densa de números — a unidade é a linha nome + valor.' },
          { kind: 'dont', text: 'Mais de dois tamanhos de texto por cartão.' },
        ]}
      />
    </div>
  );
}
