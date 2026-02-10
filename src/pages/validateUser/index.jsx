import React from "react"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../styles/themes/theme"
import ValidateSec from "../../components/validateSec"

const ValidateUser = () => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <ValidateSec />
      </ThemeProvider>
    </div>
  )
}

export default ValidateUser
