import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { BorderRadius, Shadow, Spacing } from '../../constants/theme';
import { useAdminStore } from '../../store/adminStore';
import type { Postit, ColorPostit } from '../../types';

const COLORES_POSTIT: { clave: ColorPostit; label: string; fondo: string; texto: string }[] = [
  { clave: 'urgente', label: 'Urgente', fondo: Colors.postitUrgente, texto: '#8B4513' },
  { clave: 'ideas', label: 'Ideas', fondo: Colors.postitIdeas, texto: '#2D5A1B' },
  { clave: 'seguimiento', label: 'Seguimiento', fondo: Colors.postitSeguimiento, texto: '#1B3A5A' },
  { clave: 'personal', label: 'Personal', fondo: Colors.postitPersonal, texto: '#5A3A1B' },
];

export function PostItsScreen() {
  const { postits, cargarPostits, crearPostit, toggleCompletarPostit, eliminarPostit } = useAdminStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoContenido, setNuevoContenido] = useState('');
  const [nuevoColor, setNuevoColor] = useState<ColorPostit>('urgente');

  useEffect(() => {
    cargarPostits();
  }, []);

  const crearNuevo = async () => {
    if (!nuevoContenido.trim()) return;
    await crearPostit(nuevoContenido, nuevoColor);
    setNuevoContenido('');
    setNuevoColor('urgente');
    setModalVisible(false);
  };

  const postitsPorColor = (color: ColorPostit) =>
    postits.filter((p) => p.color === color && !p.completado);

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Post-its</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.nuevaBtn}>
          <Text style={styles.nuevaBtnTexto}>+ Nueva nota</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {COLORES_POSTIT.map(({ clave, label, fondo, texto }) => {
          const lista = postitsPorColor(clave);
          if (lista.length === 0) return null;
          return (
            <View key={clave} style={styles.columna}>
              <Text style={styles.columnaTitulo}>{label.toUpperCase()}</Text>
              <View style={styles.columnaNota}>
                {lista.map((postit) => (
                  <PostItCard
                    key={postit.id}
                    postit={postit}
                    fondo={fondo}
                    textoColor={texto}
                    onCompletar={() => toggleCompletarPostit(postit.id)}
                    onEliminar={() => eliminarPostit(postit.id)}
                  />
                ))}
              </View>
            </View>
          );
        })}

        {/* Completados */}
        {postits.filter((p) => p.completado).length > 0 && (
          <View style={styles.columna}>
            <Text style={styles.columnaTitulo}>COMPLETADOS</Text>
            <View style={styles.columnaNota}>
              {postits.filter((p) => p.completado).map((postit) => (
                <PostItCard
                  key={postit.id}
                  postit={postit}
                  fondo={Colors.lino}
                  textoColor={Colors.piedra}
                  completado
                  onCompletar={() => toggleCompletarPostit(postit.id)}
                  onEliminar={() => eliminarPostit(postit.id)}
                />
              ))}
            </View>
          </View>
        )}

        {postits.length === 0 && (
          <View style={styles.vacio}>
            <Text style={styles.vacioIcono}>📌</Text>
            <Text style={styles.vacioTexto}>Sin notas activas. Crea una nueva nota para empezar.</Text>
          </View>
        )}

        <View style={{ height: Spacing['4xl'] }} />
      </ScrollView>

      {/* Modal nueva nota */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableOpacity style={styles.modalFondo} onPress={() => setModalVisible(false)} />
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>Nueva nota</Text>

            <TextInput
              value={nuevoContenido}
              onChangeText={setNuevoContenido}
              placeholder="Escribe tu nota aquí…"
              placeholderTextColor={Colors.piedra}
              multiline
              numberOfLines={4}
              style={styles.modalInput}
              autoFocus
            />

            <Text style={styles.modalColorLabel}>Color de la nota</Text>
            <View style={styles.coloresRow}>
              {COLORES_POSTIT.map(({ clave, label, fondo }) => (
                <TouchableOpacity
                  key={clave}
                  onPress={() => setNuevoColor(clave)}
                  style={[
                    styles.colorChip,
                    { backgroundColor: fondo },
                    nuevoColor === clave && styles.colorChipActivo,
                  ]}
                >
                  <Text style={styles.colorChipTexto}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalAcciones}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelarBtn}>
                <Text style={styles.cancelarBtnTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={crearNuevo} style={styles.crearBtn}>
                <Text style={styles.crearBtnTexto}>Crear nota</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function PostItCard({
  postit, fondo, textoColor, completado = false, onCompletar, onEliminar,
}: {
  postit: Postit; fondo: string; textoColor: string;
  completado?: boolean; onCompletar: () => void; onEliminar: () => void;
}) {
  return (
    <View style={[styles.postitCard, { backgroundColor: fondo }, completado && styles.postitCompletado]}>
      <Text style={[styles.postitTexto, { color: textoColor }, completado && styles.postitTextoCompletado]}>
        {postit.contenido}
      </Text>
      <View style={styles.postitAcciones}>
        <TouchableOpacity onPress={onCompletar} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.postitAccionTexto, { color: textoColor }]}>
            {completado ? '↩ Reabrir' : '✓ Hecho'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onEliminar} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.postitAccionTexto, { color: textoColor, opacity: 0.6 }]}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.cremacalida },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.md },
  titulo: { fontFamily: FontFamily.displayBold, fontSize: FontSize.h2, color: Colors.negrocacao },
  nuevaBtn: { backgroundColor: Colors.camel, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  nuevaBtnTexto: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiSm, color: Colors.cremacalida },
  scroll: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm },
  columna: { marginBottom: Spacing.xl },
  columnaTitulo: { fontFamily: FontFamily.sansSemiBold, fontSize: FontSize.uiXs, color: Colors.piedra, letterSpacing: 1.5, marginBottom: Spacing.sm },
  columnaNota: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  postitCard: { borderRadius: BorderRadius.xl, padding: Spacing.md, width: '47%', minHeight: 100, justifyContent: 'space-between', ...Shadow.sm },
  postitCompletado: { opacity: 0.55 },
  postitTexto: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodySm, lineHeight: FontSize.bodySm * 1.5 },
  postitTextoCompletado: { textDecorationLine: 'line-through' },
  postitAcciones: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm },
  postitAccionTexto: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.micro },
  vacio: { alignItems: 'center', paddingTop: Spacing['4xl'] },
  vacioIcono: { fontSize: 40, marginBottom: Spacing.md },
  vacioTexto: { fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd, color: Colors.piedra, textAlign: 'center' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalFondo: { flex: 1 },
  modalContenido: { backgroundColor: Colors.cremacalida, borderTopLeftRadius: BorderRadius['3xl'], borderTopRightRadius: BorderRadius['3xl'], padding: Spacing['2xl'] },
  modalTitulo: { fontFamily: FontFamily.displaySemiBold, fontSize: FontSize.h3, color: Colors.negrocacao, marginBottom: Spacing.lg },
  modalInput: { backgroundColor: Colors.lino, borderRadius: BorderRadius.xl, padding: Spacing.lg, fontFamily: FontFamily.sansRegular, fontSize: FontSize.bodyMd, color: Colors.negrocacao, minHeight: 100, textAlignVertical: 'top', marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.doradoarena },
  modalColorLabel: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiSm, color: Colors.negrocacao, marginBottom: Spacing.sm },
  coloresRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  colorChip: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderWidth: 2, borderColor: 'transparent' },
  colorChipActivo: { borderColor: Colors.negrocacao },
  colorChipTexto: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiSm, color: Colors.negrocacao },
  modalAcciones: { flexDirection: 'row', gap: Spacing.sm },
  cancelarBtn: { flex: 1, borderRadius: BorderRadius.full, padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.piedra },
  cancelarBtnTexto: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiMd, color: Colors.piedra },
  crearBtn: { flex: 1, borderRadius: BorderRadius.full, padding: Spacing.md, alignItems: 'center', backgroundColor: Colors.camel },
  crearBtnTexto: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.uiMd, color: Colors.cremacalida },
});
