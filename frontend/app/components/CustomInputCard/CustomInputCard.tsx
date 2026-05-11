import React, { useEffect, useState } from "react";
import { View, Alert, ActivityIndicator, ViewStyle, TextStyle, Text } from "react-native";
import styles from "./styles";
import globalStyles from "@/assets/globalStyles/globalStyles";
import TypeWriter from "react-native-typewriter";

import CustomDropdown from '@/app/components/CustomDropDown/CustomDropDown';
import CustomInputText from "../CustomInputText/CustomInputText";
import CustomButton from "../CustomButton/CustomButton";

import strings from "../../../assets/supportFiles/strings.json";

import type {Option}  from '@/app/components/CustomDropDown/CustomDropDown';

import Constants from 'expo-constants';


type Props = {
    title: string;
    value: number;
    onResultFound?: (data: any) => void;
};

type SteamQuery = {
    id: number;
    description: string;
    query: string;
    type: number;
};

const containerCard: ViewStyle = {
    backgroundColor: '#1b2838',
    padding: 18,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#2a475e',
    marginBottom: 10,
    width: '100%',
};

const labelEstilo: TextStyle = { 
    color: '#66c0f4', 
    fontSize: 10, 
    fontWeight: '800', 
    marginBottom: 8, 
    letterSpacing: 1,
    textTransform: 'uppercase'
};

const filaControles: ViewStyle = { 
    flexDirection: 'row', 
    alignItems: 'flex-end', // Esto hace que el botón y los inputs se alineen por abajo
    gap: 12 
};

