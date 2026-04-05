import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';

type Variante =
  | 'hero'
  | 'titulo'
  | 'subtitulo'
  | 'seccion'
  | 'cuerpo'
  | 'cuerpoSm'
  | 'etiqueta'
  | 'precio'
  | 'cita'
  | 'boton'
  | 'caption'
  | 'tagline';

interface SandraTextProps {
  children: React.ReactNode;
  variante?: Variante;
  color?: string;
  centrado?: boolean;
  negrita?: boolean;
  estilo?: TextStyle;
  numeroLineas?: number;
}

export function SandraText({
  children,
  variante = 'cuerpo',
  color,
  centrado = false,
  negrita = false,
  estilo,
  numeroLineas,
}: SandraTextProps) {
  return (
    <Text
      style={[
        styles[variante],
        color ? { color } : undefined,
        centrado ? { textAlign: 'center' } : undefined,
        negrita ? { fontFamily: FontFamily.sansBold } : undefined,
        estilo,
      ]}
      numberOfLines={numeroLineas}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create<Record<Variante, TextStyle>>({
  hero: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize.display2xl,
    color: Colors.negrocacao,
    letterSpacing: -0.5,
    lineHeight: FontSize.display2xl * 1.1,
  },
  titulo: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h1,
    color: Colors.negrocacao,
    letterSpacing: -0.3,
    lineHeight: FontSize.h1 * 1.2,
  },
  subtitulo: {
    fontFamily: FontFamily.displayMedium,
    fontSize: FontSize.h2,
    color: Colors.negrocacao,
    lineHeight: FontSize.h2 * 1.3,
  },
  seccion: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: FontSize.h4,
    color: Colors.negrocacao,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  cuerpo: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.bodyMd,
    color: Colors.negrocacao,
    lineHeight: FontSize.bodyMd * 1.6,
  },
  cuerpoSm: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.bodySm,
    color: Colors.textSecondary,
    lineHeight: FontSize.bodySm * 1.5,
  },
  etiqueta: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: FontSize.uiXs,
    color: Colors.piedra,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  precio: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.h3,
    color: Colors.camel,
    letterSpacing: -0.3,
  },
  cita: {
    fontFamily: FontFamily.displayItalic,
    fontSize: FontSize.bodyLg,
    color: Colors.negrocacao,
    lineHeight: FontSize.bodyLg * 1.7,
  },
  boton: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.uiLg,
    color: Colors.cremacalida,
    letterSpacing: 0.3,
  },
  caption: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.micro,
    color: Colors.piedra,
    letterSpacing: 0.2,
  },
  tagline: {
    fontFamily: FontFamily.displayItalic,
    fontSize: FontSize.h3,
    color: Colors.camel,
    lineHeight: FontSize.h3 * 1.4,
  },
});
