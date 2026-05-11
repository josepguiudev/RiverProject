import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Alert, Image, SafeAreaView } from "react-native";
import { isWeb } from "@/app/utils/device";
import globalStyles from "@/assets/globalStyles/globalStyles";
import styles from './styles';
import MenuPrincipal from '@/app/components/Menu/CustomMenu';
import strings from "../../../assets/supportFiles/strings.json";
import CustomInputCard from '@/app/components/CustomInputCard/CustomInputCard';
import CustomButton from '@/app/components/CustomButton/CustomButton';
import stylesGlobal, { colors } from "../../screens/stylesGlobal";
import { Ionicons } from "@expo/vector-icons";

export default function AdminScreen({ navigation }: any) {
    const [menuVisible, setMenuVisible] = useState(false);
    const [usuariosEncontrados, setUsuariosEncontrados] = useState<any[]>([]);
    const [juegosEncontrados, setJuegosEncontrados] = useState<any[]>([]);
    const [juegoDetalle, setJuegoDetalle] = useState<any>(null);
    
    // --- Función auxiliar para la URL base (web vs Android) ---
    const getBaseUrl = () => {
        if (isWeb) return strings.parte2Desktop;
        return 'http://10.0.2.2:8080/';
    };

    // --- Guardar usuarios ---
    const guardarUsers = async () => {
        if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
            Alert.alert("Aviso", "Primero debes buscar usuarios.");
            return;
        }
        try {
            const url = `${getBaseUrl()}api/usersteam/register-multiple`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
    };

    // --- Guardar biblioteca de juegos ---
    const guardarBiblio = async () => {
        if (!juegosEncontrados.length || !usuariosEncontrados.length) {
            Alert.alert("Aviso", "Asegúrate de haber extraído el usuario y su biblioteca.");
            return;
        }
        try {
            const url = `${getBaseUrl()}api/games/save-steam-library`;
            const steamidOwner = usuariosEncontrados[0].steamid;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ steamid: steamidOwner, games: juegosEncontrados }),
            });
            const mensaje = await response.text();
            Alert.alert(response.ok ? "Éxito" : "Error", mensaje);
        } catch (error: any) {
            Alert.alert("Error", error);
        }
    };

    // --- Guardar detalles de un juego ---
    const guardarJuego = async () => {
        if (!juegoDetalle) {
            Alert.alert("Aviso", "Primero debes extraer los detalles de un juego.");
            return;
        }
        try {
            const url = `${getBaseUrl()}api/generes/save-game-details`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(juegoDetalle),
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
    };

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
    return (
        <SafeAreaView style={styles.androidSafeArea}>
            <ScrollView 
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <View style={styles.androidContainer}>
                    {/* Cabecera con botón de menú estilo SurveyListScreen */}
                    <View style={[stylesGlobal.row, { justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 8, width: '100%' }]}>
                        <TouchableOpacity 
                            onPress={() => setMenuVisible(true)} 
                            style={stylesGlobal.iconContainerAndroid}
                        >
                            <Ionicons name="menu-outline" size={32} color="white" />
                        </TouchableOpacity>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={[stylesGlobal.texto, { fontWeight: 'bold', color: colors.secondary, fontSize: 16 }]}>Admin</Text>
                        </View>
                    </View>

                    {/* Tarjeta 1: Extraer datos */}
                    <View style={[styles.androidSection, { marginBottom: 20 }]}>
                        <View style={styles.androidSectionHeader}>
                            <Text style={[styles.androidSectionTitle, { fontSize: 18 }]}>Extraer datos</Text>
                        </View>
                        <View style={[styles.androidCardsRow, { paddingVertical: 16, gap: 12 }]}>
                            <View style={styles.androidCardWrapper}>
                                <CustomInputCard title='Extraer Users' value={1} onResultFound={(data) => {
                                    const listaFinal = data.response?.players ? data.response.players : (Array.isArray(data) ? data : []); 
                                    setUsuariosEncontrados([...listaFinal])
                                }}/>
                            </View>
                            <View style={styles.androidCardWrapper}>
                                <CustomInputCard title='Extraer Juegos Bibliotecas' value={3} onResultFound={(data) => {
                                    setJuegosEncontrados([]);
                                    const listaJuegos = data.response?.games || (Array.isArray(data) ? data : []);
                                    setJuegosEncontrados([...listaJuegos])
                                }}/>
                            </View>
                            <View style={styles.androidCardWrapper}>
                                <CustomInputCard title='Extraer Juegos' value={2} onResultFound={(data) => setJuegoDetalle(data)}/>
                            </View>
                        </View>
                    </View>

                    {/* Sección Usuarios */}
                    <View style={[styles.androidSection, { marginBottom: 20 }]}>
                        <View style={styles.androidSectionHeader}>
                            <Text style={[styles.androidSectionTitle, { fontSize: 18 }]}>Resultado de búsqueda de usuario/s</Text>
                        </View>
                        <ScrollView 
                            style={{ maxHeight: 400, paddingHorizontal: 12, paddingVertical: 8 }} 
                            showsVerticalScrollIndicator={true}
                        >
                            {usuariosEncontrados && usuariosEncontrados.map((user: any, index: number) => (
                                <View key={user.steamid || index} style={[styles.androidUserCard, { marginBottom: 16 }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={{ uri: user.avatarfull }} style={[styles.androidUserAvatar, { borderColor: user.personastate === 1 ? '#66c0f4' : '#888', width: 70, height: 70 }]}/>
                                        <View style={{ marginLeft: 12, flex: 1 }}>
                                            <Text style={[styles.androidUserName, { fontSize: 18 }]}>{user.personaname}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                                                <View style={[styles.androidStatusDot, { backgroundColor: user.personastate === 1 ? '#66c0f4' : '#888', width: 10, height: 10 }]} />
                                                <Text style={[styles.androidStatusText, { fontSize: 13 }]}>{user.personastate === 1 ? 'En línea' : 'Desconectado'}</Text>
                                            </View>
                                            <Text style={[styles.androidUserId, { fontSize: 12 }]}>ID: {user.steamid}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.androidUserExtra, { marginTop: 12, paddingTop: 10 }]}>
                                        <Text style={[styles.androidExtraText, { fontSize: 12 }]}><Text style={{ fontWeight: 'bold' }}>País:</Text> {user.loccountrycode || 'N/A'}</Text>
                                        <Text style={[styles.androidExtraText, { fontSize: 12 }]}><Text style={{ fontWeight: 'bold' }}>Creado el:</Text> {new Date(user.timecreated * 1000).toLocaleDateString()}</Text>
                                        <Text style={[styles.androidExtraText, { color: '#66c0f4', fontSize: 12 }]} numberOfLines={2}>{user.profileurl}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                        <View style={[styles.androidButtonArea, { padding: 16 }]}>
                            <CustomButton title="Guardar usuario/s" onPress={guardarUsers} isAdmin={true} />
                        </View>
                    </View>

                    {/* Sección Bibliotecas */}
                    <View style={[styles.androidSection, { marginBottom: 20 }]}>
                        <View style={styles.androidSectionHeader}>
                            <Text style={[styles.androidSectionTitle, { fontSize: 18 }]}>Resultado biblioteca de usuario</Text>
                        </View>
                        <ScrollView 
                            style={{ maxHeight: 400, paddingHorizontal: 12, paddingVertical: 8 }} 
                            showsVerticalScrollIndicator={true}
                        >
                            {Array.isArray(juegosEncontrados) && juegosEncontrados.map((game: any, index: number) => {
                                const iconUrl = `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
                                return (
                                    <View key={game.appid || index} style={[styles.androidGameCard, { paddingVertical: 12, marginBottom: 12 }]}>
                                        <Image source={{ uri: iconUrl }} style={[styles.androidGameIcon, { width: 50, height: 50 }]} resizeMode="cover"/>
                                        <View style={styles.androidGameInfo}>
                                            <Text style={[styles.androidGameName, { fontSize: 15 }]} numberOfLines={2}>{game.name}</Text>
                                            <View style={styles.androidGameMeta}>
                                                <Text style={[styles.androidGameId, { fontSize: 11 }]}>ID: {game.appid}</Text>
                                                {game.playtime_forever !== undefined && <Text style={[styles.androidGameHours, { fontSize: 11 }]}>{Math.floor(game.playtime_forever / 60)}h</Text>}
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </ScrollView>
                        <View style={[styles.androidButtonArea, { padding: 16 }]}>
                            <CustomButton title="Guardar juegos" onPress={guardarBiblio} isAdmin={true} />
                        </View>
                    </View>

                    {/* Sección Juego Extraído */}
                    <View style={[styles.androidSection, { marginBottom: 20 }]}>
                        <View style={styles.androidSectionHeader}>
                            <Text style={[styles.androidSectionTitle, { fontSize: 18 }]}>Juego extraído</Text>
                        </View>
                        <ScrollView 
                            style={{ maxHeight: 400, paddingHorizontal: 12, paddingVertical: 8 }} 
                            showsVerticalScrollIndicator={true}
                        >
                            {juegoDetalle && Object.keys(juegoDetalle).map((key) => {
                                const gameData = juegoDetalle[key].data;
                                if (!gameData) return null;
                                return (
                                    <View key={key} style={[styles.androidDetailCard, { padding: 16, marginBottom: 12 }]}>
                                        {gameData.header_image && <Image source={{ uri: gameData.header_image }} style={[styles.androidDetailImage, { height: 160 }]} resizeMode="cover"/>}
                                        <Text style={[styles.androidDetailTitle, { fontSize: 20 }]}>{gameData.name}</Text>
                                        <Text style={[styles.androidDetailSub, { fontSize: 13 }]}>AppID: {gameData.steam_appid} | {gameData.type.toUpperCase()}</Text>
                                        <View style={{ marginBottom: 12 }}>
                                            <Text style={{ color: '#ccc', fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>Géneros:</Text>
                                            <View style={styles.androidGenresContainer}>
                                                {gameData.genres && gameData.genres.map((g: any, idx: number) => (
                                                    <View key={idx} style={[styles.androidGenreBadge, { paddingHorizontal: 12, paddingVertical: 6 }]}><Text style={[styles.androidGenreText, { fontSize: 12 }]}>{g.description}</Text></View>
                                                ))}
                                            </View>
                                        </View>
                                        <Text style={[styles.androidCategoriesText, { fontSize: 12, marginBottom: 12 }]}>Categorías: {gameData.categories?.map((c: any) => c.description).join(" • ")}</Text>
                                        <Text style={[styles.androidDescription, { fontSize: 12, lineHeight: 18 }]}>{gameData.short_description?.replace(/<[^>]*>?/gm, '')}</Text>
                                    </View>
                                );
                            })}
                        </ScrollView>
                        <View style={[styles.androidButtonArea, { padding: 16 }]}>
                            <CustomButton title="Guardar juego" onPress={guardarJuego} isAdmin={true} />
                        </View>
                    </View>

                    <MenuPrincipal visible={menuVisible} onClose={() => setMenuVisible(false)} />
                </View>
            </View>
        </View>

        </View>

        <MenuPrincipal visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />
    </View>
);
            </ScrollView>
        </SafeAreaView>
    );
}