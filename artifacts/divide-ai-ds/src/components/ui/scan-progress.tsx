import * as React from "react"

import { cn } from "../../lib/utils"

// Divide Aí — DESIGN.md §7 Barra de progresso da leitura:
// não é barra — é um anel circular Azul-profundo girando sobre a miniatura da
// foto da conta. Nunca barra horizontal, nunca esqueleto cinza.
export interface ScanProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Miniatura da foto da conta (opcional). */
  src?: string
  alt?: string
  label?: string
  size?: number
}

const ScanProgress = React.forwardRef<HTMLDivElement, ScanProgressProps>(
  (
    {
      className,
      src,
      alt = "Foto da conta",
      label = "Lendo a conta…",
      size = 96,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      role="status"
      aria-label={label}
      className={cn("inline-flex flex-col items-center gap-4", className)}
      {...props}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-2 overflow-hidden rounded-2xl bg-secondary">
          {src ? (
            <img src={src} alt={alt} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col justify-center gap-1 p-2">
              <div className="h-1 w-3/4 rounded-full bg-border" />
              <div className="h-1 w-full rounded-full bg-border" />
              <div className="h-1 w-2/3 rounded-full bg-border" />
            </div>
          )}
        </div>
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full animate-spin [animation-duration:1.4s] motion-reduce:animate-[spin_3s_linear_infinite]"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            strokeWidth="6"
            className="stroke-border"
          />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="90 200"
            className="stroke-primary"
          />
        </svg>
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
)
ScanProgress.displayName = "ScanProgress"

export { ScanProgress }
