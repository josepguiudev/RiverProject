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
        <View style={[globalStyles.padre, globalStyles.tamanoCajaPadre]}>
            {/* 1. HEADER / BOTÓN MENU */}
            <View style={[globalStyles.cajaMenu, globalStyles.alineadoPersonalVertical]}>
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 20 }}>
                    <Text style={{ color: 'white' }}>{strings.menu}</Text>
                </TouchableOpacity>
            </View>

            <View style={[globalStyles.padre, globalStyles.tamanoCajaPadre, globalStyles.alineadoPersonal]}>
                <View style={[styles.cajaPrincipal, globalStyles.filas]}>
                    <View style={[styles.contenedorFila, globalStyles.alineadoPersonalHorizontal]}>
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
                        <CustomInputCard title='Extraer Juegos' value={2} onResultFound={(data) => setJuegoDetalle(data)}/>
                    </View>
                    <View style={[styles.contenedorFila2, styles.contenedorVertical]}>
                        <View style={[styles.contenedorUserTittleButton]}>
                            <Text style={[styles.label]}>Resultado de búsqueda de usuario/s</Text>
                        </View>
                        <View style={[styles.contenedorUserTittleButton, {height: "84%"}, styles.contenedorVertical]}>
                            
                            <ScrollView
                                style={[styles.scrollView, { width: '100%'}]}
                                contentContainerStyle={styles.contentContainer}
                                showsVerticalScrollIndicator={false} // Para un look más limpio
                                bounces={true} // Efecto de rebote moderno (iOS)
                            >
                                {/*{Array.isArray(usuariosEncontrados) && usuariosEncontrados.map((item: any, index: number) => ( */}
                                {/*    <Text key={item.steamid || index} style={{color: 'white', padding: 5}}> */}
                                {/*        {item.personaname} {/* <-- Cambiado de description a personaname */}
                                {/*    </Text> */}
                                {/* ))} */}
                                {usuariosEncontrados && usuariosEncontrados.map((user: any, index: number) => (
                                    <View key={user.steamid || index} style={{ 
                                        padding: 15, 
                                        backgroundColor: '#1b2838', 
                                        borderRadius: 8, 
                                        marginBottom: 15,
                                        borderWidth: 1,
                                        borderColor: '#2a475e'
                                    }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {/* Avatar del Usuario */}
                                            <Image 
                                                source={{ uri: user.avatarfull }} 
                                                style={{ width: 80, height: 80, borderRadius: 5, borderWidth: 2, borderColor: user.personastate === 1 ? '#66c0f4' : '#888' }}
                                            />
                                            
                                            <View style={{ marginLeft: 15, flex: 1 }}>
                                                <Text style={{ color: 'gold', fontWeight: 'bold', fontSize: 18 }}>
                                                    {user.personaname}
                                                </Text>
                                                
                                                {/* Estado Online/Offline */}
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                                    <View style={{ 
                                                        width: 10, 
                                                        height: 10, 
                                                        borderRadius: 5, 
                                                        backgroundColor: user.personastate === 1 ? '#66c0f4' : '#888',
                                                        marginRight: 5 
                                                    }} />
                                                    <Text style={{ color: user.personastate === 1 ? '#66c0f4' : '#888', fontSize: 12 }}>
                                                        {user.personastate === 1 ? 'En línea' : 'Desconectado'}
                                                    </Text>
                                                </View>

                                                <Text style={{ color: '#aaa', fontSize: 11, marginTop: 5 }}>
                                                    ID: {user.steamid}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Detalles adicionales del perfil */}
                                        <View style={{ marginTop: 15, borderTopWidth: 1, borderTopColor: '#2a475e', paddingTop: 10 }}>
                                            <Text style={{ color: '#ccc', fontSize: 11, marginBottom: 5 }}>
                                                <Text style={{ fontWeight: 'bold' }}>País:</Text> {user.loccountrycode || 'N/A'}
                                            </Text>
                                            <Text style={{ color: '#ccc', fontSize: 11, marginBottom: 5 }}>
                                                <Text style={{ fontWeight: 'bold' }}>Creado el:</Text> {new Date(user.timecreated * 1000).toLocaleDateString()}
                                            </Text>
                                            
                                            {/* Enlace al perfil (Texto) */}
                                            <Text 
                                                style={{ color: '#66c0f4', fontSize: 11, marginTop: 5, textDecorationLine: 'underline' }}
                                                numberOfLines={1}
                                            >
                                                {user.profileurl}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>

                        </View>
                        <View style={[styles.contenedorUserTittleButton]}>
                            <CustomButton title="Guardar usuario/s" onPress={guardarUsers} isAdmin={true} />
                        </View>
                    </View>
                    <View style={[styles.contenedorFila2, styles.contenedorVertical]}>
                        <View style={[styles.contenedorUserTittleButton]}>
                            <Text style={[styles.label]}>Resultado biblioteca de usuario</Text>
                        </View>
                        <View style={[styles.contenedorUserTittleButton, {height: "84%"}, styles.contenedorVertical]}>
                            
                            <ScrollView
                                style={[styles.scrollView, { width: '100%'}]}
                                contentContainerStyle={styles.contentContainer}
                                showsVerticalScrollIndicator={false} // Para un look más limpio
                                bounces={true} // Efecto de rebote moderno (iOS)
                                >
                                {Array.isArray(juegosEncontrados) && juegosEncontrados.map((game: any, index: number) => {
                                // La URL oficial requiere el AppID y el HASH que viene en img_icon_url
                                // Si img_icon_url está vacío, usamos un placeholder
    
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
                                        {/* Icono del Juego */}
                                        <Image 
                                            source={{ uri: iconUrl }} 
                                            style={{ 
                                                width: 42, 
                                                height: 42, 
                                                borderRadius: 4, 
                                                backgroundColor: '#171a21' // Fondo oscuro mientras carga
                                            }}
                                            resizeMode="cover"
                                        />

                                        <View style={{ marginLeft: 12, flex: 1 }}>
                                            <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 13 }} numberOfLines={1}>
                                                {game.name}
                                            </Text>
                                            
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                                <Text style={{ color: '#888', fontSize: 10 }}>
                                                    ID: {game.appid}
                                                </Text>
                                                
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

                        </View>
                        <View style={[styles.contenedorUserTittleButton]}>
                            <CustomButton title="Guardar juegos" onPress={guardarBiblio} isAdmin={true} />
                        </View>
                    </View>
                    <View style={[styles.contenedorFila2, styles.contenedorVertical]}>
                        <View style={[styles.contenedorUserTittleButton]}>
                            <Text style={[styles.label]}>Juego extraído</Text>
                        </View>
                        <View style={[styles.contenedorUserTittleButton, {height: "84%"}, styles.contenedorVertical]}>
                                <ScrollView
                                    style={[styles.scrollView, { width: '100%'}]}
                                    contentContainerStyle={styles.contentContainer}
                                    showsVerticalScrollIndicator={false} // Para un look más limpio
                                    bounces={true} // Efecto de rebote moderno (iOS)
                                >
                                    {juegoDetalle && Object.keys(juegoDetalle).map((key) => {
                                        const gameData = juegoDetalle[key].data;
                                        if (!gameData) return null;

                                        // Esto te dirá en la consola del PC qué géneros le llegan al render
                                        console.log(`Renderizando ${gameData.name}. Géneros:`, gameData.genres);

                                        return (
                                            <View key={key} style={{ padding: 15 }}>
                                                {/* Imagen del Juego */}
                                                {gameData.header_image && (
                                                    <Image 
                                                        source={{ uri: gameData.header_image }} 
                                                        style={{ width: '100%', height: 120, borderRadius: 8, marginBottom: 10 }}
                                                        resizeMode="cover"
                                                    />
                                                )}

                                                <Text style={{ color: 'gold', fontWeight: 'bold', fontSize: 18 }}>
                                                    {gameData.name}
                                                </Text>
                                                
                                                <Text style={{ color: '#888', fontSize: 12, marginBottom: 10 }}>
                                                    AppID: {gameData.steam_appid} | {gameData.type.toUpperCase()}
                                                </Text>

                                                {/* SECCIÓN DE GÉNEROS CON MAP SEGURO */}
                                                <View style={{ marginBottom: 10 }}>
                                                    <Text style={{ color: '#ccc', fontSize: 13, fontWeight: 'bold', marginBottom: 5 }}>Géneros:</Text>
                                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        {gameData.genres && gameData.genres.map((g: any, index: number) => (
                                                            <View key={`genre-${index}`} style={{ backgroundColor: '#2a475e', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginRight: 6, marginBottom: 6 }}>
                                                                <Text style={{ color: '#66c0f4', fontSize: 11, fontWeight: 'bold' }}>
                                                                    {g.description}
                                                                </Text>
                                                            </View>
                                                        ))}
                                                    </View>
                                                </View>

                                                {/* CATEGORÍAS */}
                                                <View style={{ marginBottom: 10 }}>
                                                    <Text style={{ color: '#ccc', fontSize: 13, fontWeight: 'bold', marginBottom: 5 }}>Categorías:</Text>
                                                    <Text style={{ color: '#5dade2', fontSize: 11 }}>
                                                        {gameData.categories?.map((c: any) => c.description).join(" • ")}
                                                    </Text>
                                                </View>

                                                {/* DESCRIPCIÓN */}
                                                <Text style={{ color: '#aaa', fontSize: 11, fontStyle: 'italic', marginTop: 10, lineHeight: 16 }}>
                                                    {gameData.short_description?.replace(/<[^>]*>?/gm, '')}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </ScrollView>
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