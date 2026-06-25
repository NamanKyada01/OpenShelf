/** Design tokens aligned with Figma: OpenShelf Mobile */
export const colors = {
  background: '#0F0F14',
  surface: '#1A1A24',
  surfaceElevated: '#242433',
  primary: '#8B5CF6',
  primaryDark: '#6D3BD7',
  streak: '#FF9600',
  streakGlow: '#FFB84D',
  success: '#58CC02',
  danger: '#FF4B4B',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B8',
  textMuted: '#6B6B80',
  border: '#2E2E42',
  overlay: 'rgba(0,0,0,0.6)',
} as const;

export type ColorKey = keyof typeof colors;
