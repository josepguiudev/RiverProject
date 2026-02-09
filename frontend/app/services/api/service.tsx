//CLASE DE PRUEBA PARA PRACTICAR, NO ESSENCIAL

import axios, { AxiosError } from 'axios';
import { API_CONFIG, getFullUrl } from '../../config/api.config';
import { FormResponse } from '../../types/forms.types';;


// Configurar axios con valores por defecto
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Servicio para manejar todas las llamadas al API
 */
export class FormApiService {
  
  /**
   * Enviar formulario al backend
   * @param formData - Datos del formulario
   * @returns Promise con la respuesta guardada
   */
  static async submitForm(formData: FormResponse): Promise<FormResponse> {
    try {
      const response = await apiClient.post<FormResponse>(
        API_CONFIG.ENDPOINTS.SUBMIT_FORM,
        formData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtener todas las respuestas del backend
   * @returns Promise con array de respuestas
   */
  static async getAllResponses(): Promise<FormResponse[]> {
    try {
      const response = await apiClient.get<FormResponse[]>(
        API_CONFIG.ENDPOINTS.GET_RESPONSES
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Probar conexión con el backend
   * @returns Promise con mensaje de prueba
   */
  static async testConnection(): Promise<string> {
    try {
      const response = await apiClient.get<string>(
        API_CONFIG.ENDPOINTS.TEST
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Manejo centralizado de errores
   * @param error - Error de axios
   * @returns Error formateado
   */
  private static handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        // El servidor respondió con un error
        return new Error(
          `Error del servidor: ${axiosError.response.status} - ${axiosError.response.statusText}`
        );
      } else if (axiosError.request) {
        // La petición se hizo pero no hubo respuesta
        return new Error(
          'No se pudo conectar al servidor. Verifica tu conexión.'
        );
      }
    }
    
    // Error desconocido
    return new Error('Error inesperado al comunicarse con el servidor');
  }
}