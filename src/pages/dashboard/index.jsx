import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ThemeProvider } from "@mui/material/styles"
import { unwrapResult } from "@reduxjs/toolkit"
import { useRouter } from "next/router"
import get from "lodash/get"
import {
  StartUpRequest,
  UpcomingOrdersRequest,
  GetResturantsRequest,
  GetQuestionsRequest,
  GetTickersRequest,
  GetFreeFoodRequest,
  GetOrderHistory,
  getRenewalRequestData,
  getUserCookBookRequest,
  getPausePassDatesRequest,
  getRenewedPlanRequest,
  updatePriceRequest,
  getCompanyEmiratesRequest,
  TimerRequest,
  settooglePSQpop,
} from "../../store/reducers/dashboardReducer"
import { ProfileRequest, UpdatePreferencesSliderRequest } from "../../store/reducers/profileReducer"
import { logOutUserRequest } from "../../store/reducers/authReducer"
import Head from "next/head"
import Header from "../../components/header"
import Footer from "../../screens/footer"
import SecTabs from "../../screens/secTabs"
import AppRoutes from "helpers/AppRoutes"
import AppLogger from "helpers/AppLogger"
import theme from "../../styles/themes/theme"

import $ from "jquery"
import QuizPreferencePopup from "../../components/DashboardComponents/QuizPreferencePopup"
import OneTimePaidTicker from "../../components/tickers/OneTimePaidTicker"
import PaidAndSubscribedTicker from "../../components/tickers/PaidAndSubscribedTicker"
import NotPaidSubscribedTicker from "../../components/tickers/NotPaidSubscribedTicker"
import UnPaidTicker from "../../components/tickers/UnPaidTicker"
import TopUpTicker from "../../components/tickers/TopUpTicker"
import { retakeModeHandler } from "../../store/reducers/quizPageReducer"
import ThankyouLG from "components/popUp/thankYouLG"
import moment from "moment"
import AppConstants from "helpers/AppConstants"
import { formateDateFrom, isProductionServer, isStagingServer } from "../../helpers/ShortMethods"
import AuthRedirector from "components/auth-redirector"
import { getPromoCodeDetailsAction } from "../../store/actions/promoCodeDetailsAction"
import TZone from "moment-timezone";
import Script from "next/script"
import { getCache, prevPlanActiveChecker, setCache } from "@helpers/CommonFunc"
import Loader from "../../components/loader"
import Loader2 from "../../components/loader/Loader2"

const updateLock = { inProgress: false };
const Dashboard = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { userDetails, isExecutive } = useSelector((state) => state.auth)
  const { userProfile } = useSelector((state) => state.profile)
  const { renewalData, cards, startUpData, ticker, resturants, faqQuestions , orderHistory, tooglePSQpop, activeTabvalue} = useSelector(
    (state) => state.home
  )
  const { retakeMode } = useSelector((state) => state.quiz)
  const { homeData } = useSelector((state) => state.homepage)
  const [isPastOrdersEnabled, setIsPastOrdersEnabled] = useState(false)

  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])

  const token = get(userDetails, "data.auth_token", "")
  const [dataRec, setDataRec] = useState(null)
  const [quizUpdated, setQuizUpdated] = useState(false)
  const [showQuizAfterPopup, setShowQuizAfterPopup] = useState(false)
  // const [showQuizPreferenceModal, setQuizPrefrencesModal] = useState(false)
  const [userCanEdit, setUserCanEdit] = useState(false)
  const [tabChanged, setTabChanged] = useState(false)
  const [tickerData, setTickerData] = useState(null)
  const [renewalDataLocal, setRenewalDataLocal] = useState(null)
  const [cardExpiredStatus, setCardExpiredStatus] = useState(false)
  const [cardsDataLocal, setCardDataLocal] = useState(null)
  const [startUpDataLocal, setStartUpDataLocal] = useState(null)
  const [userProfileLocal, setUserProfileLocal] = useState(null)
  const [planExpired, setPlanExpired] = useState(false)
  const [propFunctions, setPropFunctions] = useState({})
  const [addWallet, setAddWallet] = useState({});
  const [isNewUser, setisNewUser] = useState(true);
  const [InitialLogin, setInitialLogin] = useState(true)
  const [startUploader, setstartUploader] = useState(false)
  const [Tickerloader, setTickerloader] = useState(false)
  const [LoaderForFECron, setLoaderForFECron] = useState(false)
  const [LoaderForFECronRunned, setLoaderForFECronRunned] = useState('')
  const [Historyloader, setHistoryloader] = useState(false)
  const userEndDate = get(userProfileLocal, "profile.meal_plan_end_date", "")
  const userStartDate = get(
    userProfileLocal,
    "profile.meal_plan_start_date",
    ""
  )
  const PhoneCheck = get(userProfileLocal, "phone", "")
  const paymentStatus = get(tickerData, "payment_status", "")
  const renewalPaymentStatus = get(
    renewalDataLocal,
    "order.payment_status",
    null
  )
  const renewalOrderId = get(renewalDataLocal, "order_id", null)
  const renewalUserId = get(renewalDataLocal, "user_id", null)
  const subscriptionStatus = get(tickerData, "profile.is_subscribed", -1)
  const defaultCard = get(cardsDataLocal, "default_card", null)
  const notPaidType = get(tickerData, "not_paid_type", "")
  const tickerPrice = get(tickerData, "price", 0)
  const tickerOrderId = get(tickerData, "history_latest.order_id", "")
  const tickerPaymentDate = get(tickerData, "payment_date", "")
  const tickerEndDate = get(
    tickerData,
    "profile.meal_plan_end_date",
    new Date()
  )
  const thresholdDays = get(startUpDataLocal, "threshold_day_count", "")

  // useEffect(() => {
  //   setTimeout(() => {
  //     setInitialLogin(false)
  //   }, 800);
  // }, [])

  useEffect(() => {
    if (!retakeMode) {
      dispatch(settooglePSQpop(false))
      // setQuizPrefrencesModal(false)
    }
  }, [retakeMode])

  useEffect(() => {
    if (startUpData) {
      setStartUpDataLocal(startUpData)
    }
  }, [startUpData])
  useEffect(() => {
    if (ticker) {
      setTickerData(ticker)
    }
  }, [ticker])

  //ANCHOR -  CALL RENEWED PLAN HERE

  useEffect(() => {
    if (renewalDataLocal) {
      LoaderForFECronRunned == 'runned' && userProfile && !isNewUser && callRenewedPlanHandler()
    }
  }, [renewalDataLocal, userProfile, LoaderForFECronRunned])
