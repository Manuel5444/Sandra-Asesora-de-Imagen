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

import React, { useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { AppNavigator } from './src/navigation/AppNavigator';

// Mantener la splash screen visible mientras se cargan los recursos
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsCargadas, setFontsCargadas] = React.useState(false);

  useEffect(() => {
    cargarRecursos();
  }, []);

  const cargarRecursos = async () => {
    try {
      await Font.loadAsync({
        // Cormorant Garamond — títulos y firma editorial
        'CormorantGaramond-Regular': require('./assets/fonts/CormorantGaramond-Regular.ttf'),
        'CormorantGaramond-Medium': require('./assets/fonts/CormorantGaramond-Medium.ttf'),
        'CormorantGaramond-SemiBold': require('./assets/fonts/CormorantGaramond-SemiBold.ttf'),
        'CormorantGaramond-Bold': require('./assets/fonts/CormorantGaramond-Bold.ttf'),
        'CormorantGaramond-Italic': require('./assets/fonts/CormorantGaramond-Italic.ttf'),
        'CormorantGaramond-BoldItalic': require('./assets/fonts/CormorantGaramond-BoldItalic.ttf'),

        // DM Sans — UI y cuerpo de texto
        'DMSans-Regular': require('./assets/fonts/DMSans-Regular.ttf'),
        'DMSans-Medium': require('./assets/fonts/DMSans-Medium.ttf'),
        'DMSans-SemiBold': require('./assets/fonts/DMSans-SemiBold.ttf'),
        'DMSans-Bold': require('./assets/fonts/DMSans-Bold.ttf'),
        'DMSans-Light': require('./assets/fonts/DMSans-Light.ttf'),
        'DMSans-Italic': require('./assets/fonts/DMSans-Italic.ttf'),
      });
    } catch (e) {
      // Las fuentes fallan en entorno sin assets — la app usa fuentes del sistema
      console.warn('Fuentes no cargadas, usando fuentes del sistema:', e);
    } finally {
      setFontsCargadas(true);
    }
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsCargadas) {
      await SplashScreen.hideAsync();
    }
  }, [fontsCargadas]);

  if (!fontsCargadas) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
