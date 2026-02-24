import { Dimensions, Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';

// Definimos estas primero...
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// ...para que esta ya las pueda conocer
export const isMobile = isIOS || isAndroid;

// 2. Función de detección dinámica
// Dimensiones de la pantalla
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
export const SCREEN_WIDTH = SCREEN_W;
export const SCREEN_HEIGHT = SCREEN_H;

/**
 * Convierte un porcentaje del ancho de pantalla a píxeles.
 * Usar para: width, paddingHorizontal, marginHorizontal, fontSize, borderRadius.
 * @example wp(90)  // 90% del ancho de pantalla
 */
export const wp = (percentage: number): number =>
  (percentage / 100) * SCREEN_WIDTH;

/**
 * Convierte un porcentaje del alto de pantalla a píxeles.
 * Usar para: height, paddingVertical, marginVertical.
 * @example hp(23)  // 23% del alto de pantalla
 */
export const hp = (percentage: number): number =>
  (percentage / 100) * SCREEN_HEIGHT;

/**
 * Escala un tamaño de fuente proporcionalmente al ancho del dispositivo.
 * Basado en un diseño de referencia de 375px (iPhone SE / diseño estándar).
 * @example fontScale(16)  // 16px en un phone de 375px, escala en tablets
 */
export const fontScale = (size: number): number =>
  (size / 375) * SCREEN_WIDTH;

// Función de detección dinámica
export const getLayout = (width: number) => {
  return {
    isSmallDevice: width < 375,
    isTablet: width >= 768 && width < 1024,
    isDesktop: isWeb && width >= 1024,
    isLargeScreen: width > 800,
    isMobileView: width < 768,
  };
};