let renewalRequestDataResponse = useRef(false)

  useEffect(() => {
    if (renewalData) {
      setRenewalDataLocal(renewalData)
    }
  }, [renewalData])

  useEffect(() => {
    if (cards) {
      setCardDataLocal(cards)
    }
  }, [cards])

  useEffect(() => {
    if (userProfile) {
      userFirstTimeLoginHandler()
      setUserProfileLocal(userProfile)
    }
  }, [userProfile, tabChanged])
  useEffect(() => {
    if (userProfile) {
      getExpiredStatusHandler()
    }
  }, [userProfile, tabChanged, tickerData])

  useEffect(() => {
    callStartUpFilesHandler()
  }, [tabChanged])

  useEffect(() => {
    const inBetween = isCurrentDateBetween(
      "2023-01-18 00:00:00",
      "2023-01-22 00:00:00"
    )
    AppLogger("THIS IS RESULT==========", inBetween)
    if (window.location.href.includes("dashboard")) {
      document.body.classList.remove("swap")
    }
  }, [])
  useEffect(() => {
   LoaderForFECronRunned == 'runned' &&  userProfile && !isNewUser &&  getTickersData()
  }, [quizUpdated, retakeMode, planExpired, userProfile,isNewUser, LoaderForFECronRunned])

useLayoutEffect(() => {
  getUserProfileHandler()
}, [quizUpdated, retakeMode])

// useEffect(() => {
//     setUpUiHandler()
//     // commenting for Optimization depreceated API
//     // handleGetPausePassDates()
//     LoaderForFECronRunned == 'runned' && userProfile && !isNewUser && callUpcomingOrdersHandler()
//     // commenting for Optimization
//     // if (faqQuestions?.length == 0) {
//     //   getFAQQuestionsHandler()
//     // }
//     // commenting for Optimization
//     // if (resturants?.length == 0) {
//     //   getResturantsRequestHandler()
//     // }
//     LoaderForFECronRunned == 'runned' && userProfile && !isNewUser &&  getRenewalDataRequestHandler()
//     // commenting for Optimization
//     // getFreeFoodRequestHandler()
//     // commenting for Optimization
//     LoaderForFECronRunned == 'runned' && userProfile && !isNewUser &&  getOrderHistoryRequestHandler()
//     // LoaderForFECronRunned == 'runned' && userProfile && !isNewUser &&  cardExpiryHandler()
//     // commenting for Optimization
//     LoaderForFECronRunned == 'runned' && userProfile && !isNewUser &&  getUserCookBookHandler()

//   }, [quizUpdated, retakeMode, userProfile,  isNewUser, LoaderForFECronRunned])

useEffect(() => {
  setUpUiHandler();

  // This ensures that even if UpdateProfileCrom is skipped (already called), 
  // the upcoming orders still trigger because LoaderForFECronRunned becomes 'runned'
  if (LoaderForFECronRunned === 'runned' && userProfile && !isNewUser) {
    callUpcomingOrdersHandler();
    getRenewalDataRequestHandler();
    getOrderHistoryRequestHandler();
    getUserCookBookHandler();
  }
}, [quizUpdated, retakeMode, userProfile, isNewUser, LoaderForFECronRunned]);

  console.log('LoaderForFECronRunned',LoaderForFECronRunned)
  useEffect(() => {
   userProfile && !isNewUser && cardExpiryHandler()
  }, [cards, ticker, userProfile])
  
  const updateInProgress = useRef(false); // Add this ref at the top

  // ... inside your component:
  console.log("updateLock",updateLock)
