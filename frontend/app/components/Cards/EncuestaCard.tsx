import React, { memo } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useLayout } from "@/app/utils/useLayout";

/**
 * Propiedades del componente {@link EncuestaCard}.
 */
interface EncuestaCardProps {
  /**
   * Título principal de la encuesta.
   */
  name: string;
  /**
   * El pago asociado a la encuesta, si aplica.
   * Puede ser nulo si no hay pago definido.
   */
  pago?: number | null;
}

/**
 * Componente que renderiza una tarjeta de encuesta con título, descripción y pago.
 *
 * @remarks
 * Este componente utiliza `React.memo` para optimizar el re-renderizado.
 *
 * @returns Un elemento React que representa la tarjeta de la encuesta.
 */
function EncuestaCard({ name, pago }: EncuestaCardProps) {
  const { isDesktopView, isTabletView } = useLayout();

  return (
    <View style={[
      styles.card,
      (isTabletView || isDesktopView) && styles.cardLarge
    ]}>
      <Text style={[
        styles.title,
        isDesktopView && styles.titleDesktop
      ]}>{name}</Text>
      <Text style={[
        styles.pago,
        isDesktopView && styles.pagoDesktop
      ]}>Pago: ${pago}</Text>
    </View>
  );
}

export default memo(EncuestaCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a2e",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#263238',
    width: '100%',
    ...Platform.select({
      ios: { shadowColor: '#5b55c0', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 10 },
      android: { elevation: 8 },
      web: { 
        boxShadow: '0px 2px 10px rgba(91, 85, 192, 0.2)' 
      } as any
    })
  },
  cardLarge: {
    padding: 24,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#ffffff',
  },
  titleDesktop: {
    fontSize: 22,
  },
  pago: {
    fontSize: 14,
    fontWeight: "600",
    color: '#a2a8d3',
    marginTop: 4,
  },
  pagoDesktop: {
    fontSize: 16,
  }
});
