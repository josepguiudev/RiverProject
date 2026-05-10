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

// La Screen del Perfil es la que se encarga de llamar a la API y a la BD.
// Por lo tanto, es la que se encarga de obtener los datos y pasarlos a los componentes.
// Los componentes solo se encargan de mostrar los datos.

/* Por lo tanto, las responsabilidades de esta screen son:
1. Hablar con Java (fetch o axios).
2. Almacenar los datos en su memoria (useState).
3. Decidir cuándo mostrar las ruedas de carga (loading).
4. Repartir el trabajo a los componentes hijos inyectándoles los datos a través de las **props**.
*/

// ── Sub-pestañas del perfil ──
type ProfileTab = 'perfil' | 'configuracion';

export default function ProfileScreen({ navigation }: any) {
    const { isMobileView, isDesktopView } = useLayout();
    const [menuVisible, setMenuVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<ProfileTab>('perfil');
    const { user } = useAuth(); // Usuario logueado (contiene id, name, email)

    const steamId = strings.idPlayerJoako || '76561199167008828';
    const apiKey = Constants.expoConfig?.extra?.STEAM_API_KEY || '';

    // useEffect tiene problemas ocultos se ve, así que por eso usé TanStack Query. Los problemas son:
    // 1. No siempre se ejecuta cuando debería.
    // 2. A veces se ejecuta más veces de las que debería.
    // 3. Si el componente se desmonta y se vuelve a montar, se ejecuta de nuevo y gasta aún más recursos.
    // De lado los problemas, con useEffect hay que crear variables useState a mano para los datos, errores y loadings.

    // TanStack Query te permite gestionar el estado de la petición (loading, error, data) de forma automática.
    // Por lo tanto, no es necesario crear variables useState a mano para los datos, errores y loadings.

    // profileData es un objeto que contiene los datos del perfil (steamProfile, topGames, surveys) que devuelve la función esta.
    // isLoading es un booleano que indica si los datos se están cargando. Con esto no hace falta 
    // crear variables manualmente de loading :)). Btw, isLoading funciona como una promesa de que 
    // no hará nada hasta tener todos los datos.
    const { data: profileData, isLoading: loading } = useQuery({
        // querykey identifica que un usuario está en perfil así que muestra los datos de x usuario, y así con todos.
        // Por lo tanto, si cambia el steamId, se ejecuta de nuevo la query.
        queryKey: ['profile', steamId],
        // queryFn es la función que se encarga de obtener los datos (ay lupita) de Java.
        queryFn: async () => {
            // 1. Sincronizar (opcional si ya está en DB, pero lo mantenemos como pediste)
            await fetch(`${BASE_URL}/api/games/sync-library?steamid=${steamId}&apiKey=${apiKey}`);

            // 2. Cargar Perfil desde la DB de Java (Cambiado a by-bd-steamid que es @PathVariable)
            const profileRes = await fetch(`${BASE_URL}/api/usersteam/by-bd-steamid/${steamId}`);
            const profileJson = await profileRes.json();

            // 3. Cargar Juegos (Top 3)
            const gamesRes = await fetch(`${BASE_URL}/api/games/top3/${steamId}`);
            const gamesJson = await gamesRes.json();

            // 4. Cargar Encuestas (Usando el id_user de la DB que viene dentro del perfil)
            const userId = profileJson.id;
            let surveysData = [];
            if (userId) {
                const surveysRes = await axios.get(`${BASE_URL}/api/surveys/user/${userId}`);
                surveysData = surveysRes.data;
            }

            // 5. Cargar Géneros top 5 del usuario (a partir de sus juegos)
            // Ruta real: GET /api/games/top-genres/{steamid}
            // Respuesta esperada: [{ name: "Shooter", percentage: 35 }, ...]
            // Fallback: si el backend no responde, el componente DonutGenresCard usa sus datos mock.
            let genresData: { name: string; percentage: number }[] = [];
            try {
                const genresRes = await fetch(`${BASE_URL}/api/games/top-genres/${steamId}`);
                if (genresRes.ok) {
                    genresData = await genresRes.json();
                }
            } catch {
                // Fallback: el backend no respondió — DonutGenresCard usará mock
            }

            // 6. Cargar datos del usuario de la BD (para Settings)
            // Ruta real: GET /api/users/{id}
            let userDbData = null;
            if (user?.id) {
                try {
                    const userRes = await apiFetch(`/api/users/${user.id}`);
                    if (userRes.ok) {
                        userDbData = await userRes.json();
                    }
                } catch {
                    // Fallback: no se pudo cargar datos del usuario de la BD
                }
            }

            return {
                steamProfile: profileJson,
                topGames: gamesJson,
                surveys: surveysData,
                genres: genresData,
                userDb: userDbData,
            };
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

            {/* Botón menú */}
            <View style={[globalStyles.cajaMenu, globalStyles.alineadoPersonalVertical, styles.menuBar]}>
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 20 }}>
                    <Text style={{ color: 'white' }}>{strings.menu}</Text>
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
                    {/* Sección 1 — Header */}
                    <ProfileHeader profile={steamProfile} loading={loading} />

                    {/* Sección 2 — Donut + Juegos
                        En móvil van en columna, en desktop en fila */}
                    <View style={[
                        styles.middleRow,
                        isMobileView ? styles.middleRowMobile : styles.middleRowDesktop
                    ]}>
                        <View style={isMobileView ? styles.fullWidth : styles.halfWidth}>
                            <DonutGenresCard genres={genres.length > 0 ? genres : undefined} />
                        </View>
                        <View style={isMobileView ? styles.fullWidth : styles.halfWidth}>
                            {/* games={topGames} recibe los 3 juegos principales del usuario (ya cargados desde la BD) 
                            y en loading={loading} definimos si la rueda sigue girando */}
                            <TopGamesCard
                                games={topGames} // Esta es una prop mencionada arriba del todo (linea 25), en este 
                                // caso esta está devolviendo el valor de estado 'topGames' (linea 107)
                                loading={loading} //Aquí esta prop está devolviendo el valor de estado 'loading'
                                isMobile={isMobileView}
                            // Luego el componente en cuestión (TopGamesCard) se encarga de recoger estas props 
                            // y mostrar los datos como si dichas props fuesen los paramatros de entrada de una función

                            // En resumen, las props son como el hilo conector de la comunicación entre componentes.
                            // El componente padre le pasa las props al componente hijo, y el componente hijo 
                            // se encarga de recoger estas props y mostrar los datos como si dichas props fuesen 
                            // los paramatros de entrada de una función :))
                            />
                        </View>
                    </View>

                    {/* Sección 3 — Encuestas */}
                    <SurveysGrid
                        surveys={surveys}
                        loading={loading}
                        isMobile={isMobileView}
                    />

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
                            name: userDb?.name || user?.name || steamProfile?.personaName || steamProfile?.personaname || '',
                            apellido1: userDb?.apellido1 || '',
                            apellido2: userDb?.apellido2 || '',
                            email: userDb?.email || user?.email || '',
                            edad: userDb?.edad ? String(userDb.edad) : '',
                            localizacion: userDb?.localizacion || '',
                            steamId: userDb?.urlIdStream || steamId,
                        }}
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