import { Dimensions, Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

export const isMobile = isIOS || isAndroid;

// 2. Función de detección dinámica (La "Inteligencia")
export const getLayout = (width: number) => {
  return {
    isSmallDevice: width < 375,
    isTablet: width >= 768 && width < 1024,
    isDesktop: isWeb && width >= 1024,
    isLargeScreen: width > 800, // Tu regla específica para el Splash
    // Puedes añadir más aquí:
    isMobileView: width < 768,
  };
};