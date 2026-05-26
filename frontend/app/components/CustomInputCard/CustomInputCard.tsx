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
    const [inputLibraryUserId, setInputLibraryUserId] = useState("");//Libreria de juegos
    const [inputGameId, setInputGameId] = useState("");

    const [usuariosBD, setUsuariosBD] = useState<Option[]>([]);
    const [juegosBD, setJuegosBD] = useState<Option[]>([]);

    const [estaCargando, setEstaCargando] = useState(false);
    const [estaCargandoUsers, setEstaCargandoUsers] = useState(false);
    const [estaCargandoJuegos, setEstaCargandoJuegos] = useState(false);

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
            setEstaCargandoUsers(true);
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
            }finally {
                setEstaCargandoUsers(false);
            }
        };
        cargarUsuariosRegistrados();

        const cargarJuegosRegistrados = async () => {
            setEstaCargandoJuegos(true);
            try {
                const response = await fetch(`${strings.parte2Desktop}api/games/all`); 
                if (!response.ok) return;

                const data = await response.json();

                if (Array.isArray(data)) {
                    const options = data
                        .filter((g: any) => g !== null && g.appid !== undefined && g.appid !== null) // Filtramos juegos rotos
                        .map((g: any) => ({
                            id: g.id_game || g.id, 
                            label: `${g.title || 'Juego sin título'} (${g.appid})`, 
                            value: g.appid.toString() // Ahora sí se garantiza que appid existe
                        }));
                            setJuegosBD(options);
                        }
            } catch (error) {
                console.error("Error al cargar juegos:", error);
            }finally {
                setEstaCargandoJuegos(false);
            }
        };
        cargarJuegosRegistrados();

        if(value === 1){
            cargarQueries();
        }else if(value === 2){
            cargarQueriesType2();
        }else if(value === 3){
            cargarQueriesType3();
        }
    }, []);

    const buscarPeticion = async () => {
        setEstaCargando(true);
        console.log("clic")
        if (!selectedOption || !inputUserId) {
        Alert.alert("Error", "Selecciona una consulta e introduce un ID");
        setEstaCargando(false);
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
        }finally {
            setEstaCargando(false);
        }
    }

    const buscarPeticion2 = async () => {
        setEstaCargando(true);
        console.log(inputUserId)
        if (!inputLibraryUserId || inputLibraryUserId.trim() === "") {
            Alert.alert("Error", "Selecciona una consulta e introduce un ID para la biblioteca");
            console.log("No se ha seleccionado ninguna opción");
            setEstaCargando(false);
        return;
        }

        try{
            const response = await fetch(`${strings.parte2Desktop}${strings.controllerGame}${strings.extraer}${inputLibraryUserId}${strings.key}${Constants.expoConfig?.extra?.STEAM_API_KEY}`);
            
            if (!response.ok) throw new Error("Error en el servidor");

                const data = await response.json();

                if (data && data.response) {
                if (onResultFound) {
                    // Emitimos el formato exacto que ahora espera tu AdminScreen
                    onResultFound({
                        games: data.response.games || [],
                        steamid: inputLibraryUserId
                    }); 
                }
                const cantidad = data.response?.game_count || 0;
                Alert.alert("Éxito", `Se han extraído ${cantidad} juegos del usuario.`);

                console.log(`Se han extraído ${cantidad} juegos del usuario.`);
                console.log(data.response.games);
            } else {
                throw new Error("La respuesta de Steam no contiene el nodo 'response'");
            }

        }catch(error){
            console.log("Error", error);
            Alert.alert("Error", "No se pudo extraer la biblioteca del servidor local.");
        }finally {
            setEstaCargando(false);
        }

        //console.log("ID Query:", selectedOption.id);
        //console.log("Query seleccionada:", selectedOption.value);
        //console.log("Descripción:", selectedOption.label);
        console.log("Descripción:", Constants.expoConfig?.extra?.STEAM_API_KEY);
        console.log("ID Usuario:", inputUserId);
    }

    const buscarPeticion3 = async () => {
        setEstaCargando(true);
        if (!inputGameId){
            setEstaCargando(false);
            return;
        } 

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
        }finally {
            setEstaCargando(false);
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

    const labelEstilo2: TextStyle = { 
        color: '#66c0f4', 
        fontSize: 10, 
        fontWeight: '800', 
        marginBottom: 6, 
        letterSpacing: 1,
        textTransform: 'uppercase'
    };

    const gridContenedor: ViewStyle = { 
        flexDirection: 'row', 
        flexWrap: 'wrap', // Permite que los elementos bajen si no caben
        justifyContent: 'space-between',
        gap: 15 
    };

    switch (value) {
        case 1: 
            content = (
                <View style={{ padding: 0 }}>
                    <TypeWriter typing={1} maxDelay={50} style={[titleStyle, { marginBottom: 5 }]}>
                        {title.toUpperCase()}
                    </TypeWriter>

                    {/* 1. CONSULTA */}
                    <View style={{ marginBottom: 10 }}>
                        <Text style={[labelEstilo2, { marginBottom: 4 }]}>TIPO DE PETICIÓN</Text>
                        <CustomDropdown 
                            label="" 
                            options={queries.map(q => ({ id: q.id, label: q.description, value: q.query }))} 
                            onSelect={item => setSelectedOption(item)}
                        />
                    </View>

                    {/* 2. FILA DE PARÁMETROS: La clave es alignItems: 'flex-end' */}
                    <View style={{ 
                        flexDirection: 'row', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-end', // Esto alinea las bases de los dos inputs
                        marginBottom: 15,
                        width: '100%'
                    }}>
                        <View style={{ width: '48%' }}>
                            <Text style={[labelEstilo2, { marginBottom: 4 }]}>ELEGIR GUARDADO</Text>
                            {estaCargandoUsers ? (
                                <ActivityIndicator color="gold" size="small" />
                            ) : (
                                <CustomDropdown 
                                    label="" 
                                    options={usuariosBD} 
                                    onSelect={item => setInputUserId(item.value)} 
                                />
                            )}
                        </View>

                        <View style={{ width: '48%' }}>
                            <Text style={[labelEstilo2, { marginBottom: 4 }]}>O ESCRIBIR ID</Text>
                            <CustomInputText 
                                placeholder="SteamID..." 
                                value={inputUserId} 
                                isAdmin={true} 
                                onChangeText={setInputUserId}
                                // Si puedes, añade style={{ height: 45 }} dentro del componente
                            />
                        </View>
                    </View>

                    {/* 3. BOTÓN */}
                    <View style={{ width: '100%' }}>
                        {estaCargando ? (
                            <ActivityIndicator color="gold" size="small" />
                        ) : (
                            <CustomButton 
                                title="EJECUTAR BÚSQUEDA" 
                                onPress={buscarPeticion} 
                                isAdmin={true} 
                            />
                        )}
                    </View>
                </View>
            );
            break;
        case 2:
            content = (
                <View style={{ padding: 0 }}>
                    {/* TÍTULO ARRIBA */}
                    <TypeWriter typing={1} maxDelay={50} style={[titleStyle, { marginBottom: 5 }]}>
                        {title.toUpperCase()}
                    </TypeWriter>

                    {/* 1. CONSULTA (Fila Superior al 100%) */}
                    <View style={{ marginBottom: 10 }}>
                        <Text style={[labelEstilo2, { marginBottom: 4 }]}>TIPO DE PETICIÓN</Text>
                        <CustomDropdown 
                            label="" 
                            options={queries2.map(q => ({ id: q.id, label: q.description, value: q.query }))} 
                            onSelect={setSelectedOption}
                        />
                    </View>

                    {/* 2. FILA DE PARÁMETROS (Alineados por la base al 48% cada uno) */}
                    <View style={{ 
                        flexDirection: 'row', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-end', 
                        marginBottom: 15,
                        width: '100%'
                    }}>
                        <View style={{ width: '48%' }}>
                            <Text style={[labelEstilo2, { marginBottom: 4 }]}>ELEGIR GUARDADO</Text>
                            {estaCargandoJuegos ? (
                                <ActivityIndicator color="gold" size="small" />
                            ) : (
                                <CustomDropdown 
                                    label="" 
                                    options={juegosBD} 
                                    onSelect={(item) => setInputGameId(item.value)} 
                                />
                            )}
                        </View>

                        <View style={{ width: '48%' }}>
                            <Text style={[labelEstilo2, { marginBottom: 4 }]}>O ESCRIBIR APPID</Text>
                            <CustomInputText 
                                placeholder="Ej: 22380" 
                                value={inputGameId} 
                                isAdmin={true} 
                                onChangeText={setInputGameId}
                            />
                        </View>
                    </View>

                    {/* 3. BOTÓN (Fila Inferior al 100% para cerrar el diseño) */}
                    <View style={{ width: '100%' }}>
                        {estaCargando ? (
                            <ActivityIndicator color="gold" size="small" />
                        ) : (
                            <CustomButton 
                                title="EJECUTAR BÚSQUEDA" 
                                onPress={buscarPeticion3} 
                                isAdmin={true} 
                            />
                        )}
                    </View>
                </View>
            );
            break;
        case 3:
            content = (
                <View style={{ padding: 0 }}>
                    {/* TÍTULO */}
                    <TypeWriter typing={1} maxDelay={50} style={[titleStyle, { marginBottom: 5 }]}>
                        {title.toUpperCase()}
                    </TypeWriter>

                    {/* 1. CONSULTA (Fila Superior al 100%) */}
                    <View style={{ marginBottom: 10 }}>
                        <Text style={[labelEstilo2, { marginBottom: 4 }]}>TIPO DE PETICIÓN</Text>
                        <CustomDropdown 
                            label="" 
                            options={queries3.map(q => ({ id: q.id, label: q.description, value: q.query }))} 
                            onSelect={setSelectedOption}
                        />
                    </View>

                    {/* 2. FILA DE PARÁMETROS (Alineados por la base al 48% cada uno) */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 15, width: '100%' }}>
                        <View style={{ width: '48%' }}>
                            <Text style={[labelEstilo2, { marginBottom: 4 }]}>ELEGIR USUARIO</Text>
                            <CustomDropdown 
                                label="" 
                                options={usuariosBD} 
                                // ✅ Rellena el input de la biblioteca, no el de usuarios
                                onSelect={(item) => setInputLibraryUserId(item.value)} 
                            />
                        </View>
                        <View style={{ width: '48%' }}>
                            <Text style={[labelEstilo2, { marginBottom: 4 }]}>O ESCRIBIR ID</Text>
                            <CustomInputText 
                                placeholder="SteamID..." 
                                value={inputLibraryUserId} // ✅ Vinculado al nuevo estado
                                isAdmin={true} 
                                onChangeText={setInputLibraryUserId} // ✅ Setter correcto
                            />
                        </View>
                    </View>

                    {/* 3. BOTÓN (Fila Inferior al 100%) */}
                    <View style={{ width: '100%' }}>
                        {estaCargando ? (
                            <ActivityIndicator color="gold" size="small" />
                        ) : (
                            <CustomButton 
                                title="EJECUTAR BÚSQUEDA" 
                                onPress={buscarPeticion2} 
                                isAdmin={true} 
                            />
                        )}
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