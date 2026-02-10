import React, { useEffect, useState } from "react"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../styles/themes/theme"
import Header from "../../components/header"
import Footer from "../../screens/footer"
import ForgotScreen from "../../screens/forgotPassword"
import AppLogger from "helpers/AppLogger"
import { useSelector } from "react-redux"
import AppConstants from "helpers/AppConstants"

const ForgotPassword = () => {
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
        <ForgotScreen
          heading={dataRec?.forgotPass?.heading}
          emailHeading={dataRec?.forgotPass?.emailHeading}
          para={dataRec?.forgotPass?.para}
          btn1={dataRec?.forgotPass?.button1}
          btn2={dataRec?.forgotPass?.button2}
          isExecutive={
            // AppConstants.isExecutive
            isExecutive
          }
        />
        <Footer isExecutive={
          // AppConstants.isExecutive
          isExecutive
        } />
      </ThemeProvider>
    </div>
  )
}

export default ForgotPassword
