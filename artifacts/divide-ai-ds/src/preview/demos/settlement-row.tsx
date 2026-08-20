import { useState } from 'react';
import { Check } from 'lucide-react';
import { SettlementRow } from '../../components/ui/settlement-row';
import { Card } from '../../components/ui/card';
import { Stack, Guidelines } from '../parts';

export function SettlementRowDemo() {
  const [paid, setPaid] = useState<string[]>(['Estevão']);
  const toggle = (name: string) =>
    setPaid((current) =>
      current.includes(name)
        ? current.filter((n) => n !== name)
        : [...current, name],
    );

  const rows = [
    { name: 'Joaquim', value: 'R$ 87,50' },
    { name: 'Estevão', value: 'R$ 43,75' },
    { name: 'Artur', value: 'R$ 31,00' },
  ];

  return (
    <div className="space-y-8 rounded-xl border bg-background p-6">
      <Stack label="Fechamento (interativo — toque para confirmar pagamento)">
        <Card className="max-w-md">
          <div className="divide-y divide-border px-4">
            {rows.map((row) => (
              <button
                key={row.name}
                type="button"
                className="block w-full text-left"
                onClick={() => toggle(row.name)}
              >
                <SettlementRow
                  name={row.name}
                  value={row.value}
                  paid={paid.includes(row.name)}
                />
              </button>
            ))}
          </div>
        </Card>
        <p className="flex items-center gap-1.5 text-sm font-bold text-[#2E9E6B]">
          <Check className="h-4 w-4" strokeWidth={3} /> Fecha com o total: R$ 162,25
        </p>
      </Stack>
      <Guidelines
        items={[
          { kind: 'do', text: 'Nome e valor são um par inseparável — mesma linha, valor em ExtraBold tabular.' },
          { kind: 'do', text: 'Ao confirmar: selo Verde-salva com ✓ e a linha inteira a 60% de opacidade.' },
          { kind: 'dont', text: 'Linha pontilhada entre nome e valor, ou valores devidos em vermelho.' },
        ]}
      />
    </div>
  );
}
