import React, { useEffect, useState } from "react"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../styles/themes/theme"
import Header from "../../components/header"
import Footer from "../../screens/footer"
import CheckoutDetails from "../../components/checkoutDetails"
import AuthRedirector from "../../components/auth-redirector"
import { useSelector } from "react-redux"
import AppConstants from "helpers/AppConstants"
const BlogPage4 = () => {
  const [dataRec, setDataRec] = useState(null)
  const { homeData } = useSelector((state) => state.homepage)
  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])
  useEffect(() => { 
    document.body.classList.add("headerBG")
  }, [])

  // const isExecutive = AppConstants.isExecutive
  const { isExecutive } = useSelector((state) => state.auth)
  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="mainBodyWrap">
          <AuthRedirector>
            <Header dataRec={dataRec} isExecutive={
              // AppConstants.isExecutive
              isExecutive
            } />
            <section className="page--wrapper">
              <CheckoutDetails dataRec={dataRec} isExecutive={
                // AppConstants.isExecutive
                isExecutive
              } />
            </section>
            <div className="footerWrap">
              <Footer isExecutive={
                // AppConstants.isExecutive
                isExecutive
              } />
            </div>
          </AuthRedirector>
        </div>
      </ThemeProvider>
    </>
  )
}

export default BlogPage4
