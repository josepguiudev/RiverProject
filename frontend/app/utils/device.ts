import { Dimensions, Platform } from 'react-native';

// Detectar plataforma de forma inmutable
export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Dimensiones iniciales (útiles para lógica que no requiere re-render)
const { width, height } = Dimensions.get('window');
export const WINDOW_WIDTH = width;
export const WINDOW_HEIGHT = height;

// Breakpoints comunes
export const isSmallDevice = width < 375;
export const isTablet = width >= 768 && width < 1024;
export const isDesktop = isWeb && width >= 1024;