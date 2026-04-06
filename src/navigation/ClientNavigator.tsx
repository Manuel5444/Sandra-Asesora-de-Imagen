import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/typography';
import { BorderRadius, Spacing } from '../constants/theme';
import { HomeScreen } from '../screens/client/HomeScreen';
import { MiImagenScreen } from '../screens/client/MiImagenScreen';
import { MisMapasScreen } from '../screens/client/MisMapasScreen';
import { MiTransformacionScreen } from '../screens/client/MiTransformacionScreen';
import { SandraClubScreen } from '../screens/client/SandraClubScreen';
import type { ClienteTabsParamList } from '../types';

const Tab = createBottomTabNavigator<ClienteTabsParamList>();

const TABS = [
  { name: 'Inicio' as const, icono: '⌂', label: 'Inicio', component: HomeScreen },
  { name: 'MiImagen' as const, icono: '✦', label: 'Mi imagen', component: MiImagenScreen },
  { name: 'MisMapas' as const, icono: '◎', label: 'Mis mapas', component: MisMapasScreen },
  { name: 'MiTransformacion' as const, icono: '◈', label: 'Mi viaje', component: MiTransformacionScreen },
  { name: 'SandraClub' as const, icono: '♦', label: 'Club', component: SandraClubScreen },
];

export function ClientNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: Colors.negrocacao,
          borderTopWidth: 0,
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom + 4,
          paddingTop: Spacing.sm,
          borderTopLeftRadius: BorderRadius['2xl'],
          borderTopRightRadius: BorderRadius['2xl'],
        },
        tabBarActiveTintColor: Colors.doradoarena,
        tabBarInactiveTintColor: Colors.piedra,
        tabBarLabelStyle: {
          fontFamily: FontFamily.sansRegular,
          fontSize: 13,
          marginTop: 2,
        },
      }}
    >
      {TABS.map(({ name, icono, label, component }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarLabel: label,
            tabBarIcon: ({ color, focused }) => (
              <Text style={[
                styles.icono,
                { color },
                focused && styles.iconoActivo,
              ]}>
                {icono}
              </Text>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icono: {
    fontSize: 24,
    fontFamily: FontFamily.sansRegular,
  },
  iconoActivo: {
    color: Colors.doradoarena,
  },
});
