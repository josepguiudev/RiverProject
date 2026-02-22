import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

/**
 * CREADO CON ANTIGRAVITY COMO GUIA PARA EL DESARROLLO DE NUESTRA APP.
 * 
 * 
 * Este es un componente de ejemplo para guiarte.
 *
 * 1. Naming Convention: PascalCase (Primera letra mayúscula).
 *    Nombre del archivo: ExampleComponent.tsx
 *    Nombre de la función: ExampleComponent
 *
 * 2. Estructura:
 *    - Imports arriba.
 *    - Interface de Props (si las tiene).
 *    - Componente (función).
 *    - Styles (al final).
 */

// Props: Equivalente a los paŕametros de un componente Blade <x-alert type="error" />
interface ExampleComponentProps {
  title: string; // Título obligatorio
  description?: string; // Descripción opcional (con el ?)
}

export default function ExampleComponent({
  title,
  description = "Sin descripción",
}: ExampleComponentProps) {
  // State: Equivalente a una variable que, si cambia, redibuja el componente.
  // [valorActual, funcionParaCambiarlo] = useState(valorInicial)
  const [likes, setLikes] = useState(0);

  // Función manejadora de eventos
  const handleLike = () => {
    setLikes(likes + 1);
    console.log(`Nuevo likes: ${likes + 1}`);
  };

  // Renderizado: Retornamos JSX (parecido a HTML)
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>

      <View style={styles.counterContainer}>
        <Text>Likes: {likes}</Text>

        <TouchableOpacity style={styles.button} onPress={handleLike}>
          <Text style={styles.buttonText}>Dar Like 👍</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Estilos: CSS en JS
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
    // Sombras (Shadows)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Sombra para Android
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  counterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  button: {
    backgroundColor: "#007AFF", // Azul bonito
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
