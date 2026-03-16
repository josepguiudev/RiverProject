import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import globalStyles from '@/assets/globalStyles/globalStyles';
import styles from './styles';
import MenuPrincipal from "@/app/components/Menu/CustomMenu";
import strings from "../../../assets/supportFiles/strings.json";

export default function ProfileScreen({ navigation }: any) {
    const [menuVisible, setMenuVisible] = useState(false);
    
    // Estado para almacenar las encuestas provenientes de la API
    const [surveys, setSurveys] = useState<any[]>([]);
    const [loadingSurveys, setLoadingSurveys] = useState(true);

    // SECCIÓN 3: lógica para obtener los formularios realizados por el usuario
    useEffect(() => {
        const fetchMySurveys = async () => {
            try {
                // He usado `localhost` puesto que la petición principal es asumiendo que es en WEB.
                // Si usas el emulador de android cambiar localhost por 10.0.2.2!
                const baseUrl = 'http://localhost:8080/api/formSurvey/responses';
                const response = await axios.get(baseUrl);
                
                // MOCK UP: En la realidad aquí harías un .filter() y te quedarías con las de tu usuario.
                // const misEncuestas = response.data.filter((encuesta: any) => encuesta.id_creador === miIdDeSteam);
                const misEncuestas = response.data; // Aquí me guardo todas de momento

                setSurveys(misEncuestas);
            } catch (error) {
                console.error("Error obteniendo las encuestas de la API:", error);
            } finally {
                setLoadingSurveys(false);
            }
        };

        fetchMySurveys();
    }, []);

    // Función auxiliar para dar formato a la fecha devuelta por Java
    const formatDate = (dateString: string) => {
        if (!dateString) return "Fecha desconocida";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <View style={[globalStyles.padre, globalStyles.tamanoCajaPadre]}>
            {/* Header del Layout Global (Boton de Menu) */}
            <View style={[globalStyles.cajaMenu, globalStyles.borde, globalStyles.alineadoPersonalVertical]}>
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 20 }}>
                    <Text style={{ color: 'white' }}>{strings.menu}</Text>
                </TouchableOpacity>
            </View>

            {/* Contenido scrolleable del Perfil */}
            <ScrollView style={styles.container}>
                
                {/* 1. SECCIÓN DE ENCABEZADO (A implementar por ti) */}
                <View style={[styles.headerSection, globalStyles.borde2]}>
                    <Text style={{ color: 'white' }}>[1] Sección Encabezado (Foto, Nombre, SteamID y Estado)</Text>
                    <Text style={{ color: '#a2a8d3', fontSize: 12 }}>¡Implementame aquí usando la API de Steam!</Text>
                </View>

                {/* 2. SECCIÓN GRÁFICA Y TOP JUEGOS (A implementar por ti) */}
                <View style={styles.middleSection}>
                    <View style={[styles.chartPlaceholder, globalStyles.borde3]}>
                        <Text style={{ color: 'white', textAlign: 'center' }}>[2] Donut Gráfica Géneros</Text>
                    </View>
                    <View style={[styles.gamesPlaceholder, globalStyles.borde3]}>
                        <Text style={{ color: 'white', textAlign: 'center' }}>[2] Escalera Top Juegos</Text>
                    </View>
                </View>

                {/* 3. SECCIÓN ENCUESTAS (Implementado como solicitaste) */}
                <Text style={styles.surveysTitle}>Mis Encuestas Realizadas</Text>
                
                {loadingSurveys ? (
                    <ActivityIndicator size="large" color="#e43f5a" />
                ) : (
                    <View style={styles.surveysGrid}>
                        {surveys.length > 0 ? (
                            surveys.map((survey, index) => (
                                <View key={survey.id_survey || index} style={styles.surveyCard}>
                                    {/* Cantidad visual o ID */}
                                    <Text style={styles.surveyCount}>
                                        #{survey.id_survey || (index + 1)}
                                    </Text>
                                    
                                    {/* Titulo */}
                                    <Text style={styles.surveyName} numberOfLines={2}>
                                        {survey.name || 'Encuesta sin título'}
                                    </Text>
                                    
                                    {/* Fecha (Usamos creationDate o launchDate) */}
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

                {/* Espacio para que el scroll llegue al final tranquilamente */}
                <View style={{ height: 100 }} />
            </ScrollView>

            <MenuPrincipal 
                visible={menuVisible} 
                onClose={() => setMenuVisible(false)} 
            />
        </View>
    );
}
