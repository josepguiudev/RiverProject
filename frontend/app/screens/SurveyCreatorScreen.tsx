import React, { useState, useEffect } from "react";
import {
	ScrollView,
	TextInput,
	TouchableOpacity,
	FlatList,
	Text,
	Alert,
	ActivityIndicator,
	View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Question, Survey, Category, Genere } from "../types/formsSurvey.types";
import { FormApiService } from "../services/api/service";
import { QuestionCard } from "../components/QuestionCard/QuestionCard";
import { SurveySidebar } from "../components/QuestionCard/SurveySidebar";
import styles, { colors } from "./stylesGlobal";
import { useLayout } from "@/app/utils/useLayout";
import { useAuth } from "./Auth/AuthContext";
import CustomButton from "../components/CustomButton/CustomButton";

const SurveyCreatorScreen = ({ navigation }: any) => {
	const { isDesktopView } = useLayout();
	const { user } = useAuth();

	const [loading, setLoading] = useState(false);
	const [loadingMetadata, setLoadingMetadata] = useState(true);

	const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
	const [availableGeneres, setAvailableGeneres] = useState<Genere[]>([]);

	const [survey, setSurvey] = useState<Survey>({
		name: "",
		numUsers: 0,
		numQuestions: 0,
		questionList: [],
		categoryList: [],
		genereList: [],
		launchDate: new Date().toISOString(),
		closeDate: "",
	});

	useEffect(() => {
		const loadMetadata = async () => {
			try {
				const [cats, gens] = await Promise.all([
					FormApiService.getCategories(),
					FormApiService.getGeneres(),
				]);
				setAvailableCategories(cats);
				setAvailableGeneres(gens);
			} catch (error) {
				console.error("Error cargando metadatos:", error);
			} finally {
				setLoadingMetadata(false);
			}
		};
		loadMetadata();
	}, []);

	const addQuestion = () => {
		const newQuestion: Question = {
			textQuestion: "",
			config: {
				typeName: "SHORT_TEXT",
				isMultiple: false,
				attributes: "",
			},
			option: [],
		} as any;

		setSurvey({
			...survey,
			questionList: [...survey.questionList, newQuestion],
		});
	};

	const removeQuestion = (index: number) => {
		const updated = [...survey.questionList];
		updated.splice(index, 1);
		setSurvey({ ...survey, questionList: updated });
	};

	const updateQuestionText = (index: number, text: string) => {
		const updated = [...survey.questionList];
		updated[index].textQuestion = text;
		setSurvey({ ...survey, questionList: updated });
	};

	const updateType = (index: number, type: any) => {
		const updated = [...survey.questionList];
		updated[index].config = {
			typeName: type,
			isMultiple: type === "MULTIPLE_CHOICE",
			attributes: "",
		};
		updated[index].option =
			type === "SINGLE_CHOICE" || type === "MULTIPLE_CHOICE"
				? [{ textOpcion: "" }]
				: [];
		setSurvey({ ...survey, questionList: updated });
	};

	const addOption = (qIndex: number) => {
		const updated = [...survey.questionList];
		if (!updated[qIndex].option) updated[qIndex].option = [];
		updated[qIndex].option!.push({ textOpcion: "" });
		setSurvey({ ...survey, questionList: updated });
	};

	const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
		const updated = [...survey.questionList];
		if (updated[qIndex].option) {
			updated[qIndex].option![oIndex].textOpcion = text;
			setSurvey({ ...survey, questionList: updated });
		}
	};

	const handleSaveSurvey = async () => {
		if (!survey.name.trim() || survey.questionList.length === 0) {
			Alert.alert(
				"Error",
				"Completa el título y añade al menos una pregunta.",
			);
			return;
		}
		if (!user?.id) {
			Alert.alert("Error", "Sesión no válida.");
			return;
		}
		setLoading(true);
		try {
			await FormApiService.submitForm(survey, user.id);
			Alert.alert("Éxito", "Encuesta publicada correctamente.");
			navigation.goBack();
		} catch (error) {
			Alert.alert("Error", (error as Error).message);
		} finally {
			setLoading(false);
		}
	};

	if (loadingMetadata) {
		return (
			<View style={[styles.alineadoPersonal, { justifyContent: 'center' }]}>
				<ActivityIndicator size="large" color={colors.primary} />
				<Text style={{ color: '#fff', marginTop: 10 }}>Cargando configuración...</Text>
			</View>
		);
	}

	return (
		<ScrollView 
			contentContainerStyle={[styles.scrollContainer, { paddingVertical: 40 }]}
			style={{ backgroundColor: colors.background, flex: 1 }}
		>
			<View style={[styles.caja, { maxWidth: 800, width: '95%', alignSelf: 'center' }]}>
				
				{/* Botón Volver */}
				<TouchableOpacity 
					onPress={() => navigation.goBack()} 
					style={{ alignSelf: 'flex-start', marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}
				>
					<Ionicons name="arrow-back" size={20} color={colors.primary} />
					<Text style={{ color: colors.primary, fontWeight: 'bold', marginLeft: 5 }}>VOLVER</Text>
				</TouchableOpacity>

				{/* Títol Principal */}
				<View style={{ marginBottom: 30, alignItems: 'center' }}>
					<Text style={styles.tituloHero}>
						Nuevo <Text style={styles.destaqueAzul}>Proyecto</Text>
					</Text>
				</View>

				{/* Formulario */}
				<View style={{ width: "100%" }}>
					<TextInput
						placeholder="Título de la Encuesta..."
						placeholderTextColor="#666"
						style={styles.inputTitulo}
						value={survey.name}
						onChangeText={(text) =>
							setSurvey({ ...survey, name: text })
						}
					/>

					<FlatList
						data={survey.questionList}
						keyExtractor={(_, index) => index.toString()}
						scrollEnabled={false}
						renderItem={({ item, index }) => (
							<QuestionCard
								question={
									{
										...item,
										typeName: item.config?.typeName || "SHORT_TEXT",
									} as any
								}
								index={index}
								onUpdateQuestion={(text) => updateQuestionText(index, text)}
								onRemoveQuestion={() => removeQuestion(index)}
								onUpdateType={(type) => updateType(index, type)}
								onAddOption={() => addOption(index)}
								onUpdateOption={(text, oIndex) => updateOptionText(index, oIndex, text)}
							/>
						)}
						ListFooterComponent={
							<TouchableOpacity
								style={styles.btnSecondary}
								onPress={addQuestion}
							>
								<Text style={{ color: colors.text, fontWeight: "bold" }}>
									+ AÑADIR PREGUNTA
								</Text>
							</TouchableOpacity>
						}
					/>

					<View style={{ marginTop: 30 }}>
						<SurveySidebar
							survey={survey}
							setSurvey={setSurvey}
							availableCategories={availableCategories}
							availableGeneres={availableGeneres}
						/>
					</View>
					
					<View style={{ alignItems: 'center', marginTop: 40 }}>
						<CustomButton 
							title="PUBLICAR PROYECTO" 
							onPress={handleSaveSurvey} 
							loading={loading}
						/>
					</View>
				</View>
			</View>
		</ScrollView>
	);
};

export default SurveyCreatorScreen;
