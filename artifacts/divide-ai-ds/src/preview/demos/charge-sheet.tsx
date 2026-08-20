import {
  ChargeSheet,
  ChargeSheetContent,
  ChargeSheetDescription,
  ChargeSheetPixField,
  ChargeSheetTitle,
  ChargeSheetTrigger,
} from '../../components/ui/charge-sheet';
import { Button } from '../../components/ui/button';
import { Stack, Guidelines } from '../parts';

export function ChargeSheetDemo() {
  return (
    <div className="space-y-8 rounded-xl border bg-background p-6">
      <Stack label="Folha de cobrança (interativo)">
        <div className="max-w-sm">
          <ChargeSheet>
            <ChargeSheetTrigger asChild>
              <Button size="lg">Cobrar Joaquim</Button>
            </ChargeSheetTrigger>
            <ChargeSheetContent>
              <div className="mx-auto w-full max-w-sm space-y-6 px-6 pb-8 pt-4">
                <div className="space-y-1 text-center">
                  <ChargeSheetTitle className="text-[17px] font-bold">
                    Parte do Joaquim
                  </ChargeSheetTitle>
                  <p className="text-[44px] font-extrabold leading-none tabular-nums">
                    R$ 87,50
                  </p>
                  <ChargeSheetDescription className="text-sm text-muted-foreground">
                    Picanha, couvert e refrigerante
                  </ChargeSheetDescription>
                </div>
                <ChargeSheetPixField pixKey="divideai@pix.com.br" />
                <Button size="lg">Cobrar no WhatsApp</Button>
              </div>
            </ChargeSheetContent>
          </ChargeSheet>
        </div>
      </Stack>
      <Guidelines
        items={[
          { kind: 'do', text: 'Raio 28 nos cantos superiores, fundo escurecido a 40%, valor-herói em ExtraBold 44.' },
          { kind: 'do', text: 'Texto da cobrança leve: "sua parte deu R$ X" — o app é o mensageiro simpático, nunca o cobrador.' },
          { kind: 'dont', text: 'Duas ações em acento na folha — o botão do WhatsApp é a única ação primária.' },
        ]}
      />
    </div>
  );
}
