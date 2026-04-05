import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { BorderRadius, Spacing } from '../../constants/theme';
import { useAdminStore } from '../../store/adminStore';
import { ProgressBar } from '../../components/common/ProgressBar';
import { ETAPAS_KANBAN } from '../../types';

export function MetricasScreen() {
  const { metricas, cargarMetricas } = useAdminStore();

  useEffect(() => {
    cargarMetricas();
  }, []);

  const m = metricas;
  const variacionIngresos = m
    ? Math.round(((m.ingresosMes - m.ingresosMesAnterior) / Math.max(m.ingresosMesAnterior, 1)) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Métricas del negocio</Text>
          <Text style={styles.subtitulo}>{new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</Text>
        </View>

        {/* Tarjeta principal de ingresos */}
        <LinearGradient colors={[Colors.negrocacao, '#2A2018']} style={styles.ingresosCard}>
          <Text style={styles.ingresosLabel}>Ingresos del mes</Text>
          <Text style={styles.ingresosValor}>{m?.ingresosMes ?? 0}€</Text>
          <View style={styles.ingresosComparativa}>
            <Text style={[styles.ingresosVariacion, { color: variacionIngresos >= 0 ? '#7A9E7E' : Colors.error }]}>
              {variacionIngresos >= 0 ? '↑' : '↓'} {Math.abs(variacionIngresos)}% vs mes anterior
            </Text>
          </View>
          <View style={styles.proyeccionFila}>
            <Text style={styles.proyeccionLabel}>Proyección próximo mes:</Text>
            <Text style={styles.proyeccionValor}>{m?.proyeccionMesSiguiente ?? 0}€</Text>
          </View>
        </LinearGradient>

        {/* KPIs */}
        <View style={styles.kpisGrid}>
          {[
            { label: 'Tasa de conversión', valor: m?.tasaConversion ?? 0, sufijo: '%', color: Colors.camel },
            { label: 'Tasa de retención', valor: m?.tasaRetencion ?? 0, sufijo: '%', color: Colors.success },
            { label: 'Satisfacción media', valor: m?.satisfaccionMedia ?? 0, sufijo: '/5', color: Colors.doradoarena },
            { label: 'Sesiones / semana', valor: m?.sesionesSemana ?? 0, sufijo: '', color: Colors.negrocacao },
          ].map((kpi, i) => (
            <View key={i} style={styles.kpiCard}>
              <Text style={[styles.kpiValor, { color: kpi.color }]}>{kpi.valor}{kpi.sufijo}</Text>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
            </View>
          ))}
        </View>

        {/* Distribución por etapa Kanban */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Pipeline · Distribución por etapa</Text>
          {Object.entries(ETAPAS_KANBAN).map(([etapa, datos]) => {
            const count = m?.clientasPorEtapa?.[etapa as keyof typeof m.clientasPorEtapa] ?? 0;
            const total = m?.clientasActivas ?? 1;
            return (
              <View key={etapa} style={styles.etapaFila}>
                <View style={styles.etapaInfo}>
                  <View style={[styles.etapaDot, { backgroundColor: datos.color }]} />
                  <Text style={styles.etapaLabel}>{datos.label}</Text>
                </View>
                <View style={styles.etapaBarraContenedor}>
                  <ProgressBar
                    progreso={total > 0 ? (count / total) * 100 : 0}
                    color={datos.color === Colors.lino ? Colors.piedra : datos.color}
                    altura={8}
                    animado
                  />
                </View>
                <Text style={styles.etapaCount}>{count}</Text>
              </View>
            );
          })}
        </View>

        {/* Satisfacción */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Índice de satisfacción</Text>
          <View style={styles.satisfaccionCard}>
            <Text style={styles.satisfaccionNumero}>{m?.satisfaccionMedia ?? 0}</Text>
            <Text style={styles.satisfaccionMax}>/5</Text>
            <Text style={styles.satisfaccionLabel}>Media de valoraciones</Text>
            <View style={styles.estrellas}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Text key={n} style={[styles.estrella, n <= Math.round(m?.satisfaccionMedia ?? 0) && styles.estrellaActiva]}>
                  ★
                </Text>
              ))}
            </View>
          </View>
        </View>

        <View style={{ height: Spacing['4xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.cremacalida },
  scroll: { paddingBottom: Spacing['4xl'] },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.md },
  titulo: { fontFamily: FontFamily.displayBold, fontSize: FontSize.h2, color: Colors.negrocacao },
  subtitulo: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd, color: Colors.piedra, marginTop: 4, textTransform: 'capitalize' },
  ingresosCard: { margin: Spacing.xl, borderRadius: BorderRadius['2xl'], padding: Spacing['2xl'] },
  ingresosLabel: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.doradoarena, letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.sm },
  ingresosValor: { fontFamily: FontFamily.displayBold, fontSize: 56, color: Colors.cremacalida, lineHeight: 60 },
  ingresosComparativa: { marginTop: Spacing.sm, marginBottom: Spacing.xl },
  ingresosVariacion: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.bodyMd },
  proyeccionFila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: 'rgba(212, 184, 150, 0.3)' },
  proyeccionLabel: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.doradoarena },
  proyeccionValor: { fontFamily: FontFamily.sansBold, fontSize: FontSize.h4, color: Colors.cremacalida },
  kpisGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.xl, gap: Spacing.sm, marginBottom: Spacing.xl },
  kpiCard: { width: '47%', backgroundColor: Colors.lino, borderRadius: BorderRadius.xl, padding: Spacing.md, alignItems: 'center' },
  kpiValor: { fontFamily: FontFamily.displayBold, fontSize: FontSize.display2xl },
  kpiLabel: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.micro, color: Colors.piedra, textAlign: 'center', marginTop: 4 },
  seccion: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl },
  seccionTitulo: { fontFamily: FontFamily.displaySemiBold, fontSize: FontSize.h4, color: Colors.negrocacao, marginBottom: Spacing.md },
  etapaFila: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  etapaInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, width: 120 },
  etapaDot: { width: 10, height: 10, borderRadius: 5 },
  etapaLabel: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.negrocacao, flex: 1 },
  etapaBarraContenedor: { flex: 1 },
  etapaCount: { fontFamily: FontFamily.sansBold, fontSize: FontSize.uiSm, color: Colors.camel, width: 24, textAlign: 'right' },
  satisfaccionCard: { backgroundColor: Colors.lino, borderRadius: BorderRadius['2xl'], padding: Spacing['2xl'], alignItems: 'center' },
  satisfaccionNumero: { fontFamily: FontFamily.displayBold, fontSize: 72, color: Colors.camel, lineHeight: 80 },
  satisfaccionMax: { fontFamily: FontFamily.displayRegular, fontSize: FontSize.h2, color: Colors.piedra },
  satisfaccionLabel: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.piedra, marginTop: Spacing.xs, marginBottom: Spacing.md },
  estrellas: { flexDirection: 'row', gap: Spacing.xs },
  estrella: { fontSize: 24, color: Colors.lino },
  estrellaActiva: { color: Colors.doradoarena },
});
