// Entidad Usuario (Jugador) - Paso 1 al 3
export interface UserProfile {
  id: number;
  name: string;
  apellido1?: string; // Opcional al inicio (Paso 1)
  apellido2?: string;
  email: string;
  genero?: number;    // Opcional hasta el Paso 2
  edad?: number;
  localizacion?: string;
  urlIdStream?: string; // Se completa en el Paso 3
  id_rol: number;
  registrationStep: number; // 1: Básico, 2: Perfil, 3: Completo
  role: 'USER';
}

// Entidad Cliente (Empresa)
export interface ClientProfile {
  id: number;
  nombre: string;
  email: string;
  cuentaBancaria?: string;
  urlImagen?: string;
  role: 'CLIENT';
  registrationStep: number; // Siempre será 3 (o null) para clientes
}

// DTO de Respuesta de Login (Coincide con tu Java LoginResponse actualizado)
export interface LoginResponse {
  token: string;
  user: UserProfile | ClientProfile;
  role: 'USER' | 'CLIENT';
  registrationStep: number;
}