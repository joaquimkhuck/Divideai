/* GENERATED FROM tokens.json -- DO NOT EDIT. Run scripts/build-tokens.mjs. */
// Portable design tokens (colors as hex). Web consumes the theme via
// src/index.css; mobile (Expo) and any other platform import this object so the
// whole product shares one source of truth.
export const tokens = {
  "color": {
    "light": {
      "background": "#F6F5F2",
      "foreground": "#1F2328",
      "border": "#E7E5E0",
      "card": "#FFFFFF",
      "cardForeground": "#1F2328",
      "popover": "#FFFFFF",
      "popoverForeground": "#1F2328",
      "primary": "#2A5CFF",
      "primaryForeground": "#FFFFFF",
      "secondary": "#ECEAE4",
      "secondaryForeground": "#1F2328",
      "muted": "#ECEAE4",
      "mutedForeground": "#6E7378",
      "accent": "#E4EAFF",
      "accentForeground": "#1E44C4",
      "destructive": "#C4472F",
      "destructiveForeground": "#FFFFFF",
      "input": "#E7E5E0",
      "ring": "#2A5CFF",
      "chart1": "#2A5CFF",
      "chart2": "#2E9E6B",
      "chart3": "#C98A2D",
      "chart4": "#1E44C4",
      "chart5": "#6E7378",
      "sidebar": "#FFFFFF",
      "sidebarForeground": "#1F2328",
      "sidebarBorder": "#E7E5E0",
      "sidebarPrimary": "#2A5CFF",
      "sidebarPrimaryForeground": "#FFFFFF",
      "sidebarAccent": "#F6F5F2",
      "sidebarAccentForeground": "#1F2328",
      "sidebarRing": "#2A5CFF"
    },
    "dark": {
      "background": "#15171A",
      "foreground": "#F3F2EF",
      "border": "#2A2E33",
      "card": "#1D2025",
      "cardForeground": "#F3F2EF",
      "popover": "#1D2025",
      "popoverForeground": "#F3F2EF",
      "primary": "#5B82FF",
      "primaryForeground": "#FFFFFF",
      "secondary": "#262A30",
      "secondaryForeground": "#F3F2EF",
      "muted": "#262A30",
      "mutedForeground": "#9AA0A6",
      "accent": "#22304F",
      "accentForeground": "#B9C8FF",
      "destructive": "#D8654C",
      "destructiveForeground": "#FFFFFF",
      "input": "#2A2E33",
      "ring": "#5B82FF",
      "chart1": "#5B82FF",
      "chart2": "#43B383",
      "chart3": "#D9A050",
      "chart4": "#8FA9FF",
      "chart5": "#9AA0A6",
      "sidebar": "#1D2025",
      "sidebarForeground": "#F3F2EF",
      "sidebarBorder": "#2A2E33",
      "sidebarPrimary": "#5B82FF",
      "sidebarPrimaryForeground": "#FFFFFF",
      "sidebarAccent": "#262A30",
      "sidebarAccentForeground": "#F3F2EF",
      "sidebarRing": "#5B82FF"
    }
  },
  "fontFamily": {
    "sans": [
      "Nunito",
      "sans-serif"
    ],
    "serif": [
      "Georgia",
      "serif"
    ],
    "mono": [
      "Menlo",
      "monospace"
    ]
  },
  "radius": "1rem",
  "spacing": "0.25rem"
} as const;

export type Tokens = typeof tokens;
export default tokens;
