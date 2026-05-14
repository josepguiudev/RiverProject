import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Platform, Alert } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import globalStyles from '@/assets/globalStyles/globalStyles';
import strings from '../../../assets/supportFiles/strings.json';
import MenuPrincipal from '@/app/components/Menu/CustomMenu';
import { useLayout } from '@/app/utils/useLayout';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/app/services/api/api';
import { useAuth } from '@/app/screens/Auth/AuthContext';

import ProfileHeader from '@/app/components/Profile/ProfileHeader';
import DonutGenresCard from '@/app/components/Profile/DonutGenresCard';
import TopGamesCard from '@/app/components/Profile/TopGamesCard';
import SurveysGrid from '@/app/components/Profile/SurveysGrid';
import SettingsTab from '@/app/components/Profile/SettingsTab';
import type { SavePayload } from '@/app/components/Profile/SettingsTab';

const BASE_URL = 'http://localhost:8080';

// ── Mockup de datos en caso de fallo de la API ──
const MOCK_PROFILE = {
    personaName: "Usuario (Modo Offline)",
    steamId: "00000000000000000",
    avatarFull: "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
    personastate: 0
};

const MOCK_GAMES = [
    { appid: 440, name: "Team Fortress 2" },
    { appid: 570, name: "Dota 2" },
    { appid: 730, name: "Counter-Strike 2" }
];

const MOCK_SURVEYS = [
    { id_survey: 1, name: "Tu experiencia en el juego", creationDate: new Date().toISOString() },
    { id_survey: 2, name: "Encuesta de hardware", creationDate: new Date().toISOString() }
];

// La Screen del Perfil es la que se encarga de llamar a la API y a la BD.

// ── Sub-pestañas del perfil ──
type ProfileTab = 'perfil' | 'configuracion';

