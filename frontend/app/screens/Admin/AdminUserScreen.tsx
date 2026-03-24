import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, Alert, ScrollView } from 'react-native';

import globalStyles from "@/assets/globalStyles/globalStyles";
import styles from './styles';
import MenuPrincipal from '@/app/components/Menu/CustomMenu';
import strings from "../../../assets/supportFiles/strings.json";
import { FlatList, Image } from 'react-native';

import { Modal, TextInput } from 'react-native';

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

    //Modal
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserBD | null>(null);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [editingUser, setEditingUser] = useState(false); // true si estamos editando usuario
    const [editingGame, setEditingGame] = useState(false); // true si estamos editando juego

    {/*Funciones para extraer los datos de la bd*/}
    const loadUsers = async (newPage: number) => {
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/usersteam/allUsers?page=${newPage}&size=7`);
            if (!response.ok) throw new Error("Error al obtener los usuarios");

            const data = await response.json();
            const users: UserBD[] = data.content || data;
            const totalPages: number = data.totalPages ?? 1;

            setUsuariosBD(users);
            setPage(newPage);

            setHasMore(newPage < totalPages - 1);

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudieron cargar los usuarios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadUsers(0); }, []);

    const UserCard = ({ user }: { user: UserBD }) => {
        const [showGames, setShowGames] = useState(false);

        return (
            <View style={styles.card}>
                
                {/* HEADER */}
                <View style={styles.cardHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={{ uri: user.avatar }} style={styles.avatar} />
                        <View>
                            <Text style={styles.personaName}>{user.personaName}</Text>
                            <Text style={styles.steamId}>{user.steamId}</Text>
                        </View>
                    </View>

                    {/* 3 puntos usuario */}
                    <TouchableOpacity onPress={() => openUserModal(user)}>
                        <Text style={styles.threeDots}>⋮</Text>
                    </TouchableOpacity>
                </View>

                {/* BOTÓN MOSTRAR JUEGOS */}
                {user.games.length > 0 && (
                    <TouchableOpacity onPress={() => setShowGames(!showGames)}>
                        <Text style={styles.showGames}>
                            {showGames ? "Ocultar juegos ▲" : "Ver juegos ▼"}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* LISTA DE JUEGOS CON SCROLL */}
                {showGames && (
                    <ScrollView style={styles.gamesScroll}>
                        {user.games.map(game => (
                            <View key={game.id_game} style={styles.gameItem}>
                                
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <Image source={{ uri: game.iconUrl }} style={styles.gameIcon} />
                                    <Text style={styles.gameTitle}>{game.title}</Text>
                                </View>

                                {/* 3 puntos juego */}
                                <TouchableOpacity onPress={() => openGameModal(game)}>
                                    <Text style={styles.threeDots}>⋮</Text>
                                </TouchableOpacity>

                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>
        );
    };

    const openUserModal = (user: UserBD) => {
        setSelectedUser(user);
        setEditingUser(true);
        setEditingGame(false);
        setModalVisible(true);
    };

    const openGameModal = (game: Game) => {
        setSelectedGame(game);
        setEditingUser(false);
        setEditingGame(true);
        setModalVisible(true);
    };

    const deleteUser = async (id: number) => {
        try {
            await fetch(`http://localhost:8080/api/usersteam/${id}`, {
                method: "DELETE"
            });

            setUsuariosBD(prev => prev.filter(u => u.id !== id));

        } catch (error) {
            Alert.alert("Error", "No se pudo eliminar");
        }
    };

    const updateUser = async (user: UserBD) => {
        try {
            await fetch(`http://localhost:8080/api/usersteam/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            });

            loadUsers(page); // refrescar

        } catch {
            Alert.alert("Error");
        }
    };

    const deleteGame = async (id: number) => {
        try {
            await fetch(`http://localhost:8080/api/game/${id}`, {
                method: "DELETE"
            });

            loadUsers(page);

        } catch {
            Alert.alert("Error");
        }
    };

    const updateGame = async (game: Game) => {
        try {
            await fetch(`http://localhost:8080/api/game/${game.id_game}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(game)
            });

            loadUsers(page);

        } catch {
            Alert.alert("Error");
        }
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
                <View style={{ flex: 1 }}>

                    <FlatList
                        data={usuariosBD}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => <UserCard user={item} />}
                        ListFooterComponent={loading ? <Text style={{ textAlign: 'center' }}>Cargando...</Text> : null}
                    />

                    {/* PAGINACIÓN DEBAJO */}
                    <View style={styles.paginationContainer}>

                        <TouchableOpacity
                            onPress={() => loadUsers(page - 1)}
                            disabled={page === 0}
                            style={[styles.pageButton, page === 0 && styles.disabled]}
                        >
                            <Text style={styles.pageText}>Anterior</Text>
                        </TouchableOpacity>

                        <Text style={styles.pageIndicator}>Página {page + 1}</Text>

                        <TouchableOpacity
                            onPress={() => loadUsers(page + 1)}
                            disabled={!hasMore}
                            style={[styles.pageButton, !hasMore && styles.disabled]}
                        >
                            <Text style={styles.pageText}>Siguiente</Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </View>

            {/* 3. MENU AL FINAL (FUERA DE TODO) */}
            <MenuPrincipal 
                visible={menuVisible} 
                onClose={() => setMenuVisible(false)} 
            />

            {/*Modal de CRUD*/}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        
                        {/* Usuario */}
                        {editingUser && selectedUser && (
                            <>
                                <Text style={styles.modalTitle}>Editar Usuario</Text>
                                <TextInput
                                    style={styles.input}
                                    value={selectedUser.personaName}
                                    onChangeText={(text) => setSelectedUser({ ...selectedUser, personaName: text })}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={selectedUser.avatar}
                                    onChangeText={(text) => setSelectedUser({ ...selectedUser, avatar: text })}
                                />
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity style={styles.saveButton} onPress={() => {
                                        updateUser(selectedUser);
                                        setModalVisible(false);
                                    }}>
                                        <Text style={{ color: 'white' }}>Guardar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.deleteButton} onPress={() => {
                                        deleteUser(selectedUser.id);
                                        setModalVisible(false);
                                    }}>
                                        <Text style={{ color: 'white' }}>Eliminar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                        <Text>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

                        {/* Juego */}
                        {editingGame && selectedGame && (
                            <>
                                <Text style={styles.modalTitle}>Editar Juego</Text>
                                <TextInput
                                    style={styles.input}
                                    value={selectedGame.title}
                                    onChangeText={(text) => setSelectedGame({ ...selectedGame, title: text })}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={selectedGame.iconUrl}
                                    onChangeText={(text) => setSelectedGame({ ...selectedGame, iconUrl: text })}
                                />
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity style={styles.saveButton} onPress={() => {
                                        updateGame(selectedGame);
                                        setModalVisible(false);
                                    }}>
                                        <Text style={{ color: 'white' }}>Guardar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.deleteButton} onPress={() => {
                                        deleteGame(selectedGame.id_game);
                                        setModalVisible(false);
                                    }}>
                                        <Text style={{ color: 'white' }}>Eliminar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                        <Text>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}
