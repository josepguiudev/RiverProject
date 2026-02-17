//CLASE DE PRUEBA PARA PRACTICAR, NO ESSENCIAL

// Configuración de la API
export const API_CONFIG = {
  // ⚠️ CAMBIAR POR TU IP LOCAL
  BASE_URL: 'http://localhost:8080',
  ENDPOINTS: {
    SUBMIT_FORM: '/api/formSurvey/submit',
    GET_RESPONSES: '/api/formSurvey/responses',
    TEST: '/api/formSurvey/test',
  },
  TIMEOUT: 10000, // 10 segundos
};

// Helper para construir URLs completas
export const getFullUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};