import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { BorderRadius, Spacing } from '../../constants/theme';

interface ConsejoCardProps {
  consejo: string;
  fecha?: string;
}

export function ConsejoCard({ consejo, fecha }: ConsejoCardProps) {
  const hoy = new Date();
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const diaLabel = fecha ?? `${diasSemana[hoy.getDay()]} ${hoy.getDate()} de ${hoy.toLocaleDateString('es-ES', { month: 'long' })}`;

  return (
    <LinearGradient
      colors={[Colors.negrocacao, '#2A2018']}
      style={styles.contenedor}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Decoración dorada superior */}
      <View style={styles.lineaDorada} />

      <View style={styles.cabecera}>
        <Text style={styles.firma}>Sandra</Text>
        <Text style={styles.fecha}>{diaLabel}</Text>
      </View>

      <Text style={styles.comillas}>"</Text>
      <Text style={styles.consejo}>{consejo}</Text>

      <View style={styles.decoracion}>
        <View style={styles.separador} />
        <Text style={styles.separadorTexto}>✦</Text>
        <View style={styles.separador} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing['2xl'],
    overflow: 'hidden',
  },
  lineaDorada: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.doradoarena,
  },
  cabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  firma: {
    fontFamily: FontFamily.displayItalic,
    fontSize: FontSize.uiLg,
    color: Colors.doradoarena,
    letterSpacing: 1,
  },
  fecha: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.uiSm,
    color: Colors.piedra,
  },
  comillas: {
    fontFamily: FontFamily.displayBold,
    fontSize: 48,
    color: Colors.doradoarena,
    lineHeight: 40,
    marginBottom: Spacing.xs,
    opacity: 0.6,
  },
  consejo: {
    fontFamily: FontFamily.displayItalic,
    fontSize: FontSize.bodyLg,
    color: Colors.cremacalida,
    lineHeight: FontSize.bodyLg * 1.7,
  },
  decoracion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  separador: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.doradoarena,
    opacity: 0.3,
  },
  separadorTexto: {
    color: Colors.doradoarena,
    fontSize: 10,
    opacity: 0.6,
  },
});
