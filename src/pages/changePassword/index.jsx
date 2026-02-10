import React, { useEffect, useState } from "react"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../styles/themes/theme"
import Header from "../../components/header"
import Footer from "../../screens/footer"
import ChangePasswordScreen from "../../screens/changePassword"
import AppLogger from "helpers/AppLogger"
import { useSelector } from "react-redux"
import AppConstants from "helpers/AppConstants"

const ChangePassword = () => {
  const [dataRec, setDataRec] = useState(null)

  const { homeData } = useSelector((state) => state.homepage)
  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])
  // const isExecutive = AppConstants.isExecutive
  const { isExecutive } = useSelector((state) => state.auth)
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Header dataRec={dataRec} isExecutive={
          // AppConstants.isExecutive
          isExecutive
        } />
        <ChangePasswordScreen dataRec={dataRec} />
        <Footer isExecutive={
          // AppConstants.isExecutive
          isExecutive
        } />
      </ThemeProvider>
    </div>
  )
}

export default ChangePassword
