import { type ReactNode } from "react";
import { cn } from "@workspace/divide-ai-ds/lib/utils";

// Divide Aí is mobile-first (DESIGN.md §4, one column always). We constrain the
// content to a phone-width column and center it so it also reads well on desktop.
export function PhoneShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-[100dvh] bg-background font-sans text-foreground">
      <div
        className={cn(
          "mx-auto flex min-h-[100dvh] w-full max-w-md flex-col",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
