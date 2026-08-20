import { EmptyState } from '../../components/ui/empty-state';
import { Card } from '../../components/ui/card';
import { Stack, Guidelines } from '../parts';

export function EmptyStateDemo() {
  return (
    <div className="space-y-8 rounded-xl border bg-background p-6">
      <Stack label="Nenhum rolê ainda">
        <Card className="max-w-md">
          <EmptyState
            title="Nenhum rolê ainda"
            description="Fotografe a primeira conta para começar."
            actionLabel="Fotografar a conta"
          />
        </Card>
      </Stack>
      <Guidelines
        items={[
          { kind: 'do', text: 'Título Bold 26 + uma frase Regular 17 + botão primário. Nada mais.' },
          { kind: 'dont', text: 'Ilustração no estado vazio — não existe ilustração na v1.' },
        ]}
      />
    </div>
  );
}
