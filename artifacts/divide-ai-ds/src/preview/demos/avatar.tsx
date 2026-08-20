import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Row, Guidelines } from '../parts';

export function AvatarDemo() {
  return (
    <div className="space-y-8 rounded-xl border bg-card p-6 text-card-foreground">
      <Row label="Inicial sobre fundo neutro">
        {['Joaquim', 'Estevão', 'Artur', 'Marina'].map((name) => (
          <div key={name} className="flex flex-col items-center gap-1.5">
            <Avatar>
              <AvatarFallback className="bg-secondary font-bold text-foreground">
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{name}</span>
          </div>
        ))}
      </Row>
      <Row label="Tamanhos">
        <Avatar className="h-7 w-7">
          <AvatarFallback className="bg-secondary text-xs font-bold text-foreground">
            J
          </AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback className="bg-secondary font-bold text-foreground">
            J
          </AvatarFallback>
        </Avatar>
        <Avatar className="h-14 w-14">
          <AvatarFallback className="bg-secondary text-lg font-bold text-foreground">
            J
          </AvatarFallback>
        </Avatar>
      </Row>
      <Guidelines
        items={[
          { kind: 'do', text: 'Sempre círculos com a inicial do nome sobre fundo neutro — cadastro instantâneo.' },
          { kind: 'dont', text: 'Foto de perfil na v1.' },
        ]}
      />
    </div>
  );
}
