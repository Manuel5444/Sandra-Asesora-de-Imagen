import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { BorderRadius, Spacing } from '../../constants/theme';

interface InputProps {
  valor: string;
  alCambiar: (texto: string) => void;
  placeholder?: string;
  etiqueta?: string;
  error?: string;
  esPassword?: boolean;
  multilinea?: boolean;
  numeroLineas?: number;
  teclado?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  estiloContenedor?: ViewStyle;
  estiloInput?: TextStyle;
  prefijo?: React.ReactNode;
  sufijo?: React.ReactNode;
  deshabilitado?: boolean;
}

export function Input({
  valor,
  alCambiar,
  placeholder,
  etiqueta,
  error,
  esPassword = false,
  multilinea = false,
  numeroLineas = 1,
  teclado = 'default',
  autoCapitalize = 'sentences',
  estiloContenedor,
  estiloInput,
  prefijo,
  sufijo,
  deshabilitado = false,
}: InputProps) {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [enfocado, setEnfocado] = useState(false);

  return (
    <View style={[styles.contenedor, estiloContenedor]}>
      {etiqueta && <Text style={styles.etiqueta}>{etiqueta}</Text>}

      <View
        style={[
          styles.inputWrapper,
          enfocado && styles.inputWrapperEnfocado,
          error && styles.inputWrapperError,
          deshabilitado && styles.inputWrapperDeshabilitado,
        ]}
      >
        {prefijo && <View style={styles.prefijo}>{prefijo}</View>}

        <TextInput
          value={valor}
          onChangeText={alCambiar}
          placeholder={placeholder}
          placeholderTextColor={Colors.piedra}
          secureTextEntry={esPassword && !mostrarPassword}
          multiline={multilinea}
          numberOfLines={numeroLineas}
          keyboardType={teclado}
          autoCapitalize={autoCapitalize}
          editable={!deshabilitado}
          onFocus={() => setEnfocado(true)}
          onBlur={() => setEnfocado(false)}
          style={[
            styles.input,
            multilinea && styles.inputMultilinea,
            deshabilitado && styles.inputDeshabilitado,
            estiloInput,
          ]}
        />

        {esPassword && (
          <TouchableOpacity
            onPress={() => setMostrarPassword(!mostrarPassword)}
            style={styles.sufijo}
          >
            <Text style={styles.togglePassword}>
              {mostrarPassword ? 'Ocultar' : 'Ver'}
            </Text>
          </TouchableOpacity>
        )}

        {sufijo && !esPassword && <View style={styles.sufijo}>{sufijo}</View>}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
  },
  etiqueta: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.uiSm,
    color: Colors.negrocacao,
    marginBottom: Spacing.xs,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lino,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.lino,
    minHeight: 52,
    paddingHorizontal: Spacing.lg,
  },
  inputWrapperEnfocado: {
    borderColor: Colors.camel,
    backgroundColor: Colors.cremacalida,
  },
  inputWrapperError: {
    borderColor: Colors.error,
  },
  inputWrapperDeshabilitado: {
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.bodyMd,
    color: Colors.negrocacao,
    paddingVertical: Spacing.md,
  },
  inputMultilinea: {
    textAlignVertical: 'top',
    paddingTop: Spacing.md,
  },
  inputDeshabilitado: {
    color: Colors.piedra,
  },
  prefijo: {
    marginRight: Spacing.sm,
  },
  sufijo: {
    marginLeft: Spacing.sm,
  },
  togglePassword: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.uiSm,
    color: Colors.camel,
  },
  error: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.uiSm,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});
