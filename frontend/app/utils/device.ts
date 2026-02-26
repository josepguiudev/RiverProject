import { Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isMobilePlatform = isIOS || isAndroid;

export const BREAKPOINTS = {
  mobileMax: 767,
  tabletMax: 1023,
  desktopMin: 1024,
};