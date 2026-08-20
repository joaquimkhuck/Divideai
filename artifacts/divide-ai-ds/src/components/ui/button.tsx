import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

// Divide Aí — DESIGN.md §7:
// - Botão primário: cápsula 56pt, fundo Azul-profundo, rótulo Bold 17 branco.
//   Desabilitado: fundo Linha-clara, texto Cinza-pedra (sem opacity).
// - Botão secundário: mesma cápsula, transparente, borda 1,5pt Grafite.
// - Botão-herói: círculo 96pt, ícone branco, sombra teatral, anel pulsante quando ocioso.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(42,92,255,0.24)] active:translate-y-px active:bg-accent-foreground disabled:bg-border disabled:text-muted-foreground disabled:shadow-none",
        secondary:
          "border-[1.5px] border-foreground bg-transparent text-foreground active:bg-secondary disabled:border-border disabled:text-muted-foreground",
        hero:
          "relative h-24 w-24 rounded-full bg-primary text-primary-foreground shadow-[0_8px_32px_rgba(42,92,255,0.18)] active:translate-y-0.5 active:bg-accent-foreground [&_svg]:size-9 before:absolute before:-inset-2 before:rounded-full before:border-2 before:border-primary/40 before:animate-ping before:[animation-duration:2.2s] motion-reduce:before:animate-none",
        ghost:
          "font-bold text-foreground active:bg-secondary disabled:text-muted-foreground",
        link: "text-primary underline-offset-4 hover:underline disabled:text-muted-foreground",
      },
      size: {
        default: "min-h-14 px-8 text-[17px] [&_svg]:size-5",
        sm: "min-h-9 px-5 text-sm [&_svg]:size-4",
        lg: "min-h-14 w-full px-8 text-[17px] [&_svg]:size-5",
        icon: "h-12 w-12 [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          variant === "hero" && "h-24 w-24 min-h-0 p-0",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
