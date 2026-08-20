import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { ScanProgress } from "@workspace/divide-ai-ds/components/ui/scan-progress";

function NunitoFont() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap"
      />
    </>
  );
}

const ACHADOS = [
  "Bar do Zé, hoje",
  "12 itens encontrados",
  "Taxa de serviço de 10%",
];

const STATUS = ["Lendo a conta…", "Separando os itens…", "Conferindo os centavos…"];

export default function Leitura() {
  const [passo, setPasso] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setPasso((p) => Math.min(p + 1, ACHADOS.length)),
      1600
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-background font-['Nunito',sans-serif] text-foreground flex flex-col">
      <NunitoFont />

      {/* The circle is the star — nearly empty screen */}
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <ScanProgress
          size={128}
          label={STATUS[Math.min(passo, STATUS.length - 1)]}
        />

        {/* What it found so far — quiet, appearing lines */}
        <div className="mt-8 min-h-24 w-full max-w-64 space-y-2" aria-live="polite">
          {ACHADOS.slice(0, passo).map((linha) => (
            <div
              key={linha}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#2E9E6B] text-white">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              {linha}
            </div>
          ))}
        </div>
      </main>

      <footer className="flex justify-center px-6 pb-12">
        <Button variant="ghost" className="min-h-12 rounded-full px-6 text-sm text-muted-foreground">
          Cancelar leitura
        </Button>
      </footer>
    </div>
  );
}
