const Black = "#000000"
const Green = "#119A77"

const bgGrey = "#F5F5F5"
// const paraHeadingColorGrey = '#7E8593';
// const paraTextColor = '#484D56';
// const paraTextContentColor = '#565B63';
// const paraTextChartColor = '#808794';
// const fluidRed = 'rgba(225, 10, 10, 1)'; //#E10A0A
const fluidGreen = "rgba(96, 201, 139, 1)" //#60C98B
const White = "#fff"

// This is default ellipsis after two lines
// but you can pass line in params as per your need
// common Color
export const common = {
  Black
}
// primary Color
export const primary = {
  main: Green,
  contrastText: White
}
// secondary Color
export const secondary = {
  main: fluidGreen,
  contrastText: Black
}
// text Color
// export const text = {
//     blackColor: Black,
//     redColor: fluidRed,
//     greenColor: fluidGreen,
//     paraHeadingColorGrey: paraHeadingColorGrey,
//     paraTextColor: paraTextColor,
//     paraTextContentColor: paraTextContentColor,
//     paraTextChartColor: paraTextChartColor,
// };
// background Color
export const background = {
  default: bgGrey
}
export const palette = {
  primary,
  secondary,
  // text,
  common,
  background
}
