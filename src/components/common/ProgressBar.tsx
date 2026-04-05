import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { BorderRadius, Spacing } from '../../constants/theme';

interface ProgressBarProps {
  progreso: number; // 0-100
  etiqueta?: string;
  mostrarPorcentaje?: boolean;
  color?: string;
  altura?: number;
  animado?: boolean;
}

export function ProgressBar({
  progreso,
  etiqueta,
  mostrarPorcentaje = false,
  color = Colors.camel,
  altura = 8,
  animado = true,
}: ProgressBarProps) {
  const animacion = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animado) {
      Animated.timing(animacion, {
        toValue: Math.min(100, Math.max(0, progreso)),
        duration: 800,
        useNativeDriver: false,
      }).start();
    } else {
      animacion.setValue(progreso);
    }
  }, [progreso]);

  const anchoBarra = animacion.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.contenedor}>
      {(etiqueta || mostrarPorcentaje) && (
        <View style={styles.fila}>
          {etiqueta && <Text style={styles.etiqueta}>{etiqueta}</Text>}
          {mostrarPorcentaje && (
            <Text style={[styles.etiqueta, { color }]}>{Math.round(progreso)}%</Text>
          )}
        </View>
      )}
      <View style={[styles.pista, { height: altura }]}>
        <Animated.View
          style={[
            styles.barra,
            { backgroundColor: color, height: altura, width: anchoBarra },
          ]}
        />
      </View>
    </View>
  );
}

// Barra de progreso de puntos gamificación
export function BarraPuntos({
  puntosActuales,
  puntasSiguienteLogro,
  nombreSiguienteLogro,
}: {
  puntosActuales: number;
  puntasSiguienteLogro: number;
  nombreSiguienteLogro: string;
}) {
  const porcentaje = Math.min(100, (puntosActuales / puntasSiguienteLogro) * 100);

  return (
    <View style={styles.barraPuntosContenedor}>
      <View style={styles.barraPuntosFila}>
        <Text style={styles.barraPuntosLabel}>Próximo logro:</Text>
        <Text style={styles.barraPuntosNombre}>{nombreSiguienteLogro}</Text>
      </View>
      <ProgressBar progreso={porcentaje} color={Colors.camel} altura={6} />
      <Text style={styles.barraPuntosCantidad}>
        {puntosActuales} / {puntasSiguienteLogro} puntos Sandra
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  etiqueta: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.uiSm,
    color: Colors.piedra,
  },
  pista: {
    backgroundColor: Colors.lino,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  barra: {
    borderRadius: BorderRadius.full,
  },
  // Barra de puntos
  barraPuntosContenedor: {
    backgroundColor: Colors.lino,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
  },
  barraPuntosFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  barraPuntosLabel: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.uiSm,
    color: Colors.piedra,
  },
  barraPuntosNombre: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.uiSm,
    color: Colors.camel,
  },
  barraPuntosCantidad: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.micro,
    color: Colors.piedra,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
});
