import { Platform } from 'react-native';

// Detectamos la IP dinámicamente
const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:8080';
  }
  // Si usas emulador Android, 10.0.2.2 apunta al localhost de tu PC
  // Si usas móvil real, aquí deberías poner la IP de tu PC (ej: 192.168.1.15)
  return Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 5000,
};