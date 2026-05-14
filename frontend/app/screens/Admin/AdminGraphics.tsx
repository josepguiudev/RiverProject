import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import strings from "../../../assets/supportFiles/strings.json";

import MenuPrincipal from '@/app/components/Menu/CustomMenu';
import CustomDropdown from '@/app/components/CustomDropDown/CustomDropDown'; 
import globalStyles from "@/assets/globalStyles/globalStyles";

const screenWidth = Dimensions.get("window").width;

export default function AdminGraphics({ navigation }: any) {
    const [loadingGrafico, setLoadingGrafico] = useState(false);
    const [loadingPantalla, setLoadingPantalla] = useState(true);
    
    const [encuestasDisponibles, setEncuestasDisponibles] = useState<any[]>([]);
    const [idEncuestaSeleccionada, setIdEncuestaSeleccionada] = useState<number | null>(null);
    
    // 🛠️ ESTADOS NUEVOS: Guardan los contadores numéricos globales
    const [totalEncuestasSistema, setTotalEncuestasSistema] = useState(0);
    const [totalRespondidasSistema, setTotalRespondidasSistema] = useState(0);

    const [chartData, setChartData] = useState<any>(null);
    const [totalVotos, setTotalVotos] = useState(0);
    const [menuVisible, setMenuVisible] = useState(false);

    // 1. CARGA INICIAL: Listado de encuestas + Contadores de participación globales
    useEffect(() => {
        const cargarDatosIniciales = async () => {
            try {
                // Petición A: Listado para el Dropdown
                const resListado = await fetch(`${strings.parte2Desktop}api/surveys/all`);
                const dataListado = await resListado.json();
                
                // Petición B: Métricas de las tarjetas numéricas
                const resMetricas = await fetch(`${strings.parte2Desktop}api/surveys/metrics/global-summary`);
                const dataMetricas = await resMetricas.json();

                if (Array.isArray(dataListado)) {
                    setEncuestasDisponibles(dataListado);
                    if (dataListado.length > 0) {
                        setIdEncuestaSeleccionada(dataListado[0].id);
                    }
                }

                // Guardamos los contadores numéricos devueltos por el backend
                setTotalEncuestasSistema(dataMetricas.totalSurveys || 0);
                setTotalRespondidasSistema(dataMetricas.totalAnswered || 0);

            } catch (err) {
                console.error("Error al cargar la configuración inicial de métricas:", err);
            } finally {
                setLoadingPantalla(false);
            }
        };

        cargarDatosIniciales();
    }, []);

    // 2. CARGA REACTIVA: Se ejecuta al cambiar la selección en el desplegable
    useEffect(() => {
        if (idEncuestaSeleccionada == null) return;

        setLoadingGrafico(true);
        fetch(`${strings.parte2Desktop}api/surveys/${idEncuestaSeleccionada}/resultados`)
            .then(res => {
                if (!res.ok) throw new Error("Error en respuesta de métricas");
                return res.json();
            })
            .then((data: any[]) => {
                const labels = data.map(item => item.opcion || "Opción");
                const votos = data.map(item => Number(item.votos || 0));
                
                const suma = votos.reduce((acc, current) => acc + current, 0);
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

    const opcionesDropdown = encuestasDisponibles.map(encuesta => ({
        id: encuesta.id,
        label: encuesta.name,
        value: encuesta.id.toString()
    }));

    return (
        <View style={[globalStyles.padre, { flex: 1, backgroundColor: '#0d1117', padding: 15 }]}>
            {/* HEADER */}
            <View style={[globalStyles.cajaMenu, { height: 60, justifyContent: 'center', paddingHorizontal: 20 }]}>
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>{strings.menu}</Text>
                </TouchableOpacity>
            </View>
        
            <ScrollView style={styles.contenedor}>
                <Text style={styles.tituloHeader}>MÉTRICAS DE RESULTADOS</Text>

                {/* 🛠️ SECCIÓN NUEVA: TARJETAS CON CONTADORES GLOBALES (KPI CARDS) */}
                <View style={styles.filaTarjetas}>
                    <View style={styles.tarjetaNumerica}>
                        <Text style={styles.numeroKpi}>{totalEncuestasSistema}</Text>
                        <Text style={styles.textoKpi}>Encuestas creadas</Text>
                    </View>

                    <View style={[styles.tarjetaNumerica, { borderLeftColor: 'gold' }]}>
                        <Text style={[styles.numeroKpi, { color: 'gold' }]}>{totalRespondidasSistema}</Text>
                        <Text style={styles.textoKpi}>Respondidas totales</Text>
                    </View>
                </View>

                {/* SELECTOR DESPLEGABLE */}
                <View style={styles.contenedorSelector}>
                    <Text style={styles.labelSelector}>FILTRAR POR FORMULARIO</Text>
                    <CustomDropdown 
                        label="" 
                        options={opcionesDropdown} 
                        onSelect={item => setIdEncuestaSeleccionada(Number(item.id))}
                    />
                </View>

                {loadingGrafico ? (
                    <ActivityIndicator size="large" color="gold" style={{ marginTop: 40 }} />
                ) : (
                    chartData && (
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
    
    // Estilos de las nuevas tarjetas KPI
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