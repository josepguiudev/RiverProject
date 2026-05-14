import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import strings from "../../../assets/supportFiles/strings.json";

import MenuPrincipal from '@/app/components/Menu/CustomMenu';
import CustomDropdown from '@/app/components/CustomDropDown/CustomDropDown'; // 🛠️ Importamos tu Dropdown
import globalStyles from "@/assets/globalStyles/globalStyles";

const screenWidth = Dimensions.get("window").width;

export default function AdminGraphics({ navigation }: any) {
    const [loadingGrafico, setLoadingGrafico] = useState(false);
    const [loadingPantalla, setLoadingPantalla] = useState(true);
    
    const [encuestasDisponibles, setEncuestasDisponibles] = useState<any[]>([]);
    const [idEncuestaSeleccionada, setIdEncuestaSeleccionada] = useState<number | null>(null);
    
    const [chartData, setChartData] = useState<any>(null);
    const [totalVotos, setTotalVotos] = useState(0);
    const [menuVisible, setMenuVisible] = useState(false);

    // 🛠️ 1. CARGA INICIAL: Extraemos todas las encuestas creadas en el sistema
    useEffect(() => {
        fetch(`${strings.parte2Desktop}api/surveys/all`)
            .then(res => {
                if (!res.ok) throw new Error("Error obteniendo el listado de encuestas");
                return res.json();
            })
            .then((data: any[]) => {
                if (Array.isArray(data)) {
                    setEncuestasDisponibles(data);
                    // Si existen encuestas, seleccionamos la primera por defecto
                    if (data.length > 0) {
                        setIdEncuestaSeleccionada(data[0].id);
                    }
                }
                setLoadingPantalla(false);
            })
            .catch(err => {
                console.error("Error al cargar listado de encuestas:", err);
                setLoadingPantalla(false);
            });
    }, []);

    // 🛠️ 2. CARGA REACTIVA: Se dispara cada vez que cambia 'idEncuestaSeleccionada'
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
    }, [idEncuestaSeleccionada]); // 👈 Escucha este estado de forma activa

    const chartConfig = {
        backgroundGradientFrom: "#1b2838",
        backgroundGradientTo: "#171d25",
        color: (opacity = 1) => `rgba(102, 192, 244, ${opacity})`, 
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        barPercentage: 0.6,
        decimalPlaces: 0,
    };

    if (loadingPantalla) return <ActivityIndicator size="large" color="gold" style={styles.loader} />;

    // Mapeamos el listado al formato Option que exige tu CustomDropdown
    const opcionesDropdown = encuestasDisponibles.map(encuesta => ({
        id: encuesta.id,
        label: encuesta.name,
        value: encuesta.id.toString()
    }));

    return (
        <View style={[globalStyles.padre, { flex: 1, backgroundColor: '#0d1117', padding: 15 }]}>
            {/* HEADER */}
            <View style={[globalStyles.cajaMenu, globalStyles.borde, { height: 60, justifyContent: 'center', paddingHorizontal: 20 }]}>
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>{strings.menu}</Text>
                </TouchableOpacity>
            </View>
        
            <ScrollView style={styles.contenedor}>
                <Text style={styles.tituloHeader}>MÉTRICAS DE RESULTADOS</Text>

                {/* 🛠️ SELECTOR DESPLEGABLE DINÁMICO */}
                <View style={styles.contenedorSelector}>
                    <Text style={styles.labelSelector}>SELECCIONAR ENCUESTA</Text>
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
                            <Text style={styles.subtituloTarjeta}>Muestra total: {totalVotos} respuestas guardadas</Text>
                            
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
    contenedorSelector: { marginBottom: 20, backgroundColor: '#171d25', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#2a475e' },
    labelSelector: { color: '#66c0f4', fontSize: 10, fontWeight: '800', marginBottom: 6, letterSpacing: 1 },
    tarjetaGrafico: { backgroundColor: '#1b2838', borderRadius: 12, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: '#2a475e' },
    tituloTarjeta: { color: 'white', fontWeight: 'bold', fontSize: 14 },
    subtituloTarjeta: { color: '#66c0f4', fontSize: 11, marginTop: 2, fontWeight: '600' },
    estiloGrafico: { borderRadius: 8, marginTop: 15 }
});