useEffect(() => {
  const runUpdateOnce = async () => {
    if (typeof window === 'undefined' || !userProfile || isNewUser) return;

    const alreadyCalled = localStorage.getItem('alreadyCalled');
    
    // STRICT CHECK: Only proceed if not called before AND no other instance is currently running
    if (!alreadyCalled && !updateLock.inProgress) {
      updateLock.inProgress = true; // IMMEDIATE LOCK
      
      try {
        console.log(">>> Executing Update API");
        const res = await UpdateProfileCrom();
        console.log("Update success:", res);
        
        localStorage.setItem('alreadyCalled', 'true');
        setLoaderForFECronRunned('runned');
      } catch (err) {
        console.error("Update failed:", err);
        updateLock.inProgress = false; // Release lock only on error to allow retry
      }
    } else if (alreadyCalled) {
      // If already done, just signal the next APIs to start
      setLoaderForFECronRunned('runned');
    }
  };

  runUpdateOnce();
}, [userProfile, isNewUser]);
useEffect(()=>{
  return()=>{
    updateLock.inProgress = false; // Release lock only on error to allow retry
  }
},[])
// useEffect(() => {
//   if (typeof window !== 'undefined' && userProfile && !isNewUser) {
//     const alreadyCalled = localStorage.getItem('alreadyCalled');
    
//     // Only run if not already called and not currently in progress
//     if (!alreadyCalled && !updateInProgress.current) {
//       updateInProgress.current = true; // Lock the API
      
