import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/typography';
import { useAuthStore } from '../store/authStore';
import { useClientaStore } from '../store/clientaStore';
import { ClientNavigator } from './ClientNavigator';
import { AdminNavigator } from './AdminNavigator';
import { OnboardingContainer } from '../screens/onboarding/OnboardingContainer';
import type { RootStackParamList } from '../types';

// Pantalla de autenticación
import { AuthScreen } from '../screens/auth/AuthScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { session, role, loading, inicializar } = useAuthStore();
  const { perfil, cargarPerfil } = useClientaStore();

  useEffect(() => {
    inicializar();
  }, []);

  useEffect(() => {
    if (session?.user && role === 'clienta') {
      cargarPerfil(session.user.id);
    }
  }, [session, role]);

  if (loading) {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashMarca}>S A N D R A</Text>
        <ActivityIndicator color={Colors.doradoarena} size="small" style={{ marginTop: 24 }} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!session ? (
          // No autenticada
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : role === 'sandra' ? (
          // Sandra — Panel de administración
          <Stack.Screen name="AdminDrawer" component={AdminNavigator} />
        ) : perfil ? (
          // Clienta con perfil — Portal principal
          <Stack.Screen name="ClienteTabs" component={ClientNavigator} />
        ) : (
          // Clienta nueva — Onboarding
          <Stack.Screen name="Onboarding">
            {() => (
              <OnboardingContainer
                onCompletado={() => {
                  if (session?.user) cargarPerfil(session.user.id);
                }}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: Colors.negrocacao,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashMarca: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize.display2xl,
    color: Colors.cremacalida,
    letterSpacing: 12,
  },
});
