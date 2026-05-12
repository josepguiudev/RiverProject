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
            const response = await fetch(`http://localhost:8080/api/usersteam/allUsers?page=${newPage}&size=20`);
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
            <View style={{
                width: '23.5%', 
                backgroundColor: '#1b2838',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: showGames ? '#66c0f4' : '#2a475e', // Resaltar si está abierto
                marginBottom: 15,
                // La clave es NO usar absolute en el contenedor de juegos si queremos que empuje,
                // pero como es una Grid, usaremos un zIndex altísimo y un fondo sólido.
                zIndex: showGames ? 9999 : 1,
                elevation: showGames ? 20 : 0,
                position: 'relative',
            }}>
                {/* TRES PUNTOS USUARIO */}
                <TouchableOpacity 
                    onPress={() => openUserModal(user)} 
                    style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
                >
                    <Text style={{ color: '#66c0f4', fontSize: 18, fontWeight: 'bold' }}>⋮</Text>
                </TouchableOpacity>

                {/* AVATAR Y NOMBRE */}
                <View style={{ alignItems: 'center', marginTop: 15, paddingHorizontal: 5 }}>
                    <Image 
                        source={{ uri: user.avatar }} 
                        style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#66c0f4' }} 
                    />
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 11, marginTop: 8, textAlign: 'center' }} numberOfLines={1}>
                        {user.personaName}
                    </Text>
                </View>

                {/* BOTÓN JUEGOS */}
                {user.games.length > 0 && (
                    <TouchableOpacity 
                        onPress={() => setShowGames(!showGames)}
                        style={{ 
                            marginTop: 10, 
                            backgroundColor: showGames ? '#66c0f4' : '#171d25', 
                            paddingVertical: 4, 
                            marginHorizontal: 10, 
                            borderRadius: 15 
                        }}
                    >
                        <Text style={{ color: showGames ? '#000' : '#66c0f4', fontSize: 9, fontWeight: 'bold', textAlign: 'center' }}>
                            {user.games.length} JUEGOS {showGames ? '▲' : '▼'}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* LISTA DE JUEGOS (ESTILO INTEGRADO) */}
                {showGames && (
                    <View style={{ 
                        // Usamos una posición que cubra parte de la tarjeta y sobresalga
                        position: 'absolute',
                        top: '100%',
                        left: -1,
                        right: -1,
                        backgroundColor: '#1b2838', // Mismo color que la tarjeta para que parezca una sola pieza
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12,
                        borderWidth: 1,
                        borderColor: '#66c0f4',
                        borderTopWidth: 0,
                        padding: 8,
                        maxHeight: 180,
                        zIndex: 10000,
                        elevation: 25,
                    }}>
                        <ScrollView nestedScrollEnabled={true}>
                            {user.games.map(game => (
                                <View key={game.id_game} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, borderBottomWidth: 0.5, borderBottomColor: '#2a475e', paddingBottom: 4 }}>
                                    <Image source={{ uri: game.iconUrl }} style={{ width: 20, height: 20, borderRadius: 3 }} />
                                    <Text style={{ color: '#eee', fontSize: 10, marginLeft: 8, flex: 1 }} numberOfLines={1}>{game.title}</Text>
                                    <TouchableOpacity onPress={() => openGameModal(game)}>
                                        <Text style={{ color: '#66c0f4', fontSize: 14 }}>⋮</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
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
                        numColumns={4} // ✅ Definimos las 4 columnas
                        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 15 }} 
                        
                        // ✅ ESTO ES LO QUE SOLUCIONA EL PROBLEMA DEFINITIVAMENTE EN ANDROID
                        CellRendererComponent={({ children, index, style, ...props }) => {
                            const cellStyle = [
                                style,
                                { zIndex: usuariosBD.length - index } // El primero tiene el zIndex más alto
                            ];
                            return (
                                <View style={cellStyle} {...props}>
                                    {children}
                                </View>
                            );
                        }}
                        
                        contentContainerStyle={{ padding: 15 }}
                        removeClippedSubviews={false} // Evita que desaparezca el contenido que sobresale
                    />

                    {/* PAGINACIÓN DEBAJO */}
                    <View style={{ 
                        flexDirection: 'row', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        paddingVertical: 20,
                        backgroundColor: '#000' 
                    }}>
                        <TouchableOpacity
                            onPress={() => loadUsers(page - 1)}
                            disabled={page === 0}
                            style={{ 
                                backgroundColor: page === 0 ? '#2a475e' : '#66c0f4', 
                                paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5, opacity: page === 0 ? 0.5 : 1 
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 11 }}>ANTERIOR</Text>
                        </TouchableOpacity>

                        <Text style={{ color: 'gold', marginHorizontal: 20, fontWeight: 'bold' }}>PÁGINA {page + 1}</Text>

                        <TouchableOpacity
                            onPress={() => loadUsers(page + 1)}
                            disabled={!hasMore}
                            style={{ 
                                backgroundColor: !hasMore ? '#2a475e' : '#66c0f4', 
                                paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5, opacity: !hasMore ? 0.5 : 1 
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 11 }}>SIGUIENTE</Text>
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
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{ 
                    flex: 1,                          // Ocupa TODA la pantalla
                    backgroundColor: 'rgba(0,0,0,0.8)', // Fondo oscurecido para centrar la atención
                    justifyContent: 'center',         // Centrado Vertical
                    alignItems: 'center',             // Centrado Horizontal
                }}>
                    <View style={[styles.modalContainer, { backgroundColor: '#1b2838', borderRadius: 15, borderWidth: 1, borderColor: '#66c0f4', padding: 25 }]}>
                        {/* TÍTULO DEL MODAL */}
                        <Text style={[styles.modalTitle, { color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }]}>
                            {editingUser ? "EDITAR USUARIO" : "EDITAR JUEGO"}
                        </Text>

                        {/* INPUTS CON TEXTO BLANCO */}
                        <View style={{ gap: 15 }}>
                            <View>
                                <Text style={{ color: '#66c0f4', fontSize: 10, fontWeight: 'bold', marginBottom: 5 }}>NOMBRE / TÍTULO</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: '#0d1117', color: '#FFFFFF', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#2a475e' }]}
                                    value={editingUser ? selectedUser?.personaName : selectedGame?.title}
                                    placeholderTextColor="#555" // Color del texto de ayuda si estuviera vacío
                                    onChangeText={(text) => editingUser 
                                        ? setSelectedUser({ ...selectedUser!, personaName: text })
                                        : setSelectedGame({ ...selectedGame!, title: text })
                                    }
                                />
                            </View>

                            <View>
                                <Text style={{ color: '#66c0f4', fontSize: 10, fontWeight: 'bold', marginBottom: 5 }}>URL IMAGEN</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: '#0d1117', color: '#FFFFFF', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#2a475e' }]}
                                    value={editingUser ? selectedUser?.avatar : selectedGame?.iconUrl}
                                    placeholderTextColor="#555"
                                    onChangeText={(text) => editingUser
                                        ? setSelectedUser({ ...selectedUser!, avatar: text })
                                        : setSelectedGame({ ...selectedGame!, iconUrl: text })
                                    }
                                />
                            </View>
                        </View>

                        {/* BOTONES */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 }}>
                            <TouchableOpacity 
                                style={{ backgroundColor: '#4c6b22', padding: 12, borderRadius: 5, flex: 1, marginRight: 5, alignItems: 'center' }} 
                                onPress={() => editingUser ? updateUser(selectedUser!) : updateGame(selectedGame!)}
                            >
                                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>GUARDAR</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={{ backgroundColor: '#a34c4c', padding: 12, borderRadius: 5, flex: 1, marginLeft: 5, alignItems: 'center' }} 
                                onPress={() => editingUser ? deleteUser(selectedUser!.id) : deleteGame(selectedGame!.id_game)}
                            >
                                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>ELIMINAR</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity 
                            style={{ marginTop: 20, alignItems: 'center' }} 
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={{ color: '#889fb2', textDecorationLine: 'underline' }}>Cancelar y salir</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
