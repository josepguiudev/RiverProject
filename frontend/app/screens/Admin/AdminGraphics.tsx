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
    
    const [totalEncuestasSistema, setTotalEncuestasSistema] = useState(0);
    const [totalRespondidasSistema, setTotalRespondidasSistema] = useState(0);

    const [listaGraficos, setListaGraficos] = useState<any[]>([]);
    const [totalVotos, setTotalVotos] = useState(0);
    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        const cargarDatosIniciales = async () => {
            try {
                const resListado = await fetch(`${strings.parte2Desktop}api/surveys/all`);
                if (!resListado.ok) throw new Error("Error en all");
                const dataListado = await resListado.json();
                
                const resMetricas = await fetch(`${strings.parte2Desktop}api/surveys/global/metrics-summary`);
                if (!resMetricas.ok) throw new Error("Error en metrics-summary");
                const dataMetricas = await resMetricas.json();

                if (Array.isArray(dataListado)) {
                    setEncuestasDisponibles(dataListado);
                    // 🛠️ CORRECCIÓN: Acceso seguro al índice del array para el primer ID
                    if (dataListado.length > 0 && dataListado[0]?.id) {
                        setIdEncuestaSeleccionada(dataListado[0].id);
                    }
                }
                setTotalEncuestasSistema(dataMetricas.totalSurveys || 0);
                setTotalRespondidasSistema(dataMetricas.totalAnswered || 0);
            } catch (err) {
                console.error("Error en configuración inicial:", err);
            } finally {
                setLoadingPantalla(false);
            }
        };
        cargarDatosIniciales();
    }, []);

    useEffect(() => {
        if (idEncuestaSeleccionada == null) return;

        setLoadingGrafico(true);
        fetch(`${strings.parte2Desktop}api/surveys/${idEncuestaSeleccionada}/resultados`)
            .then(res => {
                if (!res.ok) throw new Error("Error en respuesta de métricas");
                return res.json();
            })
            .then((data: any[]) => {
                const sumaVotos = data.reduce((acc, item) => acc + Number(item.votos || 0), 0);
                setTotalVotos(sumaVotos);

                const preguntasAgrupadas = data.reduce((groups: any, item: any) => {
                    const tituloPregunta = item.pregunta || "Pregunta General";
                    if (!groups[tituloPregunta]) {
                        groups[tituloPregunta] = { labels: [], data: [] };
                    }
                    groups[tituloPregunta].labels.push(item.opcion || "Opción");
                    groups[tituloPregunta].data.push(Number(item.votos || 0));
                    return groups;
                }, {});

                const graficosFormateados = Object.keys(preguntasAgrupadas).map(titulo => ({
                    tituloPregunta: titulo,
                    dataConfig: {
                        labels: preguntasAgrupadas[titulo].labels,
                        // 🛠️ CORRECCIÓN CRUCIAL: Se añade [0] como valor por defecto para evitar el crash de texto
                        datasets: [{ data: preguntasAgrupadas[titulo].data.length > 0 ? preguntasAgrupadas[titulo].data : [0] }]
                    }
                }));

                setListaGraficos(graficosFormateados);
                setLoadingGrafico(false);
            })
            .catch(err => {
                console.error("Fallo cargando gráficos múltiples:", err);
                setLoadingGrafico(false);
            });
    }, [idEncuestaSeleccionada]);

    const chartConfig = {
        backgroundGradientFrom: "#1b2838",
        backgroundGradientTo: "#171d25",
        color: (opacity = 1) => `rgba(102, 192, 244, ${opacity})`, 
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        barPercentage: 0.5,
        decimalPlaces: 0,
    };

    if (loadingPantalla) return <ActivityIndicator size="large" color="gold" style={styles.loader} />;

    return (
        <View style={[globalStyles.padre, { flex: 1, backgroundColor: '#0d1117', padding: 15 }]}>
            <View style={[globalStyles.cajaMenu, { height: 60, justifyContent: 'center', paddingHorizontal: 20 }]}>
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>{strings.menu}</Text>
                </TouchableOpacity>
            </View>
        
            <ScrollView style={styles.contenedor}>
                <Text style={styles.tituloHeader}>MÉTRICAS DE RESULTADOS</Text>

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

                <View style={styles.contenedorSelector}>
                    <Text style={styles.labelSelector}>FILTRAR POR FORMULARIO</Text>
                    <CustomDropdown 
                        label="" 
                        options={encuestasDisponibles.map(e => ({ id: e.id, label: e.name, value: e.id.toString() }))} 
                        onSelect={item => setIdEncuestaSeleccionada(Number(item.id))}
                    />
                </View>

                {loadingGrafico ? (
                    <ActivityIndicator size="large" color="gold" style={{ marginTop: 40 }} />
                ) : (
                    listaGraficos.length > 0 ? (
                        listaGraficos.map((grafico, index) => (
                            <View key={index} style={styles.tarjetaGrafico}>
                                <Text style={styles.tituloTarjeta}>{grafico.tituloPregunta.toUpperCase()}</Text>
                                <Text style={styles.subtituloTarjeta}>
                                    Muestra: {grafico.dataConfig.datasets[0].data.reduce((a: number, b: number) => a + b, 0)} votos en esta pregunta
                                </Text>
                                <BarChart
                                    data={grafico.dataConfig}
                                    width={screenWidth - 80}
                                    height={220}
                                    yAxisLabel=""
                                    yAxisSuffix=""
                                    chartConfig={chartConfig}
                                    verticalLabelRotation={0}
                                    fromZero={true}
                                    style={styles.estiloGrafico}
                                />
                            </View>
                        ))
                    ) : (
                        <View style={{ padding: 30, alignItems: 'center' }}>
                            <Text style={{ color: '#889fb2' }}>No hay votaciones registradas para esta encuesta</Text>
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
    tituloTarjeta: { color: 'white', fontWeight: 'bold', fontSize: 13, letterSpacing: 0.5, lineHeight: 18 },
    subtituloTarjeta: { color: '#66c0f4', fontSize: 11, marginTop: 4, fontWeight: '600' },
    estiloGrafico: { borderRadius: 8, marginTop: 12 }
});