import EditPreferences from "../../screens/editContent"
import QuesScreen from "screens/question"
import React, { useEffect, useState } from "react"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../styles/themes/theme"
import Header from "../../components/header"
import Footer from "../../screens/footer"
import AppLogger from "helpers/AppLogger"
import { useDispatch, useSelector } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import { GetQuestionsRequest } from "../../store/reducers/dashboardReducer"
import { useRouter } from "next/router"
import AppRoutes from "helpers/AppRoutes"
import { setStorage } from "helpers/ShortMethods"
import AppConstants from "helpers/AppConstants"

export default function index() {
  const [dataRec, setDataRec] = useState(null)
  const { homeData } = useSelector((state) => state.homepage)
  const { userDetails, isExecutive } = useSelector((state) => state.auth)
  const router = useRouter();

  const handleRedirection = () => {
    const isLoggedIn = userDetails ? true : false;

    if (isLoggedIn) {
      router.push(AppRoutes.dashboard, undefined, { shallow: true })
      setStorage("isFaqWallet")
    } else {
      router.push(AppRoutes.login);
    }
  }


  const dispatch = useDispatch()

  const getFAQQuestionsHandler = () => {
    try {
      dispatch(GetQuestionsRequest())
        .then(unwrapResult)
        .then((res) => {
          AppLogger("Response at GetQuestionsRequest", res)
        })
        .catch((err) => {
          AppLogger("Error at GetQuestionsRequest", err)
          if (err == "Error: Request failed with status code 401") {
            logOutRequest()
            router.push(AppRoutes.login)
          }
        })
    } catch (error) {
      AppLogger("Error at getFAQQuestionsHandler", error)
    }
  }

  useEffect(() => {
    getFAQQuestionsHandler()
  }, [])

  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])

  useEffect(() => {
    document.body.classList.add("headerBG")
    document.body.classList.add("singleLogo")
    document.body.classList.add("menuItems")
  }, [])
  // const isExecutive = AppConstants.isExecutive


  return (
    <ThemeProvider theme={theme}>
      <Header dataRec={dataRec} isExecutive={
        // AppConstants.isExecutive
        isExecutive
      } />
      <div className="mainBodyWrap">
        <section className="page--wrapper sty3">
          <div className={`secTabs ${isExecutive ? "isExecutive" : ""}`}>
            <div className="container container--custom">
              <div className="eating-Wrapper">
                <EditPreferences title="Frequently Asked Questions" />
                <QuesScreen isExecutive={
                  // AppConstants.isExecutive
                  isExecutive
                } handleTabChange={() => handleRedirection()} tabchange={false} />
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
