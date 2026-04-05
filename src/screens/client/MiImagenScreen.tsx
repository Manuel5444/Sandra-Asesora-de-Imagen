import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { BorderRadius, Shadow, Spacing } from '../../constants/theme';
import { useClientaStore } from '../../store/clientaStore';
import { PaletaColores } from '../../components/common/ColorCircle';
import { LookCard } from '../../components/common/LookCard';
import { Button } from '../../components/common/Button';
import { claudeService } from '../../services/claude';

const OCASIONES = [
  { id: 'reunion_trabajo', label: '💼 Reunión de trabajo', emoji: '💼' },
  { id: 'cena_romantica', label: '🕯 Cena romántica', emoji: '🕯' },
  { id: 'fin_semana', label: '🌅 Fin de semana', emoji: '🌅' },
  { id: 'evento_social', label: '🥂 Evento social', emoji: '🥂' },
  { id: 'compras', label: '🛍 Día de compras', emoji: '🛍' },
  { id: 'cita_medico', label: '🏥 Gestión / cita', emoji: '🏥' },
];

export function MiImagenScreen({ navigation }: { navigation: any }) {
  const { perfil, looks, generarNuevosLooks, toggleGuardarLook, cargandoLooks } = useClientaStore();
  const [tabActiva, setTabActiva] = useState<'paleta' | 'looks' | 'probador'>('paleta');
  const [generandoColorimetria, setGenerandoColorimetria] = useState(false);
  const [ocasionSeleccionada, setOcasionSeleccionada] = useState('');

  if (!perfil) return null;

  const generarColorimetria = async () => {
    setGenerandoColorimetria(true);
    try {
      const colorimetria = await claudeService.analizarImagenPersonal(perfil, undefined);
      // Guardar colorimetría en el perfil
      const { actualizarPerfil } = useClientaStore.getState();
      await actualizarPerfil({ colorimetria });
    } catch {
      Alert.alert('Error', 'No se pudo generar el análisis. Inténtalo de nuevo.');
    } finally {
      setGenerandoColorimetria(false);
    }
  };

  const generarLooks = async () => {
    if (!ocasionSeleccionada) {
      Alert.alert('Selecciona una ocasión', 'Elige para qué evento quieres los looks.');
      return;
    }
    const ocasion = OCASIONES.find((o) => o.id === ocasionSeleccionada)?.label ?? ocasionSeleccionada;
    await generarNuevosLooks(ocasion);
  };

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Mi Imagen</Text>
        <Text style={styles.subtitulo}>Informe personalizado por IA</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['paleta', 'looks', 'probador'] as const).map((tab) => {
          const labels = { paleta: 'Mi paleta', looks: 'Mis looks', probador: 'Probador AR' };
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setTabActiva(tab)}
              style={[styles.tab, tabActiva === tab && styles.tabActiva]}
            >
              <Text style={[styles.tabTexto, tabActiva === tab && styles.tabTextoActivo]}>
                {labels[tab]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── TAB PALETA ─────────────────────────────────────── */}
        {tabActiva === 'paleta' && (
          <>
            {perfil.colorimetria ? (
              <View>
                <View style={styles.temporadaCard}>
                  <Text style={styles.temporadaLabel}>Tu temporada de color</Text>
                  <Text style={styles.temporadaValor}>
                    {perfil.colorimetria.temporadaColor.charAt(0).toUpperCase() +
                      perfil.colorimetria.temporadaColor.slice(1)}
                  </Text>
                  <Text style={styles.temporadaDesc}>{perfil.colorimetria.subtemporada}</Text>
                </View>

                <View style={styles.paletaSeccion}>
                  <Text style={styles.paletaTitulo}>✓ Tus colores ideales</Text>
                  <PaletaColores
                    colores={perfil.colorimetria.coloresIdeales}
                    mostrarNombres
                    tamaño={44}
                    columnas={5}
                  />
                </View>

                <View style={styles.paletaSeccion}>
                  <Text style={[styles.paletaTitulo, { color: Colors.error }]}>✗ Colores a evitar</Text>
                  <PaletaColores
                    colores={perfil.colorimetria.coloresEvitar}
                    mostrarNombres
                    tamaño={36}
                    columnas={6}
                  />
                </View>

                {/* Maquillaje */}
                <View style={styles.seccion}>
                  <Text style={styles.seccionTitulo}>Maquillaje recomendado</Text>
                  <View style={styles.maquillajeCard}>
                    <MaquillajeFila etiqueta="Base" items={perfil.colorimetria.recomendacionesMaquillaje.base} />
                    <MaquillajeFila etiqueta="Labios" items={perfil.colorimetria.recomendacionesMaquillaje.labios} />
                    <MaquillajeFila etiqueta="Ojos" items={perfil.colorimetria.recomendacionesMaquillaje.ojos} />
                    <MaquillajeFila etiqueta="Colorete" items={perfil.colorimetria.recomendacionesMaquillaje.coloretes} />
                    {perfil.colorimetria.recomendacionesMaquillaje.consejo && (
                      <View style={styles.consejoMaquillaje}>
                        <Text style={styles.consejoMaquillajeTexto}>
                          ✦ {perfil.colorimetria.recomendacionesMaquillaje.consejo}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.seccion}>
                  <Button titulo="Descargar informe PDF" onPress={() => {}} variante="secondary" fullWidth />
                </View>
              </View>
            ) : (
              <View style={styles.sinColorimetria}>
                <Text style={styles.sinColorimetriaIcono}>🎨</Text>
                <Text style={styles.sinColorimetriaTitulo}>Descubre tu paleta de colores</Text>
                <Text style={styles.sinColorimetriaDesc}>
                  La IA analizará tu perfil y creará tu paleta de colores completamente personalizada.
                  {perfil.fotoUrl ? ' Tu foto ya está lista para el análisis.' : ' Sube tu foto para un análisis más preciso.'}
                </Text>
                <View style={{ height: Spacing.xl }} />
                <Button
                  titulo={generandoColorimetria ? 'Analizando…' : 'Analizar mi imagen ahora'}
                  onPress={generarColorimetria}
                  cargando={generandoColorimetria}
                  variante="dark"
                  fullWidth
                />
              </View>
            )}
          </>
        )}

        {/* ── TAB LOOKS ──────────────────────────────────────── */}
        {tabActiva === 'looks' && (
          <View>
            <Text style={styles.seccionDesc}>
              Elige la ocasión y la IA generará 3 looks completos basados en tu paleta y estilo.
            </Text>

            <View style={styles.ocasionesGrid}>
              {OCASIONES.map((oc) => (
                <TouchableOpacity
                  key={oc.id}
                  onPress={() => setOcasionSeleccionada(oc.id === ocasionSeleccionada ? '' : oc.id)}
                  style={[styles.ocasionChip, ocasionSeleccionada === oc.id && styles.ocasionChipActivo]}
                >
                  <Text style={styles.ocasionChipTexto}>{oc.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              titulo={cargandoLooks ? 'Generando looks…' : 'Generar mis looks ✨'}
              onPress={generarLooks}
              cargando={cargandoLooks}
              deshabilitado={!ocasionSeleccionada}
              variante="dark"
              fullWidth
              estiloContenedor={{ marginBottom: Spacing.xl }}
            />

            {looks.map((look) => (
              <LookCard
                key={look.id}
                look={look}
                onGuardar={toggleGuardarLook}
              />
            ))}
          </View>
        )}

        {/* ── TAB PROBADOR AR ────────────────────────────────── */}
        {tabActiva === 'probador' && (
          <View style={styles.arContenedor}>
            <View style={styles.arPlaceholder}>
              <Text style={styles.arIcono}>📱</Text>
              <Text style={styles.arTitulo}>Probador de looks con AR</Text>
              <Text style={styles.arDesc}>
                Activa la cámara y prueba colores, prendas y looks en tiempo real sobre tu imagen.
                Disponible en la app nativa iOS y Android.
              </Text>
            </View>
            <View style={{ height: Spacing.xl }} />
            <View style={styles.arOpciones}>
              {[
                { icono: '🎨', titulo: 'Prueba de colores', desc: 'Superpone colores sobre tu imagen en tiempo real' },
                { icono: '👗', titulo: 'Prueba de looks', desc: 'Visualiza outfits completos sobre tu cuerpo' },
                { icono: '💄', titulo: 'Prueba de maquillaje', desc: 'Ve el efecto de paletas antes de comprar' },
              ].map((op, i) => (
                <TouchableOpacity key={i} style={styles.arOpcion} activeOpacity={0.85}>
                  <Text style={styles.arOpcionIcono}>{op.icono}</Text>
                  <View style={styles.arOpcionTexto}>
                    <Text style={styles.arOpcionTitulo}>{op.titulo}</Text>
                    <Text style={styles.arOpcionDesc}>{op.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: Spacing['4xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function MaquillajeFila({ etiqueta, items }: { etiqueta: string; items: string[] }) {
  return (
    <View style={styles.maquillajeFila}>
      <Text style={styles.maquillajeEtiqueta}>{etiqueta}</Text>
      <Text style={styles.maquillajeValor}>{items.join(' · ')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.cremacalida },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.md },
  titulo: { fontFamily: FontFamily.displayBold, fontSize: FontSize.h1, color: Colors.negrocacao },
  subtitulo: { fontFamily: FontFamily.displayItalic, fontSize: FontSize.bodyMd, color: Colors.camel, marginTop: 4 },
  tabs: {
    flexDirection: 'row', paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1, borderBottomColor: Colors.lino,
  },
  tab: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.sm, marginRight: Spacing.md, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActiva: { borderBottomColor: Colors.camel },
  tabTexto: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiMd, color: Colors.piedra },
  tabTextoActivo: { color: Colors.camel },
  scroll: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  temporadaCard: {
    backgroundColor: Colors.negrocacao, borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl, marginBottom: Spacing.xl, alignItems: 'center',
  },
  temporadaLabel: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.doradoarena, letterSpacing: 1, textTransform: 'uppercase' },
  temporadaValor: { fontFamily: FontFamily.displayBold, fontSize: FontSize.display2xl, color: Colors.cremacalida, marginVertical: Spacing.sm },
  temporadaDesc: { fontFamily: FontFamily.displayItalic, fontSize: FontSize.bodyMd, color: Colors.doradoarena },
  paletaSeccion: { marginBottom: Spacing.xl },
  paletaTitulo: { fontFamily: FontFamily.sansSemiBold, fontSize: FontSize.uiMd, color: Colors.negrocacao, marginBottom: Spacing.md, letterSpacing: 0.5 },
  seccion: { marginBottom: Spacing.xl },
  seccionTitulo: { fontFamily: FontFamily.displaySemiBold, fontSize: FontSize.h4, color: Colors.negrocacao, marginBottom: Spacing.md },
  maquillajeCard: { backgroundColor: Colors.lino, borderRadius: BorderRadius.xl, padding: Spacing.lg },
  maquillajeFila: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.sm, gap: Spacing.md },
  maquillajeEtiqueta: { fontFamily: FontFamily.sansSemiBold, fontSize: FontSize.uiSm, color: Colors.camel, width: 64 },
  maquillajeValor: { flex: 1, fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodySm, color: Colors.negrocacao, lineHeight: FontSize.bodySm * 1.5 },
  consejoMaquillaje: { borderTopWidth: 1, borderTopColor: Colors.doradoarena, paddingTop: Spacing.md, marginTop: Spacing.sm },
  consejoMaquillajeTexto: { fontFamily: FontFamily.displayItalic, fontSize: FontSize.bodySm, color: Colors.camel },
  sinColorimetria: { alignItems: 'center', paddingVertical: Spacing['4xl'] },
  sinColorimetriaIcono: { fontSize: 56, marginBottom: Spacing.xl },
  sinColorimetriaTitulo: { fontFamily: FontFamily.displaySemiBold, fontSize: FontSize.h3, color: Colors.negrocacao, marginBottom: Spacing.sm, textAlign: 'center' },
  sinColorimetriaDesc: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd, color: Colors.piedra, textAlign: 'center', lineHeight: FontSize.bodyMd * 1.6 },
  seccionDesc: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd, color: Colors.piedra, lineHeight: FontSize.bodyMd * 1.6, marginBottom: Spacing.lg },
  ocasionesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl },
  ocasionChip: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, backgroundColor: Colors.lino, borderWidth: 1.5, borderColor: 'transparent' },
  ocasionChipActivo: { borderColor: Colors.camel, backgroundColor: Colors.cremacalida },
  ocasionChipTexto: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.negrocacao },
  arContenedor: {},
  arPlaceholder: {
    backgroundColor: Colors.negrocacao, borderRadius: BorderRadius['2xl'],
    padding: Spacing['3xl'], alignItems: 'center',
  },
  arIcono: { fontSize: 48, marginBottom: Spacing.md },
  arTitulo: { fontFamily: FontFamily.displaySemiBold, fontSize: FontSize.h3, color: Colors.cremacalida, marginBottom: Spacing.sm, textAlign: 'center' },
  arDesc: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodySm, color: Colors.doradoarena, textAlign: 'center', lineHeight: FontSize.bodySm * 1.6 },
  arOpciones: { gap: Spacing.sm },
  arOpcion: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.lino, borderRadius: BorderRadius.xl, padding: Spacing.lg,
  },
  arOpcionIcono: { fontSize: 28 },
  arOpcionTexto: { flex: 1 },
  arOpcionTitulo: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.bodyMd, color: Colors.negrocacao, marginBottom: 2 },
  arOpcionDesc: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodySm, color: Colors.piedra },
});
