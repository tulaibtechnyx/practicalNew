import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Upcoming from "../../../public/images/icons/upcoming.svg"
import RenewalOrdersIcon from "../../../public/images/icons/upcoming.svg"
import Prefence from "../../../public/images/icons/prefence.svg"
import Macros from "../../../public/images/icons/macros.svg"
import Eating from "../../../public/images/icons/eating.svg"
import Partner from "../../../public/images/icons/partners.svg"
import Freefood from "../../../public/images/icons/free-food.svg"
import CookBook from "../../../public/images/icons/cookbook.svg"
import History from "../../../public/images/icons/history.svg"
import Questions from "../../../public/images/icons/questions.svg"
import PastOrders from "../../../public/images/icons/past-order.svg"
import CodeIcon from "../../../public/images/icons/code-icon.svg"
import WalletIcon from "../../../public/images/icons/wallet-icon.svg"
import SecAccordion from "../secAccordion"
import EditPreferences from "../../screens/editContent"
import MealBox from "../../screens/mealBox"
import VideoInlineScreen from "../../screens/videoInlinescreen"
import MealTypeScreen from "../../screens/mealsTypeScreen"
import DiscountedScreen from "../../screens/discountedScreen"
import FoodScreen from "../../screens/foodScreen"
import QuesScreen from "screens/question"
import UpcomingOrders from "../../screens/UpcomingOrders/index"
import RenewalOrders from "../../screens/UpcomingOrders/index"
import OrderHistory from "../orderHistory"
import WalletTab from "../walletTabnew/index"
import Reactivate from "../reActivate"
import EditPrefBox from "components/editPreferencesBox"
import { useSelector, useDispatch } from "react-redux"
import $ from "jquery"
import get from "lodash/get"
import {
  GetTickersRequest,
  UpcomingOrdersRequest,
  getEmiratesAddressesRequest,
  getRenewalRequestData
} from "../../store/reducers/dashboardReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import AppLogger from "helpers/AppLogger"
import PDFcomponent from "components/pdfComponents"
import WeekData from "components/weekData"
import CodeGenerator from "components/codgenerator"
import PastOrdersListing from "components/pastOrders"
import AppColors from "helpers/AppColors"
import { Link } from "@mui/material"
import AppRoutes from "helpers/AppRoutes"
import { useRouter } from "next/router"
import { boolean } from "yup/lib/locale"
import AppDataConstant from "helpers/AppDataConstant"
import ConfirmationModal2 from "components/popUp/confirmationModal2"
import moment from "moment"
import AppConstants from "helpers/AppConstants"

import { animateScroll as scroller } from "react-scroll"
import { customTimeout, handleScrollToTop } from "helpers/ShortMethods"
function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Box component={"div"}>{children}</Box>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  }
}

