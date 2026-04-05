import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { BorderRadius, Spacing } from '../../constants/theme';
import type { MomentoVital, EtapaKanban } from '../../types';
import { MOMENTOS_VITALES, ETAPAS_KANBAN } from '../../types';

interface BadgeProps {
  texto: string;
  color?: string;
  colorTexto?: string;
  estilo?: ViewStyle;
}

export function Badge({ texto, color = Colors.lino, colorTexto = Colors.negrocacao, estilo }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color }, estilo]}>
      <Text style={[styles.texto, { color: colorTexto }]}>{texto}</Text>
    </View>
  );
}

export function BadgeMomentoVital({ momento }: { momento: MomentoVital }) {
  const datos = MOMENTOS_VITALES[momento];
  return (
    <Badge
      texto={`${datos.emoji} ${datos.label}`}
      color={Colors.lino}
      colorTexto={Colors.camel}
    />
  );
}

export function BadgeEtapaKanban({ etapa }: { etapa: EtapaKanban }) {
  const datos = ETAPAS_KANBAN[etapa];
  const esOscura = etapa === 'fidelizada';
  return (
    <Badge
      texto={datos.label}
      color={datos.color}
      colorTexto={esOscura ? Colors.cremacalida : Colors.negrocacao}
    />
  );
}

export function BadgePlan({ plan }: { plan: string }) {
  const esPremium = plan !== 'basico';
  return (
    <Badge
      texto={esPremium ? '★ Premium' : 'Básico'}
      color={esPremium ? Colors.camel : Colors.lino}
      colorTexto={esPremium ? Colors.cremacalida : Colors.piedra}
    />
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  texto: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.uiXs,
    letterSpacing: 0.3,
  },
});
