/**
 * HEARTLAND color palette as JS constants.
 * Prefer the CSS tokens in `@heartland/ui/css/theme.css` for styling;
 * use these constants only when a hex value is needed in TS (e.g. SVG fill).
 */

export const HEARTLAND_COLORS = {
  terminal: '#faf6ee',
  terminalDeep: '#f2ecde',
  panel: '#ffffff',
  panelHi: '#efe9dd',
  grid: '#e3dcd0',
  gridHi: '#c5bcac',
  cool: '#0f2544',
  stone: '#7a8593',
  signal: '#2e6f5e',
  signalDeep: '#1e4e41',
  alert: '#ff6b55',
  alertDeep: '#e04a35',
  critical: '#d63a20',
} as const;

export type HeartlandColorToken = keyof typeof HEARTLAND_COLORS;
