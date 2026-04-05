import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../../../constants/colors';
import { FontFamily, FontSize } from '../../../constants/typography';
import { BorderRadius, Shadow, Spacing } from '../../../constants/theme';
import { Button } from '../../../components/common/Button';
import type { DatosOnboarding } from '../OnboardingContainer';
import type { MomentoVital } from '../../../types';
import { MOMENTOS_VITALES } from '../../../types';

interface PasoProps {
  datos: DatosOnboarding;
  actualizarDatos: (d: Partial<DatosOnboarding>) => void;
  onSiguiente: () => void;
  onAtras: () => void;
}

// Textos de validación emocional por momento vital
const VALIDACION_EMOCIONAL: Record<MomentoVital, string> = {
  cambio_laboral: 'Exactamente en el momento en que tu imagen habla antes que tú. Vamos a hacer que esa primera impresión sea impecable.',
  menopausia: 'Tu cuerpo está cambiando, y tu estilo puede acompañar ese cambio de forma hermosa. Es un nuevo capítulo, no el fin de nada.',
  nido_vacio: 'Ahora que tienes espacio para ti misma, es el momento perfecto para redescubrirte. ¿Quién eres tú, más allá de ser madre?',
  separacion: 'Nuevo inicio significa nuevas reglas. Esta vez, tu estilo lo decides tú, para ti, sin negociar con nadie.',
  nueva_decada_40: 'Los 40 son el momento en que por fin sabes quién eres. Tu imagen puede reflejar esa seguridad que tanto has ganado.',
  nueva_decada_50: 'Los 50 son pura experiencia convertida en elegancia. Vamos a capitalizarlo todo.',
  nueva_decada_60: 'La autenticidad que dan los años es el lujo más difícil de conseguir. Tú ya lo tienes.',
  otro: 'No importa el momento, lo que importa es que estás aquí. Vamos a trabajar juntas desde donde estás hoy.',
};

export function PasoMomentoVital({ datos, actualizarDatos, onSiguiente, onAtras }: PasoProps) {
  const momentos = Object.entries(MOMENTOS_VITALES) as [MomentoVital, typeof MOMENTOS_VITALES[MomentoVital]][];

  return (
    <View style={styles.contenedor}>
      <View style={styles.cabecera}>
        <TouchableOpacity onPress={onAtras}>
          <Text style={styles.atras}>←</Text>
        </TouchableOpacity>
        <Text style={styles.paso}>Paso 2 de 6</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.titulo}>
          {datos.nombre ? `${datos.nombre},` : ''} ¿en qué momento de tu vida estás ahora?
        </Text>
        <Text style={styles.descripcion}>
          Tu respuesta personaliza todo el contenido de la app.
        </Text>

        <View style={styles.opciones}>
          {momentos.map(([clave, momento]) => (
            <TouchableOpacity
              key={clave}
              onPress={() => actualizarDatos({ momentoVital: clave })}
              style={[
                styles.opcion,
                datos.momentoVital === clave && styles.opcionSeleccionada,
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.opcionEmoji}>{momento.emoji}</Text>
              <View style={styles.opcionTexto}>
                <Text
                  style={[
                    styles.opcionLabel,
                    datos.momentoVital === clave && styles.opcionLabelSeleccionada,
                  ]}
                >
                  {momento.label}
                </Text>
                <Text
                  style={styles.opcionDescripcion}
                  numberOfLines={2}
                >
                  {momento.descripcion}
                </Text>
              </View>
              {datos.momentoVital === clave && (
                <Text style={styles.check}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Texto de validación emocional */}
        {datos.momentoVital && (
          <View style={styles.validacion}>
            <Text style={styles.validacionTexto}>
              {VALIDACION_EMOCIONAL[datos.momentoVital]}
            </Text>
          </View>
        )}

        <View style={{ height: Spacing['2xl'] }} />
        <Button
          titulo="Continuar →"
          onPress={onSiguiente}
          deshabilitado={!datos.momentoVital}
          fullWidth
          variante="dark"
        />
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: Colors.cremacalida,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  atras: {
    fontSize: 24,
    color: Colors.negrocacao,
  },
  paso: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.uiSm,
    color: Colors.piedra,
  },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  titulo: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h2,
    color: Colors.negrocacao,
    marginBottom: Spacing.sm,
    lineHeight: FontSize.h2 * 1.3,
  },
  descripcion: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.bodyMd,
    color: Colors.piedra,
    marginBottom: Spacing.xl,
  },
  opciones: {
    gap: Spacing.sm,
  },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lino,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  opcionSeleccionada: {
    borderColor: Colors.camel,
    backgroundColor: Colors.cremacalida,
  },
  opcionEmoji: {
    fontSize: 24,
    marginRight: Spacing.md,
    width: 32,
    textAlign: 'center',
  },
  opcionTexto: {
    flex: 1,
  },
  opcionLabel: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.bodyMd,
    color: Colors.negrocacao,
    marginBottom: 2,
  },
  opcionLabelSeleccionada: {
    color: Colors.camel,
  },
  opcionDescripcion: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.bodySm,
    color: Colors.piedra,
  },
  check: {
    color: Colors.camel,
    fontSize: 18,
    fontFamily: FontFamily.sansBold,
    marginLeft: Spacing.sm,
  },
  validacion: {
    backgroundColor: Colors.negrocacao,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
    borderLeftWidth: 3,
    borderLeftColor: Colors.doradoarena,
  },
  validacionTexto: {
    fontFamily: FontFamily.displayItalic,
    fontSize: FontSize.bodyMd,
    color: Colors.cremacalida,
    lineHeight: FontSize.bodyMd * 1.7,
  },
});
