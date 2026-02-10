import React, { useCallback, useEffect, useState } from "react"
import Header from "../../components/header"
import Footer from "../../screens/footer"
import Head from "next/head"
import get from "lodash/get"
import { useDispatch, useSelector } from "react-redux"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../styles/themes/theme"
import EditPreferences from "../../screens/editContent"
import MealBox from "../../screens/mealBox"
import PriceBox from "../../components/priceBox"
import RenewalText from "components/renewaltext"
import { getRenewalDataRequest } from "../../store/reducers/checkoutReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import AuthRedirector from "components/auth-redirector"
import { performAddResetPayload } from "store/actions/resetAction"
import { useRouter } from "next/router"
import { customTimeout } from "helpers/ShortMethods"
import AppConstants from "helpers/AppConstants"

const Renewal = () => {
  const dispatch = useDispatch()

  const { userDetails, isExecutive } = useSelector((state) => state.auth)
  const { renewalSummary } = useSelector((state) => state.CheckOutReducer)
  const { renewalData } = useSelector((state) => state.home)

  const [dataRec, setDataRec] = useState(null)
  const [userDataLocal, setUserDataLocal] = useState(null)
  const [summaryLocal, setSummaryLocal] = useState(null)
  const [confirmBtnClicked, setConfirmBtnClicked] = useState(false)
  const [paidStatus, setpaidStatus] = useState(null)

  let newData = get(renewalSummary, "data.guest")
  const [newDataLocal, setNewDataLocal] = useState(newData)
  const [resetPayload, setResetPayload] = useState({})
  const [refreshResetPayload, setRefreshResetPayload] = useState(false)
  const [showDiscBool, setshowDiscBool] = useState(false)
  const { homeData } = useSelector((state) => state.homepage)
  const router = useRouter()
  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])
  useEffect(() => {
    if (newData) {
      newData = get(renewalSummary, "data.guest")
      setNewDataLocal(newData)
    }
  }, [newData])

  const paymentCheck = get(paidStatus, "order.payment_status", "")
  const token = get(userDataLocal, "data.auth_token", "")
  const price = get(summaryLocal, "total_price", "")

  // resetPayloadSetter()

  useEffect(() => {
    if (renewalData) {
      setpaidStatus(renewalData)
    }
  }, [renewalData])

  useEffect(() => {
    if (userDetails) {
      setUserDataLocal(userDetails)
    }
  }, [userDetails])

  useEffect(() => {
    setSummaryLocal(renewalSummary?.data)
  }, [renewalSummary])

  useEffect(() => {
    setUpUiHandler()
    if (token) {
      getRenewalDataHandler()
    }
  }, [token])

  const getRenewalDataHandler = () => {
    dispatch(getRenewalDataRequest({ token }))
      .then(unwrapResult)
      .then((res) => {
        return true
        // console.log("this is res======", res)
      })
      .catch((err) => {
        // console.log("this is err------", err)
      })
  }

  useEffect(() => {
    if (newDataLocal) {
      dispatch(
        performAddResetPayload({
          meals_deliver_per_day: newDataLocal.meals_deliver_per_day,
          meal_plan: newDataLocal.meal_plan,
          snacks_deliver_per_day: newDataLocal.snacks_deliver_per_day
        })
      )
    }
  }, [dataRec])

  const setUpUiHandler = () => {
    document.body.classList.add("headerBG")
  }
  const confirmBtnClickedHandler = () => {
    setConfirmBtnClicked(true)
    customTimeout(() => {
      setConfirmBtnClicked(false)
    }, 1000)
  }

  // const isExecutive = AppConstants.isExecutive
  const getDiscountDetails=(promoDetails,totalPrice,FinalPrice)=>{
  
    if(promoDetails?.type == "percentage"){
      return {
        promoType:'percentage',
        symbol:'%',
        percentNum: promoDetails?.value,
        AmountSaved : totalPrice - FinalPrice,
        totalAmount: Math.round(totalPrice)
      }
    }
    else{
      return {
        promoType:'flat',
        symbol:` AED`,
        percentNum: promoDetails?.value,
        AmountSaved : totalPrice - FinalPrice,
        totalAmount: Math.round(totalPrice)
      }
    }
  }

  // Discount checks
  const plan = useSelector((state) => state?.CheckOutReducer?.renewalSummary?.data);

  const payableAmount = get(plan, "total_price", 0);
  const undiscountedPrice = get(plan, "grand_total", 0);
  const promoDetails = get(plan, "discount", null);

  const discDetails =  getDiscountDetails(promoDetails, undiscountedPrice,payableAmount )
 
  useEffect(() => {
    if(promoDetails && isExecutive){
      setshowDiscBool(true)
    }
    if((undiscountedPrice > payableAmount || undiscountedPrice != payableAmount)&& isExecutive ){
      setshowDiscBool(true)
    }else{
      setshowDiscBool(false)
    }
  }, [showDiscBool,promoDetails])
  
  return (
    <div>
      <ThemeProvider theme={theme}>
        <div className="mainBodyWrap">
          <Header dataRec={dataRec} isExecutive={
            // AppConstants.isExecutive
            isExecutive
          } />
          <AuthRedirector>
            <section
              className="page--wrapper"
            // style={{ pointerEvents: paymentCheck == "paid" ? "none" : "all" }}
            >
              {/* <div className="container container--custom"> */}
              {/* <MealBox
                paymentCheck={paymentCheck}
                confirmBtnClicked={confirmBtnClicked}
                summaryData={summaryLocal}
                Renewal={true}
                resetPayload={resetPayload}
                paymentStatusRenewal={paymentCheck}
                isExecutive={AppConstants.isExecutive} 
                > */}
              {/* <div className="container container--custom"> */}
              <MealBox
                paymentCheck={paymentCheck}
                confirmBtnClicked={confirmBtnClicked}
                summaryData={summaryLocal}
                Renewal={true}
                resetPayload={resetPayload}
                paymentStatusRenewal={paymentCheck}
                isExecutive={isExecutive}
              >
                <div className="container container--custom">
                  {/* <EditPreferences
                  title="Let’s Renew Your Meal Plan"
                  para="We’re really pleased you want to renew with PractiCal. Below is a reminder of your Preferences. You can change these & adjust the price."
                /> */}
                </div>
              </MealBox>
              {/* </div> */}
            </section>
            {/* <RenewalText
            para="Why not subscribe & save this time & "
            para2="get an extra 5% discount every time your Meal Plan automatically renews!"
          /> */}
            <PriceBox
              paymentCheck={paymentCheck}
              confirmBtnClicked={confirmBtnClickedHandler}
              renewal={true}
              checkOut={false}
              dataRec={dataRec}
              // clicked={handleCheckOutRequest}
              price={`${Math.round(price)}`}
              isExecutive={
                // AppConstants.isExecutive
                isExecutive
              }
              totalPrice={payableAmount}
              discDetails={discDetails}
              isPriceDiscounted={showDiscBool}
            />
          </AuthRedirector>
          <div className="footerWrap">
            <Footer isExecutive={
              // AppConstants.isExecutive
              isExecutive
            } />
          </div>
        </div>
      </ThemeProvider>
    </div>
  )
}

export default Renewal
