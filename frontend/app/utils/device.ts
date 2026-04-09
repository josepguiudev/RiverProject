import { Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const BREAKPOINTS = {
  mobileMax: 767,
  tabletMax: 1023,
  desktopMin: 1024,
};

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Nueva lógica: Es desktop solo si es Web Y la pantalla es ancha
export const isDesktop = isWeb && width >= BREAKPOINTS.desktopMin;

// Es móvil si es app nativa O si el navegador es estrecho
export const isMobileLayout = !isWeb || width <= BREAKPOINTS.mobileMax;