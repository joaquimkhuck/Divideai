import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

// Divide Aí — in-flow draft state (photo → revisar → pessoas → quem-comeu).
// This lives ONLY on the client. The bill is created on the server at the end
// of quem-comeu (POST /bills).

export interface DraftItem {
  /** stable local id for React keys / editing */
  key: string;
  description: string;
  quantity: number;
  unitPriceCents: number;
  /** indexes into `people` who share this item */
  personIndexes: number[];
}

export interface DraftState {
  restaurantName: string | null;
  serviceFeePercent: number;
  couvertCents: number;
  detectedTotalCents: number | null;
  items: DraftItem[];
  people: string[];
  /** downscaled JPEG data URL of the chosen photo, for preview */
  photoPreview: string | null;
}

interface DraftContextValue {
  draft: DraftState;
  setDraft: React.Dispatch<React.SetStateAction<DraftState>>;
  resetDraft: () => void;
}

const emptyDraft: DraftState = {
  restaurantName: null,
  serviceFeePercent: 10,
  couvertCents: 0,
  detectedTotalCents: null,
  items: [],
  people: [],
  photoPreview: null,
};

let seq = 0;
export function newItemKey(): string {
  seq += 1;
  return `item-${Date.now()}-${seq}`;
}

const DraftContext = createContext<DraftContextValue | null>(null);

export function DraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<DraftState>(emptyDraft);

  const value = useMemo<DraftContextValue>(
    () => ({
      draft,
      setDraft,
      resetDraft: () => setDraft({ ...emptyDraft }),
    }),
    [draft]
  );

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useDraft(): DraftContextValue {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used within DraftProvider");
  return ctx;
}

/** Subtotal of items only (qty × unit price). */
export function draftSubtotalCents(draft: DraftState): number {
  return draft.items.reduce(
    (sum, it) => sum + it.quantity * it.unitPriceCents,
    0
  );
}

/** Service fee is computed on items + couvert — must match the server (split.ts). */
export function draftFeeCents(draft: DraftState): number {
  const base = draftSubtotalCents(draft) + draft.couvertCents;
  return Math.round((base * draft.serviceFeePercent) / 100);
}

/** Grand total = subtotal + couvert + service fee. */
export function draftTotalCents(draft: DraftState): number {
  return draftSubtotalCents(draft) + draft.couvertCents + draftFeeCents(draft);
}
