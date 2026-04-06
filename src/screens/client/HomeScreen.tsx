import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { BorderRadius, Shadow, Spacing } from '../../constants/theme';
import { useClientaStore } from '../../store/clientaStore';
import { useAuthStore } from '../../store/authStore';
import { ConsejoCard } from '../../components/common/ConsejoCard';
import { LookCard } from '../../components/common/LookCard';
import { LugarCard } from '../../components/common/MapaPin';
import { BarraPuntos } from '../../components/common/ProgressBar';
import { LOGROS_DISPONIBLES } from '../../types';

export function HomeScreen({ navigation }: { navigation: any }) {
  const { user } = useAuthStore();
  const {
    perfil, looks, consejoDelDia, logros,
    cargarPerfil, cargarLooks, cargarConsejoDelDia,
    toggleGuardarLook, cargandoLooks,
  } = useClientaStore();

  const [refrescando, setRefrescando] = React.useState(false);

  useEffect(() => {
    if (user) cargarPerfil(user.id);
  }, [user]);

  useEffect(() => {
    if (perfil) cargarLooks();
  }, [perfil]);

  const onRefresh = async () => {
    setRefrescando(true);
    if (user) {
      await cargarPerfil(user.id);
      await cargarLooks();
      await cargarConsejoDelDia();
    }
    setRefrescando(false);
  };

  const logrosCompletados = logros.filter((l) => l.completado).length;
  const proximoLogro = logros.find((l) => !l.completado);

  if (!perfil) {
    return (
      <View style={styles.cargando}>
        <Text style={styles.cargandoTexto}>Cargando tu espacio…</Text>
      </View>
    );
  }

  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const hoy = new Date();
  const saludo = hoy.getHours() < 13 ? 'Buenos días' : hoy.getHours() < 20 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>
      {/* Header oscuro */}
      <LinearGradient colors={[Colors.negrocacao, '#1E1810']} style={styles.header}>
        <View style={styles.headerFila}>
          <View>
            <Text style={styles.saludo}>{saludo}, {perfil.nombre} ✦</Text>
            <Text style={styles.saludoFecha}>{diasSemana[hoy.getDay()]} {hoy.getDate()} de {hoy.toLocaleDateString('es-ES', { month: 'long' })}</Text>
          </View>
          <TouchableOpacity
            style={styles.puntosChip}
            onPress={() => navigation.navigate('MiTransformacion')}
          >
            <Text style={styles.puntosNum}>{perfil.puntosSandra}</Text>
            <Text style={styles.puntosLabel}>pts ✦</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefresh} tintColor={Colors.camel} />}
        contentContainerStyle={styles.scroll}
      >
        {/* Consejo del día */}
        <View style={styles.seccion}>
          <ConsejoCard consejo={consejoDelDia ?? 'Hoy es un día perfecto para descubrir un nuevo color que te defina.'} />
        </View>

        {/* Looks de la semana */}
        <View style={styles.seccion}>
          <View style={styles.seccionCabecera}>
            <Text style={styles.seccionTitulo}>Looks de la semana</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MiImagen')}>
              <Text style={styles.verTodo}>Ver todos →</Text>
            </TouchableOpacity>
          </View>

          {looks.length === 0 && !cargandoLooks ? (
            <TouchableOpacity
              style={styles.generarLooksCard}
              onPress={() => navigation.navigate('MiImagen')}
              activeOpacity={0.85}
            >
              <Text style={styles.generarLooksIcono}>✨</Text>
              <Text style={styles.generarLooksTitulo}>Genera tus primeros looks</Text>
              <Text style={styles.generarLooksDesc}>
                La IA creará outfits personalizados para ti basándose en tu colorimetría y tu momento vital.
              </Text>
            </TouchableOpacity>
          ) : (
            looks.slice(0, 2).map((look) => (
              <LookCard
                key={look.id}
                look={look}
                onGuardar={toggleGuardarLook}
              />
            ))
          )}
        </View>

        {/* Mapa mini — 3 lugares */}
        <View style={styles.seccion}>
          <View style={styles.seccionCabecera}>
            <Text style={styles.seccionTitulo}>Tu {perfil.ciudad} esta semana</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MisMapas')}>
              <Text style={styles.verTodo}>Ver mapa →</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.mapaPlaceholder}
            onPress={() => navigation.navigate('MisMapas')}
            activeOpacity={0.85}
          >
            <Text style={styles.mapaIcono}>🗺</Text>
            <View style={styles.mapaTexto}>
              <Text style={styles.mapaTitulo}>Tiendas · Restaurantes · Cultura</Text>
              <Text style={styles.mapaDesc}>Seleccionados para tu estilo y momento vital en {perfil.ciudad}</Text>
            </View>
            <Text style={styles.mapaFlecha}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Progreso gamificación */}
        <View style={styles.seccion}>
          <View style={styles.seccionCabecera}>
            <Text style={styles.seccionTitulo}>Tu transformación</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MiTransformacion')}>
              <Text style={styles.verTodo}>Ver logros →</Text>
            </TouchableOpacity>
          </View>
          {proximoLogro && (
            <BarraPuntos
              puntosActuales={perfil.puntosSandra}
              puntasSiguienteLogro={proximoLogro.puntosRecompensa}
              nombreSiguienteLogro={proximoLogro.titulo}
            />
          )}
          <View style={styles.logrosResumen}>
            <Text style={styles.logrosResumenTexto}>
              {logrosCompletados} de {logros.length} logros desbloqueados
            </Text>
          </View>
        </View>

        {/* Botón flotante de llamada a acción */}
        {perfil.plan === 'basico' && (
          <TouchableOpacity style={styles.upgradeBanner} activeOpacity={0.9}>
            <LinearGradient colors={[Colors.camel, Colors.doradoarena]} style={styles.upgradeGradient}>
              <Text style={styles.upgradeTitulo}>★ Activa Premium</Text>
              <Text style={styles.upgradeDesc}>Looks ilimitados · Chat con Sandra · Probador AR · Comunidad</Text>
              <Text style={styles.upgradePrecio}>97€/mes</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <View style={{ height: Spacing['3xl'] }} />
      </ScrollView>

      {/* Botón de voz IA flotante */}
      <TouchableOpacity
        style={styles.botonVoz}
        onPress={() => navigation.navigate('MiImagen')}
        activeOpacity={0.85}
      >
        <Text style={styles.botonVozIcono}>🎙</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.cremacalida },
  cargando: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.cremacalida },
  cargandoTexto: { fontFamily: FontFamily.displayItalic, fontSize: FontSize.h3, color: Colors.camel },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, paddingBottom: Spacing.xl },
  headerFila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  saludo: { fontFamily: FontFamily.displaySemiBold, fontSize: FontSize.h2, color: Colors.cremacalida },
  saludoFecha: { fontFamily: FontFamily.displayItalic, fontSize: FontSize.bodyMd, color: Colors.doradoarena, marginTop: 4 },
  puntosChip: {
    backgroundColor: Colors.camel, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, alignItems: 'center',
  },
  puntosNum: { fontFamily: FontFamily.sansBold, fontSize: FontSize.h4, color: Colors.cremacalida },
  puntosLabel: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.micro, color: Colors.cremacalida },
  scroll: { paddingTop: Spacing.xl },
  seccion: { paddingHorizontal: Spacing.xl, marginBottom: Spacing['2xl'] },
  seccionCabecera: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  seccionTitulo: { fontFamily: FontFamily.displaySemiBold, fontSize: FontSize.h4, color: Colors.negrocacao },
  verTodo: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiSm, color: Colors.camel },
  generarLooksCard: {
    backgroundColor: Colors.lino, borderRadius: BorderRadius['2xl'],
    padding: Spacing['2xl'], alignItems: 'center', borderWidth: 1.5,
    borderColor: Colors.doradoarena, borderStyle: 'dashed',
  },
  generarLooksIcono: { fontSize: 36, marginBottom: Spacing.md },
  generarLooksTitulo: { fontFamily: FontFamily.displaySemiBold, fontSize: FontSize.h4, color: Colors.negrocacao, marginBottom: Spacing.sm },
  generarLooksDesc: {
    fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodySm,
    color: Colors.piedra, textAlign: 'center', lineHeight: FontSize.bodySm * 1.6,
  },
  mapaPlaceholder: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.negrocacao, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, gap: Spacing.md,
  },
  mapaIcono: { fontSize: 28 },
  mapaTexto: { flex: 1 },
  mapaTitulo: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.bodyMd, color: Colors.cremacalida, marginBottom: 2 },
  mapaDesc: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodySm, color: Colors.doradoarena },
  mapaFlecha: { fontFamily: FontFamily.sansRegular, fontSize: 20, color: Colors.camel },
  logrosResumen: { marginTop: Spacing.sm },
  logrosResumenTexto: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.piedra, textAlign: 'right' },
  upgradeBanner: { marginHorizontal: Spacing.xl, marginBottom: Spacing.xl, borderRadius: BorderRadius['2xl'], overflow: 'hidden' },
  upgradeGradient: { padding: Spacing.xl },
  upgradeTitulo: { fontFamily: FontFamily.displayBold, fontSize: FontSize.h3, color: Colors.negrocacao, marginBottom: Spacing.xs },
  upgradeDesc: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodySm, color: Colors.negrocacao, lineHeight: FontSize.bodySm * 1.5, marginBottom: Spacing.md },
  upgradePrecio: { fontFamily: FontFamily.sansBold, fontSize: FontSize.h4, color: Colors.negrocacao },
  botonVoz: {
    position: 'absolute', bottom: Spacing['3xl'], right: Spacing.xl,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.negrocacao, alignItems: 'center', justifyContent: 'center',
    ...Shadow.xl,
    borderWidth: 2, borderColor: Colors.doradoarena,
  },
  botonVozIcono: { fontSize: 24 },
});
