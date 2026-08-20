import { Camera } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Row, Stack, Guidelines } from '../parts';

export function ButtonDemo() {
  return (
    <div className="space-y-8 rounded-xl border bg-card p-6 text-card-foreground">
      <Stack label="Botão-herói (fotografar conta)">
        <div className="flex items-center gap-6 py-4">
          <Button variant="hero" aria-label="Fotografar a conta">
            <Camera />
          </Button>
          <p className="max-w-sm text-sm text-muted-foreground">
            Círculo de 96pt, só na tela inicial. Anel pulsante quando ocioso —
            nenhum outro elemento pode pulsar. Pressionado, afunda e escurece
            para Azul-noite.
          </p>
        </div>
      </Stack>
      <Stack label="Botão primário — um por tela, no rodapé">
        <div className="max-w-sm space-y-3">
          <Button size="lg">Dividir a conta</Button>
          <Button size="lg" disabled>
            Dividir a conta
          </Button>
        </div>
      </Stack>
      <Stack label="Botão secundário">
        <div className="max-w-sm space-y-3">
          <Button variant="secondary" size="lg">
            Agora não
          </Button>
        </div>
      </Stack>
      <Row label="Apoio">
        <Button variant="ghost">Editar</Button>
        <Button variant="link">Ver detalhes</Button>
        <Button size="sm">Compacto</Button>
      </Row>
      <Guidelines
        items={[
          { kind: 'do', text: 'Uma ação principal por tela, em Azul-profundo, no terço inferior.' },
          { kind: 'do', text: 'Rótulos escritos como gente: "Quem comeu isto?", não "Selecionar participantes".' },
          { kind: 'dont', text: 'Duas ações em acento na mesma tela, ou acento em elemento decorativo.' },
          { kind: 'dont', text: 'Cantos retos em elementos interativos — botões são sempre cápsulas.' },
        ]}
      />
    </div>
  );
}
