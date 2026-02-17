import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

interface EncuestaCardProps {
    titulo: string;
    descripcion: string;
    pago?: number | null;

}


function EncuestaCard({
  titulo,
  descripcion,
  pago,
}: EncuestaCardProps) {
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
