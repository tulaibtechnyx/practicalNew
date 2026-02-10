import React, { useEffect, useState } from "react"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../styles/themes/theme"
import Header from "../../components/header"
import Footer from "../../screens/footer"
import AppLogger from "helpers/AppLogger"
import ContactUs from "components/contactUs"
import Head from "next/head"
import { useSelector } from "react-redux"
import AppConstants from "helpers/AppConstants"
import { useMediaQuery } from "@mui/material"

const Contactpage = ({ }) => {
  const [dataRec, setDataRec] = useState(null)
  const { homeData } = useSelector((state) => state.homepage)
  const { isExecutive } = useSelector((state) => state.auth)

  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])

  useEffect(() => {
    document.body.classList.add("headerBG")
    if(isSmallScreen) {
      document.body.classList.add("singleLogo")
    }else{
      document.body.classList.remove("singleLogo")
    }
  }, [isSmallScreen])

  return (
    <>
      <ThemeProvider theme={theme}>
        <Header dataRec={dataRec} isExecutive={isExecutive} />
        <section className="page--wrapper">
          <div className="mainBodyWrap">
            <ContactUs isExecutive={isExecutive} />
            <div className="footerWrap">
              <Footer isExecutive={isExecutive} />
            </div>
          </div>
        </section>
      </ThemeProvider>
    </>
  )
}

export default Contactpage
