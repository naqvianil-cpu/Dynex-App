// DYNEX brand palette (from DYNEX | Brand Guideline, Ver. 02 2025):
// deep navy as the primary ink/brand color, periwinkle blue as the accent.
// Sampled directly from the brand's logo files rather than approximated.
export const colors = {
  brand: '#00033A',
  brandDark: '#000226',
  // Official brand "Royal Blue" per the DYNEX brand guideline swatch
  // (HEX #4052B0 / RGB 64,82,176) -- also used as the Dashboard hero
  // banner's background.
  accent: '#4052B0',
  // Off-white used behind the big "X" watermark on the Login screen —
  // distinct from the app's general `bg` so that screen reads as a
  // deliberate brand moment rather than the default neutral background.
  offWhite: '#FAF9F5',
  bg: '#F7F8F7',
  surface: '#FFFFFF',
  border: '#E4E7E4',
  text: '#1C1F1D',
  textMuted: '#5B635E',
  textFaint: '#8A928C',
  danger: '#B3261E',
  success: '#1B7A43',
};

// Matches `priorities.color_hex` seeded in schema_production.sql -- kept as
// a static fallback keyed by name so the UI still renders correctly even
// before the lookup table has loaded.
export const priorityColors: Record<string, string> = {
  Low: '#6B7280',
  Medium: '#D97706',
  High: '#DC2626',
  Critical: '#991B1B',
};

// Status -> color, grouped by where each status sits in the workflow
// (new/open -> amber, active work -> blue, blocked -> gray, done -> green).
export const statusColors: Record<string, string> = {
  New: '#D97706',
  Acknowledged: '#2563EB',
  'In Progress': '#2563EB',
  'On Hold': '#6B7280',
  Escalated: '#B3261E',
  Resolved: '#1B7A43',
  'Partially Closed': '#4B7F6B',
  Closed: '#1B7A43',
};

// Extends the brand palette above with the few extra tones the animated
// launch screen (`src/components/splash`) needs -- a midpoint "royal
// blue" for its gradient, and a soft champagne/gold used only as a very
// occasional accent highlight. Kept separate from `colors` so the app's
// everyday UI palette doesn't pick up splash-only tones.
export const splashColors = {
  navy: colors.brand,
  midnight: colors.brandDark,
  royal: '#2A3B8F',
  cobalt: colors.accent,
  blueGray: '#5B6690',
  champagne: '#D8B26B',
  champagneSoft: '#E7CFA0',
  white: '#FFFFFF',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 6, md: 10, lg: 16, pill: 999 };

export const fontSize = {
  xs: 12,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
};
