import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Alert, Image, SafeAreaView, ActivityIndicator } from "react-native";
import { isWeb } from "@/app/utils/device";
import globalStyles from "@/assets/globalStyles/globalStyles";
import styles from './styles';
import MenuPrincipal from '@/app/components/Menu/CustomMenu';
import strings from "@/assets/supportFiles/strings.json";
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
    const [estaCargando2, setEstaCargando2] = useState(false);
    const [estaCargando3, setEstaCargando3] = useState(false);

    const [steamIdBibliotecaActiva, setSteamIdBibliotecaActiva] = useState("");

    // --- Función auxiliar para la URL base ---
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
                Alert.alert("Éxito", "Los usuarios se han guardado/procesado.");
            } else {
                throw new Error(mensaje || "Error al guardar la lista.");
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo conectar con el servidor.");
        } finally {
            setEstaCargando(false);
        }
    };

    // --- Guardar biblioteca de juegos ---
    const guardarBiblio = async () => {
        setEstaCargando2(true);
        if (juegosEncontrados.length === 0 || usuariosEncontrados.length === 0) {
            Alert.alert("Aviso", "Asegúrate de haber extraído el usuario y su biblioteca.");
            setEstaCargando2(false);
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
            Alert.alert("Error", "Error al conectar con el servidor.");
        } finally {
            setEstaCargando2(false);
        }
    };

    // --- Guardar detalles de un juego ---
    const guardarJuego = async () => {
        setEstaCargando3(true);
        if (!juegoDetalle) {
            Alert.alert("Aviso", "Primero debes extraer los detalles de un juego.");
            setEstaCargando3(false);
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
                throw new Error(mensaje || "Error al guardar.");
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo conectar con el servidor.");
        } finally {
            setEstaCargando3(false);
        }
    };

    if (isWeb) {
        return (
            <View style={[globalStyles.padre, { flex: 1, backgroundColor: '#000' }]}>
                <View style={[globalStyles.cajaMenu, { height: 60, justifyContent: 'center', paddingHorizontal: 20 }]}>
                    <TouchableOpacity onPress={() => setMenuVisible(true)}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{strings.menu}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', padding: 15, gap: 15 }}>
                    {/* COLUMNA 1 */}
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
                                <Text style={{ textAlign: 'center', color: 'gold', fontWeight: 'bold', fontSize: 12 }}>RESULTADO BÚSQUEDA</Text>
                            </View>
                            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
                                {usuariosEncontrados.map((user: any, index: number) => (
                                    <View key={user.steamid || index} style={{ padding: 15, backgroundColor: '#1b2838', borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#2a475e' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image source={{ uri: user.avatarfull }} style={{ width: 80, height: 80, borderRadius: 5 }} />
                                            <View style={{ marginLeft: 15, flex: 1 }}>
                                                <Text style={{ color: 'gold', fontWeight: 'bold', fontSize: 18 }}>{user.personaname}</Text>
                                                <Text style={{ color: '#aaa', fontSize: 11 }}>ID: {user.steamid}</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                            <View style={{ padding: 15, borderTopWidth: 1, borderTopColor: '#30363d' }}>
                                {estaCargando ? <ActivityIndicator color="gold" size="large" /> : <CustomButton title="Guardar usuario/s" onPress={guardarUsers} isAdmin={true} />}
                            </View>
                        </View>
                    </View>

                    {/* COLUMNA 2 */}
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
                            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
                                {juegosEncontrados.map((game: any, index: number) => (
                                    <View key={game.appid || index} style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#1b2838', borderRadius: 8, marginBottom: 8 }}>
                                        <Text style={{ color: 'white' }}>{game.name}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                            <View style={{ padding: 15, borderTopWidth: 1, borderTopColor: '#30363d' }}>
                                {estaCargando2 ? <ActivityIndicator color="gold" size="large" /> : <CustomButton title="Guardar biblioteca" onPress={guardarBiblio} isAdmin={true} />}
                            </View>
                        </View>
                    </View>

                    {/* COLUMNA 3 */}
                    <View style={{ flex: 1, marginHorizontal: 8 }}>
                        <CustomInputCard title='Extraer Juegos' value={2} onResultFound={(data) => setJuegoDetalle(data)} />
                        <View style={{ flex: 1, backgroundColor: '#0d1117', marginTop: 10, borderRadius: 12, borderWidth: 1, borderColor: '#30363d', overflow: 'hidden' }}>
                            <ScrollView style={{ flex: 1 }}>
                                {juegoDetalle && Object.keys(juegoDetalle).map((key) => {
                                    const gameData = juegoDetalle[key].data;
                                    if (!gameData) return null;
                                    return (
                                        <View key={key} style={{ padding: 20 }}>
                                            <Text style={{ color: '#fff', fontSize: 22 }}>{gameData.name}</Text>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                            <View style={{ padding: 15 }}>
                                {estaCargando3 ? <ActivityIndicator color="gold" size="large" /> : <CustomButton title="Guardar juego en BD" onPress={guardarJuego} isAdmin={true} />}
                            </View>
                        </View>
                    </View>
                </View>
                <MenuPrincipal visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />
            </View>
        );
    }

    // VERSIÓN ANDROID
    return (
        <SafeAreaView style={styles.androidSafeArea}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                <View style={styles.androidContainer}>
                    <View style={[stylesGlobal.row, { justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 16, width: '100%' }]}>
                        <TouchableOpacity onPress={() => setMenuVisible(true)}>
                            <Ionicons name="menu-outline" size={32} color="white" />
                        </TouchableOpacity>
                        <Text style={[stylesGlobal.texto, { fontWeight: 'bold', color: colors.secondary, fontSize: 18 }]}>Administración</Text>
                    </View>

                    <View style={[styles.androidSection, { marginBottom: 24, borderRadius: 20 }]}>
                        <View style={styles.androidSectionHeader}>
                            <Text style={styles.androidSectionTitle}>Extraer datos</Text>
                        </View>
                        <View style={{ padding: 16, gap: 16 }}>
                            <CustomInputCard title='Extraer Users' value={1} onResultFound={(data) => setUsuariosEncontrados(data.response?.players || data)} />
                            <CustomInputCard title='Extraer Juegos Bibliotecas' value={3} onResultFound={(data) => setJuegosEncontrados(data.response?.games || data)} />
                            <CustomInputCard title='Extraer Juegos' value={2} onResultFound={(data) => setJuegoDetalle(data)} />
                        </View>
                    </View>

                    <View style={[styles.androidSection, { marginBottom: 24, borderRadius: 20 }]}>
                        <View style={styles.androidSectionHeader}>
                            <Text style={styles.androidSectionTitle}>Usuarios</Text>
                        </View>
                        <ScrollView style={{ maxHeight: 350, padding: 12 }}>
                            {usuariosEncontrados.map((user: any, index: number) => (
                                <View key={index} style={[styles.androidUserCard, { marginBottom: 16, padding: 16 }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={{ uri: user.avatarfull }} style={{ width: 80, height: 80, borderRadius: 40 }} />
                                        <View style={{ marginLeft: 16 }}>
                                            <Text style={styles.androidUserName}>{user.personaname}</Text>
                                            <Text style={{ color: '#aaa' }}>ID: {user.steamid}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                        <View style={{ padding: 16 }}>
                            {estaCargando ? <ActivityIndicator color="gold" /> : <CustomButton title="GUARDAR USUARIOS" onPress={guardarUsers} isAdmin={true} />}
                        </View>
                    </View>

                    <View style={[styles.androidSection, { marginBottom: 24, borderRadius: 20 }]}>
                        <View style={styles.androidSectionHeader}>
                            <Text style={styles.androidSectionTitle}>Resultado biblioteca</Text>
                        </View>
                        <ScrollView style={{ maxHeight: 350, padding: 12 }}>
                            {juegosEncontrados.map((game: any, index: number) => (
                                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#1b2838', marginBottom: 8 }}>
                                    <Text style={{ color: 'white' }}>{game.name}</Text>
                                </View>
                            ))}
                        </ScrollView>
                        <View style={{ padding: 16 }}>
                            {estaCargando2 ? <ActivityIndicator color="gold" /> : <CustomButton title="GUARDAR BIBLIOTECA" onPress={guardarBiblio} isAdmin={true} />}
                        </View>
                    </View>

                    <View style={[styles.androidSection, { marginBottom: 24, borderRadius: 20 }]}>
                        <View style={styles.androidSectionHeader}>
                            <Text style={styles.androidSectionTitle}>Juego extraído</Text>
                        </View>
                        <ScrollView style={{ maxHeight: 350, padding: 12 }}>
                            {juegoDetalle && Object.keys(juegoDetalle).map((key) => {
                                const gameData = juegoDetalle[key].data;
                                if (!gameData) return null;
                                return (
                                    <View key={key} style={{ padding: 16, backgroundColor: '#171d25', borderRadius: 16 }}>
                                        <Text style={{ color: 'gold', fontSize: 18 }}>{gameData.name}</Text>
                                        <Text style={{ color: '#ddd' }}>{gameData.short_description?.replace(/<[^>]*>?/gm, '')}</Text>
                                    </View>
                                );
                            })}
                        </ScrollView>
                        <View style={{ padding: 16 }}>
                            {estaCargando3 ? <ActivityIndicator color="gold" /> : <CustomButton title="GUARDAR JUEGO" onPress={guardarJuego} isAdmin={true} />}
                        </View>
                    </View>
                </View>
                <MenuPrincipal visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />
            </ScrollView>
        </SafeAreaView>
    );
}