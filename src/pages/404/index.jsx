import React, { useEffect, useState } from "react"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../styles/themes/theme"
import Header from "../../components/header"
import Footer from "../../screens/footer"
import Error from "components/error"
import { useSelector } from "react-redux"
import AppConstants from "helpers/AppConstants"
const ErrorPage = () => {
  const [dataRec, setDataRec] = useState(null)
  useEffect(() => {
    document.body.classList.add("headerBG")
    document.body.classList.add("singleLogo")
  }, [])
  const { homeData } = useSelector((state) => state.homepage)
  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])
  // const isExecutive = AppConstants.isExecutive
  const { isExecutive } = useSelector((state) => state.auth)
  return (
    <>
      <ThemeProvider theme={theme}>
        <Header dataRec={dataRec} isExecutive={
          // AppConstants.isExecutive
          isExecutive
        } />
        <section className="page--wrapper">
          <Error isExecutive={
            // AppConstants.isExecutive
            isExecutive
          } />
          <div className="mainBodyWrap">
            <div className="footerWrap">
              <Footer isExecutive={
                // AppConstants.isExecutive
                isExecutive
              } />
            </div>
          </div>
        </section>
      </ThemeProvider>
    </>
  )
}

export default ErrorPage
