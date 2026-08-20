import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Stack, Guidelines } from '../parts';

export function CardDemo() {
  return (
    <div className="space-y-8 rounded-xl border bg-background p-6">
      <Stack label="Cartão — papel sobre a mesa">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Churrasco do Joaquim</CardTitle>
            <CardDescription>Sexta, 12 itens · 4 pessoas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-[44px] font-extrabold leading-none tabular-nums">
              R$ 162,25
            </p>
          </CardContent>
          <CardFooter>
            <Button size="lg">Ver fechamento</Button>
          </CardFooter>
        </Card>
      </Stack>
      <Guidelines
        items={[
          { kind: 'do', text: 'Papel, raio 24, sombra mínima (blur 8, 6%) — profundidade a serviço da hierarquia.' },
          { kind: 'do', text: 'Todo conteúdo vive em cartão ou lista; a Névoa só recebe o título da tela.' },
          { kind: 'dont', text: 'Sombras coloridas, vidro fosco ou mais de dois tamanhos de texto por cartão.' },
        ]}
      />
    </div>
  );
}
