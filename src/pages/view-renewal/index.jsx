import React, { useEffect, useState } from "react"
import Header from "../../components/header"
import Footer from "../../screens/footer"
import get from "lodash/get"
import { useDispatch, useSelector } from "react-redux"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../styles/themes/theme"
import EditPreferences from "../../screens/editContent"
import MealBox from "../../screens/mealBox"
import { getRenewalDataRequest } from "../../store/reducers/checkoutReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import { performAddResetPayload } from "store/actions/resetAction"
import EditPrefBox from "components/editPreferencesBox"
import AppColors from "helpers/AppColors"
import AppConstants from "helpers/AppConstants"
import moment from "moment"
import AuthRedirector from "components/auth-redirector"

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
  const { homeData } = useSelector((state) => state.homepage)

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
    console.log(paymentCheck, "paymentCheck")
  }, [paymentCheck])

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
  }
  const [date, setDate] = useState("")
  // const isExecutive = AppConstants.isExecutive
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
              className="page--wrapper sec-padded--bottom"
            // style={{ pointerEvents: paymentCheck == "paid" ? "none" : "all" }}
            >
              <div className="container container--custom">
                <EditPreferences
                  title="You have successfully Renewed your Meal Plan"
                // para="We’re really pleased you want to renew with PractiCal. Below is a reminder of your Preferences. You can change these & adjust the price."
                />
                <div className={`editprefWrapper ${isExecutive ? "isExecutive" : ""}`} >
                  <EditPrefBox
                    className="sty1"
                    renewalView={true}
                    PrimaryText={"Total Paid Price"}
                    price={`${Math.round(price)} AED`}
                    // calorie={totalCalorie}
                    color="#D1EBE4"
                    textColor={AppColors.black}
                    renewalText={"Including VAT"}
                    isExecutive={isExecutive}
                  />
                  <EditPrefBox
                    className="sty2"
                    price={moment(date).format(AppConstants.dateFormat)}
                    renewalView={true}
                    PrimaryText={"Your Next Meal Plan Start Date"}
                    // calorie={practicalCalorie}
                    color="#119A77"
                    textColor={AppColors.white}
                    renewalText={""}
                    isExecutive={isExecutive}
                  />
                  {/* <div className="editprefWrapper ">
                    <EditPrefBox
                        renewalView={true}
                        PrimaryText={"Total Paid Price"}
                        price={`${Math.round(price)} AED`}
                        // calorie={totalCalorie}
                        color="red"
                        textColor={AppColors.black}
                        renewalText={"Including VAT"}
                        isExecutive={
                          // AppConstants.isExecutive
                          isExecutive
                        }
                      />
                    <EditPrefBox
                      price={moment(date).format(AppConstants.dateFormat)}
                      renewalView={true}
                      PrimaryText={"Your Next Meal Plan Start Date"}
                      // calorie={practicalCalorie}
                      color="#119A77"
                      textColor={AppColors.white}
                      renewalText={""}
                      isExecutive={
                        // AppConstants.isExecutive
                        isExecutive
                      }
                    /> */}
                </div>
              </div>

              {/* <PriceBox
              paymentCheck={paymentCheck}
              confirmBtnClicked={confirmBtnClickedHandler}
              renewal={true}
              checkOut={false}
              dataRec={dataRec}
              // clicked={handleCheckOutRequest}
              price={`${Math.round(price)}`}
            /> */}
              <div className="container container--custom">
                {/* <RenewalText
                para="Why not subscribe & save this time & "
                para2="get an extra 5% discount every time your Meal Plan automatically renews!"
              /> */}
                <MealBox
                  btnDisable={true}
                  renewalView={true}
                  dateCall={setDate}
                  paymentCheck={paymentCheck}
                  confirmBtnClicked={confirmBtnClicked}
                  summaryData={summaryLocal}
                  Renewal={true}
                  resetPayload={resetPayload}
                  paymentStatusRenewal={paymentCheck}
                  isExecutive={
                    // AppConstants.isExecutive
                    isExecutive
                  }
                />
              </div>
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
    </div>
  )
}

export default Renewal
