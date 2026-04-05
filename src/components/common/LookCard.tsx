import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { BorderRadius, Shadow, Spacing } from '../../constants/theme';
import type { Look, Prenda } from '../../types';
import { ColorCircle } from './ColorCircle';

interface LookCardProps {
  look: Look;
  onGuardar?: (id: string) => void;
  onVerDetalle?: (look: Look) => void;
}

export function LookCard({ look, onGuardar, onVerDetalle }: LookCardProps) {
  return (
    <View style={styles.contenedor}>
      <TouchableOpacity
        onPress={() => onVerDetalle?.(look)}
        activeOpacity={0.9}
        style={styles.cabecera}
      >
        <View style={styles.cabeceraTexto}>
          <Text style={styles.titulo} numberOfLines={1}>{look.titulo}</Text>
          <Text style={styles.ocasion}>{look.ocasion}</Text>
        </View>
        <TouchableOpacity
          onPress={() => onGuardar?.(look.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.iconoGuardar, look.guardado && styles.iconoGuardado]}>
            {look.guardado ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <Text style={styles.descripcion} numberOfLines={2}>{look.descripcion}</Text>

      {/* Círculos de colores del look */}
      <View style={styles.coloresFila}>
        {look.prendas.slice(0, 5).map((prenda, i) => (
          <ColorCircle key={i} hex={prenda.colorHex} tamaño={28} />
        ))}
      </View>

      {/* Prendas */}
      <View style={styles.prendasContenedor}>
        {look.prendas.map((prenda, i) => (
          <PrendaFila key={i} prenda={prenda} />
        ))}
      </View>
    </View>
  );
}

function PrendaFila({ prenda }: { prenda: Prenda }) {
  return (
    <View style={styles.prendaFila}>
      <ColorCircle hex={prenda.colorHex} tamaño={20} />
      <View style={styles.prendaInfo}>
        <Text style={styles.prendaNombre} numberOfLines={1}>{prenda.nombre}</Text>
        <Text style={styles.prendaMarca}>{prenda.marca}</Text>
      </View>
      <Text style={styles.prendaPrecio}>
        {prenda.precioMin}–{prenda.precioMax}€
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: Colors.lino,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadow.sm,
    marginBottom: Spacing.md,
  },
  cabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  cabeceraTexto: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  titulo: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h4,
    color: Colors.negrocacao,
    letterSpacing: 0.2,
  },
  ocasion: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.uiSm,
    color: Colors.camel,
    marginTop: 2,
  },
  iconoGuardar: {
    fontSize: 22,
    color: Colors.piedra,
  },
  iconoGuardado: {
    color: Colors.camel,
  },
  descripcion: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.bodySm,
    color: Colors.piedra,
    lineHeight: FontSize.bodySm * 1.6,
    marginBottom: Spacing.md,
  },
  coloresFila: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  prendasContenedor: {
    gap: Spacing.sm,
  },
  prendaFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  prendaInfo: {
    flex: 1,
  },
  prendaNombre: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.uiSm,
    color: Colors.negrocacao,
  },
  prendaMarca: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.micro,
    color: Colors.piedra,
  },
  prendaPrecio: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.uiSm,
    color: Colors.camel,
  },
});
