import { Camera, History } from "lucide-react";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";

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

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      <NunitoFont />

      {/* Top: quiet credits hint */}
      <header className="flex items-center justify-between px-6 pt-8">
        <p className="text-[26px] font-bold leading-none">Divide Aí</p>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5">
          <span className="text-xs uppercase tracking-[0.06em] text-muted-foreground">
            Créditos
          </span>
          <span className="text-sm font-extrabold tabular-nums">3</span>
        </div>
      </header>

      {/* Center: the screen IS the button */}
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <Button variant="hero" aria-label="Fotografar a conta">
          <Camera />
        </Button>
        <p className="mt-8 text-[17px] text-muted-foreground">
          Fotografe a conta
        </p>
        <p className="mt-1 text-sm text-muted-foreground/80">
          A mesa resolve o resto em segundos
        </p>
      </main>

      {/* Bottom third: quiet entry to history */}
      <footer className="flex justify-center px-6 pb-12">
        <Button variant="ghost" className="min-h-12 gap-2 rounded-full px-6 text-sm text-muted-foreground">
          <History className="size-4" />
          Rolês anteriores
        </Button>
      </footer>
    </div>
  );
}
