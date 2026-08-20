import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Camera, History, Images } from "lucide-react";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { useGetStats, getGetStatsQueryKey } from "@workspace/api-client-react";
import { PhoneShell } from "@/components/phone-shell";
import { useDraft } from "@/store/draft";
import { fileToDownscaledBase64 } from "@/lib/image";
import { formatCents } from "@/lib/money";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@workspace/divide-ai-ds/lib/utils";

const MAX_SIDE = 1600;

export default function Home() {
  const [, setLocation] = useLocation();
  const { resetDraft, setDraft } = useDraft();
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const { toast } = useToast();

  const { data: stats } = useGetStats({
    query: { queryKey: getGetStatsQueryKey() },
  });

  const pendingCount = stats?.pendingPeople?.length ?? 0;
  const pendingCents = stats?.pendingCents ?? 0;

  // Live viewfinder (iScanner style). Falls back to the file input when
  // the camera is unavailable or permission is denied.
  useEffect(() => {
    let cancelled = false;
    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setCameraReady(true);
      } catch {
        setCameraReady(false);
      }
    }
    void start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  const goToLeitura = (base64: string) => {
    resetDraft();
    setDraft((d) => ({ ...d, photoPreview: base64 }));
    setLocation("/leitura", { state: { imageBase64: base64 } });
  };

  const handleFile = async (file: File) => {
    try {
      const base64 = await fileToDownscaledBase64(file);
      goToLeitura(base64);
    } catch {
      toast({
        title: "Não consegui abrir essa imagem",
        description: "Tente escolher outra foto.",
        variant: "destructive",
      });
    }
  };

  const captureFrame = () => {
    const video = videoRef.current;
    if (!cameraReady || !video || video.videoWidth === 0) {
      inputRef.current?.click();
      return;
    }
    const scale = Math.min(
      1,
      MAX_SIDE / Math.max(video.videoWidth, video.videoHeight),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      inputRef.current?.click();
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    goToLeitura(canvas.toDataURL("image/jpeg", 0.8));
  };

  return (
    <PhoneShell>
      {/* Top: brand + quiet pending mention */}
      <header className="flex items-center justify-between px-6 pt-8">
        <p className="text-[26px] font-bold leading-none" data-testid="text-brand">
          Divide Aí
        </p>
        {pendingCount > 0 && (
          <button
            type="button"
            onClick={() => setLocation("/roles")}
            data-testid="button-pending-hint"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5"
          >
            <span className="text-xs uppercase tracking-[0.06em] text-muted-foreground">
              Pendente
            </span>
            <span className="text-sm font-extrabold tabular-nums">
              {formatCents(pendingCents)}
            </span>
          </button>
        )}
      </header>

      {/* Center: live viewfinder */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 pt-6">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          data-testid="input-photo"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />

        <div
          className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-foreground/90"
          style={{ aspectRatio: "3 / 4" }}
          data-testid="camera-viewfinder"
        >
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={cn(
              "h-full w-full object-cover transition-opacity duration-300",
              cameraReady ? "opacity-100" : "opacity-0",
            )}
          />
          {!cameraReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
              <Camera className="size-8 text-background/70" />
              <p className="px-8 text-sm text-background/70">
                Aponte para a conta ou escolha uma foto
              </p>
            </div>
          )}
          {/* Corner guides, iScanner style */}
          <div className="pointer-events-none absolute inset-4">
            {(["top-0 left-0 border-t-2 border-l-2 rounded-tl-lg",
               "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg",
               "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
               "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg",
             ] as const).map((pos) => (
              <span
                key={pos}
                className={cn("absolute size-7 border-background/80", pos)}
              />
            ))}
          </div>
        </div>

        <p className="mt-5 text-[17px] text-muted-foreground">Fotografe a conta</p>
        <p className="mt-1 text-sm text-muted-foreground/80">
          A mesa resolve o resto em segundos
        </p>
      </main>

      {/* Bottom: capture (lower, iScanner style) + gallery + history */}
      <footer className="flex flex-col items-center gap-7 px-6 pb-8 pt-6">
        <div className="relative flex w-full items-center justify-center">
          <Button
            variant="hero"
            aria-label="Fotografar a conta"
            data-testid="button-capture"
            onClick={captureFrame}
            className="size-[76px]"
          >
            <Camera />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Escolher da galeria"
            data-testid="button-gallery"
            onClick={() => inputRef.current?.click()}
            className="absolute right-4 size-12 rounded-full text-muted-foreground"
          >
            <Images className="size-5" />
          </Button>
        </div>
        <Button
          variant="ghost"
          data-testid="link-history"
          onClick={() => setLocation("/roles")}
          className="min-h-12 gap-2 rounded-full px-6 text-sm text-muted-foreground"
        >
          <History className="size-4" />
          Rolês anteriores
        </Button>
      </footer>
    </PhoneShell>
  );
}
