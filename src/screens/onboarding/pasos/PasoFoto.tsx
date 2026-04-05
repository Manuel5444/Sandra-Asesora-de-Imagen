import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../../constants/colors';
import { FontFamily, FontSize } from '../../../constants/typography';
import { BorderRadius, Spacing } from '../../../constants/theme';
import { Button } from '../../../components/common/Button';
import type { DatosOnboarding } from '../OnboardingContainer';

interface PasoProps {
  datos: DatosOnboarding;
  actualizarDatos: (d: Partial<DatosOnboarding>) => void;
  onSiguiente: () => void;
  onAtras: () => void;
}

const CONSEJOS_FOTO = [
  { icono: '☀️', texto: 'Luz natural, preferiblemente cerca de una ventana' },
  { icono: '👗', texto: 'Con ropa de cuello redondo o V — sin estampados' },
  { icono: '💄', texto: 'Maquillaje natural o sin maquillaje — como estás habitualmente' },
  { icono: '📸', texto: 'Foto de cara completa, sin filtros ni gafas de sol' },
];

export function PasoFoto({ datos, actualizarDatos, onSiguiente, onAtras }: PasoProps) {
  const [cargando, setCargando] = useState(false);

  const seleccionarFoto = async (fuente: 'camara' | 'galeria') => {
    setCargando(true);
    try {
      let resultado: ImagePicker.ImagePickerResult;

      if (fuente === 'camara') {
        const permiso = await ImagePicker.requestCameraPermissionsAsync();
        if (!permiso.granted) {
          Alert.alert('Permiso necesario', 'Necesitamos acceso a tu cámara para tomar la foto.');
          return;
        }
        resultado = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.85,
        });
      } else {
        const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permiso.granted) {
          Alert.alert('Permiso necesario', 'Necesitamos acceso a tu galería de fotos.');
          return;
        }
        resultado = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.85,
        });
      }

      if (!resultado.canceled && resultado.assets[0]) {
        actualizarDatos({ fotoUri: resultado.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la foto. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.cabecera}>
        <TouchableOpacity onPress={onAtras}>
          <Text style={styles.atras}>←</Text>
        </TouchableOpacity>
        <Text style={styles.paso}>Paso 3 de 6</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.titulo}>Tu foto, la base de tu análisis</Text>
        <Text style={styles.descripcion}>
          La IA analiza tu foto para crear tu paleta de colores y recomendaciones 100% personalizadas.
        </Text>

        {/* Zona de foto */}
        <View style={styles.zonaFoto}>
          {datos.fotoUri ? (
            <View style={styles.fotoContenedor}>
              <Image source={{ uri: datos.fotoUri }} style={styles.foto} />
              <TouchableOpacity
                onPress={() => actualizarDatos({ fotoUri: null })}
                style={styles.borrarFoto}
              >
                <Text style={styles.borrarFotoTexto}>Cambiar foto</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.fotoPlaceholder}>
              <Text style={styles.fotoPlaceholderIcono}>📸</Text>
              <Text style={styles.fotoPlaceholderTexto}>Tu foto aquí</Text>
            </View>
          )}
        </View>

        {/* Botones */}
        {!datos.fotoUri && (
          <View style={styles.botones}>
            <Button
              titulo="Hacer foto ahora"
              onPress={() => seleccionarFoto('camara')}
              variante="dark"
              fullWidth
              cargando={cargando}
            />
            <View style={{ height: Spacing.sm }} />
            <Button
              titulo="Elegir de mi galería"
              onPress={() => seleccionarFoto('galeria')}
              variante="secondary"
              fullWidth
            />
          </View>
        )}

        {/* Consejos para la foto */}
        <View style={styles.consejosContenedor}>
          <Text style={styles.consejosTitle}>Cómo hacer la foto perfecta</Text>
          {CONSEJOS_FOTO.map((consejo, i) => (
            <View key={i} style={styles.consejo}>
              <Text style={styles.consejoIcono}>{consejo.icono}</Text>
              <Text style={styles.consejoTexto}>{consejo.texto}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: Spacing.xl }} />

        <Button
          titulo={datos.fotoUri ? 'Continuar con esta foto →' : 'Continuar sin foto por ahora →'}
          onPress={onSiguiente}
          fullWidth
          variante={datos.fotoUri ? 'primary' : 'ghost'}
        />

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.cremacalida },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  atras: { fontSize: 24, color: Colors.negrocacao },
  paso: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.uiSm, color: Colors.piedra },
  scroll: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },
  titulo: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h2,
    color: Colors.negrocacao,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  descripcion: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.bodyMd,
    color: Colors.piedra,
    lineHeight: FontSize.bodyMd * 1.6,
    marginBottom: Spacing.xl,
  },
  zonaFoto: { alignItems: 'center', marginBottom: Spacing.xl },
  fotoContenedor: { alignItems: 'center' },
  foto: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: Colors.doradoarena,
  },
  borrarFoto: { marginTop: Spacing.md },
  borrarFotoTexto: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.uiSm,
    color: Colors.camel,
    textDecorationLine: 'underline',
  },
  fotoPlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.lino,
    borderWidth: 2,
    borderColor: Colors.doradoarena,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fotoPlaceholderIcono: { fontSize: 40 },
  fotoPlaceholderTexto: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.uiSm,
    color: Colors.piedra,
    marginTop: Spacing.xs,
  },
  botones: { marginBottom: Spacing.xl },
  consejosContenedor: {
    backgroundColor: Colors.lino,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  consejosTitle: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: FontSize.uiMd,
    color: Colors.negrocacao,
    marginBottom: Spacing.md,
  },
  consejo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  consejoIcono: { fontSize: 16, width: 24 },
  consejoTexto: {
    flex: 1,
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.bodySm,
    color: Colors.negrocacao,
    lineHeight: FontSize.bodySm * 1.5,
  },
});
