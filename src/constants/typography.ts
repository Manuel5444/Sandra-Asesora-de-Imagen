/**
 * Tipografías · Sandra Manresa
 * Títulos: Cormorant Garamond (serif elegante)
 * UI y cuerpo: DM Sans (sans-serif legible)
 * Datos y códigos: DM Mono (monoespaciado)
 */

export const FontFamily = {
  // Títulos y firma — elegancia editorial
  displayBold: 'CormorantGaramond-Bold',
  displaySemiBold: 'CormorantGaramond-SemiBold',
  displayMedium: 'CormorantGaramond-Medium',
  displayRegular: 'CormorantGaramond-Regular',
  displayItalic: 'CormorantGaramond-Italic',
  displayBoldItalic: 'CormorantGaramond-BoldItalic',

  // UI y cuerpo — legibilidad moderna
  sansBold: 'DMSans-Bold',
  sansSemiBold: 'DMSans-SemiBold',
  sansMedium: 'DMSans-Medium',
  sansRegular: 'DMSans-Regular',
  sansLight: 'DMSans-Light',
  sansItalic: 'DMSans-Italic',

  // Datos, precios, coordenadas — claridad técnica
  monoBold: 'DMSans-Bold',
  monoRegular: 'DMSans-Regular',

  // Alternativas system font (fallback)
  systemSerif: 'Georgia',
  systemSans: 'System',
} as const;

export const FontSize = {
  // Display — portada, tagline
  display3xl: 48,
  display2xl: 40,
  displayXl: 36,
  displayLg: 32,

  // Headings — secciones, títulos de pantalla
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 18,

  // Body — texto de lectura
  bodyLg: 17,
  bodyMd: 15,
  bodySm: 13,

  // UI — botones, etiquetas, navegación
  uiLg: 16,
  uiMd: 14,
  uiSm: 12,
  uiXs: 11,

  // Micro — badges, chips, footnotes
  micro: 10,
} as const;

export const LineHeight = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

export const LetterSpacing = {
  tighter: -0.05,
  tight: -0.025,
  normal: 0,
  wide: 0.025,
  wider: 0.05,
  widest: 0.1,
  displayWide: 0.3,   // Para títulos en mayúsculas estilo editorial
} as const;

// Estilos tipográficos predefinidos
export const TextStyles = {
  // Editorial grande — portada, hero
  heroTitle: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize.display3xl,
    letterSpacing: LetterSpacing.tight,
    lineHeight: FontSize.display3xl * LineHeight.tight,
  },

  // Título de sección
  sectionTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h2,
    letterSpacing: LetterSpacing.wide,
    lineHeight: FontSize.h2 * LineHeight.snug,
  },

  // Tagline de marca
  tagline: {
    fontFamily: FontFamily.displayItalic,
    fontSize: FontSize.h3,
    letterSpacing: LetterSpacing.normal,
    lineHeight: FontSize.h3 * LineHeight.relaxed,
  },

  // Cuerpo de texto principal
  body: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.bodyMd,
    letterSpacing: LetterSpacing.normal,
    lineHeight: FontSize.bodyMd * LineHeight.relaxed,
  },

  // Texto de botón
  button: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.uiLg,
    letterSpacing: LetterSpacing.wide,
    lineHeight: FontSize.uiLg * LineHeight.snug,
  },

  // Etiqueta pequeña (uppercase)
  label: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: FontSize.uiSm,
    letterSpacing: LetterSpacing.widest,
    lineHeight: FontSize.uiSm * LineHeight.normal,
    textTransform: 'uppercase' as const,
  },

  // Precio / dato destacado
  price: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.h3,
    letterSpacing: LetterSpacing.tight,
    lineHeight: FontSize.h3 * LineHeight.tight,
  },

  // Consejo del día — cita estilo editorial
  quote: {
    fontFamily: FontFamily.displayItalic,
    fontSize: FontSize.bodyLg,
    letterSpacing: LetterSpacing.normal,
    lineHeight: FontSize.bodyLg * LineHeight.loose,
  },
} as const;
