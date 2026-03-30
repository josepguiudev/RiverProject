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
   * Obtener encuestas personalizadas para un usuario (con estado de respuesta)
   * Nuevo endpoint: /api/surveys/user/{userId}
   */
    static async getUserSurveys(userId: number): Promise<UserSurveyRel[]> {
        try {
            // Llamada al nuevo endpoint en el Controller: @GetMapping("/user/{userId}")
            const response = await apiClient.get<UserSurveyRel[]>(`/api/surveys/user/${userId}`); 
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

  /** * Mantenemos el anterior por si lo usas en el panel de administrador, 
   * pero para el usuario usaremos el de arriba.
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
  /**
   * Enviar una nueva plantilla
   */
  static async submitForm(formData: Survey): Promise<Survey> {
    try {
      // Ajustamos el payload para que coincida EXACTAMENTE con los nombres en Java
      const payload = {
        name: formData.name, 
        numQuestions: formData.numQuestions,
        numUsers: formData.numUsers || 0, // <--- Enviamos el 0 que hablamos
        SurveyReward: formData.SurveyReward || 0,
        genereList: formData.genereList || [],
        // Mapeo con nombres correctos (CamelCase)
        questionList: formData.questionList.map(q => ({
          textQuestion: q.textQuestion, // ANTES: text_question (ERROR)
          typeName: q.typeName,         // ANTES: type_name (ERROR)
          // IMPORTANTE: En tu Question.java la lista se llama 'option'
          option: q.option ? q.option.map(opt => ({
            textOpcion: opt.textOpcion  // ANTES: text_opcion (ERROR)
          })) : []
        })),
        creationDate: new Date().toISOString()
      };

      console.log("JSON FINAL ENVIADO A JAVA:", JSON.stringify(payload, null, 2));

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