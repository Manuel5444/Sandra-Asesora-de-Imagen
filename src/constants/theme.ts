import { Colors } from './colors';
import { FontFamily, FontSize, LineHeight } from './typography';

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '7xl': 80,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

export const Shadow = {
  sm: {
    shadowColor: Colors.negrocacao,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.negrocacao,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.negrocacao,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: Colors.negrocacao,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

export const Layout = {
  // Padding horizontal estándar de pantalla
  screenPaddingHorizontal: 20,
  screenPaddingVertical: 24,

  // Altura de componentes estándar
  headerHeight: 60,
  tabBarHeight: 70,
  buttonHeight: 52,
  inputHeight: 52,
  cardMinHeight: 80,

  // Máximo ancho para tabletas / web
  maxContentWidth: 480,
} as const;

// Tema completo — base de la app
export const Theme = {
  colors: Colors,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadow: Shadow,
  layout: Layout,

  // Estilos de componentes globales
  components: {
    screen: {
      flex: 1,
      backgroundColor: Colors.cremacalida,
    },

    card: {
      backgroundColor: Colors.lino,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      ...Shadow.sm,
    },

    cardDark: {
      backgroundColor: Colors.negrocacao,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
    },

    button: {
      primary: {
        backgroundColor: Colors.camel,
        borderRadius: BorderRadius.full,
        height: Layout.buttonHeight,
        paddingHorizontal: Spacing['3xl'],
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderRadius: BorderRadius.full,
        height: Layout.buttonHeight,
        paddingHorizontal: Spacing['3xl'],
        borderWidth: 1.5,
        borderColor: Colors.camel,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      },
      dark: {
        backgroundColor: Colors.negrocacao,
        borderRadius: BorderRadius.full,
        height: Layout.buttonHeight,
        paddingHorizontal: Spacing['3xl'],
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      },
    },

    input: {
      backgroundColor: Colors.lino,
      borderRadius: BorderRadius.lg,
      height: Layout.inputHeight,
      paddingHorizontal: Spacing.lg,
      fontSize: FontSize.bodyMd,
      fontFamily: FontFamily.sansRegular,
      color: Colors.negrocacao,
      borderWidth: 1,
      borderColor: Colors.doradoarena,
    },

    tag: {
      borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
    },

    separator: {
      height: 1,
      backgroundColor: Colors.lino,
    },
  },
} as const;

export type ThemeType = typeof Theme;
