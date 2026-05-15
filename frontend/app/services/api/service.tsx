import axios, { AxiosError } from "axios";
import {
    Category,
    EncuestaParcialDTO,
    EncuestaRespuestaDTO,
    Genere,
    Survey,
    UserSurveyRel,
} from "../../types/formsSurvey.types";
import client from "../../api/client"; // Usamos siempre este, ya tiene el JWT

export class FormApiService {

    /**
     * Obtener encuestas personalizadas para un usuario jugador
     */
    static async getUserSurveys(userId: number): Promise<UserSurveyRel[]> {
        try {
            const response = await client.get<UserSurveyRel[]>(
                `/api/surveys/user/${userId}`
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Obtener encuestas creadas por un cliente (Empresa)
     */
    static async getSurveysByClient(clientId: number): Promise<Survey[]> {
        try {
            const response = await client.get<Survey[]>(
                `/api/surveys/my-surveys/${clientId}`
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Obtener encuestas pendientes de aprobación (Solo Admin)
     */
    static async getPendingSurveys(): Promise<Survey[]> {
        try {
            const response = await client.get<Survey[]>("/api/surveys/pending");
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Aprobar y publicar una encuesta (Solo Admin)
     */
    static async publishSurvey(surveyId: number): Promise<void> {
        try {
            await client.put(`/api/surveys/${surveyId}/publish`);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * ENVÍA LA ENCUESTA (POST)
     * Formatea el objeto para que coincida con el backend de Spring Boot
     */
    static async submitForm(
        formData: Survey,
        idClient: number,
    ): Promise<Survey> {
        try {
            const payload: Survey = {
                ...formData,
                numQuestions: formData.questionList.length,
                creationDate: new Date().toISOString(),
                SurveyReward: formData.SurveyReward || 0,
                
                questionList: formData.questionList.map((q) => ({
                    textQuestion: q.textQuestion,
                    config: {
                        typeName: q.config?.typeName || (q as any).typeName,
                        isMultiple: q.config?.isMultiple || (q as any).typeName === 'MULTIPLE_CHOICE',
                        attributes: q.config?.attributes || ""
                    },
                    option: q.option || q.options || [],
                })),
            };

            const response = await client.post<Survey>(
                "/api/surveys/submit",
                payload,
                { params: { idClient: idClient } }
            );

            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getCategories(): Promise<Category[]> {
        try {
            const response = await client.get('/api/surveys/categories'); 
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getGeneres(): Promise<Genere[]> {
        try {
            const response = await client.get('/api/surveys/generes');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getPartialResponse(
        idSurvey: number,
        idUser: number,
    ): Promise<EncuestaParcialDTO> {
        try {
            const response = await client.get<EncuestaParcialDTO>(
                `/api/surveys/${idSurvey}/responses`,
                { params: { idUser: idUser } }
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async saveAnswers(
        data: EncuestaRespuestaDTO,
        isCompleted: boolean,
    ): Promise<any> {
        try {
            const response = await client.post(
                `/api/surveys/responses/save?completada=${isCompleted}`,
                data,
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async testConnection(): Promise<string> {
        try {
            const response = await client.get<string>("/api/surveys/test");
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Centralización de errores con mensajes claros del Backend
     */
    private static handleError(error: unknown): Error {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                const serverMessage =
                    (axiosError.response.data as any)?.error ||
                    (axiosError.response.data as any)?.message ||
                    axiosError.response.statusText;
                return new Error(`Error: ${serverMessage}`);
            }
        }
        return new Error("No se pudo conectar con River DB. Revisa tu conexión.");
    }
}