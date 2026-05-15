import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Alert, Image, SafeAreaView, ActivityIndicator } from "react-native";
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
    const [estaCargando, setEstaCargando] = useState(false);

    const [estaCargando, setEstaCargando] = useState(false);
    const [estaCargando2, setEstaCargando2] = useState(false);
    const [estaCargando3, setEstaCargando3] = useState(false);

    const [steamIdBibliotecaActiva, setSteamIdBibliotecaActiva] = useState("");
    
    // --- Función auxiliar para la URL base (web vs Android) ---
    const getBaseUrl = () => {
        if (isWeb) return strings.parte2Desktop;
        return 'http://10.0.2.2:8080/';
    };

    // --- Guardar usuarios ---
    const guardarUsers = async () => {
        setEstaCargando(true);
        if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
            Alert.alert("Aviso", "Primero debes buscar usuarios.");
            setEstaCargando(false);
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
        } finally {
            setEstaCargando(false);
        }
    };

    // --- Guardar biblioteca de juegos ---
    const guardarBiblio = async () => {
        setEstaCargando2(true);
        console.log("clic biblio")
        if (!steamIdBibliotecaActiva || juegosEncontrados.length === 0) {
            Alert.alert("Error", "No hay ninguna biblioteca cargada para guardar.");
        setEstaCargando(true);
        if (!juegosEncontrados.length || !usuariosEncontrados.length) {
            Alert.alert("Aviso", "Asegúrate de haber extraído el usuario y su biblioteca.");
            setEstaCargando(false);
            return;
        }
        try {
            const url = `${getBaseUrl()}api/games/save-steam-library`;
            const steamidOwner = usuariosEncontrados[0].steamid;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    steamid: steamIdBibliotecaActiva,      // <--- Enviamos el ID del dueño
                    games: juegosEncontrados    // <--- El array de juegos de Steam
                }),
                body: JSON.stringify({ steamid: steamidOwner, games: juegosEncontrados }),
            });
            const mensaje = await response.text();
            Alert.alert(response.ok ? "Éxito" : "Error", mensaje);
        } catch (error: any) {
            Alert.alert("Error", error);
        }finally {
            setEstaCargando2(false);
        } finally {
            setEstaCargando(false);
        }
    };

    // --- Guardar detalles de un juego ---
    const guardarJuego = async () => {
        setEstaCargando3(true);
        console.log("clic juego")
            if (!juegoDetalle) {
        setEstaCargando(true);
        if (!juegoDetalle) {
            Alert.alert("Aviso", "Primero debes extraer los detalles de un juego.");
            setEstaCargando(false);
            return;
        }
        try {
            const url = `${getBaseUrl()}api/generes/save-game-details`;
            const response = await fetch(url, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(juegoDetalle), // Enviamos el JSON tal cual lo dio Steam
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
        }finally {
            setEstaCargando3(false);
        } finally {
            setEstaCargando(false);
        }
    };

    return (
    <View style={[globalStyles.padre, { flex: 1, backgroundColor: '#000' }]}>
        
        {/* 1. HEADER */}
        <View style={[globalStyles.cajaMenu, { height: 60, justifyContent: 'center', paddingHorizontal: 20 }]}>
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{strings.menu}</Text>
            </TouchableOpacity>
        </View>
    // ============================================================
    //  VERSIÓN WEB (diseño mejorado de tu compañero)
    // ============================================================
    if (isWeb) {
        return (
            <View style={[globalStyles.padre, { flex: 1, backgroundColor: '#000' }]}>
                {/* HEADER */}
                <View style={[globalStyles.cajaMenu, { height: 60, justifyContent: 'center', paddingHorizontal: 20 }]}>
                    <TouchableOpacity onPress={() => setMenuVisible(true)}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{strings.menu}</Text>
                    </TouchableOpacity>
                </View>

                {/* ÁREA DE COLUMNAS */}
                <View style={{ flex: 1, flexDirection: 'row', padding: 15, gap: 15 }}>
                    {/* COLUMNA 1: USUARIOS */}
                    <View style={{ flex: 1, marginHorizontal: 8 }}>
                        <CustomInputCard
                            title='Extraer Users'
                            value={1}
                            onResultFound={(data) => {
                                const listaFinal = data.response?.players ? data.response.players : (Array.isArray(data) ? data : []);
                                setUsuariosEncontrados([...listaFinal]);
                            }}
                        />
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

                    {/* COLUMNA 2: BIBLIOTECAS */}
                    <View style={{ flex: 1, marginHorizontal: 8 }}>
                        <CustomInputCard
                            title='Extraer Bibliotecas'
                            value={3}
                            onResultFound={(data) => {
                                const listaJuegos = data.response?.games || (Array.isArray(data) ? data : []);
                                setJuegosEncontrados([...listaJuegos]);
                            }}
                        />
                        <View style={{ flex: 1, backgroundColor: '#0d1117', marginTop: 10, borderRadius: 12, borderWidth: 1, borderColor: '#30363d', overflow: 'hidden' }}>
                            <View style={{ backgroundColor: '#1b2838', padding: 12 }}>
                                <Text style={{ textAlign: 'center', color: 'gold', fontWeight: 'bold', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' }}>
                                    Resultado biblioteca
                                </Text>
                            </View>
                            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
                                {juegosEncontrados.map((game: any, index: number) => (
                                    <View key={game.appid || index} style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#1b2838', borderRadius: 8, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: '#66c0f4' }}>
                                        <Image source={{ uri: `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg` }} style={{ width: 32, height: 32, borderRadius: 4 }} />
                                        <View style={{ marginLeft: 12, flex: 1 }}>
                                            <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }} numberOfLines={1}>{game.name}</Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                                                <Text style={{ color: '#888', fontSize: 10 }}>ID: {game.appid}</Text>
                                                <Text style={{ color: '#66c0f4', fontSize: 10 }}>{Math.floor(game.playtime_forever / 60)}h jugadas</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                            <View style={{ padding: 15, borderTopWidth: 1, borderTopColor: '#30363d', backgroundColor: '#0d1117' }}>
                                {estaCargando ? (
                                    <ActivityIndicator color="gold" size="large" />
                                ) : (
                                    <CustomButton title="Guardar biblioteca" onPress={guardarBiblio} isAdmin={true} />
                                )}
                            </View>
                        </View>
                    </View>

                    {/* COLUMNA 3: JUEGO EXTRAÍDO */}
                    <View style={{ flex: 1, marginHorizontal: 8 }}>
                        <CustomInputCard title='Extraer Juegos' value={2} onResultFound={(data) => setJuegoDetalle(data)} />
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
                                        <View style={{ borderBottomWidth: 1, borderBottomColor: '#2a475e' }}>
                                            <Image 
                                                source={{ uri: gameData.header_image }} 
                                                style={{ width: '100%', aspectRatio: 460 / 215 }}
                                                resizeMode="contain" 
                                            />
                                        </View>                                            
                                        <View style={{ padding: 20 }}>
                                                <Text style={{ color: '#fff', fontWeight: '900', fontSize: 22 }}>{gameData.name}</Text>
                                                <Text style={{ color: '#66c0f4', fontSize: 12, marginBottom: 15 }}>APP ID: {gameData.steam_appid}</Text>
                                                <Text style={{ color: '#dcdedf', fontSize: 13, lineHeight: 20 }}>{gameData.short_description?.replace(/<[^>]*>?/gm, '')}</Text>
                                                {gameData.genres && (
                                                    <View style={{ marginTop: 12 }}>
                                                        <Text style={{ color: '#f0f0f0', fontSize: 12, fontWeight: 'bold' }}>Géneros:</Text>
                                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
                                                            {gameData.genres.map((g: any, idx: number) => (
                                                                <View key={idx} style={{ backgroundColor: '#2a475e', padding: 6, borderRadius: 4, marginRight: 6, marginBottom: 6 }}>
                                                                    <Text style={{ color: '#66c0f4', fontSize: 11 }}>{g.description}</Text>
                                                                </View>
                                                            ))}
                                                        </View>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                            <View style={{ padding: 15, borderTopWidth: 1, borderTopColor: '#30363d', backgroundColor: '#0d1117' }}>
                                {estaCargando ? (
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
    // ============================================================
    //  VERSIÓN ANDROID (diseño táctil, scrollable, todas las features)
    // ============================================================
    return (
  <SafeAreaView style={styles.androidSafeArea}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.androidContainer}>
        {/* Cabecera con menú */}
        <View style={[stylesGlobal.row, { justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 16, width: '100%' }]}>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={stylesGlobal.iconContainerAndroid}>
            <Ionicons name="menu-outline" size={32} color="white" />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[stylesGlobal.texto, { fontWeight: 'bold', color: colors.secondary, fontSize: 18 }]}>Administración</Text>
          </View>
        </View>

        {/* Tarjeta 1: Extraer datos (tres botones) */}
        <View style={[styles.androidSection, { marginBottom: 24, borderRadius: 20 }]}>
          <View style={styles.androidSectionHeader}>
            <Text style={[styles.androidSectionTitle, { fontSize: 20, fontWeight: 'bold' }]}>Extraer datos</Text>
          </View>
          <View style={{ padding: 16, gap: 16 }}>
            <CustomInputCard title='Extraer Users' value={1} onResultFound={(data) => {
              const listaFinal = data.response?.players ? data.response.players : (Array.isArray(data) ? data : []);
              setUsuariosEncontrados([...listaFinal]);
            }} />
            <CustomInputCard title='Extraer Juegos Bibliotecas' value={3} onResultFound={(data) => {
              setJuegosEncontrados([]);
              const listaJuegos = data.response?.games || (Array.isArray(data) ? data : []);
              setJuegosEncontrados([...listaJuegos]);
            }} />
            <CustomInputCard title='Extraer Juegos' value={2} onResultFound={(data) => setJuegoDetalle(data)} />
          </View>
        </View>

        {/* Sección Usuarios */}
        <View style={[styles.androidSection, { marginBottom: 24, borderRadius: 20 }]}>
          <View style={styles.androidSectionHeader}>
            <Text style={[styles.androidSectionTitle, { fontSize: 20, fontWeight: 'bold' }]}>Resultado de búsqueda de usuario/s</Text>
          </View>
          <ScrollView style={{ maxHeight: 350, paddingHorizontal: 12, paddingVertical: 8 }} showsVerticalScrollIndicator={true}>
            {usuariosEncontrados && usuariosEncontrados.map((user: any, index: number) => (
              <View key={user.steamid || index} style={[styles.androidUserCard, { marginBottom: 16, padding: 16, borderRadius: 16 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={{ uri: user.avatarfull }} style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: user.personastate === 1 ? '#66c0f4' : '#888' }} />
                  <View style={{ marginLeft: 16, flex: 1 }}>
                    <Text style={[styles.androidUserName, { fontSize: 20, fontWeight: 'bold' }]}>{user.personaname}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: user.personastate === 1 ? '#66c0f4' : '#888', marginRight: 6 }} />
                      <Text style={{ fontSize: 14, color: user.personastate === 1 ? '#66c0f4' : '#aaa' }}>
                        {user.personastate === 1 ? 'En línea' : 'Desconectado'}
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
                    <Text style={{ marginTop: 6, fontSize: 13, color: '#aaa' }}>ID: {user.steamid}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#2a475e' }}>
                  <Text style={{ fontSize: 14, color: '#ccc' }}><Text style={{ fontWeight: 'bold' }}>País:</Text> {user.loccountrycode || 'N/A'}</Text>
                  <Text style={{ fontSize: 14, color: '#ccc', marginTop: 4 }}>
                    <Text style={{ fontWeight: 'bold' }}>Creado el:</Text> {new Date(user.timecreated * 1000).toLocaleDateString()}
                  </Text>
                  <Text style={{ marginTop: 8, fontSize: 12, color: '#66c0f4' }} numberOfLines={2}>{user.profileurl}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#30363d' }}>
            {estaCargando ? <ActivityIndicator color={colors.secondary} size="large" /> : <CustomButton title="GUARDAR USUARIO/S" onPress={guardarUsers} isAdmin={true} />}
          </View>
        </View>

        {/* Sección Bibliotecas */}
        <View style={[styles.androidSection, { marginBottom: 24, borderRadius: 20 }]}>
          <View style={styles.androidSectionHeader}>
            <Text style={[styles.androidSectionTitle, { fontSize: 20, fontWeight: 'bold' }]}>Resultado biblioteca de usuario</Text>
          </View>
          <ScrollView style={{ maxHeight: 350, paddingHorizontal: 12, paddingVertical: 8 }} showsVerticalScrollIndicator={true}>
            {Array.isArray(juegosEncontrados) && juegosEncontrados.map((game: any, index: number) => {
              const iconUrl = `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
              return (
                <View key={game.appid || index} style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#1b2838', borderRadius: 12, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#66c0f4' }}>
                  <Image source={{ uri: iconUrl }} style={{ width: 50, height: 50, borderRadius: 8 }} resizeMode="cover" />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }} numberOfLines={2}>{game.name}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                      <Text style={{ fontSize: 12, color: '#aaa' }}>ID: {game.appid}</Text>
                      {game.playtime_forever !== undefined && <Text style={{ fontSize: 12, color: '#66c0f4', fontWeight: 'bold' }}>{Math.floor(game.playtime_forever / 60)}h</Text>}
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
          <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#30363d' }}>
            {estaCargando ? <ActivityIndicator color={colors.secondary} size="large" /> : <CustomButton title="GUARDAR JUEGOS" onPress={guardarBiblio} isAdmin={true} />}
          </View>
        </View>

        {/* Sección Juego Extraído */}
        <View style={[styles.androidSection, { marginBottom: 24, borderRadius: 20 }]}>
          <View style={styles.androidSectionHeader}>
            <Text style={[styles.androidSectionTitle, { fontSize: 20, fontWeight: 'bold' }]}>Juego extraído</Text>
          </View>
          <ScrollView style={{ maxHeight: 350, paddingHorizontal: 12, paddingVertical: 8 }} showsVerticalScrollIndicator={true}>
            {juegoDetalle && Object.keys(juegoDetalle).map((key) => {
              const gameData = juegoDetalle[key].data;
              if (!gameData) return null;
              return (
                <View key={key} style={{ padding: 16, marginBottom: 16, backgroundColor: '#171d25', borderRadius: 16 }}>
                  {gameData.header_image && <Image source={{ uri: gameData.header_image }} style={{ width: '100%', height: 180, borderRadius: 12 }} resizeMode="cover" />}
                  <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'gold', marginTop: 12 }}>{gameData.name}</Text>
                  <Text style={{ fontSize: 14, color: '#66c0f4', marginBottom: 12 }}>AppID: {gameData.steam_appid} | {gameData.type.toUpperCase()}</Text>
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ccc', marginBottom: 6 }}>Géneros:</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                      {gameData.genres && gameData.genres.map((g: any, idx: number) => (
                        <View key={idx} style={{ backgroundColor: '#2a475e', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                          <Text style={{ fontSize: 12, color: '#66c0f4', fontWeight: 'bold' }}>{g.description}</Text>
                        </View>
                      ))}
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
                  <Text style={{ fontSize: 13, color: '#aaa', marginBottom: 12 }}>Categorías: {gameData.categories?.map((c: any) => c.description).join(" • ")}</Text>
                  <Text style={{ fontSize: 13, color: '#ddd', lineHeight: 20 }}>{gameData.short_description?.replace(/<[^>]*>?/gm, '')}</Text>
                </View>
              );
            })}
          </ScrollView>
          <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#30363d' }}>
            {estaCargando ? <ActivityIndicator color={colors.secondary} size="large" /> : <CustomButton title="GUARDAR JUEGO" onPress={guardarJuego} isAdmin={true} />}
          </View>
        </View>

        <MenuPrincipal visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />
      </View>
    </ScrollView>
  </SafeAreaView>
);
}