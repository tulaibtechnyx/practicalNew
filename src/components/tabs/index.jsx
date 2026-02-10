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
import SecAccordion from "../../components/secAccordion"
import EditPreferences from "../../screens/editContent"
import MealBox from "../../screens/mealBox"
import VideoInlineScreen from "../../screens/videoInlinescreen"
import MealTypeScreen from "../../screens/mealsTypeScreen"
import DiscountedScreen from "../../screens/discountedScreen"
import FoodScreen from "../../screens/foodScreen"
import QuesScreen from "screens/question"
import UpcomingOrders from "../../screens/UpcomingOrders/index"
import AddItems from "../../screens/AddItems"
import RenewalOrders from "../../screens/UpcomingOrders/index"
import OrderHistory from "../../components/orderHistory"
import WalletTab from "../../components/walletTabnew/index"
import Reactivate from "../reActivate"
import EditPrefBox from "components/editPreferencesBox"
import { useSelector, useDispatch } from "react-redux"
import $ from "jquery"
import get from "lodash/get"
import {
  Addcalendlybooking,
  GetFreeFoodRequest,
  GetTickersRequest,
  Getcalendlybooking,
  UpcomingOrdersRequest,
  getEmiratesAddressesRequest,
  getRenewalRequestData,
  setGlobalLoading,
  setactiveTabvalue,
  setpaidSliderEPTriggered,
  setsaveTabChangesButtonHit,
  setswitchTabTo,
  settriggerFortabChange
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
import { customTimeout, handleScrollToTop } from "helpers/ShortMethods"
import { formatDateToYMDHIS, getCache, setCache , isNewRequest, getMaxReferrerAmount} from "@helpers/CommonFunc"
import Thankyou from "@components/popUp/thankYou"
import Loader2 from "@components/loader/Loader2"
const TabValues = AppConstants?.TabValues;
function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value != index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value == index && (
        <Box sx={{ p: 3 }}>
          <Box component={"div"}>{children}</Box>
        </Box>
      )}
    </div>

  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
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
  isExecutive,
}) {
  const { cookBook: cookBookPDFs, renewalData, activeTabvalue ,paidSliderEPTriggered, triggerFortabChange, switchTabTo,loaderForunsaved,freeFoodData} = useSelector(
    (state) => state.home
  )
  const [cookBooks, setCookBooks] = useState([])
  const [paidStatus, setpaidStatus] = useState(null)
  const planExpiredUpcoming = useSelector((state) => state.home.planExpiredUpcoming);
  const globalLoading = useSelector((state) => state.home.globalLoading);

  useEffect(() => {
    setCookBooks(cookBookPDFs)
  }, [cookBookPDFs])

  const paymentCheck = get(paidStatus, "order.payment_status", "")

  const dispatch = useDispatch()

  const { userProfile, loading } = useSelector((state) => state.profile)
  const { userDetails } = useSelector((state) => state.auth)
  const { startUpData, orders, ticker, orderHistory, UAEAddresses, GetcalendlybookingData } = useSelector(
    (state) => state.home
  )
  useEffect(() => {
    if (renewalData) {
      setpaidStatus(renewalData)
    } else {
      setpaidStatus(false)
    }
  }, [renewalData, startUpData])
  const { decorationQuizData } = useSelector((state) => state.homepage);
  const [value, setValue] = useState(TabValues.UPCOMING_ORDERS)
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
  const [isPriceConfirmation, setIsPriceConfirmation] = useState({ isChanges: false, onConfirm: () => { }, onCancel: () => { } });
  const getTopDown = get(ticker, "not_paid_type", "")

  const practicalCalorie = get(
    userProfileLocal,
    "guest.practical_deliver_calories_per_day",
    0
  )
  const [valuesChanged, setValuesChanged] = useState(false)
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
  const currentType = get(userProfileLocal, "guest.type", "")
  const userEndDate = get(userProfileLocal, "profile.meal_plan_end_date", "")
  const perfectPortion = get(userProfileLocal, "guest.default_calorie", "")
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

  const token = get(localUserDetails, "data.auth_token", "")
  const getRenewalDataRequestHandler = () => {
    const { auth_token: token } = userDetails?.data
    try {
      
      dispatch(getRenewalRequestData({ token }))
        .then(unwrapResult)
        .then((res) => {
          AppLogger("this is response==========", res)
        })
        .catch((err) => {
          AppLogger("this is error==========", err)
        })
      } catch (error) {
      AppLogger("this is error==========", error)
      
    }
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
    if(userProfile){
      const { meal_plan_start_date } = userProfile?.profile
      if(meal_plan_start_date&&UAEAddresses?.length == 0){
        getEmirateAddressesHandler()
      }
    }
  }, [userProfile])

  useEffect(() => {
    if (startUpData) {
      setStartupDataLocal(startUpData)
    }
  }, [startUpData])

  useEffect(() => {
    if (planExpired) {
      getTickersData()
      getRenewalDataRequestHandler()
      // callUpcomingOrdersHandler()
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

  useEffect(() => {
    const status = changedHandleer()

    AppLogger("This is status======", status)

    setValuesChanged(status)
  }, [practicalCalorie])
  const getFreeFoodRequestHandler = () => {
    try {
      const cacheKey = `freefood`;
      const cachedData = getCache(cacheKey);
      // const cachedData = DataRepsonse?.data;
      if (cachedData) {
        AppLogger("Serving from cache", cachedData);
        return;
      }
      if (token) {
        dispatch(GetFreeFoodRequest({ token }))
          .then(unwrapResult)
          .then((res) => {
            setCache(cacheKey, res?.data?.data, 1, AppConstants.CacheTime.hour); // Cache for 5 minutes
            AppLogger("This is response at GetFreeFoodRequest========", res)
          })
          .catch((err) => {
            AppLogger("This is err at GetFreeFoodRequest========", err)
          })
        }

    } catch (err) { console.log("err,", err)}
  }
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

  const handleChange = (event, newValue, val) => {
    if(paidSliderEPTriggered){
      dispatch(settriggerFortabChange(true));
    }else{
      dispatch(settriggerFortabChange(false));
    }
    if (isPriceConfirmation.isChanges && open !== null) {
      setOpen(true)
    } else {
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
        // if (TabValues.UPCOMING_ORDERS == newValue) callUpcomingOrdersHandler()
        if (
          TabValues.UPCOMING_ORDERS == newValue ||
          TabValues.EDIT_PREFERENCES == newValue ||
          TabValues.RENEWAL_ORDERS == newValue) getTickersData()
        if (
          TabValues.FREE_FOOD == newValue) getFreeFoodRequestHandler()
      }
    }
  }
  window && (window.handleGoToUpcoming = () => {
    return new Promise((resolve) => {
      dispatch(setactiveTabvalue(TabValues.UPCOMING_ORDERS))
      resolve(handleChange(null, TabValues.UPCOMING_ORDERS))
    })
  });
  window && (window.handleGoToEP = () => {
    return new Promise((resolve) => {
      resolve(handleChange(null, TabValues.EDIT_PREFERENCES))
    })
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.handleGoTOoActiveTab = () => {
        return new Promise((resolve) => {
          resolve(setValue(activeTabvalue));
          resolve(handleChange(null,activeTabvalue));
        });
      };
    }
  }, [activeTabvalue, setValue]);
  useEffect(() => {
    setPropFunctions({
      handleTabChange: handleChange
    })
  }, [])

  const getTickersData = () => {
    try{
      const cacheKey = `tickers`;
      const cachedData = getCache(cacheKey);
        
      if (cachedData) {
        AppLogger("Serving from cache", cachedData);
        return;
      }
      if (token) {
        dispatch(GetTickersRequest({ token }))
          .then(unwrapResult)
          .then((res) => {
            setCache(cacheKey, res?.data?.data, 1, AppConstants.CacheTime.min);
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
    }catch(err){console.log("err",err)}
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
      handleChange(0, TabValues.WALLET)
      localStorage.removeItem("isFaqWallet")
    }
  }, [router.isReady])

  const handleChangeTab = () => {
    if (isRenewedPlanLocal) {
      handleChange(0, TabValues.RENEWAL_ORDERS)
      localStorage.removeItem("isRenewedPlan")
      setIsRenewedPlanLocal(false)
    }
  }

  useEffect(() => {
    handleChangeTab()
  }, [isRenewedPlanLocal])

  const callUpcomingOrdersHandler = async () => {
    try {
      if(token){
         const cacheKey = `upcoming`;
         const cachedData = getCache(cacheKey);
        if (cachedData) {
          AppLogger("Serving from cache", cachedData);
          return;
            }
        dispatch(UpcomingOrdersRequest({ token }))
        .then(unwrapResult)
        .then((res)=>{
          setCache(cacheKey, res?.data?.data, 1,AppConstants.CacheTime.min); // Cache for 10 sec
          AppLogger("Response at upcoming", res)
        })
      }
    } catch (error) {
      AppLogger("Error at callUpcomingOrdersHandler", error)
    }
  }

  const [AddItemsBool,setAddItems]=useState(false) ;
  const [AddItemstext,setAddItemstext]=useState('') ;
  const tabConfig = [
    {
      label: "Upcoming Orders",
      icon: <Upcoming />,
      key: TabValues.UPCOMING_ORDERS,
      condition: true, // Always visible
    },
    {
      label: "Free Food",
      icon: <Freefood />,
      key: TabValues.FREE_FOOD,
      condition: true,
    },
       {
      label: "Edit Preferences",
      icon: <Prefence />,
      key: TabValues.EDIT_PREFERENCES,
      condition: userCanEdit,
    },
    {
      label: "Wallet",
      icon: (
        <span style={{ position: "relative" }}>
          {notificationCount ? (
            <div className="notification-badge"></div>
          ) : null}
          <WalletIcon />
        </span>
      ),
      key: TabValues.WALLET,
      condition: true,
    },
     {
      label: "Order History",
      icon: <History />,
      key: TabValues.ORDER_HISTORY,
      condition: true,
    },
    {
      label: "Cook Book",
      icon: <CookBook />,
      key: TabValues.COOK_BOOKS,
      condition: cookBooks?.length > 0,
    },
      {
      label: "Questions",
      icon: <Questions />,
      key: TabValues.FAQs,
      condition: !isExecutive,
    },
    {
      label: "Add Items",
      icon: <Upcoming />,
      key: TabValues.ADD_ITEMS,
      condition: AddItemsBool, // Always visible
    },
    {
      label: "Renewed Plan",
      icon: <RenewalOrdersIcon />,
      key: TabValues.RENEWAL_ORDERS,
      condition: paidStatus?true:false,
    },
    
 
    {
      label: "Macros",
      icon: <Macros />,
      key: TabValues.MACROS,
      condition: !isExecutive,
    },
    {
      label: "Partner Offers",
      icon: <Partner />,
      key: TabValues.PARTNER_OFFERS,
      condition: !isExecutive,
    },
    {
      label: "Code",
      icon: <CodeIcon />,
      key: TabValues.CODE_GENERATOR,
      condition: !isExecutive,
    },
    {
      label: "Past Orders",
      icon: <PastOrders />,
      key: TabValues.PAST_ORDERS,
      condition: pastOrderEnable,
    },
    
  ];
    const tabFiltered = tabConfig.filter((tab) => tab.condition === true);
    const UnPaidOrderAndActive = Array.isArray(orderHistory) && orderHistory?.find((order)=>order?.payment_status == AppConstants.unpaid && order?.is_active == 1 );
    const tabsArrDecor = decorationQuizData?.TabsArray ?? tabFiltered ?? [];
    console.log("decorationQuizData?.TabsArray",decorationQuizData?.TabsArray)
    const tabsArrfiltered = tabsArrDecor
      .filter((tab) => {
        const checkFromOldConfig = tabConfig.find((t) => t.key === tab?.key);
        // Only include tabs that are set to show on dashboard and pass old config condition
        return tab.showOnDashboard && (checkFromOldConfig ? checkFromOldConfig.condition : true);
      })
      .map((tab) => {
        const checkFromOldConfig = tabConfig.find((t) => t.key === tab?.key);
      
        // Update icon from old config and add oldImg
        if (checkFromOldConfig) {
          return {
            ...tab,
            icon: checkFromOldConfig.icon,   // update current icon
            oldImg: checkFromOldConfig.icon // store original icon as oldImg
          };
        }
      
        return tab;
      });
    console.log("tabsArrfiltered",tabsArrfiltered)
    const tabsArr = tabsArrfiltered;


    const [finalData, setFinalData] = useState({ otherItemData: null, snackData: null, mealData: null });
    const [MealDate, setMealDate] = useState(null)
    const [ThanksPop, setThanksPop] = useState(false)
    const [coachingBool, setcoachingBool] = useState(false)
    const [ConsultBool, setConsultBool] = useState(false)
    const [redirectBool, setredirectBool] = useState(false)
    const [clickhereClicked, setclickhereClicked] = useState(false)
  
    const routerParam = router?.query;
    const objectForCalendly = {...routerParam,
      event_start_time: formatDateToYMDHIS(routerParam?.event_start_time),
      event_end_time: formatDateToYMDHIS(routerParam?.event_end_time),
     }

    const event_type_uuid = router?.query?.event_type_uuid ?? '';
    const assigned_to = router?.query?.assigned_to ?? '';
    const event_type_name = router?.query?.event_type_name ?? '';
     
    const SaveCalendlyReq = async ()=>{
      try {
        await dispatch(Addcalendlybooking({
         token: token,
         ...objectForCalendly
         })).then((res)=>{
          console.log("res",res)
        })
        
      } catch (error) {
        console.log("err",error)
      }
    }
    const GetCalendlyReq = async ()=>{
      try {
        await dispatch(Getcalendlybooking({
         token: token,
        })).then((res)=>{
          console.log("res",res)
        })
        
      } catch (error) {
        console.log("err",error)
      }
    }
    // open when needed
    // useEffect(() => {
    //   setredirectBool(true)
    //   if (token && AddItemsBool) {
    //     GetCalendlyReq()
    //   }
    //   if (event_type_uuid) {
    //     if(event_type_uuid == AppConstants.eventTypeId.Consultation){
    //       setConsultBool(true)
    //     }
    //     if(event_type_uuid == AppConstants.eventTypeId.Coaching){
    //       setcoachingBool(true)
    //     }
    //     setAddItems(true)
    //     setThanksPop(true)
    //     handleChange(_,AppConstants?.TabValues.ADD_ITEMS)
    //     setredirectBool(false)
    //   }else{
    //     setredirectBool(false)
    //   }
    // }, [router.isReady, localUserDetails, token, AddItemsBool, event_type_uuid])
  
    // useEffect(() => {
    //   console.log("switching before")
    //   if(switchTabTo){
    //     // console.log("switching",switchTabTo)
    //     if(switchTabTo  == TabValues.UPCOMING_ORDERS){
    //       callUpcomingOrdersHandler().then(()=>{
    //         handleChange(null,switchTabTo)
    //         setValue(switchTabTo)
    //         dispatch(setswitchTabTo(''))
    //         setOpen(false) // immedielty closing
    //       }).catch((er)=>{
    //         console.log('upcoming error after swtiching tab',er)
    //         setValue(switchTabTo)
    //         dispatch(setswitchTabTo(''))
    //         setOpen(false) // immedielty closing
    //       })
    //     }else{
    //       setValue(switchTabTo)
    //       dispatch(setswitchTabTo(''))
    //       setOpen(false) // immedielty closing

    //     }
    //   }
    // }, [switchTabTo])
    useEffect(() => {
      if(switchTabTo){
        handleChange(null,switchTabTo)
        setValue(switchTabTo)
        dispatch(setswitchTabTo(''))
        setOpen(false) // immedielty closing
      }
    }, [switchTabTo])
    
    useEffect(() => {
      if(paidSliderEPTriggered ==true){
      if(AddItemsBool){
        setAddItems(false)
        setAddItemstext("")
      }
      }
    }, [paidSliderEPTriggered])
    
    const discountMax = getMaxReferrerAmount(freeFoodData?.refer_discount_tier,'referrer_amount')

    return (
    <>
      {(redirectBool) ?<Loader2/>:''}
      <ConfirmationModal2
        onlyMsg={true}
        modalBody={
          "You have some unsaved changes"
        }
        cancelText={AddItemsBool ? "Stay on page":"Discard Changes"}
        confirmText={"Save Changes"}
        open={open}
        handleClose={(val, reason) => {
          if(AddItemsBool){
            // setAddItems(false);
            setAddItemstext('')
            setOpen(false)
            return
          }
          if (reason !== "backdropClick") {
            // setOpen(false)
            if (typeof isPriceConfirmation.onCancel == 'function') {
              isPriceConfirmation.onCancel().then(() => {
             if(triggerFortabChange){
                  dispatch(setpaidSliderEPTriggered(false))
                  dispatch(settriggerFortabChange(false))
                  setValue(activeTabvalue)
                  handleChange(null,activeTabvalue)
              }
              setOpen(false) // immedielty closing
              setIsPriceConfirmation({ isChanges: false, onConfirm: () => { }, onCancel: () => { } })
            // }, 200);
            })
            }else{
               setOpen(false)
              setIsPriceConfirmation({ isChanges: false, onConfirm: () => { }, onCancel: () => { } })
            }
          }
          // setOpen(null)
        }}
        onConfirmPress={async () => {
          dispatch(setsaveTabChangesButtonHit(true))
          if(AddItemsBool){
            setAddItemstext('hit')
            // setAddItems(false)
            // setOpen(false)
            // handleChange(0, TabValues.UPCOMING_ORDERS)
            return
          }
          if (typeof isPriceConfirmation.onConfirm == 'function') {
            await isPriceConfirmation.onConfirm().then(()=>{
              // loaderForunsaved ? "" :setOpen(false) // immedielty closing
              // if(clickhereClicked){
              //   handleChange(0, TabValues.UPCOMING_ORDERS)
              //   setValue(TabValues.UPCOMING_ORDERS)
              //   setclickhereClicked(false)
              //   dispatch(setpaidSliderEPTriggered(false))
              //   setTimeout(() => {
              //     setOpen(false)
              //   }, 800);
              // }
              setIsPriceConfirmation({ isChanges: false, onConfirm: () => { }, onCancel: () => { } })
            })
            // Tab switching logic
            // .then(() => {
            //  if(triggerFortabChange && UnPaidOrderAndActive){
            //       dispatch(setpaidSliderEPTriggered(false))
            //       dispatch(settriggerFortabChange(false))
            //       setValue(activeTabvalue)
            //       handleChange(null,activeTabvalue)
            //   }
            //   setOpen(false) // immedielty closing
            //   setIsPriceConfirmation({ isChanges: false, onConfirm: () => { }, onCancel: () => { } })
            // // }, 200);
            // })
            // setOpen(false) // immedielty closing
          }else{
            setOpen(false)
            setIsPriceConfirmation({ isChanges: false, onConfirm: () => { }, onCancel: () => { } })
          }
        }}
      // setscroll1={setscroll}
      />
      <Box sx={{ width: "100%"}}>
        <Box className={`tabsWrapper ${isExecutive ? "isExecutive" : ""}`}sx={{pointerEvents: value == TabValues.EDIT_PREFERENCES && globalLoading?'none':'auto' , zIndex:20}}>
          <div className={`container container--custom  `}>
              {console.log('value',value)}
            {loadingState ? (
              // <Tabs
              //   value={value}
              //   onChange={(_, newValue) => {
              //     dispatch(setactiveTabvalue(newValue));
              //     if(AddItemsBool && (finalData?.mealData || finalData?.snackData || finalData?.otherItemData)){
              //       setOpen(true)
              //       return 
              //     }
              //     handleChange(_, newValue);
              //     handleScrollToTop();
              //   }}
              //   variant="scrollable"
              //   scrollButtons="auto"
              //   aria-label="scrollable auto tabs example"
              // >
              //   {
              //     tabFiltered?.map((tab, _) => (
              //       <Tab
              //         key={tab.key}
              //         className={`icons ${isExecutive ? !["freeFood", "wallet", "orderHistory"].includes(tab.key) ? "isExecutive " : "isExecutive" : ''}`}
              //         icon={tab.label == 'Wallet' ? tab.icon : <span>{tab.icon}</span>}
              //         label={tab.label}
              //         value={tab.key}
              //       // {...a11yProps(index)}
              //       />
              //     ))}
              // </Tabs>
              <Tabs
                value={value}
                onChange={(_, newValue) => {
                  dispatch(setactiveTabvalue(newValue));
                  if(AddItemsBool && (finalData?.mealData || finalData?.snackData || finalData?.otherItemData)){
                    setOpen(true)
                    return 
                  }
                  handleChange(_, newValue);
                  handleScrollToTop();
                }}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                {
                  tabsArr?.map((tab, _) => (
                    <Tab
                      key={tab.key}
                      className={`icons ${isExecutive ? !["freeFood", "wallet", "orderHistory"].includes(tab.key) ? "isExecutive " : "isExecutive" : ''}`}
                     
                      icon={tab.label == 'Wallet' ? 
                           <span style={{ position: "relative" }}>
                             {notificationCount ? (
                               <div className="notification-badge"></div>
                             ) : null}
                             <WalletIcon />
                           </span>
                        : <span>{tab.icon}</span>}
                      label={tab.label}
                      value={tab.key}
                    />
                  ))}
              </Tabs>
            ) : null}
          </div>
        </Box>
        <TabPanel value={value} index={TabValues.ADD_ITEMS}>
          {
            AddItemsBool && 
            <AddItems
              MealDate={MealDate}
              setMealDate={setMealDate}
              coachingBool={coachingBool}
              setcoachingBool={setcoachingBool}
              ConsultBool={ConsultBool}
              setConsultBool={setConsultBool}
              finalData={finalData}
              setOpen={setOpen}
              setFinalData={setFinalData}
              handleChange={handleChange}
              AddItemstext={AddItemstext}
              setAddItemstext={setAddItemstext}
              isExecutive={isExecutive}
              AddItemsBool={AddItemsBool}
              setAddItems={setAddItems}
              order_id={order_id}
              isOrderReady={isOrderReady}
              type={type}
              startDateCheck={pastOrderEnable}
              updated={() => changed(value)}
              handleTabChange={() => {
                pastOrderEnable ? handleChange(0, TabValues.RENEWAL_ORDERS) : handleChange(0, TabValues.RENEWAL_ORDERS)
              }}
            />
          }
        </TabPanel>

        <TabPanel value={value} index={TabValues.UPCOMING_ORDERS}>
          {!planExpired || planExpiredUpcoming ? (
            <UpcomingOrders
            setMealDate={setMealDate}
            handleChange={handleChange}
              setValue={setValue}
              setAddItems={setAddItems}
              AddItemsBool={AddItemsBool}
              isExecutive={isExecutive}
              order_id={order_id}
              isOrderReady={isOrderReady}
              type={type}
              startDateCheck={pastOrderEnable}
              updated={() => changed(value)}
              handleTabChange={() => {
                // pastOrderEnable ? handleChange(0, 1) : handleChange(0, 1)
                handleChange(0, TabValues.RENEWAL_ORDERS)
              }}
            />
          ) : (
            <Reactivate isOrderReady={isOrderReady} retakeQuiz={retakeQuiz} />
          )}

          {/* <WeekData />
        <Portal /> */}
        </TabPanel>
        {paidStatus && (
          <TabPanel value={value} index={TabValues.RENEWAL_ORDERS}>
            <RenewalOrders
              setAddItems={setAddItems}
              AddItemsBool={AddItemsBool}
              setValue={setValue}
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
        <TabPanel value={value} index={TabValues.WALLET}>
          <div className="sec-padded">
            <div className="container container--custom">
              <EditPreferences title="Your Wallet" />
              <WalletTab handleTabChange={handleChange} />
            </div>
          </div>
        </TabPanel>
        {userCanEdit && (
          <TabPanel value={value} index={TabValues.EDIT_PREFERENCES}>
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
                setDiscardModalState={setOpen}
                  setChangesPending={setIsPriceConfirmation}
                  setclickhereClicked={setclickhereClicked}
                  handleClick={() => {
                    // setclickhereClicked(true)
                    dispatch(setactiveTabvalue(TabValues.UPCOMING_ORDERS))
                    if (getTopDown == "top down" && open !== null) {
                      setOpen(true)
                    } else {
                      console.log("else=======> ")
                      // handleChange(0, 0)
                      handleChange(0, TabValues.UPCOMING_ORDERS)
                    }
                  }}
                  dispatch={dispatch}
                  paymentStatusRenewal={paymentCheck}
                  isExecutive={isExecutive}
                  paymentCheck={paymentCheck}
                  // setOpen={setOpen}
                  // wantsToSwitchToTab={wantsToSwitchToTab}
                  // setValue={setValue}
                />
              </div>
            </div>
          </TabPanel>
        )}
        <TabPanel value={value} index={TabValues.MACROS}>
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
                        // handleChange(0, paidStatus ? 7 : 6)
                        handleChange(0, TabValues.FAQs)
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
        <TabPanel value={value} index={TabValues.PARTNER_OFFERS}>
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
                    // handleChange(0, paidStatus ? 7 : 6)
                    handleChange(0, TabValues.FAQs)
                  }}
                />
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={TabValues.FREE_FOOD}>
          <div className="sec-padded">
            <div className="container container--custom">
              <EditPreferences
                title="Free Food"
                para={isExecutive ?
                  "Invite your colleagues to try PractiCal Executive."
                  // : "Invite your friends to try PractiCal"
                  // : "Invite your friends to PractiCal and earn up to AED 50 — the longer their plan, the more you get!"
                  : `Invite friends to try PractiCal — they’ll get a discount according on their first plan, and you can earn up to AED ${discountMax}!`

                }
                para2={isExecutive ? "Note: this functionality only works if they are working in an organisation that is registered with PractiCal Executive.":""}
              />
              <FoodScreen
                // handleChange={() => handleChange(0, paidStatus ? 7 : 6)}
                handleChange={() => handleChange(0, TabValues.FAQs)}
                freeFoodSetter={setFreeFood}
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={TabValues.FAQs}>
          <div className="sec-padded">
            <div className="container container--custom">
              <EditPreferences title="Frequently Asked Questions" />
              <QuesScreen
                tabchange={tabchange}
                scroll={scroll}
                freeFood={freeFood}
                // handleTabChange={() => handleChange(0, paidStatus ? 2 : 1)}
                handleTabChange={() => handleChange(0, TabValues.WALLET)}
                isExecutive={isExecutive}
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={TabValues.ORDER_HISTORY}>
          <div className="sec-padded">
            <div className="container container--custom">
              <EditPreferences title="Order History" />
              <OrderHistory handleTabChange={handleChange} />
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={TabValues.CODE_GENERATOR}>
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
                      // handleChange(0, paidStatus ? 5 : 4)
                      handleChange(0, TabValues.PARTNER_OFFERS)
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
          <TabPanel value={value} index={TabValues.PAST_ORDERS}>
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
              TabValues.COOK_BOOKS
            }
          >
            <div className="sec-padded">
              <div className="container container--custom">
                {paidstatusFinder() ? (
                  <>
                    {" "}
                    <EditPreferences title="Download your Cook Book below" />
                    {/* <OrderHistory cookBook={true} /> */}
                    <PDFcomponent isExecutive={isExecutive} />
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
         {
        
           ThanksPop && <Thankyou
             open={ThanksPop}
             handleClose={() => {
              const isNewRequestBool = isNewRequest(objectForCalendly, GetcalendlybookingData);
              if(isNewRequestBool){
                SaveCalendlyReq().then(()=>{
                  GetCalendlyReq()
                }).catch(err=>console.log("err",err))
                setThanksPop(false);
              }else{
                setThanksPop(false);

              }
            }}
             title={'Consultation Booked!'}
             desc={`Thank you for booking consultation with ${assigned_to}. 
                   Event: ${event_type_name}`}
             contentpadding={'40px 55px 0px 55px'}
             routerParam={routerParam}
           />
         }
      </Box>
    </>
  )
}

BasicTabs.propTypes = {
  changed: PropTypes.func
}