const CustomInputCard = ({ title, value, onResultFound}: Props) => {
    const [queries, setQueries] = useState<SteamQuery[]>([]);
    const [queries2, setQueries2] = useState<SteamQuery[]>([]);
    const [queries3, setQueries3] = useState<SteamQuery[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [inputUserId, setInputUserId] = useState("");
    const [inputGameId, setInputGameId] = useState("");
    const [usuariosBD, setUsuariosBD] = useState<Option[]>([]);

    useEffect(() => {
        const cargarQueries = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/queries/bytype1"); 

                if (!response.ok) {
                    throw new Error("Error al obtener queries");
                }

                const data: SteamQuery[] = await response.json();

                //const soloStrings = data.map(item => item.query);
                setQueries(data);

                if (data.length > 0) {
                    setSelectedOption({
                        id: data[0].id,
                        label: data[0].description,
                        value: data[0].query
                    });
                }

            } catch (error) {
                console.error(error);
                Alert.alert("Error", "No se pudieron cargar las consultas");
            } finally {
                setLoading(false);
            }
        };

        const cargarQueriesType2 = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/queries/bytype2"); 
                if (!response.ok) {
                    throw new Error("Error al obtener queries");
                }
                const data: SteamQuery[] = await response.json();
                setQueries2(data);
            } catch (error) {
                console.error(error);
                Alert.alert("Error", "No se pudieron cargar las consultas");
            } finally {
                setLoading(false);
            }
        };

        const cargarQueriesType3 = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/queries/bytype3"); 
                if (!response.ok) {
                    throw new Error("Error al obtener queries");
                }
                const data: SteamQuery[] = await response.json();
                setQueries3(data);
            } catch (error) {
                console.error(error);
                Alert.alert("Error", "No se pudieron cargar las consultas");
            } finally {
                setLoading(false);
            }
        };

        const cargarUsuariosRegistrados = async () => {
            try {
                // Ajusta esta URL a tu endpoint que devuelve los usuarios guardados
                const response = await fetch(`${strings.parte2Desktop}api/usersteam/allUsers`); 
                const data = await response.json();
                
                // Mapeamos a formato Option para el Dropdown
                if (data && data.content && Array.isArray(data.content)) {
                    const options = data.content.map((u: any) => ({
                        id: u.id,
                        label: `${u.personaName} (${u.steamId})`, // Usamos personaName como está en tu DTO
                        value: u.steamId
                    }));
                    setUsuariosBD(options);
                } else {
                    console.error("No se encontró la lista de usuarios en 'content':", data);
                }
            } catch (error) {
                console.log("Error cargando usuarios de la BD", error);
            }
        };
        cargarUsuariosRegistrados();

        if(value === 1){
            cargarQueries();
        }else if(value === 2){
            cargarQueriesType2();
        }else if(value === 3){
            cargarQueriesType3();
        }
    }, []);

    const buscarPeticion = async () => {
        console.log("clic")
        if (!selectedOption || !inputUserId) {
        Alert.alert("Error", "Selecciona una consulta e introduce un ID");
        return;
        }

        console.log("ID Query:", selectedOption.id);
        console.log("Query seleccionada:", selectedOption.value);
        console.log("Descripción:", selectedOption.label);
        console.log("Descripción:", Constants.expoConfig?.extra?.STEAM_API_KEY);
        console.log("ID Usuario:", inputUserId);

        try{
            if(selectedOption.value === strings.GetPlayerSummaries){
                console.log(`${strings.parte1Desktop}${strings.parte2MappingIntroducido}${strings.parametroSteamApiKey}${Constants.expoConfig?.extra?.STEAM_API_KEY}${strings.conjugacion}${strings.parametroSteamId}${inputUserId}`);
                const response = await fetch(
                `${strings.parte1Desktop}${strings.parte2MappingIntroducido}${strings.parametroSteamApiKey}${Constants.expoConfig?.extra?.STEAM_API_KEY}${strings.conjugacion}${strings.parametroSteamId}${inputUserId}`
                ); 
                if (!response.ok) {
                    throw new Error("Error al llamar al backend");
                }

                const data = await response.json();
                console.log("Respuesta Steam:", data.response.players);
                Alert.alert("OK", "Usuario obtenido correctamente");
                if (onResultFound) {
                    onResultFound(data); 
                }
            }else if (selectedOption.value === strings.GetFriendList){
                console.log(`${strings.parte1Desktop}${strings.parte21MappingIntroducido}${strings.parametroSteamApiKey}${Constants.expoConfig?.extra?.STEAM_API_KEY}${strings.conjugacion}${strings.parametroSteamId}${inputUserId}`);
                const response = await fetch(
                `${strings.parte1Desktop}${strings.parte21MappingIntroducido}${strings.parametroSteamApiKey}${Constants.expoConfig?.extra?.STEAM_API_KEY}${strings.conjugacion}${strings.parametroSteamId}${inputUserId}`
                );
                if (!response.ok) {
                    throw new Error("Error al llamar al backend");
                }

                const data = await response.json();
                console.log("Respuesta Steam:", data.friendslist.friends);

                const listUser = [];

                for (const friend of data.friendslist.friends) {
                    
                    try {
                        const friendResponse = await fetch(
                            `${strings.parte1Desktop}${strings.parte2MappingIntroducido}${strings.parametroSteamApiKey}${Constants.expoConfig?.extra?.STEAM_API_KEY}${strings.conjugacion}${strings.parametroSteamId}${friend.steamid}`
                        );

                        const friendData = await friendResponse.json();
                        const player = friendData.response.players[0];

                        console.log(player.personaname);
                        listUser.push(player);     
                        
                        //SE GUARDA LOS USUARIOS
                        /*const postResponse = await fetch("http://localhost:8080/api/usersteam/registerusersteam", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(player),
                            credentials: 'omit'
                        });

                        if (!postResponse.ok) {
                            console.error("Error registrando jugador:", player.personaname);
                        }*/
                    } catch (err) {
                        console.error("Error procesando friend:", friend.steamid, err);
                    }
                }
                console.log(listUser);

                if (onResultFound) {
                    onResultFound([...listUser]); 
                }

                Alert.alert("OK", "Usuario obtenido correctamente");
            }
            
        }catch(error){
            console.error(error);
            Alert.alert("Error", "No se pudo obtener el usuario");
        }
    }

    const buscarPeticion2 = async () => {
        console.log("clic 2222222222222222222222222222222222")
        console.log(inputUserId)
        if (!selectedOption) {
        console.log("No se ha seleccionado ninguna opción");
        return;
        }

        try{
            const response = await fetch(`${strings.parte2Desktop}${strings.controllerGame}${strings.extraer}${inputUserId}${strings.key}${Constants.expoConfig?.extra?.STEAM_API_KEY}`);
            if (!response.ok) throw new Error("Error en el servidor");

            const data = await response.json();

            if (onResultFound) {
                onResultFound(data.response.games); 
            }

            const cantidad = data.response?.game_count || 0;
            Alert.alert("Éxito", `Se han extraído ${cantidad} juegos del usuario.`);

            console.log(`Se han extraído ${cantidad} juegos del usuario.`);
            console.log(data.response.games);

        }catch(error){
            console.log("Error", error);
            Alert.alert("Error", "No se pudo extraer la biblioteca del servidor local.");
        }

        console.log("ID Query:", selectedOption.id);
        console.log("Query seleccionada:", selectedOption.value);
        console.log("Descripción:", selectedOption.label);
        console.log("Descripción:", Constants.expoConfig?.extra?.STEAM_API_KEY);
        console.log("ID Usuario:", inputUserId);
    }

    const buscarPeticion3 = async () => {
        if (!inputGameId) return;

        try {
            // Llamas a TU backend pasando el id del juego como parámetro
            const url = `${strings.parte2Desktop}api/generes/external-details?appid=${inputGameId}`;
            
            const response = await fetch(url);
            const data = await response.json();

            // Steam devuelve el JSON con el ID como llave: data["22380"]
            if (data[inputGameId]?.success) {
                if (onResultFound) {
                    onResultFound(data); // Pasas el JSON completo al AdminScreen
                }
                Alert.alert("Éxito", "Detalles del juego obtenidos desde el servidor.");
            } else {
                Alert.alert("Error", "No se encontró el juego.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo obtener el detalle del juego.");
        }
    }

    let content; 
    // Estilos internos rápidos para limpieza
    const titleStyle: TextStyle = { 
        color: '#66c0f4', 
        fontSize: 11, 
        fontWeight: '800', 
        marginBottom: 10, 
        letterSpacing: 1,
        textTransform: 'uppercase'
    };
    const filaControles: ViewStyle = { 
        flexDirection: 'row', 
        alignItems: 'flex-end', // Alineación perfecta por la base
        gap: 12 
    };

    switch (value) {
        case 1: 
            content = (
                <View>
                    <TypeWriter typing={1} maxDelay={50} style={titleStyle}>{title}</TypeWriter>
                    <View style={filaControles}>
                        {/* 1. SELECTOR DE CONSULTA (Mantenemos igual) */}
                        <View style={{ flex: 1 }}>
                            <Text style={labelEstilo}>Consulta</Text>
                            <CustomDropdown 
                                label="" 
                                options={queries.map(q => ({ id: q.id, label: q.description, value: q.query }))} 
                                onSelect={item => setSelectedOption(item)}
                            />
                        </View>

                        {/* 2. SELECTOR DE USUARIOS BD (NUEVO) */}
                        <View style={{ flex: 1 }}>
                            <Text style={labelEstilo}>Elegir Guardado</Text>
                            <CustomDropdown 
                                label="" 
                                options={usuariosBD} 
                                onSelect={item => setInputUserId(item.value)} // Al seleccionar, rellena el input
                            />
                        </View>

                        {/* 3. INPUT MANUAL (Por si no está en la BD) */}
                        <View style={{ flex: 1 }}>
                            <Text style={labelEstilo}>O escribir ID</Text>
                            <CustomInputText 
                                placeholder="SteamID..." 
                                value={inputUserId} // Vinculamos el valor
                                isAdmin={true} 
                                onChangeText={setInputUserId}
                            />
                        </View>

                        <CustomButton title="BUSCAR" onPress={buscarPeticion} isAdmin={true} />
                    </View>
                </View>
            );
            break;
        case 2:
            content = (
                <View>
                    <TypeWriter typing={1} maxDelay={50} style={titleStyle}>{title}</TypeWriter>
                    <View style={filaControles}>
                        <View style={{ flex: 2 }}>
                            {loading ? (
                                <ActivityIndicator size="small" color="#66c0f4" />
                            ) : (
                                <CustomDropdown 
                                    label="Seleccione una consulta" 
                                    options={queries2.map(q => ({ id: q.id, label: q.description, value: q.query }))} 
                                    onSelect={item => setSelectedOption(item)}
                                />
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            <CustomInputText placeholder="AppID Juego" isAdmin={true} onChangeText={setInputGameId}/>
                        </View>
                        <CustomButton title="BUSCAR" onPress={buscarPeticion3} isAdmin={true} />
                    </View>
                </View>
            );
            break;
        case 3:
            content = (
                <View>
                    <TypeWriter typing={1} maxDelay={50} style={titleStyle}>{title}</TypeWriter>
                    <View style={filaControles}>
                        <View style={{ flex: 2 }}>
                            {loading ? (
                                <ActivityIndicator size="small" color="#66c0f4" />
                            ) : (
                                <CustomDropdown 
                                    label="Seleccione una consulta" 
                                    options={queries3.map(q => ({ id: q.id, label: q.description, value: q.query }))} 
                                    onSelect={item => setSelectedOption(item)}
                                />
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            <CustomInputText placeholder="ID Jugador" isAdmin={true} onChangeText={setInputUserId}/>
                        </View>
                        <CustomButton title="BUSCAR" onPress={buscarPeticion2} isAdmin={true} />
                    </View>
                </View>
            );
            break;
        default: 
            content = <View/>
    }

    return (
        <View style={{ 
            backgroundColor: '#1b2838', // Azul marino de Steam
            padding: 15, 
            borderRadius: 12, 
            borderWidth: 1, 
            borderColor: '#2a475e', // Borde azul sutil
            marginBottom: 10,
            width: '100%',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
        }}>
            {content}
        </View>
    );
}

export default CustomInputCard;