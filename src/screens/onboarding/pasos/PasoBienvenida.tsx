import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../../constants/colors';
import { FontFamily, FontSize } from '../../../constants/typography';
import { BorderRadius, Spacing } from '../../../constants/theme';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import type { DatosOnboarding } from '../OnboardingContainer';

interface PasoProps {
  datos: DatosOnboarding;
  actualizarDatos: (d: Partial<DatosOnboarding>) => void;
  onSiguiente: () => void;
  onAtras: () => void;
  guardando?: boolean;
}

export function PasoBienvenida({ datos, actualizarDatos, onSiguiente }: PasoProps) {
  const puedeAvanzar = datos.nombre.trim().length > 1 && datos.edad.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero con gradiente */}
        <LinearGradient
          colors={[Colors.negrocacao, '#2A2018']}
          style={styles.hero}
        >
          <Text style={styles.marca}>S A N D R A</Text>
          <Text style={styles.tagline}>Tu imagen te acompaña{'\n'}en cada cambio de vida.</Text>
          <View style={styles.lineaDorada} />
        </LinearGradient>

        <View style={styles.formulario}>
          <Text style={styles.titulo}>Hola, soy Sandra.</Text>
          <Text style={styles.descripcion}>
            Vamos a conocernos. Cuéntame un poco sobre ti para personalizar toda tu experiencia.
          </Text>

          <Input
            valor={datos.nombre}
            alCambiar={(v) => actualizarDatos({ nombre: v })}
            placeholder="Tu nombre"
            etiqueta="Nombre"
            autoCapitalize="words"
          />

          <View style={{ height: Spacing.md }} />

          <Input
            valor={datos.apellidos}
            alCambiar={(v) => actualizarDatos({ apellidos: v })}
            placeholder="Tus apellidos"
            etiqueta="Apellidos"
            autoCapitalize="words"
          />

          <View style={{ height: Spacing.md }} />

          <Input
            valor={datos.edad}
            alCambiar={(v) => actualizarDatos({ edad: v })}
            placeholder="Tu edad"
            etiqueta="Edad"
            teclado="numeric"
          />

          <View style={{ height: Spacing['3xl'] }} />

          <Button
            titulo="Comenzar mi transformación →"
            onPress={onSiguiente}
            deshabilitado={!puedeAvanzar}
            fullWidth
            variante="dark"
          />

          <Text style={styles.privacidad}>
            Tus datos son 100% privados y están protegidos por el RGPD europeo.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: Colors.cremacalida,
  },
  scroll: {
    flexGrow: 1,
  },
  hero: {
    paddingTop: Spacing['4xl'],
    paddingBottom: Spacing['4xl'],
    paddingHorizontal: Spacing['2xl'],
    alignItems: 'center',
  },
  marca: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize.display2xl,
    color: Colors.cremacalida,
    letterSpacing: 12,
    marginBottom: Spacing.xl,
  },
  tagline: {
    fontFamily: FontFamily.displayItalic,
    fontSize: FontSize.h3,
    color: Colors.doradoarena,
    textAlign: 'center',
    lineHeight: FontSize.h3 * 1.6,
  },
  lineaDorada: {
    width: 60,
    height: 2,
    backgroundColor: Colors.doradoarena,
    marginTop: Spacing.xl,
  },
  formulario: {
    padding: Spacing.xl,
    flex: 1,
  },
  titulo: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h2,
    color: Colors.negrocacao,
    marginBottom: Spacing.sm,
  },
  descripcion: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.bodyMd,
    color: Colors.piedra,
    lineHeight: FontSize.bodyMd * 1.6,
    marginBottom: Spacing['2xl'],
  },
  privacidad: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.micro,
    color: Colors.piedra,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});
