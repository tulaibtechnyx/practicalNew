import React, { useEffect, useState } from "react"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../styles/themes/theme"
import Header from "../../components/header"
import Footer from "../../screens/footer"
import { getOrderSummaryPaidRequest, clearCheckOutSummary } from "../../store/reducers/checkoutReducer"
import get from "lodash/get"
import AuthRedirector from "components/auth-redirector"
import { useDispatch, useSelector } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import AppLogger from "helpers/AppLogger"
import OrderCompleteSec from "../../components/orderCompleteSec"
import AppConstants from "helpers/AppConstants"
import { useRouter } from "next/router"

const OrderComplete = () => {
  const dispatch = useDispatch()
  const { userDetails, isExecutive } = useSelector((state) => state.auth)
  const { orderSummary } = useSelector((state) => state.CheckOutReducer)
  const { homeData } = useSelector((state) => state.homepage)

  const [dataRec, setDataRec] = useState(null)
  const [orderSummaryLocal, setOrderSummaryLocal] = useState(null)
  const [loaderSummery, setloaderSummery] = useState(false)
  const order_id = get(orderSummaryLocal, "order_history.order_id", null)
  const accessToken = get(userDetails, "data.auth_token", "")
  const router = useRouter();
  const orderIdFromRouter = router?.query?.order_id ?? '';

  useEffect(() => {
    if (orderSummary) {
      setOrderSummaryLocal(orderSummary)
    }
  }, [orderSummary])

  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])

  useEffect(() => {
    // setUpUiHandler()
    if(!router.isReady) return

    if(orderIdFromRouter){
      handleGetOrderSummaryPaidRequest()
      return
    }
    if (order_id) {
      handleGetOrderSummaryPaidRequest()
    }else{
    setloaderSummery(true)
    }
    document.body.classList.add("headerBG")
  }, [order_id, router])

  const handleGetOrderSummaryPaidRequest = () => {
    const orderIdForApi = orderIdFromRouter ? orderIdFromRouter : order_id;  
    setloaderSummery(false)
    dispatch(getOrderSummaryPaidRequest({ accessToken, order_id: orderIdForApi }))
      .then(unwrapResult)
      .then((res) => {
    setloaderSummery(true)
        AppLogger("Response at getOrderSummaryPaidRequest", res)
      })
      .catch((err) => {
    setloaderSummery(true)
      AppLogger("Error at getOrderSummaryPaidRequest", err)
      })
  }

  const handleClearCheckOutFields = () => {
    try {
      dispatch(clearCheckOutSummary())
        .then(unwrapResult)
        .then((res) => {
          AppLogger(
            "This is response at handleClearCheckOutFields==========",
            res
          )
        })
        .catch((err) => {
          AppLogger("This is error at handleClearCheckOutFields=========", err)
        })
    } catch (err) {
      AppLogger("This is error at handleClearCheckOutFields=========", err)
    }
  }
  // const isExecutive = AppConstants.isExecutive
 const { paymentMethod } =
    useSelector((state) => state.CheckOutReducer)
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Header dataRec={dataRec} isExecutive={
          // AppConstants.isExecutive
          isExecutive
        } />
        <AuthRedirector>
          {
          <OrderCompleteSec
            loaderSummery={loaderSummery}
            paymentMethod={paymentMethod}
            clearCheckoutData={handleClearCheckOutFields} dataRec={dataRec} isExecutive={
            // AppConstants.isExecutive
            isExecutive
          } />
          }
        </AuthRedirector>
        <Footer isExecutive={
          // AppConstants.isExecutive
          isExecutive
        } />
      </ThemeProvider>
    </div>
  )
}

export default OrderComplete
