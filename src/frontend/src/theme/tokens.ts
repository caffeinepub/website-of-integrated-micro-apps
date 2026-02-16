/**
 * Design Tokens for Arkly Portal
 * 
 * Visual Direction: Warm, playful, and inviting with coral/orange as primary
 * Typography: Modern sans-serif with clear hierarchy
 * Spacing: Generous padding for breathing room
 * Radii: Varied from sharp (0) to fully rounded (full) for visual interest
 */

export const tokens = {
  colors: {
    primary: 'oklch(0.68 0.19 35)', // Warm coral
    primaryForeground: 'oklch(0.98 0 0)',
    secondary: 'oklch(0.72 0.18 60)', // Warm yellow
    accent: 'oklch(0.7 0.2 340)', // Playful pink
    success: 'oklch(0.7 0.18 140)',
    warning: 'oklch(0.75 0.19 80)',
    destructive: 'oklch(0.58 0.25 27)',
  },
  typography: {
    fontFamily: {
      sans: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      display: '"Inter", system-ui, sans-serif',
    },
    scale: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
};
