import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';

import strings from "../../../assets/supportFiles/strings.json";
import MenuPrincipal from '@/app/components/Menu/CustomMenu';
import globalStyles from "@/assets/globalStyles/globalStyles";

export default function AdminGenresGames({ navigation }: any) {  
    const [menuVisible, setMenuVisible] = useState(false);
    const [generos, setGeneros] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${strings.parte2Desktop}api/generes/all`)
            .then(res => res.json())
            .then(data => {
                console.log("DATOS RECIBIDOS:", data);
                const listaLimpia = data.content || data;
                setGeneros(Array.isArray(listaLimpia) ? listaLimpia : []);
                
                setLoading(false);
            })
            .catch(err => console.error("Error cargando géneros:", err));
    }, []);

    const renderJuego = ({ item }: any) => (
        <View style={{ 
            flexDirection: 'row', 
            padding: 10, 
            backgroundColor: '#1b2838', 
            marginBottom: 5, 
            borderRadius: 8,
            alignItems: 'center' 
        }}>
            <Image source={{ uri: item.iconUrl }} style={{ width: 40, height: 40, borderRadius: 4 }} />
            <View style={{ marginLeft: 12 }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{item.title}</Text>
                <Text style={{ color: '#66c0f4', fontSize: 11 }}>AppID: {item.appid}</Text>
            </View>
        </View>
    );

    if (loading) return <ActivityIndicator size="large" color="gold" style={{flex:1, backgroundColor:'#000'}} />;

    return (
        <View style={[globalStyles.padre, { flex: 1, backgroundColor: '#0d1117', padding: 15 }]}>
            {/* 1. HEADER */}
            <View style={[globalStyles.cajaMenu, globalStyles.borde, { height: 60, justifyContent: 'center', paddingHorizontal: 20 }]}>
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>{strings.menu}</Text>
                </TouchableOpacity>
            </View>


            <Text style={{ color: 'gold', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                EXPLORADOR POR GÉNERO
            </Text>

            <FlatList
                data={generos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    // ✅ 1. FILTRADO: Nos quedamos solo con los juegos que son OBJETOS
                    // Esto ignora los números (6, 14) que ensucian la lista
                    const juegosValidos = item.games?.filter((g: any) => typeof g === 'object' && g !== null) || [];

                    return (
                        <View style={{ marginBottom: 20, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#2a475e' }}>
                            
                            {/* CABECERA DEL GÉNERO */}
                            <View style={{ 
                                backgroundColor: '#1b2838', 
                                padding: 12, 
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: '#66c0f4'
                            }}>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>
                                    {item.description.toUpperCase()}
                                </Text>
                                <View style={{ backgroundColor: '#2a475e', paddingHorizontal: 8, borderRadius: 4 }}>
                                    <Text style={{ color: 'gold', fontSize: 10, fontWeight: 'bold' }}>
                                        {juegosValidos.length} JUEGOS
                                    </Text>
                                </View>
                            </View>

                            {/* LISTA DE JUEGOS */}
                            <View style={{ backgroundColor: '#0d1117', padding: 8 }}>
                                {juegosValidos.length > 0 ? (
                                    juegosValidos.map((game: any) => {
                                        // ✅ 2. CONSTRUCCIÓN DE LA URL DE IMAGEN
                                        // Combinamos el AppID con el hash que viene en iconUrl
                                        const fullIconUrl = `http://steampowered.com{game.appid}/${game.iconUrl}.jpg`;

                                        return (
                                            <View key={game.id_game} style={{ 
                                                flexDirection: 'row', 
                                                alignItems: 'center', 
                                                padding: 10, 
                                                backgroundColor: '#171d25', 
                                                marginBottom: 6, 
                                                borderRadius: 6,
                                                borderLeftWidth: 3,
                                                borderLeftColor: '#66c0f4'
                                            }}>
                                                <Image 
                                                    source={{ uri: `http://steampowered.com{game.appid}/${game.iconUrl}.jpg` }} 
                                                    style={{ width: 35, height: 35, borderRadius: 4, backgroundColor: '#000' }} 
                                                    resizeMode="cover"
                                                />
                                                <View style={{ marginLeft: 12, flex: 1 }}>
                                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
                                                        {game.title}
                                                    </Text>
                                                    <Text style={{ color: '#889fb2', fontSize: 10 }}>AppID: {game.appid}</Text>
                                                </View>
                                            </View>
                                        );
                                    })
                                ) : (
                                    <Text style={{ color: '#444', textAlign: 'center', padding: 10, fontStyle: 'italic' }}>
                                        Datos de juegos incompletos en este género
                                    </Text>
                                )}
                            </View>
                        </View>
                    );
                }}
                contentContainerStyle={{ padding: 15 }}
            />

            <MenuPrincipal visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />
        </View>
    );

}