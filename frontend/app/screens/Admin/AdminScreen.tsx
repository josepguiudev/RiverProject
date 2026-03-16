import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Alert } from "react-native";

import globalStyles from "@/assets/globalStyles/globalStyles";
import styles from './styles';

import MenuPrincipal from '@/app/components/Menu/CustomMenu';
import strings from "../../../assets/supportFiles/strings.json";

import CustomInputCard from '@/app/components/CustomInputCard/CustomInputCard';
import CustomButton from '@/app/components/CustomButton/CustomButton';

export default function AdminScreen({ navigation }: any) {
    const [menuVisible, setMenuVisible] = useState(false);

    const [usuariosEncontrados, setUsuariosEncontrados] = useState<any[]>([]);
    const [juegosEncontrados, setJuegosEncontrados] = useState<any[]>([]);
    
    const guardarUsers = async () => {
        console.log("clic users")
    }

    const guardarBiblio = async () => {
        console.log("clic biblio")
        if (!juegosEncontrados || juegosEncontrados.length === 0) {
            Alert.alert("Aviso", "Primero debes buscar y extraer una biblioteca.");
            return;
        }

        try {
            const url = `${strings.parte2Desktop}${strings.controllerGame}save-steam-library`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(juegosEncontrados),
                credentials: 'omit'
            });

            const mensaje = await response.text();
            if (response.ok) {
                Alert.alert("Éxito", mensaje);
            } else {
                throw new Error(mensaje || "Error desconocido al guardar");
            }

        } catch (error) {
            console.error("Error al guardar biblioteca:", error);
            Alert.alert("Error", "No se pudo conectar con el servidor para guardar los juegos.");
        }
    }

    const guardarJuego = async () => {
        console.log("clic juego")
    }

    return (
        <View style={[globalStyles.padre, globalStyles.tamanoCajaPadre]}>
            {/* 1. HEADER / BOTÓN MENU */}
            <View style={[globalStyles.cajaMenu, globalStyles.borde, globalStyles.alineadoPersonalVertical]}>
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 20 }}>
                    <Text style={{ color: 'white' }}>{strings.menu}</Text>
                </TouchableOpacity>
            </View>

            <View style={[globalStyles.padre, globalStyles.tamanoCajaPadre, globalStyles.alineadoPersonal]}>
                <View style={[styles.cajaPrincipal, globalStyles.borde, globalStyles.filas]}>
                    <View style={[globalStyles.borde2, styles.contenedorFila, globalStyles.alineadoPersonalHorizontal]}>
                        <CustomInputCard title='Extraer Users' value={1} onResultFound={(data) => {
                            const listaFinal = data.response?.players 
                            ? data.response.players 
                            : (Array.isArray(data) ? data : []); 
                            setUsuariosEncontrados([...listaFinal])
                            }}/>
                        <CustomInputCard title='Extraer Juegos Bibliotecas' value={3} onResultFound={(data) => {
                            setJuegosEncontrados([]);
                            const listaJuegos = data.response?.games || (Array.isArray(data) ? data : []);
                            setJuegosEncontrados([...listaJuegos])
                            }}/>
                        <CustomInputCard title='Extraer Juegos' value={2}/>
                    </View>
                    <View style={[globalStyles.borde2, styles.contenedorFila2, styles.contenedorVertical]}>
                        <View style={[styles.contenedorUserTittleButton]}>
                            <Text style={[styles.label]}>Resultado de búsqueda de usuario/s</Text>
                        </View>
                        <View style={[styles.contenedorUserTittleButton, {height: "84%"}, styles.contenedorVertical]}>
                            
                            <ScrollView>
                                {Array.isArray(usuariosEncontrados) && usuariosEncontrados.map((item: any, index: number) => (
                                    <Text key={item.steamid || index} style={{color: 'white', padding: 5}}>
                                        {item.personaname} {/* <-- Cambiado de description a personaname */}
                                    </Text>
                                ))}
                            </ScrollView>

                        </View>
                        <View style={[styles.contenedorUserTittleButton]}>
                            <CustomButton title="Guardar usuario/s" onPress={guardarUsers} isAdmin={true} />
                        </View>
                    </View>
                    <View style={[globalStyles.borde2, styles.contenedorFila2, styles.contenedorVertical]}>
                        <View style={[styles.contenedorUserTittleButton]}>
                            <Text style={[styles.label]}>Resultado biblioteca de usuario</Text>
                        </View>
                        <View style={[styles.contenedorUserTittleButton, {height: "84%"}, styles.contenedorVertical]}>
                            
                            <ScrollView>
                                {Array.isArray(juegosEncontrados) && juegosEncontrados.map((item: any, index: number) => (
                                    <Text key={item.appid || index} style={{color: 'white', padding: 5}}>
                                        {item.name} {/* <-- Cambiado de description a personaname */}
                                    </Text>
                                ))}
                            </ScrollView>

                        </View>
                        <View style={[styles.contenedorUserTittleButton]}>
                            <CustomButton title="Guardar juegos" onPress={guardarBiblio} isAdmin={true} />
                        </View>
                    </View>
                    <View style={[globalStyles.borde2, styles.contenedorFila2, styles.contenedorVertical]}>
                        <View style={[styles.contenedorUserTittleButton]}>
                            <Text style={[styles.label]}>Juego extraído</Text>
                        </View>
                        <View style={[styles.contenedorUserTittleButton, {height: "84%"}, styles.contenedorVertical]}>

                        </View>
                        <View style={[styles.contenedorUserTittleButton]}>
                            <CustomButton title="Guardar juego" onPress={guardarJuego} isAdmin={true} />
                        </View>
                    </View>
                </View>
            </View>            


            {/* 3. MENU AL FINAL (FUERA DE TODO) */}
            <MenuPrincipal 
                visible={menuVisible} 
                onClose={() => setMenuVisible(false)} 
            />
        </View>
    );
}