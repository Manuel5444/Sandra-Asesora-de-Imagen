import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { BorderRadius, Shadow, Spacing } from '../../constants/theme';
import { useClientaStore } from '../../store/clientaStore';
import { ProgressBar } from '../../components/common/ProgressBar';
import type { Logro } from '../../types';

export function MiTransformacionScreen() {
  const { perfil, logros } = useClientaStore();

  if (!perfil) return null;

  const logrosCompletados = logros.filter((l) => l.completado);
  const logrosPendientes = logros.filter((l) => !l.completado);
  const progresoTotal = Math.round((logrosCompletados.length / logros.length) * 100);

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Hero de puntos */}
        <LinearGradient colors={[Colors.negrocacao, '#2A2018']} style={styles.hero}>
          <Text style={styles.heroLabel}>Puntos Sandra acumulados</Text>
          <Text style={styles.heroPuntos}>{perfil.puntosSandra}</Text>
          <View style={styles.heroSeparador} />
          <Text style={styles.heroNivel}>
            {perfil.puntosSandra < 200 ? '🌱 Inicio de transformación'
              : perfil.puntosSandra < 500 ? '🌸 En proceso'
              : perfil.puntosSandra < 1000 ? '✨ Transformación avanzada'
              : '🏆 Clienta estrella Sandra'}
          </Text>
        </LinearGradient>

        {/* Progreso general */}
        <View style={styles.seccion}>
          <View style={styles.seccionCabecera}>
            <Text style={styles.seccionTitulo}>Tu progreso</Text>
            <Text style={styles.seccionValor}>{logrosCompletados.length}/{logros.length}</Text>
          </View>
          <ProgressBar progreso={progresoTotal} color={Colors.camel} altura={10} mostrarPorcentaje />
        </View>

        {/* Logros desbloqueados */}
        {logrosCompletados.length > 0 && (
          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>✓ Logros desbloqueados</Text>
            <View style={styles.logrosGrid}>
              {logrosCompletados.map((logro) => (
                <LogroCard key={logro.id} logro={logro} completado />
              ))}
            </View>
          </View>
        )}

        {/* Logros pendientes */}
        {logrosPendientes.length > 0 && (
          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>Por desbloquear</Text>
            <View style={styles.logrosGrid}>
              {logrosPendientes.map((logro) => (
                <LogroCard key={logro.id} logro={logro} completado={false} />
              ))}
            </View>
          </View>
        )}

        {/* Diario de transformación */}
        <View style={styles.seccion}>
          <View style={styles.seccionCabecera}>
            <Text style={styles.seccionTitulo}>Mi diario</Text>
            <TouchableOpacity>
              <Text style={styles.verTodo}>Subir foto →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.diarioCard}>
            <Text style={styles.diarioIcono}>📷</Text>
            <Text style={styles.diarioTitulo}>Documenta tu transformación</Text>
            <Text style={styles.diarioDesc}>
              Sube una foto cada semana para registrar tu evolución. 4 semanas seguidas desbloquea una videollamada gratuita con Sandra.
            </Text>
            <TouchableOpacity style={styles.diarioBoton} activeOpacity={0.85}>
              <Text style={styles.diarioBotonTexto}>+ Añadir foto de hoy</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: Spacing['4xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function LogroCard({ logro, completado }: { logro: Logro; completado: boolean }) {
  return (
    <View style={[styles.logroCard, !completado && styles.logroCardPendiente]}>
      <Text style={styles.logroIcono}>{logro.icono}</Text>
      <Text style={[styles.logroTitulo, !completado && styles.logroTituloPendiente]}>
        {logro.titulo}
      </Text>
      <Text style={styles.logroDesc} numberOfLines={2}>{logro.descripcion}</Text>
      <View style={styles.logroRecompensa}>
        <Text style={styles.logroPuntos}>+{logro.puntosRecompensa} pts</Text>
      </View>
      {completado && (
        <View style={styles.logroCheck}>
          <Text style={styles.logroCheckTexto}>✓</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.cremacalida },
  scroll: { paddingBottom: Spacing['4xl'] },
  hero: {
    margin: Spacing.xl, borderRadius: BorderRadius['2xl'],
    padding: Spacing['3xl'], alignItems: 'center',
  },
  heroLabel: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.doradoarena, letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.sm },
  heroPuntos: { fontFamily: FontFamily.displayBold, fontSize: 72, color: Colors.cremacalida, lineHeight: 80 },
  heroSeparador: { width: 40, height: 2, backgroundColor: Colors.doradoarena, marginVertical: Spacing.md, opacity: 0.5 },
  heroNivel: { fontFamily: FontFamily.displayItalic, fontSize: FontSize.bodyMd, color: Colors.doradoarena },
  seccion: { paddingHorizontal: Spacing.xl, marginBottom: Spacing['2xl'] },
  seccionCabecera: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  seccionTitulo: { fontFamily: FontFamily.displaySemiBold, fontSize: FontSize.h4, color: Colors.negrocacao },
  seccionValor: { fontFamily: FontFamily.sansBold, fontSize: FontSize.h4, color: Colors.camel },
  verTodo: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiSm, color: Colors.camel },
  logrosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  logroCard: {
    width: '48%', backgroundColor: Colors.lino, borderRadius: BorderRadius.xl,
    padding: Spacing.md, ...Shadow.sm, position: 'relative',
  },
  logroCardPendiente: { opacity: 0.6 },
  logroIcono: { fontSize: 28, marginBottom: Spacing.sm },
  logroTitulo: { fontFamily: FontFamily.sansSemiBold, fontSize: FontSize.uiMd, color: Colors.negrocacao, marginBottom: 4 },
  logroTituloPendiente: { color: Colors.piedra },
  logroDesc: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.micro, color: Colors.piedra, lineHeight: FontSize.micro * 1.5, marginBottom: Spacing.sm },
  logroRecompensa: {},
  logroPuntos: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.micro, color: Colors.camel },
  logroCheck: {
    position: 'absolute', top: Spacing.sm, right: Spacing.sm,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.camel, alignItems: 'center', justifyContent: 'center',
  },
  logroCheckTexto: { fontFamily: FontFamily.sansBold, fontSize: FontSize.micro, color: Colors.cremacalida },
  diarioCard: {
    backgroundColor: Colors.negrocacao, borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl, alignItems: 'center',
  },
  diarioIcono: { fontSize: 40, marginBottom: Spacing.md },
  diarioTitulo: { fontFamily: FontFamily.displaySemiBold, fontSize: FontSize.h4, color: Colors.cremacalida, marginBottom: Spacing.sm, textAlign: 'center' },
  diarioDesc: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodySm, color: Colors.doradoarena, textAlign: 'center', lineHeight: FontSize.bodySm * 1.6, marginBottom: Spacing.xl },
  diarioBoton: {
    borderRadius: BorderRadius.full, paddingHorizontal: Spacing['2xl'], paddingVertical: Spacing.md,
    borderWidth: 1.5, borderColor: Colors.doradoarena,
  },
  diarioBotonTexto: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiMd, color: Colors.cremacalida },
});
