import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { BorderRadius, Spacing } from '../../constants/theme';
import { useAdminStore } from '../../store/adminStore';
import { ClientaCard } from '../../components/common/ClientaCard';
import { BadgeEtapaKanban } from '../../components/common/Badge';
import type { EtapaKanban } from '../../types';
import { ETAPAS_KANBAN } from '../../types';

export function CRMScreen({ navigation }: { navigation: any }) {
  const { clientas, buscarClientas, filtrarPorEtapa, filtroEtapa, cargando } = useAdminStore();
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    buscarClientas('');
  }, []);

  const handleBusqueda = (texto: string) => {
    setBusqueda(texto);
    buscarClientas(texto);
  };

  const etapas = Object.keys(ETAPAS_KANBAN) as EtapaKanban[];

  const clientasFiltradas = filtroEtapa
    ? clientas.filter((c) => (c as any).etapaKanban === filtroEtapa)
    : clientas;

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titulo}>CRM · Clientas</Text>
        <TouchableOpacity onPress={() => navigation.navigate('NuevaClienta')} style={styles.nuevaBtn}>
          <Text style={styles.nuevaBtnTexto}>+ Nueva</Text>
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <View style={styles.buscadorContenedor}>
        <TextInput
          value={busqueda}
          onChangeText={handleBusqueda}
          placeholder="Buscar clienta por nombre o email…"
          placeholderTextColor={Colors.piedra}
          style={styles.buscador}
        />
      </View>

      {/* Filtros por etapa */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtrosScroll}
        contentContainerStyle={styles.filtrosContenido}
      >
        <TouchableOpacity
          onPress={() => filtrarPorEtapa(null)}
          style={[styles.filtroChip, !filtroEtapa && styles.filtroChipActivo]}
        >
          <Text style={[styles.filtroTexto, !filtroEtapa && styles.filtroTextoActivo]}>
            Todas ({clientas.length})
          </Text>
        </TouchableOpacity>
        {etapas.map((etapa) => {
          const datos = ETAPAS_KANBAN[etapa];
          const count = clientas.filter((c) => (c as any).etapaKanban === etapa).length;
          return (
            <TouchableOpacity
              key={etapa}
              onPress={() => filtrarPorEtapa(etapa === filtroEtapa ? null : etapa)}
              style={[
                styles.filtroChip,
                { backgroundColor: datos.color },
                filtroEtapa === etapa && styles.filtroChipActivo,
              ]}
            >
              <Text style={[styles.filtroTexto, filtroEtapa === etapa && styles.filtroTextoActivo]}>
                {datos.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Lista */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {cargando ? (
          <ActivityIndicator color={Colors.camel} size="large" style={{ marginTop: Spacing['3xl'] }} />
        ) : clientasFiltradas.length === 0 ? (
          <View style={styles.vacio}>
            <Text style={styles.vacioIcono}>👤</Text>
            <Text style={styles.vacioTexto}>
              {busqueda ? `No hay clientas que coincidan con "${busqueda}"` : 'Aún no hay clientas registradas'}
            </Text>
          </View>
        ) : (
          clientasFiltradas.map((clienta) => (
            <ClientaCard
              key={clienta.id}
              clienta={clienta}
              onPress={(c) => {
                useAdminStore.getState().seleccionarClienta(c);
                navigation.navigate('CRMDetalle', { clientaId: c.id });
              }}
            />
          ))
        )}
        <View style={{ height: Spacing['4xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Pantalla detalle de clienta ─────────────────────────────────────────────

export function CRMDetalleScreen({ navigation, route }: { navigation: any; route: any }) {
  const { clientaId } = route.params;
  const { clientas, sesiones, informes, seleccionarClienta, cargarInformes, cargarSesiones, generarInforme, generandoInforme } = useAdminStore();
  const clienta = clientas.find((c) => c.id === clientaId);

  const [tabActiva, setTabActiva] = useState<'perfil' | 'sesiones' | 'informes'>('perfil');

  useEffect(() => {
    cargarInformes(clientaId);
    cargarSesiones();
  }, [clientaId]);

  if (!clienta) {
    return (
      <View style={styles.contenedor}>
        <Text style={{ padding: Spacing.xl }}>Clienta no encontrada</Text>
      </View>
    );
  }

  const sesionesClienta = sesiones.filter((s) => s.clientaId === clientaId);
  const informesClienta = informes.filter((i) => i.clientaId === clientaId);

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>
      {/* Header */}
      <View style={styles.detalleHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.atrasBtn}>
          <Text style={styles.atrasTexto}>← Volver</Text>
        </TouchableOpacity>
        <View style={styles.detalleHeaderAcciones}>
          <TouchableOpacity
            onPress={() => generarInforme(clientaId, 'imagen_completa')}
            style={styles.accionBtn}
          >
            <Text style={styles.accionBtnTexto}>📊 Informe</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.accionBtn}>
            <Text style={styles.accionBtnTexto}>💬 Mensaje</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['perfil', 'sesiones', 'informes'] as const).map((tab) => {
          const labels = { perfil: 'Perfil', sesiones: `Sesiones (${sesionesClienta.length})`, informes: `Informes (${informesClienta.length})` };
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

        {tabActiva === 'perfil' && (
          <View>
            <View style={styles.clientaResumen}>
              <Text style={styles.clientaNombre}>{clienta.nombre} {clienta.apellidos}</Text>
              <Text style={styles.clientaDatos}>{clienta.ciudad} · {clienta.edad} años · {clienta.plan}</Text>
              <BadgeEtapaKanban etapa={(clienta as any).etapaKanban ?? 'clienta_activa'} />
            </View>

            {clienta.colorimetria && (
              <View style={styles.seccionDetalle}>
                <Text style={styles.seccionDetalleTitulo}>Colorimetría</Text>
                <Text style={styles.colorimetriaTemporada}>
                  Temporada: {clienta.colorimetria.temporadaColor}
                </Text>
                <View style={styles.coloresRow}>
                  {clienta.colorimetria.coloresIdeales.slice(0, 6).map((c, i) => (
                    <View key={i} style={[styles.colorBola, { backgroundColor: c.hex }]} />
                  ))}
                </View>
              </View>
            )}

            <View style={styles.seccionDetalle}>
              <Text style={styles.seccionDetalleTitulo}>Notas privadas</Text>
              <View style={styles.notasArea}>
                <Text style={styles.notasPlaceholder}>
                  Escribe aquí tus notas sobre esta clienta…
                </Text>
              </View>
            </View>

            <View style={styles.seccionDetalle}>
              <Text style={styles.seccionDetalleTitulo}>Datos económicos</Text>
              <View style={styles.datosRow}>
                <View style={styles.datoDato}>
                  <Text style={styles.datoValor}>0€</Text>
                  <Text style={styles.datoLabel}>Total facturado</Text>
                </View>
                <View style={styles.datoDato}>
                  <Text style={styles.datoValor}>{sesionesClienta.length}</Text>
                  <Text style={styles.datoLabel}>Sesiones totales</Text>
                </View>
                <View style={styles.datoDato}>
                  <Text style={styles.datoValor}>{clienta.puntosSandra}</Text>
                  <Text style={styles.datoLabel}>Puntos Sandra</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {tabActiva === 'sesiones' && (
          <View>
            <TouchableOpacity style={styles.nuevaSesionBtn}>
              <Text style={styles.nuevaSesionBtnTexto}>+ Programar nueva sesión</Text>
            </TouchableOpacity>
            {sesionesClienta.length === 0 ? (
              <Text style={styles.vacioTexto}>Sin sesiones registradas</Text>
            ) : (
              sesionesClienta.map((s) => (
                <View key={s.id} style={styles.sesionItem}>
                  <Text style={styles.sesionItemFecha}>
                    {new Date(s.fechaHora).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </Text>
                  <Text style={styles.sesionItemTipo}>{s.tipo.replace(/_/g, ' ')}</Text>
                  <Text style={styles.sesionItemEstado}>{s.estado}</Text>
                </View>
              ))
            )}
          </View>
        )}

        {tabActiva === 'informes' && (
          <View>
            <TouchableOpacity
              style={styles.nuevaSesionBtn}
              onPress={() => generarInforme(clientaId, 'imagen_completa')}
            >
              <Text style={styles.nuevaSesionBtnTexto}>
                {generandoInforme ? '⏳ Generando informe…' : '✨ Generar nuevo informe IA'}
              </Text>
            </TouchableOpacity>
            {informesClienta.map((inf) => (
              <View key={inf.id} style={styles.informeItem}>
                <Text style={styles.informeItemTitulo}>{inf.titulo}</Text>
                <Text style={styles.informeItemFecha}>
                  {new Date(inf.creadoEn).toLocaleDateString('es-ES')} · {inf.estado}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: Spacing['4xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.cremacalida },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.md },
  titulo: { fontFamily: FontFamily.displayBold, fontSize: FontSize.h2, color: Colors.negrocacao },
  nuevaBtn: { backgroundColor: Colors.camel, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  nuevaBtnTexto: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiSm, color: Colors.cremacalida },
  buscadorContenedor: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.sm },
  buscador: {
    backgroundColor: Colors.lino, borderRadius: BorderRadius.lg, padding: Spacing.md,
    fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd, color: Colors.negrocacao,
    borderWidth: 1, borderColor: Colors.doradoarena,
  },
  filtrosScroll: { maxHeight: 50 },
  filtrosContenido: { paddingHorizontal: Spacing.xl, gap: Spacing.xs, alignItems: 'center', paddingVertical: Spacing.xs },
  filtroChip: {
    borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: 4,
    backgroundColor: Colors.lino,
  },
  filtroChipActivo: { borderWidth: 1.5, borderColor: Colors.camel },
  filtroTexto: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.negrocacao },
  filtroTextoActivo: { fontFamily: FontFamily.sansMedium, color: Colors.camel },
  scroll: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md },
  vacio: { alignItems: 'center', paddingTop: Spacing['4xl'] },
  vacioIcono: { fontSize: 40, marginBottom: Spacing.md },
  vacioTexto: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd, color: Colors.piedra, textAlign: 'center' },
  // Detalle
  detalleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.md },
  atrasBtn: {},
  atrasTexto: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiMd, color: Colors.camel },
  detalleHeaderAcciones: { flexDirection: 'row', gap: Spacing.sm },
  accionBtn: { backgroundColor: Colors.lino, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  accionBtnTexto: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiSm, color: Colors.negrocacao },
  tabs: { flexDirection: 'row', paddingHorizontal: Spacing.xl, borderBottomWidth: 1, borderBottomColor: Colors.lino },
  tab: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xs, marginRight: Spacing.sm, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActiva: { borderBottomColor: Colors.camel },
  tabTexto: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiSm, color: Colors.piedra },
  tabTextoActivo: { color: Colors.camel },
  clientaResumen: { padding: Spacing.xl, backgroundColor: Colors.lino, borderRadius: BorderRadius.xl, marginBottom: Spacing.xl },
  clientaNombre: { fontFamily: FontFamily.displayBold, fontSize: FontSize.h2, color: Colors.negrocacao, marginBottom: 4 },
  clientaDatos: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd, color: Colors.piedra, marginBottom: Spacing.sm },
  seccionDetalle: { marginBottom: Spacing.xl },
  seccionDetalleTitulo: { fontFamily: FontFamily.displaySemiBold, fontSize: FontSize.h4, color: Colors.negrocacao, marginBottom: Spacing.md },
  colorimetriaTemporada: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiMd, color: Colors.camel, marginBottom: Spacing.sm },
  coloresRow: { flexDirection: 'row', gap: Spacing.xs },
  colorBola: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(26,20,16,0.1)' },
  notasArea: { backgroundColor: Colors.lino, borderRadius: BorderRadius.xl, padding: Spacing.lg, minHeight: 100 },
  notasPlaceholder: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd, color: Colors.piedra },
  datosRow: { flexDirection: 'row', gap: Spacing.sm },
  datoDato: { flex: 1, backgroundColor: Colors.lino, borderRadius: BorderRadius.xl, padding: Spacing.md, alignItems: 'center' },
  datoValor: { fontFamily: FontFamily.displayBold, fontSize: FontSize.h2, color: Colors.camel },
  datoLabel: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.micro, color: Colors.piedra, textAlign: 'center' },
  nuevaSesionBtn: { backgroundColor: Colors.negrocacao, borderRadius: BorderRadius.full, padding: Spacing.md, alignItems: 'center', marginBottom: Spacing.lg },
  nuevaSesionBtnTexto: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiMd, color: Colors.cremacalida },
  sesionItem: { backgroundColor: Colors.lino, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm },
  sesionItemFecha: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiMd, color: Colors.negrocacao },
  sesionItemTipo: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodySm, color: Colors.piedra, textTransform: 'capitalize' },
  sesionItemEstado: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.micro, color: Colors.camel, textTransform: 'capitalize' },
  informeItem: { backgroundColor: Colors.lino, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm },
  informeItemTitulo: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiMd, color: Colors.negrocacao },
  informeItemFecha: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodySm, color: Colors.piedra, textTransform: 'capitalize' },
});
