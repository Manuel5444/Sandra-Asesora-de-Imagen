import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { BorderRadius, Shadow, Spacing } from '../../constants/theme';
import type { LugarMapa, TipoLugar } from '../../types';

const ICONOS_TIPO: Record<TipoLugar, string> = {
  tienda: '🛍',
  restaurante: '🍽',
  ocio: '🎭',
  cultura: '🎨',
  sesion_sandra: '✦',
  parking: '🅿',
};

interface LugarCardProps {
  lugar: LugarMapa;
  numero?: number;
  onPress?: (lugar: LugarMapa) => void;
  compacto?: boolean;
}

export function LugarCard({ lugar, numero, onPress, compacto = false }: LugarCardProps) {
  const abrirMaps = () => {
    const query = encodeURIComponent(lugar.direccion);
    const url = Platform.OS === 'ios'
      ? `maps:?q=${query}&ll=${lugar.latitud},${lugar.longitud}`
      : `geo:${lugar.latitud},${lugar.longitud}?q=${query}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://maps.google.com/?q=${query}`);
    });
  };

  if (compacto) {
    return (
      <TouchableOpacity
        onPress={() => onPress?.(lugar)}
        style={styles.compacto}
        activeOpacity={0.85}
      >
        <Text style={styles.icono}>{ICONOS_TIPO[lugar.tipo]}</Text>
        <View style={styles.compactoTexto}>
          <Text style={styles.compactoNombre} numberOfLines={1}>{lugar.nombre}</Text>
          <Text style={styles.compactoDir} numberOfLines={1}>{lugar.direccion.split(',')[0]}</Text>
        </View>
        {lugar.distanciaMetros && (
          <Text style={styles.distancia}>
            {lugar.distanciaMetros < 1000
              ? `${lugar.distanciaMetros}m`
              : `${(lugar.distanciaMetros / 1000).toFixed(1)}km`}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => onPress?.(lugar)}
      activeOpacity={0.88}
      style={styles.contenedor}
    >
      <View style={styles.numeroBadge}>
        {numero ? (
          <Text style={styles.numero}>{numero}</Text>
        ) : (
          <Text style={styles.icono}>{ICONOS_TIPO[lugar.tipo]}</Text>
        )}
      </View>

      <View style={styles.info}>
        <View style={styles.cabecera}>
          <Text style={styles.nombre} numberOfLines={1}>{lugar.nombre}</Text>
          {lugar.recomendadoPorSandra && (
            <Text style={styles.recomendado}>✦ Sandra</Text>
          )}
        </View>

        <Text style={styles.direccion}>{lugar.direccion}</Text>
        <Text style={styles.descripcion} numberOfLines={2}>{lugar.descripcion}</Text>

        {lugar.notaSandra && (
          <View style={styles.notaSandraContenedor}>
            <Text style={styles.notaSandraLabel}>Sandra dice:</Text>
            <Text style={styles.notaSandra} numberOfLines={2}>{lugar.notaSandra}</Text>
          </View>
        )}

        <View style={styles.footer}>
          {lugar.horarios && <Text style={styles.horario}>{lugar.horarios}</Text>}
          {lugar.precioEstimado && (
            <Text style={styles.precio}>{lugar.precioEstimado}</Text>
          )}
          <TouchableOpacity onPress={abrirMaps} style={styles.botonMapa}>
            <Text style={styles.botonMapaTexto}>Cómo llegar →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    backgroundColor: Colors.cremacalida,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    ...Shadow.sm,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.camel,
  },
  numeroBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.camel,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    flexShrink: 0,
    marginTop: 2,
  },
  numero: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.uiSm,
    color: Colors.cremacalida,
  },
  icono: {
    fontSize: 16,
  },
  info: {
    flex: 1,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  nombre: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: FontSize.bodyMd,
    color: Colors.negrocacao,
    flex: 1,
  },
  recomendado: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.micro,
    color: Colors.camel,
    marginLeft: Spacing.xs,
  },
  direccion: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.uiSm,
    color: Colors.piedra,
    marginBottom: Spacing.xs,
  },
  descripcion: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.bodySm,
    color: Colors.negrocacao,
    lineHeight: FontSize.bodySm * 1.5,
    marginBottom: Spacing.sm,
  },
  notaSandraContenedor: {
    backgroundColor: Colors.lino,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: Colors.doradoarena,
  },
  notaSandraLabel: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: FontSize.micro,
    color: Colors.camel,
    marginBottom: 2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  notaSandra: {
    fontFamily: FontFamily.displayItalic,
    fontSize: FontSize.bodySm,
    color: Colors.negrocacao,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  horario: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.micro,
    color: Colors.piedra,
  },
  precio: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.micro,
    color: Colors.camel,
  },
  botonMapa: {
    marginLeft: 'auto',
  },
  botonMapaTexto: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.uiSm,
    color: Colors.camel,
  },
  // Compacto
  compacto: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lino,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  compactoTexto: {
    flex: 1,
  },
  compactoNombre: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.uiSm,
    color: Colors.negrocacao,
  },
  compactoDir: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.micro,
    color: Colors.piedra,
  },
  distancia: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.micro,
    color: Colors.camel,
  },
});
