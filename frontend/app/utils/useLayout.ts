import { useWindowDimensions } from 'react-native';
import { BREAKPOINTS } from '../utils/device';

export const useLayout = () => {
    const { width, height } = useWindowDimensions();

    return {
        windowWidth: width,
        windowHeight: height,
        isMobileView: width <= BREAKPOINTS.mobileMax,
        isTabletView: width > BREAKPOINTS.mobileMax && width <= BREAKPOINTS.tabletMax,
        isDesktopView: width >= BREAKPOINTS.desktopMin,
        isPortrait: height > width,
    };
};