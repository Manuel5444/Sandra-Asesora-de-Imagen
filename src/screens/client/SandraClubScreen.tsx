import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { BorderRadius, Shadow, Spacing } from '../../constants/theme';
import { useClientaStore } from '../../store/clientaStore';
import { MOMENTOS_VITALES } from '../../types';

const POSTS_DEMO = [
  {
    id: '1',
    autor: 'Sandra Manresa',
    esSandra: true,
    avatar: '✦',
    tiempo: 'Hace 2 horas',
    contenido: 'El secreto de un armario cápsula no está en las prendas que compras, sino en las que decides no comprar. Esta semana: revisa tu armario y deja salir todo lo que no has puesto en 6 meses.',
    likes: 47,
    respuestas: 12,
    categoria: 'Consejo semanal',
  },
  {
    id: '2',
    autor: 'María L.',
    esSandra: false,
    avatar: 'M',
    tiempo: 'Hace 5 horas',
    contenido: 'Primera semana con el plan de transformación y ya me he deshecho de 40 prendas. La sensación de ligereza es increíble. Gracias Sandra ❤️',
    likes: 23,
    respuestas: 5,
    categoria: 'Transformación',
    momento: 'nido_vacio' as const,
  },
  {
    id: '3',
    autor: 'Carmen R.',
    esSandra: false,
    avatar: 'C',
    tiempo: 'Hace 1 día',
    contenido: '¿Alguien ha probado los pantalones de Massimo Dutti de esta temporada? Sandra los recomendó y quiero saber si la talla es grande o pequeña antes de pedir online.',
    likes: 8,
    respuestas: 14,
    categoria: 'Shopping',
    momento: 'cambio_laboral' as const,
  },
];

const GRUPOS_VITALES = [
  { momento: 'cambio_laboral', miembros: 18 },
  { momento: 'menopausia', miembros: 24 },
  { momento: 'nido_vacio', miembros: 15 },
  { momento: 'separacion', miembros: 12 },
  { momento: 'nueva_decada_50', miembros: 31 },
] as const;