//       UpdateProfileCrom().then((res) => {
//         console.log("Update Success", res);
//         localStorage.setItem('alreadyCalled', 'true');
//         setLoaderForFECronRunned('runned'); // Signals other APIs to start
//       }).catch(() => {
//         updateInProgress.current = false; // Reset lock on error
//       });
//     } else if (alreadyCalled) {
//       setLoaderForFECronRunned('runned');
//     }
//   }
// }, [userProfile, isNewUser]);

  // useEffect(()=>{

  //    if (typeof window !== 'undefined') {
  //     // Retrieve session data
  //     const storedData = localStorage.getItem('alreadyCalled') || false;
  //     if(storedData == null || storedData == false){
  //       if(userProfile &&  !isNewUser){
  //         UpdateProfileCrom().then((res)=>{
  //           console.log("res",res)
  //           localStorage.setItem('alreadyCalled',true)
  //         })
  //       }
  //     }else{
  //       setLoaderForFECronRunned('runned')
  //     }
  //   }      
   
  // },[userProfile, isNewUser])
  useEffect(() => {
    if (userDetails) {
      $(window).ready(function () {
        $("body").addClass("loggedIN")
      })
    } else {
      $("body").removeClass("loggedIN")
    }
  }, [userDetails])

  const cardExpiryHandler = () => {
    try {
      if (defaultCard) {
        const dateIsAfter = isDateAfterCurrent(defaultCard.expiry_date)

        setCardExpiredStatus(dateIsAfter)
        AppLogger("This is date after===========", dateIsAfter)
      }
    } catch (err) {
      AppLogger("This  is error at cardExpiryHandler======", err)
    }
  }
  const setUpUiHandler = () => {
    document.body.classList.add("headerBG")
    document.body.classList.add("dashboard")
  }

  const retakeModeRequest = () => {
    dispatch(retakeModeHandler(true))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("thsi is retakeModeRequest=====", res)
      })
      .catch((err) => {
        AppLogger("this err retakeModeRequest=======", err)
      })
  }

  // const isExecutive = AppConstants.isExecutive
  const callStartUpFilesHandler = () => {
    setstartUploader(true)
    try {
        const cacheKey = `startUp`;
        const cachedData = getCache(cacheKey);
    
        if (cachedData) {
            setstartUploader(false)
            AppLogger("Serving from cache", cachedData);
          return;
          }
      if (token) {
        dispatch(StartUpRequest({ token }))
          .then(unwrapResult)
          .then((response) => {
            setCache(cacheKey, response?.data?.data, 1, AppConstants.CacheTime.min); // Cache for 5 minutes
            AppLogger("Response at StartUpRequest", response)
            setstartUploader(false)
          })
          .catch((error) => {
            setstartUploader(false)
            AppLogger("Error at StartUpRequest", error)
          })
      }
    } catch (err) {
      setstartUploader(false)
      AppLogger("Error at callStartUpFilesHandler", err)
    }
  }

  const getCompanyEmiratesHandler = () => {
    try {
      const cacheKey = `Emirates`;
      const cachedData = getCache(cacheKey);
        
      if (cachedData) {
        AppLogger("Serving from cache", cachedData);
        return;
      }
    if (token) {
      dispatch(getCompanyEmiratesRequest({ token }))
        .then(unwrapResult)
        .then((res) => {
          setCache(cacheKey, res?.data?.data, 1, AppConstants.CacheTime.hour);
          AppLogger("This is response at getCompanyEmiratesHandler========", res)
        })
        .catch((err) => {
          AppLogger("This is error  at getCompanyEmiratesHandler===========", err)
        })
    }
  }catch (err) {
    console.log("inside Emirate catch",err)
   }
  }

  const getUserCookBookHandler = () => {
     try {
        const cacheKey = `cookbook`;
        const cachedData = getCache(cacheKey);
        if (cachedData) {
          AppLogger("Serving from cache", cachedData);
          return;
        }
            
    if (token) {
       dispatch(getUserCookBookRequest({ accessToken: token }))
         .then(unwrapResult)
         .then((res) => {
           setCache(cacheKey, res?.data?.data, 1, AppConstants.CacheTime.hour); // Cache for 5 minutes
           AppLogger("This is response at getUserCookBookHandler========", res)
         })
         .catch((err) => {
           AppLogger("This is error  at getUserCookBookHandler===========", err)
         })
     }
    } catch (err) {
      AppLogger("Error at getData", err)
    }
  }
  const [isOrderReady, setIsOrderReady] = useState(false)
  const [UserProfileLoader, setUserProfileLoader] = useState(false)
  const callUpcomingOrdersHandler = () => {
    setIsOrderReady(true)
    try {
      if (token) {
        // Work to cache Upcoming Data
        const cacheKey = `upcoming`;
        const cachedData = getCache(cacheKey);
        if (cachedData) {
          AppLogger("Serving from cache", cachedData);
          setIsOrderReady(false)
          return;
          }
        dispatch(UpcomingOrdersRequest({ token }))
        .then(unwrapResult)
        .then((res) => {
          setCache(cacheKey, res?.data?.data, 10,AppConstants.CacheTime.sec); // Cache for 5 minutes
          AppLogger("Response at upcoming", res)
          setIsOrderReady(false)
        }).catch((err)=>{console.log("err up",err);
          setIsOrderReady(false)
        })
      }
    } catch (error) {
      AppLogger("Error at callUpcomingOrdersHandler", error)
      setIsOrderReady(false)
    }
  }

  const callRenewedPlanHandler = () => {
    try {
      if (renewalUserId && renewalOrderId && token) {
        // console.log(renewalUserId, renewalOrderId)
        dispatch(
          getRenewedPlanRequest({
            token,
            user_id: renewalUserId,
            order_id: renewalOrderId
          })
        )
      }
    } catch (error) {
      AppLogger("Error at callRenewedPlanHandler", error)
    }
  }

  const tabChangeHandler = (currentValue) => {
    setInitialLogin(false)
    setTabChanged(!tabChanged)
    if (renewalDataLocal) {
      if (currentValue == AppConstants?.TabValues?.UPCOMING_ORDERS) {
        callUpcomingOrdersHandler()
        getRenewalDataRequestHandler()
      } else if (currentValue == AppConstants?.TabValues?.RENEWAL_ORDERS) {
        getRenewalDataRequestHandler()
        callRenewedPlanHandler()
      } else if (currentValue == AppConstants?.TabValues?.EDIT_PREFERENCES) {
        getUserProfileHandler()
        // commenting for Optimization depreceated API
        // handleGetPausePassDates()
        if(isExecutive) getCompanyEmiratesHandler()
      }
      else if (currentValue == AppConstants?.TabValues?.FAQs) {
        getFAQQuestionsHandler()
      }
      else if (currentValue == AppConstants?.TabValues?.ORDER_HISTORY) {
        getOrderHistoryRequestHandler()
      } else if (
        (currentValue == AppConstants?.TabValues?.COOK_BOOKS && !isPastOrdersEnabled) ||
        (currentValue == AppConstants?.TabValues?.COOK_BOOKS && !isPastOrdersEnabled)
      ) {
        // getUserCookBookHandler()
      }
    } else {
      if (currentValue == AppConstants?.TabValues?.UPCOMING_ORDERS) {
        callUpcomingOrdersHandler()
        getRenewalDataRequestHandler()
      } else if (currentValue == AppConstants?.TabValues?.EDIT_PREFERENCES) {
        // getUserProfileHandler()
        // commenting for Optimization depreceated API
        // handleGetPausePassDates()
        if(isExecutive) getCompanyEmiratesHandler()
      } else if (currentValue ==AppConstants?.TabValues?.FAQs) {
        getFAQQuestionsHandler()
      }
      else if (currentValue == AppConstants?.TabValues?.ORDER_HISTORY) {
        getOrderHistoryRequestHandler()
      } else if (
        (currentValue == AppConstants?.TabValues?.COOK_BOOKS && !isPastOrdersEnabled) ||
        (currentValue == AppConstants?.TabValues?.EDIT_PREFERENCES && !isPastOrdersEnabled)
      ) {
        // getUserCookBookHandler()
      }
    }
  }

  const handleGetPausePassDates = () => {
    if (token) {
      dispatch(getPausePassDatesRequest({ token }))
        .then(unwrapResult)
        .then((res) => {
          AppLogger("this is response at handleGetPausePassDates=========", res)
        })
        .catch((err) => {
          AppLogger("this is error at handleGetPausePassDates============", err)
        })
    }
  }

  const logOutRequest = () => {
    dispatch(logOutUserRequest())
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at logOutUserRequest", res)
        dispatch(getPromoCodeDetailsAction({}))
        sessionStorage.clear();
      })
      .catch((err) => {
        AppLogger("Error at logOutUserRequest", err)
      })
  }

  const getUserProfileHandler = () => {
    try {
      if (token) {
        setUserProfileLoader(true)
        dispatch(ProfileRequest({ token }))
          .then(unwrapResult)
          .then((res) => {
            setUserProfileLoader(false)
            AppLogger("Response at ProfileRequest", res)
          })
          .catch((err) => {
            setUserProfileLoader(false)
            AppLogger("Error at ProfileRequest", err)
            if (err == "Error: Request failed with status code 401") {
              logOutRequest()
              router.push(AppRoutes.login)
            }
          })
      }
    } catch (err) {
      setUserProfileLoader(false)
      AppLogger("Error at getUserProfileHandler", err)
    }
  }

  const userFirstTimeLoginHandler = () => {
    try {
      const { meal_plan_start_date } = userProfile?.profile

      if (meal_plan_start_date) {
        setUserCanEdit(true)
        setisNewUser(false)
      } else {
        setisNewUser(true)
        dispatch(settooglePSQpop(true))
        // setQuizPrefrencesModal(true)
        setUserCanEdit(false)

        document.body.classList.remove("dashboard")
      }
    } catch (err) {
      AppLogger("Error at userFirstTimeLoginHandler", err)
    }
  }

  useEffect(() => {
    if (tooglePSQpop == true) {
      $("body").addClass("quizStart")
    } else {
      $("body").removeClass("quizStart")
    }
  }, [tooglePSQpop])

  const getFAQQuestionsHandler = () => {
    try {
      const cacheKey = `faqs`;
      const cachedData = getCache(cacheKey);
        
      if (cachedData) {
        AppLogger("Serving from cache", cachedData);
        return;
      }
      if (token) {
        dispatch(GetQuestionsRequest({ token }))
          .then(unwrapResult)
          .then((res) => {
            setCache(cacheKey, res?.data?.data, 1,AppConstants.CacheTime.hour);
            AppLogger("Response at GetQuestionsRequest", res)
          })
          .catch((err) => {
            AppLogger("Error at GetQuestionsRequest", err)
            if (err == "Error: Request failed with status code 401") {
              logOutRequest()
              router.push(AppRoutes.login)
            }
          })
      }
    } catch (error) {
      AppLogger("Error at getFAQQuestionsHandler", error)
    }
  }

  const getResturantsRequestHandler = () => {
    try {
      if (token) {
        dispatch(GetResturantsRequest({ token }))
          .then(unwrapResult)
          .then((res) => {
            AppLogger("Response at GetResturantsRequest", res)
          })
          .catch((err) => {
            AppLogger("Error at GetResturantsRequest", err)
            if (err == "Error: Request failed with status code 401") {
              logOutRequest()
              router.push(AppRoutes.login)
            }
          })
      }
    } catch (error) {
      AppLogger("Error at getResturantsRequestHandler", error)
    }
  }
  const getExpiredStatusHandler = () => {
    try {
      if (userEndDate) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const userDate = new Date(userEndDate)
        if (today > userDate) {
          setPlanExpired(true)
          $("body").removeClass("tickerON")
        } else {
          setPlanExpired(false)
        }
      } else {
        setPlanExpired(false)
      }
    } catch (err) { }
  }
  function isDateAfterCurrent(dateString) {
    const currentDate = new Date()

    // Parse the given date string into a Date object
    const parts = dateString.split("/")
    const month = parseInt(parts[0], 10)
    const year = parseInt(parts[1], 10)
    const givenDate = new Date(year, month - 1)

    // Compare the given date to the current date
    if (
      givenDate < currentDate &&
      givenDate.getMonth() !== currentDate.getMonth()
    ) {
      // Given date is before the current month
      return true
    } else if (
      givenDate.getMonth() === currentDate.getMonth() &&
      givenDate.getFullYear() === currentDate.getFullYear()
    ) {
      // Given date is the current month
      return false
    } else {
      // Given date is after the current month
      return false
    }
  }
  const renewalDateHandler = (currentDate) => {
    const activeDate = moment(currentDate).format(AppConstants.dateFormat)
    let dateArray = activeDate.split(".")
    let dd = parseInt(dateArray[0])
    let mm = parseInt(dateArray[1]) - 1
    let yyyy = parseInt(dateArray[2])
    let result = new Date(yyyy, mm, dd)
    result.setDate(result.getDate() - thresholdDays)
    dd = result.getDate()
    mm = result.getMonth() + 1
    yyyy = result.getFullYear()

    if (mm < 10) {
      mm = "0" + mm
    }
    if (dd < 10) {
      dd = "0" + dd
    }

    AppLogger("This is date==========", result)
    return result
  }

  const renewalTickerChecker = () => {
    try {
      return subscriptionStatus === 0 
      && renewalRequestDataResponse.current
      && !renewalRequestDataResponse.current.data.data
      && (renewalPaymentStatus === "unpaid" || !renewalPaymentStatus);
    } catch (error) {
      console.log('Error at renewalTickerChecker', error);
    }
  };


  function isCurrentDateBetween(startDateStr, endDateStr) {
    // Convert the start and end date strings to Date objects
    // Convert the start and end date strings to Date objects

    // Create the Date object using extracted components
    const startDate = formateDateFrom(startDateStr)
    const endDate = formateDateFrom(endDateStr)

    // Set the time of the start and end dates to midnight
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)

    // Get the current date object
    const currentDate = new Date()

    // Set the time of the current date to midnight
    currentDate.setHours(0, 0, 0, 0)

    // Check if the current date is within the range of start and end date
    if (currentDate >= startDate && currentDate <= endDate) {
      // Calculate the number of milliseconds between the start and end dates
      const rangeMs = endDate.getTime() - startDate.getTime()

      // Calculate the halfway point between the start and end dates
      const halfwayMs = startDate.getTime() + rangeMs / 2

      // Get the current time in milliseconds
      const nowMs = currentDate.getTime()

      // Check if the current time is between the start and end dates
      if (nowMs >= halfwayMs && nowMs <= endDate.getTime()) {
        return true
      } else if (nowMs >= startDate.getTime() && nowMs < halfwayMs) {
        return false
      }
    }
    return false
  }

  const updatePrice = async(order_id) => {
    try {
      if (token && order_id) {
        await dispatch(updatePriceRequest({ token, order_id }))
          .then(unwrapResult)
          .then((res) => {
            AppLogger("Response at updatePriceRequest", res)
          })
          .catch((err) => {
            AppLogger("Error at updatePriceRequest", err)
          })
      }
    } catch (error) {
      AppLogger("Error at updatePriceRequestHandler", error)
    }
  }
  const tickerHandler = () => {
    try {
      if (!planExpired) {
        $("body").addClass("tickerON")
        if (paymentStatus == "unpaid") {
          if (notPaidType == "top up" || notPaidType == "top down") {
            return (
              <TopUpTicker
                setAddWallet={setAddWallet}
                tabChange={propFunctions}
                order_id={tickerOrderId}
                price={tickerPrice}
                updatePrice={updatePrice}
              />
            )
          } else if (notPaidType == "full" || notPaidType ==  "add addons" || notPaidType == 'add extra meals') {
            if (subscriptionStatus == 1) {
              return (
                <NotPaidSubscribedTicker
                  order_id={tickerOrderId}
                  type={notPaidType}
                  updatePrice={updatePrice}
                />
              )
            } else {
              return (
                <UnPaidTicker
                  isExecutive={isExecutive}
                  PhoneCheck={PhoneCheck}
                  paymentDate={tickerPaymentDate}
                  price={tickerPrice}
                  endDate={tickerEndDate}
                  order_id={tickerOrderId}
                  type={notPaidType}
                  updatePrice={updatePrice}
                />
              )
            }
          } else {
            return
          }
        } else {
          if (subscriptionStatus == 1) {
            if (paymentStatus == "unpaid" && notPaidType == "full") {
              return (
                <NotPaidSubscribedTicker
                  order_id={tickerOrderId}
                  type={notPaidType}
                  updatePrice={updatePrice}
                />
              )
            } else {
              return (
                <PaidAndSubscribedTicker
                  expiredStatus={cardExpiredStatus}
                  renewDate={renewalDateHandler(tickerEndDate)}
                  endDate={tickerEndDate}
                />
              )
            }
          } else if (renewalTickerChecker()) {
            // if (isCurrentDateBetween(userStartDate, userEndDate)) {
            //   return (
            //     <OneTimePaidTicker
            //       endDate={tickerEndDate}
            //       paymentDate={tickerPaymentDate}
            //       type={"renewal"}
            //       order_id={renewalOrderId}
            //     />
            //   )
            // } else {
            //   AppLogger("this  is else=============")
            //   $("body").removeClass("tickerON")
            //   return
            // }
            return (
              <OneTimePaidTicker
                endDate={tickerEndDate}
                paymentDate={tickerPaymentDate}
                type={"renewal"}
                order_id={renewalOrderId}
                updatePrice={updatePrice}
                userData={{ userStartDate, userEndDate }}
              />
            )
          } else {
            $("body").removeClass("tickerON")

            return
          }
        }
      } else {
        $("body").removeClass("tickerON")
        return
      }
    } catch (err) {
      return
    }
  }
  console.log("userProfile",userProfile)
  console.log("startUpDataLocal",startUpDataLocal)
   const sampleData = {
  allergy: [userProfile?.allergies?.[0]?.title] ?? [],
  food_dislikes:
    userProfile?.dislikes?.map((ut)=>ut?.title) ?? [],
  meal_plan_pause_date:
    userProfile?.pause_dates ?? [],
  vegeterian: userProfile?.profile?.vegeterian ?? '',
  days_food_delivery:
    userProfile?.profile?.days_food_delivery ?? [],
  meal_plan_start_date:
    userProfile?.profile?.meal_plan_start_date ??
    "",
  phone:
    userDetails?.data?.phone ??
    "",
  meal_plan_end_date:
    userProfile?.profile?.meal_plan_end_date ??
    "",
  delivery_address:
    userProfile?.profile?.delivery_address ?? null,
  snacks_deliver_per_day:
    userProfile?.guest?.snacks_deliver_per_day ?? 1,
  meals_deliver_per_day:
    userProfile?.guest?.meals_deliver_per_day ?? 1,
  meal_days_per_week:
    userProfile?.guest?.meal_days_per_week ?? 5,
  meal_plan_require_weeks:
    userProfile?.guest?.meal_plan_require_weeks ?? 1,
  meal_plan: userProfile?.guest?.meal_plan ?? [],
  culinary_check: userProfile?.profile?.culinary_check ?? 0,
  notification: userProfile?.profile?.notification ?? 1,
  exclude_breakfast:
    userProfile?.profile?.exclude_breakfast ?? 0,
  dob: userProfile?.guest?.dob ?? "",
  };
  const UpdateProfileCrom = async () => {
    try {
     
     const formattedPauseDates = sampleData?.meal_plan_pause_date?.map((item) => {
      const datePart = item.meal_plan_pause_date.split(' ')[0];
      const [year, month, day] = datePart.split('-');
      return `${day}/${month}/${year}`;
    }) ?? [];
      const updatedData = { ...sampleData, meal_plan_pause_date:formattedPauseDates }; // clone existing data

      setLoaderForFECron(true)
      setLoaderForFECronRunned('')
      let resp;
      if (token) {
      resp =  await dispatch(UpdatePreferencesSliderRequest(
          {
            preferenceData: updatedData,
            token: token ,
          }
        ))
          .then(unwrapResult)
          .then(async (res) => {
            // setCache(cacheKey, res?.data?.data, 1, AppConstants.CacheTime.min);
            console.log("res",res)
            if(res?.data?.data?.active_order_id && !res?.data?.data?.is_new_pricing_user){
              await updatePrice(res?.data?.data?.active_order_id) 
            }
            if (!planExpired) {
              $("body").addClass("tickerON")
            } else {
              $("body").removeClass("tickerON")
            }
            setLoaderForFECron(false)
            setLoaderForFECronRunned('runned')
          })
          .catch((err) => {
            setLoaderForFECronRunned('runned')
            setLoaderForFECron(false)
            AppLogger("Error at GetResturantsRequest", err)
            $("body").removeClass("tickerON")
            if (err == "Error: Request failed with status code 401") {
              logOutRequest()
              router.push(AppRoutes.login)
            }
          })
      }
      return resp;
    } catch (err) {
      setLoaderForFECronRunned('runned')
      setLoaderForFECron(false)
      console.log("inside ticker func catch",err)
     }
  }


  const getTickersData = () => {
    try {
      // const cacheKey = `tickers`;
      // const cachedData = getCache(cacheKey);
        
      // if (cachedData) {
      //   AppLogger("Serving from cache", cachedData);
      //   return;
      // }
      setTickerloader(true)
      if (token) {
        dispatch(GetTickersRequest({ token }))
          .then(unwrapResult)
          .then((res) => {
            setTickerloader(false)
            // setCache(cacheKey, res?.data?.data, 1, AppConstants.CacheTime.min);
            AppLogger("Response at GetResturantsRequest", res)
            if (!planExpired) {
              $("body").addClass("tickerON")
            } else {
              $("body").removeClass("tickerON")
            }
          })
          .catch((err) => {
            setTickerloader(false)
            AppLogger("Error at GetResturantsRequest", err)
            $("body").removeClass("tickerON")
            if (err == "Error: Request failed with status code 401") {
              logOutRequest()
              router.push(AppRoutes.login)
            }
          })
      }
    } catch (err) {
      setTickerloader(false)
      console.log("inside ticker func catch",err)
     }
  }

  const getFreeFoodRequestHandler = () => {
    if (token) {
      dispatch(GetFreeFoodRequest({ token }))
        .then(unwrapResult)
        .then((res) => { })
        .catch((err) => { })
    }
  }

  const getOrderHistoryRequestHandler = () => {
    setHistoryloader(true)
    try{
        
      if (token) {
        dispatch(GetOrderHistory({ token }))
          .then(unwrapResult)
          .then((res) => {
            setHistoryloader(false)
           })
          .catch((err) => {
            setHistoryloader(false)

           })
      }
    }catch(err){
      setHistoryloader(false)
      console.log("err",err)}
  }

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      dispatch(settooglePSQpop(false))
      // setQuizPrefrencesModal(false)
    }
  }

  const getRenewalDataRequestHandler = () => {
    try{
      const cacheKey = `planRenewal`;
      const cachedData = getCache(cacheKey);
      // if (cachedData) {
      //   renewalRequestDataResponse.current = cachedData
      //   AppLogger("Serving from cache", cachedData);
      //   return;
      // }
        
    if (token) {
      dispatch(getRenewalRequestData({ token }))
        .then(unwrapResult)
        .then((res) => {
          setCache(cacheKey, res?.data?.data, 1, AppConstants.CacheTime.min);
          AppLogger("this is response==========", res)
          renewalRequestDataResponse.current = res
        })
        .catch((err) => {
          AppLogger("this is error==========", err)
          renewalRequestDataResponse.current = null
        })
    }}catch(err){console.log("err",err)}
  }
  const showAfterQuizPopupHandler = () => {
    AppLogger("showAfterQuizPopupHandler is triggered")
    setShowQuizAfterPopup(true)
  }
  useEffect(() => {
      const fetchServerTime = async () => {
        try {
          dispatch(TimerRequest({}))
        } catch (error) {
          console.error("Error fetching server time:", error);
        }
      };
  
      fetchServerTime();
      const intervalId = setInterval(() => {
        if(prevPlanActiveChecker(orderHistory)){
          activeTabvalue == AppConstants.TabValues.UPCOMING_ORDERS && fetchServerTime()
        }
        // if ((query.tab == '0' || query.tab == 0)&& paymentStatus != "unpaid") {
      }, 30000);
  
      return () => clearInterval(intervalId); // Cleanup on component unmount
    }, [orderHistory, activeTabvalue]);

  useEffect(() => {
      const scheduleReloadAt5PM = () => {
        const nowUAE = TZone().tz("Asia/Dubai"); 

        const targetTimeUAE = nowUAE.clone().hour(16).minute(0).second(7).millisecond(0);
      
        const targetTimePKT = targetTimeUAE.clone().tz("Asia/Karachi");
      
        const nowPKT = TZone().tz("Asia/Karachi");
      
        if (nowPKT.isAfter(targetTimePKT)) {
          targetTimeUAE.add(1, "day");
          targetTimePKT.add(1, "day");
        }
        const timeUntilReload = targetTimePKT.diff(nowPKT);
  
        setTimeout(() => {
          window.location.reload();
        }, timeUntilReload);
      };
  
      scheduleReloadAt5PM();
  }, []); // Runs only once when the component mounts


  // const allDataLoaded = useMemo(() => {
  //   return !(
  //     // InitialLogin ||
  //     isOrderReady ||
  //     startUploader ||
  //     Tickerloader ||
  //     Historyloader ||
  //     LoaderForFECron ||
  //     // UserProfileLoader ||
  //     false
  //   );
  // }, [
  //   InitialLogin,
  //   isOrderReady,
  //   startUploader,
  //   Tickerloader,
  //   Historyloader,
  //   LoaderForFECron,
  //   // UserProfileLoader,
  // ]);
  const [allDataLoaded, setAllDataLoaded] = useState(false);

