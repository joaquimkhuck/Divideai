import { useRef } from "react";
import { useLocation } from "wouter";
import { ImageOff, Sun, Maximize2, Hand, Keyboard, Clock } from "lucide-react";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { Card } from "@workspace/divide-ai-ds/components/ui/card";
import { PhoneShell } from "@/components/phone-shell";
import { useDraft, newItemKey } from "@/store/draft";
import { fileToDownscaledBase64 } from "@/lib/image";
import { useToast } from "@/hooks/use-toast";

const checks = [
  { icon: Sun, text: "Boa luz — evite sombra sobre o papel" },
  { icon: Maximize2, text: "A conta inteira dentro da foto" },
  { icon: Hand, text: "Sem dedo ou copo na frente" },
];

export default function ErroLeitura() {
  const [, setLocation] = useLocation();
  const { setDraft } = useDraft();
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const navState = (window.history.state?.state ?? {}) as {
    rateLimited?: boolean;
  };
  const rateLimited = navState.rateLimited === true;

  const handleFile = async (file: File) => {
    try {
      const base64 = await fileToDownscaledBase64(file);
      setDraft((d) => ({ ...d, photoPreview: base64 }));
      setLocation("/leitura", { state: { imageBase64: base64 } });
    } catch {
      toast({
        title: "Não consegui abrir essa imagem",
        variant: "destructive",
      });
    }
  };

  const digitarNaMao = () => {
    // Start manual entry with a single empty editable item.
    setDraft((d) => ({
      ...d,
      photoPreview: null,
      detectedTotalCents: null,
      items: [
        {
          key: newItemKey(),
          description: "",
          quantity: 1,
          unitPriceCents: 0,
          personIndexes: [],
        },
      ],
    }));
    setLocation("/revisar");
  };

  if (rateLimited) {
    return (
      <PhoneShell className="px-6 pb-8 pt-14">
        <h1 className="text-[26px] font-bold leading-tight">
          Limite de leituras atingido
        </h1>

        <div className="mt-8 flex justify-center">
          <div className="flex flex-col items-center">
            <div
              className="flex items-center justify-center rounded-2xl bg-card shadow-[0_2px_8px_rgba(31,35,40,0.06)]"
              style={{ width: 128, height: 160, border: "2px solid #C4472F" }}
            >
              <Clock className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <span
              className="-mt-3 whitespace-nowrap rounded-full px-3 py-1 text-xs uppercase tracking-[0.06em] text-white"
              style={{ backgroundColor: "#C4472F" }}
            >
              Aguarde
            </span>
          </div>
        </div>

        <Card className="mt-10 p-4">
          <p className="text-[17px]">
            Você usou todas as leituras disponíveis nesta hora. Volte em breve
            e tente novamente — ou digite os itens na mão agora mesmo.
          </p>
        </Card>

        <div className="mt-auto flex flex-col gap-3 pt-8">
          <Button
            variant="secondary"
            size="lg"
            data-testid="button-manual-entry"
            onClick={digitarNaMao}
          >
            <Keyboard className="h-5 w-5" />
            Digitar itens na mão
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setLocation("/")}
          >
            Voltar ao início
          </Button>
        </div>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell className="px-6 pb-8 pt-14">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        data-testid="input-retry-photo"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      <h1 className="text-[26px] font-bold leading-tight">
        Não consegui ler essa foto
      </h1>

      <div className="mt-8 flex justify-center">
        <div className="flex flex-col items-center">
          <div
            className="flex items-center justify-center rounded-2xl bg-card shadow-[0_2px_8px_rgba(31,35,40,0.06)]"
            style={{ width: 128, height: 160, border: "2px solid #C4472F" }}
          >
            <ImageOff className="h-8 w-8 text-muted-foreground/60" />
          </div>
          <span
            className="-mt-3 whitespace-nowrap rounded-full px-3 py-1 text-xs uppercase tracking-[0.06em] text-white"
            style={{ backgroundColor: "#C4472F" }}
          >
            Sem leitura
          </span>
        </div>
      </div>

      <Card className="mt-10 p-4">
        <p className="text-xs uppercase tracking-[0.06em] text-muted-foreground">
          Vale conferir
        </p>
        <div className="mt-3 flex flex-col gap-3">
          {checks.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </span>
              <p className="text-[17px]">{text}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Button
          size="lg"
          data-testid="button-retry-photo"
          onClick={() => inputRef.current?.click()}
        >
          Tentar outra foto
        </Button>
        <Button
          variant="secondary"
          size="lg"
          data-testid="button-manual-entry"
          onClick={digitarNaMao}
        >
          <Keyboard className="h-5 w-5" />
          Digitar itens na mão
        </Button>
      </div>
    </PhoneShell>
  );
}
