import React, { useEffect } from 'react';
import { Platform, View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { AppNavigator } from './src/navigation/AppNavigator';

// GestureHandlerRootView solo en móvil (en web causa pantalla en blanco)
const GestureWrapper =
  Platform.OS === 'web'
    ? ({ children }: { children: React.ReactNode }) =>
        React.createElement(View, { style: { flex: 1 } }, children)
    : require('react-native-gesture-handler').GestureHandlerRootView;

// SplashScreen solo en móvil
let SplashScreen: { preventAutoHideAsync: () => void; hideAsync: () => Promise<void> } | null = null;
if (Platform.OS !== 'web') {
  SplashScreen = require('expo-splash-screen');
  SplashScreen!.preventAutoHideAsync();
}

// Error Boundary para atrapar crashes y mostrar el mensaje
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <ScrollView
          style={{ flex: 1, backgroundColor: '#1A1410' }}
          contentContainerStyle={{ padding: 24, paddingTop: 60 }}
        >
          <Text style={{ color: '#D4B896', fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
            Error al cargar la app
          </Text>
          <Text style={{ color: '#FAF8F5', fontSize: 13, fontFamily: 'monospace' }}>
            {this.state.error.message}
          </Text>
          <Text style={{ color: '#888780', fontSize: 11, marginTop: 12 }}>
            {this.state.error.stack?.slice(0, 600)}
          </Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
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
    <ErrorBoundary>
      <GestureWrapper style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </SafeAreaProvider>
      </GestureWrapper>
    </ErrorBoundary>
  );
}
