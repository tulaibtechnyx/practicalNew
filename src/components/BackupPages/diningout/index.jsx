import React, { useEffect, useState } from "react"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../../styles/themes/theme"
import Header from "../../header"
import Footer from "../../../screens/footer"
import OurPartnersScreen from "../../../screens/ourPartnersBlog"
import Head from "next/head"
import { useSelector } from "react-redux"
import AppConstants from "helpers/AppConstants"

const BlogPage3 = () => {
  const [dataRec, setDataRec] = useState(null)
  const { homeData } = useSelector((state) => state.homepage)
  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])
  useEffect(() => {
    document.body.classList.add("headerBG")
    document.body.classList.add("singleLogo")
  }, [])
  // const isExecutive = AppConstants.isExecutive
  const { isExecutive } = useSelector((state) => state.auth)

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="mainBodyWrap">
          <Header dataRec={dataRec} isExecutive={
            // AppConstants.isExecutive
            isExecutive
          } />
          <section className="page--wrapper">
            <OurPartnersScreen isExecutive={
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
        </div>
      </ThemeProvider>
    </>
  )
}

export default BlogPage3
