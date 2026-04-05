import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors } from '../../../constants/colors';
import { FontFamily, FontSize } from '../../../constants/typography';
import { BorderRadius, Spacing } from '../../../constants/theme';
import { Button } from '../../../components/common/Button';
import type { DatosOnboarding } from '../OnboardingContainer';
import type { TipoEstilo, RangoPrecio } from '../../../types';

interface PasoProps {
  datos: DatosOnboarding;
  actualizarDatos: (d: Partial<DatosOnboarding>) => void;
  onSiguiente: () => void;
  onAtras: () => void;
}

const ESTILOS: { clave: TipoEstilo; label: string; descripcion: string; ejemplo: string }[] = [
  { clave: 'clasico_elegante', label: 'Clásico · Elegante', descripcion: 'Prendas atemporales, colores neutros, cortes impecables', ejemplo: 'Beige · Navy · Camel · Blanco roto' },
  { clave: 'casual_sofisticado', label: 'Casual · Sofisticado', descripcion: 'Cómodo sin renunciar a la elegancia. Lo mejor de dos mundos', ejemplo: 'Vaqueros premium · blazer · sneakers blancos' },
  { clave: 'editorial_moderno', label: 'Editorial · Moderno', descripcion: 'Tendencias, proporciones interesantes, actitud fashion', ejemplo: 'Mezcla de texturas · colores vibrantes · piezas de diseño' },
  { clave: 'bohemio_natural', label: 'Bohemio · Natural', descripcion: 'Telas naturales, capas, influencia étnica y artística', ejemplo: 'Lino · estampados · complementos artesanales' },
  { clave: 'minimalista_limpio', label: 'Minimalista · Limpio', descripcion: 'Menos es más. Prendas perfectas en colores perfectos', ejemplo: 'Blanco · negro · gris · cortes perfectos' },
  { clave: 'romantico_femenino', label: 'Romántico · Femenino', descripcion: 'Flores, encajes, drapeados, feminidad sin límites', ejemplo: 'Rosa · malva · blusa con volantes · vestidos' },
];

const PRESUPUESTOS: { clave: RangoPrecio; label: string; rango: string }[] = [
  { clave: 'economico', label: 'Económico', rango: 'Zara · H&M · Primark · hasta 50€ prenda' },
  { clave: 'medio', label: 'Medio', rango: 'Mango · Massimo Dutti · 50–150€ prenda' },
  { clave: 'medio_alto', label: 'Medio-alto', rango: 'COS · Sandro · 150–400€ prenda' },
  { clave: 'premium', label: 'Premium', rango: 'Diseñadores · más de 400€ prenda' },
];

export function PasoEstilo({ datos, actualizarDatos, onSiguiente, onAtras }: PasoProps) {
  const puedeAvanzar = datos.tipoEstilo !== null && datos.rangoPrecio !== null;

  return (
    <View style={styles.contenedor}>
      <View style={styles.cabecera}>
        <TouchableOpacity onPress={onAtras}>
          <Text style={styles.atras}>←</Text>
        </TouchableOpacity>
        <Text style={styles.paso}>Paso 4 de 6</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.titulo}>¿Cómo describirías tu estilo ideal?</Text>
        <Text style={styles.descripcion}>
          Elige el que más se acerca a lo que te gustaría ser, no lo que eres ahora.
        </Text>

        <View style={styles.opciones}>
          {ESTILOS.map((estilo) => (
            <TouchableOpacity
              key={estilo.clave}
              onPress={() => actualizarDatos({ tipoEstilo: estilo.clave })}
              style={[
                styles.opcion,
                datos.tipoEstilo === estilo.clave && styles.opcionSeleccionada,
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.opcionTexto}>
                <Text style={[styles.opcionLabel, datos.tipoEstilo === estilo.clave && styles.opcionLabelActiva]}>
                  {estilo.label}
                </Text>
                <Text style={styles.opcionDesc} numberOfLines={1}>{estilo.descripcion}</Text>
                <Text style={styles.opcionEjemplo}>{estilo.ejemplo}</Text>
              </View>
              {datos.tipoEstilo === estilo.clave && (
                <Text style={styles.check}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.titulo, { marginTop: Spacing['2xl'] }]}>¿Cuál es tu presupuesto habitual por prenda?</Text>

        <View style={styles.opcionesPresupuesto}>
          {PRESUPUESTOS.map((p) => (
            <TouchableOpacity
              key={p.clave}
              onPress={() => actualizarDatos({ rangoPrecio: p.clave })}
              style={[
                styles.opcionPresupuesto,
                datos.rangoPrecio === p.clave && styles.opcionPresupuestoActiva,
              ]}
              activeOpacity={0.8}
            >
              <Text style={[styles.presupuestoLabel, datos.rangoPrecio === p.clave && styles.presupuestoLabelActiva]}>
                {p.label}
              </Text>
              <Text style={styles.presupuestoRango}>{p.rango}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: Spacing.xl }} />
        <Button
          titulo="Continuar →"
          onPress={onSiguiente}
          deshabilitado={!puedeAvanzar}
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
    lineHeight: FontSize.h2 * 1.3,
  },
  descripcion: {
    fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd,
    color: Colors.piedra, lineHeight: FontSize.bodyMd * 1.6, marginBottom: Spacing.lg,
  },
  opciones: { gap: Spacing.sm },
  opcion: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.lino, borderRadius: BorderRadius.xl,
    padding: Spacing.md, borderWidth: 1.5, borderColor: 'transparent',
  },
  opcionSeleccionada: { borderColor: Colors.camel, backgroundColor: Colors.cremacalida },
  opcionTexto: { flex: 1 },
  opcionLabel: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.bodyMd, color: Colors.negrocacao, marginBottom: 2 },
  opcionLabelActiva: { color: Colors.camel },
  opcionDesc: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodySm, color: Colors.piedra, marginBottom: 2 },
  opcionEjemplo: { fontFamily: FontFamily.sansItalic || FontFamily.sansRegular, fontSize: FontSize.micro, color: Colors.doradoarena },
  check: { color: Colors.camel, fontSize: 18, fontFamily: FontFamily.sansBold },
  opcionesPresupuesto: { gap: Spacing.xs, marginTop: Spacing.md },
  opcionPresupuesto: {
    backgroundColor: Colors.lino, borderRadius: BorderRadius.lg,
    padding: Spacing.md, borderWidth: 1.5, borderColor: 'transparent',
  },
  opcionPresupuestoActiva: { borderColor: Colors.camel, backgroundColor: Colors.cremacalida },
  presupuestoLabel: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.bodyMd, color: Colors.negrocacao, marginBottom: 2 },
  presupuestoLabelActiva: { color: Colors.camel },
  presupuestoRango: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodySm, color: Colors.piedra },
});
