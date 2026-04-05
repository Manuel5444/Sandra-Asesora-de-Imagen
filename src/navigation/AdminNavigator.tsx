import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/theme';
import { DashboardScreen } from '../screens/admin/DashboardScreen';
import { CRMScreen, CRMDetalleScreen } from '../screens/admin/CRMScreen';
import { KanbanScreen } from '../screens/admin/KanbanScreen';
import { PostItsScreen } from '../screens/admin/PostItsScreen';
import { MetricasScreen } from '../screens/admin/MetricasScreen';
import { useAuthStore } from '../store/authStore';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AdminDrawerParamList } from '../types';

const Drawer = createDrawerNavigator<AdminDrawerParamList>();

const SECCIONES = [
  { name: 'Dashboard' as const, label: 'Dashboard', icono: '◉', descripcion: 'Resumen del negocio' },
  { name: 'CRM' as const, label: 'CRM · Clientas', icono: '◎', descripcion: 'Fichas y gestión' },
  { name: 'Agenda' as const, label: 'Agenda', icono: '◷', descripcion: 'Sesiones y reservas' },
  { name: 'Pipeline' as const, label: 'Pipeline Kanban', icono: '⊞', descripcion: '7 etapas de venta' },
  { name: 'PostIts' as const, label: 'Post-its', icono: '◈', descripcion: 'Notas y tareas' },
  { name: 'Metricas' as const, label: 'Métricas', icono: '◑', descripcion: 'Ingresos y KPIs' },
];

function DrawerContenido(props: any) {
  const insets = useSafeAreaInsets();
  const { cerrarSesion } = useAuthStore();

  return (
    <LinearGradient colors={[Colors.negrocacao, '#1A1208']} style={[styles.drawer, { paddingTop: insets.top }]}>
      {/* Marca */}
      <View style={styles.drawerMarca}>
        <Text style={styles.drawerMarcaNombre}>S A N D R A</Text>
        <Text style={styles.drawerMarcaRol}>Panel de administración</Text>
        <View style={styles.drawerSeparador} />
      </View>

      {/* Menú */}
      <View style={styles.drawerMenu}>
        {SECCIONES.map(({ name, label, icono, descripcion }) => {
          const activo = props.state?.routes[props.state.index]?.name === name;
          return (
            <TouchableOpacity
              key={name}
              onPress={() => props.navigation.navigate(name)}
              style={[styles.drawerItem, activo && styles.drawerItemActivo]}
              activeOpacity={0.8}
            >
              <Text style={[styles.drawerItemIcono, activo && styles.drawerItemIconoActivo]}>
                {icono}
              </Text>
              <View style={styles.drawerItemTexto}>
                <Text style={[styles.drawerItemLabel, activo && styles.drawerItemLabelActivo]}>
                  {label}
                </Text>
                <Text style={styles.drawerItemDesc}>{descripcion}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer */}
      <View style={[styles.drawerFooter, { paddingBottom: insets.bottom + Spacing.md }]}>
        <View style={styles.drawerSeparador} />
        <TouchableOpacity onPress={cerrarSesion} style={styles.cerrarSesionBtn}>
          <Text style={styles.cerrarSesionTexto}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

// Stack para las pantallas que necesitan navegación anidada (CRM → Detalle)
const Stack = createNativeStackNavigator();

function CRMStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CRMLista" component={CRMScreen} />
      <Stack.Screen name="CRMDetalle" component={CRMDetalleScreen} />
    </Stack.Navigator>
  );
}

// Pantallas placeholder para las que aún están en desarrollo
function AgendaScreen() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderTexto}>◷ Agenda</Text>
      <Text style={styles.placeholderDesc}>Próximamente: calendario de sesiones con reservas automáticas, recordatorios y notas de sesión.</Text>
    </View>
  );
}

export function AdminNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContenido {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerStyle: { width: 280 },
        overlayColor: 'rgba(26, 20, 16, 0.6)',
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="CRM" component={CRMStack} />
      <Drawer.Screen name="Agenda" component={AgendaScreen} />
      <Drawer.Screen name="Pipeline" component={KanbanScreen} />
      <Drawer.Screen name="PostIts" component={PostItsScreen} />
      <Drawer.Screen name="Metricas" component={MetricasScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawer: { flex: 1 },
  drawerMarca: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.lg },
  drawerMarcaNombre: { fontFamily: FontFamily.displayBold, fontSize: FontSize.h2, color: Colors.cremacalida, letterSpacing: 8 },
  drawerMarcaRol: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.doradoarena, marginTop: 4 },
  drawerSeparador: { height: 1, backgroundColor: Colors.doradoarena, opacity: 0.2, marginTop: Spacing.md },
  drawerMenu: { flex: 1, paddingTop: Spacing.md, paddingHorizontal: Spacing.md },
  drawerItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: Spacing.xs },
  drawerItemActivo: { backgroundColor: 'rgba(212, 184, 150, 0.15)' },
  drawerItemIcono: { fontSize: 20, color: Colors.piedra, width: 28, textAlign: 'center' },
  drawerItemIconoActivo: { color: Colors.doradoarena },
  drawerItemTexto: { flex: 1 },
  drawerItemLabel: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiMd, color: Colors.piedra },
  drawerItemLabelActivo: { color: Colors.cremacalida },
  drawerItemDesc: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.micro, color: Colors.piedra, opacity: 0.6, marginTop: 1 },
  drawerFooter: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md },
  cerrarSesionBtn: { paddingVertical: Spacing.md },
  cerrarSesionTexto: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.piedra, opacity: 0.7 },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.cremacalida, padding: Spacing['3xl'] },
  placeholderTexto: { fontFamily: FontFamily.displayBold, fontSize: FontSize.h2, color: Colors.negrocacao, marginBottom: Spacing.md },
  placeholderDesc: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd, color: Colors.piedra, textAlign: 'center', lineHeight: FontSize.bodyMd * 1.6 },
});
