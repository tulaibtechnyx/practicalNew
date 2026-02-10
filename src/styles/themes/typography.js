import {
  desktopMediaLG,
  tabletMediaLG,
  mobileMedia,
  fontFamilyEN
} from "./constants"
import { fontSizeValue } from "./font"
import { palette } from "./palette"

export const typographyItems = {
  h1: {
    fontFamily: fontFamilyEN,
    fontSize: fontSizeValue.FontSize30,
    lineHeight: fontSizeValue.LineHeight,
    letterSpacing: "0",
    fontWeight: fontSizeValue.FontBold,
    color: palette.common.Black,
    [mobileMedia]: {
      fontSize: fontSizeValue.FontSize30,
      lineHeight: fontSizeValue.LineHeight
    },
    [desktopMediaLG]: {
      fontSize: fontSizeValue.FontSize40,
      lineHeight: fontSizeValue.LineHeight
    }
  },
  h2: {
    fontFamily: fontFamilyEN,
    fontSize: fontSizeValue.FontSize20,
    lineHeight: fontSizeValue.LineHeight,
    letterSpacing: "0",
    fontWeight: fontSizeValue.FontBold,
    color: palette.common.Black,
    [mobileMedia]: {
      fontSize: fontSizeValue.FontSize24,
      lineHeight: fontSizeValue.LineHeight
    },
    [tabletMediaLG]: {
      fontSize: fontSizeValue.FontSize30,
      lineHeight: fontSizeValue.LineHeight
    },
    [desktopMediaLG]: {
      fontSize: fontSizeValue.FontSize30,
      lineHeight: fontSizeValue.LineHeight
    }
  },
  h3: {
    fontFamily: fontFamilyEN,
    fontSize: fontSizeValue.FontSize18,
    lineHeight: fontSizeValue.LineHeight,
    letterSpacing: "0",
    fontWeight: fontSizeValue.FontBold,
    color: palette.common.Black,
    [mobileMedia]: {
      fontSize: fontSizeValue.FontSize23,
      lineHeight: fontSizeValue.LineHeight
    },
    [tabletMediaLG]: {
      fontSize: fontSizeValue.FontSize28,
      lineHeight: fontSizeValue.LineHeight
    },
    [desktopMediaLG]: {
      fontSize: fontSizeValue.FontSize30,
      lineHeight: fontSizeValue.LineHeight
    }
  },
  body1: {
    fontFamily: fontFamilyEN,
    fontSize: fontSizeValue.FontSize18,
    lineHeight: fontSizeValue.LineHeight,
    letterSpacing: "0",
    fontWeight: fontSizeValue.FontNormal,
    color: palette.common.Black
  },
  body2: {
    fontFamily: fontFamilyEN,
    fontSize: fontSizeValue.FontSize15,
    lineHeight: fontSizeValue.LineHeight,
    letterSpacing: "0",
    fontWeight: fontSizeValue.FontNormal,
    color: palette.common.Black
  },
  body3: {
    fontFamily: fontFamilyEN,
    fontSize: fontSizeValue.FontSize12,
    lineHeight: fontSizeValue.LineHeight,
    letterSpacing: "0",
    fontWeight: fontSizeValue.FontNormal,
    color: palette.common.Black,
    [mobileMedia]: {
      fontSize: fontSizeValue.FontSize15,
      lineHeight: fontSizeValue.LineHeight
    },
    [tabletMediaLG]: {
      fontSize: fontSizeValue.FontSize18,
      lineHeight: fontSizeValue.LineHeight
    },
    [desktopMediaLG]: {
      fontSize: fontSizeValue.FontSize18,
      lineHeight: fontSizeValue.LineHeight
    }
  }
}
