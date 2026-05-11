import axios, { AxiosError } from "axios";
import { API_CONFIG } from "../../config/api.config";
import {
	Category,
	EncuestaParcialDTO,
	EncuestaRespuestaDTO,
	Genere,
	Survey,
	UserSurveyRel,
} from "../../types/formsSurvey.types";

const apiClient = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	timeout: API_CONFIG.TIMEOUT,
	headers: {
		"Content-Type": "application/json",
	},
});

export class FormApiService {
	/**
	 * Obtener encuestas personalizadas para un usuario jugador
	 */
	static async getUserSurveys(userId: number): Promise<UserSurveyRel[]> {
		try {
			const response = await apiClient.get<UserSurveyRel[]>(
				`/api/surveys/user/${userId}`,
			);
			return response.data;
		} catch (error) {
			throw this.handleError(error);
		}
	}

	/**
	 * NUEVO: Obtener encuestas creadas por un cliente (Empresa)
	 * Endpoint: @GetMapping("/my-surveys/{clientId}")
	 */
	static async getSurveysByClient(clientId: number): Promise<Survey[]> {
		try {
			const response = await apiClient.get<Survey[]>(
				`/api/surveys/my-surveys/${clientId}`,
			);
			return response.data;
		} catch (error) {
			throw this.handleError(error);
		}
	}

	/**
     * ENVÍA LA ENCUESTA (POST)
     * Corregido para incluir el objeto 'config' requerido por el Backend
     */
    static async submitForm(
        formData: Survey,
        idClient: number,
    ): Promise<Survey> {
        try {
            // Limpiamos y preparamos el objeto final para el modelo cerrado de Java
            const payload: Survey = {
                ...formData, // Mantenemos los campos base como name, numUsers, etc.
                numQuestions: formData.questionList.length,
                creationDate: new Date().toISOString(),
                SurveyReward: formData.SurveyReward || 0,
                
                // MAPEO CRUCIAL DE PREGUNTAS
                questionList: formData.questionList.map((q) => ({
                    textQuestion: q.textQuestion,
                    // Agrupamos la información en el objeto 'config'
                    config: {
                        // Si q tiene typeName directo, lo usamos; si ya tiene config, también.
                        typeName: q.config?.typeName || (q as any).typeName,
                        isMultiple: q.config?.isMultiple || (q as any).typeName === 'MULTIPLE_CHOICE',
                        attributes: q.config?.attributes || ""
                    },
                    // Aseguramos que usamos 'option' (singular) para el Backend
                    option: q.option || q.options || [],
                })),
            };

            const response = await apiClient.post<Survey>(
                "/api/surveys/submit",
                payload,
                {
                    params: { idClient: idClient },
                },
            );

            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getCategories(): Promise<Category[]> {
        try {
            // Añadimos /api al inicio de la ruta
            const response = await apiClient.get('/api/surveys/categories'); 
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getGeneres(): Promise<Genere[]> {
        try {
            // Añadimos /api al inicio de la ruta
            const response = await apiClient.get('/api/surveys/generes');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

	/**
	 * Cargar respuestas parciales (para retomar encuestas)
	 */
	static async getPartialResponse(
		idSurvey: number,
		idUser: number,
	): Promise<EncuestaParcialDTO> {
		try {
			const response = await apiClient.get<EncuestaParcialDTO>(
				`/api/surveys/${idSurvey}/responses`,
				{ params: { idUser: idUser } },
			);
			return response.data;
		} catch (error) {
			throw this.handleError(error);
		}
	}

	/**
	 * Guardar respuestas de usuario (Jugador)
	 */
	static async saveAnswers(
		data: EncuestaRespuestaDTO,
		isCompleted: boolean,
	): Promise<any> {
		try {
			const response = await apiClient.post(
				`/api/surveys/responses/save?completada=${isCompleted}`,
				data,
			);
			return response.data;
		} catch (error) {
			throw this.handleError(error);
		}
	}

	/**
	 * Test de conexión
	 */
	static async testConnection(): Promise<string> {
		try {
			const response = await apiClient.get<string>("/api/surveys/test");
			return response.data;
		} catch (error) {
			throw this.handleError(error);
		}
	}

	private static handleError(error: unknown): Error {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError;
			if (axiosError.response) {
				// Extraemos el mensaje de error que configuramos en el Map.of("error", ...) del Backend
				const serverMessage =
					(axiosError.response.data as any)?.error ||
					axiosError.response.statusText;
				return new Error(`Error: ${serverMessage}`);
			}
		}
		return new Error(
			"No se pudo conectar con River DB. Revisa tu conexión.",
		);
	}
}
