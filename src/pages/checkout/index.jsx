import React, { useState, useEffect } from "react"
import { ThemeProvider } from "@mui/material/styles"
import { useDispatch, useSelector } from "react-redux"
import theme from "../../styles/themes/theme"
import Header from "../../components/header"
import Footer from "../../screens/footer"
import AuthRedirector from "components/auth-redirector"
import OrderSummaryComp from "../../components/orderSummaryCheckout/index"
import AppConstants from "../../helpers/AppConstants"
import { getCompanyEmiratesRequest } from "store/reducers/dashboardReducer"
import get from "lodash/get"
import { unwrapResult } from "@reduxjs/toolkit"
import AppLogger from "helpers/AppLogger"
import Script from "next/script"
import { isProductionServer, isStagingServer } from "@helpers/ShortMethods"
import { pushToDataLayer } from "@helpers/CommonFunc"

export default function CheckOut() {
  const { userDetails, isExecutive } = useSelector((state) => state.auth)

  const dispatch = useDispatch();

  const [dataRec, setDataRec] = useState(null)

  const token = get(userDetails, "data.auth_token", null)

  
  const getCompanyEmiratesHandler = () => {
    try {
      
      if (token) {
        dispatch(getCompanyEmiratesRequest({ token }))
          .then(unwrapResult)
          .then((res) => {
            AppLogger("This is response at getCompanyEmiratesHandler========", res)
          })
          .catch((err) => {
            AppLogger("This is error  at getCompanyEmiratesHandler===========", err)
          })
        }
      } catch (err) {
      AppLogger("This is error  at getCompanyEmiratesHandler===========", err)
      
    }
  }

  const { homeData } = useSelector((state) => state.homepage)

  useEffect(() => {
    pushToDataLayer("checkout_page_view")
  }, [])
    useEffect(() => {
      if(isExecutive){
        getCompanyEmiratesHandler()
      }
  }, [isExecutive])
  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])

  useEffect(() => {
    if (userDetails) {
      setUpUiHandler()
    }
  }, [userDetails])

  const setUpUiHandler = () => {
    document.body.classList.add("headerBG")
  }
  // const isExecutive = AppConstants.isExecutive
  return (
    <ThemeProvider theme={theme}>
      {
            isStagingServer() || isProductionServer()  ? (
              <Script
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: 
                  `
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({
                    event: "cos_checkout_view"
                  });
                    `
              }}
            ></Script>
          ) : null}
      <div className="mainBodyWrap">
        <Header dataRec={dataRec} isExecutive={isExecutive} />
        <AuthRedirector>
          <section className="page--wrapper">
            <OrderSummaryComp dataRec={dataRec}
            // isExecutive={
            //   // AppConstants.isExecutive
            //   isExecutive
            // }
            />
          </section>
          <div className="footerWrap">
            <Footer isExecutive={isExecutive} />
          </div>
        </AuthRedirector>
      </div>
    </ThemeProvider>
  )
}
