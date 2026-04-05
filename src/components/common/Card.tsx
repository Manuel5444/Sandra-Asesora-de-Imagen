import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  variante?: 'light' | 'dark' | 'gold' | 'outline';
  onPress?: () => void;
  estilo?: ViewStyle;
  padding?: number;
}

export function Card({ children, variante = 'light', onPress, estilo, padding }: CardProps) {
  const estilosVariante: Record<typeof variante, ViewStyle> = {
    light: {
      backgroundColor: Colors.lino,
      ...Shadow.sm,
    },
    dark: {
      backgroundColor: Colors.negrocacao,
    },
    gold: {
      backgroundColor: Colors.lino,
      borderWidth: 1,
      borderColor: Colors.doradoarena,
      ...Shadow.sm,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: Colors.lino,
    },
  };

  const contenedor = (
    <View
      style={[
        styles.base,
        estilosVariante[variante],
        padding !== undefined ? { padding } : undefined,
        estilo,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        {contenedor}
      </TouchableOpacity>
    );
  }

  return contenedor;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    overflow: 'hidden',
  },
});
