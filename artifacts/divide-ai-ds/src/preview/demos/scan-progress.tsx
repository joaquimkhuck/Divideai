import { ScanProgress } from '../../components/ui/scan-progress';
import { Stack, Guidelines } from '../parts';

export function ScanProgressDemo() {
  return (
    <div className="space-y-8 rounded-xl border bg-background p-6">
      <Stack label="Leitura da conta">
        <div className="flex flex-wrap items-end gap-10 py-4">
          <ScanProgress />
          <ScanProgress size={128} label="Separando os itens…" />
        </div>
      </Stack>
      <Guidelines
        items={[
          { kind: 'do', text: 'Anel circular Azul-profundo girando sobre a miniatura da foto — o círculo é a marca até no carregamento.' },
          { kind: 'dont', text: 'Barra de progresso horizontal ou esqueleto cinza.' },
        ]}
      />
    </div>
  );
}
