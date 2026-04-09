// En tu archivo de configuración (config/api.config.ts)
import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (Platform.OS === 'web') return 'http://localhost:8080';
  if (Platform.OS === 'android') return 'http://10.0.2.2:8080';
  return 'http://localhost:8080';
};

// Exportamos un objeto llamado API_CONFIG
export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 5000,
};

export const BREAKPOINTS = {
  mobileMax: 767,
  tabletMax: 1023,
  desktopMin: 1024,
};