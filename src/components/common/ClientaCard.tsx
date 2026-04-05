import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { BorderRadius, Shadow, Spacing } from '../../constants/theme';
import type { PerfilClienta } from '../../types';
import { MOMENTOS_VITALES } from '../../types';
import { BadgeMomentoVital, BadgePlan } from './Badge';

interface ClientaCardProps {
  clienta: PerfilClienta;
  onPress?: (clienta: PerfilClienta) => void;
  compacto?: boolean;
}

export function ClientaCard({ clienta, onPress, compacto = false }: ClientaCardProps) {
  const nombreCompleto = `${clienta.nombre} ${clienta.apellidos}`;
  const momento = MOMENTOS_VITALES[clienta.momentoVital];

  if (compacto) {
    return (
      <TouchableOpacity
        onPress={() => onPress?.(clienta)}
        style={styles.compacto}
        activeOpacity={0.85}
      >
        <AvatarClienta fotoUrl={clienta.fotoUrl} nombre={clienta.nombre} tamaño={44} />
        <View style={styles.compactoInfo}>
          <Text style={styles.compactoNombre} numberOfLines={1}>{nombreCompleto}</Text>
          <Text style={styles.compactoMomento} numberOfLines={1}>
            {momento.emoji} {momento.label}
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => onPress?.(clienta)}
      style={styles.contenedor}
      activeOpacity={0.88}
    >
      <View style={styles.cabecera}>
        <AvatarClienta fotoUrl={clienta.fotoUrl} nombre={clienta.nombre} tamaño={56} />
        <View style={styles.cabeceraInfo}>
          <Text style={styles.nombre} numberOfLines={1}>{nombreCompleto}</Text>
          <Text style={styles.ciudad}>{clienta.ciudad} · {clienta.edad} años</Text>
          <View style={styles.badges}>
            <BadgeMomentoVital momento={clienta.momentoVital} />
            <BadgePlan plan={clienta.plan} />
          </View>
        </View>
      </View>

      {clienta.colorimetria && (
        <View style={styles.colores}>
          {clienta.colorimetria.coloresIdeales.slice(0, 5).map((color, i) => (
            <View
              key={i}
              style={[styles.circuloColor, { backgroundColor: color.hex }]}
            />
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.puntos}>✦ {clienta.puntosSandra} pts</Text>
        <Text style={styles.alta}>Alta: {new Date(clienta.creadoEn).toLocaleDateString('es-ES')}</Text>
      </View>
    </TouchableOpacity>
  );
}

function AvatarClienta({
  fotoUrl,
  nombre,
  tamaño,
}: {
  fotoUrl?: string;
  nombre: string;
  tamaño: number;
}) {
  if (fotoUrl) {
    return (
      <Image
        source={{ uri: fotoUrl }}
        style={[styles.avatar, { width: tamaño, height: tamaño, borderRadius: tamaño / 2 }]}
      />
    );
  }

  return (
    <View
      style={[
        styles.avatarPlaceholder,
        { width: tamaño, height: tamaño, borderRadius: tamaño / 2 },
      ]}
    >
      <Text style={[styles.avatarLetra, { fontSize: tamaño * 0.4 }]}>
        {nombre.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: Colors.cremacalida,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadow.sm,
    marginBottom: Spacing.sm,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  cabeceraInfo: {
    flex: 1,
  },
  nombre: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: FontSize.bodyMd,
    color: Colors.negrocacao,
    marginBottom: 2,
  },
  ciudad: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.uiSm,
    color: Colors.piedra,
    marginBottom: Spacing.xs,
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  colores: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.md,
  },
  circuloColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(26,20,16,0.1)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  puntos: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.uiSm,
    color: Colors.camel,
  },
  alta: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.uiSm,
    color: Colors.piedra,
  },
  avatar: {
    borderWidth: 2,
    borderColor: Colors.doradoarena,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.camel,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.doradoarena,
  },
  avatarLetra: {
    fontFamily: FontFamily.displayBold,
    color: Colors.cremacalida,
  },
  chevron: {
    fontFamily: FontFamily.sansRegular,
    fontSize: 22,
    color: Colors.piedra,
    alignSelf: 'center',
  },
  compacto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.cremacalida,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
    marginBottom: Spacing.xs,
  },
  compactoInfo: {
    flex: 1,
  },
  compactoNombre: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.bodyMd,
    color: Colors.negrocacao,
  },
  compactoMomento: {
    fontFamily: FontFamily.sansRegular,
    fontSize: FontSize.uiSm,
    color: Colors.piedra,
    marginTop: 2,
  },
});
