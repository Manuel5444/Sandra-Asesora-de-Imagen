import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { BorderRadius, Shadow, Spacing } from '../../constants/theme';
import { useAdminStore } from '../../store/adminStore';
import { ClientaCard } from '../../components/common/ClientaCard';

export function DashboardScreen({ navigation }: { navigation: any }) {
  const {
    clientas, sesiones, metricas, postits,
    cargarClientas, cargarSesiones, cargarMetricas, cargarPostits,
  } = useAdminStore();

  const [refrescando, setRefrescando] = React.useState(false);

  useEffect(() => {
    cargarClientas();
    cargarSesiones();
    cargarMetricas();
    cargarPostits();
  }, []);

  const onRefresh = async () => {
    setRefrescando(true);
    await Promise.all([cargarClientas(), cargarSesiones(), cargarMetricas()]);
    setRefrescando(false);
  };

  const hoy = new Date();
  const hora = hoy.getHours();
  const saludo = hora < 13 ? 'Buenos días' : hora < 20 ? 'Buenas tardes' : 'Buenas noches';

  const sesionesDia = sesiones.filter((s) => {
    const fecha = new Date(s.fechaHora);
    return fecha.toDateString() === hoy.toDateString();
  });

  const alertas = [
    ...clientas.filter((c) => {
      if (!c.actualizadoEn) return false;
      const dias = (Date.now() - new Date(c.actualizadoEn).getTime()) / (1000 * 60 * 60 * 24);
      return dias > 30;
    }).slice(0, 2).map((c) => ({ tipo: 'inactividad', texto: `${c.nombre} lleva +30 días sin actividad`, clientaId: c.id })),
    ...postits.filter((p) => !p.completado && p.color === 'urgente').slice(0, 2).map((p) => ({
      tipo: 'postit', texto: p.contenido, clientaId: p.clientaId,
    })),
  ];

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefresh} tintColor={Colors.camel} />}
      >
        {/* Header oscuro */}
        <LinearGradient colors={[Colors.negrocacao, '#1E1810']} style={styles.header}>
          <Text style={styles.saludo}>{saludo}, Sandra ✦</Text>
          <Text style={styles.saludoSub}>
            Tienes {sesionesDia.length} sesión{sesionesDia.length !== 1 ? 'es' : ''} hoy y {alertas.length} asunto{alertas.length !== 1 ? 's' : ''} pendiente{alertas.length !== 1 ? 's' : ''}.
          </Text>
        </LinearGradient>

        {/* Métricas */}
        <View style={styles.metricasGrid}>
          <MetricaCard
            valor={metricas?.clientasActivas ?? '—'}
            label="Clientas activas"
            color={Colors.camel}
            onPress={() => navigation.navigate('CRM')}
          />
          <MetricaCard
            valor={metricas?.sesionesSemana ?? '—'}
            label="Sesiones / semana"
            color={Colors.negrocacao}
            onPress={() => navigation.navigate('Agenda')}
          />
          <MetricaCard
            valor={metricas?.ingresosMes ? `${metricas.ingresosMes}€` : '—'}
            label="Ingresos del mes"
            color={Colors.doradoarena}
            onPress={() => navigation.navigate('Metricas')}
          />
          <MetricaCard
            valor={metricas?.nuevasSolicitudes ?? '—'}
            label="Nuevas solicitudes"
            color={Colors.success}
            onPress={() => navigation.navigate('Pipeline')}
          />
        </View>

        {/* Alertas */}
        {alertas.length > 0 && (
          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>⚠ Alertas</Text>
            {alertas.map((alerta, i) => (
              <TouchableOpacity
                key={i}
                style={styles.alertaCard}
                onPress={() => alerta.clientaId && navigation.navigate('CRMDetalle', { clientaId: alerta.clientaId })}
                activeOpacity={0.85}
              >
                <Text style={styles.alertaIcono}>{alerta.tipo === 'inactividad' ? '🔔' : '📌'}</Text>
                <Text style={styles.alertaTexto}>{alerta.texto}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Agenda del día */}
        <View style={styles.seccion}>
          <View style={styles.seccionCabecera}>
            <Text style={styles.seccionTitulo}>Agenda de hoy</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Agenda')}>
              <Text style={styles.verTodo}>Ver agenda →</Text>
            </TouchableOpacity>
          </View>
          {sesionesDia.length === 0 ? (
            <View style={styles.sinSesiones}>
              <Text style={styles.sinSesionesTexto}>Sin sesiones programadas para hoy</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Agenda')}>
                <Text style={styles.sinSesionesBoton}>+ Nueva sesión</Text>
              </TouchableOpacity>
            </View>
          ) : (
            sesionesDia.map((sesion) => {
              const clienta = clientas.find((c) => c.id === sesion.clientaId);
              return (
                <View key={sesion.id} style={styles.sesionCard}>
                  <View style={[styles.sesionColor, { backgroundColor: Colors.camel }]} />
                  <View style={styles.sesionInfo}>
                    <Text style={styles.sesionHora}>
                      {new Date(sesion.fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Text style={styles.sesionNombre}>{clienta?.nombre ?? 'Clienta'} {clienta?.apellidos ?? ''}</Text>
                    <Text style={styles.sesionTipo}>{sesion.tipo.replace(/_/g, ' ')}</Text>
                  </View>
                  <Text style={styles.sesionDuracion}>{sesion.duracionMinutos}min</Text>
                </View>
              );
            })
          )}
        </View>

        {/* Últimas 5 clientas activas */}
        <View style={styles.seccion}>
          <View style={styles.seccionCabecera}>
            <Text style={styles.seccionTitulo}>Clientas recientes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CRM')}>
              <Text style={styles.verTodo}>Ver CRM →</Text>
            </TouchableOpacity>
          </View>
          {clientas.slice(0, 5).map((clienta) => (
            <ClientaCard
              key={clienta.id}
              clienta={clienta}
              compacto
              onPress={(c) => navigation.navigate('CRMDetalle', { clientaId: c.id })}
            />
          ))}
        </View>

        {/* Acceso rápido */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Acceso rápido</Text>
          <View style={styles.accionesGrid}>
            {[
              { icono: '👤', label: 'Nueva clienta', ruta: 'CRM' },
              { icono: '📝', label: 'Nueva nota', ruta: 'PostIts' },
              { icono: '📅', label: 'Nueva sesión', ruta: 'Agenda' },
              { icono: '📊', label: 'Generar informe', ruta: 'CRM' },
            ].map((acc, i) => (
              <TouchableOpacity
                key={i}
                style={styles.accionCard}
                onPress={() => navigation.navigate(acc.ruta)}
                activeOpacity={0.85}
              >
                <Text style={styles.accionIcono}>{acc.icono}</Text>
                <Text style={styles.accionLabel}>{acc.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: Spacing['4xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricaCard({ valor, label, color, onPress }: {
  valor: number | string; label: string; color: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.metricaCard} activeOpacity={0.85}>
      <Text style={[styles.metricaValor, { color }]}>{valor}</Text>
      <Text style={styles.metricaLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.cremacalida },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing['2xl'] },
  saludo: { fontFamily: FontFamily.displayBold, fontSize: FontSize.h2, color: Colors.cremacalida },
  saludoSub: { fontFamily: FontFamily.displayItalic, fontSize: FontSize.bodyMd, color: Colors.doradoarena, marginTop: Spacing.xs },
  metricasGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: Spacing.md, gap: Spacing.sm, paddingHorizontal: Spacing.xl },
  metricaCard: {
    width: '47%', backgroundColor: Colors.lino, borderRadius: BorderRadius.xl,
    padding: Spacing.md, ...Shadow.sm, alignItems: 'center',
  },
  metricaValor: { fontFamily: FontFamily.displayBold, fontSize: FontSize.display2xl, lineHeight: FontSize.display2xl * 1.1 },
  metricaLabel: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.piedra, textAlign: 'center', marginTop: 4 },
  seccion: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl },
  seccionCabecera: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  seccionTitulo: { fontFamily: FontFamily.displaySemiBold, fontSize: FontSize.h4, color: Colors.negrocacao, marginBottom: Spacing.md },
  verTodo: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiSm, color: Colors.camel },
  alertaCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.lino, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.xs,
    borderLeftWidth: 3, borderLeftColor: Colors.warning,
  },
  alertaIcono: { fontSize: 18 },
  alertaTexto: { flex: 1, fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodySm, color: Colors.negrocacao },
  sinSesiones: {
    backgroundColor: Colors.lino, borderRadius: BorderRadius.xl, padding: Spacing.xl, alignItems: 'center',
  },
  sinSesionesTexto: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd, color: Colors.piedra, marginBottom: Spacing.sm },
  sinSesionesBoton: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiMd, color: Colors.camel },
  sesionCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.cremacalida, borderRadius: BorderRadius.xl,
    padding: Spacing.md, ...Shadow.sm, marginBottom: Spacing.xs,
  },
  sesionColor: { width: 4, height: 40, borderRadius: 2 },
  sesionInfo: { flex: 1 },
  sesionHora: { fontFamily: FontFamily.sansBold, fontSize: FontSize.bodyMd, color: Colors.negrocacao },
  sesionNombre: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiMd, color: Colors.negrocacao },
  sesionTipo: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.piedra, textTransform: 'capitalize' },
  sesionDuracion: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiSm, color: Colors.camel },
  accionesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  accionCard: {
    width: '47%', backgroundColor: Colors.lino, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, alignItems: 'center', ...Shadow.sm,
  },
  accionIcono: { fontSize: 28, marginBottom: Spacing.sm },
  accionLabel: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiSm, color: Colors.negrocacao, textAlign: 'center' },
});
