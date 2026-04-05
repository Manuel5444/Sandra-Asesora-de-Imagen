import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { BorderRadius, Spacing } from '../../constants/theme';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuthStore } from '../../store/authStore';

export function AuthScreen() {
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { iniciarSesion, registrarse, loading, error, limpiarError } = useAuthStore();

  const handleSubmit = async () => {
    limpiarError();
    try {
      if (modo === 'login') {
        await iniciarSesion(email, password);
      } else {
        await registrarse(email, password);
      }
    } catch {
      // El error ya se guarda en el store
    }
  };

  const puedeEnviar = email.trim().includes('@') && password.length >= 6;

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
        {/* Hero */}
        <LinearGradient colors={[Colors.negrocacao, '#1E1810']} style={styles.hero}>
          <Text style={styles.marca}>S A N D R A</Text>
          <Text style={styles.tagline}>Tu imagen te acompaña{'\n'}en cada cambio de vida.</Text>
          <View style={styles.lineaDorada} />
        </LinearGradient>

        {/* Formulario */}
        <View style={styles.formulario}>
          <Text style={styles.titulo}>
            {modo === 'login' ? 'Bienvenida de vuelta' : 'Crear cuenta'}
          </Text>
          <Text style={styles.desc}>
            {modo === 'login'
              ? 'Accede a tu espacio personal con Sandra.'
              : 'Empieza tu transformación de imagen.'}
          </Text>

          {error && (
            <View style={styles.errorCard}>
              <Text style={styles.errorTexto}>{error}</Text>
            </View>
          )}

          <Input
            valor={email}
            alCambiar={setEmail}
            placeholder="tu@email.com"
            etiqueta="Email"
            teclado="email-address"
            autoCapitalize="none"
            estiloContenedor={{ marginBottom: Spacing.md }}
          />
          <Input
            valor={password}
            alCambiar={setPassword}
            placeholder="Contraseña"
            etiqueta="Contraseña"
            esPassword
            estiloContenedor={{ marginBottom: Spacing['2xl'] }}
          />

          <Button
            titulo={modo === 'login' ? 'Entrar' : 'Crear mi cuenta'}
            onPress={handleSubmit}
            deshabilitado={!puedeEnviar}
            cargando={loading}
            fullWidth
            variante="dark"
          />

          <View style={styles.cambioModo}>
            <Text style={styles.cambioModoTexto}>
              {modo === 'login' ? '¿Sin cuenta aún?' : '¿Ya tienes cuenta?'}
            </Text>
            <TouchableOpacity onPress={() => { setModo(modo === 'login' ? 'registro' : 'login'); limpiarError(); }}>
              <Text style={styles.cambioModoBoton}>
                {modo === 'login' ? ' Regístrate' : ' Inicia sesión'}
              </Text>
            </TouchableOpacity>
          </View>

          {modo === 'login' && (
            <TouchableOpacity style={styles.olvidado}>
              <Text style={styles.olvidadoTexto}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Pie */}
        <Text style={styles.pie}>
          Tus datos están protegidos por el RGPD europeo.{'\n'}
          Servidores en la Unión Europea.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.cremacalida },
  scroll: { flexGrow: 1 },
  hero: { paddingTop: Spacing['5xl'], paddingBottom: Spacing['4xl'], paddingHorizontal: Spacing['2xl'], alignItems: 'center' },
  marca: { fontFamily: FontFamily.displayBold, fontSize: FontSize.display2xl, color: Colors.cremacalida, letterSpacing: 12, marginBottom: Spacing.xl },
  tagline: { fontFamily: FontFamily.displayItalic, fontSize: FontSize.h3, color: Colors.doradoarena, textAlign: 'center', lineHeight: FontSize.h3 * 1.6 },
  lineaDorada: { width: 60, height: 2, backgroundColor: Colors.doradoarena, marginTop: Spacing.xl },
  formulario: { padding: Spacing.xl, flex: 1 },
  titulo: { fontFamily: FontFamily.displaySemiBold, fontSize: FontSize.h2, color: Colors.negrocacao, marginBottom: Spacing.xs },
  desc: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd, color: Colors.piedra, marginBottom: Spacing.xl, lineHeight: FontSize.bodyMd * 1.6 },
  errorCard: { backgroundColor: '#FDECEA', borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderLeftWidth: 3, borderLeftColor: Colors.error },
  errorTexto: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodySm, color: Colors.error },
  cambioModo: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
  cambioModoTexto: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiMd, color: Colors.piedra },
  cambioModoBoton: { fontFamily: FontFamily.sansSemiBold, fontSize: FontSize.uiMd, color: Colors.camel },
  olvidado: { alignItems: 'center', marginTop: Spacing.md },
  olvidadoTexto: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.piedra, textDecorationLine: 'underline' },
  pie: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.micro, color: Colors.piedra, textAlign: 'center', padding: Spacing.xl, lineHeight: FontSize.micro * 1.8 },
});
