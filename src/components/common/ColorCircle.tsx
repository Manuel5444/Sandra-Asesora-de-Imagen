import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing } from '../../constants/theme';

interface ColorCircleProps {
  hex: string;
  nombre?: string;
  tamaño?: number;
  seleccionado?: boolean;
  onPress?: () => void;
  mostrarNombre?: boolean;
}

export function ColorCircle({
  hex,
  nombre,
  tamaño = 48,
  seleccionado = false,
  onPress,
  mostrarNombre = false,
}: ColorCircleProps) {
  const contenido = (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.circulo,
          {
            width: tamaño,
            height: tamaño,
            borderRadius: tamaño / 2,
            backgroundColor: hex,
          },
          seleccionado && styles.seleccionado,
        ]}
      />
      {mostrarNombre && nombre && (
        <Text style={styles.nombre} numberOfLines={1}>
          {nombre}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {contenido}
      </TouchableOpacity>
    );
  }

  return contenido;
}

// Fila de círculos de colores
interface PaletaColoresProps {
  colores: Array<{ hex: string; nombre: string }>;
  tamaño?: number;
  mostrarNombres?: boolean;
  columnas?: number;
}

export function PaletaColores({ colores, tamaño = 40, mostrarNombres = false, columnas = 6 }: PaletaColoresProps) {
  return (
    <View style={[styles.paleta, { flexWrap: 'wrap' }]}>
      {colores.map((color, i) => (
        <View key={i} style={{ width: `${100 / columnas}%`, alignItems: 'center', marginBottom: Spacing.sm }}>
          <ColorCircle
            hex={color.hex}
            nombre={color.nombre}
            tamaño={tamaño}
            mostrarNombre={mostrarNombres}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  circulo: {
    borderWidth: 1,
    borderColor: 'rgba(26, 20, 16, 0.1)',
  },
  seleccionado: {
    borderWidth: 3,
    borderColor: Colors.camel,
  },
  nombre: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.micro,
    color: Colors.piedra,
    marginTop: Spacing.xs,
    maxWidth: 50,
    textAlign: 'center',
  },
  paleta: {
    flexDirection: 'row',
  },
});
