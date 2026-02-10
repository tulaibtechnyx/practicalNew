import { createTheme } from "@mui/material/styles"
import { breakpoints, fontFamilyEN } from "./constants"
import { palette } from "./palette"
import { typographyItems } from "./typography"

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.variant === "contained" &&
            ownerState.color === "primary" && {
              boxShadow: "none",
              height: "35px",
              fontSize: "15px",
              minWidth: "80px",
              textTransform: "none",
              borderRadius: "50px",
              fontWeight:"normal",
              border: "1px solid  #179C78",
              "&:hover": {
                color: "#179C78",
                boxShadow: "none",
                backgroundColor: "transparent"
              },
              "@media (min-width: 768px)":{
                  height: "45px",
                 fontSize: "18px",
                 padding: "5px 21.5px"
              }
            }),
          ...(ownerState.variant === "outlined" &&
            ownerState.color === "primary" && {
              boxShadow: "none",
              height: "35px",
              fontSize: "15px",
              minWidth: "80px",
              textTransform: "none",
              borderRadius: "50px",
              fontWeight:"normal",
              border: "1px solid  #179C78",
              "&:hover": {
                color: "#ffffff",
                boxShadow: "none",
                backgroundColor: "#179C78"
              },
              "@media (min-width: 768px)":{
                  height: "45px",
                 fontSize: "18px",
                 padding: "5px 21.5px"
              }
            }),
          
        })
      }
    }
  },
  typography: {
    fontFamily: fontFamilyEN,
    ...typographyItems
  },
  palette: {
    ...palette
  },
  breakpoints: breakpoints
})

export default theme
