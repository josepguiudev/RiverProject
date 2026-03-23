import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, Alert, ScrollView } from 'react-native';

import globalStyles from "@/assets/globalStyles/globalStyles";
import styles from './styles';
import MenuPrincipal from '@/app/components/Menu/CustomMenu';
import strings from "../../../assets/supportFiles/strings.json";
import { FlatList, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function AdminUserScreen({ navigation }: any) {
    type Game = { 
        id_game: number,
        appid: number,
        title: string,
        iconUrl: string
    };
    type UserBD = {
        id: number,
        personaName: string,
        steamId: string,
        avatar: string,
        profileUrl: string,
        games: Game[]
    };

    const [usuariosBD, setUsuariosBD] = useState<UserBD[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);

    {/*Funciones para extraer los datos de la bd*/}
    const loadUsers = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
        const response = await fetch(`http://localhost:8080/api/usersteam/allUsers?page=${page}&size=10`);
        if (!response.ok) throw new Error("Error al obtener los usuarios");

        const data = await response.json();
        const users: UserBD[] = data.content || data; // si tu API devuelve array directo
        const totalPages: number = data.totalPages ?? 1;

        if (users.length === 0) {
        setHasMore(false);
        return;
        }

        setUsuariosBD(prev => [...prev, ...users]);
        setPage(prev => prev + 1);

        if (page + 1 >= totalPages) setHasMore(false);
    } catch (error) {
        console.error(error);
        Alert.alert("Error", "No se pudieron cargar los usuarios");
    } finally {
        setLoading(false);
    }
    };

    useEffect(() => { loadUsers(); }, []);

    const UserCard = ({ user }: { user: UserBD }) => {
        const [showGames, setShowGames] = useState(false);

        return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <Text style={styles.personaName}>{user.personaName}</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert("CRUD", `Usuario: ${user.personaName}`)}>
                <Text style={styles.threeDots}>⋮</Text>
            </TouchableOpacity>
            </View>

            {showGames && user.games.length > 0 && (
            <View style={styles.gamesContainer}>
                {user.games.map(game => (
                <View key={game.id_game} style={styles.gameItem}>
                    <Image source={{ uri: game.iconUrl }} style={styles.gameIcon} />
                    <Text style={styles.gameTitle}>{game.title}</Text>
                </View>
                ))}
            </View>
            )}

            {user.games.length > 0 && (
            <TouchableOpacity onPress={() => setShowGames(prev => !prev)}>
                <Text style={styles.showGames}>{showGames ? "Ocultar juegos" : "Mostrar juegos"}</Text>
            </TouchableOpacity>
            )}
        </View>
        );
    };

    return (

        <View style={[globalStyles.padre, globalStyles.tamanoCajaPadre, globalStyles.borde]}>
            {/* 1. HEADER / BOTÓN MENU */}
            <View style={[globalStyles.cajaMenu, globalStyles.alineadoPersonalVertical]}>
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 20 }}>
                    <Text style={{ color: 'white' }}>{strings.menu}</Text>
                </TouchableOpacity>
            </View>

            {/*Creación del Crud de usuarios en nuestra app*/}
            <View style={[globalStyles.cajaMenu, globalStyles.alineadoPersonalVertical, globalStyles.borde2, {height: '100%'}]}>
                <ScrollView
                    style={[styles.scrollView, { width: '100%'}]}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false} // Para un look más limpio
                    bounces={true} // Efecto de rebote moderno (iOS)
                >
                    <FlatList
                    data={usuariosBD}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <UserCard user={item} />}
                    ListFooterComponent={
                        <>
                        {loading && <Text style={{ textAlign: 'center', padding: 10 }}>Cargando...</Text>}
                        {!loading && hasMore && (
                            <TouchableOpacity
                            onPress={loadUsers}
                            style={{
                                backgroundColor: '#007bff',
                                margin: 10,
                                padding: 10,
                                borderRadius: 5,
                            }}
                            >
                            <Text style={{ color: 'white', textAlign: 'center' }}>Cargar más usuarios</Text>
                            </TouchableOpacity>
                        )}
                        {!hasMore && <Text style={{ textAlign: 'center', padding: 10 }}>No hay más usuarios</Text>}
                        </>
                    }
                    />
                </ScrollView>
            </View>

            {/* 3. MENU AL FINAL (FUERA DE TODO) */}
            <MenuPrincipal 
                visible={menuVisible} 
                onClose={() => setMenuVisible(false)} 
            />
        </View>

    );
}
