import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing } from '../../constants/theme';

interface HeaderProps {
  titulo?: string;
  subtitulo?: string;
  onAtras?: () => void;
  accionDerecha?: React.ReactNode;
  fondo?: string;
  textoClaro?: boolean;
  sinPaddingTop?: boolean;
}

export function Header({
  titulo,
  subtitulo,
  onAtras,
  accionDerecha,
  fondo = Colors.cremacalida,
  textoClaro = false,
  sinPaddingTop = false,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const colorTexto = textoClaro ? Colors.cremacalida : Colors.negrocacao;

  return (
    <View
      style={[
        styles.contenedor,
        { backgroundColor: fondo },
        !sinPaddingTop && { paddingTop: insets.top + (Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0) },
      ]}
    >
      <View style={styles.fila}>
        {onAtras ? (
          <TouchableOpacity onPress={onAtras} style={styles.botonAtras} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={[styles.iconoAtras, { color: colorTexto }]}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.botonAtras} />
        )}

        <View style={styles.tituloCentro}>
          {titulo && (
            <Text style={[styles.titulo, { color: colorTexto }]} numberOfLines={1}>
              {titulo}
            </Text>
          )}
          {subtitulo && (
            <Text style={[styles.subtitulo, { color: textoClaro ? Colors.doradoarena : Colors.piedra }]} numberOfLines={1}>
              {subtitulo}
            </Text>
          )}
        </View>

        <View style={styles.accionDerecha}>
          {accionDerecha}
        </View>
      </View>
    </View>
  );
}

// Header especial para el home de la clienta con logo de Sandra
export function HeaderHome({ nombre, puntosTotal }: { nombre: string; puntosTotal: number }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerHome, { paddingTop: insets.top + Spacing.md }]}>
      <View>
        <Text style={styles.saludo}>Hola, {nombre} ✦</Text>
        <Text style={styles.saludoSub}>Tu imagen te acompaña hoy</Text>
      </View>
      <View style={styles.puntos}>
        <Text style={styles.puntosNumero}>{puntosTotal}</Text>
        <Text style={styles.puntosLabel}>puntos</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
  },
  botonAtras: {
    width: 40,
    alignItems: 'flex-start',
  },
  iconoAtras: {
    fontSize: 24,
    fontFamily: FontFamily.sansRegular,
  },
  tituloCentro: {
    flex: 1,
    alignItems: 'center',
  },
  titulo: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h4,
    letterSpacing: 0.3,
  },
  subtitulo: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.uiSm,
    marginTop: 2,
  },
  accionDerecha: {
    width: 40,
    alignItems: 'flex-end',
  },
  // Header Home
  headerHome: {
    backgroundColor: Colors.negrocacao,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  saludo: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h2,
    color: Colors.cremacalida,
    letterSpacing: 0.2,
  },
  saludoSub: {
    fontFamily: FontFamily.displayItalic,
    fontSize: FontSize.bodyMd,
    color: Colors.doradoarena,
    marginTop: 4,
  },
  puntos: {
    alignItems: 'center',
    backgroundColor: Colors.camel,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  puntosNumero: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.h4,
    color: Colors.cremacalida,
  },
  puntosLabel: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.micro,
    color: Colors.cremacalida,
    letterSpacing: 0.5,
  },
});
