"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "../../lib/utils"

// Divide Aí — DESIGN.md §7 Folha de cobrança / §5 nível 2 / §6:
// bottom sheet com raio 28 nos cantos superiores, sombra ampla (blur 24, 12%),
// fundo escurecido a 40%. Conteúdo típico: valor-herói da pessoa cobrada,
// chave Pix copiável e botão primário "Cobrar no WhatsApp".
const ChargeSheet = (
  props: React.ComponentProps<typeof DrawerPrimitive.Root>
) => <DrawerPrimitive.Root {...props} />
ChargeSheet.displayName = "ChargeSheet"

const ChargeSheetTrigger = DrawerPrimitive.Trigger
const ChargeSheetClose = DrawerPrimitive.Close
const ChargeSheetPortal = DrawerPrimitive.Portal
const ChargeSheetTitle = DrawerPrimitive.Title
const ChargeSheetDescription = DrawerPrimitive.Description

const ChargeSheetOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/40", className)}
    {...props}
  />
))
ChargeSheetOverlay.displayName = "ChargeSheetOverlay"

const ChargeSheetContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <ChargeSheetPortal>
    <ChargeSheetOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[28px] bg-card text-card-foreground shadow-[0_-8px_24px_rgba(31,35,40,0.12)]",
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-border" />
      {children}
    </DrawerPrimitive.Content>
  </ChargeSheetPortal>
))
ChargeSheetContent.displayName = "ChargeSheetContent"

// Chave Pix copiável — parte da folha de cobrança (DESIGN.md §7).
export interface ChargeSheetPixFieldProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pixKey: string
  label?: string
  onCopied?: (pixKey: string) => void
}

const ChargeSheetPixField = React.forwardRef<
  HTMLButtonElement,
  ChargeSheetPixFieldProps
>(({ className, pixKey, label = "Chave Pix", onCopied, onClick, ...props }, ref) => (
  <button
    type="button"
    ref={ref}
    className={cn(
      "flex w-full items-center justify-between gap-4 rounded-2xl border border-input bg-card px-4 py-3 text-left transition-colors active:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    onClick={(event) => {
      onClick?.(event)
      if (!event.defaultPrevented) {
        void navigator.clipboard?.writeText(pixKey).catch(() => {})
        onCopied?.(pixKey)
      }
    }}
    {...props}
  >
    <span className="min-w-0">
      <span className="block text-xs uppercase tracking-[0.06em] text-muted-foreground">
        {label}
      </span>
      <span className="block truncate text-[17px] font-bold text-foreground">
        {pixKey}
      </span>
    </span>
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 shrink-0 text-primary"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  </button>
))
ChargeSheetPixField.displayName = "ChargeSheetPixField"

export {
  ChargeSheet,
  ChargeSheetPixField,
  ChargeSheetTrigger,
  ChargeSheetClose,
  ChargeSheetContent,
  ChargeSheetOverlay,
  ChargeSheetPortal,
  ChargeSheetTitle,
  ChargeSheetDescription,
}
