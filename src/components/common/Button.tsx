import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { BorderRadius, Spacing } from '../../constants/theme';

type Variante = 'primary' | 'secondary' | 'dark' | 'ghost' | 'danger';
type Tamaño = 'sm' | 'md' | 'lg';

interface ButtonProps {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  tamaño?: Tamaño;
  cargando?: boolean;
  deshabilitado?: boolean;
  fullWidth?: boolean;
  estiloContenedor?: ViewStyle;
  estiloTexto?: TextStyle;
  icono?: React.ReactNode;
}

export function Button({
  titulo,
  onPress,
  variante = 'primary',
  tamaño = 'md',
  cargando = false,
  deshabilitado = false,
  fullWidth = false,
  estiloContenedor,
  estiloTexto,
  icono,
}: ButtonProps) {
  const estilos = estilosVariante[variante];
  const alturasBoton: Record<Tamaño, number> = { sm: 40, md: 52, lg: 60 };
  const tamañoFuente: Record<Tamaño, number> = { sm: 13, md: 15, lg: 17 };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={deshabilitado || cargando}
      activeOpacity={0.8}
      style={[
        styles.base,
        estilos.contenedor,
        { height: alturasBoton[tamaño] },
        fullWidth && styles.fullWidth,
        (deshabilitado || cargando) && styles.deshabilitado,
        estiloContenedor,
      ]}
    >
      {cargando ? (
        <ActivityIndicator
          color={variante === 'secondary' || variante === 'ghost' ? Colors.camel : Colors.cremacalida}
          size="small"
        />
      ) : (
        <>
          {icono}
          <Text
            style={[
              styles.texto,
              estilos.texto,
              { fontSize: tamañoFuente[tamaño] },
              icono ? { marginLeft: Spacing.sm } : undefined,
              estiloTexto,
            ]}
          >
            {titulo}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const estilosVariante: Record<Variante, { contenedor: ViewStyle; texto: TextStyle }> = {
  primary: {
    contenedor: { backgroundColor: Colors.camel },
    texto: { color: Colors.cremacalida },
  },
  secondary: {
    contenedor: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: Colors.camel,
    },
    texto: { color: Colors.camel },
  },
  dark: {
    contenedor: { backgroundColor: Colors.negrocacao },
    texto: { color: Colors.cremacalida },
  },
  ghost: {
    contenedor: { backgroundColor: 'transparent' },
    texto: { color: Colors.camel },
  },
  danger: {
    contenedor: { backgroundColor: Colors.error },
    texto: { color: Colors.cremacalida },
  },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing['3xl'],
  },
  fullWidth: {
    width: '100%',
  },
  deshabilitado: {
    opacity: 0.5,
  },
  texto: {
    fontFamily: FontFamily.sansMedium,
    letterSpacing: 0.3,
  },
});
