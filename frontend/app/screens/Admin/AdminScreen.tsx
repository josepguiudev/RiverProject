import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Alert, Image } from "react-native";

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
    
    const guardarUsers = async () => {
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
        }
    }

    const guardarBiblio = async () => {
        console.log("clic biblio")
        if (!juegosEncontrados.length || !usuariosEncontrados.length) {
            Alert.alert("Aviso", "Asegúrate de haber extraído el usuario y su biblioteca.");
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
                    steamid: steamidOwner,      // <--- Enviamos el ID del dueño
                    games: juegosEncontrados    // <--- El array de juegos de Steam
                }),
            });

            const mensaje = await response.text();
            Alert.alert(response.ok ? "Éxito" : "Error", mensaje);

        } catch (error:any) {
            Alert.alert("Error", error);
        }
    }

    const guardarJuego = async () => {
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
        <View style={{ flex: 1, marginHorizontal: 5 }}>
            <CustomInputCard 
                title='Extraer Users' 
                value={1} 
                onResultFound={(data) => {
                    const listaFinal = data.response?.players ? data.response.players : (Array.isArray(data) ? data : []); 
                    setUsuariosEncontrados([...listaFinal]);
                }}
            />
            
            <View style={{ flex: 1, backgroundColor: '#0d1117', marginTop: 10, borderRadius: 8, borderWidth: 1, borderColor: '#30363d' }}>
                <Text style={[styles.label, { padding: 10, textAlign: 'center' }]}>Resultado de búsqueda</Text>
                
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
                    {usuariosEncontrados.map((user: any, index: number) => (
                        <View key={user.steamid || index} style={{ 
                            padding: 15, 
                            backgroundColor: '#1b2838', 
                            borderRadius: 8, 
                            marginBottom: 15,
                            borderWidth: 1,
                            borderColor: '#2a475e'
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {/* Avatar con borde de estado */}
                                <Image 
                                    source={{ uri: user.avatarfull }} 
                                    style={{ 
                                        width: 80, height: 80, borderRadius: 5, 
                                        borderWidth: 2, 
                                        borderColor: user.personastate === 1 ? '#66c0f4' : '#888' 
                                    }} 
                                />
                                <View style={{ marginLeft: 15, flex: 1 }}>
                                    <Text style={{ color: 'gold', fontWeight: 'bold', fontSize: 18 }}>{user.personaname}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: user.personastate === 1 ? '#66c0f4' : '#888', marginRight: 6 }} />
                                        <Text style={{ color: user.personastate === 1 ? '#66c0f4' : '#888', fontSize: 13 }}>
                                            {user.personastate === 1 ? 'En línea' : 'Desconectado'}
                                        </Text>
                                    </View>
                                    <Text style={{ color: '#aaa', fontSize: 11, marginTop: 5 }}>ID: {user.steamid}</Text>
                                </View>
                            </View>

                            {/* Línea divisoria y detalles adicionales */}
                            <View style={{ marginTop: 15, borderTopWidth: 1, borderTopColor: '#2a475e', paddingTop: 10 }}>
                                <Text style={{ color: '#ccc', fontSize: 12, marginBottom: 4 }}>
                                    <Text style={{ fontWeight: 'bold' }}>País:</Text> {user.loccountrycode || 'N/A'}
                                </Text>
                                <Text style={{ color: '#ccc', fontSize: 12, marginBottom: 8 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Creado el:</Text> {new Date(user.timecreated * 1000).toLocaleDateString()}
                                </Text>
                                <Text style={{ color: '#66c0f4', fontSize: 11, textDecorationLine: 'underline' }} numberOfLines={1}>
                                    {user.profileurl}
                                </Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                <View style={{ padding: 10 }}>
                    <CustomButton title="Guardar usuario/s" onPress={guardarUsers} isAdmin={true} />
                </View>
            </View>
        </View>

        {/* --- COLUMNA 2: BIBLIOTECAS --- */}
        <View style={{ flex: 1, marginHorizontal: 5 }}>
            <CustomInputCard 
                title='Extraer Bibliotecas' 
                value={3} 
                onResultFound={(data) => {
                    setJuegosEncontrados([]);
                    const listaJuegos = data.response?.games || (Array.isArray(data) ? data : []);
                    setJuegosEncontrados([...listaJuegos])
                }}
            />

            <View style={{ flex: 1, backgroundColor: '#0d1117', marginTop: 10, borderRadius: 8, borderWidth: 1, borderColor: '#30363d' }}>
                <Text style={[styles.label, { padding: 10, textAlign: 'center' }]}>Resultado biblioteca</Text>
                
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
                    {Array.isArray(juegosEncontrados) && juegosEncontrados.map((game: any, index: number) => {
                        const iconUrl = `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;

                        return (
                            <View key={game.appid || index} style={{ 
                                flexDirection: 'row', 
                                alignItems: 'center',
                                padding: 10, 
                                backgroundColor: '#1b2838', 
                                borderRadius: 6, 
                                marginBottom: 8,
                                borderLeftWidth: 4,
                                borderLeftColor: '#66c0f4'
                            }}>
                                <Image 
                                    source={{ uri: iconUrl }} 
                                    style={{ width: 42, height: 42, borderRadius: 4, backgroundColor: '#171a21' }}
                                    resizeMode="cover"
                                />
                                <View style={{ marginLeft: 12, flex: 1 }}>
                                    <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 13 }} numberOfLines={1}>
                                        {game.name}
                                    </Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                        <Text style={{ color: '#888', fontSize: 10 }}>ID: {game.appid}</Text>
                                        {game.playtime_forever !== undefined && (
                                            <Text style={{ color: '#66c0f4', fontSize: 10, fontWeight: '600' }}>
                                                {Math.floor(game.playtime_forever / 60)}h
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>

                <View style={{ padding: 10 }}>
                    <CustomButton title="Guardar juegos" onPress={guardarBiblio} isAdmin={true} />
                </View>
            </View>
            
        </View>

        {/* --- COLUMNA 3: JUEGO EXTRAÍDO --- */}
        <View style={{ flex: 1, marginHorizontal: 8, height: '100%' }}>
            {/* BUSCADOR */}
            <CustomInputCard title='Extraer Juegos' value={2} onResultFound={(data) => setJuegoDetalle(data)}/>

            {/* RESULTADO (Un solo contenedor principal) */}
            <View style={{ 
                flex: 1, 
                backgroundColor: '#0d1117', 
                borderRadius: 12, 
                borderWidth: 1, 
                borderColor: '#30363d', 
                overflow: 'hidden' 
            }}>
                <Text style={{ 
                    padding: 12, 
                    textAlign: 'center', 
                    backgroundColor: '#1b2838', // Color sólido para el encabezado
                    color: 'gold',
                    fontWeight: 'bold',
                    fontSize: 12,
                    letterSpacing: 1
                }}>
                    JUEGO EXTRAÍDO
                </Text>
                
                <ScrollView style={{ flex: 1 }}>
                    {juegoDetalle && Object.keys(juegoDetalle).map((key) => {
                        const gameData = juegoDetalle[key].data;
                        if (!gameData) return null;
                        return (
                            <View key={key} style={{ backgroundColor: '#171d25' }}>
                                <Image 
                                    source={{ uri: gameData.header_image }} 
                                    style={{ width: '100%', aspectRatio: 460 / 215, borderBottomWidth: 1, borderBottomColor: '#2a475e' }}
                                    resizeMode="contain"
                                />
                                <View style={{ padding: 20 }}>
                                    <Text style={{ color: '#fff', fontWeight: '900', fontSize: 22 }}>{gameData.name}</Text>
                                    <Text style={{ color: '#66c0f4', fontSize: 12, marginBottom: 15 }}>APP ID: {gameData.steam_appid}</Text>
                                    
                                    {/* Géneros */}
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {gameData.genres?.map((g: any, i: number) => (
                                            <View key={i} style={{ backgroundColor: '#2a475e', padding: 6, borderRadius: 4, marginRight: 6, marginBottom: 6 }}>
                                                <Text style={{ color: '#66c0f4', fontSize: 11, fontWeight: 'bold' }}>{g.description}</Text>
                                            </View>
                                        ))}
                                    </View>
                                    
                                    <View style={{ height: 1, backgroundColor: '#30363d', marginVertical: 15 }} />
                                    <Text style={{ color: '#dcdedf', fontSize: 13, lineHeight: 20, fontStyle: 'italic' }}>
                                        {gameData.short_description?.replace(/<[^>]*>?/gm, '')}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>

                <View style={{ padding: 15, borderTopWidth: 1, borderTopColor: '#30363d', backgroundColor: '#0d1117' }}>
                    <CustomButton title="Guardar juego en BD" onPress={guardarJuego} isAdmin={true} />
                </View>
            </View>
        </View>

        </View>

        <MenuPrincipal visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />
    </View>
);
}