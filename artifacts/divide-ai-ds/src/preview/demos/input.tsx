import { Input } from '../../components/ui/input';
import { Stack, Guidelines } from '../parts';

export function InputDemo() {
  return (
    <div className="space-y-8 rounded-xl border bg-background p-6">
      <Stack label="Campo de revisão">
        <div className="max-w-sm space-y-3">
          <Input placeholder="Descrição do item" />
          <Input defaultValue="Picanha ao ponto" />
        </div>
      </Stack>
      <Stack label="Erro de leitura — borda Telha + legenda">
        <div className="max-w-sm space-y-1.5">
          <Input aria-invalid="true" defaultValue="P1c4nh4 a0 p0nt0" />
          <p className="text-sm text-destructive">
            Não conseguimos ler este item. Confira a descrição na foto.
          </p>
        </div>
      </Stack>
      <Stack label="Desabilitado">
        <div className="max-w-sm">
          <Input disabled placeholder="Taxa de serviço (10%)" />
        </div>
      </Stack>
      <Guidelines
        items={[
          { kind: 'do', text: 'Em foco, a borda vira Azul-profundo 2pt; erro marca a borda em Telha com legenda explicando o que conferir.' },
          { kind: 'dont', text: 'Usar Telha para "dívida" — Telha é só para erro de sistema.' },
        ]}
      />
    </div>
  );
}
