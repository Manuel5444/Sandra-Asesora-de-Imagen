import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/theme';
import { PasoBienvenida } from './pasos/PasoBienvenida';
import { PasoMomentoVital } from './pasos/PasoMomentoVital';
import { PasoFoto } from './pasos/PasoFoto';
import { PasoEstilo } from './pasos/PasoEstilo';
import { PasoCiudad } from './pasos/PasoCiudad';
import { PasoMetas } from './pasos/PasoMetas';
import type { MomentoVital, TipoEstilo, RangoPrecio } from '../../types';
import { perfilService } from '../../services/supabase';
import { useAuthStore } from '../../store/authStore';

const { width: ANCHO } = Dimensions.get('window');
const TOTAL_PASOS = 6;

export interface DatosOnboarding {
  nombre: string;
  apellidos: string;
  edad: string;
  ciudad: string;
  momentoVital: MomentoVital | null;
  tipoEstilo: TipoEstilo | null;
  rangoPrecio: RangoPrecio | null;
  fotoUri: string | null;
  metasPersonales: string[];
}

interface OnboardingContainerProps {
  onCompletado: () => void;
}

export function OnboardingContainer({ onCompletado }: OnboardingContainerProps) {
  const { user } = useAuthStore();
  const [pasoActual, setPasoActual] = useState(0);
  const [guardando, setGuardando] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [datos, setDatos] = useState<DatosOnboarding>({
    nombre: '',
    apellidos: '',
    edad: '',
    ciudad: 'Madrid',
    momentoVital: null,
    tipoEstilo: null,
    rangoPrecio: 'medio',
    fotoUri: null,
    metasPersonales: [],
  });

  const irASiguientePaso = () => {
    if (pasoActual < TOTAL_PASOS - 1) {
      const siguientePaso = pasoActual + 1;
      setPasoActual(siguientePaso);
      scrollRef.current?.scrollTo({ x: siguientePaso * ANCHO, animated: true });
    } else {
      completarOnboarding();
    }
  };

  const irAPasoAnterior = () => {
    if (pasoActual > 0) {
      const anteriorPaso = pasoActual - 1;
      setPasoActual(anteriorPaso);
      scrollRef.current?.scrollTo({ x: anteriorPaso * ANCHO, animated: true });
    }
  };

  const actualizarDatos = (nuevos: Partial<DatosOnboarding>) => {
    setDatos((prev) => ({ ...prev, ...nuevos }));
  };

  const completarOnboarding = async () => {
    if (!user) return;
    setGuardando(true);

    try {
      let fotoUrl: string | undefined;
      if (datos.fotoUri) {
        fotoUrl = await perfilService.subirFotoPerfil(user.id, datos.fotoUri);
      }

      await perfilService.crearPerfil({
        userId: user.id,
        nombre: datos.nombre,
        apellidos: datos.apellidos,
        edad: parseInt(datos.edad) || 40,
        ciudad: datos.ciudad,
        pais: 'España',
        momentoVital: datos.momentoVital ?? 'otro',
        tipoEstilo: datos.tipoEstilo ?? 'clasico_elegante',
        rangoPrecio: datos.rangoPrecio ?? 'medio',
        metasPersonales: datos.metasPersonales,
        fotoUrl,
        plan: 'basico',
        puntosSandra: 0,
        logros: [],
      });

      onCompletado();
    } catch (error) {
      console.error('Error completando onboarding:', error);
    } finally {
      setGuardando(false);
    }
  };

  const props = {
    datos,
    actualizarDatos,
    onSiguiente: irASiguientePaso,
    onAtras: irAPasoAnterior,
    guardando,
  };

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>
      {/* Indicador de progreso */}
      <View style={styles.indicadores}>
        {Array.from({ length: TOTAL_PASOS }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.indicador,
              i === pasoActual && styles.indicadorActivo,
              i < pasoActual && styles.indicadorCompletado,
            ]}
          />
        ))}
      </View>

      {/* Scroll horizontal de pasos */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
      >
        <View style={{ width: ANCHO }}>
          <PasoBienvenida {...props} />
        </View>
        <View style={{ width: ANCHO }}>
          <PasoMomentoVital {...props} />
        </View>
        <View style={{ width: ANCHO }}>
          <PasoFoto {...props} />
        </View>
        <View style={{ width: ANCHO }}>
          <PasoEstilo {...props} />
        </View>
        <View style={{ width: ANCHO }}>
          <PasoCiudad {...props} />
        </View>
        <View style={{ width: ANCHO }}>
          <PasoMetas {...props} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: Colors.cremacalida,
  },
  indicadores: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  indicador: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.lino,
  },
  indicadorActivo: {
    width: 24,
    backgroundColor: Colors.camel,
  },
  indicadorCompletado: {
    backgroundColor: Colors.doradoarena,
  },
  scroll: {
    flex: 1,
  },
});
