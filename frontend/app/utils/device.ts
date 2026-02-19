import { Dimensions, Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';

// Definimos estas primero...
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// ...para que esta ya las pueda conocer
export const isMobile = isIOS || isAndroid; 

// 2. Función de detección dinámica
export const getLayout = (width: number) => {
  return {
    isSmallDevice: width < 375,
    isTablet: width >= 768 && width < 1024,
    isDesktop: isWeb && width >= 1024,
    isLargeScreen: width > 800, 
    isMobileView: width < 768,
  };
};
