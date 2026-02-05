/**
 * Premium Design System Tokens
 * ============================
 * Central source of truth for all design decisions.
 * No hardcoded values allowed outside this file.
 */

// =============================================================================
// COLOR SYSTEM
// =============================================================================

export const colors = {
  // Brand Colors
  brand: {
    gold: {
      50: 'hsl(38, 80%, 96%)',
      100: 'hsl(38, 80%, 90%)',
      200: 'hsl(38, 80%, 80%)',
      300: 'hsl(38, 80%, 70%)',
      400: 'hsl(38, 80%, 60%)',
      500: 'hsl(38, 80%, 50%)', // Primary accent
      600: 'hsl(38, 80%, 45%)',
      700: 'hsl(38, 80%, 40%)',
      800: 'hsl(38, 80%, 30%)',
      900: 'hsl(38, 80%, 20%)',
    },
  },

  // Semantic Colors
  semantic: {
    success: {
      light: 'hsl(142, 76%, 94%)',
      main: 'hsl(142, 76%, 46%)',
      dark: 'hsl(142, 76%, 36%)',
    },
    warning: {
      light: 'hsl(38, 92%, 95%)',
      main: 'hsl(38, 92%, 50%)',
      dark: 'hsl(38, 92%, 40%)',
    },
    error: {
      light: 'hsl(0, 84%, 95%)',
      main: 'hsl(0, 84%, 60%)',
      dark: 'hsl(0, 84%, 50%)',
    },
    info: {
      light: 'hsl(210, 100%, 96%)',
      main: 'hsl(210, 100%, 50%)',
      dark: 'hsl(210, 100%, 40%)',
    },
  },

  // Theme-specific (CSS variables)
  theme: {
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    card: 'hsl(var(--card))',
    cardForeground: 'hsl(var(--card-foreground))',
    primary: 'hsl(var(--primary))',
    primaryForeground: 'hsl(var(--primary-foreground))',
    secondary: 'hsl(var(--secondary))',
    secondaryForeground: 'hsl(var(--secondary-foreground))',
    muted: 'hsl(var(--muted))',
    mutedForeground: 'hsl(var(--muted-foreground))',
    accent: 'hsl(var(--accent))',
    accentForeground: 'hsl(var(--accent-foreground))',
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',
  },
} as const;

// =============================================================================
// SPACING SYSTEM (4px base)
// =============================================================================

export const spacing = {
  0: '0px',
  px: '1px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
  36: '144px',
  40: '160px',
  44: '176px',
  48: '192px',
  52: '208px',
  56: '224px',
  60: '240px',
  64: '256px',
  72: '288px',
  80: '320px',
  96: '384px',
} as const;

// =============================================================================
// TYPOGRAPHY SYSTEM
// =============================================================================

export const typography = {
  // Font Families
  fonts: {
    display: '"Playfair Display", Georgia, serif',
    body: '"Inter", system-ui, -apple-system, sans-serif',
    mono: '"SF Mono", "Fira Code", monospace',
  },

  // Font Sizes with line heights
  sizes: {
    xs: { fontSize: '0.75rem', lineHeight: '1rem' }, // 12px
    sm: { fontSize: '0.875rem', lineHeight: '1.25rem' }, // 14px
    base: { fontSize: '1rem', lineHeight: '1.5rem' }, // 16px
    lg: { fontSize: '1.125rem', lineHeight: '1.75rem' }, // 18px
    xl: { fontSize: '1.25rem', lineHeight: '1.75rem' }, // 20px
    '2xl': { fontSize: '1.5rem', lineHeight: '2rem' }, // 24px
    '3xl': { fontSize: '1.875rem', lineHeight: '2.25rem' }, // 30px
    '4xl': { fontSize: '2.25rem', lineHeight: '2.5rem' }, // 36px
    '5xl': { fontSize: '3rem', lineHeight: '1' }, // 48px
    '6xl': { fontSize: '3.75rem', lineHeight: '1' }, // 60px
    '7xl': { fontSize: '4.5rem', lineHeight: '1' }, // 72px
    '8xl': { fontSize: '6rem', lineHeight: '1' }, // 96px
    '9xl': { fontSize: '8rem', lineHeight: '1' }, // 128px
  },

  // Font Weights
  weights: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Letter Spacing
  tracking: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const radius = {
  none: '0px',
  sm: '4px',
  DEFAULT: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px',
} as const;

// =============================================================================
// SHADOW SYSTEM
// =============================================================================

export const shadows = {
  // Light Mode Shadows
  light: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
    DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
    md: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
    lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
    xl: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
    '2xl': '0 35px 60px -15px rgb(0 0 0 / 0.2)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    glow: '0 0 40px hsl(38 80% 50% / 0.15)',
    glowLg: '0 0 80px hsl(38 80% 50% / 0.25)',
  },
  // Dark Mode Shadows
  dark: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.2)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
    DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.35), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
    md: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.35)',
    lg: '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
    xl: '0 25px 50px -12px rgb(0 0 0 / 0.6)',
    '2xl': '0 35px 60px -15px rgb(0 0 0 / 0.7)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.3)',
    glow: '0 0 60px hsl(38 80% 55% / 0.2)',
    glowLg: '0 0 100px hsl(38 80% 55% / 0.3)',
  },
} as const;

