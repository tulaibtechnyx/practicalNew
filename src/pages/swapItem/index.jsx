import React, { useState, useEffect } from "react"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../styles/themes/theme"
import Header from "../../components/header"
import TabSwap from "../../components/tabsSwap"
import Footer from "../../components/footer"
import Macroscreen from "../../screens/macroScreen"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import AuthRedirector from "components/auth-redirector"
import AppConstants from "helpers/AppConstants"
import { removeItemsByPrefix } from "@helpers/CommonFunc"
const SwapItems = () => {
  const [dataRec, setDataRec] = useState(null)
  const { homeData } = useSelector((state) => state.homepage)
  const router = useRouter()
  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])
  useEffect(() => {
    document.body.classList.add("headerBG")
    document.body.classList.add("swap")
    document.body.classList.remove("tickerON")
    document.body.classList.remove("dashboard")
  }, [])

  const [currentDate, setCurrentDate] = useState("")
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentDate(JSON.parse(localStorage.getItem("currentDate")))
    }
  }, [router.isReady])

  
  // const isExecutive = AppConstants.isExecutive
  const { isExecutive } = useSelector((state) => state.auth)
  return (
    <ThemeProvider theme={theme} >
      <AuthRedirector>
        <div className="mainBodyWrap">
          <Header dataRec={dataRec} isExecutive={
            // AppConstants.isExecutive
            isExecutive
          } />
          <section className="page--wrapper">
            <Macroscreen currentDate={currentDate} isExecutive={
              // AppConstants.isExecutive
              isExecutive
            } />
            <TabSwap isExecutive={
              // AppConstants.isExecutive
              isExecutive
            } />
          </section>
          <div className="footerWrap">
            <Footer />
          </div>
        </div>
      </AuthRedirector>
    </ThemeProvider>
  )
}

export default SwapItems
