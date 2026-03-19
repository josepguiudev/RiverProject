import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../../config/api.config';
import { EncuestaParcialDTO, EncuestaRespuestaDTO, Survey } from '../../types/formsSurvey.types';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class FormApiService {
  static savePartial(arg0: { idPregunta: number; idOpcion: number; valor: string; isRespondida: boolean; }, arg1: number, surveyId: any) {
    throw new Error('Method not implemented.');
  }
  
  /**
   * Obtener todas las encuestas (Antes: /api/formSurvey/responses)
   */
static async getAllResponses(): Promise<Survey[]> {
    try {
        const response = await apiClient.get<Survey[]>("/api/surveys/all"); 
        return response.data;
    } catch (error) {
        throw this.handleError(error);
    }
}

  /**
   * Enviar una nueva plantilla (Arregla el error de 'payload')
   */
  static async submitForm(formData: Survey): Promise<Survey> {
    try {
      // DEFINICIÓN DE PAYLOAD (Esto resuelve el error ts(2304))
      const payload = {
        name: formData.name, 
        numQuestions: formData.questionList ? formData.questionList.length : 0,
        questionList: formData.questionList ? formData.questionList.map(q => ({
          text_question: q.textQuestion,
          type_name: q.typeName,
          options: q.options ? q.options.map(opt => ({
            text_opcion: opt.textOpcion
          })) : []
        })) : [],
        creationDate: new Date().toISOString()
      };

      const response = await apiClient.post<Survey>("/api/surveys/submit", payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cargar respuestas parciales
   */
  static async getPartialResponse(idSurvey: number, idUser: number): Promise<EncuestaParcialDTO> {
  try {
    const response = await apiClient.get<EncuestaParcialDTO>(
      `/api/surveys/${idSurvey}/responses`, 
      { 
        params: { idUser: idUser } // Axios lo convierte automáticamente en ?idUser=1
      }
    );
        return response.data;
    } catch (error) {
        throw this.handleError(error);
    }
  }
  /**
   * Guardar respuestas de usuario
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
        return new Error(`Error del servidor: ${axiosError.response.status} - ${axiosError.response.statusText}`);
      }
    }
    return new Error('Error inesperado al comunicarse con el servidor');
  }
}