export default function ProfileScreen({ navigation, route }: any) {
    const { isMobileView, isDesktopView } = useLayout();
    const [menuVisible, setMenuVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<ProfileTab>('perfil');
    const { user } = useAuth(); // Usuario logueado (contiene id, name, email)

    // Efecto para detectar si venimos desde el menú de configuración
    React.useEffect(() => {
        if (route.params?.tab === 'configuracion') {
            setActiveTab('configuracion');
        } else if (route.params?.tab === 'perfil') {
            setActiveTab('perfil');
        }
    }, [route.params?.tab]);

    const steamId = strings.idPlayerJoako || '76561199167008828';
    const apiKey = Constants.expoConfig?.extra?.STEAM_API_KEY || '';

    const { data: profileData, isLoading: loading } = useQuery({
        queryKey: ['profile', steamId, user?.id],
        queryFn: async () => {
            try {
                // 1. Fetch user data from DB first to get correct steamId
                let userDbData = null;
                if (user?.id) {
                    try {
                        const userRes = await apiFetch(`/api/users/${user.id}`);
                        if (userRes.ok) {
                            userDbData = await userRes.json();
                        }
                    } catch (e) { }
                }

                // Determine final steam ID from DB or fallback to default
                const finalSteamId = userDbData ? (userDbData.urlIdStream || '') : steamId;
                const cleanSteamId = finalSteamId ? finalSteamId.trim() : '';

                // 2. Synchronize library if steamId and apiKey are present
                if (cleanSteamId && apiKey) {
                    await fetch(`${BASE_URL}/api/games/sync-library?steamid=${cleanSteamId}&apiKey=${apiKey}`).catch(() => { });
                }

                // 3. Load Profile
                let profileJson = MOCK_PROFILE;
                if (cleanSteamId) {
                    try {
                        const profileRes = await fetch(`${BASE_URL}/api/usersteam/by-bd-steamid/${cleanSteamId}`);
                        if (profileRes.ok) {
                            profileJson = await profileRes.json();
                        } else {
                            console.log("Error en by-bd-steamid:", profileRes.status);
                        }
                    } catch (e) { console.log("Fallo conexión perfil"); }
                }

                // 4. Load Top 3 Games
                let gamesJson = MOCK_GAMES;
                if (cleanSteamId) {
                    try {
                        const gamesRes = await fetch(`${BASE_URL}/api/games/top3/${cleanSteamId}`);
                        if (gamesRes.ok) gamesJson = await gamesRes.json();
                    } catch (e) { console.log("Fallo conexión juegos"); }
                }

                // 5. Load Surveys (only if valid userId)
                let surveysData = MOCK_SURVEYS;
                const userId = user?.id;
                if (userId && !isNaN(Number(userId))) {
                    try {
                        const surveysRes = await axios.get(`${BASE_URL}/api/surveys/user/${userId}`);
                        surveysData = surveysRes.data;
                    } catch (e) { console.log("Fallo conexión encuestas"); }
                } else {
                    console.log("Usando encuestas mock porque el userId es inválido:", userId);
                }

                // 6. Load Genres
                let genresData: { name: string; percentage: number }[] = [];
                if (cleanSteamId) {
                    try {
                        const genresRes = await fetch(`${BASE_URL}/api/games/top-genres/${cleanSteamId}`);
                        if (genresRes.ok) genresData = await genresRes.json();
                    } catch (e) { }
                }

                return {
                    steamProfile: profileJson,
                    topGames: gamesJson,
                    surveys: surveysData,
                    genres: genresData,
                    userDb: userDbData,
                };
            } catch (error) {
                return {
                    steamProfile: MOCK_PROFILE,
                    topGames: MOCK_GAMES,
                    surveys: MOCK_SURVEYS,
                    genres: [],
                    userDb: null,
                };
            }
        }
    });

    // Aquí he definido esto para que los componentes reciban las props que se guardan 
    // en profileData tras la función de arriba. Así los componentes muestran x datos.
    const steamProfile = profileData?.steamProfile || null;
    // El "?" está básicamente para que no pete la cosa si los datos de profileData 
    // aún no están disponibles (es la promesa de loading ;)).
    const topGames = profileData?.topGames || [];
    const surveys = profileData?.surveys || [];
    const genres = profileData?.genres || [];
    const userDb = profileData?.userDb || null;

    // ── Callback para guardar datos de configuración ──
    // Llama a las rutas REALES del backend con fallback si no están disponibles.
    const handleSettingsSave = async (payload: SavePayload) => {
        const { userData, passwordChange } = payload;

        // 1. Actualizar datos del usuario
        // Ruta real: PUT /api/users/{id}
        if (user?.id) {
            const updateRes = await apiFetch(`/api/users/${user.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: userData.name,
                    apellido1: userData.apellido1,
                    apellido2: userData.apellido2,
                    email: userData.email,
                    edad: userData.edad ? parseInt(userData.edad) : null,
                    localizacion: userData.localizacion,
                    urlIdStream: userData.steamId, // El campo en el modelo User es urlIdStream
                }),
            });

            if (!updateRes.ok) {
                const errData = await updateRes.json().catch(() => ({}));
                throw new Error(errData.error || 'Error al actualizar los datos del usuario.');
            }
        }

        // 2. Cambiar contraseña (solo si el usuario rellenó los campos)
        // Ruta real: PUT /api/auth2/change-password
        if (passwordChange && user?.id) {
            const pwRes = await apiFetch('/api/auth2/change-password', {
                method: 'PUT',
                body: JSON.stringify({
                    userId: user.id,
                    currentPassword: passwordChange.currentPassword,
                    newPassword: passwordChange.newPassword,
                }),
            });

            if (!pwRes.ok) {
                const errData = await pwRes.json().catch(() => ({}));
                throw new Error(errData.error || 'Error al cambiar la contraseña.');
            }
        }
    };

    return (
        <View style={[globalStyles.padre, globalStyles.tamanoCajaPadre]}>

            {/* BOTÓN MENU ESTANDARIZADO */}
            <View style={{ 
                position: 'absolute',
                top: Platform.OS === 'ios' ? 50 : 20,
                left: 20,
                zIndex: 10,
            }}>
                <TouchableOpacity 
                    onPress={() => setMenuVisible(true)} 
                    style={{ 
                        padding: 10, 
                        backgroundColor: 'rgba(255,255,255,0.1)', 
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.1)'
                    }}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>{strings.menu || "MENÚ"}</Text>
                </TouchableOpacity>
            </View>

            {/* ── Sub-pestañas ── */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'perfil' && styles.tabActive]}
                    onPress={() => setActiveTab('perfil')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.tabText, activeTab === 'perfil' && styles.tabTextActive]}>
                        Perfil
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'configuracion' && styles.tabActive]}
                    onPress={() => setActiveTab('configuracion')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.tabText, activeTab === 'configuracion' && styles.tabTextActive]}>
                        Configuración
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ── Contenido según pestaña activa ── */}
            {activeTab === 'perfil' ? (
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={[
                        styles.content,
                        isDesktopView && styles.contentDesktop
                    ]}
                >
                    {user?.role === 'PLAYER' ? (
                        <>
                            {/* Vista de Jugador — Steam & Encuestas */}
                            <ProfileHeader profile={steamProfile} loading={loading} />

                            <View style={[
                                styles.middleRow,
                                isMobileView ? styles.middleRowMobile : styles.middleRowDesktop
                            ]}>
                                <View style={isMobileView ? styles.fullWidth : styles.halfWidth}>
                                    <DonutGenresCard genres={genres.length > 0 ? genres : undefined} />
                                </View>
                                <View style={isMobileView ? styles.fullWidth : styles.halfWidth}>
                                    <TopGamesCard
                                        games={topGames}
                                        loading={loading}
                                        isMobile={isMobileView}
                                    />
                                </View>
                            </View>

                            <SurveysGrid
                                surveys={surveys}
                                loading={loading}
                                isMobile={isMobileView}
                            />
                        </>
                    ) : (
                        /**
                         * VISTA PARA EMPRESA / ADMIN
                         * Mostramos un resumen básico sin datos de Steam.
                         */
                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <View style={[globalStyles.caja, { padding: 40, width: '100%', maxWidth: 500 }]}>
                                <Text style={[styles.tabTextActive, { fontSize: 24, marginBottom: 10 }]}>
                                    {userDb?.name || user?.name || "Usuario"}
                                </Text>
                                <Text style={{ color: '#888', fontSize: 16, marginBottom: 20 }}>
                                    Rol: <Text style={{ color: '#5b55c0', fontWeight: 'bold' }}>{user?.role}</Text>
                                </Text>
                                <View style={{ height: 1, backgroundColor: '#333', width: '100%', marginBottom: 20 }} />
                                <Text style={{ color: '#ccc', textAlign: 'center' }}>
                                    Estás en tu perfil de gestión. Puedes editar tus datos en la pestaña de "Configuración".
                                </Text>
                            </View>
                        </View>
                    )}

                    <View style={{ height: 80 }} />
                </ScrollView>
            ) : (
                /* ── Pestaña Configuración ── */
                <View style={[
                    styles.settingsWrapper,
                    isDesktopView && styles.settingsWrapperDesktop,
                ]}>
                    <SettingsTab
                        isMobile={isMobileView}
                        initialData={{
                            // Primero intenta con los datos reales de la BD (GET /api/users/{id})
                            // Fallback: usa lo que tenga del AuthContext o del perfil Steam
                            name: userDb?.name || user?.name || steamProfile?.personaName || steamProfile?.personaName || '',
                            apellido1: userDb?.apellido1 || '',
                            apellido2: userDb?.apellido2 || '',
                            email: userDb?.email || user?.email || '',
                            edad: userDb?.edad ? String(userDb.edad) : '',
                            localizacion: userDb?.localizacion || '',
                            steamId: userDb?.urlIdStream || steamId,
                        }}
                        userRole={user?.role}
                        onSave={handleSettingsSave}
                    />
                </View>
            )}

            <MenuPrincipal visible={menuVisible} onClose={() => setMenuVisible(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
    menuBar: {
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a2e',
    },
    // ── Tab bar ──
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#0a0a18',
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a2e',
        paddingHorizontal: 16,
    },
    tab: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        marginRight: 4,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: '#5b55c0',
    },
    tabText: {
        color: '#666',
        fontSize: 15,
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#ffffff',
        textShadowColor: '#5b55c0',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    // ── Scroll / layout ──
    scroll: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    // En desktop centramos y limitamos el ancho máximo
    contentDesktop: {
        maxWidth: 1100,
        alignSelf: 'center',
        width: '100%',
        paddingHorizontal: 40,
    },
    middleRow: {
        marginBottom: 16,
    },
    middleRowMobile: {
        flexDirection: 'column',
        gap: 12,
    },
    middleRowDesktop: {
        flexDirection: 'row',
        gap: 16,
    },
    fullWidth: {
        width: '100%',
    },
    halfWidth: {
        flex: 1,
    },
    // ── Settings wrapper ──
    settingsWrapper: {
        flex: 1,
        padding: 16,
    },
    settingsWrapperDesktop: {
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
        paddingHorizontal: 40,
    },
});