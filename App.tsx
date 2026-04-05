/**
 * Sandra · Tu Imagen, Tu Vida
 * Versión 3.0 · Edición Final y Definitiva
 *
 * Sandra Manresa · Asesora de Imagen · Madrid
 * "Tu imagen te acompaña en cada cambio de vida."
 *
 * Módulos:
 *   1. Portal de la Clienta — IA, mapas, AR, gamificación, comunidad
 *   2. Panel de Sandra — CRM, agenda, pipeline Kanban, métricas
 *
 * Stack: React Native · Expo SDK 51 · TypeScript · Supabase · Claude API
 */

import React, { useEffect } from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { AppNavigator } from './src/navigation/AppNavigator';

// SplashScreen solo en móvil — en web causa pantalla en blanco
let SplashScreen: { preventAutoHideAsync: () => void; hideAsync: () => Promise<void> } | null = null;
if (Platform.OS !== 'web') {
  SplashScreen = require('expo-splash-screen');
  SplashScreen!.preventAutoHideAsync();
}

export default function App() {
  const [listo, setListo] = React.useState(false);

  useEffect(() => {
    cargarRecursos();
  }, []);

  const cargarRecursos = async () => {
    try {
      await Font.loadAsync({
        'CormorantGaramond-Regular': require('./assets/fonts/CormorantGaramond-Regular.ttf'),
        'CormorantGaramond-Medium': require('./assets/fonts/CormorantGaramond-Medium.ttf'),
        'CormorantGaramond-SemiBold': require('./assets/fonts/CormorantGaramond-SemiBold.ttf'),
        'CormorantGaramond-Bold': require('./assets/fonts/CormorantGaramond-Bold.ttf'),
        'CormorantGaramond-Italic': require('./assets/fonts/CormorantGaramond-Italic.ttf'),
        'CormorantGaramond-BoldItalic': require('./assets/fonts/CormorantGaramond-BoldItalic.ttf'),
        'DMSans-Regular': require('./assets/fonts/DMSans-Regular.ttf'),
        'DMSans-Medium': require('./assets/fonts/DMSans-Medium.ttf'),
        'DMSans-SemiBold': require('./assets/fonts/DMSans-SemiBold.ttf'),
        'DMSans-Bold': require('./assets/fonts/DMSans-Bold.ttf'),
        'DMSans-Light': require('./assets/fonts/DMSans-Light.ttf'),
        'DMSans-Italic': require('./assets/fonts/DMSans-Italic.ttf'),
      });
    } catch (e) {
      console.warn('Fuentes no cargadas, usando fuentes del sistema:', e);
    } finally {
      setListo(true);
      if (SplashScreen) await SplashScreen.hideAsync();
    }
  };

  if (!listo) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1A1410', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#D4B896" size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
