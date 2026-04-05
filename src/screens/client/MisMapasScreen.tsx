import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { BorderRadius, Spacing } from '../../constants/theme';
import { useClientaStore } from '../../store/clientaStore';
import { LugarCard } from '../../components/common/MapaPin';
import { Button } from '../../components/common/Button';
import { mapsService, CIUDADES_SOPORTADAS } from '../../services/maps';
import type { LugarMapa, TipoLugar } from '../../types';

type CapaActiva = 'shopping' | 'gastronomia' | 'ocio' | 'cultura';

const CAPAS: { id: CapaActiva; label: string; icono: string }[] = [
  { id: 'shopping', label: 'Shopping', icono: '🛍' },
  { id: 'gastronomia', label: 'Restaurantes', icono: '🍽' },
  { id: 'ocio', label: 'Ocio', icono: '🎭' },
  { id: 'cultura', label: 'Cultura', icono: '🎨' },
];

export function MisMapasScreen() {
  const { perfil, modoViaje, activarModoViaje, desactivarModoViaje } = useClientaStore();
  const [capaActiva, setCapaActiva] = useState<CapaActiva>('shopping');
  const [lugares, setLugares] = useState<LugarMapa[]>([]);
  const [cargando, setCargando] = useState(false);
  const [buscandoCiudad, setBuscandoCiudad] = useState('');
  const [mostrarBuscador, setMostrarBuscador] = useState(false);

  const ciudadActual = modoViaje ?? perfil?.ciudad ?? 'Madrid';

  useEffect(() => {
    if (perfil) cargarLugares();
  }, [capaActiva, modoViaje, perfil]);

  const cargarLugares = async () => {
    if (!perfil) return;
    setCargando(true);
    try {
      let resultado: LugarMapa[] = [];
      if (capaActiva === 'shopping') {
        resultado = await mapsService.obtenerLugaresShopping(perfil, ciudadActual);
      } else {
        const tipo = capaActiva === 'gastronomia' ? 'restaurante' : capaActiva as 'cultura' | 'ocio';
        resultado = await mapsService.obtenerLugaresOcio(perfil, ciudadActual, tipo);
      }
      setLugares(resultado);
    } catch (e) {
      console.error('Error cargando lugares:', e);
    } finally {
      setCargando(false);
    }
  };

  const activarViaje = (ciudad: string) => {
    activarModoViaje(ciudad);
    setMostrarBuscador(false);
    setBuscandoCiudad('');
  };

  if (!perfil) return null;

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerFila}>
          <View>
            <Text style={styles.titulo}>Mis Mapas</Text>
            <TouchableOpacity onPress={() => setMostrarBuscador(!mostrarBuscador)}>
              <Text style={styles.ciudadLabel}>
                {modoViaje ? `✈️ ${modoViaje}` : `📍 ${perfil.ciudad}`}
                <Text style={styles.cambiarCiudad}> Cambiar →</Text>
              </Text>
            </TouchableOpacity>
          </View>
          {modoViaje && (
            <TouchableOpacity onPress={desactivarModoViaje} style={styles.desactivarViaje}>
              <Text style={styles.desactivarViajeTexto}>✕ Salir modo viaje</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Buscador de ciudad / modo viaje */}
        {mostrarBuscador && (
          <View style={styles.buscadorContenedor}>
            <TextInput
              value={buscandoCiudad}
              onChangeText={setBuscandoCiudad}
              placeholder="Buscar ciudad…"
              placeholderTextColor={Colors.piedra}
              style={styles.buscadorInput}
              autoFocus
            />
            <View style={styles.ciudadesSugeridas}>
              {CIUDADES_SOPORTADAS.filter((c) =>
                c.toLowerCase().includes(buscandoCiudad.toLowerCase())
              ).map((ciudad) => (
                <TouchableOpacity
                  key={ciudad}
                  onPress={() => activarViaje(ciudad)}
                  style={styles.ciudadSugerida}
                >
                  <Text style={styles.ciudadSugeridaTexto}>{ciudad}</Text>
                </TouchableOpacity>
              ))}
              {buscandoCiudad.length > 2 && !CIUDADES_SOPORTADAS.some(
                (c) => c.toLowerCase() === buscandoCiudad.toLowerCase()
              ) && (
                <TouchableOpacity
                  onPress={() => activarViaje(buscandoCiudad)}
                  style={[styles.ciudadSugerida, { borderColor: Colors.camel }]}
                >
                  <Text style={styles.ciudadSugeridaTexto}>Buscar en "{buscandoCiudad}" →</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Capas de mapa */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.capasScroll}
        contentContainerStyle={styles.capasContenido}
      >
        {CAPAS.map((capa) => (
          <TouchableOpacity
            key={capa.id}
            onPress={() => setCapaActiva(capa.id)}
            style={[styles.capaChip, capaActiva === capa.id && styles.capaChipActiva]}
          >
            <Text style={styles.capaIcono}>{capa.icono}</Text>
            <Text style={[styles.capaLabel, capaActiva === capa.id && styles.capaLabelActiva]}>
              {capa.label}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => {/* generar ruta */}}
          style={[styles.capaChip, { borderColor: Colors.negrocacao, backgroundColor: Colors.negrocacao }]}
        >
          <Text style={styles.capaIcono}>🗺</Text>
          <Text style={[styles.capaLabel, { color: Colors.cremacalida }]}>Ruta →</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Contenido */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Banner modo viaje */}
        {modoViaje && (
          <View style={styles.bannerViaje}>
            <Text style={styles.bannerViajeTexto}>
              ✈️ Modo Viaje activo · {modoViaje}
            </Text>
            <Text style={styles.bannerViajeDesc}>
              Recomendaciones personalizadas para tu estilo en {modoViaje}
            </Text>
          </View>
        )}

        {/* Sesión Sandra */}
        <TouchableOpacity style={styles.sesionCard} activeOpacity={0.88}>
          <View style={styles.sesionIcono}>
            <Text style={{ fontSize: 24 }}>✦</Text>
          </View>
          <View style={styles.sesionTexto}>
            <Text style={styles.sesionTitulo}>Próxima sesión con Sandra</Text>
            <Text style={styles.sesionDir}>C/ Velázquez 28, 2ºD · Madrid</Text>
            <Text style={styles.sesionDesc}>Toca para ver la ruta y los detalles</Text>
          </View>
        </TouchableOpacity>

        {/* Lista de lugares */}
        {cargando ? (
          <ActivityIndicator color={Colors.camel} size="large" style={{ marginTop: Spacing['3xl'] }} />
        ) : (
          <>
            <Text style={styles.listaTitulo}>
              {CAPAS.find((c) => c.id === capaActiva)?.icono}{' '}
              {CAPAS.find((c) => c.id === capaActiva)?.label} recomendado en {ciudadActual}
            </Text>
            {lugares.map((lugar, i) => (
              <LugarCard key={lugar.id} lugar={lugar} numero={i + 1} />
            ))}
            {lugares.length === 0 && !cargando && (
              <View style={styles.sinResultados}>
                <Text style={styles.sinResultadosTexto}>
                  No encontramos lugares para este filtro. Prueba con otra ciudad o categoría.
                </Text>
              </View>
            )}
          </>
        )}

        <View style={{ height: Spacing['4xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.cremacalida },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.md },
  headerFila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titulo: { fontFamily: FontFamily.displayBold, fontSize: FontSize.h1, color: Colors.negrocacao },
  ciudadLabel: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd, color: Colors.negrocacao, marginTop: 4 },
  cambiarCiudad: { color: Colors.camel, fontFamily: FontFamily.sansMedium },
  desactivarViaje: {
    backgroundColor: Colors.lino, borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
  },
  desactivarViajeTexto: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiSm, color: Colors.camel },
  buscadorContenedor: { marginTop: Spacing.md },
  buscadorInput: {
    backgroundColor: Colors.lino, borderRadius: BorderRadius.lg, padding: Spacing.md,
    fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd, color: Colors.negrocacao,
    borderWidth: 1, borderColor: Colors.doradoarena,
  },
  ciudadesSugeridas: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginTop: Spacing.sm },
  ciudadSugerida: {
    borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    backgroundColor: Colors.lino, borderWidth: 1, borderColor: Colors.lino,
  },
  ciudadSugeridaTexto: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.negrocacao },
  capasScroll: { maxHeight: 56, borderBottomWidth: 1, borderBottomColor: Colors.lino },
  capasContenido: { paddingHorizontal: Spacing.xl, gap: Spacing.sm, alignItems: 'center', paddingVertical: Spacing.sm },
  capaChip: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    backgroundColor: Colors.lino, borderWidth: 1, borderColor: 'transparent',
  },
  capaChipActiva: { backgroundColor: Colors.negrocacao },
  capaIcono: { fontSize: 14 },
  capaLabel: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiSm, color: Colors.negrocacao },
  capaLabelActiva: { color: Colors.cremacalida },
  scroll: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  bannerViaje: {
    backgroundColor: Colors.negrocacao, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, marginBottom: Spacing.xl,
  },
  bannerViajeTexto: { fontFamily: FontFamily.sansBold, fontSize: FontSize.bodyMd, color: Colors.cremacalida, marginBottom: 4 },
  bannerViajeDesc: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodySm, color: Colors.doradoarena },
  sesionCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.camel, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, marginBottom: Spacing.xl,
  },
  sesionIcono: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.negrocacao, alignItems: 'center', justifyContent: 'center',
  },
  sesionTexto: { flex: 1 },
  sesionTitulo: { fontFamily: FontFamily.sansSemiBold, fontSize: FontSize.bodyMd, color: Colors.cremacalida },
  sesionDir: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodySm, color: Colors.cremacalida, opacity: 0.8, marginTop: 2 },
  sesionDesc: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.micro, color: Colors.cremacalida, opacity: 0.7, marginTop: 2 },
  listaTitulo: { fontFamily: FontFamily.displaySemiBold, fontSize: FontSize.h4, color: Colors.negrocacao, marginBottom: Spacing.md },
  sinResultados: { padding: Spacing.xl, alignItems: 'center' },
  sinResultadosTexto: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd, color: Colors.piedra, textAlign: 'center' },
});
