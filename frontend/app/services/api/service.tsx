import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../../config/api.config';
import { Survey } from '../../types/formsSurvey.types';

// Configurar axios con valores por defecto desde tu archivo de configuración
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Servicio para manejar todas las llamadas al API de Encuestas
 */
export class FormApiService {
  
  /**
   * Enviar una nueva plantilla de encuesta al backend
   * Mapea los datos del Frontend a la @Entity de Java
   */
  static async submitForm(formData: Survey): Promise<Survey> {
    try {
      // Transformamos el objeto para que coincida con Survey.java y Question.java
      const payload = {
        name: formData.name, 
        numQuestions: formData.questionList.length,
        
        // Mapeo de la lista de preguntas
        questionList: formData.questionList.map(q => ({
          text_question: q.text_question, // Coincide con la columna SQL y el campo Java
          type_name: q.type_name,         // SHORT_TEXT, NUMERIC, SINGLE_CHOICE, etc.
          
          // Opciones de respuesta (si las hay)
          options: q.options ? q.options.map(opt => ({
            text_opcion: opt.text_opcion // Coincide con QuestionOption.java
          })) : []
        })),

        // Campos adicionales de la entidad Survey
        genereList: [], // Puedes mapear géneros si los tienes en el formulario
        pago: null, 
        pagoPanelista: null,
        creationDate: new Date().toISOString() // LocalDateTime en Java acepta este formato
      };

      console.log("🚀 Enviando Payload a Spring Boot:", JSON.stringify(payload, null, 2));

      const response = await apiClient.post<Survey>(
        "/api/formSurvey/submit", 
        payload
      );
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtener todas las encuestas guardadas en la base de datos
   */
  static async getAllResponses(): Promise<Survey[]> {
    try {
      const response = await apiClient.get<Survey[]>(
        "/api/formSurvey/responses"
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Probar si el servidor está arriba
   */
  static async testConnection(): Promise<string> {
    try {
      const response = await apiClient.get<string>(
        "/api/formSurvey/test"
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Manejo centralizado de errores con Axios
   */
  private static handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        // El servidor respondió pero con un código de error (400, 404, 500)
        console.error("Data error:", axiosError.response.data);
        return new Error(
          `Error del servidor: ${axiosError.response.status} - ${axiosError.response.statusText}`
        );
      } else if (axiosError.request) {
        // No hubo respuesta (servidor apagado o IP incorrecta)
        return new Error(
          'No se pudo conectar al servidor. Revisa si el Backend está corriendo o la IP en api.config.'
        );
      }
    }
    return new Error('Error inesperado al comunicarse con el servidor');
  }
}