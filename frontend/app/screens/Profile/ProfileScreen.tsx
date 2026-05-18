import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Platform, SafeAreaView } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import globalStyles from '@/assets/globalStyles/globalStyles';
import strings from '../../../assets/supportFiles/strings.json';
import MenuPrincipal from '@/app/components/Menu/CustomMenu';
import { useLayout } from '@/app/utils/useLayout';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/app/services/api/api';
import { useAuth } from '@/app/screens/Auth/AuthContext';
import MenuButton from '@/app/components/Menu/MenuButton';
import ProfileHeader from '@/app/components/Profile/ProfileHeader';
import DonutGenresCard from '@/app/components/Profile/DonutGenresCard';
import TopGamesCard from '@/app/components/Profile/TopGamesCard';
import SurveysGrid from '@/app/components/Profile/SurveysGrid';
import SettingsTab from '@/app/components/Profile/SettingsTab';
import type { SavePayload } from '@/app/components/Profile/SettingsTab';
import { isWeb } from '../../utils/device';

const BASE_URL = 'http://localhost:8080';

// Mock data (igual que original)
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

type ProfileTab = 'perfil' | 'configuracion';

export default function ProfileScreen({ navigation, route }: any) {
    const { isMobileView, isDesktopView } = useLayout();
    const [menuVisible, setMenuVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<ProfileTab>('perfil');
    const { user } = useAuth();

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
            if (user?.role === 'USER') {
                try {
                    let userDbData = null;
                    if (user?.id) {
                        try {
                            const userRes = await apiFetch(`/api/users/${user.id}`);
                            if (userRes.ok) userDbData = await userRes.json();
                        } catch (e) {}
                    }
                    const finalSteamId = userDbData ? (userDbData.urlIdStream || '') : steamId;
                    const cleanSteamId = finalSteamId ? finalSteamId.trim() : '';
                    if (cleanSteamId && apiKey) {
                        await fetch(`${BASE_URL}/api/games/sync-library?steamid=${cleanSteamId}&apiKey=${apiKey}`).catch(() => {});
                    }
                    let profileJson = MOCK_PROFILE;
                    if (cleanSteamId) {
                        try {
                            const profileRes = await fetch(`${BASE_URL}/api/usersteam/by-bd-steamid/${cleanSteamId}`);
                            if (profileRes.ok) profileJson = await profileRes.json();
                        } catch (e) { console.log("Fallo conexión perfil"); }
                    }
                    let gamesJson = MOCK_GAMES;
                    if (cleanSteamId) {
                        try {
                            const gamesRes = await fetch(`${BASE_URL}/api/games/top3/${cleanSteamId}`);
                            if (gamesRes.ok) gamesJson = await gamesRes.json();
                        } catch (e) { console.log("Fallo conexión juegos"); }
                    }
                    let surveysData = MOCK_SURVEYS;
                    const userId = user?.id;
                    if (userId && !isNaN(Number(userId))) {
                        try {
                            const surveysRes = await axios.get(`${BASE_URL}/api/surveys/user/${userId}`);
                            surveysData = surveysRes.data;
                        } catch (e) { console.log("Fallo conexión encuestas"); }
                    }
                    let genresData: { name: string; percentage: number }[] = [];
                    if (cleanSteamId) {
                        try {
                            const genresRes = await fetch(`${BASE_URL}/api/games/top-genres/${cleanSteamId}`);
                            if (genresRes.ok) genresData = await genresRes.json();
                        } catch (e) {}
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
            if (user?.role === 'CLIENT' || user?.role === 'ADMIN') {
                let clientData = null;
                try {
                    const res = await apiFetch(`/api/clients/${user?.id}`);
                    if (res.ok) clientData = await res.json();
                } catch (e) {}
                return {
                    steamProfile: null,
                    topGames: [],
                    surveys: [],
                    genres: [],
                    userDb: clientData,
                };
            }
            return { steamProfile: null, topGames: [], surveys: [], genres: [], userDb: null };
        }
    });

    const steamProfile = profileData?.steamProfile || null;
    const topGames = profileData?.topGames || [];
    const surveys = profileData?.surveys || [];
    const genres = profileData?.genres || [];
    const userDb = profileData?.userDb || null;

    const handleSettingsSave = async (payload: SavePayload) => {
        const { userData, passwordChange } = payload;
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
                    urlIdStream: userData.steamId,
                }),
            });
            if (!updateRes.ok) {
                const errData = await updateRes.json().catch(() => ({}));
                throw new Error(errData.error || 'Error al actualizar los datos del usuario.');
            }
        }
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

    // ============================================================
    //  VERSIÓN WEB (exactamente igual al original)
    // ============================================================
    if (isWeb) {
        return (
            <View style={[globalStyles.padre, globalStyles.tamanoCajaPadre, { backgroundColor: '#1a1919' }]}>
                <MenuButton onPress={() => setMenuVisible(true)} />
                <View style={styles.tabBar}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'perfil' && styles.tabActive]}
                        onPress={() => setActiveTab('perfil')}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.tabText, activeTab === 'perfil' && styles.tabTextActive]}>Perfil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'configuracion' && styles.tabActive]}
                        onPress={() => setActiveTab('configuracion')}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.tabText, activeTab === 'configuracion' && styles.tabTextActive]}>Configuración</Text>
                    </TouchableOpacity>
                </View>
                {activeTab === 'perfil' ? (
                    <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, isDesktopView && styles.contentDesktop]}>
                        {user?.role === 'USER' ? (
                            <>
                                <ProfileHeader profile={steamProfile} loading={loading} />
                                <View style={[styles.middleRow, isMobileView ? styles.middleRowMobile : styles.middleRowDesktop]}>
                                    <View style={isMobileView ? styles.fullWidth : styles.halfWidth}>
                                        <DonutGenresCard genres={genres.length > 0 ? genres : undefined} />
                                    </View>
                                    <View style={isMobileView ? styles.fullWidth : styles.halfWidth}>
                                        <TopGamesCard games={topGames} loading={loading} isMobile={isMobileView} />
                                    </View>
                                </View>
                                <SurveysGrid surveys={surveys} loading={loading} isMobile={isMobileView} />
                            </>
                        ) : (
                            <View style={{ alignItems: 'center', marginTop: 50 }}>
                                <View style={[styles.fallbackCard, { padding: 40, width: '100%', maxWidth: 500 }]}>
                                    <Text style={[styles.tabTextActive, { fontSize: 24, marginBottom: 10 }]}>
                                        {[userDb?.name || user?.name, userDb?.apellido1, userDb?.apellido2].filter(Boolean).join(' ') || "Usuario"}
                                    </Text>
                                    <Text style={{ color: '#888', fontSize: 16, marginBottom: 20 }}>Rol: <Text style={{ color: '#5b55c0', fontWeight: 'bold' }}>{user?.role}</Text></Text>
                                    <View style={{ height: 1, backgroundColor: '#333', width: '100%', marginBottom: 20 }} />
                                    <Text style={{ color: '#ccc', textAlign: 'center' }}>Estás en tu perfil de gestión. Puedes editar tus datos en la pestaña de "Configuración".</Text>
                                </View>
                            </View>
                        )}
                        <View style={{ height: 80 }} />
                    </ScrollView>
                ) : (
                    <View style={[styles.settingsWrapper, isDesktopView && styles.settingsWrapperDesktop]}>
                        <SettingsTab
                            isMobile={isMobileView}
                            initialData={{
                                name: userDb?.name || user?.name || steamProfile?.personaName || '',
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

    // ============================================================
    //  VERSIÓN ANDROID (diseño táctil, sin pérdida de funcionalidad)
    // ============================================================
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1919' }}>
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 16, alignSelf: 'flex-start' }}>
                <Text style={{ color: 'white', fontSize: 24 }}>☰</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, gap: 8 }}>
                <TouchableOpacity
                    style={{ flex: 1, paddingVertical: 14, backgroundColor: activeTab === 'perfil' ? '#5b55c0' : '#2a2a2a', borderRadius: 12 }}
                    onPress={() => setActiveTab('perfil')}
                >
                    <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ flex: 1, paddingVertical: 14, backgroundColor: activeTab === 'configuracion' ? '#5b55c0' : '#2a2a2a', borderRadius: 12 }}
                    onPress={() => setActiveTab('configuracion')}
                >
                    <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Configuración</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}>
                {activeTab === 'perfil' ? (
                    <>
                        {user?.role === 'USER' ? (
                            <>
                                <ProfileHeader profile={steamProfile} loading={loading} />
                                <View style={{ marginVertical: 16, gap: 16 }}>
                                    <DonutGenresCard genres={genres.length > 0 ? genres : undefined} />
                                    <TopGamesCard games={topGames} loading={loading} isMobile={true} />
                                </View>
                                <SurveysGrid surveys={surveys} loading={loading} isMobile={true} />
                            </>
                        ) : (
                            <View style={{ backgroundColor: '#17171b', borderRadius: 16, padding: 24, marginTop: 20 }}>
                                <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 8 }}>
                                    {[userDb?.name || user?.name, userDb?.apellido1, userDb?.apellido2].filter(Boolean).join(' ') || "Usuario"}
                                </Text>
                                <Text style={{ color: '#888', fontSize: 16, textAlign: 'center', marginBottom: 16 }}>Rol: <Text style={{ color: '#5b55c0', fontWeight: 'bold' }}>{user?.role}</Text></Text>
                                <View style={{ height: 1, backgroundColor: '#333', marginVertical: 16 }} />
                                <Text style={{ color: '#ccc', textAlign: 'center' }}>Estás en tu perfil de gestión. Puedes editar tus datos en la pestaña "Configuración".</Text>
                            </View>
                        )}
                    </>
                ) : (
                    <SettingsTab
                        isMobile={true}
                        initialData={{
                            name: userDb?.name || user?.name || steamProfile?.personaName || '',
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
                )}
            </ScrollView>

            <MenuPrincipal visible={menuVisible} onClose={() => setMenuVisible(false)} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    menuBar: { borderBottomWidth: 1, borderBottomColor: '#1a1a2e' },
    tabBar: { flexDirection: 'row', backgroundColor: '#17171b', borderBottomWidth: 1, borderBottomColor: '#1a1a2e', paddingHorizontal: 16, paddingVertical: 10, paddingLeft: Platform.OS === 'web' ? 110 : 120 },
    tab: { paddingVertical: 14, paddingHorizontal: 24, marginRight: 4, borderBottomWidth: 3, borderBottomColor: 'transparent' },
    tabActive: { borderBottomColor: '#5b55c0' },
    tabText: { color: '#666', fontSize: 15, fontWeight: '600' },
    tabTextActive: { color: '#ffffff', textShadowColor: '#5b55c0', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8 },
    scroll: { flex: 1 },
    content: { padding: 16 },
    contentDesktop: { maxWidth: 1100, alignSelf: 'center', width: '100%', paddingHorizontal: 40 },
    middleRow: { marginBottom: 16 },
    middleRowMobile: { flexDirection: 'column', gap: 12 },
    middleRowDesktop: { flexDirection: 'row', gap: 16 },
    fullWidth: { width: '100%' },
    halfWidth: { flex: 1 },
    settingsWrapper: { flex: 1, padding: 16 },
    settingsWrapperDesktop: { maxWidth: 800, alignSelf: 'center', width: '100%', paddingHorizontal: 40 },
    fallbackCard: { backgroundColor: '#17171b', borderRadius: 12, borderWidth: 1, borderColor: '#2a2a3a' }
});