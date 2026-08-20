import { Badge } from '../../components/ui/badge';
import { Row, Guidelines } from '../parts';

export function BadgeDemo() {
  return (
    <div className="space-y-8 rounded-xl border bg-card p-6 text-card-foreground">
      <Row label="Status">
        <Badge variant="paid">Pago</Badge>
        <Badge variant="pending">Pendente</Badge>
        <Badge variant="pending">Sem dono</Badge>
        <Badge variant="error">Falha na leitura</Badge>
      </Row>
      <Row label="Apoio">
        <Badge>Destaque</Badge>
        <Badge variant="outline">Neutro</Badge>
      </Row>
      <Guidelines
        items={[
          { kind: 'do', text: 'Verde-salva só no ato de confirmar ("Fulano pagou ✓"), nunca no valor em si.' },
          { kind: 'do', text: 'Âmbar marca o que ainda precisa de decisão — guia o olho sem gritar.' },
          { kind: 'dont', text: 'Vermelho para valores devidos — dinheiro é sempre Grafite; Telha é só erro de sistema.' },
        ]}
      />
    </div>
  );
}