export function SandraClubScreen() {
  const { perfil } = useClientaStore();
  const [tabActiva, setTabActiva] = useState<'feed' | 'grupos' | 'retos'>('feed');

  const esPremium = perfil?.plan !== 'basico';

  if (!esPremium) {
    return (
      <SafeAreaView style={styles.contenedor} edges={['top']}>
        <View style={styles.upgrade}>
          <LinearGradient colors={[Colors.negrocacao, '#2A2018']} style={styles.upgradeCard}>
            <Text style={styles.upgradeIcono}>◈</Text>
            <Text style={styles.upgradeTitulo}>Sandra Club</Text>
            <Text style={styles.upgradeDesc}>
              La comunidad privada exclusiva para clientas Premium. Grupos por momento vital,
              antes/después, preguntas a Sandra en directo y retos mensuales.
            </Text>
            <TouchableOpacity style={styles.upgradeBoton} activeOpacity={0.85}>
              <Text style={styles.upgradeBotonTexto}>Activar Premium · 97€/mes</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.titulo}>◈ Sandra Club</Text>
        <Text style={styles.subtitulo}>Comunidad privada · Solo Premium</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['feed', 'grupos', 'retos'] as const).map((tab) => {
          const labels = { feed: 'Feed', grupos: 'Grupos', retos: 'Retos' };
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

        {/* ── FEED ──────────────────────────────────────────── */}
        {tabActiva === 'feed' && (
          <>
            {POSTS_DEMO.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </>
        )}

        {/* ── GRUPOS ────────────────────────────────────────── */}
        {tabActiva === 'grupos' && (
          <>
            <Text style={styles.gruposDesc}>
              Cada mujer pertenece al grupo de su momento vital actual. Comparte con quienes viven lo mismo que tú.
            </Text>
            {GRUPOS_VITALES.map(({ momento, miembros }) => {
              const datos = MOMENTOS_VITALES[momento];
              const esElMio = perfil?.momentoVital === momento;
              return (
                <TouchableOpacity
                  key={momento}
                  style={[styles.grupoCard, esElMio && styles.grupoCardMio]}
                  activeOpacity={0.85}
                >
                  <Text style={styles.grupoEmoji}>{datos.emoji}</Text>
                  <View style={styles.grupoTexto}>
                    <View style={styles.grupoFila}>
                      <Text style={styles.grupoLabel}>{datos.label}</Text>
                      {esElMio && <Text style={styles.grupoMio}>Tu grupo</Text>}
                    </View>
                    <Text style={styles.grupoMiembros}>{miembros} mujeres en este grupo</Text>
                  </View>
                  <Text style={styles.grupoFlecha}>→</Text>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* ── RETOS ─────────────────────────────────────────── */}
        {tabActiva === 'retos' && (
          <>
            <View style={styles.retoCard}>
              <Text style={styles.retoMes}>Abril 2026</Text>
              <Text style={styles.retoTitulo}>Reto del mes: el color tierra</Text>
              <Text style={styles.retoDesc}>
                Incorpora un tono tierra (camel, terracota, ocre) en un outfit esta semana.
                Sube tu foto con #ColorTierraAbril y comparte en el feed.
              </Text>
              <View style={styles.retoParticipantes}>
                <Text style={styles.retoParticipantesTexto}>34 participantes · 8 días restantes</Text>
              </View>
              <TouchableOpacity style={styles.retoBoton}>
                <Text style={styles.retoBotonTexto}>Participar en el reto →</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.retosAnterioresTitulo}>Retos anteriores</Text>
            {[
              { mes: 'Marzo', titulo: 'El accesorio que transforma', participantes: 41 },
              { mes: 'Febrero', titulo: 'Una prenda, tres looks', participantes: 28 },
            ].map((reto, i) => (
              <View key={i} style={styles.retoAnterior}>
                <Text style={styles.retoAnteriorMes}>{reto.mes}</Text>
                <Text style={styles.retoAnteriorTitulo}>{reto.titulo}</Text>
                <Text style={styles.retoAnteriorPart}>{reto.participantes} participantes</Text>
              </View>
            ))}
          </>
        )}

        <View style={{ height: Spacing['4xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function PostCard({ post }: { post: typeof POSTS_DEMO[0] }) {
  const [liked, setLiked] = React.useState(false);
  return (
    <View style={styles.postCard}>
      <View style={styles.postCabecera}>
        <View style={[styles.postAvatar, post.esSandra && styles.postAvatarSandra]}>
          <Text style={[styles.postAvatarTexto, post.esSandra && styles.postAvatarTextoSandra]}>
            {post.avatar}
          </Text>
        </View>
        <View style={styles.postInfo}>
          <Text style={styles.postAutor}>{post.autor}</Text>
          <Text style={styles.postTiempo}>{post.tiempo}</Text>
        </View>
        <Text style={styles.postCategoria}>{post.categoria}</Text>
      </View>
      <Text style={styles.postContenido}>{post.contenido}</Text>
      <View style={styles.postAcciones}>
        <TouchableOpacity onPress={() => setLiked(!liked)} style={styles.postAccion}>
          <Text style={[styles.postAccionIcono, liked && { color: Colors.camel }]}>♥</Text>
          <Text style={styles.postAccionTexto}>{post.likes + (liked ? 1 : 0)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postAccion}>
          <Text style={styles.postAccionIcono}>💬</Text>
          <Text style={styles.postAccionTexto}>{post.respuestas}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.cremacalida },
  upgrade: { flex: 1, padding: Spacing.xl, justifyContent: 'center' },
  upgradeCard: { borderRadius: BorderRadius['2xl'], padding: Spacing['3xl'], alignItems: 'center' },
  upgradeIcono: { fontFamily: FontFamily.displayBold, fontSize: 40, color: Colors.doradoarena, marginBottom: Spacing.md },
  upgradeTitulo: { fontFamily: FontFamily.displayBold, fontSize: FontSize.h2, color: Colors.cremacalida, marginBottom: Spacing.md },
  upgradeDesc: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd, color: Colors.doradoarena, textAlign: 'center', lineHeight: FontSize.bodyMd * 1.6, marginBottom: Spacing['2xl'] },
  upgradeBoton: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing['3xl'], paddingVertical: Spacing.md, backgroundColor: Colors.camel },
  upgradeBotonTexto: { fontFamily: FontFamily.sansSemiBold, fontSize: FontSize.uiLg, color: Colors.cremacalida },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.md },
  titulo: { fontFamily: FontFamily.displayBold, fontSize: FontSize.h1, color: Colors.negrocacao },
  subtitulo: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodySm, color: Colors.camel, marginTop: 4 },
  tabs: { flexDirection: 'row', paddingHorizontal: Spacing.xl, borderBottomWidth: 1, borderBottomColor: Colors.lino },
  tab: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.sm, marginRight: Spacing.md, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActiva: { borderBottomColor: Colors.camel },
  tabTexto: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiMd, color: Colors.piedra },
  tabTextoActivo: { color: Colors.camel },
  scroll: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  postCard: { backgroundColor: Colors.lino, borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, ...Shadow.sm },
  postCabecera: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md, gap: Spacing.sm },
  postAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.lino, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.doradoarena },
  postAvatarSandra: { backgroundColor: Colors.negrocacao },
  postAvatarTexto: { fontFamily: FontFamily.sansBold, fontSize: FontSize.uiSm, color: Colors.camel },
  postAvatarTextoSandra: { color: Colors.doradoarena },
  postInfo: { flex: 1 },
  postAutor: { fontFamily: FontFamily.sansSemiBold, fontSize: FontSize.uiMd, color: Colors.negrocacao },
  postTiempo: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.micro, color: Colors.piedra },
  postCategoria: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.micro, color: Colors.camel, backgroundColor: Colors.cremacalida, paddingHorizontal: Spacing.xs, paddingVertical: 2, borderRadius: BorderRadius.full },
  postContenido: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd, color: Colors.negrocacao, lineHeight: FontSize.bodyMd * 1.6, marginBottom: Spacing.md },
  postAcciones: { flexDirection: 'row', gap: Spacing.xl },
  postAccion: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  postAccionIcono: { fontSize: 16, color: Colors.piedra },
  postAccionTexto: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.piedra },
  gruposDesc: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd, color: Colors.piedra, lineHeight: FontSize.bodyMd * 1.6, marginBottom: Spacing.lg },
  grupoCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.lino, borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.sm, borderWidth: 1.5, borderColor: 'transparent' },
  grupoCardMio: { borderColor: Colors.camel, backgroundColor: Colors.cremacalida },
  grupoEmoji: { fontSize: 28 },
  grupoTexto: { flex: 1 },
  grupoFila: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  grupoLabel: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.bodyMd, color: Colors.negrocacao },
  grupoMio: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.micro, color: Colors.camel, backgroundColor: Colors.lino, paddingHorizontal: Spacing.xs, paddingVertical: 2, borderRadius: BorderRadius.full },
  grupoMiembros: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.piedra, marginTop: 2 },
  grupoFlecha: { fontFamily: FontFamily.sansRegular, fontSize: 20, color: Colors.piedra },
  retoCard: { backgroundColor: Colors.negrocacao, borderRadius: BorderRadius['2xl'], padding: Spacing.xl, marginBottom: Spacing.xl },
  retoMes: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.doradoarena, letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.sm },
  retoTitulo: { fontFamily: FontFamily.displayBold, fontSize: FontSize.h3, color: Colors.cremacalida, marginBottom: Spacing.sm },
  retoDesc: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd, color: Colors.doradoarena, lineHeight: FontSize.bodyMd * 1.6, marginBottom: Spacing.lg },
  retoParticipantes: { marginBottom: Spacing.lg },
  retoParticipantesTexto: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiSm, color: Colors.cremacalida },
  retoBoton: { borderRadius: BorderRadius.full, paddingVertical: Spacing.md, borderWidth: 1.5, borderColor: Colors.doradoarena, alignItems: 'center' },
  retoBotonTexto: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiMd, color: Colors.cremacalida },
  retosAnterioresTitulo: { fontFamily: FontFamily.displaySemiBold, fontSize: FontSize.h4, color: Colors.negrocacao, marginBottom: Spacing.md },
  retoAnterior: { backgroundColor: Colors.lino, borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.sm },
  retoAnteriorMes: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.micro, color: Colors.piedra, marginBottom: 2 },
  retoAnteriorTitulo: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.bodyMd, color: Colors.negrocacao },
  retoAnteriorPart: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.camel, marginTop: 2 },
});
