import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Alert, Image, ActivityIndicator } from "react-native";

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
    const [juegoDetalle, setJuegoDetalle] = useState<any>(null);

    const [estaCargando, setEstaCargando] = useState(false);
    const [estaCargando2, setEstaCargando2] = useState(false);
    const [estaCargando3, setEstaCargando3] = useState(false);

    const [steamIdBibliotecaActiva, setSteamIdBibliotecaActiva] = useState("");
    
    const guardarUsers = async () => {
        setEstaCargando(true);

        if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
            Alert.alert("Aviso", "Primero debes buscar usuarios.");
            return;
        }
        try {
            const url = `${strings.parte2Desktop}api/usersteam/register-multiple`;           
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuariosEncontrados),
            });

            const mensaje = await response.text();
            if (response.ok) {
                Alert.alert("Éxito", "Los usuarios se han guardado/procesado en la base de datos.");
            } else {
                throw new Error(mensaje || "Error al guardar la lista.");
            }
        } catch (error) {
            console.error("Error al guardar usuarios:", error);
            Alert.alert("Error", "No se pudo conectar con el servidor.");
        }finally {
            setEstaCargando(false);
        }
    }

    const guardarBiblio = async () => {
        setEstaCargando2(true);
        console.log("clic biblio")
        if (!steamIdBibliotecaActiva || juegosEncontrados.length === 0) {
            Alert.alert("Error", "No hay ninguna biblioteca cargada para guardar.");
            return;
        }

        try {
            const url = `${strings.parte2Desktop}api/games/save-steam-library`;
            // Tomamos el steamid del primer usuario de la lista encontrada
            const steamidOwner = usuariosEncontrados[0].steamid;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    steamid: steamIdBibliotecaActiva,      // <--- Enviamos el ID del dueño
                    games: juegosEncontrados    // <--- El array de juegos de Steam
                }),
            });

            const mensaje = await response.text();
            Alert.alert(response.ok ? "Éxito" : "Error", mensaje);

        } catch (error:any) {
            Alert.alert("Error", error);
        }finally {
            setEstaCargando2(false);
        }
    }

    const guardarJuego = async () => {
        setEstaCargando3(true);
        console.log("clic juego")
            if (!juegoDetalle) {
            Alert.alert("Aviso", "Primero debes extraer los detalles de un juego.");
            return;
        }

        try {
            // La URL de tu nuevo controlador (ajusta según tus strings)
            const url = `${strings.parte2Desktop}api/generes/save-game-details`;

            const response = await fetch(url, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(juegoDetalle), // Enviamos el JSON tal cual lo dio Steam
            });

            const mensaje = await response.text();

            if (response.ok) {
                Alert.alert("Éxito", "Géneros y detalles guardados correctamente.");
            } else {
                throw new Error(mensaje || "Error al guardar los géneros.");
            }

        } catch (error) {
            console.error("Error al guardar juego:", error);
            Alert.alert("Error", "No se pudo conectar con el servidor.");
        }finally {
            setEstaCargando3(false);
        }
    }

    return (
    <View style={[globalStyles.padre, { flex: 1, backgroundColor: '#000' }]}>
        
        {/* 1. HEADER */}
        <View style={[globalStyles.cajaMenu, globalStyles.borde, { height: 60, justifyContent: 'center', paddingHorizontal: 20 }]}>
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{strings.menu}</Text>
            </TouchableOpacity>
        </View>

        {/* 2. AREA DE COLUMNAS (Ocupa el resto de la pantalla) */}
        <View style={{ flex: 1, flexDirection: 'row', padding: 15, gap: 15 }}>
            {/* IMPORTANTE: flex: 1 para que el contenedor se estire y deje ver el contenido */}
            {/* --- COLUMNA 1: USUARIOS --- */}
            <View style={{ flex: 1, marginHorizontal: 8, height: '100%' }}>
                <CustomInputCard title='Extraer Users' value={1} onResultFound={(data) => {
                    const listaFinal = data.response?.players ? data.response.players : (Array.isArray(data) ? data : []); 
                    setUsuariosEncontrados([...listaFinal]);
                }}/>

                <View style={{ flex: 1, backgroundColor: '#0d1117', marginTop: 10, borderRadius: 12, borderWidth: 1, borderColor: '#30363d', overflow: 'hidden' }}>
                    <View style={{ backgroundColor: '#1b2838', padding: 12 }}>
                        <Text style={{ textAlign: 'center', color: 'gold', fontWeight: 'bold', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' }}>
                            Resultado de búsqueda
                        </Text>
                    </View>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
                        {usuariosEncontrados.map((user: any, index: number) => (
                            <View key={user.steamid || index} style={{ padding: 15, backgroundColor: '#1b2838', borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#2a475e' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={{ uri: user.avatarfull }} style={{ width: 80, height: 80, borderRadius: 5, borderWidth: 2, borderColor: user.personastate === 1 ? '#66c0f4' : '#888' }} />
                                    <View style={{ marginLeft: 15, flex: 1 }}>
                                        <Text style={{ color: 'gold', fontWeight: 'bold', fontSize: 18 }}>{user.personaname}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: user.personastate === 1 ? '#66c0f4' : '#888', marginRight: 6 }} />
                                            <Text style={{ color: user.personastate === 1 ? '#66c0f4' : '#888', fontSize: 13 }}>{user.personastate === 1 ? 'En línea' : 'Desconectado'}</Text>
                                        </View>
                                        <Text style={{ color: '#aaa', fontSize: 11, marginTop: 5 }}>ID: {user.steamid}</Text>
                                    </View>
                                </View>
                                <View style={{ marginTop: 15, borderTopWidth: 1, borderTopColor: '#2a475e', paddingTop: 10 }}>
                                    <Text style={{ color: '#ccc', fontSize: 12 }}>País: {user.loccountrycode || 'N/A'}</Text>
                                    <Text style={{ color: '#ccc', fontSize: 12 }}>Creado el: {new Date(user.timecreated * 1000).toLocaleDateString()}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                    <View style={{ padding: 15, borderTopWidth: 1, borderTopColor: '#30363d', backgroundColor: '#0d1117' }}>
                        {estaCargando ? (
                            <ActivityIndicator color="gold" size="large" />
                        ) : (
                            <CustomButton title="Guardar usuario/s" onPress={guardarUsers} isAdmin={true} />
                        )}
                    </View>
                </View>
            </View>

            {/* --- COLUMNA 2: BIBLIOTECAS --- */}
            <View style={{ flex: 1, marginHorizontal: 8, height: '100%' }}>
                <CustomInputCard title='Extraer Bibliotecas' value={3} onResultFound={(responseObj: any) => {
                    setJuegosEncontrados([]);
                    const listaJuegos = responseObj?.games || [];
                    setJuegosEncontrados([...listaJuegos]);

                    if (responseObj?.steamid) {
                        setSteamIdBibliotecaActiva(responseObj.steamid);
                    }
                }}/>

                <View style={{ flex: 1, backgroundColor: '#0d1117', marginTop: 10, borderRadius: 12, borderWidth: 1, borderColor: '#30363d', overflow: 'hidden' }}>
                    <View style={{ backgroundColor: '#1b2838', padding: 12 }}>
                        <Text style={{ textAlign: 'center', color: 'gold', fontWeight: 'bold', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' }}>
                            Resultado biblioteca
                        </Text>
                    </View>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
                        {juegosEncontrados.map((game: any, index: number) => (
                            <View key={game.appid || index} style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#1b2838', borderRadius: 8, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: '#66c0f4' }}>
                                <Image 
                                    source={{ uri: `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg` }} 
                                    style={{ width: 32, height: 32, borderRadius: 4 }} 
                                />
                                <View style={{ marginLeft: 12, flex: 1 }}>
                                    <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }} numberOfLines={1}>
                                        {game.name}
                                    </Text>
                                    
                                    {/* Añadimos el ID del juego aquí abajo */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                                        <Text style={{ color: '#888', fontSize: 10 }}>
                                            ID: {game.appid}
                                        </Text>
                                        <Text style={{ color: '#66c0f4', fontSize: 10 }}>
                                            {Math.floor(game.playtime_forever / 60)}h jugadas
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                    <View style={{ padding: 15, borderTopWidth: 1, borderTopColor: '#30363d', backgroundColor: '#0d1117' }}>
                        {estaCargando2 ? (
                            <ActivityIndicator color="gold" size="large" />
                        ) : (
                            <CustomButton title="Guardar biblioteca" onPress={guardarBiblio} isAdmin={true} />
                        )}
                    </View>
                </View>
            </View>

            {/* --- COLUMNA 3: JUEGO EXTRAÍDO --- */}
            <View style={{ flex: 1, marginHorizontal: 8, height: '100%' }}>
                <CustomInputCard title='Extraer Juegos' value={2} onResultFound={(data) => setJuegoDetalle(data)}/>
                <View style={{ flex: 1, backgroundColor: '#0d1117', marginTop: 10, borderRadius: 12, borderWidth: 1, borderColor: '#30363d', overflow: 'hidden' }}>
                    <View style={{ backgroundColor: '#1b2838', padding: 12 }}>
                        <Text style={{ textAlign: 'center', color: 'gold', fontWeight: 'bold', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' }}>
                            Juego Extraído
                        </Text>
                    </View>
                    <ScrollView style={{ flex: 1 }}>
                        {juegoDetalle && Object.keys(juegoDetalle).map((key) => {
                            const gameData = juegoDetalle[key].data;
                            if (!gameData) return null;
                            return (
                                <View key={key} style={{ backgroundColor: '#171d25' }}>
                                    <Image source={{ uri: gameData.header_image }} style={{ width: '100%', aspectRatio: 460 / 215, borderBottomWidth: 1 }} resizeMode="contain" />
                                    <View style={{ padding: 20 }}>
                                        <Text style={{ color: '#fff', fontWeight: '900', fontSize: 22 }}>{gameData.name}</Text>
                                        <Text style={{ color: '#66c0f4', fontSize: 12, marginBottom: 15 }}>APP ID: {gameData.steam_appid}</Text>
                                        <Text style={{ color: '#dcdedf', fontSize: 13, lineHeight: 20 }}>{gameData.short_description?.replace(/<[^>]*>?/gm, '')}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>
                    <View style={{ padding: 15, borderTopWidth: 1, borderTopColor: '#30363d', backgroundColor: '#0d1117' }}>
                        {estaCargando3 ? (
                            <ActivityIndicator color="gold" size="large" />
                        ) : (
                            <CustomButton title="Guardar juego en BD" onPress={guardarJuego} isAdmin={true} />
                        )}
                    </View>
                </View>
            </View>                       
        </View>

        <MenuPrincipal visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />
    </View>
);
}