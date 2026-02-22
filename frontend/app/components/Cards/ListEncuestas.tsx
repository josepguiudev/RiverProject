import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import EncuestaCard from "./EncuestaCard";

/**
 * Estructura de datos que representa una encuesta.
 */
/**
 * Estructura de datos que representa una encuesta.
 */
export interface Encuesta {
  /** Identificador único de la encuesta */
  id: number;
  /** Título de la encuesta */
  titulo: string;
  /** Descripción de la encuesta */
  descripcion: string;
  /** Pago ofrecido por completar la encuesta (opcional) */
  pago?: number | null; //Coalesce en REACT con TS
}

/**
 * Propiedades del componente ListaEncuestas
 */
interface ListEncuestasProps {
  /** 
   * Datos opcionales para testear o visualizar en Storybook sin hacer fetch. 
   * Si se proporcionan, el componente usará estos datos en lugar de hacer la llamada a la API.
   */
  dataTest?: Encuesta[];
}

/**
 * Componente que muestra una lista de encuestas disponibles.
 * Obtiene los datos de una fuente (simulada por ahora) y los renderiza en una lista optimizada.
 * 
 * Permite inyectar datos de prueba a través de la prop `dataTest`.
 *
 * @returns Componente contenedor con la lista de encuestas
 */

// TO DO: ELIMINAR `dataTest` Y LA LÓGICA ASOCIADA CUANDO SE PASE A PRODUCCIÓN O SE CONECTE CON LA API REAL.
// Esta prop solo sirve para facilitar el desarrollo en Storybook y Tests.
// export default function ListaEncuestas() {
export default function ListaEncuestas({ dataTest }: ListEncuestasProps = {}) {
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);

  useEffect(() => {
    // ---------------------------------------------------------------------------
    // LÓGICA DE DESARROLLO (ELIMINAR EN PRODUCCIÓN)
    // Si nos pasan datos por props (Storybook/Tests), los usamos directamente.
    if (dataTest) {
      setEncuestas(dataTest);
      return;
    }
    // ----------------------------------------------------------------------------

    const fetchData = async () => {
      // TO DO: HACER CONEXIÓN CON API UNA VEZ ESTÉ CREADA.
      const data: Encuesta[] = [
        { id: 1, titulo: "Encuesta A", descripcion: "Descripción A" },
        { id: 2, titulo: "Encuesta B", descripcion: "Descripción B", pago: 15 },
        { id: 3, titulo: "Encuesta C", descripcion: "Descripción C", pago: 20 },
      ];

      setEncuestas(data);
    };

    fetchData();
  // }, []);
  // Se añade dataTest como dependencia solo mientras exista esa prop de desarrollo.
  }, [dataTest]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        //Mejor opción que .map() porque este renderiza solo lo que se ve en la pantalla y map renderiza todos de golpe, por temas de eficiencia lo hago así.
        data={encuestas}
        // keyExtractor le da una id a cada componente para evitar renders inecesarios o bugs visuales. (Ayuda a REACT)
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EncuestaCard
            titulo={item.titulo}
            descripcion={item.descripcion}
            pago={item.pago}
          />
        )}
      />
    </View>
  );
}
