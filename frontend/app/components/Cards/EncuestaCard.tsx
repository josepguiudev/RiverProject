import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

/**
 * Propiedades del componente {@link EncuestaCard}.
 */
interface EncuestaCardProps {
  /**
   * Título principal de la encuesta.
   */
  titulo: string;
  /**
   * Descripción breve o detallada del contenido de la encuesta.
   */
  descripcion: string;
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
 * @example
 * ```tsx
 * <EncuestaCard
 *   titulo="Encuesta de Satisfacción"
 *   descripcion="Evalúa nuestro servicio al cliente"
 *   pago={50}
 * />
 * ```
 *
 * @returns Un elemento React que representa la tarjeta de la encuesta.
 */
function EncuestaCard({ titulo, descripcion, pago }: EncuestaCardProps) {
  console.log("Renderizando:", titulo);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{titulo}</Text>
      <Text style={styles.description}>{descripcion}</Text>
      <Text style={styles.pago}>Pago: ${pago}</Text>
    </View>
  );
}

export default memo(EncuestaCard); //Memo permite evitar que si cambiamos solo un componente hijo tras el randerizado solo se actualice ese específico y no se rendericen los demás.

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginVertical: 6,
  },
  pago: {
    fontSize: 14,
    fontWeight: "600",
  },
});
