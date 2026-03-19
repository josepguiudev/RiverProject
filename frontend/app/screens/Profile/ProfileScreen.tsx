import React, { useState, useEffect } from 'react'; // Con useEffect decimos el cómo y cuando queremos ver las cosas guardadas de la API.
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import globalStyles from '@/assets/globalStyles/globalStyles';
import styles from './styles';
import MenuPrincipal from "@/app/components/Menu/CustomMenu";
import strings from "../../../assets/supportFiles/strings.json";
import Constants from 'expo-constants'; // Con esto decimos el qué (de ruta (URL) y contraseña de API (API KEY)) cuando react compila o la usamos en el front.

export default function ProfileScreen({ navigation }: any) {
    const [menuVisible, setMenuVisible] = useState(false);

    // Estado encuestas
    const [surveys, setSurveys] = useState<any[]>([]);
    const [loadingSurveys, setLoadingSurveys] = useState(true);

    // Estado Top Juegos y Géneros
    const [topGames, setTopGames] = useState<any[]>([]);
    const [topGenres, setTopGenres] = useState<string[]>([]);
    const [loadingSteam, setLoadingSteam] = useState(true);

    // SECCIÓN 2: Lógica para obtener Top 3 Juegos y Géneros de la API preparada en Backend
    useEffect(() => {
        const fetchSteamData = async () => {
            try {
                // ID Random (Placeholder). Usamos el de tu compañero Joako por ejemplo.
                const randomUserId = strings.idPlayerJoako || "76561199167008828";
                // La API Key la cogemos de Constants como en el otro archivo o se pasa nula si el back ya la tiene
                const apiKey = Constants.expoConfig?.extra?.STEAM_API_KEY || "";

                // Esta es la ruta que tu compañero diseñó en strings.json para Java Backend
                const steamBackUrl = `${strings.parte2Desktop}${strings.controllerGame}${strings.extraer}${randomUserId}${strings.key}${apiKey}`;

                // NOTA DOCUMENTACIÓN PARA TI: 
                // Usamos fetch / axios para llamar a VUESTRO BACKEND. Es mejor que el backend haga el trabajo
                // para que la key de steam no quede robable en el front.
                const response = await fetch(steamBackUrl);
                const data = await response.json();

                if (data && data.response && data.response.games) {
                    const games = data.response.games;

                    // 1. OBTENER EL TOP 3 DE JUEGOS
                    // Ordenamos de mayor a menor basándonos en playtime_2weeks (si existe por la semana) 
                    // o por playtime_forever si no ha jugado esta semana.
                    // Para evitar errores en caso de que playtime_2weeks venga undefinded (lo comun en steam)
                    // usaremos un fallback a forever mode.
                    const sortedGames = games.sort((a: any, b: any) => {
                        const playA = a.playtime_2weeks || a.playtime_forever;
                        const playB = b.playtime_2weeks || b.playtime_forever;
                        return playB - playA; // Orden descendente
                    });

                    // Nos quedamos los 3 primeros
                    const top3 = sortedGames.slice(0, 3);
                    setTopGames(top3);

                    // 2. EXTRAER GÉNEROS (Top 4)
                    // Steam "GetOwnedGames" normalmente NO devuelve géneros integrados (los géneros van atados directo en la store), 
                    // así que asumiremos si tu Backend Java lo ha inyectado, estará en una propiedad tipo "genres" del json.
                    // Caso contrario, pondré unos tags simulados, ya que este es el principal problema de Steam API.

                    const extractedGenres: string[] = ["Shooter", "RPG", "Acción táctica", "Estrategia"]; // MOCK
                    // Si tu backend devolviera géneros en un array "data.response.genres":
                    // const realGenres = data.response.genres || [];
                    // setTopGenres(realGenres.slice(0,4));

                    setTopGenres(extractedGenres);
                }
            } catch (error) {
                console.error("Error obteniendo datos de Steam desde Java:", error);
            } finally {
                setLoadingSteam(false);
            }
        };

        fetchSteamData();
    }, []);

    // SECCIÓN 3
    useEffect(() => {
        const fetchMySurveys = async () => {
            try {
                const baseUrl = 'http://localhost:8080/api/formSurvey/responses';
                const response = await axios.get(baseUrl);
                setSurveys(response.data);
            } catch (error) {
                console.error("Error obteniendo las encuestas de la API:", error);
            } finally {
                setLoadingSurveys(false);
            }
        };

        fetchMySurveys();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return "Fecha desconocida";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <View style={[globalStyles.padre, globalStyles.tamanoCajaPadre]}>
            <View style={[globalStyles.cajaMenu, globalStyles.borde, globalStyles.alineadoPersonalVertical]}>
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 20 }}>
                    <Text style={{ color: 'white' }}>{strings.menu}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container}>
                {/* 1. ENCABEZADO */}
                <View style={[styles.headerSection, globalStyles.borde2]}>
                    <Text style={{ color: 'white' }}>[1] Sección Encabezado</Text>
                    <Text style={{ color: '#a2a8d3', fontSize: 12 }}>Por implementar (GetPlayerSummaries)</Text>
                </View>

                {/* 2. GRÁFICA Y TOP JUEGOS CON IMÁGENES SUPERPUESTAS */}
                <View style={styles.middleSection}>
                    {/* Lista Top 4 Géneros (En lugar del Donut como pediste) */}
                    <View style={[styles.chartPlaceholder, globalStyles.borde3]}>
                        <Text style={styles.sectionTitle}>Top 4 Géneros</Text>
                        {loadingSteam ? (
                            <ActivityIndicator size="small" color="#e43f5a" />
                        ) : (
                            topGenres.map((genre, index) => (
                                <View key={index} style={styles.genreItem}>
                                    <Text style={styles.genreText}>{index + 1}. {genre}</Text>
                                </View>
                            ))
                        )}
                    </View>

                    {/* Top 3 Juegos Escalera */}
                    <View style={[styles.gamesPlaceholder, globalStyles.borde3]}>
                        <Text style={styles.sectionTitle}>Top Semanal</Text>
                        {loadingSteam ? (
                            <ActivityIndicator size="small" color="#e43f5a" />
                        ) : (
                            <View style={styles.staircaseContainer}>
                                {topGames.map((game, index) => {
                                    // URL generada con el string de la API (library_600x900)
                                    const imageUri = `${strings.ulrJpg}${game.appid}${strings.ulrJpg2}`;
                                    // Estilos de posición (Escalera Z-index)
                                    const positionStyle = index === 0 ? styles.game1 : index === 1 ? styles.game2 : styles.game3;

                                    return (
                                        <Image
                                            key={game.appid}
                                            source={{ uri: imageUri }}
                                            style={[styles.gameImage, positionStyle]}
                                            resizeMode="cover"
                                        />
                                    );
                                })}
                            </View>
                        )}
                    </View>
                </View>

                {/* 3. ENCUESTAS */}
                <Text style={styles.surveysTitle}>Mis Encuestas Realizadas</Text>
                {loadingSurveys ? (
                    <ActivityIndicator size="large" color="#e43f5a" />
                ) : (
                    <View style={styles.surveysGrid}>
                        {surveys.length > 0 ? (
                            surveys.map((survey, index) => (
                                <View key={survey.id_survey || index} style={styles.surveyCard}>
                                    <Text style={styles.surveyCount}>
                                        #{survey.id_survey || (index + 1)}
                                    </Text>
                                    <Text style={styles.surveyName} numberOfLines={2}>
                                        {survey.name || 'Encuesta sin título'}
                                    </Text>
                                    <Text style={styles.surveyDate}>
                                        {formatDate(survey.creationDate)}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.emptyText}>No has realizado ninguna encuesta todavía.</Text>
                        )}
                    </View>
                )}
                <View style={{ height: 100 }} />
            </ScrollView>
            <MenuPrincipal visible={menuVisible} onClose={() => setMenuVisible(false)} />
        </View>
    );
}