export default function BasicTabs({
  changed,
  updated,
  canEdit,
  retakeQuiz,
  order_id,
  type,
  setPropFunctions,
  handleAddToWallet,
  isOrderReady,
  setter, 
  isExecutive
}) {
  const { cookBook: cookBookPDFs, renewalData } = useSelector(
    (state) => state.home
  )
  const [cookBooks, setCookBooks] = useState([])
  const [paidStatus, setpaidStatus] = useState(null)

  useEffect(() => {
    setCookBooks(cookBookPDFs)
  }, [cookBookPDFs])

  const paymentCheck = get(paidStatus, "order.payment_status", "")

  const dispatch = useDispatch()

  const { userProfile, loading } = useSelector((state) => state.profile)
  const { userDetails } = useSelector((state) => state.auth)
  const { startUpData, orders, ticker, orderHistory, UAEAddresses } = useSelector(
    (state) => state.home
  )
  useEffect(() => {
    if (renewalData) {
      setpaidStatus(renewalData)
    }else{
      setpaidStatus(false)
    }
  }, [renewalData, startUpData])
  const [value, setValue] = useState(0)
  const [userCanEdit, setUserCanEdit] = useState(false)
  const [localUserDetails, setLocalUserDetails] = useState(null)
  const [ordersLocal, setOrdersLocal] = useState([])
  const [startUpDataLocal, setStartupDataLocal] = useState(null)
  const [loadingState, setLoadingState] = useState(false)
  const [planExpired, setPlanExpired] = useState(false)
  const [pastOrderEnable, setPastOrderEnable] = useState(false)
  const [freeFood, setFreeFood] = useState(false)
  const [userProfileLocal, setUserProfileLocal] = useState(null)
  const [orderhistorylocal, setorderhistorylocal] = useState(null)
  const [open, setOpen] = useState(false)
  const [scroll, setscroll] = useState(false)
  const [isRenewedPlanLocal, setIsRenewedPlanLocal] = useState(false)
  const [isPriceConfirmation, setIsPriceConfirmation] = useState({isChanges: false, onConfirm: () => {}, onCancel: () => {}});

  const getTopDown = get(ticker, "not_paid_type", "")

  const practicalCalorie = get(
    userProfileLocal,
    "guest.practical_deliver_calories_per_day",
    0
  )
  const [valuesChanged, setValuesChanged] = useState(false)
  const [tickerDataLocal, setTickerDataLocal] = useState(null)
  // const tickerPaymentTypee = get(tickerDataLocal, "payment_status", "")

  useEffect(() => {
    if (orderHistory) {
      setorderhistorylocal(orderHistory)
    }
  }, [orderHistory])

  function paidstatusFinder() {
    if (orderhistorylocal?.length) {
      const paidAndActiveOrder = orderhistorylocal.find(
        (val) =>
          val.payment_status == "paid" &&
          val.not_paid_type == "full" &&
          val.is_active == 1
      )
      if (paidAndActiveOrder && !planExpired) {
        return true
      } else {
        return false
      }
    }
  }

  function statusFinder() {
    if (orderhistorylocal?.length) {
      const paidvalue = orderhistorylocal.find(
        (val) => val.payment_status == "paid"
      )
      if (paidvalue) {
        return false
      } else {
        return true
      }
    }
  }
  useEffect(() => {
    if (ticker) {
      setTickerDataLocal(ticker)
    }
  }, [ticker])
  const currentType = get(userProfileLocal, "guest.type", "")
  const userEndDate = get(userProfileLocal, "profile.meal_plan_end_date", "")
  const perfectPortion = get(userProfileLocal, "guest.default_calorie", "")
  const userSubscriptionStatus = get(
    userProfileLocal,
    "profile.is_subscribed",
    ""
  )
  const totalCalorie = get(
    userProfileLocal,
    "guest.recommended_calories_per_day",
    0
  )
  const caloriesWithoutWaterWeight = get(
    startUpDataLocal,
    "oiginal_guest_data.calories_without_water_weight",
    0
  )

  const mealPlan = get(userProfileLocal, "guest.meal_plan", [])
  const snackPlan = get(userProfileLocal, "guest.snack_plan", [])
  const practicalCalories = get(
    startUpDataLocal,
    "oiginal_guest_data.practical_deliver_calories_per_day",
    ""
  )
  const snackPlanCountToCompare = get(
    startUpDataLocal,
    "oiginal_guest_data.snack_plan",
    []
  )
  const mealPlanCountToCompare = get(
    startUpDataLocal,
    "oiginal_guest_data.meal_plan",
    []
  )
  const notificationCount = get(startUpDataLocal, "wallet_notify_count", 0)
  const recommendedCalorie = get(
    userProfile,
    "guest.calories_meal_require_per_day",
    0
  )

  const token = get(localUserDetails, "data.auth_token", "")

  const getRenewalDataRequestHandler = () => {
    const { auth_token: token } = userDetails?.data
    dispatch(getRenewalRequestData({ token }))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("this is response==========", res)
      })
      .catch((err) => {
        AppLogger("this is error==========", err)
      })
  }

  const getEmirateAddressesHandler = () => {
    try {
      const { auth_token } = userDetails?.data

      dispatch(getEmiratesAddressesRequest({ token: auth_token }))
        .then(unwrapResult)
        .then((res) => {
          AppLogger("This is resposne=========", res)
        })
        .catch((err) => {
          AppLogger("This is error=========", err)
        })
    } catch (err) {
      AppLogger("This is error=======", err)
    }
  }

  useEffect(() => {
    getExpiredStatusHandler()
  }, [userProfileLocal])

  useEffect(() => {
    if (userProfile) {
      setUserProfileLocal(userProfile)
    }
  }, [userProfile])

  useEffect(() => {
    if (loading) {
      setLoadingState(loading)
    }
  }, [loading])

  useEffect(() => {
    if (orders) {
      setOrdersLocal(orders)
    }
  }, [orders])

  useEffect(() => {
    if (userDetails) {
      setLocalUserDetails(userDetails)
    }
  }, [userDetails])

  useEffect(() => {
    if(UAEAddresses?.length == 0){
      getEmirateAddressesHandler()
    }
  }, [])

  useEffect(() => {
    if (startUpData) {
      setStartupDataLocal(startUpData)
    }
  }, [startUpData])

  useEffect(() => {
    if(planExpired){
      getTickersData()
      getRenewalDataRequestHandler()
    }
  }, [planExpired])

  useEffect(() => {
    if (canEdit) {
      setUserCanEdit(true)
    } else {
      setUserCanEdit(false)
    }
  }, [canEdit])

  useEffect(() => {
    orderDisabledHandler()
  }, [ordersLocal])
  // useEffect(() => {
  //   const status = changedHandleer()
  //   AppLogger("This is status======", status)
  //   setValuesChanged(status)
  // }, [userProfile, startUpDataLocal])

  useEffect(() => {
    const status = changedHandleer()

    AppLogger("This is status======", status)

    setValuesChanged(status)
  }, [practicalCalorie])

  const changedHandleer = () => {
    try {
      if (practicalCalorie && practicalCalories) {
        if (practicalCalorie !== practicalCalories) {
          return true
        } else {
          if (
            snackPlan.length == snackPlanCountToCompare.length &&
            mealPlan.length === mealPlanCountToCompare.length
          ) {
            return false
          } else if (practicalCalorie !== practicalCalories) {
            return false
          } else {
            return true
          }
        }
      }
    } catch (error) {
      AppLogger("This is error======", error)
    }
  }

  const getExpiredStatusHandler = () => {
    try {
      if (userEndDate) {
        const today = moment().startOf("day")
        const userDate = moment(userEndDate).startOf("day")
        if (today.isAfter(userDate)) {
          setPlanExpired(true)
        } else {
          setPlanExpired(false)
        }
      } else {
        setPlanExpired(false)
      }
    } catch (err) {
      console.log("this is error======", err)
    }
  }

  const isEditPreferenceTab = (tabValue) => {
    if(renewalData){
      return tabValue == 3
    }

    return tabValue == 2
  }

  const handleChange = (event, newValue, val) => {
    if(isPriceConfirmation.isChanges && open !== null){
      setOpen(true)
    }else{
      if (val === true) {
        setscroll(true)
        customTimeout(() => {
          setscroll(false)
        }, 1000)
      } else {
        setscroll(false)
      }
      if (getTopDown == "top down" && open !== null) {
        setOpen(true)
      } else {
        setValue(newValue)
        changed(newValue)
        if(!isEditPreferenceTab(newValue)) getTickersData()
      }
    }
  }

  window && (window.handleGoToEP = () => {
    return new Promise((resolve) => {
      resolve(handleChange(null, renewalData || paidStatus ? 3 : 2))
    })
  });
  useEffect(() => {
    setPropFunctions({
      handleTabChange: handleChange
    })
  }, [])

  const reactive = false

  const getTickersData = () => {
    if (token) {
      dispatch(GetTickersRequest({ token }))
        .then(unwrapResult)
        .then((res) => {
          // AppLo("Response at GetResturantsRequest", res)
          if (!planExpired) {
            $("body").addClass("tickerON")
          } else {
            $("body").removeClass("tickerON")
          }
        })
        .catch((err) => {
          // AppLogger("Error at GetResturantsRequest", err)
          $("body").removeClass("tickerON")
        })
    }
  }

  const orderDisabledHandler = () => {
    let count = 0
    for (let index = 0; index < ordersLocal.length; index++) {
      const element = ordersLocal[index]
      count = count + element?.past_data?.length
    }
    AppLogger("This is count======= ", count)
    if (count >= 1) {
      setPastOrderEnable(true)
      setter(true)
    } else {
      setPastOrderEnable(false)
      setter(false)
    }
  }

  const tabHandler = () => {}

  const [tabchange, setTabchange] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof JSON.parse(localStorage.getItem("isRenewedPlan")) == "boolean"
    ) {
      setIsRenewedPlanLocal(JSON.parse(localStorage.getItem("isRenewedPlan")))
    }

    if (
      typeof window !== "undefined" &&
      typeof JSON.parse(localStorage.getItem("isFaqWallet")) == "boolean"
    ) {
      handleChange(0, paidStatus ? 2 : 1)
      localStorage.removeItem("isFaqWallet")
    }
  }, [router.isReady])

  const isPastOrdersEnabled = () => {
    const pastOrdersExist = ordersLocal.find(
      (val) => val?.past_data?.length > 0
    )

    if (pastOrdersExist) {
      return true
    } else {
      return false
    }
  }

  const handleChangeTab = () => {
    if (isRenewedPlanLocal) {
      handleChange(0, 1)
      localStorage.removeItem("isRenewedPlan")
      setIsRenewedPlanLocal(false)
    }
  }

  useEffect(() => {
    handleChangeTab()
  }, [isRenewedPlanLocal])

  const callUpcomingOrdersHandler = () => {
    try {
      if(token){
        dispatch(UpcomingOrdersRequest({ token }))
      }
    } catch (error) {
      AppLogger("Error at callUpcomingOrdersHandler", error)
    }
  }  
  return (
    <>
      <ConfirmationModal2
        onlyMsg={true}
        modalBody={
          "You have some unsaved changes"
        }
        // modalTitle={"Confirm Add to Wallet"}
        // disclaimer={
        //   "For more information on using the credit in your Wallet, please click "
        // }
        cancelText={"Discard Changes"}
        confirmText={"Save Changes"}
        open={open}
        handleClose={(val, reason) => {
          if (reason !== "backdropClick") {
            setOpen(false)
            if(typeof isPriceConfirmation.onCancel == 'function'){
              isPriceConfirmation.onCancel()
            }
          }
          // setOpen(null)
        }}
        onConfirmPress={() => {
          if(typeof isPriceConfirmation.onConfirm == 'function'){
            isPriceConfirmation.onConfirm()
          }
          setOpen(false)
        }}
        // setscroll1={setscroll}
      />
      <Box sx={{ width: "100%" }}>
        <Box className={`tabsWrapper ${isExecutive ? "isExecutive" : ""}`}>
          <div className={`container container--custom  `}>
            {loadingState ? (
              <Tabs
                value={value}
                onChange={(_, newValue) => {handleChange(_, newValue), handleScrollToTop()}}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                <Tab
                  className={`icons ${isExecutive ? "isExecutive" : ""}`}
                  icon={
                    <span>
                      <Upcoming />
                    </span>
                  }
                  label="Upcoming Orders"
                  {...a11yProps(0)}
                />
                {paidStatus && (
                  <Tab
                  className={`icons ${isExecutive ? "isExecutive" : ""}`}
                    icon={
                      <span>
                        <RenewalOrdersIcon />
                      </span>
                    }
                    label="Renewed Plan"
                    {...a11yProps(1)}
                  />
                )}
                <Tab
                  className={`icons ${isExecutive ? "isExecutive" : ""}`}
                  icon={
                    <span style={{ position: "relative" }}>
                      {notificationCount ? (
                        <div className="notification-badge"></div>
                      ) : null}
                      <WalletIcon />
                    </span>
                  }
                  label="Wallet"
                  {...a11yProps(paidStatus ? 2 : 1)}
                />
                {userCanEdit && (
                  <Tab
                  className={`icons ${isExecutive ? "isExecutive" : ""}`}
                    icon={
                      <span>
                        <Prefence />
                      </span>
                    }
                    label="Edit Preferences"
                    {...a11yProps(paidStatus ? 3 : 2)}
                  />
                )}
                <Tab
                  className={`icons ${isExecutive ? "isExecutive dontShowOnExecutive" : ""}`}
                  icon={
                    <span>
                      <Macros />
                    </span>
                  }
                  label="Macros"
                  {...a11yProps(paidStatus ? 4 : 3)}
                />
                <Tab
                  className={`icons ${isExecutive ? "isExecutive dontShowOnExecutive" : ""}`}
                  icon={
                    <span>
                      <Partner />
                    </span>
                  }
                  label="Partner Offers"
                  {...a11yProps(paidStatus ? 5 : 4)}
                />
                <Tab
                  className={`icons ${isExecutive ? "isExecutive" : ""}`}
                  icon={
                    <span>
                      <Freefood />
                    </span>
                  }
                  label="Free Food"
                  {...a11yProps(paidStatus ? 6 : 5)}
                />
                <Tab
                  className={`icons ${isExecutive ? "isExecutive dontShowOnExecutive" : ""}`}
                  icon={
                    <span>
                      <Questions />
                    </span>
                  }
                  label="Questions"
                  {...a11yProps(paidStatus ? 7 : 6)}
                />
                <Tab
                  className={`icons ${isExecutive ? "isExecutive" : ""}`}
                  icon={
                    <span>
                      <History />
                    </span>
                  }
                  label="Order History"
                  {...a11yProps(paidStatus ? 8 : 7)}
                />
                <Tab
                  className={`icons ${isExecutive ? "isExecutive dontShowOnExecutive" : ""}`}
                  icon={
                    <span>
                      <CodeIcon />
                    </span>
                  }
                  label="Code"
                  {...a11yProps(paidStatus ? 9 : 8)}
                />
                {pastOrderEnable && (
                  <Tab
                  className={`icons ${isExecutive ? "isExecutive" : ""}`}
                    icon={
                      <span>
                        <PastOrders />
                      </span>
                    }
                    label="Past Orders"
                    {...a11yProps(paidStatus ? 10 : 9)}
                  />
                )}
                {cookBooks?.length > 0 ? (
                  <Tab
                  className={`icons ${isExecutive ? "isExecutive" : ""}`}
                    icon={
                      <span>
                        <CookBook />
                      </span>
                    }
                    label="Cook Book"
                    {...a11yProps(
                      pastOrderEnable && paidStatus
                        ? 11
                        : pastOrderEnable
                        ? 10
                        : paidStatus
                        ? 10
                        : 9
                    )}
                  />
                ) : null}
              </Tabs>
            ) : null}
          </div>
        </Box>

        <TabPanel value={value} index={0}>
          {!planExpired ? (
            <UpcomingOrders
             isExecutive={isExecutive}
              order_id={order_id}
              isOrderReady={isOrderReady}
              type={type}
              startDateCheck={pastOrderEnable}
              updated={() => changed(value)}
              handleTabChange={() => {
                pastOrderEnable ? handleChange(0, 1) : handleChange(0, 1)
              }}
            />
          ) : (
            <Reactivate isOrderReady={isOrderReady} retakeQuiz={retakeQuiz} />
          )}

          {/* <WeekData />
        <Portal /> */}
        </TabPanel>
        {paidStatus && (
          <TabPanel value={value} index={1}>
            <RenewalOrders
              order_id={order_id}
              type={type}
              startDateCheck={pastOrderEnable}
              updated={() => changed(value)}
              isRenewedPlan={true}
              isOrderReady={isOrderReady}
              isExecutive={isExecutive}
            />
          </TabPanel>
        )}
        <TabPanel value={value} index={paidStatus ? 2 : 1}>
          <div className="sec-padded">
            <div className="container container--custom">
              <EditPreferences title="Your Wallet" />
              <WalletTab handleTabChange={handleChange} />
            </div>
          </div>
        </TabPanel>
        {userCanEdit && (
          <TabPanel value={value} index={paidStatus ? 3 : 2}>
            <div className="sec-padded">
              <div className="container  container--custom">
                <EditPreferences
                  title={
                    renewalData
                      ? "Edit Preferences: Your Current Plan"
                      : "Edit Preferences"
                  }
                  para={
                    renewalData
                      ? "If you have renewed your Plan & updated your preferences these will show when your new Plan starts."
                      : "Feel free to adjust the information below & see how it affects the Calories & price of your current Plan"
                  }
                />

                <div className="editprefWrapper">
                  {currentType == "quiz_a" && (
                    <div className="editprefBox">
                      <EditPrefBox
                        PrimaryText={
                          "Total number of calories you need per day (based on your quiz answers)"
                        }
                        // SecondryText={
                        //   "Includes ALL the Meals, Snacks & Drinks you could have in one day "
                        // }
                        calorie={caloriesWithoutWaterWeight ?? totalCalorie}
                        color="#119A77"
                        textColor={AppColors.white}
                      />
                      <EditPrefBox
                        changed={valuesChanged}
                        PrimaryText={
                          "Number of calories Practical will deliver per day"
                        }
                        // SecondryText={
                        //   "See below to find out how these Calories are split across your PractiCal Delivery"
                        // }
                        calorie={practicalCalorie}
                        color="#119A77"
                        textColor={AppColors.white}
                      />
                    </div>
                  )}
                  <EditPrefBox
                    PrimaryText={
                      "Your Perfect Portion size (you can adjust the size of your meals below)"
                    }
                    // SecondryText={`A perfect meal should be of ${perfectPortion} calorie`}
                    calorie={perfectPortion}
                    color="#D1EBE4"
                    textColor={AppColors.black}
                  />
                </div>

                <MealBox
                  setChangesPending={setIsPriceConfirmation}
                  handleClick={() => {
                    if (getTopDown == "top down" && open !== null) {
                      setOpen(true)
                    } else {
                      console.log("else=======> ")
                      handleChange(0, 0)
                    }
                  }}
                  paymentStatusRenewal={paymentCheck}
                  isExecutive={isExecutive}
                />
              </div>
            </div>
          </TabPanel>
        )}
        <TabPanel value={value} index={paidStatus ? 4 : 3}>
          <div className="container container--custom">
            <div className="video-wrapper">
              <EditPreferences
              isExecutive={isExecutive}
                mb={true}
                title="Making Macros easy"
                para="There are just two types of PractiCal Meals."
                // para2=" Type 1: Calorie-Counted & Macro-Balanced Meals."
                para2=" Type 1: Calorie-Counted Meals"
                // para3="Type 2: Calorie-Counted Meals "
                para3="Type 2: Calorie-Counted & Macro-Balanced Meals."
                para4=" Here’s how PractiCal makes tracking your Protein, Carbohydrates & Fats so much easier:"
              />
              <div className="sec-wrap">
                <VideoInlineScreen
                  onLoop={false}
                  videoLink={AppDataConstant.macroVideo}
                  videoPoster={AppDataConstant.macroPoster}
                />
                <div className={`linkWrap ${isExecutive ? "isExecutive" : ""}`}>
                  <Typography variant="body3">
                    <Link
                      onClick={() => {
                        handleChange(0, paidStatus ? 7 : 6)
                      }}
                    >
                      FAQs here
                    </Link>
                  </Typography>
                  <Typography variant="body3">
                    <Link target="_blank" href={AppRoutes.instaGram}>
                      Say hello on Instagram here
                    </Link>
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          <MealTypeScreen
            isExecutive={isExecutive}
            percentage1="--%"
            percentage2="--%"
            percentage3="--%"
            calories="500"
            protien="varies"
            crabs="varies"
            fat="varies"
            title="Meal Type 1"
            para="Calorie-Counted Meals"
            popUp={true}
          />
          <MealTypeScreen
            isExecutive={isExecutive}
            mb={true}
            percentage1="25%"
            percentage2="45%"
            percentage3="30%"
            calories="500"
            protien="31g"
            crabs="56g"
            fat="17g"
            bgColor={true}
            title="Meal Type 2"
            para="Calorie-Counted & Macro-Balanced Meals"
            paraSm="Based on a 500 Calorie portion. Portion sizes will vary per person"
          />
        </TabPanel>
        <TabPanel value={value} index={paidStatus ? 5 : 4}>
          <div className="sec-padded">
            <div className="container container--custom">
              <div className="eating-Wrapper">
                <EditPreferences
                  title="Partner Offers"
                  para="There's so much to do & see in the UAE. So we’ve teamed up with our favourite restaurants, cafes, fitness & health brands to give you discounts & guidance when you are planning your day ahead! You can explore the options below. It pays to be PractiCal! "
                />
                <SecAccordion
                  tabchange={tabchange}
                  tabwork={setTabchange}
                  handleChange2={() => {
                    handleChange(0, paidStatus ? 7 : 6)
                  }}
                />
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={paidStatus ? 6 : 5}>
          <div className="sec-padded">
            <div className="container container--custom">
              <EditPreferences
                title="Free Food"
                para={isExecutive ? 
                  "Invite your colleagues to try PractiCal Executive."
                  : "Invite your friends to try PractiCal"
                }
                para2={isExecutive && "Note: this functionality only works if they are working in an organisation that is registered with PractiCal Executive."}
              />
              <FoodScreen
                handleChange={() => handleChange(0, paidStatus ? 7 : 6)}
                freeFoodSetter={setFreeFood}
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={paidStatus ? 7 : 6}>
          <div className="sec-padded">
            <div className="container container--custom">
              <EditPreferences title="Frequently Asked Questions" />
              <QuesScreen
                tabchange={tabchange}
                scroll={scroll}
                freeFood={freeFood}
                handleTabChange={() => handleChange(0, paidStatus ? 2 : 1)}
                isExecutive={isExecutive}
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={paidStatus ? 8 : 7}>
          <div className="sec-padded">
            <div className="container container--custom">
              <EditPreferences title="Order History" />
              <OrderHistory handleTabChange={handleChange} />
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={paidStatus ? 9 : 8}>
          <div className="sec-padded">
            <div className="container container--custom">
              {paidstatusFinder() ? (
                <>
                  <EditPreferences
                    title="Generate Code"
                    para="Click here to generate your unique code. Show this code to your server & they will authenticate you as a PractiCal member."
                  />
                  <CodeGenerator />
                </>
              ) : (
                <>
                  <EditPreferences
                  isExecutive={isExecutive}
                    handlePartnerChange={() => {
                      handleChange(0, paidStatus ? 5 : 4)
                    }}
                    link={true}
                    para="Here you can generate a unique code to prove you are signed up to PractiCal. Use it to get a discount with our Partner Restaurants & Brands. To explore our Partner Offers click"
                  />
                  <Typography className={`hiddenFeature ${isExecutive ? "isExecutive" : ""}`}>
                    To access this (awesome) feature, please{" "}
                    <Link
                      onClick={() => {
                        planExpired
                          ? router.push(AppRoutes.renewal)
                          : router.push(
                              `${AppRoutes.checkOut}?type=${type}&order_id=${order_id}`
                            )
                      }}
                      sx={{ display: "inline", cursor: "pointer" }}
                    >
                      {planExpired
                        ? "Re-activate your plan"
                        : "complete your payment"}
                    </Link>
                  </Typography>
                </>
              )}
            </div>
          </div>
        </TabPanel>
        {pastOrderEnable ? (
          <TabPanel value={value} index={paidStatus ? 10 : 9}>
            {/* <WeekData /> */}
            <div className="sec-Portal sty2">
              <PastOrdersListing isExecutive={isExecutive} updated={() => callUpcomingOrdersHandler()} />
            </div>
          </TabPanel>
        ) : null}
        {cookBooks?.length > 0 ? (
          <TabPanel
            value={value}
            index={
              pastOrderEnable && paidStatus
                ? 11
                : pastOrderEnable
                ? 10
                : paidStatus
                ? 10
                : 9
            }
          >
            <div className="sec-padded">
              <div className="container container--custom">
                {paidstatusFinder() ? (
                  <>
                    {" "}
                    <EditPreferences title="Download your Cook Book below" />
                    {/* <OrderHistory cookBook={true} /> */}
                    <PDFcomponent isExecutive={isExecutive}/>
                  </>
                ) : (
                  <>
                    <EditPreferences para="Here you can view or download your very own Meal Plan designed for your Perfect Portion size" />
                    <Typography className={`hiddenFeature ${isExecutive ? "isExecutive" : ""}`}>
                      To access this (awesome) feature, please{" "}
                      <Link
                        onClick={() => {
                          planExpired
                            ? router.push(AppRoutes.renewal)
                            : router.push(
                                `${AppRoutes.checkOut}?type=${type}&order_id=${order_id}`
                              )
                        }}
                        sx={{ display: "inline", cursor: "pointer" }}
                      >
                        {planExpired
                          ? "Re-activate your plan"
                          : "complete your payment"}
                      </Link>
                    </Typography>
                  </>
                )}
              </div>
            </div>
          </TabPanel>
        ) : null}
      </Box>
    </>
  )
}

BasicTabs.propTypes = {
  changed: PropTypes.func
}
