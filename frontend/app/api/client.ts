import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_URL = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';

/**
 * Cliente Axios centralizado para realizar peticiones al backend.
 * Incluye interceptores para añadir el token JWT automáticamente y manejar errores globales.
 */
const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de peticiones:
 * Se ejecuta antes de cada petición al servidor para inyectar el token de autenticación
 * si este existe en el almacenamiento persistente.
 */
client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@River:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de respuestas:
 * Permite manejar errores de forma centralizada (ej: redirección al login si el token expira).
 */
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Sesión expirada o no autorizada');
      // Aquí se podría implementar una lógica de auto-logout
    }
    return Promise.reject(error);
  }
);

export default client;
