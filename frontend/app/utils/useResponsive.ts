import { useWindowDimensions, Platform } from 'react-native';
import { BREAKPOINTS } from '../config/api.config';

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  const isWeb = Platform.OS === 'web';
  const isDesktop = isWeb && width >= BREAKPOINTS.desktopMin;
  const isTablet = width >= BREAKPOINTS.mobileMax && width < BREAKPOINTS.desktopMin;
  const isMobile = width < BREAKPOINTS.mobileMax;

  return {
    width,
    height,
    isDesktop,
    isTablet,
    isMobile,
    isAndroid: Platform.OS === 'android',
    isIOS: Platform.OS === 'ios',
  };
};