---
name: Mockup sandbox Tailwind quirk
description: Arbitrary Tailwind color classes can fail to compile in DS mockup entries
---

In the mockup sandbox's design-system entries (`src/ds/<slug>/`), arbitrary Tailwind color classes (e.g. `bg-[#C4472F]`) don't always compile unless the same class already appears elsewhere in the scanned sources.

**Why:** the DS entry's Tailwind build scans the design-system package plus the mockups; a one-off arbitrary value can be missed.

**How to apply:** for one-off colors in mockup files, prefer inline `style={{}}` or the DS's semantic token classes (bg-background, text-primary, etc.).