useEffect(() => {
  // Check if everything is actually ready
  const isEverythingReady = !(
    isOrderReady ||
    startUploader ||
    Tickerloader ||
    Historyloader ||
    LoaderForFECron
  );

  if (!isEverythingReady) {
    // If something is still loading, show loader immediately
    setAllDataLoaded(false);
  } else {
    // If everything seems done, wait 500ms before hiding the loader
    // This bridges the gap between consecutive API calls
    const timer = setTimeout(() => {
      setAllDataLoaded(true);
    }, 500); // Adjust this MS as needed (500 is usually sweet spot)

    return () => clearTimeout(timer);
  }
}, [isOrderReady, startUploader, Tickerloader, Historyloader, LoaderForFECron]);

  useEffect(()=>{

    return()=>{
      setInitialLogin(false)
      dispatch(settooglePSQpop(false))
    }
  },[])
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>PractiCal</title>
      </Head>
        {
            isStagingServer() || isProductionServer()  ? (
              <Script
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: 
                  `
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({
                    event: "cos_dashboard_view"
                  });
                  `
              }}
            ></Script>
          ) : null}
      <div className="mainBodyWrap">
          {(InitialLogin && !allDataLoaded) ?<Loader2
          extrasx={{
            top:{
              xs:80,
              md:0,
            },
            zIndex:{xs:10000,md:9999}
          }}
          />:''}
        <Header dataRec={dataRec} isExecutive={isExecutive}
        postQuizState={tooglePSQpop}
        
        />
        <AuthRedirector>
          <section className="page--wrapper">
            {tickerHandler()}
            {
              showQuizAfterPopup &&<ThankyouLG
                open={showQuizAfterPopup}
                handleClose={() => setShowQuizAfterPopup(false)}
              />
            }
            {
             tooglePSQpop && <QuizPreferencePopup
                showAfterQuizPopup={showAfterQuizPopupHandler}
                dataUpdated={() => setQuizUpdated(!quizUpdated)}
                open={tooglePSQpop}
                handleClose={handleClose}
              />
            }
            <SecTabs
              isOrderReady={false}
              handleAddToWallet={addWallet?.addToWalletHandler}
              setPropFunctions={setPropFunctions}
              order_id={tickerOrderId}
              type={notPaidType}
              retakeQuiz={() => {
                dispatch(settooglePSQpop(true))
                // setQuizPrefrencesModal(true)
                retakeModeRequest()
              }}
              canEdit={userCanEdit}
              changed={tabChangeHandler}
              setter={setIsPastOrdersEnabled}
              isExecutive={isExecutive}
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

export default Dashboard
