/* Const defination */
export const BASE_FONT_SIZE = 16
export const MAX_WIDTH = 1440
export const SPACING_MULTIPLIER = 8

// Font Family
const baseFont = "sans-serif"
export const fontFamilyEN = ["EuclidCircularB", baseFont].join(",")
/* Function */
// export const pxToRem = pixelValue => `${pixelValue / BASE_FONT_SIZE}rem`;
export const space = (num = 1, suffix = false) =>
  suffix ? `${num * SPACING_MULTIPLIER}px` : num * SPACING_MULTIPLIER

/* Global preset variable items */

export const GUTTERS = {
  none: 0,
  sm: space(2) / 2,
  lg: space(3) / 2,
  xl: space(4) / 2
}

export const breakpoints = {
  keys: ["xs", "sm", "md", "lg", "xl", "xxl", "", "xxxxl"],
  values: {
    xs: 0,
    sm: 600,
    md: 768,
    lg: 992,
    xl: 1280,
    xxl: 1440,
    xxxl: 1920,
    xxxxl: 2048
  }
}

export const desktopMediaXL = `@media (min-width: ${breakpoints.values.xxxl}px)`
export const desktopMediaLG = `@media (min-width: ${breakpoints.values.xxl}px)`
export const desktopMedia = `@media (min-width: ${breakpoints.values.xl}px)`
export const tabletMediaLG = `@media (min-width: ${breakpoints.values.lg}px)`
export const mobileMedia = `@media (min-width: ${breakpoints.values.md}px)`
// export const mobileMedia = `@media (max-width: ${breakpoints.values.md - 1}px)`
