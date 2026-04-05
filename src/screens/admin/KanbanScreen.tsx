import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { BorderRadius, Shadow, Spacing } from '../../constants/theme';
import { useAdminStore } from '../../store/adminStore';
import type { EtapaKanban, PerfilClienta } from '../../types';
import { ETAPAS_KANBAN } from '../../types';
import { MOMENTOS_VITALES } from '../../types';

export function KanbanScreen({ navigation }: { navigation: any }) {
  const { clientas, cargarClientas, actualizarEtapaKanban } = useAdminStore();

  useEffect(() => {
    cargarClientas();
  }, []);

  const etapas = Object.keys(ETAPAS_KANBAN) as EtapaKanban[];

  const clientasPorEtapa = (etapa: EtapaKanban) =>
    clientas.filter((c) => ((c as any).etapaKanban ?? 'nuevo_lead') === etapa);

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Pipeline de Ventas</Text>
        <Text style={styles.subtitulo}>{clientas.length} clientas en total</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tablero}
      >
        {etapas.map((etapa) => {
          const datos = ETAPAS_KANBAN[etapa];
          const listaClienta = clientasPorEtapa(etapa);
          const esOscura = etapa === 'fidelizada';

          return (
            <View key={etapa} style={styles.columna}>
              <View style={[styles.columnaHeader, { backgroundColor: datos.color }]}>
                <Text style={[styles.columnaTitulo, esOscura && { color: Colors.cremacalida }]}>
                  {datos.label}
                </Text>
                <View style={[styles.columnaCount, esOscura && { backgroundColor: Colors.camel }]}>
                  <Text style={[styles.columnaCountTexto, esOscura && { color: Colors.cremacalida }]}>
                    {listaClienta.length}
                  </Text>
                </View>
              </View>

              <View style={styles.columnaBody}>
                {listaClienta.map((clienta) => (
                  <TarjetaKanban
                    key={clienta.id}
                    clienta={clienta}
                    etapaActual={etapa}
                    etapas={etapas}
                    onMover={actualizarEtapaKanban}
                    onVerDetalle={() => navigation.navigate('CRMDetalle', { clientaId: clienta.id })}
                  />
                ))}

                {listaClienta.length === 0 && (
                  <View style={styles.columnaVacia}>
                    <Text style={styles.columnaVaciaTexto}>—</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function TarjetaKanban({
  clienta, etapaActual, etapas, onMover, onVerDetalle,
}: {
  clienta: PerfilClienta;
  etapaActual: EtapaKanban;
  etapas: EtapaKanban[];
  onMover: (id: string, etapa: EtapaKanban) => void;
  onVerDetalle: () => void;
}) {
  const [expandido, setExpandido] = React.useState(false);
  const momento = MOMENTOS_VITALES[clienta.momentoVital];
  const idx = etapas.indexOf(etapaActual);

  return (
    <TouchableOpacity
      onPress={() => setExpandido(!expandido)}
      onLongPress={onVerDetalle}
      style={styles.tarjeta}
      activeOpacity={0.85}
    >
      <View style={styles.tarjetaCabecera}>
        <Text style={styles.tarjetaNombre} numberOfLines={1}>
          {clienta.nombre} {clienta.apellidos}
        </Text>
        <Text style={styles.tarjetaMomento}>{momento.emoji}</Text>
      </View>
      <Text style={styles.tarjetaCiudad}>{clienta.ciudad}</Text>

      {expandido && (
        <View style={styles.tarjetaAcciones}>
          {idx > 0 && (
            <TouchableOpacity
              onPress={() => onMover(clienta.id, etapas[idx - 1])}
              style={[styles.moverBtn, styles.moverBtnAtras]}
            >
              <Text style={styles.moverBtnTexto}>← Atrás</Text>
            </TouchableOpacity>
          )}
          {idx < etapas.length - 1 && (
            <TouchableOpacity
              onPress={() => onMover(clienta.id, etapas[idx + 1])}
              style={[styles.moverBtn, styles.moverBtnDelante]}
            >
              <Text style={[styles.moverBtnTexto, { color: Colors.cremacalida }]}>Avanzar →</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.cremacalida },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.md },
  titulo: { fontFamily: FontFamily.displayBold, fontSize: FontSize.h2, color: Colors.negrocacao },
  subtitulo: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd, color: Colors.piedra },
  tablero: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing['3xl'], gap: Spacing.sm, paddingTop: Spacing.sm },
  columna: { width: 200, backgroundColor: Colors.lino, borderRadius: BorderRadius.xl, overflow: 'hidden' },
  columnaHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: Spacing.md,
  },
  columnaTitulo: { fontFamily: FontFamily.sansSemiBold, fontSize: FontSize.uiMd, color: Colors.negrocacao, flex: 1 },
  columnaCount: {
    backgroundColor: 'rgba(26,20,16,0.15)', borderRadius: BorderRadius.full,
    width: 22, height: 22, alignItems: 'center', justifyContent: 'center',
  },
  columnaCountTexto: { fontFamily: FontFamily.sansBold, fontSize: FontSize.micro, color: Colors.negrocacao },
  columnaBody: { padding: Spacing.sm, gap: Spacing.xs, minHeight: 100 },
  columnaVacia: { alignItems: 'center', paddingVertical: Spacing.xl },
  columnaVaciaTexto: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.piedra },
  tarjeta: {
    backgroundColor: Colors.cremacalida, borderRadius: BorderRadius.lg,
    padding: Spacing.sm, ...Shadow.sm,
  },
  tarjetaCabecera: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  tarjetaNombre: { flex: 1, fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiSm, color: Colors.negrocacao },
  tarjetaMomento: { fontSize: 12, marginLeft: 4 },
  tarjetaCiudad: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.micro, color: Colors.piedra },
  tarjetaAcciones: { flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.sm },
  moverBtn: { flex: 1, borderRadius: BorderRadius.full, padding: 4, alignItems: 'center', borderWidth: 1, borderColor: Colors.lino },
  moverBtnAtras: { borderColor: Colors.piedra },
  moverBtnDelante: { backgroundColor: Colors.camel, borderColor: Colors.camel },
  moverBtnTexto: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.micro, color: Colors.negrocacao },
});
