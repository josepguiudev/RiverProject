import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	ScrollView,
	Dimensions,
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import strings from "../../assets/supportFiles/strings.json";

import MenuPrincipal from "@/app/components/Menu/CustomMenu";
import CustomDropdown from "@/app/components/CustomDropDown/CustomDropDown";
import globalStyles from "@/assets/globalStyles/globalStyles";

import { useAuth } from "./Auth/AuthContext";
import { FormApiService } from "../services/api/service";
import client from "../api/client";

const screenWidth = Dimensions.get("window").width;

export default function SurveyAnalyticsScreen({ navigation, route }: any) {
	const { user } = useAuth();

	const urlSurveyId = route?.params?.surveyId
		? Number(route.params.surveyId)
		: null;

	const [loadingGrafico, setLoadingGrafico] = useState(false);
	const [loadingPantalla, setLoadingPantalla] = useState(true);

	const [encuestasDisponibles, setEncuestasDisponibles] = useState<any[]>([]);
	const [idEncuestaSeleccionada, setIdEncuestaSeleccionada] = useState<
		number | null
	>(urlSurveyId);

	// Guardará la encuesta seleccionada encontrada de la lista local
	const [datosEncuestaActual, setDatosEncuestaActual] = useState<any>(null);

	const [chartData, setChartData] = useState<any>(null);
	const [totalVotos, setTotalVotos] = useState(0);
	const [menuVisible, setMenuVisible] = useState(false);

	// 1. CARGA INICIAL: TRAER EL LISTADO DE ENCUESTAS DEL CLIENTE
	useEffect(() => {
		const cargarListado = async () => {
			if (!user?.id) return;
			try {
				const dataListado = await FormApiService.getSurveysByClient(
					Number(user.id),
				);

				if (Array.isArray(dataListado)) {
					setEncuestasDisponibles(dataListado);

					// Sincronizar ID activo inicial
					if (urlSurveyId) {
						setIdEncuestaSeleccionada(urlSurveyId);
					} else if (dataListado.length > 0) {
						const primerId = dataListado[0].id || dataListado[0].id;
						if (primerId)
							setIdEncuestaSeleccionada(Number(primerId));
					}
				}
			} catch (err) {
				console.error(
					"Error al cargar el listado de encuestas del cliente:",
					err,
				);
			} finally {
				setLoadingPantalla(false);
			}
		};

		cargarListado();
	}, [user?.id, urlSurveyId]);

	// 2. BUSCAR METADATA LOCAL CUANDO CAMBIE LA SELECCIÓN
	useEffect(() => {
		if (idEncuestaSeleccionada == null || encuestasDisponibles.length === 0)
			return;

		// Buscamos el objeto coincidente de lo que ya bajamos en el listado inicial
		const encontrada = encuestasDisponibles.find((e) => {
			const currentId = e.id || e.idForm;
			return Number(currentId) === idEncuestaSeleccionada;
		});

		if (encontrada) {
			setDatosEncuestaActual(encontrada);
		}
	}, [idEncuestaSeleccionada, encuestasDisponibles]);

	// 3. CARGA DEL GRÁFICO (Aislado para que vuelva a funcionar al 100%)
	useEffect(() => {
		if (idEncuestaSeleccionada == null) return;

		setLoadingGrafico(true);

		client
			.get(`/api/surveys/${idEncuestaSeleccionada}/resultados`)
			.then((res) => {
				const data = res.data;
				if (!data || data.length === 0) {
					setChartData({
						labels: ["Sin respuestas"],
						datasets: [{ data: [0] }],
					});
					setTotalVotos(0);
					return;
				}

				const labels = data.map((item: any) => item.opcion || "Opción");
				const votos = data.map((item: any) => Number(item.votos || 0));

				const suma = votos.reduce(
					(acc: number, current: number) => acc + current,
					0,
				);
				setTotalVotos(suma);

				setChartData({
					labels: labels,
					datasets: [{ data: votos }],
				});
			})
			.catch((err) => {
				console.error(
					`Fallo al recuperar los resultados gráficos del ID ${idEncuestaSeleccionada}:`,
					err,
				);
				setChartData({
					labels: ["Sin respuestas"],
					datasets: [{ data: [0] }],
				});
				setTotalVotos(0);
			})
			.finally(() => {
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

	if (loadingPantalla)
		return (
			<ActivityIndicator
				size="large"
				color="gold"
				style={styles.loader}
			/>
		);

	const opcionesDropdown = encuestasDisponibles.map((encuesta) => {
		const idEncuesta = encuesta.id || encuesta.idForm;
		return {
			id: idEncuesta,
			label: encuesta.name || encuesta.title || `Encuesta #${idEncuesta}`,
			value: idEncuesta ? idEncuesta.toString() : "",
		};
	});

	const valorSeleccionadoDropdown = opcionesDropdown.find(
		(o) => Number(o.id) === idEncuestaSeleccionada,
	);

	return (
		<View
			style={[
				globalStyles.padre,
				{ flex: 1, backgroundColor: "#0d1117", padding: 15 },
			]}
		>
			{/* HEADER */}
			<View
				style={[
					globalStyles.cajaMenu,
					{
						height: 60,
						flexDirection: "row",
						alignItems: "center",
						paddingHorizontal: 20,
					},
				]}
			>
				<TouchableOpacity onPress={() => setMenuVisible(true)}>
					<Text style={{ color: "white", fontWeight: "bold" }}>
						{strings.menu}
					</Text>
				</TouchableOpacity>
				<Text
					style={{
						color: "gold",
						marginLeft: 20,
						fontWeight: "600",
						fontSize: 12,
					}}
				>
					VISTA: RENDIMIENTO DE ENCUESTA
				</Text>
			</View>

			<ScrollView style={styles.contenedor}>
				{/* SELECTOR DESPLEGABLE */}
				{opcionesDropdown.length > 0 && (
					<View style={styles.contenedorSelector}>
						<CustomDropdown
							label={
								valorSeleccionadoDropdown
									? valorSeleccionadoDropdown.label
									: "Cambiar de encuesta"
							}
							options={opcionesDropdown}
							onSelect={(item) =>
								setIdEncuestaSeleccionada(Number(item.id))
							}
						/>
					</View>
				)}

				{/* BLOQUE DE DATOS DE LA ENCUESTA ACTIVA */}
				{datosEncuestaActual && (
					<View style={styles.tarjetaInfo}>
						<Text style={styles.tituloSeccion}>
							INFORMACIÓN EN TIEMPO REAL
						</Text>
						<Text style={styles.nombreEncuesta}>
							{datosEncuestaActual.name ||
								datosEncuestaActual.title}
						</Text>

						<View style={styles.gridInfo}>
							<View style={styles.itemInfo}>
								<Text style={styles.labelInfo}>ESTADO</Text>
								<Text
									style={[
										styles.valorInfo,
										{
											color:
												datosEncuestaActual.status ===
													true ||
												datosEncuestaActual.status ===
													"ACTIVA"
													? "#22C55E"
													: "#EAB308",
										},
									]}
								>
									{datosEncuestaActual.status === true ||
									datosEncuestaActual.status === "ACTIVA"
										? "ACTIVA"
										: "BORRADOR"}
								</Text>
							</View>

							<View style={styles.itemInfo}>
								<Text style={styles.labelInfo}>PREGUNTAS</Text>
								<Text style={styles.valorInfo}>
									{datosEncuestaActual.questions?.length ||
										datosEncuestaActual.numQuestions ||
										"—"}
								</Text>
							</View>

							<View style={styles.itemInfo}>
								<Text style={styles.labelInfo}>RESPUESTAS</Text>
								<Text
									style={[
										styles.valorInfo,
										{ color: "gold" },
									]}
								>
									{totalVotos}
								</Text>
							</View>
						</View>
					</View>
				)}

				{/* GRÁFICO DE BARRAS */}
				{loadingGrafico ? (
					<ActivityIndicator
						size="large"
						color="gold"
						style={{ marginTop: 40 }}
					/>
				) : (
					chartData && (
						<View style={styles.tarjetaGrafico}>
							<Text style={styles.tituloTarjeta}>
								DISTRIBUCIÓN DE VOTOS
							</Text>
							<Text style={styles.subtituloTarjeta}>
								Frecuencia de respuestas registradas
							</Text>

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

			<MenuPrincipal
				visible={menuVisible}
				onClose={() => setMenuVisible(false)}
				navigation={navigation}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	contenedor: { flex: 1, backgroundColor: "#0d1117", padding: 15 },
	loader: { flex: 1, backgroundColor: "#000", justifyContent: "center" },
	contenedorSelector: { marginBottom: 15 },

	// Estilos de la tarjeta informativa KPI
	tarjetaInfo: {
		backgroundColor: "#171d25",
		borderRadius: 12,
		padding: 16,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: "#2a475e",
	},
	tituloSeccion: {
		color: "#66c0f4",
		fontSize: 10,
		fontWeight: "800",
		letterSpacing: 1,
		marginBottom: 4,
	},
	nombreEncuesta: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 15,
	},
	gridInfo: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
	itemInfo: {
		flex: 1,
		backgroundColor: "#1b2838",
		padding: 10,
		borderRadius: 8,
		alignItems: "center",
		borderWidth: 0.5,
		borderColor: "#2a475e",
	},
	labelInfo: {
		color: "#889fb2",
		fontSize: 9,
		fontWeight: "bold",
		marginBottom: 4,
		letterSpacing: 0.5,
	},
	valorInfo: { color: "white", fontSize: 15, fontWeight: "900" },

	// Estilos del gráfico
	tarjetaGrafico: {
		backgroundColor: "#1b2838",
		borderRadius: 12,
		padding: 15,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: "#2a475e",
	},
	tituloTarjeta: {
		color: "white",
		fontWeight: "bold",
		fontSize: 13,
		letterSpacing: 0.5,
	},
	subtituloTarjeta: {
		color: "#66c0f4",
		fontSize: 11,
		marginTop: 2,
		fontWeight: "600",
	},
	estiloGrafico: { borderRadius: 8, marginTop: 15 },
});