// =============================================================================
// BLUR LEVELS
// =============================================================================

export const blur = {
  none: '0',
  sm: '4px',
  DEFAULT: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  '3xl': '64px',
} as const;

// =============================================================================
// ANIMATION / MOTION SYSTEM
// =============================================================================

export const motion = {
  // Durations
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
  },

  // Timing Functions (Easing)
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    // Premium easing curves
    easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
    easeInOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',
    easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // Preset transitions
  transitions: {
    fast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
    normal: '300ms cubic-bezier(0.16, 1, 0.3, 1)',
    slow: '500ms cubic-bezier(0.16, 1, 0.3, 1)',
    color: '200ms ease',
    opacity: '300ms ease',
    transform: '400ms cubic-bezier(0.16, 1, 0.3, 1)',
    all: '300ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
} as const;

// =============================================================================
// Z-INDEX SCALE
// =============================================================================

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
  max: 9999,
} as const;

// =============================================================================
// BREAKPOINTS
// =============================================================================

export const breakpoints = {
  xs: '375px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px',
  '3xl': '1600px',
} as const;

// =============================================================================
// ICON SIZES
// =============================================================================

export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
} as const;

// =============================================================================
// COMPONENT PRESETS
// =============================================================================

export const components = {
  // Button sizing
  button: {
    xs: { height: '28px', padding: '0 10px', fontSize: '12px' },
    sm: { height: '36px', padding: '0 14px', fontSize: '13px' },
    md: { height: '44px', padding: '0 20px', fontSize: '14px' },
    lg: { height: '52px', padding: '0 28px', fontSize: '15px' },
    xl: { height: '60px', padding: '0 36px', fontSize: '16px' },
  },

  // Input sizing
  input: {
    sm: { height: '36px', padding: '0 12px', fontSize: '13px' },
    md: { height: '44px', padding: '0 16px', fontSize: '14px' },
    lg: { height: '52px', padding: '0 20px', fontSize: '15px' },
  },

  // Card presets
  card: {
    padding: {
      sm: '16px',
      md: '24px',
      lg: '32px',
    },
    radius: {
      sm: '12px',
      md: '16px',
      lg: '24px',
    },
  },

  // Avatar sizes
  avatar: {
    xs: { size: '24px', fontSize: '10px' },
    sm: { size: '32px', fontSize: '12px' },
    md: { size: '40px', fontSize: '14px' },
    lg: { size: '48px', fontSize: '16px' },
    xl: { size: '64px', fontSize: '20px' },
    '2xl': { size: '96px', fontSize: '28px' },
  },
} as const;

// =============================================================================
// GLASS EFFECT PRESETS
// =============================================================================

export const glass = {
  light: {
    background: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(255, 255, 255, 0.2)',
    blur: '20px',
  },
  dark: {
    background: 'rgba(0, 0, 0, 0.5)',
    border: 'rgba(255, 255, 255, 0.1)',
    blur: '20px',
  },
  subtle: {
    background: 'rgba(255, 255, 255, 0.4)',
    border: 'rgba(255, 255, 255, 0.1)',
    blur: '12px',
  },
} as const;

// =============================================================================
// EXPORT ALL TOKENS
// =============================================================================

export const tokens = {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  blur,
  motion,
  zIndex,
  breakpoints,
  iconSizes,
  components,
  glass,
} as const;

export default tokens;
