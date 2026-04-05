import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../../constants/colors';
import { FontFamily, FontSize } from '../../../constants/typography';
import { BorderRadius, Spacing } from '../../../constants/theme';
import { Button } from '../../../components/common/Button';
import type { DatosOnboarding } from '../OnboardingContainer';

interface PasoProps {
  datos: DatosOnboarding;
  actualizarDatos: (d: Partial<DatosOnboarding>) => void;
  onSiguiente: () => void;
  onAtras: () => void;
  guardando?: boolean;
}

const METAS_DISPONIBLES = [
  { id: 'armario_capsula', label: 'Crear mi armario cápsula', emoji: '👗' },
  { id: 'primera_impresion', label: 'Mejorar mi primera impresión', emoji: '✨' },
  { id: 'colorimetria', label: 'Conocer mis colores perfectos', emoji: '🎨' },
  { id: 'reinventarme', label: 'Reinventarme por completo', emoji: '🦋' },
  { id: 'confianza', label: 'Sentirme más segura de mí misma', emoji: '💪' },
  { id: 'cuerpo', label: 'Favorecer mi figura actual', emoji: '🌸' },
  { id: 'trabajo', label: 'Proyectar éxito en el trabajo', emoji: '💼' },
  { id: 'citas', label: 'Verme mejor para citas y salidas', emoji: '💫' },
  { id: 'compras', label: 'Comprar mejor y gastar menos', emoji: '🛍' },
  { id: 'actualizarme', label: 'Actualizar mi estilo sin perderme', emoji: '📅' },
];

export function PasoMetas({ datos, actualizarDatos, onSiguiente, onAtras, guardando }: PasoProps) {
  const toggleMeta = (id: string) => {
    const actuales = datos.metasPersonales;
    if (actuales.includes(id)) {
      actualizarDatos({ metasPersonales: actuales.filter((m) => m !== id) });
    } else if (actuales.length < 3) {
      actualizarDatos({ metasPersonales: [...actuales, id] });
    }
  };

  const puedeAvanzar = datos.metasPersonales.length > 0;

  return (
    <View style={styles.contenedor}>
      <View style={styles.cabecera}>
        <TouchableOpacity onPress={onAtras}><Text style={styles.atras}>←</Text></TouchableOpacity>
        <Text style={styles.paso}>Paso 6 de 6</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.titulo}>¿Qué quieres conseguir?</Text>
        <Text style={styles.descripcion}>
          Elige hasta 3 metas. Definen el tono de todos los mensajes y recomendaciones que recibirás.
        </Text>

        <Text style={styles.contador}>
          {datos.metasPersonales.length} / 3 seleccionadas
        </Text>

        <View style={styles.opciones}>
          {METAS_DISPONIBLES.map((meta) => {
            const seleccionada = datos.metasPersonales.includes(meta.id);
            const deshabilitada = !seleccionada && datos.metasPersonales.length >= 3;
            return (
              <TouchableOpacity
                key={meta.id}
                onPress={() => toggleMeta(meta.id)}
                disabled={deshabilitada}
                style={[
                  styles.opcion,
                  seleccionada && styles.opcionSeleccionada,
                  deshabilitada && styles.opcionDeshabilitada,
                ]}
                activeOpacity={0.8}
              >
                <Text style={styles.opcionEmoji}>{meta.emoji}</Text>
                <Text style={[styles.opcionLabel, seleccionada && styles.opcionLabelActiva]}>
                  {meta.label}
                </Text>
                {seleccionada && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: Spacing['2xl'] }} />

        <LinearGradient colors={[Colors.negrocacao, '#2A2018']} style={styles.finCard}>
          <Text style={styles.finTitulo}>Todo listo, {datos.nombre} ✦</Text>
          <Text style={styles.finTexto}>
            Tu informe de imagen personalizado se generará en segundos. La transformación empieza ahora.
          </Text>
        </LinearGradient>

        <View style={{ height: Spacing.xl }} />

        <Button
          titulo={guardando ? 'Creando tu perfil…' : 'Comenzar mi transformación →'}
          onPress={onSiguiente}
          deshabilitado={!puedeAvanzar || guardando}
          cargando={guardando}
          fullWidth
          variante="primary"
        />
        <Text style={styles.privacidad}>
          Al continuar aceptas la política de privacidad RGPD de Sandra Manresa.
        </Text>
        <View style={{ height: Spacing['2xl'] }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.cremacalida },
  cabecera: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.md,
  },
  atras: { fontSize: 24, color: Colors.negrocacao },
  paso: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.piedra },
  scroll: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },
  titulo: {
    fontFamily: FontFamily.displaySemiBold, fontSize: FontSize.h2,
    color: Colors.negrocacao, marginTop: Spacing.md, marginBottom: Spacing.sm,
  },
  descripcion: {
    fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd,
    color: Colors.piedra, lineHeight: FontSize.bodyMd * 1.6, marginBottom: Spacing.sm,
  },
  contador: {
    fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiSm,
    color: Colors.camel, marginBottom: Spacing.lg,
  },
  opciones: { gap: Spacing.sm },
  opcion: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.lino, borderRadius: BorderRadius.xl,
    padding: Spacing.md, borderWidth: 1.5, borderColor: 'transparent',
  },
  opcionSeleccionada: { borderColor: Colors.camel, backgroundColor: Colors.cremacalida },
  opcionDeshabilitada: { opacity: 0.4 },
  opcionEmoji: { fontSize: 20, width: 28, textAlign: 'center' },
  opcionLabel: { flex: 1, fontFamily: FontFamily.sansMedium, fontSize: FontSize.bodyMd, color: Colors.negrocacao },
  opcionLabelActiva: { color: Colors.camel },
  check: { color: Colors.camel, fontSize: 16, fontFamily: FontFamily.sansBold },
  finCard: {
    borderRadius: BorderRadius['2xl'], padding: Spacing['2xl'],
    borderLeftWidth: 3, borderLeftColor: Colors.doradoarena,
  },
  finTitulo: {
    fontFamily: FontFamily.displaySemiBold, fontSize: FontSize.h3,
    color: Colors.cremacalida, marginBottom: Spacing.sm,
  },
  finTexto: {
    fontFamily: FontFamily.displayItalic, fontSize: FontSize.bodyMd,
    color: Colors.doradoarena, lineHeight: FontSize.bodyMd * 1.6,
  },
  privacidad: {
    fontFamily: FontFamily.sansRegular, fontSize: FontSize.micro,
    color: Colors.piedra, textAlign: 'center', marginTop: Spacing.lg,
  },
});
