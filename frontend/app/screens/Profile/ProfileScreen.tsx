import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import globalStyles from '@/assets/globalStyles/globalStyles';
import strings from '../../../assets/supportFiles/strings.json';
import MenuPrincipal from '@/app/components/Menu/CustomMenu';
import { useLayout } from '@/app/utils/useLayout';
import { useQuery } from '@tanstack/react-query';

import ProfileHeader from '@/app/components/Profile/ProfileHeader';
import DonutGenresCard from '@/app/components/Profile/DonutGenresCard';
import TopGamesCard from '@/app/components/Profile/TopGamesCard';
import SurveysGrid from '@/app/components/Profile/SurveysGrid';

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

export default function ProfileScreen({ navigation }: any) {
    const { isMobileView, isDesktopView } = useLayout();
    const [menuVisible, setMenuVisible] = useState(false);

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

            return {
                steamProfile: profileJson,
                topGames: gamesJson,
                surveys: surveysData
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

    return (
        <View style={[globalStyles.padre, globalStyles.tamanoCajaPadre]}>

            {/* Botón menú */}
            <View style={[globalStyles.cajaMenu, globalStyles.borde, globalStyles.alineadoPersonalVertical]}>
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 20 }}>
                    <Text style={{ color: 'white' }}>{strings.menu}</Text>
                </TouchableOpacity>
            </View>

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
                        <DonutGenresCard genres={[]} />
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

            <MenuPrincipal visible={menuVisible} onClose={() => setMenuVisible(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
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
});