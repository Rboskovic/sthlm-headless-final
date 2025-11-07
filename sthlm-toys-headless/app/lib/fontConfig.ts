// FILE: app/lib/fontConfig.ts
// ✅ UNIFIED FONT CONFIGURATION: Single source of truth for fonts

/**
 * Font Configuration
 * This is the ONLY place where fonts should be defined
 * All components should import from here
 */

// Primary font stack - Buenos Aires with system fallbacks
export const FONT_FAMILY = {
    primary: `'Buenos Aires', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
    // If we ever need a secondary font, add it here
    secondary: `'Buenos Aires', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
    // Monospace for code/technical content
    mono: `'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace`,
  };
  
  // Font weights
  export const FONT_WEIGHT = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  } as const;
  
  // Font sizes - Mobile first with clamp for responsive
  export const FONT_SIZE = {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    // Responsive sizes using clamp
    heroMobile: 'clamp(28px, 8vw, 48px)',
    heroDesktop: 'clamp(48px, 5vw, 72px)',
    headingMobile: 'clamp(24px, 6vw, 36px)',
    headingDesktop: 'clamp(30px, 3vw, 48px)',
  } as const;
  
  // Line heights
  export const LINE_HEIGHT = {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  } as const;
  
  // Letter spacing
  export const LETTER_SPACING = {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  } as const;
  
  /**
   * Typography style presets
   * Use these for consistent text styles across components
   */
  export const TYPOGRAPHY = {
    // Hero/Banner text
    hero: {
      fontFamily: FONT_FAMILY.primary,
      fontWeight: FONT_WEIGHT.bold,
      fontSize: FONT_SIZE.heroDesktop,
      lineHeight: LINE_HEIGHT.tight,
      letterSpacing: LETTER_SPACING.tight,
    },
    heroMobile: {
      fontFamily: FONT_FAMILY.primary,
      fontWeight: FONT_WEIGHT.bold,
      fontSize: FONT_SIZE.heroMobile,
      lineHeight: LINE_HEIGHT.tight,
      letterSpacing: LETTER_SPACING.tight,
    },
    
    // Section headings
    h1: {
      fontFamily: FONT_FAMILY.primary,
      fontWeight: FONT_WEIGHT.bold,
      fontSize: FONT_SIZE['4xl'],
      lineHeight: LINE_HEIGHT.tight,
      letterSpacing: LETTER_SPACING.tight,
    },
    h2: {
      fontFamily: FONT_FAMILY.primary,
      fontWeight: FONT_WEIGHT.semibold,
      fontSize: FONT_SIZE['3xl'],
      lineHeight: LINE_HEIGHT.tight,
      letterSpacing: LETTER_SPACING.tight,
    },
    h3: {
      fontFamily: FONT_FAMILY.primary,
      fontWeight: FONT_WEIGHT.semibold,
      fontSize: FONT_SIZE['2xl'],
      lineHeight: LINE_HEIGHT.snug,
    },
    
    // Body text
    body: {
      fontFamily: FONT_FAMILY.primary,
      fontWeight: FONT_WEIGHT.normal,
      fontSize: FONT_SIZE.base,
      lineHeight: LINE_HEIGHT.normal,
    },
    bodyLarge: {
      fontFamily: FONT_FAMILY.primary,
      fontWeight: FONT_WEIGHT.normal,
      fontSize: FONT_SIZE.lg,
      lineHeight: LINE_HEIGHT.relaxed,
    },
    bodySmall: {
      fontFamily: FONT_FAMILY.primary,
      fontWeight: FONT_WEIGHT.normal,
      fontSize: FONT_SIZE.sm,
      lineHeight: LINE_HEIGHT.normal,
    },
    
    // UI elements
    button: {
      fontFamily: FONT_FAMILY.primary,
      fontWeight: FONT_WEIGHT.medium,
      fontSize: FONT_SIZE.base,
      lineHeight: LINE_HEIGHT.none,
      letterSpacing: LETTER_SPACING.normal,
    },
    buttonLarge: {
      fontFamily: FONT_FAMILY.primary,
      fontWeight: FONT_WEIGHT.semibold,
      fontSize: FONT_SIZE.lg,
      lineHeight: LINE_HEIGHT.none,
    },
    
    // Navigation
    nav: {
      fontFamily: FONT_FAMILY.primary,
      fontWeight: FONT_WEIGHT.medium,
      fontSize: FONT_SIZE.base,
      lineHeight: LINE_HEIGHT.none,
    },
    
    // Price display
    price: {
      fontFamily: FONT_FAMILY.primary,
      fontWeight: FONT_WEIGHT.semibold,
      fontSize: FONT_SIZE.lg,
      lineHeight: LINE_HEIGHT.none,
    },
    priceLarge: {
      fontFamily: FONT_FAMILY.primary,
      fontWeight: FONT_WEIGHT.bold,
      fontSize: FONT_SIZE['2xl'],
      lineHeight: LINE_HEIGHT.none,
    },
    
    // Labels and captions
    label: {
      fontFamily: FONT_FAMILY.primary,
      fontWeight: FONT_WEIGHT.medium,
      fontSize: FONT_SIZE.sm,
      lineHeight: LINE_HEIGHT.normal,
      letterSpacing: LETTER_SPACING.wide,
    },
    caption: {
      fontFamily: FONT_FAMILY.primary,
      fontWeight: FONT_WEIGHT.normal,
      fontSize: FONT_SIZE.xs,
      lineHeight: LINE_HEIGHT.normal,
    },
  } as const;
  
  /**
   * Helper function to apply typography styles
   * @example
   * <h1 style={getTypography('h1')}>Title</h1>
   */
  export function getTypography(variant: keyof typeof TYPOGRAPHY) {
    return TYPOGRAPHY[variant];
  }
  
  /**
   * Helper to get only font family for gradual migration
   * @example
   * style={{ fontFamily: getFontFamily() }}
   */
  export function getFontFamily(type: keyof typeof FONT_FAMILY = 'primary') {
    return FONT_FAMILY[type];
  }