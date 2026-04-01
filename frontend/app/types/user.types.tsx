// Entidad Usuario (Jugador)
export interface UserProfile {
  id?: number;
  name: string;
  apellido1: string;
  apellido2: string;
  email: string;
  genero: number; // 0 o 1
  edad: number;
  localizacion: string;
  id_rol: number;
}

// Entidad Cliente (Empresa)
export interface ClientProfile {
  id?: number;
  nombre: string; // Nota: En tu Java Client es 'nombre'
  email: string;
  cuentaBancaria?: string;
  urlImagen?: string;
}

// DTO de Registro (Lo que enviamos al AuthService2)
export interface RegisterRequest {
  type: 'USER' | 'CLIENT';
  email: string;
  password?: string;
  name: string; // Campo genérico para el DTO
  
  // Opcionales según el 'type'
  apellido1?: string;
  apellido2?: string;
  edad?: number;
  genero?: number;
  localizacion?: string;
  cuentaBancaria?: string;
  urlImagen?: string;
}

// Respuesta del Login/Register (Coincide con tu Java LoginResponse)
export interface LoginResponse {
  token: string;
  user: UserProfile | ClientProfile; // Polimorfismo en el Front
}