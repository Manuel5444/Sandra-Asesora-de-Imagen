import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
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
}

const CIUDADES_RAPIDAS = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga', 'Lisboa', 'París'];

const TIPOS_VIDA = [
  { icono: '🏙', label: 'Urbana activa', desc: 'Mucho trabajo, ocio, restaurantes y cultura' },
  { icono: '🏡', label: 'Tranquila y doméstica', desc: 'Vida familiar, naturaleza, menos salidas' },
  { icono: '✈️', label: 'Viajera frecuente', desc: 'Muchos viajes de trabajo o placer' },
  { icono: '🎨', label: 'Social y creativa', desc: 'Eventos, arte, gastronomía, networking' },
];

export function PasoCiudad({ datos, actualizarDatos, onSiguiente, onAtras }: PasoProps) {
  const [tipoVida, setTipoVida] = React.useState('');

  return (
    <View style={styles.contenedor}>
      <View style={styles.cabecera}>
        <TouchableOpacity onPress={onAtras}><Text style={styles.atras}>←</Text></TouchableOpacity>
        <Text style={styles.paso}>Paso 5 de 6</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.titulo}>Tu ciudad y tu vida</Text>
        <Text style={styles.descripcion}>
          Calibra los mapas, las tiendas y el ocio que te recomendaré. Todo depende de dónde vives y cómo vives.
        </Text>

        <Text style={styles.etiqueta}>Tu ciudad</Text>
        <Input
          valor={datos.ciudad}
          alCambiar={(v) => actualizarDatos({ ciudad: v })}
          placeholder="Ciudad donde vives"
          autoCapitalize="words"
        />

        <View style={styles.ciudadesRapidas}>
          {CIUDADES_RAPIDAS.map((ciudad) => (
            <TouchableOpacity
              key={ciudad}
              onPress={() => actualizarDatos({ ciudad })}
              style={[
                styles.chipCiudad,
                datos.ciudad === ciudad && styles.chipCiudadActivo,
              ]}
            >
              <Text style={[styles.chipTexto, datos.ciudad === ciudad && styles.chipTextoActivo]}>
                {ciudad}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.etiqueta, { marginTop: Spacing.xl }]}>¿Cómo es tu vida?</Text>
        <Text style={styles.descripcionSub}>
          Así personalizo los lugares y ocasiones que te recomiendo.
        </Text>

        <View style={styles.opciones}>
          {TIPOS_VIDA.map((tipo) => (
            <TouchableOpacity
              key={tipo.label}
              onPress={() => setTipoVida(tipo.label)}
              style={[styles.opcion, tipoVida === tipo.label && styles.opcionActiva]}
              activeOpacity={0.8}
            >
              <Text style={styles.opcionIcono}>{tipo.icono}</Text>
              <View style={styles.opcionTexto}>
                <Text style={[styles.opcionLabel, tipoVida === tipo.label && styles.opcionLabelActiva]}>
                  {tipo.label}
                </Text>
                <Text style={styles.opcionDesc}>{tipo.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: Spacing.xl }} />
        <Button
          titulo="Continuar →"
          onPress={onSiguiente}
          deshabilitado={!datos.ciudad.trim()}
          fullWidth
          variante="dark"
        />
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.cremacalida },
  cabecera: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.md,
  },
  atras: { fontSize: 24, color: Colors.negrocacao },
  paso: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.piedra },
  scroll: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },
  titulo: {
    fontFamily: FontFamily.displaySemiBold, fontSize: FontSize.h2,
    color: Colors.negrocacao, marginTop: Spacing.md, marginBottom: Spacing.sm,
  },
  descripcion: {
    fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd,
    color: Colors.piedra, lineHeight: FontSize.bodyMd * 1.6, marginBottom: Spacing.lg,
  },
  descripcionSub: {
    fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodySm,
    color: Colors.piedra, marginBottom: Spacing.md,
  },
  etiqueta: {
    fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiSm,
    color: Colors.negrocacao, marginBottom: Spacing.xs, letterSpacing: 0.3,
  },
  ciudadesRapidas: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginTop: Spacing.md,
  },
  chipCiudad: {
    borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    backgroundColor: Colors.lino, borderWidth: 1, borderColor: 'transparent',
  },
  chipCiudadActivo: { borderColor: Colors.camel, backgroundColor: Colors.cremacalida },
  chipTexto: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.piedra },
  chipTextoActivo: { color: Colors.camel, fontFamily: FontFamily.sansMedium },
  opciones: { gap: Spacing.sm },
  opcion: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.lino, borderRadius: BorderRadius.xl,
    padding: Spacing.md, gap: Spacing.md,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  opcionActiva: { borderColor: Colors.camel, backgroundColor: Colors.cremacalida },
  opcionIcono: { fontSize: 22, width: 28, textAlign: 'center' },
  opcionTexto: { flex: 1 },
  opcionLabel: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.bodyMd, color: Colors.negrocacao, marginBottom: 2 },
  opcionLabelActiva: { color: Colors.camel },
  opcionDesc: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodySm, color: Colors.piedra },
});
