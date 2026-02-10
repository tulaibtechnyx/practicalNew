import EditPreferences from "../../screens/editContent"
import SecAccordion from "../../components/secAccordion"
import React, { useEffect, useState } from "react"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../styles/themes/theme"
import Header from "../../components/header"
import Footer from "../../screens/footer"
import Head from "next/head"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import Cookies from "js-cookie"
import AppConstants from "helpers/AppConstants"
import { customTimeout, setStorage } from "helpers/ShortMethods"
export default function index() {
  const [tabchange, setTabchange] = useState(false)
  const [currentTab, setCurrentTab] = useState(false)
  const [dataRec, setDataRec] = useState(null)
  const { homeData } = useSelector((state) => state.homepage)
  const { isExecutive } = useSelector((state) => state.auth)
  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])

  useEffect(() => {
    document.body.classList.add("headerBG")
    document.body.classList.add("singleLogo")
    document.body.classList.add("menuItems")
    if (typeof window !== "undefined") {
      setCurrentTab(localStorage.getItem("partner"))
    }
  }, [])

  const [redirectFilter, setRedirectFilter] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (currentTab) {
      setRedirectFilter("dining-out")
      customTimeout(() => {
        setCurrentTab(false)
        localStorage.removeItem("partner")
      }, 1000)
    }
  }, [currentTab])
  return (
    <ThemeProvider theme={theme}>
      <Header dataRec={dataRec} isExecutive={
        // AppConstants.isExecutive
        isExecutive
      } />
      <div className="mainBodyWrap">
        <section className="page--wrapper sty3">
          <div className="secTabs">
            <div className="container container--custom">
              <div className="eating-Wrapper">
                <EditPreferences
                  title="Partner Offers"
                  para="There's so much to do & see in the UAE. So we’ve teamed up with our favourite restaurants, cafes, fitness & health brands to give you discounts & guidance when you are planning your day ahead! You can explore the options below. It pays to be PractiCal! "
                />
                <SecAccordion
                  redirectFilter={redirectFilter}
                  tabchange={tabchange}
                  tabwork={setTabchange}
                  handleChange2={() => setStorage("discount")}
                  contentPage={true}
                />
              </div>
            </div>
          </div>
        </section>
        <div className="footerWrap">
          <Footer isExecutive={
            // AppConstants.isExecutive
            isExecutive
          } />
        </div>
      </div>
    </ThemeProvider>
  )
}
