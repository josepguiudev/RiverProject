import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import EncuestaCard from "./EncuestaCard";

interface Encuesta {
  id: number;
  titulo: string;
  descripcion: string;
  pago?: number | null; //Coalesce en REACT con TS
}

export default function ListaEncuestas() {
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);

  useEffect(() => {
    const fetchData = async () => { // TO DO: HACER CONEXIÓN CON API UNA VEZ ESTÉ CREADA.
      const data: Encuesta[] = [
        { id: 1, titulo: "Encuesta A", descripcion: "Descripción A"},
        { id: 2, titulo: "Encuesta B", descripcion: "Descripción B", pago: 15 },
        { id: 3, titulo: "Encuesta C", descripcion: "Descripción C", pago: 20 },
      ];

      setEncuestas(data);
    };

    
    fetchData();
  }, []);

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