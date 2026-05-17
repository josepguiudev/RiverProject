import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import strings from "../../../assets/supportFiles/strings.json";

import MenuPrincipal from '@/app/components/Menu/CustomMenu';
import CustomDropdown from '@/app/components/CustomDropDown/CustomDropDown'; 
import globalStyles from "@/assets/globalStyles/globalStyles";

// 1. IMPORTAMOS EL CONTEXTO DE AUTENTICACIÓN Y EL SERVICIO API
import { useAuth } from "../Auth/AuthContext"; 
import { FormApiService } from "../../services/api/service"; // Ajusta la ruta de importación de tu servicio
import client from "../../api/client"; // Usado para llamadas directas de métricas si no están en el servicio

const screenWidth = Dimensions.get("window").width;

export default function AdminGraphics({ navigation }: any) {
    const { user } = useAuth(); 
    const isAdmin = user?.role === 'ADMIN';

    const [loadingGrafico, setLoadingGrafico] = useState(false);
    const [loadingPantalla, setLoadingPantalla] = useState(true);
    
    const [encuestasDisponibles, setEncuestasDisponibles] = useState<any[]>([]);
    const [idEncuestaSeleccionada, setIdEncuestaSeleccionada] = useState<number | null>(null);
    
    const [totalEncuestasSistema, setTotalEncuestasSistema] = useState(0);
    const [totalRespondidasSistema, setTotalRespondidasSistema] = useState(0);

    const [chartData, setChartData] = useState<any>(null);
    const [totalVotos, setTotalVotos] = useState(0);
    const [menuVisible, setMenuVisible] = useState(false);

    // 1. CARGA INICIAL UTILIZANDO FORM_API_SERVICE
    useEffect(() => {
        const cargarDatosIniciales = async () => {
            if (!user?.id) return;
            try {
                let dataListado = [];

                // Carga de encuestas idéntica a la lógica del ClientDashboard
                if (isAdmin) {
                    dataListado = await FormApiService.getAllSurveys();
                } else {
                    dataListado = await FormApiService.getSurveysByClient(Number(user.id));
                }
                
                // Petición B: Métricas globales/específicas mediante la instancia Axios configurada
                let urlMetricas = "/api/surveys/metrics/global-summary";
                if (!isAdmin) {
                    urlMetricas = `/api/surveys/metrics/summary/${user.id}`;
                }
                
                const resMetricas = await client.get(urlMetricas);
                const dataMetricas = resMetricas.data;

                if (Array.isArray(dataListado)) {
                    setEncuestasDisponibles(dataListado);
                    if (dataListado.length > 0) {
                        // Cambiado defensivamente a .idForm o .id según cómo lo use tu interfaz/backend
                        const primerId = dataListado[0].id || dataListado[0].id;
                        if (primerId) setIdEncuestaSeleccionada(Number(primerId));
                    }
                }

                setTotalEncuestasSistema(dataMetricas.totalSurveys || 0);
                setTotalRespondidasSistema(dataMetricas.totalAnswered || 0);

            } catch (err) {
                console.error("Error al cargar la configuración inicial de métricas:", err);
            } finally {
                setLoadingPantalla(false);
            }
        };

        cargarDatosIniciales();
    }, [user?.id, user?.role]);

    // 2. CARGA REACTIVA: Gráfico dinámico usando el cliente Axios unificado
    useEffect(() => {
        if (idEncuestaSeleccionada == null) return;

        setLoadingGrafico(true);
        client.get(`/api/surveys/${idEncuestaSeleccionada}/resultados`)
            .then(res => {
                const data = res.data;
                const labels = data.map((item: any) => item.opcion || "Opción");
                const votos = data.map((item: any) => Number(item.votos || 0));
                
                const suma = votos.reduce((acc: number, current: number) => acc + current, 0);
                setTotalVotos(suma);

                setChartData({
                    labels: labels.length > 0 ? labels : ["Sin respuestas"],
                    datasets: [{ data: votos.length > 0 ? votos : [0] }]
                });
                setLoadingGrafico(false);
            })
            .catch(err => {
                console.error("Fallo de red cargando gráfico dinámico:", err);
                setLoadingGrafico(false);
            });
    }, [idEncuestaSeleccionada]);

    const chartConfig = {
        backgroundGradientFrom: "#1b2838",
        backgroundGradientTo: "#171d25",
        color: (opacity = 1) => `rgba(102, 192, 244, ${opacity})`, 
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        barPercentage: 0.6,
        decimalPlaces: 0,
    };

    if (loadingPantalla) return <ActivityIndicator size="large" color="gold" style={styles.loader} />;

    // Mapeo adaptado con alternativas defensivas (name, title) según tus interfaces de types
    const opcionesDropdown = encuestasDisponibles.map(encuesta => {
        const idEncuesta = encuesta.id || encuesta.idForm;
        return {
            id: idEncuesta,
            label: encuesta.name || encuesta.title || `Encuesta #${idEncuesta}`,
            value: idEncuesta ? idEncuesta.toString() : ""
        };
    });

    return (
        <View style={[globalStyles.padre, { flex: 1, backgroundColor: '#0d1117', padding: 15 }]}>
            {/* HEADER */}
            <View style={[globalStyles.cajaMenu, { height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }]}>
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>{strings.menu}</Text>
                </TouchableOpacity>
                <Text style={{ color: 'gold', marginLeft: 20, fontWeight: '600', fontSize: 12 }}>
                    {isAdmin ? "VISTA: ADMINISTRADOR GLOBAL" : "VISTA: EMPRESA"}
                </Text>
            </View>
        
            <ScrollView style={styles.contenedor}>
                <Text style={styles.tituloHeader}>MÉTRICAS DE RESULTADOS</Text>

                {/* KPI CARDS */}
                <View style={styles.filaTarjetas}>
                    <View style={styles.tarjetaNumerica}>
                        <Text style={styles.numeroKpi}>{totalEncuestasSistema}</Text>
                        <Text style={styles.textoKpi}>{isAdmin ? "Encuestas sistema" : "Mis encuestas"}</Text>
                    </View>

                    <View style={[styles.tarjetaNumerica, { borderLeftColor: 'gold' }]}>
                        <Text style={[styles.numeroKpi, { color: 'gold' }]}>{totalRespondidasSistema}</Text>
                        <Text style={styles.textoKpi}>{isAdmin ? "Respondidas totales" : "Mis respuestas"}</Text>
                    </View>
                </View>

                {/* SELECTOR DESPLEGABLE */}
                <View style={styles.contenedorSelector}>
                    <Text style={styles.labelSelector}>FILTRAR POR FORMULARIO</Text>
                    {opcionesDropdown.length > 0 ? (
                        <CustomDropdown 
                            label="" 
                            options={opcionesDropdown} 
                            onSelect={item => setIdEncuestaSeleccionada(Number(item.id))}
                        />
                    ) : (
                        <Text style={{ color: '#aaa', fontSize: 12, paddingVertical: 5 }}>No tienes encuestas asignadas.</Text>
                    )}
                </View>

                {loadingGrafico ? (
                    <ActivityIndicator size="large" color="gold" style={{ marginTop: 40 }} />
                ) : (
                    chartData && encuestasDisponibles.length > 0 && (
                        <View style={styles.tarjetaGrafico}>
                            <Text style={styles.tituloTarjeta}>VOTOS DE LOS USUARIOS</Text>
                            <Text style={styles.subtituloTarjeta}>Muestra específica: {totalVotos} votos de esta encuesta</Text>
                            
                            <BarChart
                                data={chartData}
                                width={screenWidth - 50}
                                height={240}
                                yAxisLabel=""
                                yAxisSuffix=""
                                chartConfig={chartConfig}
                                verticalLabelRotation={0}
                                fromZero={true}
                                style={styles.estiloGrafico}
                            />
                        </View>
                    )
                )}
            </ScrollView>

            <MenuPrincipal visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: '#0d1117', padding: 15 },
    loader: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
    tituloHeader: { color: 'gold', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', letterSpacing: 1 },
    filaTarjetas: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, gap: 12 },
    tarjetaNumerica: { flex: 1, backgroundColor: '#1b2838', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#2a475e', borderLeftWidth: 4, borderLeftColor: '#66c0f4', alignItems: 'center' },
    numeroKpi: { color: '#66c0f4', fontSize: 26, fontWeight: '900', marginBottom: 2 },
    textoKpi: { color: '#889fb2', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
    contenedorSelector: { marginBottom: 20, backgroundColor: '#171d25', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#2a475e' },
    labelSelector: { color: '#66c0f4', fontSize: 10, fontWeight: '800', marginBottom: 6, letterSpacing: 1 },
    tarjetaGrafico: { backgroundColor: '#1b2838', borderRadius: 12, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: '#2a475e' },
    tituloTarjeta: { color: 'white', fontWeight: 'bold', fontSize: 14 },
    subtituloTarjeta: { color: '#66c0f4', fontSize: 11, marginTop: 2, fontWeight: '600' },
    estiloGrafico: { borderRadius: 8, marginTop: 15 }
});