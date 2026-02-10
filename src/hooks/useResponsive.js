// hooks/useResponsiveMatch.js
import { useMediaQuery } from '@mui/material';

const breakpoints = {
  largeXL: '(max-width: 1920px)',
  large: '(max-width: 1440px)',
  laptop: '(max-width: 1280px)',
  laptopNormal: '(max-width: 1024px)',
  laptopSmall: '(max-width: 991px)',
  tablet: '(max-width: 768px)',
  mobile: '(max-width: 400px)',
};

export function useResponsive(screenType) {
  const query = breakpoints[screenType];
  if (!query) {
    console.warn(`Invalid screen type: "${screenType}". Supported: ${Object.keys(breakpoints).join(', ')}`);
    return false;
  }
  return useMediaQuery(query);
}
