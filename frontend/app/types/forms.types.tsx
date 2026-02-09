//CLASE DE PRUEBA PARA PRACTICAR, NO ESSENCIAL

// Define la estructura de una respuesta del formulario
export interface FormResponse {
  id?: number;
  nombre: string;
  email: string;
  fechaEnvio?: string;
}

// Define la respuesta del API
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Define los estados del formulario
export interface FormState {
  nombre: string;
  email: string;
}

// Define los errores de validación
export interface FormErrors {
  nombre?: string;
  email?: string;
}