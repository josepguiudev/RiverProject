import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../../config/api.config';
import { EncuestaParcialDTO, EncuestaRespuestaDTO, Survey, UserSurveyRel } from '../../types/formsSurvey.types';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class FormApiService {
  
  /**
   * Obtener encuestas personalizadas para un usuario jugador
   */
  static async getUserSurveys(userId: number): Promise<UserSurveyRel[]> {
    try {
      const response = await apiClient.get<UserSurveyRel[]>(`/api/surveys/user/${userId}`); 
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
      const response = await apiClient.get<Survey[]>(`/api/surveys/my-surveys/${clientId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Enviar una nueva plantilla vinculada a un Cliente
   * @param formData Datos de la encuesta
   * @param idClient ID del cliente que la crea
   */
  static async submitForm(formData: Survey, idClient: number): Promise<Survey> {
    try {
      const payload = {
        name: formData.name, 
        numQuestions: formData.numQuestions,
        numUsers: formData.numUsers || 0,
        SurveyReward: formData.SurveyReward || 0,
        genereList: formData.genereList || [],
        questionList: formData.questionList.map(q => ({
          textQuestion: q.textQuestion, 
          typeName: q.typeName,         
          option: q.option ? q.option.map(opt => ({
            textOpcion: opt.textOpcion  
          })) : []
        })),
        creationDate: new Date().toISOString()
      };

      // Enviamos el idClient como Query Param: /api/surveys/submit?idClient=5
      const response = await apiClient.post<Survey>("/api/surveys/submit", payload, {
        params: { idClient: idClient }
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cargar respuestas parciales (para retomar encuestas)
   */
  static async getPartialResponse(idSurvey: number, idUser: number): Promise<EncuestaParcialDTO> {
    try {
      const response = await apiClient.get<EncuestaParcialDTO>(
        `/api/surveys/${idSurvey}/responses`, 
        { params: { idUser: idUser } }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Guardar respuestas de usuario (Jugador)
   */
  static async saveAnswers(data: EncuestaRespuestaDTO, isCompleted: boolean): Promise<any> {
    try {
      const response = await apiClient.post(`/api/surveys/responses/save?completada=${isCompleted}`, data);
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
        const serverMessage = (axiosError.response.data as any)?.error || axiosError.response.statusText;
        return new Error(`Error: ${serverMessage}`);
      }
    }
    return new Error('No se pudo conectar con River DB. Revisa tu conexión.');
  }
}