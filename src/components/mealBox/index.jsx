import React, { useEffect, useState, useRef, useMemo } from "react"
import { Box, Link, Popover, Typography } from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import {
  UpdatePreferencesSliderRequest,
  resetPreferencesRequest,
  cancelSubscriptionRequest,
  ProfileRequest,
  priceConfirmationRequest,
  getDeliveryAddressWithDaysRequest,
  updateDeliveryAddressWithDaysRequest,
  verifyOrderDiscountRequest,
  updateCompanyDeliveryAddressWithDaysRequest
} from "../../store/reducers/profileReducer"
import {
  getAllCardsRequest,
  getAllAddressRequest,
  StartUpRequest,
  updateDefCard,
  setGlobalLoading,
  setloaderForunsaved,
  setpaidSliderEPTriggered,
  settriggerFortabChange,
  setsaveTabChangesButtonHit,
  setswitchTabTo,
  CancelSubscriptionHook,
  updatePriceRequest
} from "../../store/reducers/dashboardReducer"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import InputIcon from "react-multi-date-picker/components/input_icon"
import moment from "moment"
import ArrowDown from "../../../public/images/icons/arrow-down.svg"
import Edit from "../../../public/images/icons/edit.svg"
import View from "../../../public/images/icons/view.svg"
import Popup from "./MealPopUp"
import PassPop from "./passPop"
import PreferencesSlider from "./PreferencesSlider"
import styles from "./style.module.scss"
import Visibility from "@mui/icons-material/Visibility"
import get from "lodash/get"
import DatePicker from "react-multi-date-picker"
import clsx from "clsx"
import AppColors from "../../helpers/AppColors"
import AppLogger from "helpers/AppLogger"
import Loader2 from "../loader/Loader2"
import AppConstants from "helpers/AppConstants"
import Reset from "../../../public/images/icons/reset.svg"
import CrossIcon from "../../../public/images/icons/cross-icon.svg"
import Calender from "../../../public/images/icons/calender.svg"
import useMediaQuery from "@mui/material/useMediaQuery"
import AppRoutes from "../../helpers/AppRoutes"
import $, { type } from "jquery"
import {
  postRenewalRequest,
  resetRenewalRequest,
  updateRenewalSummary,
  getRenewalDataRequest,
  createIntentionFunc,
  setUserDefaultCardRequest
} from "../../store/reducers/checkoutReducer"
import { useRouter } from "next/router"
import { GetTickersRequest } from "../../store/reducers/dashboardReducer"
import { showFaliureToast } from "../../helpers/AppToast"
import { useCallback } from "react"
import AddCardPopUp from "./addCard"
import AddAddress from "./addAddressPopNew"
import AssignDelivery from "./AssignDelivery"
import WalletPop from "components/popUp/walletPop"
import CancelSub from "components/popUp/cancelsubscription"

import ConfirmationModal from "components/popUp/scrollMessage"
import ReactHtmlParser from "react-html-parser"
import PhonePopup from "./PhonePopup"
import AppDataConstant from "helpers/AppDataConstant"
import { Calendar } from "react-multi-date-picker"
import { logOutUserRequest } from "../../store/reducers/authReducer"
import { transformScheduleDeliveryPayload, customTimeout } from "helpers/ShortMethods"
import ConfirmationModal2 from "components/popUp/confirmationModal2"
import AppErrors from "helpers/AppErrors"
import CustomConfirmationModal from "../custom-confirmation-modal";
import { getPromoCodeDetailsAction } from "../../store/actions/promoCodeDetailsAction"
import CalendarsDateRangePicker from "./DayPickerRange/DayPickerRange"
import DisabledComponentWrapper from "../DisabledComponentWrapper"
import StartDateModal from "components/popUp/StartDateModal"
import NeedHelp from "components/popUp/NeedHelp"
import { compareObjects, convertDatetoYear, getCache, setCache, toSentenceCase } from "@helpers/CommonFunc"
import CustomTooltip from "@components/CustomTooltip"
import DislikesBox from "./DislikesBox"
import TimerTooltip, { tooltipStyle } from "@components/mealDistrubution/TimerTooltip"
import { animateScroll as scroll } from "react-scroll"
import PaymentPopWithPixelPaymob from "@components/popUp/PaymentPopWithPixelPaymob"
import { debounce, first, isNull } from "lodash"
import { dfac, dfjac, textwithmbSX } from "../popUp/commonSX"
import ThemeLoader from "@components/ThemeLoader"
import useDetectPreferenceChanges from "../../hooks/useDetectPreferenceChanges"
import LeftBoxPreference from "./LeftBoxPreference"
import RightBoxPreference from "./RightBoxPreference"

const MealPlan = ({
  Renewal = null,
  summaryData,
  confirmBtnClicked,
  paymentCheck,
  paymentStatusRenewal,
  handleClick,
  dateCall,
  renewalView,
  children,
  btnDisable,
  setChangesPending,
  isExecutive,
  setOpenUnsavedModal = () => { },
  wantsToSwitchToTab = "",
  setValue = () => { },
  setDiscardModalState = () => { },
}) => {
  const router = useRouter()
  const [startDate, setStartDate] = useState("")
  const dispatch = useDispatch()
  const [dates, setDates] = useState([])
  const { userProfile, error, addressWithDays, userProfileLoader, priceLoader } = useSelector((state) => state.profile)
  const { userDetails } = useSelector((state) => state.auth)
  const resetPayload = useSelector((state) => state.resetPayload)
  const { renewalSummary, loading } = useSelector(
    (state) => state.CheckOutReducer
  )
  const {
    startUpData,
    ticker,
    cards,
    addresss,
    pausePassDates,
    renewalData,
    orderHistory,
    activeTabvalue,
    triggerFortabChange,
    saveTabChangesButtonHit,
    paidSliderEPTriggered
  } = useSelector((state) => state.home)

  const [renewalDataLocal, setRenewalDataLocal] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isloadingUpdateRequest, setIsloadingUpdateRequest] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [apiLoading, setApiLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [openhelp, setOpenhelp] = useState(false)

  useEffect(() => {
    if (userProfileLoader || priceLoader) {
      setIsLoadingProfile(true)
    } else {
      setIsLoadingProfile(false)
    }
  }, [userProfileLoader, priceLoader])
  useEffect(() => {
    const handleRouteChange = () => {
      dispatch(setGlobalLoading(userProfileLoader));
    };

    // Run on mount and whenever route changes
    handleRouteChange();
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [userProfileLoader, dispatch, router]);

  const [orderHistoryLocal, setOrderHistoryLocal] = useState(null)

  const [passopen, setPassopen] = useState(false)

  const [showCancelSubscriptionPopup, setShowCancelSubscriptionPopup] =
    useState(false)
  const [showWalletPop, setShowWalletPop] = useState(false)
  const [addressDataLocal, setAddressLocal] = useState(null)
  const [pausePassLocal, setPausePassLocal] = useState([])
  const [errorString, setErrorString] = useState("")
  const [data, setData] = useState("")
  const [isOptionsExpanded, setIsOptionsExpanded] = useState(true)
  const [disabledDates, setDisabledDates] = useState([])
  const [isOptionsExpanded2, setIsOptionsExpanded2] = useState(true)
  const [cardUpdated, setCardUpdated] = useState(false)
  const [addAddressUpdated, setAddressUpdated] = useState(false)
  const [showAddCardPopup, setShowAddCardPopup] = useState(false)
  const [showAddAddressPopUp, setShowAddAddressPopup] = useState(false)
  const [showAssignDelivery, setShowAssignDelivery] = useState(false)
  const [currentModalType, setCurrentModalType] = useState("")
  const [showPhonePopup, setShowPhonePopup] = useState(false)
  const [currentData, setCurrentData] = useState(null)
  const [planExpired, setPlanExpired] = useState(false)
  const [startUpLocal, setStartUpLocal] = useState(null)
  const [cardsDataLocal, setCardDataLocal] = useState(null)
  const [userDetailsLocal, setUserDetailsLocal] = useState(null)
  const [addressWithDaysLocal, setAddressWithDaysLocal] = useState(null)
  const [updateMode, setUpdateMode] = useState(null);
  const [renewalKey, setRenewalKey] = useState("")
  const [oldDataLocal, setOldDataLocal] = useState({})
  const [newDataLocal, setNewDataLocal] = useState({})
  const [, setOldProfileData] = useState(null)
  const [priceConfirmationDataLocal, setPriceConfirmationDataLocal] = useState({
    price: null,
    type: ''
  })
  const [isPriceConfirmation, setIsPriceConfirmation] = useState(false)
  const [attachFunctionAgain, setattachFunctionAgain] = useState(null)

  const [mealPlanPauseDateLocal, setMealPlanPauseDateLocal] = useState([])
  const [resetPayloadLocal, setResetPayloadLocal] = useState({})
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)
  const [cancelOrDiscardFakeloader, setcancelOrDiscardFakeloader] = useState(false)
  const [pricingApisetIsLoading, pricingApisetsetIsLoading] = useState(false)
  const [CancelSubIsLoading, setCancelSubIsLoading] = useState(false)

  const fakeLoading = async () => {
    try {
      setcancelOrDiscardFakeloader(true)
      setTimeout(() => {
        setcancelOrDiscardFakeloader(false)
      }, 1000);
    } catch (error) {
      setcancelOrDiscardFakeloader(false)
      console.error(error)
    }
  }

  const oldData = get(userProfile, "guest")
  const walletData = get(userDetailsLocal, "wallet", [])
  const active_order_id = get(userDetailsLocal, "active_order_id", null);
  const newData = get(renewalSummary, "data.guest")
  const order_idRenewal = get(renewalDataLocal, "order_id", null)
  const oldProfileData = get(userProfile, "profile", null)

  const paidPlan = orderHistoryLocal?.find(
    (val) => val.is_active == 1 && val.not_paid_type == "full"
  )
  const anyPaidPlan = orderHistoryLocal?.find(
    (val) => val.gateway_payment_status == 'paid' && val.not_paid_type == "full"
  )


  const startDateDisabler = () => {
    const paidOrder = orderHistoryLocal?.find(
      (val) => val?.not_paid_type == "full" && val?.payment_status == "paid"
    )

    const isUnpaidOrder = tickerType == 'full' && tickerPaymentType == 'unpaid'

    const activeAndUnpaidOrder = orderHistoryLocal?.some((order) => order.id == active_order_id && order.payment_status == 'unpaid');

    if (activeAndUnpaidOrder) return false;

    if (paidOrder) {
      return true
    } else {
      return false
    }
  }

  const isReactivatedPlan = () => {
    const isReactivated = orderHistoryLocal?.find(
      (val) =>
        val?.is_active == 1 &&
        val?.is_plan_end == 0 &&
        val?.history?.is_renewed == 1
    )

    if (isReactivated) {
      return true
    } else {
      return false
    }
  }


  useEffect(() => {
    if (resetPayload) {
      setResetPayloadLocal(resetPayload)
    }
  }, [resetPayload])

  useEffect(() => {
    if (oldProfileData) {
      setOldProfileData(oldProfileData)
    }
  }, [oldProfileData])

  useEffect(() => {
    if (Array.isArray(orderHistory)) {
      setOrderHistoryLocal(orderHistory)
    }
  }, [orderHistory, orderHistory?.length])

  useEffect(() => {
    if (renewalData) {
      setRenewalDataLocal(renewalData)
      if (renewalData && Renewal) setLocalMealPlanChanges(renewalData?.meal_plan);
    }
  }, [renewalData, Renewal])

  useEffect(() => {
    if (oldData && newData) {
      setOldDataLocal(oldData)
      setNewDataLocal(newData)
    }
  }, [oldData, newData])

  const [tickerDataLocal, setTickerDataLocal] = useState(null)
  const [allUserPreferencesData, setAllUserPreferencesData] = useState({
    vegeterian: "",
    allergy: [],
    meal_plan_start_date: "",
    meal_plan_start_date: "",
    days_food_delivery: [],
    meal_plan_pause_date: [],
    food_dislikes: [],
    meal_plan_end_date: "",
    delivery_address: "",
    snacks_deliver_per_day: "",
    meals_deliver_per_day: "",
    meal_days_per_week: "",
    meal_plan_require_weeks: "",
    meal_plan: [],
    // meal_plan: [400, 400, 400, 400, 400], 
    phone: "",
    culinary_check: 1,
    notification: 0,
    exclude_breakfast: 0,
    dob: ''
  })
  // NEW: Temporary state for meal calorie changes only
  const [localMealPlanChanges, setLocalMealPlanChanges] = useState(
    allUserPreferencesData.meal_plan
  );
  // CRITICAL: Sync the local state only when the main data changes externally
  console.log('JSON.stringify(allUserPreferencesData?.meal_plan)',JSON.stringify(allUserPreferencesData?.meal_plan))
  useEffect(() => {
    setLocalMealPlanChanges(allUserPreferencesData.meal_plan);
  }, [JSON.stringify(allUserPreferencesData?.meal_plan)]);

  // console.log('start date',allUserPreferencesData.meal_plan_start_date)
  const [discountWarningData, setDiscountWarningData] = useState({
    key: '',
    values: { previousValue: null, currentValue: null },
    status: false
  });

  const resetDiscountWarningData = () => {
    setDiscountWarningData({
      key: '',
      values: { previousValue: null, currentValue: null },
      status: false
    });
  };

  const updateDiscountWarningData = (key, { previousValue, currentValue }) => {
    setDiscountWarningData({
      status: true,
      key,
      values: { previousValue, currentValue }
    });
  };

  // const matches = useMediaQuery("(max-width:500px)")
  const matchesExSmallMobile = useMediaQuery("(max-width:395px)");
  const matchesSmallMobile = useMediaQuery("(max-width:565px)");
  const matchesMediumMobile = useMediaQuery("(max-width:715px)");
  const matchesMediumScreen = useMediaQuery("(max-width:1024px)");

  const currentUserType = get(userDetailsLocal, "social_auth_type", "")
  const userSubscriptionStatus = get(
    userDetailsLocal,
    "profile.is_subscribed",
    ""
  )
  const userEndDate = get(userDetailsLocal, "profile.meal_plan_end_date", "")
  const thresholdDate = moment(
    get(startUpLocal, "threshold_day", new Date())
  ).toDate()
  const renewalThresholdDate = get(startUpLocal, "renew_threshold_day", "")

  const tickerType = get(tickerDataLocal, "not_paid_type", "")
  const tickerDisplayStatus = get(tickerDataLocal, "display_status", '')
  const tickerPaymentType = get(tickerDataLocal, "payment_status", "")
  const userWalletAmount = get(tickerDataLocal, "wallet", 0)
  const deliveryDays = get(startUpLocal, "delivery_days", [])
  const defaultCard = get(cardsDataLocal, "default_card", null)
  const defaultAddress = get(addressDataLocal, "default_address", "")
  const allAddresses = get(addressDataLocal, "address", [])
  const allTimeSlot = get(startUpLocal, "time_slots", [])
  const UnPaidOrderAndActive = orderHistory?.find((order) => order?.payment_status == AppConstants.unpaid && order?.is_active == 1 && order?.not_paid_type == AppConstants.full);

  useEffect(() => {
    if (addresss) {
      setAddressLocal(addresss)
    }
  }, [addresss])

  useEffect(() => {
    setIsLoading(loading)
  }, [loading])

  useEffect(() => {
    if (confirmBtnClicked) {
      console.log(confirmBtnClicked, "confirmBtnClicked")
      onSavePressHandler("test")
    } else {
    }
  }, [confirmBtnClicked])

  useEffect(() => {
    if (ticker) {
      setTickerDataLocal(ticker)
    }
  }, [ticker])

  useEffect(() => {
    if (cards) {
      setCardDataLocal(cards)
    }
  }, [cards])

  useEffect(() => {
    stopeLoader()
  }, [])
  useEffect(() => {
    if (pausePassDates) {
      setPausePassLocal(pausePassDates)
    }
  }, [pausePassDates])

  useEffect(() => {
    setErrorString("")
    if (!Renewal) {
      userProfileDataHandler()
    } else {
      userRenewalProfileHandler()
    }
  }, [userProfile, Renewal, summaryData])

  useEffect(() => {
    if (userProfile) {
      setUserDetailsLocal(userProfile)
    }

    getExpiredStatusHandler()
  }, [userProfile])

  useEffect(() => {
    if (addressWithDays) {
      setAddressWithDaysLocal(addressWithDays)
    }
  }, [addressWithDays])

  useEffect(() => {
    handleGetAllCardsRequest()
  }, [cardUpdated, userProfile])

  useEffect(() => {
    handleGetAllAddressRequest();
    getAddressWithDays();
  }, [userProfile, addAddressUpdated])

  useEffect(() => {
    getTickersData().then((res) => {
      getExpiredStatusHandler()
    })
  }, [userProfile, planExpired])

  useEffect(() => {
    if (startUpData) {
      setStartUpLocal(startUpData)
    }
  }, [startUpData])

  useEffect(() => {
    if (!Renewal) {
      if (error) {
        setErrorString(error?.message)
      } else {
        setErrorString("")
      }
    }
  }, [error])

  const stopeLoader = () => {
    customTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  useEffect(() => {
    disableDatesHandler()
  }, [pausePassLocal])

  const handleGetAllCardsRequest = () => {
    try {
      const { auth_token } = userDetails?.data
      if (auth_token) {
        dispatch(getAllCardsRequest({ token: auth_token, cardType: conditionForPaymob ? "paymob" : 'stripe' }))
        // dispatch(getAllCardsRequest({ token: auth_token }))
          .then(unwrapResult)
          .then((res) => {
            const response = res?.data?.data?.card;
            const PaymobCard = res?.data?.data?.default_card?.paymob_card_id ? res?.data?.data?.default_card : null;
            
            const firstCardCheck = response?.length >= 1;
            const responseDefCard = conditionForPaymob ? PaymobCard : response?.[0];
            const cardData = { card_id: responseDefCard?.id }
            if (conditionForPaymob && firstCardCheck && !defaultCard) {
              dispatch(setUserDefaultCardRequest({ accessToken: auth_token, cardData }))
                .then(unwrapResult)
                .then((res) => {
                  dispatch(updateDefCard(responseDefCard))
                  setCardUpdated(!cardUpdated)
                  AppLogger("this is response==========", res)
                })
                .catch((err) => {
                  AppLogger("this  is err", err)
                })
            }
            AppLogger(
              "This is resposne at handleGetAllCardsRequest===========",
              res
            )
          })
          .catch((err) => {
            AppLogger(
              "This  is error a t handleGetAllCardsRequest========",
              err
            )
          })
      }
    } catch (err) {
      AppLogger("this is handleGetAllCardsRequest==========", err)
    }
  }

  console.log("allUserPreferencesData,",allUserPreferencesData)
  console.log("localMealPlanChanges,",localMealPlanChanges)
  const callStartUpFilesHandler = () => {
    try {
      const { auth_token } = userDetails?.data
      console.log("xxxxxxxx")
      if (auth_token) {
        dispatch(StartUpRequest({ token: auth_token }))
          .then(unwrapResult)
          .then((response) => {
            AppLogger("Response at StartUpRequest", response)
            console.log("response",response)
            const renewal_threshold = get(response, "data.data.renew_threshold_day", new Date());
            if (isViolatingRenewalThreshold(renewal_threshold) && Renewal) {
              setErrorString("")
              setStartDate("")
              setLocalMealPlanChanges(get(response, "data.data.guest.meal_plan", []))
              setAllUserPreferencesData({ ...allUserPreferencesData, meal_plan_start_date: "" })
            }
          })
          .catch((error) => {
            AppLogger("Error at StartUpRequest", error)
          })
      }
    } catch (err) {
      AppLogger("Error at callStartUpFilesHandler", err)
    }
  }

  const getAddressWithDays = () => {
    try {
      const { auth_token } = userDetails?.data
      if (auth_token) {
        dispatch(getDeliveryAddressWithDaysRequest({ token: auth_token }))
          .then(unwrapResult)
          .then((response) => {
            AppLogger("Response at getAddressWithDays", response)
          })
          .catch((error) => {
            AppLogger("Error at getAddressWithDays", error)
          })
      }
    } catch (err) {
      AppLogger("Error at getAddressWithDays", err)
    }
  }

  const updateAddressWithDays = (payload) => {
    try {
      const { auth_token } = userDetails?.data
      if (auth_token && payload) {
        // Disabeling loader for add address days
        // setIsLoading(true);
        dispatch(isExecutive ? updateCompanyDeliveryAddressWithDaysRequest({
          token: auth_token,
          scheduleDeliveryBody: {
            data: payload,
            order_id: active_order_id
          }
        }) : updateDeliveryAddressWithDaysRequest({
          token: auth_token,
          scheduleDeliveryBody: {
            data: payload,
            order_id: active_order_id
          }
        }))
          .then(unwrapResult)
          .then((response) => {
            getAddressWithDays()
            handleGetAllAddressRequest()
            setIsLoading(false);
            AppLogger("Response at updateAddressWithDays", response)
          })
          .catch((error) => {
            showFaliureToast(AppErrors.SOMETHING_WENT_WRONG);
            getAddressWithDays();
            setIsLoading(false);
            AppLogger("Error at updateAddressWithDays", error)
          })
      }
    } catch (err) {
      AppLogger("Error at updateAddressWithDays", err)
    }
  }

  const handleGetAllAddressRequest = () => {
    try {
      const { auth_token } = userDetails?.data

      dispatch(getAllAddressRequest({ token: auth_token }))
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

  const isPlanExpiredHandler = () => {
    try {
      if (userEndDate) {
        const today = new Date()
        const userDate = new Date(userEndDate)
        if (today > userDate) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    } catch (err) {
      AppLogger("Error at isPlanExpiredHandler", err)
      return false
    }
  }

  const getExpiredStatusHandler = () => {
    try {
      const today = new Date()
      const userDate = new Date(userEndDate)
      if (userEndDate) {
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
console.log("summaryData",summaryData)
  const userRenewalProfileHandler = async (values) => {
    try {
      if (values) {
        const { allergies, dislikes, pause_dates, profile, guest, phone } =
          values
        var allAllergies = []
        var allDislikes = []
        var pauseDates = []

        for (let i = 0; i < allergies.length; i++) {
          const userAllergies = allergies[i]
          allAllergies.push(userAllergies?.title ?? userAllergies)
          if (i == allergies.length - 1) {
            allUserPreferencesData.allergy = allAllergies
          }
        }

        for (let i = 0; i < dislikes.length; i++) {
          const userDislikes = dislikes[i]
          allDislikes.push(userDislikes?.title ?? userDislikes)
          if (i == dislikes.length - 1) {
            allUserPreferencesData.food_dislikes = allDislikes
          }
        }

        for (let i = 0; i < pause_dates.length; i++) {
          const userPauseDates = pause_dates[i]
          pauseDates.push(
            userPauseDates?.meal_plan_pause_date
              ? userPauseDates?.meal_plan_pause_date
              : userPauseDates
          )
          if (i == pause_dates.length - 1) {
            allUserPreferencesData.meal_plan_pause_date = pauseDates
          }
        }

        if (pause_dates.length == 0) {
          allUserPreferencesData.meal_plan_pause_date = []
        }

        allUserPreferencesData.vegeterian = profile?.vegeterian
        allUserPreferencesData.days_food_delivery = profile.days_food_delivery
        // allUserPreferencesData.delivery_time = profile?.delivery_time
        allUserPreferencesData.meal_plan_start_date =
          profile?.meal_plan_start_date
        allUserPreferencesData.vegeterian = profile?.vegeterian
        allUserPreferencesData.meal_plan_end_date = profile?.meal_plan_end_date
        allUserPreferencesData.delivery_address = profile?.delivery_address
        allUserPreferencesData.phone = phone

        allUserPreferencesData.snacks_deliver_per_day =
          guest?.snacks_deliver_per_day
        allUserPreferencesData.meals_deliver_per_day =
          guest?.meals_deliver_per_day
        allUserPreferencesData.meal_days_per_week = guest?.meal_days_per_week
        allUserPreferencesData.meal_plan_require_weeks = allUserPreferencesData.meal_plan_require_weeks ? allUserPreferencesData.meal_plan_require_weeks :
          guest?.meal_plan_require_weeks
        allUserPreferencesData.meal_plan = guest?.meal_plan
        allUserPreferencesData.culinary_check = profile?.culinary_check
        allUserPreferencesData.notification = profile?.notification
        allUserPreferencesData.exclude_breakfast = profile?.exclude_breakfast
        allUserPreferencesData.dob = profile?.dob

        // setPreferenceseData(userProfile)
        setAllUserPreferencesData({ ...allUserPreferencesData })
        setData(profile?.meal_plan_start_date)
        setDates(pauseDates)
        updatePreferencesHandler()
      } else {
        if (summaryData) {
          const { allergies, dislikes, pause_dates, profile, guest, phone } =
            summaryData
          var allAllergies = []
          var allDislikes = []
          var pauseDates = []

          for (let i = 0; i < allergies.length; i++) {
            const userAllergies = allergies[i]
            allAllergies.push(userAllergies?.title ?? userAllergies)
            if (i == allergies.length - 1) {
              allUserPreferencesData.allergy = allAllergies
            }
          }

          for (let i = 0; i < dislikes.length; i++) {
            const userDislikes = dislikes[i]
            allDislikes.push(userDislikes?.title ?? userDislikes)
            if (i == dislikes.length - 1) {
              allUserPreferencesData.food_dislikes = allDislikes
            }
          }

          for (let i = 0; i < pause_dates.length; i++) {
            const userPauseDates = pause_dates[i]
            pauseDates.push(
              userPauseDates?.meal_plan_pause_date
                ? userPauseDates?.meal_plan_pause_date
                : userPauseDates
            )
            if (i == pause_dates.length - 1) {
              allUserPreferencesData.meal_plan_pause_date = pauseDates
            }
          }

          setMealPlanPauseDateLocal(pauseDates.map((val) => moment(val).format(AppConstants.dateFormat)))

          if (pause_dates.length == 0) {
            allUserPreferencesData.meal_plan_pause_date = []
          }

          allUserPreferencesData.vegeterian = profile?.vegeterian
          allUserPreferencesData.days_food_delivery = profile.days_food_delivery
          // allUserPreferencesData.delivery_time = profile?.delivery_time
          allUserPreferencesData.meal_plan_start_date =
            profile?.meal_plan_start_date
          allUserPreferencesData.vegeterian = profile?.vegeterian
          allUserPreferencesData.meal_plan_end_date =
            profile?.meal_plan_end_date
          allUserPreferencesData.delivery_address = profile?.delivery_address
          allUserPreferencesData.phone = phone

          allUserPreferencesData.snacks_deliver_per_day =
            guest?.snacks_deliver_per_day
          allUserPreferencesData.meals_deliver_per_day =
            guest?.meals_deliver_per_day
          allUserPreferencesData.meal_days_per_week = guest?.meal_days_per_week
          allUserPreferencesData.meal_plan_require_weeks =
            guest?.meal_plan_require_weeks
          allUserPreferencesData.meal_plan = guest?.meal_plan
          allUserPreferencesData.culinary_check = profile?.culinary_check
          allUserPreferencesData.notification = profile?.notification
          allUserPreferencesData.exclude_breakfast = profile?.exclude_breakfast
          allUserPreferencesData.dob = profile?.dob

          // setPreferenceseData(userProfile)§
          setAllUserPreferencesData({ ...allUserPreferencesData })
          setData(profile?.meal_plan_start_date)
          setDates(pauseDates)
        }
      }
    } catch (err) {
      AppLogger("Response at userProfileDataHandler", err)
    }
  }

  const disableDatesHandler = () => {
    const allDates = pausePassLocal.map((date) =>
      convertDate(date.delivery_date)
    )

    AppLogger("This is disabled dates=========", allDates)
    setDisabledDates(allDates)

    // disableDates()
  }

  const userProfileDataHandler = () => {
    try {
      if (userProfile) {
        const { allergies, dislikes, pause_dates, profile, guest, phone } =
          userProfile
        const allAllergies = allergies.map((allergy) => allergy?.title)
        const allDislikes = dislikes.map((dislike) => dislike?.title)
        const pauseDates =
          pause_dates.length > 0
            ? pause_dates?.map((pauseDate) => {
              const dateObj = new Date(pauseDate?.meal_plan_pause_date)
              // const dateObj = new Date(date)
              const formattedDate = dateObj
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                })
                .replace(/\//g, ".")
              return formattedDate
            })
            : []

        AppLogger("THIS IS DATEEEEEE===========", pauseDates)
        const allUserPreferencesData = {
          allergy: allAllergies,
          food_dislikes: allDislikes,
          meal_plan_pause_date: pauseDates,
          phone,
          vegeterian: profile?.vegeterian,
          days_food_delivery: profile.days_food_delivery,
          // delivery_time: profile?.delivery_time,
          meal_plan_start_date: profile?.meal_plan_start_date,
          meal_plan_end_date: profile?.meal_plan_end_date,
          delivery_address: profile?.delivery_address,
          snacks_deliver_per_day: guest?.snacks_deliver_per_day,
          meals_deliver_per_day: guest?.meals_deliver_per_day,
          meal_days_per_week: guest?.meal_days_per_week,
          meal_plan_require_weeks: guest?.meal_plan_require_weeks,
          meal_plan: guest?.meal_plan,
          culinary_check: profile?.culinary_check ?? 1,
          notification: profile?.notification ?? 1,
          exclude_breakfast: profile?.exclude_breakfast ?? 0,
          dob: userProfile?.dob ?? ''
        }

        // const allDates = convertDatesToReactMultiPicker(pauseDates)
        setData(allUserPreferencesData.meal_plan_start_date)
        setDates(pauseDates)
        setLocalMealPlanChanges(guest?.meal_plan)
        setAllUserPreferencesData({ ...allUserPreferencesData })
      }
    } catch (err) {
      AppLogger("Response at userProfileDataHandler", err)
    }
  }

  // const updateDeliveryDaysPerWeek = useMemo(() => {
  //   if (Renewal) {
  //     return renewalSummary?.data?.guest?.meal_days_per_week
  //   } else {
  //     return userProfile?.guest?.meal_days_per_week
  //   }
  // }, [
  //   userProfile?.guest?.meal_days_per_week,
  //   renewalSummary?.data?.guest?.meal_days_per_week
  // ])
  const updateDeliveryDaysPerWeek = Renewal ? renewalSummary?.data?.guest?.meal_days_per_week : userProfile?.guest?.meal_days_per_week

  function convertDate(dateString) {
    var date = new Date(dateString)
    var day = date.getDate()
    var month = date.getMonth() + 1
    var year = date.getFullYear()

    if (month < 10) {
      month = "0" + month
    }
    if (day < 10) {
      day = "0" + day
    }

    return `${day}.${month}.${year}`
  }

  const startDateDisableHandler = () => {
    if (Renewal) {
      return false
    }
    if (startDateDisabler()) {
      return true
    } else {
      return false
    }
  }

  const getTickersData = async () => {
    try {
      const { auth_token } = userDetails?.data
      setIsLoading(true)

      dispatch(GetTickersRequest({ token: auth_token }))
        .then(unwrapResult)
        .then((res) => {
          AppLogger("Response at GetResturantsRequest", res)
          if (!planExpired) {
            $("body").addClass("tickerON")
          } else {
            $("body").removeClass("tickerON")
          }
          stopeLoader()
        })
        .catch((err) => {
          stopeLoader()

          AppLogger("Error at GetResturantsRequest", err)
          $("body").removeClass("tickerON")
          if (err == "Error: Request failed with status code 401") {
            dispatch(logOutUserRequest({ token: auth_token }))
            dispatch(getPromoCodeDetailsAction({}))
            sessionStorage.clear();
            router.push(AppRoutes.login)
          }
        })
    } catch (err) { }
  }

  const handleConfirmDiscountConfirmation = () => {
    try {
      // if (!discountWarningData.key) {
      //   console.log("i ran iff key")
      //   return updateEditPreferenceSliderHandler("slider_update");
      // }


      if (discountWarningData.key == 'meal_days_per_week') {
        console.log("i ran iff key 222")
        setRenewalKey("meal_days_per_week")
        handleClickOpen(
          "days_food_delivery",
          allUserPreferencesData.days_food_delivery
        )

        return resetDiscountWarningData();
      }
      console.log("i ran iff key 444")

      allUserPreferencesData[discountWarningData.key] = discountWarningData.values.currentValue;
      // updateEditPreferenceSliderHandler("slider_update");
      resetDiscountWarningData();
    } catch (error) {
      AppLogger('Error at handleConfirmDiscountConfirmation', error);
    }
  }

  const handleCancelDiscountConfirmation = () => {
    try {
      if (!discountWarningData.key) updateEditPreferenceSliderHandler("slider_update");

      setAllUserPreferencesData({
        ...allUserPreferencesData,
        [discountWarningData.key]: discountWarningData.values.previousValue
      })
      resetDiscountWarningData();
      if (showNewcustomerUpdateButton) {
        onClickCancelButtonUnpaid(false)
      } else {
        onClickCancelButton(false)
      }
      setTimeout(() => {
        document.body.style.overflow = 'auto';
      }, 600);
    } catch (error) {
      setTimeout(() => {
        document.body.style.overflow = 'auto';
      }, 600);
      AppLogger('Error at handleCancelDiscountConfirmation', error);
    }
  }

  const updatePrice = async(order_id) => {
    try {
      const { auth_token } = userDetails?.data;
      if (auth_token && order_id) {
        await dispatch(updatePriceRequest({ token: auth_token, order_id }))
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

  const verifyOrderDiscount = async (order_id = null) => {
    const { auth_token } = userDetails?.data;

    try {
      if (!auth_token) return false;
      setIsLoading(true)
      const response = await dispatch(verifyOrderDiscountRequest({
        token: auth_token,
        order_id
      })).then(unwrapResult);
      setIsLoading(false)

      const result = await response;
      const warningStatus = get(result, 'data.data.warning', null);
      console.log("warningStatus", warningStatus)
      return warningStatus == true ? true : false;

    } catch (error) {
      setIsLoading(false)
      AppLogger("API failure at verifyOrderDiscount or Code level Error", error);
    }

    return false;
  };


  const updatePreferencesHandler = async () => {
    console.log("UPDATE_PREFS", allUserPreferencesData)
    // Handle Preferneces from here
    try {

      if (!Renewal) {
        const dateFormat = "YYYY-MM-DD HH:mm:ss"
        const { auth_token } = userDetails?.data;
        dispatch(setloaderForunsaved(true))
        setIsloadingUpdateRequest(true)
        setIsLoading(true)
        //here
        const allData = {
          ...allUserPreferencesData,
          meal_plan_pause_date:
            allUserPreferencesData.meal_plan_pause_date.length > 0
              ? allUserPreferencesData?.meal_plan_pause_date?.map((date) => {
                AppLogger("THIS IS DAYYYYYY+==========", `${date}`)
                // checks if date matches the dateFormat of API then returns -- otherwise converts it.
                if (moment(date, dateFormat, true).isValid()) {
                  return date.format("DD/MM/YYYY")
                }
                const [day, month, year] = date.split(".")
                return `${day}/${month}/${year}`
              })
              : [],
          ...handleGetPreviousPayload()
        }
        dispatch(
          UpdatePreferencesSliderRequest({
            preferenceData: allData,
            token: auth_token
          })
        )
          .then(unwrapResult)
          .then(async (res) => {
            await updatePrice(userProfile?.active_order_id);
            dispatch(setloaderForunsaved(false))
            AppLogger("Response at updatePreferencesHandler", res)
            callStartUpFilesHandler()
            resetTypesNButtonState()
            setIsLoading(false)
            setIsloadingUpdateRequest(false)
            // getTickersData()
            // getUserProfileHandler()
            if (renewalDataLocal) {
              onSavePressHandler()
            }
            stopeLoader()
            setcancelOrDiscardFakeloader(false)

          })
          .catch((error) => {
            setIsloadingUpdateRequest(false)
            setIsLoading(false)
            setcancelOrDiscardFakeloader(false)
            dispatch(setloaderForunsaved(true))
            resetTypesNButtonState()
            showFaliureToast("Something went wrong, please refresh page", error)
            scrollToTop()
            stopeLoader()
            setIsLoading(false)
            AppLogger("Error at updatePreferencesHandler", error)
            stopeLoader()
          })
      } else if (Renewal) {
        updateRenewalHandler()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const resetButtonHandlerNew = () => {
    const { auth_token } = userDetails?.data
    setErrorString("")

    const arr = allUserPreferencesData.meal_plan_pause_date?.map((date) => {
      return convertDate(date)
    })

    const allData = {
      ...allUserPreferencesData,
      meal_days_per_week: updateDeliveryDaysPerWeek,
      meal_plan_pause_date:
        arr.length > 0
          ? arr.map((date) => {
            AppLogger("This is date==========", date)
            if (typeof date == "string") {
              AppLogger("THIS IS DAYYYYYY+==========", `${date}`)
              const [day, month, year] = date.split(".")
              return `${day}/${month}/${year}`
            } else {
              const formmatedDate = moment(new Date(date)).format(
                AppConstants.dateFormat
              )
              const [month, day, year] = formmatedDate.split(".")
              return `${day}/${month}/${year}`
            }
          })
          : [],
      ...(!allUserPreferencesData.meal_plan_end_date && {
        meal_plan_end_date: createEndDate()
      })
      // meal_plan_end_date: createEndDate()
    }

    const newData = {
      ...allData,
      ...resetPayload
    }

    setMealPlanPauseDateLocal(
      arr.length > 0
        ? arr?.map((date) => {
          AppLogger("This is date==========", date)
          if (typeof date == "string") {
            AppLogger("THIS IS DAYYYYYY+==========", `${date}`)
            const [day, month, year] = date.split(".")
            return `${day}/${month}/${year}`
          } else {
            const formmatedDate = moment(new Date(date)).format(
              AppConstants.dateFormat
            )
            const [month, day, year] = formmatedDate.split(".")
            return `${day}/${month}/${year}`
          }
        })
        : []
    )

    setRenewalKey("")

    dispatch(
      updateRenewalSummary({
        accessToken: auth_token,
        renewalData: newData
      })
    )
      .then(unwrapResult)
      .then((res) => {
        setErrorString("")

        stopeLoader()
      })
      .catch((err) => {
        setErrorString(err.message)
        setIsLoading(false)
        stopeLoader()
      })
  }

  const isViolatingRenewalThreshold = (renewalDate) => {
    try {
      if (!renewalDate || !allUserPreferencesData.meal_plan_start_date) return false

      const selectedStartDate = moment(allUserPreferencesData.meal_plan_start_date);
      const renewalThreshold = moment(renewalDate).startOf("day");

      return selectedStartDate.isBefore(renewalThreshold);
    } catch (error) {
      console.log('Error at isViolatingRenewalThreshold', error);
    }
  }

  const updateRenewalHandler = async () => {
    // setIsLoading(true)
    const { auth_token } = userDetails?.data
    setErrorString("")
    AppLogger("This is all  data=======", allUserPreferencesData)

    const arr = allUserPreferencesData.meal_plan_pause_date?.map((date) => {
      return convertDate(date)
    })

    const allData = {
      ...allUserPreferencesData,
      // meal_days_per_week: updateDeliveryDaysPerWeek,
      meal_plan_pause_date:
        renewalKey !== "" && arr.length > 0
          ? arr.map((date) => {
            AppLogger("This is date==========", date)
            if (typeof date == "string") {
              AppLogger("THIS IS DAYYYYYY+==========", `${date}`)
              const [day, month, year] = date.split(".")
              return `${day}/${month}/${year}`
            } else {
              const formmatedDate = moment(new Date(date)).format(
                AppConstants.dateFormat
              )
              const [month, day, year] = formmatedDate.split(".")
              return `${day}/${month}/${year}`
            }
          })
          : allUserPreferencesData.meal_plan_pause_date.length > 0
            ? allUserPreferencesData?.meal_plan_pause_date?.map((date) => {
              AppLogger("This is date==========", date)
              if (typeof date == "string") {
                AppLogger("THIS IS DAYYYYYY+==========", `${date}`)
                const [day, month, year] = date.split(".")
                return `${day}/${month}/${year}`
              } else {
                const formmatedDate = moment(new Date(date)).format(
                  AppConstants.dateFormat
                )
                const [month, day, year] = formmatedDate.split(".")
                return `${day}/${month}/${year}`
              }
            })
            : [],
      // meal_plan_end_date: createEndDate()
      // ...(!meal_plan_end_date && { meal_plan_end_date: "ABC" })
      ...(!allUserPreferencesData.meal_plan_end_date && {
        meal_plan_end_date: createEndDate()
      })

    }

    setRenewalKey("")
    if (allUserPreferencesData?.meal_plan_start_date && Renewal) {
      dispatch(
        updateRenewalSummary({
          accessToken: auth_token,
          renewalData: allData
        })
      )
        .then(unwrapResult)
        .then((res) => {
          setErrorString("")
          resetTypesNButtonState()
          setcancelOrDiscardFakeloader(false)
          stopeLoader()
        })
        .catch((err) => {
          setcancelOrDiscardFakeloader(false)
          resetTypesNButtonState()
          showFaliureToast(err.message)
          callStartUpFilesHandler()
          setErrorString(err.message)
          setIsLoading(false)
          stopeLoader()
        })

    }
  }

  const updateRenewalSliderPopUpValue = async () => {
    // setIsLoading(true)
    const { auth_token } = userDetails?.data
    setErrorString("")
    AppLogger("This is all  data=======", allUserPreferencesData)
    const arr = allUserPreferencesData.meal_plan_pause_date?.map((date) => {
      return convertDate(date)
    })

    const allData = {
      ...allUserPreferencesData,
      meal_days_per_week: updateDeliveryDaysPerWeek,
      meal_plan_pause_date:
        arr.length > 0
          ? arr?.map((date) => {
            AppLogger("This is date==========", date)
            if (typeof date == "string") {
              AppLogger("THIS IS DAYYYYYY+==========", `${date}`)
              const [day, month, year] = date.split(".")
              return `${day}/${month}/${year}`
            } else {
              const formmatedDate = moment(new Date(date)).format(
                AppConstants.dateFormat
              )
              const [month, day, year] = formmatedDate.split(".")
              return `${day}/${month}/${year}`
            }
          })
          : [],
      // meal_plan_end_date: createEndDate()
      ...(!allUserPreferencesData.meal_plan_end_date && {
        meal_plan_end_date: createEndDate()
      })
    }
    // if(allUserPreferencesData?.meal_plan_start_date && Renewal){
    dispatch(
      updateRenewalSummary({
        accessToken: auth_token,
        renewalData: allData
      })
    )
      .then(unwrapResult)
      .then((res) => {
        setErrorString("")
        resetTypesNButtonState()
        stopeLoader()
      })
      .catch((err) => {
        resetTypesNButtonState()
        liureToast(err.message)
        setErrorString(err.message)
        callStartUpFilesHandler()
        setIsLoading(false)
        stopeLoader()
      })
    // }
  }

  const deletePauseDateHandler = (index) => {
    const allDates = [...allUserPreferencesData.meal_plan_pause_date]

    allDates.splice(index, 1)

    const dates = []
    for (let index = 0; index < allDates.length; index++) {
      const element = allDates[index]
      const formmatedDate = moment(element).format(AppConstants.dateFormat)
      if (Renewal) {
        dates.push(formmatedDate)
      } else {
        dates.push(element)
      }
      AppLogger("This is delete pause  handler========", element)
      // dates.push(element)
    }
    setAllUserPreferencesData({
      ...allUserPreferencesData,
      meal_plan_pause_date: dates
    })
    handleFormChangeData(dates, "meal_plan_pause_date")
  }

  const pauseDateLocalHandler = (datee) => {
    try {
      const days = []
      days.push(...filterPauseDates(allUserPreferencesData.meal_plan_pause_date, 'previous'))
      for (let index = 0; index < datee.length; index++) {
        const element = datee[index]
        let formattedDate = new Date(element)
        //NOTE - Added formated date because of invalid date error
        formattedDate = moment(formattedDate).format(AppConstants.dateFormat)
        AppLogger("This is formattedDate======", formattedDate)

        days.push(formattedDate)
      }
      allUserPreferencesData.meal_plan_pause_date = days
      // AppLogger(
      //   "this is AlluserPreferenceData",
      //   allUserPreferencesData.meal_plan_pause_date
      // )
      setAllUserPreferencesData({ ...allUserPreferencesData })
    } catch (err) {
      AppLogger("This is err at PauseDateLocalHandler=========", err)
    }
  }

  const onSaveDatePressHandler = () => {
    try {
      const { meal_plan_pause_date } = allUserPreferencesData
      const days = []
      for (let index = 0; index < meal_plan_pause_date.length; index++) {
        const element = meal_plan_pause_date[index]
        //NOTE - Commented because of invalid date error
        // const formatedDate = moment(element).format(AppConstants.dateFormat)
        if (Renewal && !moment(element, AppConstants.dateFormat).isValid()) {
          const formatedDate = moment(new Date(element)).format(
            AppConstants.dateFormat
          )
          days.push(formatedDate)
        } else {
          days.push(element)
        }
      }
      if (Renewal) {
        setMealPlanPauseDateLocal(days)
      }
      handleFormChangeData(days, "meal_plan_pause_date")
      AppLogger("This is days==============", days)
      datePickerRef2.current.closeCalendar()
    } catch (err) {
      AppLogger("this is error at onsavedatepress=======", err)
    }
  }
  const handleFormChangeData = (value, key) => {
    console.log("FORM_CHANGE_01")
    try {
      if (isPriceConfirmation) {
        setIsPriceConfirmation(false)
      }
      allUserPreferencesData[key] = value
      if (key === 'allergy') {
        const currentSelectedAllergy = startUpData?.allergies?.find(allergy => value?.includes(allergy?.title));
        const previousAllergy = startUpData?.allergies?.find(allergy => userProfile?.allergies?.[0]?.title === allergy?.title);
        const filterDislikes = (allergy) => {
          const relatedTitles = new Set(allergy?.related_ingredients?.map(item => item?.title?.toLowerCase()));
          return userProfile?.dislikes?.filter(option => !relatedTitles.has(option?.title?.toLowerCase()))?.map(aller => aller?.title);
        };
        allUserPreferencesData['food_dislikes'] = filterDislikes(currentSelectedAllergy);
        // Don't remove this it detects previous allergy dislikes and removes
        // if (userProfile?.allergies?.some(item => item?.title == previousAllergy?.title)) {
        //     allUserPreferencesData['food_dislikes'] = filterDislikes(previousAllergy);
        // }
      }

      // console.log("mealdays",allUserPreferencesData)
      setAllUserPreferencesData({ ...allUserPreferencesData, meal_plan: localMealPlanChanges })
      const KeysWhichMatter = ['snacks_deliver_per_day', 'meals_deliver_per_day', 'meal_plan_require_weeks', 'meal_plan', 'meal_days_per_week', 'days_food_delivery']
      // if (KeysWhichMatter.includes(key)) {
      //   console.log('not matter')
      //   // setTypeOfChange("slider_update")
      // }
      // console.log("key",key)

      // if( UnPaidOrderAndActive && KeysWhichMatter.includes(key) ){
      // if(UnPaidOrderAndActive && KeysWhichMatter.includes(key) && !Renewal  ){
      if (KeysWhichMatter.includes(key) && !Renewal) {
        setTabChangeFunctionTriggerAndUnpaidChangeButton(true)
        return
      } else {
        updatePreferencesHandler()
      }
    } catch (err) {
      AppLogger("Error at handleFormChangeData", err)
    }
  }

  const handleCloseCross = (event, reason) => {
    setOpen(false)
    if (showNewcustomerUpdateButton && !Renewal) {
      onClickCancelButtonUnpaid(false)
    } else {
      !Renewal && onClickCancelButton(false)
    }
    setTimeout(() => {
      document.body.style.overflow = 'auto';
    }, 600);
  }

  const handleClose = (event, reason) => {
    // if (reason !== "backdropClick") {
    //   setOpen(false)
    // }
    setOpen(false)
    setTimeout(() => {
      document.body.style.overflow = 'auto';
    }, 600);
  }

  const handleClosePass = (event, reason) => {
    setPassopen(false)
    setTimeout(() => {
      document.body.style.overflow = 'auto';
    }, 600);
  }

  const handleClickOpen = (type, data) => {
    setCurrentModalType(type)
    setCurrentData(data)
    setOpen(true)
  }

  const handleClickPhoneOpen = (type, data) => {
    setCurrentModalType(type)
    setCurrentData(data)
    setShowPhonePopup(true)
  }

  const handlePassopen = () => {
    setPassopen(true)
  }

  const addClass = () => {
    setIsOptionsExpanded(!isOptionsExpanded)
  }

  const addClass2 = () => {
    setIsOptionsExpanded2(!isOptionsExpanded2)
  }
  const scrollToTop = () => {
    if (window) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth", // Enables smooth scrolling
      });
    }
  }

  const handleGetPreviousPayload = () => {
    if (userDetailsLocal) {
      const { guest, profile } = userDetailsLocal

      return {
        meal_plan: guest?.meal_plan,
        snacks_deliver_per_day: guest?.snacks_deliver_per_day,
        meals_deliver_per_day: guest?.meals_deliver_per_day,
        meal_days_per_week: guest?.meal_days_per_week,
        meal_plan_require_weeks: guest?.meal_plan_require_weeks,
        // days_food_delivery: profile?.days_food_delivery,
      }

    }

    return {}
  }
  // const isPaid = orderHistoryLocal?.some(
  //     (val) => val?.not_paid_type == "full" && val?.payment_status == AppConstants.paid &&val?.is_active === 1
  //   );

  const isPaidAndNotThreshold = () => {
    // Paid Order Check
    const isPaid = orderHistoryLocal?.some(
      (val) => val?.not_paid_type == "full" && val?.payment_status == "paid"
    );

    // Plan Expiry Check
    const isPlanExpired = isPlanExpiredHandler();
    const endDate = moment(userEndDate);
    const threshold = moment(thresholdDate).startOf('day');
    // Threshold Check on basis of end date
    const notInThreshold = !threshold.isAfter(endDate);

    if (isPaid && notInThreshold && !isPlanExpired) {
      return true;
    }

    return false;
  }
  const handleUpdate = (key, value, callback) => {
    console.log("key", key, "value", value)
    try {
      if (typeof key == 'string' && typeof value !== 'undefined') {
        dispatch(setpaidSliderEPTriggered(true));// this disptach will detect when tab change
        const isPaidCheck = isPaidAndNotThreshold();
        // const isPaidCheck = false; // Temporarily disabled for testing
        // Paid Plan check & Renewal check
        if (isPaidCheck && !Renewal) {
          allUserPreferencesData[key] = value;
          setAllUserPreferencesData({ ...allUserPreferencesData });
          if (!isPriceConfirmation) {
            setIsPriceConfirmation(true);
          }

        } else {
          if (typeof callback == 'function') {
            if (UnPaidOrderAndActive && !Renewal) {
              allUserPreferencesData[key] = value;
              setAllUserPreferencesData({ ...allUserPreferencesData });
              setattachFunctionAgain(Math.random())
              setTabChangeFunctionTriggerAndUnpaidChangeButton(true)
              return
            }
            callback();
          }
        }
      }
    } catch (error) {
      console.log("Error at handleUpdate", error);
    }
  }

  const handlePriceConfirmationResponse = async (type, price) => {
    try {
      if (type && (type == AppConstants.topUp || type == AppConstants.topDown && price == 0)) {
        // Update call on top up or Top down of 0 case (nullify)
        onClickConfirmButton().then(() => {
          setIsPriceConfirmation(false);
          getTickersData();
        })
      } else {
        // Show wallet pop up
        // alert('hs')

        if (renewalData) {
          setPriceConfirmationDataLocal({ price: price, type: type })
        } else {
          if (type && tickerPaymentType != AppConstants.unpaid) {
            setPriceConfirmationDataLocal({ price: price, type: type })
          } else {
            onClickConfirmButton()
          }
        }
      }
    } catch (error) {
      console.log('Error at handlePriceConfirmationResponse', error);
    }
  }
  const handleGetPriceConfirmation = async (payload) => {
    const { auth_token } = userDetails?.data ?? null;
    try {
      dispatch(setloaderForunsaved(true));
      setIsLoading(true);
      pricingApisetsetIsLoading(true)
      if (auth_token && typeof payload == 'object') {

        dispatch(
          priceConfirmationRequest({
            preferenceData: payload,
            token: auth_token
          }))
          .then(unwrapResult)
          .then((response) => {
            console.log('resp', response)
            dispatch(setloaderForunsaved(false));
            setIsPriceConfirmation(true);
            pricingApisetsetIsLoading(false)
            const price = get(response, "data.data.amount", 0);
            const type = get(response, "data.data.type", "");
            handlePriceConfirmationResponse(type, price);
            setIsLoading(false);
          })
          .catch((error) => {
            dispatch(setloaderForunsaved(false));
            pricingApisetsetIsLoading(false)
            AppLogger("Error at priceConfirmationRequest", error);
            setIsLoading(false);
          })

      }

    } catch (error) {
      dispatch(setloaderForunsaved(false));
      pricingApisetsetIsLoading(false)
      console.log("Error at handleGetPriceConfirmation", error);
    }
  }

  const onClickUpdateButton = async () => {
    allUserPreferencesData['meal_plan'] = localMealPlanChanges;
    const payload = {
      ...allUserPreferencesData,
      meal_days_per_week: updateDeliveryDaysPerWeek,
      meal_plan_pause_date:
        allUserPreferencesData.meal_plan_pause_date.length > 0
          ? allUserPreferencesData?.meal_plan_pause_date?.map((date) => {
            const [day, month, year] = date.split(".")
            return `${day}/${month}/${year}`
          })
          : [],
      // meal_plan: localMealPlanChanges,

    }
    // handleFinalMealPlanUpdate()
    await handleGetPriceConfirmation(payload);
  }

  const onClickConfirmButton = async () => {
    setIsLoading(true);
    updateEditPreferenceSliderHandler()
      .then(() => {
        console.log("triggerFortabChange out confirm", triggerFortabChange)
        // if(triggerFortabChange){
        //   console.log("triggerFortabChange in confirm",triggerFortabChange)
        //   console.log("window.handleGoTOoActiveTab in confirm",window.handleGoTOoActiveTab)
        //   window.handleGoTOoActiveTab ? 
        //   window.handleGoTOoActiveTab() : null
        //   dispatch(setpaidSliderEPTriggered(false))
        //   dispatch(settriggerFortabChange(false))
        //   dispatch(setsaveTabChangesButtonHit(false))
        // }
        setIsLoading(false);
        onClickCancelButton(false);
        setIsPriceConfirmation(false);
        resetTypesNButtonState()
        setPriceConfirmationDataLocal({ price: 0, type: '' });
      });
  }

  const onClickCancelButton = async (isWalletPopup) => {
    setIsPriceConfirmation(false);
    if (!isWalletPopup) {
      setAllUserPreferencesData({ ...allUserPreferencesData, ...handleGetPreviousPayload() });
      setIsPriceConfirmation(false);
    }

    setAllUserPreferencesData({ ...allUserPreferencesData, ...handleGetPreviousPayload() });
    setPriceConfirmationDataLocal({ price: 0, type: '' });
    fakeLoading()
    resetTypesNButtonState();
    setDiscardModalState(false)
    setChangesPending({
      isChanges: false,
      onConfirm: async () => { },
      onCancel: async () => { }
    })
  };
  const onClickCancelButtonUnpaid = async (isWalletPopup) => {
    setIsPriceConfirmation(false);
    setChangesPending({
      isChanges: false,
      onConfirm: async () => { },
      onCancel: () => { }
    })
    setShowNewcustomerUpdateButton(false)
    resetTypesNButtonState()
    fakeLoading().then(() => {
      setAllUserPreferencesData({ ...allUserPreferencesData, ...handleGetPreviousPayload(), days_food_delivery: userDetailsLocal?.profile?.days_food_delivery });
    })
  };

  const [errorString2, setErrorString2] = useState(false);

  const updateEditPreferenceSliderHandler = useCallback(async (type) => {
  try {
    const { auth_token } = userDetails?.data;
    setIsLoading(true);
    dispatch(setloaderForunsaved(true));

    let allData = {};

    if (Renewal) {
      allData = {
        vegeterian: allUserPreferencesData?.vegeterian,
        allergy: allUserPreferencesData?.allergy,
        food_dislikes: allUserPreferencesData?.food_dislikes,
        culinary_check: oldProfileData?.culinary_check,
        days_food_delivery: oldProfileData?.days_food_delivery,
        delivery_address: oldProfileData?.delivery_address,
        from: "renewal",
        meal_days_per_week: oldData.meal_days_per_week,
        meal_plan: oldData?.meal_plan,
        meal_plan_end_date: oldProfileData?.meal_plan_end_date,
        meal_plan_pause_date:
          userProfile.pause_dates.length > 0
            ? userProfile.pause_dates.map(date =>
                moment(date.meal_plan_pause_date).format("DD/MM/YYYY")
              )
            : [],
        meal_plan_require_weeks: oldData?.meal_plan_require_weeks,
        meal_plan_start_date: oldProfileData?.meal_plan_start_date,
        meals_deliver_per_day: oldData?.meals_deliver_per_day,
        notification: oldProfileData?.notification,
        exclude_breakfast: allUserPreferencesData.exclude_breakfast,
        phone: userProfile?.phone,
        snacks_deliver_per_day: oldData?.snacks_deliver_per_day
      };
    } else {
      allData = {
        ...allUserPreferencesData,
        meal_days_per_week:
          type === "newCustomer"
            ? allUserPreferencesData.meal_days_per_week
            : updateDeliveryDaysPerWeek,
        meal_plan_pause_date:
          allUserPreferencesData.meal_plan_pause_date.length > 0
            ? allUserPreferencesData.meal_plan_pause_date.map(date => {
                const [day, month, year] = date.split(".");
                return `${day}/${month}/${year}`;
              })
            : [],
        meal_plan: localMealPlanChanges
      };
    }

    /** 1️⃣ Update preferences */
    const response = await dispatch(
      UpdatePreferencesSliderRequest({
        preferenceData: allData,
        token: auth_token,
        redirect: true
      })
    ).unwrap();

    AppLogger("Response at updateEditPreferenceSliderHandler", response);

    /** 2️⃣ Update price AFTER success */
    await updatePrice(userProfile?.active_order_id);

    /** 3️⃣ Run remaining logic AFTER price update */
    callStartUpFilesHandler();
    stopeLoader();

    if (type === "slider_update" && renewalDataLocal) {
      onSavePressHandler();
    }

    dispatch(setloaderForunsaved(false));
    dispatch(setpaidSliderEPTriggered(false));
    resetTypesNButtonState();

    setChangesPending({
      isChanges: false,
      onConfirm: () => {},
      onCancel: () => onClickCancelButtonUnpaid(false)
    });

  } catch (error) {
    dispatch(setloaderForunsaved(false));
    resetTypesNButtonState();
    scrollToTop();

    if (
      error?.response?.data?.message ===
      "Your Order is about to end Can't update due to Threshold"
    ) {
      setErrorString2(true);
      customTimeout(() => setErrorString2(false), 5000);
    } else {
      const errorMsg = error?.response?.data?.message
        ? toSentenceCase(error.response.data.message)
        : "";
      errorMsg && showFaliureToast(errorMsg);
    }

    AppLogger("Error at updateEditPreferenceSliderHandler", error);
    getUserProfileHandler();
    stopeLoader();
  } finally {
    setIsLoading(false);
    dispatch(setloaderForunsaved(false));
  }
}, [localMealPlanChanges, allUserPreferencesData]);


  // const updateEditPreferenceSliderHandler = useCallback(async (type) => {
  //   console.log("TYPE", type)
  //   console.log("UPDATE_PREF_SLIDER")
  //   console.log('localMealPlanChanges', localMealPlanChanges)
  //   // if (!Renewal) {
  //   const { auth_token } = userDetails?.data
  //   setIsLoading(true)
  //   dispatch(setloaderForunsaved(true))

  //   let allData = {}
  //   if (Renewal) {
  //     allData = {
  //       vegeterian: allUserPreferencesData?.vegeterian,
  //       allergy: allUserPreferencesData?.allergy,
  //       food_dislikes: allUserPreferencesData?.food_dislikes,
  //       culinary_check: oldProfileData?.culinary_check,
  //       days_food_delivery: oldProfileData?.days_food_delivery,
  //       delivery_address: oldProfileData?.delivery_address,
  //       from: "renewal",
  //       meal_days_per_week: oldData.meal_days_per_week,
  //       meal_plan: oldData?.meal_plan,
  //       meal_plan_end_date: oldProfileData?.meal_plan_end_date,
  //       meal_plan_pause_date:
  //         userProfile.pause_dates.length > 0
  //           ? userProfile?.pause_dates?.map((date) => {
  //             AppLogger("THIS IS DAYYYYYY+==========", `${date}`)
  //             return moment(date.meal_plan_pause_date).format("DD/MM/YYYY")
  //           })
  //           : [],
  //       meal_plan_require_weeks: oldData?.meal_plan_require_weeks,
  //       meal_plan_start_date: oldProfileData?.meal_plan_start_date,
  //       meals_deliver_per_day: oldData?.meals_deliver_per_day,
  //       notification: oldProfileData?.notification,
  //       exclude_breakfast: allUserPreferencesData.exclude_breakfast,
  //       phone: userProfile?.phone,
  //       snacks_deliver_per_day: oldData?.snacks_deliver_per_day
  //     }
  //   } else {
  //     allData = {
  //       ...allUserPreferencesData,
  //       //**PRAC-583
  //       meal_days_per_week: type == 'newCustomer' ? allUserPreferencesData.meal_days_per_week : updateDeliveryDaysPerWeek,
  //       //PRAC-583**

  //       meal_plan_pause_date:
  //         allUserPreferencesData.meal_plan_pause_date.length > 0
  //           ? allUserPreferencesData?.meal_plan_pause_date?.map((date) => {
  //             AppLogger("THIS IS DAYYYYYY+==========", `${date}`)
  //             const [day, month, year] = date.split(".")
  //             return `${day}/${month}/${year}`
  //           })
  //           : [],
  //       meal_plan: localMealPlanChanges,

  //     }
  //   }
  //   await dispatch(
  //     UpdatePreferencesSliderRequest({
  //       preferenceData: allData,
  //       token: auth_token,
  //       redirect: true
  //     })
  //   )
  //     .then(unwrapResult)
  //     .then(async(res) => {
  //       await updatePrice(userProfile?.active_order_id);
  //       AppLogger("Response at updateEditPreferenceSliderHandler", res)
  //       callStartUpFilesHandler()
  //       stopeLoader()
  //       if ((type == "slider_update") && renewalDataLocal) {
  //         onSavePressHandler()
  //       }
  //       // dispatch(setswitchTabTo(''))
  //       dispatch(setloaderForunsaved(false))
  //       dispatch(setpaidSliderEPTriggered(false))
  //       resetTypesNButtonState()
  //       setChangesPending({
  //         isChanges: false,
  //         onConfirm: () => { },
  //         onCancel: () => onClickCancelButtonUnpaid(false)
  //       })
  //     })
  //     .catch((error) => {
  //       dispatch(setloaderForunsaved(false))
  //       resetTypesNButtonState()
  //       scrollToTop()
  //       "Your Order is about to end Can't update due to Threshold"
  //       if (
  //         error?.response?.data?.message ==
  //         "Your Order is about to end Can't update due to Threshold"
  //       ) {
  //         setErrorString2(true)
  //         customTimeout(() => {
  //           setErrorString2(false)
  //         }, 5000)
  //         // showFaliureToast("Cannot heheheheheeheh update")
  //       } else {
  //         const errroorMsg = error?.response?.data?.message ? toSentenceCase(error?.response?.data?.message) : '';
  //         errroorMsg ? showFaliureToast(errroorMsg) : ''
  //       }
  //       AppLogger("Error at updateEditPreferenceSliderHandler", error)
  //       getUserProfileHandler()
  //       stopeLoader()
  //     })
  //   setIsLoading(false)
  //   dispatch(setloaderForunsaved(false))
  //   // } else if (Renewal) {
  //   //   updateRenewalHandler()
  //   // }
  // }, [localMealPlanChanges, allUserPreferencesData])

  const isDiscountAvailableOnKey = (key) => {

    if (typeof key !== 'string') return false;

    const discountAvaiableKeys = ["meals_deliver_per_day", "snacks_deliver_per_day", "meal_days_per_week"];

    return discountAvaiableKeys.includes(key)
  }

  const isOrderDiscountApplied = (key) => {
    return !isPaid() && isDiscountAvailableOnKey(key) && !Renewal;
  }
  const onSliderChangeHandler = async (value, key) => {
    dispatch(setpaidSliderEPTriggered(true));// this disptach will detect when tab change

    // Order Discount early return
    if (isOrderDiscountApplied(key)) {
      const discountWarning = await verifyOrderDiscount();
      if (key == 'meal_days_per_week') allUserPreferencesData[key] = value;
      if (discountWarning) return updateDiscountWarningData(key, { previousValue: allUserPreferencesData[key], currentValue: value });
    }
    allUserPreferencesData[key] = value
    if (key == "meal_days_per_week") {
      setRenewalKey("meal_days_per_week")
      handleClickOpen(
        "days_food_delivery",
        allUserPreferencesData.days_food_delivery
      )
    } else if (
      (key == "snacks_deliver_per_day" && Renewal) ||
      (key == "meal_plan" && Renewal) ||
      (key == "meals_deliver_per_day" && Renewal) ||
      (key == "meal_plan_require_weeks" && Renewal)
    ) {
      updateRenewalSliderPopUpValue()
    } else {
      setAllUserPreferencesData({ ...allUserPreferencesData });
      // updateEditPreferenceSliderHandler("slider_update")
    }
  }

  const onMealPlanChangeHandler = (value, index) => {
    const allMeals = [...allUserPreferencesData.meal_plan]
    allMeals[index] = value
    handleUpdate("meal_plan", allMeals, () => onSliderChangeHandler(allMeals, "meal_plan"));
    // onSliderChangeHandler(allMeals, "meal_plan")
  }

  const onSavePressHandler = (test) => {
    if (allUserPreferencesData?.meal_plan_start_date) {
      setApiLoading(true)
      console.log(renewalDataLocal, "renewalDataLocal")
      const { auth_token } = userDetails?.data

      let newData = {}

      if (!Renewal) {
        const {
          culinary_check,
          days_food_delivery,
          delivery_address,
          meal_days_per_week,
          meal_plan,
          meal_plan_end_date,
          pause_dates,
          meal_plan_require_weeks,
          meal_plan_start_date,
          meals_deliver_per_day,
          notification,
          exclude_breakfast,
          snacks_deliver_per_day
        } = renewalDataLocal
        newData = {
          allergy: allUserPreferencesData.allergy,
          vegeterian: allUserPreferencesData.vegeterian,
          food_dislikes: allUserPreferencesData.food_dislikes,
          culinary_check: culinary_check,
          days_food_delivery: days_food_delivery,
          delivery_address: delivery_address,
          meal_days_per_week: meal_days_per_week,
          meal_plan: meal_plan,
          meal_plan_end_date: meal_plan_end_date,
          meal_plan_pause_date:
            pause_dates.length > 0
              ? pause_dates.map((date) => {
                return moment(date).format("DD/MM/YYYY")
              })
              : [],
          meal_plan_require_weeks: meal_plan_require_weeks,
          meal_plan_start_date: meal_plan_start_date,
          meals_deliver_per_day: meals_deliver_per_day,
          notification: notification,
          phone: allUserPreferencesData.phone,
          snacks_deliver_per_day: snacks_deliver_per_day,
          exclude_breakfast: allUserPreferencesData.exclude_breakfast,
          is_internal: 1
        }
      } else {
        newData = {
          ...allUserPreferencesData,
          meal_plan_pause_date:
            allUserPreferencesData.meal_plan_pause_date.length > 0
              ? allUserPreferencesData?.meal_plan_pause_date?.map((date) => {
                // const newDate = date.split(" ")[0]
                // const [year, month, day] = newDate.split("-")
                // return `${day}/${month}/${year}`
                return moment(date).format("DD/MM/YYYY")
              })
              : [],
          meal_plan: localMealPlanChanges,

        }
      }

      dispatch(
        postRenewalRequest({
          accessToken: auth_token,
          renewalData: newData
        })
      )
        .then(unwrapResult)
        .then(async(res) => {
           await updatePrice(userProfile?.active_order_id);
          setIsLoading(false)
          setErrorString("")
          setApiLoading(false)
          if (Renewal && !isPlanExpiredHandler()) {
            updateEditPreferenceSliderHandler()
          }
          if (test) {
            router.push(
              `${AppRoutes.checkOut}?type=renewal&order_id=${order_idRenewal}`
            )
          } else {
            $("body").addClass("tickerON")
            router.push(AppRoutes.dashboard)

          }
        })
        .catch((err) => {
          callStartUpFilesHandler()
          if (err?.message == "You already have an unpaid plan") {
            showFaliureToast(err?.message);
            router.push(AppRoutes.dashboard);
          } else {
            showFaliureToast(err?.message);
          }
          setIsLoading(false)
          setApiLoading(true)
          setErrorString(err?.message)
        })
    }
    else {
      setApiLoading(false)
      showFaliureToast(" Please Select a Start Date")
    }
  }

  const reCallHandler = async (values) => {
    try {
      userRenewalProfileHandler(values)

      return Promise.resolve()
    } catch (err) {
      return Promise.reject()
    }
  }

  const getRenewalDataHandler = () => {
    try {
      const { auth_token } = userDetails?.data
      dispatch(getRenewalDataRequest({ token: auth_token })).then(unwrapResult)
    } catch (error) {
      AppLogger("Error at newResetHandler", error)
    }
  }

  const onResetHandlerNew = () => {
    if (Renewal) {
      //ANCHOR - PAUSE DATE VALUE HANDLING CHANGED
      setMealPlanPauseDateLocal([])
      // getRenewalDataHandler()
      resetButtonHandlerNew()
    } else {
      onResetPressHandler()
    }
  }

  const onResetPressHandler = () => {
    const { auth_token } = userDetails?.data
    setIsLoading(true)
    setcancelOrDiscardFakeloader(true)
    if (Renewal) {
      dispatch(resetRenewalRequest({ token: auth_token }))
        .then(unwrapResult)
        .then((res) => {
          stopeLoader()
          setcancelOrDiscardFakeloader(false)
        })
        .catch((err) => {
          setcancelOrDiscardFakeloader(false)
          stopeLoader()
        })
    } else {
      dispatch(resetPreferencesRequest({ token: auth_token }))
        .then(unwrapResult)
        .then((res) => {
          reCallHandler(res.data.data)
            .then(() => {
              // fakeLoading()
              // setcancelOrDiscardFakeloader(false)
              // updatePreferencesHandler()
            })
            .catch((err) => {
              setcancelOrDiscardFakeloader(false)
              // setcancelOrDiscardFakeloader(false)
            })
          stopeLoader()
        })
        .catch((err) => {
          setcancelOrDiscardFakeloader(false)
          // setcancelOrDiscardFakeloader(false)
          stopeLoader()
        })
    }
  }

  function add28Days(date) {
    let newDate = new Date(date)
    newDate.setDate(newDate.getDate() + 27)
    return newDate
  }

  function add42Days(date) {
    let newDate = new Date(date)
    newDate.setDate(newDate.getDate() + 41)
    return newDate
  }


  const handleMaxDateRenewalCalender = (endDate, currentDate) => {
    try {
      if (isPlanExpiredHandler()) {
        return add28Days(currentDate);
      }

      return add28Days(endDate)

    } catch (error) {
      console.log('Error at handleMaxDateRenewalCalender', error);
      return add28Days(currentDate);
    }
  }

  const getUserProfileHandler = () => {
    try {
      const { auth_token } = userDetails?.data

      dispatch(ProfileRequest({ token: auth_token }))
        .then(unwrapResult)
        .then((res) => {
          AppLogger("Response at ProfileRequest", res)
        })
        .catch((err) => {
          AppLogger("Error at ProfileRequest", err)
          if (err == "Error: Request failed with status code 401") {
            logOutRequest()
            router.push(AppRoutes.login)
          }
        })
    } catch (err) {
      AppLogger("Error at getUserProfileHandler", err)
    }
  }

  const cancelSubscriptionHandler = () => {
    try {
      const { auth_token } = userDetails?.data

      dispatch(cancelSubscriptionRequest({ token: auth_token }))
        .then(unwrapResult)
        .then((res) => {
          setShowCancelSubscriptionPopup(false)
          getUserProfileHandler()
        })
        .catch((err) => { })
    } catch (err) { }
  }
  const cancelSubscriptionHandlerWithHook = async () => {
    try {
      const { auth_token } = userDetails?.data
      setCancelSubIsLoading(true)
     await dispatch(CancelSubscriptionHook({ token: auth_token }))
        .then(unwrapResult)
        .then((res) => {
          setCancelSubIsLoading(false)
          setOpenhelp(true)
        })
        .catch((err) => { 
          setCancelSubIsLoading(false)
         })
    } catch (err) {
        setCancelSubIsLoading(false)
        showFaliureToast("Can't cancel subscription right now!");
    }
  }

  function disabledDateIndices(presentDays, absentDays) {
    const days = ["Sun", "Mon", "Tues", "Weds", "Thur", "Fri", "Sat"]
    const disable = []

    for (let index = 0; index < presentDays.length; index++) {
      const element = presentDays[index]
      const currentIndex = absentDays.findIndex((val) => val == element)
      if (currentIndex !== -1) {
      } else {
        disable.push(element)
      }
    }
    const disabledIndices = disable.map((day) => days.indexOf(day))
    // AppLogger("This is disabled indices=========", disabledIndices)
    return disabledIndices
  }

  const onPauseDatesSelect = (e) => { }


  const resetHandler = useCallback(() => {
    if (router.asPath == "/renewal") {
      if (resetPayloadLocal != {} && newDataLocal != {}) {
        const {
          meals_deliver_per_day: old_meals_deliver_per_day,
          meal_plan: old_mealPlan,
          snacks_deliver_per_day: old_snacks_deliver_per_day
        } = resetPayloadLocal


        const {
          meals_deliver_per_day: new_meals_deliver_per_day,
          meal_plan: new_mealPlan,
          snacks_deliver_per_day: new_snacks_deliver_per_day
        } = newDataLocal


        const mealPlanComparer = (arr1, arr2) => {
          if (arr1?.length > 0 && arr2?.length > 0) {
            for (let i = 0; i < arr1.length; i++) {
              if (arr1[i] !== arr2[i]) {
                // returns true when index item doesn't match
                return true
              }
            }
          }
        }

        if (
          // old_meal_plan_require_weeks !== new_meal_plan_require_weeks ||
          // old_meal_days_per_week !== new_meal_days_per_week ||
          old_meals_deliver_per_day !== new_meals_deliver_per_day ||
          old_snacks_deliver_per_day !== new_snacks_deliver_per_day ||
          old_mealPlan?.length !== new_mealPlan?.length ||
          mealPlanComparer(old_mealPlan, new_mealPlan)
        ) {
          return true
        } else {
          return false
        }
      }
    } else {
      const currentQuiz = get(userDetailsLocal, "guest.type", "")
      const recommendedCalorie = get(
        userDetailsLocal,
        "guest.recommended_calories_per_day",
        0
      )
      const currentCalorie = get(
        userDetailsLocal,
        "guest.practical_deliver_calories_per_day",
        0
      )
      const tickerPaymentTypee = get(tickerDataLocal, "payment_status", "")
      const paymentStatus = get(tickerDataLocal, "not_paid_type", "")
      if (currentQuiz && currentQuiz == "quiz_a") {
        if (recommendedCalorie > currentCalorie) {
          return true
        } else {
          if (tickerPaymentTypee == "unpaid" && paymentStatus == "full") {
            return true
          } else {
            return false
          }
        }
      } else {
        return false
      }
    }
  }, [userDetailsLocal, tickerDataLocal, newDataLocal])

  const originalDate = data

  const date = new Date(originalDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })

  const mealPlanSliderDisableHandler = () => {
    if (tickerPaymentType == "unpaid" && tickerType == "full") {
      return false
    } else {
      return true
    }
  }

  const isPaid = () => {
    if (paidPlan?.payment_status == "paid" && !Renewal || anyPaidPlan?.payment_status == "paid") {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    $(".slideWrap").on("touchstart", function () {
      $("body").addClass("touched")
    })

    $(".slideWrap").on("touchend", function () {
      $("body").removeClass("touched")
    })


  }, [])

  const createEndDate = () => {
    const planDuration = allUserPreferencesData.meal_plan_require_weeks * 7
    const startDate = moment(
      allUserPreferencesData.meal_plan_start_date,
      "YYYY/MM/DD"
    )
    startDate.add(planDuration, "days").format("YYYY/MM/DD")
    return startDate.format("YYYY/MM/DD")
  }

  const newMinDate = useMemo(() => {
    const currentDate = moment()
    const startDate = moment(
      allUserPreferencesData.meal_plan_start_date,
      "YYYY-MM-DD"
    )
    const ifStartDateAfterCurrentDate = startDate.isAfter(currentDate)
    if (ifStartDateAfterCurrentDate) {
      // return startDate.add(2, "days").format("YYYY-MM-DD")
      return startDate.format("YYYY-MM-DD")
    } else {
      // return currentDate.add(2, "days").format("YYYY-MM-DD")
      return currentDate.format("YYYY-MM-DD")
    }
  }, [allUserPreferencesData.meal_plan_start_date])

  const datePickerRef = useRef()
  const datePickerRef2 = useRef()
  const startDatePickerBox = useRef()

  const dateLabelFormmatter = (date) => {
    if (typeof date == "string") {
      const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
      if (dateTimeRegex.test(date)) {
        return moment(date).format(AppConstants.dateFormat)
      } else {
        return date
      }
    } else {
      return moment(date).format(AppConstants.dateFormat)
    }
  }

  function tabRoute() {
    localStorage.setItem("isRenewedPlan", JSON.stringify(true))
    router.push(AppRoutes.dashboard)
  }

  const [buttonState, setButtonState] = useState(false)
  useEffect(() => {
    if (router.asPath == "/view-renewal") {
      dateCall(allUserPreferencesData.meal_plan_start_date)
      setButtonState(true)
    }
  }, [allUserPreferencesData.meal_plan_start_date])

  const tabChangeCheck = () => {
    if (router.asPath == "/dashboard") {
      if (allUserPreferencesData.snacks_deliver_per_day > 0) {
        return true
      } else {
        return false
      }
    } else if (Renewal) {
      if (
        renewalDataLocal &&
        allUserPreferencesData.snacks_deliver_per_day > 0
      ) {
        return true
      } else {
        return false
      }
    }
  }

  const handlePauseDateThreshold = () => {
    const startMoment = moment(allUserPreferencesData?.meal_plan_start_date)

    if (thresholdDate) {
      if (startMoment.isSameOrAfter(thresholdDate)) {
        return startMoment.toDate()
      } else {
        return thresholdDate
      }
    }
  }

  window && (window.handleOpenAddressPopup = () => {
    return new Promise((resolve) => {
      resolve(setShowAddAddressPopup(true))
    })
  })
  const box1Ref = useRef(null);

  const scrollToBox = (boxRef) => {
    if (boxRef.current) {
      boxRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  window && (window.handleOpenDeliveryDaysPopup = () => {
    return new Promise((resolve) => {
      function DoThese() {
        scrollToBox(box1Ref);
        handleClickOpen(
          "days_food_delivery",
          allUserPreferencesData.days_food_delivery
        );
        document.body.style.overflow = 'visible'
      }
      if (window != 'undefined') {
        resolve(DoThese())
      }
    })
  })


  const alterFoodDays = (days) => {
    return days.map((day) => {
      if (day === "Tues") {
        return "Tue"
      } else if (day === "Weds") {
        return "Wed"
      } else if (day === "Thur") {
        return "Thu"
      } else {
        return day
      }
    })
  }

  function extendDate(selectedDays, endDate) {
    const selectedDaysSet = new Set(selectedDays)

    while (!selectedDaysSet.has(endDate.format("ddd"))) {
      endDate.add(1, "day")
    }

    return endDate.toDate()
  }

  const handleThreshold = () => {
    try {
      const originalPlanEndDate = moment(userEndDate)

      if (
        Renewal &&
        userEndDate &&
        allUserPreferencesData.days_food_delivery.length > 0
      ) {
        if (originalPlanEndDate.isSameOrAfter(moment(thresholdDate), "day")) {
          const nextValidDate = moment(userEndDate).add(1, "day")

          return extendDate(
            alterFoodDays(allUserPreferencesData.days_food_delivery),
            nextValidDate
          )
        } else {
          return thresholdDate
        }
      } else {
        return thresholdDate
      }
    } catch (error) {
      AppLogger("Error at handleThreshold", error)
      return thresholdDate
    }
  }

  function filterPauseDates(pauseDates, type = 'current') {
    const currentMonth = moment().month();
    const currentYear = moment().year();

    const acceptedFormats = [
      'YYYY-MM-DD',
      'MM/DD/YYYY',
      'MMMM DD, YYYY',
      'DD.MM.YYYY',
    ];

    const filteredDates = pauseDates.filter(date => {
      const parsedDate = moment(date, acceptedFormats, true);
      if (parsedDate.isValid()) {
        if (type === 'previous') {
          return (
            parsedDate.year() < currentYear ||
            (parsedDate.year() === currentYear && parsedDate.month() < currentMonth)
          );
        } else if (type === 'current') {
          return !(
            parsedDate.year() < currentYear ||
            (parsedDate.year() === currentYear && parsedDate.month() < currentMonth)
          );
        }
      }
      return false;
    });

    return filteredDates;
  }

  const handleAddAddress = () => {
    try {
      setShowAssignDelivery(false), setShowAddAddressPopup(true);
      if (typeof updateMode == 'object' && updateMode.hasOwnProperty("func")) {
        const { func } = updateMode;
        if (typeof func == 'function') {
          func();
        }
      }
    } catch (error) {
      console.log('Error at handleAddAddress', error);
    }
  }

  const currentDateForStartDate = moment().format(AppConstants.dateFormatDash)

  const handleScheduleAddress = (payload) => {
    setShowAssignDelivery(false);
    const transformedPayload = transformScheduleDeliveryPayload(payload);
    if (transformedPayload) {
      updateAddressWithDays(transformedPayload);
    }
  }


  const [showAll, setShowAll] = useState(false);

  // Toggling between showing all or just 5 dates
  const toggleShowAll = () => setShowAll((prev) => !prev);

  const displayedDates = showAll
    ? [...allUserPreferencesData?.meal_plan_pause_date]
    : matchesExSmallMobile
      ? [...allUserPreferencesData?.meal_plan_pause_date?.slice(0, 2)]  // Show 2 items on small mobile
      : matchesSmallMobile
        ? [...allUserPreferencesData?.meal_plan_pause_date?.slice(0, 3)]  // Show 2 items on small mobile
        : matchesMediumMobile
          ? [...allUserPreferencesData?.meal_plan_pause_date?.slice(0, 5)]  // Show 5 items on medium mobile (max-width 700px)
          : matchesMediumScreen
            ? [...allUserPreferencesData?.meal_plan_pause_date?.slice(0, 6)]  // Show 6 items on screens below 1032px
            : [...allUserPreferencesData?.meal_plan_pause_date?.slice(0, 9)];

  const isDisabledWRTStartDate =
    (router.asPath === "/dashboard" && mealPlanSliderDisableHandler()) ||
      (paymentCheck == "paid" && Renewal) ||
      (!Renewal && renewalDataLocal) ||
      (!allUserPreferencesData?.meal_plan_start_date && Renewal) ? 'none' : 'all';
  const isDisabledWRTStartDateCondition = isDisabledWRTStartDate == 'none' ? true : false;
  const MealBoxesDisabledCheck = paymentCheck == "paid" ||
    (!allUserPreferencesData?.meal_plan_start_date && Renewal) //NOTE - Start Date check here (may need to be changed)
    ? "none"
    : "all";
  const MealBoxesDisabledCheckCondition = MealBoxesDisabledCheck == 'none' ? true : false;
  const MealBoxConditionWithUndefined = MealBoxesDisabledCheckCondition && (Renewal != undefined ? Renewal : false);
  const [startDatePopBool, setStartDatePopBool] = useState(false)

  const [blink, setBlink] = useState(false);
  const scrollPosition = useRef({ x: 0, y: 0 });

  const setScrollPosition = (obj) => {
    scrollPosition.current = obj;
  }
  const handleScroll = () => {
    setScrollPosition({
      x: window.scrollX,
      y: window.scrollY,
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleBlink = () => {
    setBlink(true); // Add the blink class
    setTimeout(() => setBlink(false), 1500); // Remove the blink class after the animation
  };

  const conditionalWrapper = (condition, callback) => {
    return function (...args) {
      if (condition == true) {
        setStartDatePopBool(true)
        return
      } else {
        return callback(...args);
      }
    };
  }

  async function scrollToDiv(ref) {
    const scrollYposition = scrollPosition?.current?.y <= 10;
    if (ref?.current) {
      !scrollYposition && ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        !scrollYposition && scrollToTop();
      }, 300);
    } else {
      console.error('Ref is not attached to any element');
    }
  }



  // ------ START => from Mindate Opener of start date calender 
  // const [alreadyDateMonthChanged, setalreadyDateMonthChanged] = useState(false)
  // React.useEffect(() => {
  //   let currentDate = moment()
  //   let targetDate = moment(handleThreshold());
  //   let meal_plan_start_date = moment(allUserPreferencesData?.meal_plan_start_date);

  //   if (handleThreshold() && allUserPreferencesData?.days_food_delivery?.length > 0 && Renewal && !alreadyDateMonthChanged) {
  //     let startDateifAvail = allUserPreferencesData?.meal_plan_start_date == null ? currentDate : meal_plan_start_date;
  //     let diff = getMonthDifferenceExact(startDateifAvail, targetDate)

  //     setTimeout(() => {
  //       update('month', diff)
  //       setalreadyDateMonthChanged(true)
  //     }, 600);
  //   }
  // }, [renewalData, allUserPreferencesData?.days_food_delivery?.length])
  // // Function to go to the next month
  // function update(key, value) {
  //   if (datePickerRef.current) {
  //     let date = datePickerRef.current.date;
  //     datePickerRef.current.set(key, date[key] + value);
  //   }
  // }
  // function getMonthDifferenceExact(currentDate, targetDate) {
  //   // Parse dates using moment.js
  //   let current = moment(currentDate, "DD MMM YYYY")
  //   let target = moment(targetDate, "DD MMM YYYY")

  //   // Extract year and month components
  //   let currentYear = current.year()
  //   let currentMonth = current.month() // 0-indexed
  //   let targetYear = target.year()
  //   let targetMonth = target.month() // 0-indexed

  //   // Calculate the difference in years and months
  //   let yearDifference = targetYear - currentYear
  //   let monthDifference = targetMonth - currentMonth

  //   // Total months difference
  //   let totalMonthsDifference = yearDifference * 12 + monthDifference
  //   return totalMonthsDifference
  // }
  // ------ from Mindate Opener of start date calender START <= END

  useEffect(() => {
    if (typeof window !== "undefined") {
      const shouldScroll = localStorage.getItem("scrollToAllergy");
      if (shouldScroll === "true") {
        localStorage.removeItem("scrollToAllergy");
        setTimeout(() => {
          scroll.scrollTo(1100)
        }, 300);
      }
    }
  }, []);
  // Work for Paymob users
  const [SecretToken, setSecretToken] = useState(null);
  const [PaymobModal, setPaymobModal] = useState(null);
  const [showNewcustomerUpdateButton, setShowNewcustomerUpdateButton] = useState(false);

  const UsePaymobAllTime = process.env.NEXT_PUBLIC_USE_PAYMOB_ALL_TIME == 'true' || process.env.NEXT_PUBLIC_USE_PAYMOB_ALL_TIME == true ? true : false;
  const auth_token = get(userDetails, 'data.auth_token', null);
  // const conditionForPaymob = (userProfile?.profile?.is_beta == 1) && (process.env.NEXT_PUBLIC_USE_PAYMOB == 'true' || process.env.NEXT_PUBLIC_USE_PAYMOB == true) ? true : false; // comenting fo rsitriple only
  const conditionForPaymob = (UsePaymobAllTime || ((userProfile?.profile?.is_beta == 1) && (process.env.NEXT_PUBLIC_USE_PAYMOB == 'true' || process.env.NEXT_PUBLIC_USE_PAYMOB == true))) ? true : false; // comenting fo rsitriple only
  const FirstUnPaidOrder = ((orderHistory?.length == 1 && orderHistory?.[0]?.payment_status == AppConstants.unpaid)) && (process.env.NEXT_PUBLIC_PAYMOB_FOR_FIRST_TIME_USER == 'true' || process.env.NEXT_PUBLIC_PAYMOB_FOR_FIRST_TIME_USER == true) ? true : false; // comenting for striple only

  const getIntention = async () => {
    try {
      // Removing cache
      //  const cacheKey = `clientSecret_${userDetails?.data?.user_id}`;
      //  const cachedData = getCache(cacheKey);
      //  if (cachedData) {
      //    setSecretToken(cachedData)
      //    setShowAddCardPopup(false);
      //    setPaymobModal(true)
      //    AppLogger("Serving from cache", cachedData);
      //    return cachedData;
      //  }
      await dispatch(createIntentionFunc({ accessToken: auth_token, address_id: defaultAddress.id }))
        .then(unwrapResult)
        .then((resp) => {
          setPaymobModal(true)
          setShowAddCardPopup(false);
          setSecretToken(resp?.data?.data?.client_secret)
          return resp?.data?.data?.client_secret
        }).catch((err) => { console.log("err", err) })
    } catch (error) {
      console.log("error", error)
    }
  }
  const [currentTypeOfSlider, setCurrentTypeOfSlider] = useState([]);
  const setTypeOfSlider = (type) => {
    setCurrentTypeOfSlider((prev) => {
      const updated = Array.isArray(prev) ? [...prev] : [];
      if (!updated.includes(type)) {
        updated.push(type);
      }
      return updated;
    });
  }

  // const displayCardWithPaymobCondition = (!conditionForPaymob && defaultCard) && !(FirstUnPaidOrder);
  // const displayCard =  defaultCard;
  // const displayCard =displayCardWithPaymobCondition?null:  defaultCard;
  const cardFromListNotPaymob = cardsDataLocal?.card?.find((card) => card?.stripe_card_id != null);
  let displayCard = null;

  if (conditionForPaymob) {
    const PaymobCard = cardsDataLocal?.default_card?.paymob_card_id ? cardsDataLocal?.default_card : null;
    displayCard = PaymobCard;
  } else if (FirstUnPaidOrder && defaultCard == null) {
    displayCard = null;
  } else if (FirstUnPaidOrder && defaultCard) {
    displayCard = defaultCard;
  } else if (!FirstUnPaidOrder && !conditionForPaymob && defaultCard) {
    displayCard = defaultCard?.paymob_card_id ? cardFromListNotPaymob : defaultCard;
  }

  const onClickUpdateButtonForUnpaidUser = async () => {
    // const allMeals = [...allUserPreferencesData.meal_plan]
    // onSliderChangeHandler(allMeals, "meal_plan");
    // updatePreferencesHandler()
    // Order Discount early return
    // if (currentTypeOfSlider.some((type) => type?.startsWith('meal_plan') ? isOrderDiscountApplied(type?.slice(-1)) : isOrderDiscountApplied(type))) {
    //   const discountWarning = await verifyOrderDiscount();
    //   if (true) return updateDiscountWarningData(key, { previousValue: allUserPreferencesData[key], currentValue: value });
    // }
    console.log("all data befre save",allUserPreferencesData)
    await updateEditPreferenceSliderHandler("newCustomer").then(() => {
      fakeLoading()
    })
  }
  const resetTypesNButtonState = () => {
    setCurrentTypeOfSlider([]);
    setShowNewcustomerUpdateButton(false);
  }
  const setTabChangeFunctionTriggerAndUnpaidChangeButton = (type) => {
    setattachFunctionAgain(Math.random())
    setShowNewcustomerUpdateButton(true);
    dispatch(setpaidSliderEPTriggered(true));// this disptach will detect when tab change
    //  handleFinalMealPlanUpdate()
    //  setChangesPending({
    //     isChanges: true,
    //     onConfirm:async () => 
    //       {
    //       await onClickUpdateButtonForUnpaidUser()
    //       // resetTypesNButtonState()
    //     },
    //     onCancel: () => onClickCancelButtonUnpaid(false)
    //   })
  }
  const disableSlider = renewalView || (!Renewal && (renewalView || paymentCheck == "paid" || mealPlanSliderDisableHandler() || !Renewal && renewalDataLocal) || isDisabledWRTStartDateCondition && Renewal)
  const [openReactivateHelp, setOpenReactivateHelp] = useState(false);

  useEffect(() => {
    return () => {
      resetTypesNButtonState()
      dispatch(setpaidSliderEPTriggered(false))
      setOpenReactivateHelp(false)
      dispatch(setsaveTabChangesButtonHit(false))
      setIsloadingUpdateRequest(false)

    }
  }, []);

  const MealPlanPreferenceOptions = AppConstants.EditPreference.MealPlanPreferenceOptions
  const PersonalPreferenceOptions = AppConstants.EditPreference.PersonalPreferenceOptions;
  const handlePlanPreferenceOnClicks = (type) => {
    if (showNewcustomerUpdateButton && !Renewal) {
      onClickCancelButtonUnpaid(false)
    } else {
      if (!showNewcustomerUpdateButton && isPriceConfirmation) {
        !Renewal && onClickCancelButton(false)
      }
    }
    if (type === MealPlanPreferenceOptions.startDate) {
      datePickerRef.current.openCalendar();
    } else if (type === MealPlanPreferenceOptions.pauseDate) {
      // Add logic if needed
    } else if (type === MealPlanPreferenceOptions.nextRenewalDate) {
      // Add logic if needed
    } else if (type === MealPlanPreferenceOptions.Vegetarian) {
      conditionalWrapper(
        MealBoxConditionWithUndefined,
        () => {
          setRenewalKey("vegeterian");
          handleClickOpen(
            "vegeterian",
            allUserPreferencesData.vegeterian
          );
        }
      )()
    } else if (type === MealPlanPreferenceOptions.allergy) {
      conditionalWrapper(
        MealBoxConditionWithUndefined, () => {
          setRenewalKey("allergy");
          handleClickOpen("allergy", allUserPreferencesData.allergy);
        }
      )();
    } else if (type === MealPlanPreferenceOptions.dislike) {
      conditionalWrapper(
        MealBoxConditionWithUndefined, () => {
          setRenewalKey("food_dislikes");
          handleClickOpen(
            "food_dislikes",
            allUserPreferencesData.food_dislikes
          );
        }
      )();
    } else if (type === MealPlanPreferenceOptions.breakfast) {
      conditionalWrapper(
        MealBoxConditionWithUndefined,
        () => {
          setRenewalKey("exclude_breakfast");
          handleClickOpen(
            "exclude_breakfast",
            allUserPreferencesData.exclude_breakfast
          );
        }
      )();
    } else if (type === MealPlanPreferenceOptions.deliveryDays) {
      conditionalWrapper(
        MealBoxConditionWithUndefined,
        () => {
          setRenewalKey("days_food_delivery");
          handleClickOpen(
            "days_food_delivery",
            allUserPreferencesData.days_food_delivery
          );
        }
      )();
    } else if (type === MealPlanPreferenceOptions.cutlery) {
      conditionalWrapper(
        MealBoxConditionWithUndefined,
        () => {
          setRenewalKey("culinary_check");
          handleClickOpen(
            "culinary_check",
            allUserPreferencesData.culinary_check
          );
        }
      )();
    } else if (type === MealPlanPreferenceOptions.deliveryPartener) {
      conditionalWrapper(
        MealBoxConditionWithUndefined,
        () => {
          setRenewalKey("notification");
          handleClickOpen(
            "notification",
            allUserPreferencesData.notification
          );
        }
      )();
    }
  };
  const handlePersonalPreferenceOnClicks = (type) => {
    if (showNewcustomerUpdateButton && !Renewal) {
      onClickCancelButtonUnpaid(false)
    } else {
      if (!showNewcustomerUpdateButton && isPriceConfirmation) {
        !Renewal && onClickCancelButton(false)
      }
    }
    switch (type) {
      case PersonalPreferenceOptions.birthday:
        datePickerRef.current.openCalendar()
        break;
      case PersonalPreferenceOptions.wallet:
        setShowWalletPop(true)
        break;
      case PersonalPreferenceOptions.phone:
        handleClickPhoneOpen(
          "phone",
          allUserPreferencesData.phone
        )
        break;
      case PersonalPreferenceOptions.credit:
        setShowAddCardPopup(true)
        break;
      case PersonalPreferenceOptions.deliveryAddress:
        setShowAddAddressPopup(true)
        break;
      case PersonalPreferenceOptions.password:
        handlePassopen()
        break;

      default:
        break;
    }

  }

  const isPreferencesChanged = useDetectPreferenceChanges({ ...allUserPreferencesData, meal_plan: localMealPlanChanges }, userProfile);
  // onfly for meal plasn
  const onMealPlanChangeLocalHandlerNewPlan = (newplan) => {
    try {
      console.log("onMealPlanChangeLocalHandlerNewPlan", newplan)
      setLocalMealPlanChanges(newplan);
      // setAllUserPreferencesData({...allUserPreferencesData, meal_plan: newplan});
    } catch (error) {
      console.log("Error at handleUpdate", error);
    }

  }
  const onMealPlanChangeLocalHandler = (value, currentType, index) => {
    try {
      dispatch(setpaidSliderEPTriggered(true));// this disptach will detect when tab change
      const isPaidCheck = isPaidAndNotThreshold();
      if(index == null){
        setLocalMealPlanChanges(prevMeals => {
          return [...value];
        });
      }else{
        setLocalMealPlanChanges(prevMeals => {
          const newMeals = [...prevMeals];
          newMeals[index] = value;
          return newMeals;
        });
      }
      setattachFunctionAgain(Math.random())
      if (isPaidCheck && !Renewal) {
        setIsPriceConfirmation(true);
      } else {
        setTabChangeFunctionTriggerAndUnpaidChangeButton(true)
        // setTimeout(() => {
        //   allUserPreferencesData['meal_plan'] = localMealPlanChanges;
        //   setAllUserPreferencesData({...allUserPreferencesData})
        // }, 300);
        // setTimeout(() => {
        // }, 500);
      }
    } catch (error) {
      console.log("Error at handleUpdate", error);
    }

  }
  useEffect(() => {
    if (typeof setChangesPending == 'function') {
      if (UnPaidOrderAndActive && paidSliderEPTriggered && isPreferencesChanged) {
        setChangesPending({
          isChanges: true,
          onConfirm: async () => onClickUpdateButtonForUnpaidUser(),
          onCancel: async () => onClickCancelButtonUnpaid(false)
        })
      }
    }
  }, [attachFunctionAgain, UnPaidOrderAndActive, paidSliderEPTriggered, isPreferencesChanged])
  useEffect(() => {
    if (typeof setChangesPending == 'function') {
      if (!UnPaidOrderAndActive) {
        setChangesPending({
          isChanges: isPreferencesChanged && isPriceConfirmation,
          onConfirm: async () => onClickUpdateButton(),
          onCancel: async () => onClickCancelButton(false)
        })
      }
    }
  }, [isPriceConfirmation, isPreferencesChanged, attachFunctionAgain, UnPaidOrderAndActive])
  const { decorationQuizData } = useSelector((state) => state.homepage);
  const showOnEp = Renewal ?decorationQuizData?.showRenewalEditPrefDecoration:  decorationQuizData?.showEditPrefDecoration;
  return (
    <div style={{marginTop:'16px'}}>
      {children}
      {/* {isLoadingProfile && <Loader2 />}{" "} */}
      {Renewal && !renewalView ? (
        <div className="startDate-Custom"
          ref={startDatePickerBox}
        >
          <div className="container container--custom">
            <div className="calenderWrap">
              <div className="content">
                <Typography variant={"h2"} className={styles.heading}>
                  Let’s Renew Your Meal Plan
                </Typography>
                <Typography variant={"body3"} component={"p"}>
                  We’re really pleased you want to renew with PractiCal. Below
                  is a reminder of your Preferences. You can change these &
                  adjust the price.
                </Typography>
                <Typography variant={"body3"} component={"p"}>
                  To renew, first pick your start date from the calendar , then
                  review & confirm your preferences.
                </Typography>
              </div>
              <div
                className={`calender-sec ${isExecutive ? "isExecutive" : ""}
                  ${blink ? 'blink' : ''
                  }
                  `}

              >
                <Calendar
                  disabled={startDateDisableHandler() || renewalView}
                  ref={datePickerRef}
                  maxDate={handleMaxDateRenewalCalender(userEndDate, currentDateForStartDate)}
                  className="calender"
                  value={moment(
                    allUserPreferencesData.meal_plan_start_date
                  ).format(AppConstants.dateFormat)}
                  mapDays={({ date }) => {
                    let isWeekend = disabledDateIndices(
                      deliveryDays,
                      allUserPreferencesData.days_food_delivery
                    ).includes(date.weekDay.index)

                    if (
                      isWeekend ||
                      disabledDates.includes(
                        date.format(AppConstants.dateFormat)
                      )
                    )
                      return {
                        disabled: true,
                        style: { color: "#ccc" }
                        // onClick: () => alert("weekends ")
                      }
                  }}
                  format={AppConstants.dateFormat}
                  minDate={handleThreshold()}
                  calendarPosition="bottom-right"
                  onChange={(e) => {
                    setStartDate(e.format(AppConstants.dateFormat))
                    handleFormChangeData(
                      e.format("YYYY/MM/DD"),
                      "meal_plan_start_date"
                    )
                  }}
                />
                <div className="startDate">
                  <Typography variant={"h2"} color={isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen}>
                    Start Date
                  </Typography>
                  {allUserPreferencesData.meal_plan_start_date ? (
                    <Typography variant={"body3"} component={"p"}>
                      {moment(
                        allUserPreferencesData.meal_plan_start_date
                      ).format(AppConstants.dateFormat)}
                    </Typography>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {errorString && (
        <Typography
          style={{ color: AppColors.lightRed }}
        >{`${errorString}`}</Typography>
      )}
      <div className="container container--custom" style={{padding:'0px 0px'}}>
        <div className={styles.editBoxWrapper}>
          {resetHandler() && (
            <div
              onClick={onResetHandlerNew}
              className={styles.reset}
              style={{ pointerEvents: renewalView ? "none" : "all" }}
            >
              <Reset />
              <Typography
                sx={{
                  fontWeight: "600",
                  color: AppColors.primaryGreen
                }}
              >
                Reset
              </Typography>
            </div>
          )}
          {errorString2 == true ? (
            <Typography
              variant="body1"
              sx={{ color: AppColors.red, paddingLeft: "20px" }}
            >
              Your meal plan is about to end can't apply top-up.
            </Typography>
          ) : null}

          {
            cancelOrDiscardFakeloader ?

              <div
                className={`${styles.boxWrapper} ${isExecutive ? styles.isExecutive : ""}`}
                style={{
                  backgroundColor: 'white',
                  minHeight: "400px",
                  ...dfac,

                }}
              >
                <ThemeLoader zIndex={1} />
              </div>
              :
              showOnEp ?
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: "center",
                    alignItems: 'stretch',
                    flexDirection: { md: 'row', xs: 'column' },
                    gap: '25px',
                    mb: '17px',
                    mt:'16px'
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      border: `1px solid #d1ebe4`,
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: "center",
                      borderRadius:'12px'
                    }}
                  >
                    <LeftBoxPreference
                      weekBoxOnClick={
                        () => {
                          if (planExpired) {
                            setOpenReactivateHelp(true)
                            return
                          }
                          if (renewalView) {
                            setOpenhelp(true)
                            return
                          } else {
                            if (!Renewal && (renewalView || paymentCheck == "paid" || mealPlanSliderDisableHandler() ||
                              !Renewal && renewalDataLocal
                            )) {
                              setOpenhelp(true)
                              return
                            }
                          }
                          if (isDisabledWRTStartDateCondition && Renewal) setStartDatePopBool(true)
                        }
                      }
                      daysBoxOnClick={
                        () => {
                          if (planExpired) {
                            setOpenReactivateHelp(true)
                            return
                          }
                          if (renewalView) {
                            setOpenhelp(true)
                            return
                          } else {
                            if (!Renewal && (renewalView || paymentCheck == "paid" || mealPlanSliderDisableHandler() ||
                              !Renewal && renewalDataLocal
                            )) {
                              setOpenhelp(true)
                              return
                            }
                          }
                          if (isDisabledWRTStartDateCondition && Renewal && !renewalView) setStartDatePopBool(true)
                        }
                      }
                      mealsBoxOnClick={() => {
                        if (planExpired) {
                          setOpenReactivateHelp(true)
                          return
                        }
                        if (renewalView) {
                          setOpenhelp(true)
                          return
                        }
                        if (isDisabledWRTStartDateCondition && Renewal) setStartDatePopBool(true)
                      }}
                      weeksDisabler={disableSlider || planExpired || isloadingUpdateRequest || userProfileLoader}
                      daysDisabler={disableSlider || planExpired || isLoading || isloadingUpdateRequest || userProfileLoader || isExecutive}
                      mealsDisabler={renewalView || isDisabledWRTStartDateCondition && Renewal || planExpired}
                      isLoading={userProfileLoader || pricingApisetIsLoading || isloadingUpdateRequest}
                      currentTypeOfSlider={currentTypeOfSlider}
                      setCurrentTypeOfSlider={setCurrentTypeOfSlider}
                      isPaid={isPaid()}
                      onChangeWeek={
                        conditionalWrapper(isDisabledWRTStartDateCondition && Renewal,
                          (value, type) => {
                            console.log("UnPaidOrderAndActive inside slifer", UnPaidOrderAndActive)
                            if (UnPaidOrderAndActive && !Renewal) {
                              console.log("here in unpaid if ")
                              setTabChangeFunctionTriggerAndUnpaidChangeButton(true)
                              onSliderChangeHandler(value, type)
                              return
                            }
                            onSliderChangeHandler(value, type)
                          },
                          () => {

                          }
                        )
                      }
                      onChangeDays={conditionalWrapper(isDisabledWRTStartDateCondition && Renewal, onSliderChangeHandler)}
                      onChangeMeals={
                        conditionalWrapper(
                          isDisabledWRTStartDateCondition && Renewal,
                          (value, type) => handleUpdate(type, value, () => onSliderChangeHandler(value, type))
                        )
                      }
                      initialDataFromPropObj={
                        allUserPreferencesData.meals_deliver_per_day
                          && allUserPreferencesData.meal_days_per_week
                          && allUserPreferencesData.meal_plan_require_weeks
                          ? {
                            meals_deliver_per_day: allUserPreferencesData.meals_deliver_per_day,
                            meal_days_per_week: allUserPreferencesData.meal_days_per_week,
                            meal_plan_require_weeks: allUserPreferencesData.meal_plan_require_weeks,
                          } : null}
                    />


                  </div>
                  {/* <div className={clsx(styles.boxGridWrapper, styles.sty2)}  */}
                  <div
                    style={{
                      width: '100%',
                      border: `1px solid #d1ebe4`,
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: "center",
                      borderRadius:'12px'
                    }}
                  >
                    <div>
                      <RightBoxPreference
                        caloriBoxOnClick={
                          () => {
                            if (planExpired) {
                              setOpenReactivateHelp(true)
                              return
                            }
                            if (renewalView) {
                              setOpenhelp(true)
                              return
                            }
                            if (MealBoxConditionWithUndefined) { setStartDatePopBool(true) }
                          }
                        }
                        snackBoxOnClick={
                          () => {
                            if (planExpired) {
                              setOpenReactivateHelp(true)
                              return
                            }
                            if (renewalView) {
                              setOpenhelp(true)
                              return
                            }
                            if (MealBoxConditionWithUndefined) setStartDatePopBool(true)
                          }
                        }
                        caloriDisabler={renewalView || MealBoxConditionWithUndefined || planExpired || isloadingUpdateRequest || userProfileLoader}
                        snackDisabler={renewalView || MealBoxConditionWithUndefined || planExpired || isloadingUpdateRequest || userProfileLoader || userProfileLoader}
                        isLoading={userProfileLoader || pricingApisetIsLoading}
                        currentTypeOfSlider={currentTypeOfSlider}
                        setCurrentTypeOfSlider={setCurrentTypeOfSlider}
                        isPaid={isPaid()}
                        onChangeCalorie={onMealPlanChangeLocalHandler}
                        onChangeCalorieOnlyPlanWhenMealsChanges={onMealPlanChangeLocalHandlerNewPlan}
                        onChangeSnack={conditionalWrapper(MealBoxConditionWithUndefined, (value, type) => handleUpdate(type, value, () => onSliderChangeHandler(value, type)))}
                        initialDataFromPropObj={
                          allUserPreferencesData.meals_deliver_per_day
                            && allUserPreferencesData.meal_days_per_week
                            && allUserPreferencesData.meal_plan_require_weeks
                            && Array.isArray(allUserPreferencesData.meal_plan)
                            && allUserPreferencesData.snacks_deliver_per_day >=0
                            ? {
                              meals_deliver_per_day: allUserPreferencesData.meals_deliver_per_day,
                              meal_days_per_week: allUserPreferencesData.meal_days_per_week,
                              meal_plan_require_weeks: allUserPreferencesData.meal_plan_require_weeks,
                              meal_plan: allUserPreferencesData.meal_plan,
                              snacks_deliver_per_day: allUserPreferencesData.snacks_deliver_per_day,
                            } : null}
                      />
                      {tabChangeCheck() ? (
                        <Typography
                          sx={{
                            fontSize: "12px",
                            padding: "0 15px",
                            textAlign: "center",
                            pointerEvents: "all",
                            flex: "0 0 100%",
                            maxWidth: "100%"
                          }}
                        >
                          <Link
                            onClick={() => {
                              Renewal ? tabRoute() : handleClick()
                            }}
                            sx={{ display: "inline", cursor: "pointer" }}
                          >
                            Click here
                          </Link>{" "}
                          to select your snack
                        </Typography>
                      ) : null}
                    </div>
                  </div>
                </Box>
                :
                <div className={`${styles.boxWrapper} ${isExecutive ? styles.isExecutive : ""}`}>
                  <div className={styles.boxGridWrapper} >
                    <div

                      className={styles.boxGrid}>
                      <div className="slideWrap" >

                        <div
                          className={styles.sliderBox}
                          onClick={() => {
                            if (planExpired) {
                              setOpenReactivateHelp(true)
                              return
                            }
                            if (renewalView) {
                              setOpenhelp(true)
                              return
                            } else {
                              if (!Renewal && (renewalView || paymentCheck == "paid" || mealPlanSliderDisableHandler() ||
                                !Renewal && renewalDataLocal
                              )) {
                                setOpenhelp(true)
                                return
                              }
                            }
                            if (isDisabledWRTStartDateCondition && Renewal) setStartDatePopBool(true)
                          }}
                        >
                          {
                            typeof allUserPreferencesData.meal_plan_require_weeks === "number" &&
                            !isNull(allUserPreferencesData.meal_plan_require_weeks) &&
                            <PreferencesSlider
                              disableOnchange={disableSlider || planExpired || isloadingUpdateRequest || userProfileLoader}
                              isLoading={userProfileLoader || pricingApisetIsLoading}
                              currentTypeOfSlider={currentTypeOfSlider}
                              setCurrentTypeOfSlider={setCurrentTypeOfSlider}
                              isPaid={isPaid()}
                              currentType={"meal_plan_require_weeks"}
                              sliderChange={conditionalWrapper(isDisabledWRTStartDateCondition && Renewal,
                                // (value, type) => handleUpdate(type, value, () => onSliderChangeHandler(value, type)
                                (value, type) => {
                                  console.log("UnPaidOrderAndActive inside slifer", UnPaidOrderAndActive)
                                  if (UnPaidOrderAndActive && !Renewal) {
                                    console.log("here in unpaid if ")
                                    setTabChangeFunctionTriggerAndUnpaidChangeButton(true)
                                    // allUserPreferencesData['meal_plan_require_weeks'] = value;
                                    // setAllUserPreferencesData({ ...allUserPreferencesData });
                                    onSliderChangeHandler(value, type)
                                    return
                                  }
                                  onSliderChangeHandler(value, type)
                                },
                                () => {

                                }
                              )}
                              // sliderChange={onSliderChangeHandler}
                              currentData={
                                allUserPreferencesData.meal_plan_require_weeks
                              }
                              type="week"
                            />
                          }
                        </div>

                      </div>
                      <Typography
                        sx={{ fontWeight: "500" }}
                        variant={"body3"}
                        component={"p"}
                        className={clsx(styles.para, styles.sty2)}
                      >
                        {ReactHtmlParser("Length of Meal Plan <br/> (Weeks)")}
                      </Typography>
                    </div>
                    <div

                      className={styles.boxGrid}>
                      <div className="slideWrap">

                        <div
                          className={styles.sliderBox}
                          onClick={() => {
                            if (planExpired) {
                              setOpenReactivateHelp(true)
                              return
                            }
                            if (renewalView) {
                              setOpenhelp(true)
                              return
                            } else {
                              if (!Renewal && (renewalView || paymentCheck == "paid" || mealPlanSliderDisableHandler() ||
                                !Renewal && renewalDataLocal
                              )) {
                                setOpenhelp(true)
                                return
                              }
                            }
                            if (isDisabledWRTStartDateCondition && Renewal && !renewalView) setStartDatePopBool(true)
                          }}
                        >
                          {
                            typeof allUserPreferencesData.meal_days_per_week === "number" &&
                            !isNull(allUserPreferencesData.meal_days_per_week) &&
                            <PreferencesSlider
                              disableOnchange={disableSlider || planExpired || isLoading || isloadingUpdateRequest || userProfileLoader}
                              isLoading={userProfileLoader || pricingApisetIsLoading}
                              currentTypeOfSlider={currentTypeOfSlider}
                              setCurrentTypeOfSlider={setCurrentTypeOfSlider}

                              isPaid={isPaid()}
                              currentType={"meal_days_per_week"}
                              // sliderChange={onSliderChangeHandler}
                              sliderChange={conditionalWrapper(isDisabledWRTStartDateCondition && Renewal, onSliderChangeHandler)}
                              currentData={allUserPreferencesData.meal_days_per_week}
                              // currentData={updateDeliveryDaysPerWeek}
                              type="days"
                            />
                          }
                        </div>

                      </div>
                      <Typography
                        sx={{ fontWeight: "500" }}
                        variant={"body3"}
                        component={"p"}
                        className={clsx(styles.para, styles.sty2)}
                      >
                        {"Delivery days per week"}
                      </Typography>
                    </div>
                    <div
                      onClick={() => {
                        if (planExpired) {
                          setOpenReactivateHelp(true)
                          return
                        }
                        if (renewalView) {
                          setOpenhelp(true)
                          return
                        }
                        if (isDisabledWRTStartDateCondition && Renewal) setStartDatePopBool(true)
                      }}
                      className={styles.boxGrid}>
                      <div className="slideWrap">

                        <div className={styles.sliderBox}
                        >
                          {
                            typeof allUserPreferencesData.meals_deliver_per_day === "number" &&
                            !isNull(allUserPreferencesData.meals_deliver_per_day) &&
                            <PreferencesSlider
                              disableOnchange={renewalView || isDisabledWRTStartDateCondition && Renewal || planExpired || userProfileLoader}
                              isLoading={userProfileLoader || pricingApisetIsLoading || isloadingUpdateRequest}
                              currentTypeOfSlider={currentTypeOfSlider}
                              setCurrentTypeOfSlider={setCurrentTypeOfSlider}

                              isPaid={isPaid()}
                              currentType={"meals_deliver_per_day"}
                              // sliderChange={
                              //   (value, type) => handleUpdate(type, value, () => onSliderChangeHandler(value, type))
                              // }
                              sliderChange={
                                conditionalWrapper(
                                  isDisabledWRTStartDateCondition && Renewal,
                                  (value, type) => handleUpdate(type, value, () => onSliderChangeHandler(value, type))
                                )
                              }
                              currentData={allUserPreferencesData.meals_deliver_per_day}
                              type="meals"
                              startDate={allUserPreferencesData.meal_plan_start_date}
                            />
                          }
                        </div>

                      </div>
                      <Typography
                        sx={{ fontWeight: "500" }}
                        variant={"body3"}
                        component={"p"}
                        className={clsx(styles.para, styles.sty2)}
                      >
                        {"No of Meals per day"}
                      </Typography>
                    </div>
                  </div>
                  <div className={clsx(styles.boxGridWrapper, styles.sty2)} >
                    {allUserPreferencesData.meal_plan.length > 0 &&
                      allUserPreferencesData.meal_plan.map((meal, index) => (
                        <div key={index}
                          onClick={() => {
                            if (planExpired) {
                              setOpenReactivateHelp(true)
                              return
                            }
                            if (renewalView) {
                              setOpenhelp(true)
                              return
                            }
                            if (MealBoxConditionWithUndefined) { setStartDatePopBool(true) }
                          }}
                          className={styles.boxGrid}
                        >
                          <Typography
                            sx={{ fontWeight: "500", paddingBottom: "15px" }}
                            variant={"body3"}
                            component={"p"}
                            className={styles.para}
                          >
                            {`Meal ${index + 1}`}
                          </Typography>

                          <div className={styles.sliderBox}
                          // style={
                          //   MealBoxesDisabledCheck && {
                          //     ...DisabledStyles
                          //   }}
                          >
                            {
                              meal &&
                              <PreferencesSlider
                                key={index}
                                disableOnchange={renewalView || MealBoxConditionWithUndefined || planExpired || isloadingUpdateRequest || userProfileLoader}
                                isLoading={userProfileLoader || pricingApisetIsLoading}
                                currentTypeOfSlider={currentTypeOfSlider}
                                setCurrentTypeOfSlider={setCurrentTypeOfSlider}
                                index={index}
                                isPaid={isPaid()}
                                currentType={"meal_plan"}
                                // sliderChange={(e) => onMealPlanChangeHandler(e, index)}
                                // sliderChange={conditionalWrapper(MealBoxConditionWithUndefined, (e) => {
                                //   onMealPlanChangeHandler(e, index)
                                // })}
                                sliderChange={onMealPlanChangeLocalHandler}
                                currentData={meal}
                                type="meal"
                              />
                            }
                          </div>

                          <Typography
                            sx={{ fontWeight: "500" }}
                            variant={"body3"}
                            component={"p"}
                            className={styles.para}
                          >
                            {`Calorie Meal`}
                          </Typography>
                        </div>
                      ))}
                    <div
                      onClick={() => {
                        if (planExpired) {
                          setOpenReactivateHelp(true)
                          return
                        }
                        if (renewalView) {
                          setOpenhelp(true)
                          return
                        }
                        if (MealBoxConditionWithUndefined) setStartDatePopBool(true)
                      }}
                      className={styles.boxGrid}
                    >
                      <Typography
                        sx={{ fontWeight: "500", paddingBottom: "15px" }}
                        variant={"body3"}
                        component={"p"}
                        className={styles.para}
                      >
                        {"Snacks / Sides"}
                      </Typography>
                      <div className="slideWrap">

                        <div className={clsx(styles.sliderBox, styles.sty2)}
                        // style={
                        //   MealBoxesDisabledCheck && {
                        //     ...DisabledStyles
                        //   }}
                        >
                          {
                            typeof allUserPreferencesData.snacks_deliver_per_day === "number" &&
                            !isNull(allUserPreferencesData.snacks_deliver_per_day) &&
                            <PreferencesSlider
                              disableOnchange={renewalView || MealBoxConditionWithUndefined || planExpired || isloadingUpdateRequest || userProfileLoader}
                              isLoading={userProfileLoader || pricingApisetIsLoading}
                              currentTypeOfSlider={currentTypeOfSlider}
                              setCurrentTypeOfSlider={setCurrentTypeOfSlider}

                              isPaid={isPaid()}
                              currentType={"snacks_deliver_per_day"}
                              sliderChange={conditionalWrapper(MealBoxConditionWithUndefined, (value, type) => handleUpdate(type, value, () => onSliderChangeHandler(value, type)))}
                              currentData={
                                allUserPreferencesData.snacks_deliver_per_day
                              }
                              type={"snack"}
                            />
                          }
                        </div>

                      </div>

                      <Typography
                        sx={{ fontWeight: "500" }}
                        variant={"body3"}
                        component={"p"}
                        className={styles.para}
                      >
                        {"200 Calorie Snacks"}
                      </Typography>
                    </div>
                    {tabChangeCheck() ? (
                      <Typography
                        sx={{
                          fontSize: "12px",
                          padding: "0 15px",
                          textAlign: "center",
                          pointerEvents: "all",
                          flex: "0 0 100%",
                          maxWidth: "100%"
                        }}
                      >
                        <Link
                          onClick={() => {
                            Renewal ? tabRoute() : handleClick()
                          }}
                          sx={{ display: "inline", cursor: "pointer" }}
                        >
                          Click here
                        </Link>{" "}
                        to select your snack
                      </Typography>
                    ) : null}
                  </div>
                </div>

          }
          {
            (showNewcustomerUpdateButton && !Renewal) && isPreferencesChanged ?
              <Box className={'StickyButtonBox'}>
                <Button
                  sx={{ minWidth: '220px !important' }}
                  onClick={onClickUpdateButtonForUnpaidUser}
                  variant="contained"
                  className="save"
                  disabled={isLoadingProfile}
                >
                  Update
                </Button>
                <Button
                  onClick={() => onClickCancelButtonUnpaid(false)}
                  variant="contained"
                  disabled={isLoadingProfile}
                  className="save"
                >
                  Cancel
                </Button>
              </Box>
              : null
          }
          {
            (!showNewcustomerUpdateButton && isPriceConfirmation) && isPreferencesChanged ?
              <Box className={'StickyButtonBox'}>

                {/* <div className={`${Renewal ? "" : "renew"} button`} */}
                <Button
                  onClick={onClickUpdateButton}
                  variant="contained"
                  className="save"
                  disabled={isLoadingProfile}
                >
                  Update
                </Button>
                <Button
                  onClick={() => onClickCancelButton(false)}
                  variant="contained"
                  className="save"
                  disabled={isLoadingProfile}
                >
                  Cancel
                </Button>
              </Box>
              : null
          }
          <>
            {buttonState ? null : (
              <>
                {" "}
                {renewalView && paymentCheck == "paid" ? (
                  <div
                    className="button"

                  // style={{ pointerEvents: paymentCheck == "paid" ? "none" : "all" }}
                  >
                    <Button
                      href={AppRoutes.dashboard}
                      variant="outlined"
                      className="sub"
                    >
                      Back To My Personal Portal
                    </Button>
                  </div>
                ) : (
                  <>
                    {Renewal ? (
                      <div
                        className={`${Renewal ? "" : "renew"} button`}
                      >
                        <Button
                          disabled={apiLoading}
                          onClick={() => onSavePressHandler()}
                          variant="outlined"
                          className="save"
                        >
                          Save
                        </Button>
                        <Button
                          disabled={apiLoading}
                          onClick={() => onSavePressHandler("dash")}
                          variant="outlined"
                          className="save"
                        >
                          Confirm & Pay
                        </Button>
                      </div>
                    ) : (
                      userSubscriptionStatus == 1 && (
                        <div
                          className={`${Renewal ? "" : "renew"} button`}
                        >
                          <Button
                            // onClick={() => setShowCancelSubscriptionPopup(true)}
                            disabled={CancelSubIsLoading}
                            onClick={cancelSubscriptionHandlerWithHook}
                            variant="outlined"
                            className="sub"
                          >
                            Cancel Subscription
                          </Button>
                        </div>
                      )
                    )}
                  </>
                )}
              </>
            )}
          </>

          <div className={`${styles.editMoreOptions} ${isExecutive ? styles.isExecutive : ''}`}>
            <div
              className={!isOptionsExpanded ? "open-option" : "close-option"}
              onClick={addClass}
            >
              <div className={styles.moreOptionsBar}>
                <div className={styles.textWrapperstyles}>
                  <Typography
                    variant={"body3"}
                    component={"p"}
                    className={styles.para}
                    sx={{ fontWeight: "500", color: AppColors.white }}
                  >
                    {"Meal Plan Preferences"}
                  </Typography>
                  <ArrowDown />
                </div>
              </div>
            </div>
            <div
              className={isOptionsExpanded ? "option expanded" : "option"}
            // style={
            //   MealBoxesDisabledCheck && {
            //     ...DisabledStyles
            //   }}
            >
              {renewalView ? null : !Renewal ? (
                <div
                  //  className={`optionWrapper sty3 ${isExecutive ? "isExecutive" : ""} ${
                  className={`optionWrapper sty3 ${isExecutive ? "isExecutive" : ""} ${isLoading && currentTypeOfSlider?.includes('startDate') ? "loadingOpt" : ""
                    }`}
                  style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                  onClick={() => {
                    setTypeOfSlider("startDate");
                  }}
                >
                  <div className="optionBox">
                    <Typography
                      variant={"body3"}
                      component={"p"}
                      className={styles.para}
                      sx={{ fontWeight: "500", color: isExecutive ? "" : AppColors.primaryGreen }}
                    >
                      {"Start Date"}
                    </Typography>

                    <div className="dateselector"
                      onClick={() => {
                        if (startDateDisableHandler() || renewalView) {
                          setOpenhelp(true)
                        } else {
                          if (!startDateDisableHandler()) {
                            datePickerRef.current.openCalendar()
                          }
                        }
                      }}
                      style={{
                        zIndex: 2
                      }}
                    >
                      <Box
                        className="calenderBtn"
                        onClick={() => {
                          handlePlanPreferenceOnClicks(MealPlanPreferenceOptions.startDate)
                          datePickerRef.current.openCalendar()
                        }}
                      >
                        <Calender />
                      </Box>
                      <DatePicker
                        disabled={startDateDisableHandler()}
                        ref={datePickerRef}
                        maxDate={add28Days(thresholdDate)}
                        className="calender"
                        value={moment(
                          allUserPreferencesData.meal_plan_start_date
                        ).format(AppConstants.dateFormat)}
                        mapDays={({ date }) => {
                          let isWeekend = disabledDateIndices(
                            deliveryDays,
                            allUserPreferencesData.days_food_delivery
                          ).includes(date.weekDay.index)

                          if (
                            isWeekend ||
                            disabledDates.includes(
                              date.format(AppConstants.dateFormat)
                            )
                          )
                            return {
                              disabled: true,
                              style: { color: "#ccc" }
                              // onClick: () => alert("weekends ")
                            }
                        }}
                        format={AppConstants.dateFormat}
                        minDate={thresholdDate}
                        calendarPosition="bottom-right"
                        onChange={(e) => {
                          setStartDate(e.format(AppConstants.dateFormat))
                          handleFormChangeData(
                            e.format("YYYY/MM/DD"),
                            "meal_plan_start_date"
                          )
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {/* <DisabledComponentWrapper
                isDisabled={MealBoxesDisabledCheck == 'none'?true:false}
                tooltipMessage={"Disbaled because you didn't select start date"}
                opacity={"0.7"}
                right={true}
              > */}
              <div
                //  className={`optionWrapper sty2 ${isExecutive ? "isExecutive" : ""} ${
                className={`optionWrapper sty2 ${isExecutive ? "isExecutive" : ""} ${isLoading && currentTypeOfSlider?.includes('pauseDate') ? "loadingOpt" : ""
                  }`}
                style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                onClick={() => {
                  setTypeOfSlider("pauseDate");
                }}
              >
                <div className="optionBox"
                  style={{ display: 'flex', alignItems: 'center', }}
                >
                  {/* Pause99 */}
                  <div
                    style={{ display: 'flex', alignItems: 'end', gap: '10px' }}
                  >

                    <Typography
                      variant={"body3"}
                      component={"p"}
                      sx={{
                        fontWeight: "500", color: AppColors.primaryGreen,

                      }}
                    >
                      {"Pause Dates"}
                    </Typography>

                  </div>
                  <div className="dateselectorMulti">
                    {/* {!Renewal && ( */}
                    <DatePicker
                      ref={datePickerRef2}
                      mapDays={({ date }) => {
                        let isWeekend = disabledDateIndices(
                          deliveryDays,
                          allUserPreferencesData.days_food_delivery
                        ).includes(date.weekDay.index)

                        if (
                          isWeekend ||
                          disabledDates.includes(
                            date.format(AppConstants.dateFormat)
                          )
                        )
                          return {
                            disabled: true,
                            style: { color: "#ccc" }
                            // onClick: () => alert("weekends ")
                          }
                      }}
                      minDate={handlePauseDateThreshold()}
                      onChange={(e) => pauseDateLocalHandler(e)}
                      multiple
                      value={
                        router.asPath == "/dashboard" && !Renewal
                          ? filterPauseDates(allUserPreferencesData.meal_plan_pause_date, "current")
                          : mealPlanPauseDateLocal
                      }
                      maxDate={
                        allUserPreferencesData.meal_plan_end_date
                          ? allUserPreferencesData.meal_plan_end_date
                          : ""
                      }
                      sort
                      form
                      format={AppConstants.dateFormat}
                      calendarPosition="bottom-center"
                    >
                      <Button
                        className="SaveBTN"
                        variant="contained"
                        style={{ margin: "5px" }}
                        onClick={onSaveDatePressHandler}
                      >
                        Save
                      </Button>
                    </DatePicker>
                    <div
                      onClick={() => {
                        handlePlanPreferenceOnClicks(MealPlanPreferenceOptions.pauseDate)
                        if (renewalView) {
                          setOpenhelp(true)
                          return
                        }
                      }}
                      style={{
                        zIndex: 2
                      }}
                    >
                      <CalendarsDateRangePicker
                        isExecutive={isExecutive}
                        toggleShowAll={toggleShowAll}
                        showAll={showAll}
                        condition={
                          matchesExSmallMobile ?
                            allUserPreferencesData?.meal_plan_pause_date?.length > 2 :
                            matchesSmallMobile ?
                              allUserPreferencesData?.meal_plan_pause_date?.length > 3 :
                              matchesMediumMobile ?
                                allUserPreferencesData?.meal_plan_pause_date?.length > 5 :
                                matchesMediumScreen ?
                                  allUserPreferencesData?.meal_plan_pause_date?.length > 6 :
                                  allUserPreferencesData?.meal_plan_pause_date?.length > 9
                        }
                        valuePropFromOldPicker={
                          router.asPath == "/dashboard" && !Renewal
                            ? filterPauseDates(allUserPreferencesData.meal_plan_pause_date, "current")
                            : mealPlanPauseDateLocal
                        }
                        minDate={handlePauseDateThreshold()}
                        maxDate={
                          allUserPreferencesData.meal_plan_end_date
                            ? allUserPreferencesData.meal_plan_end_date
                            : ""
                        }
                        disablePicker={
                          (Renewal && startDate == '' ? true : false) || userProfileLoader
                        }
                        format={AppConstants.dateFormat}
                        disabledDates={disabledDates}
                        days_food_delivery={allUserPreferencesData.days_food_delivery}
                        deliveryDays={deliveryDays}
                        setMealPlanPauseDateLocal={setMealPlanPauseDateLocal}
                        handleFormChangeData={handleFormChangeData}
                        onChangeHanlder={pauseDateLocalHandler}
                        onSaveDatePressHandler={onSaveDatePressHandler}
                        sx={{
                          padding: '20px 0px'
                        }}
                      />
                    </div>

                  </div>
                </div>

                <ul className="chips"
                // style={{display:'flex',alignItems:'center',justifyContent:'end',cursor:'pointer',flexWrap:'wrap'}}
                >

                  {displayedDates?.map(
                    (date, index) => (
                      <>
                        <Chip
                          // onClick={() => deletePauseDateHandler(index)}
                          sx={{
                            borderColor: AppColors.primaryGreen,
                            color: AppColors.black,
                            marginLeft: "10px",
                            marginBottom: "5px",
                            fontWeight: "500",
                            minWidth: '90px'
                          }}
                          // onClick={() => deletePauseDateHandler(index)}
                          key={index}
                          label={`${dateLabelFormmatter(date)}`}
                          variant="outlined"
                        ></Chip>

                      </>
                    )
                  )}

                </ul>
              </div>

              <div
                //  className={`optionWrapper sty2 ${isExecutive ? "isExecutive" : ""} 
                className={`optionWrapper sty2 ${isExecutive ? "isExecutive" : ""} ${isLoading && currentTypeOfSlider?.includes('renewalDate') ? "loadingOpt" : ""
                  }`}
                style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                onClick={() => {
                  setTypeOfSlider("renewalDate");
                }}
              >
                <div className="optionBox">
                  <Typography
                    variant={"body3"}
                    component={"p"}
                    className={styles.para}
                    sx={{ fontWeight: "500", color: AppColors.primaryGreen }}
                  >
                    {"Next Renewal Date"}
                  </Typography>
                  {allUserPreferencesData?.meal_plan_end_date && (
                    <Typography
                      variant={"body3"}
                      component={"p"}
                      className={styles.para}
                      sx={{ fontWeight: "500", color: AppColors.black }}
                    >
                      {moment(allUserPreferencesData.meal_plan_end_date).format(
                        AppConstants.dateFormat
                      )}
                    </Typography>
                  )}
                </div>
              </div>

              <div
                // className={`optionWrapper  ${isExecutive ? "isExecutive" : ""}`}
                className={`optionWrapper sty3 ${isExecutive ? "isExecutive" : ""} ${isLoading && currentTypeOfSlider?.includes('vegetarian') ? "loadingOpt" : ""
                  }`}
                style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                onClick={() => {
                  setTypeOfSlider("vegetarian");
                }}
              >
                <div className="optionBox">
                  <Typography
                    variant={"body3"}
                    component={"p"}
                    className={styles.para}
                    sx={{ fontWeight: "500", color: AppColors.primaryGreen }}
                  >
                    {"Are you Vegetarian?"}
                  </Typography>
                  <div className="vegData">
                    <Typography
                      variant={"body3"}
                      component={"p"}
                      className={styles.para}
                      sx={{ fontWeight: "500", color: AppColors.black }}
                    >
                      {allUserPreferencesData.vegeterian}
                    </Typography>
                    {renewalView ? null : (
                      <Button
                        variant="outlined"
                        onClick={
                          () => handlePlanPreferenceOnClicks(MealPlanPreferenceOptions.Vegetarian)

                        }
                        sx={{
                          minWidth: "17px",
                          height: "17px",
                          padding: "0",
                          disableRipple: true,
                          background: AppColors.transparent,
                          color: AppColors.white,
                          borderColor: AppColors.transparent
                        }}
                      >
                        <Edit />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div
                className={`optionWrapper sty3 ${isExecutive ? "isExecutive" : ""} ${isLoading && currentTypeOfSlider?.includes('Allergies') ? "loadingOpt" : ""
                  }`}
                style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                onClick={() => {
                  setTypeOfSlider("Allergies");
                }}>
                <div className="optionBox">
                  <Typography
                    variant={"body3"}
                    component={"p"}
                    className={styles.para}
                    sx={{ fontWeight: "500", color: AppColors.primaryGreen }}
                  >
                    {"Allergies"}
                  </Typography>
                  {renewalView ? null : (
                    <Button
                      variant="outlined"
                      onClick={
                        () => handlePlanPreferenceOnClicks(MealPlanPreferenceOptions.allergy)
                      }
                      sx={{
                        minWidth: "17px",
                        height: "17px",
                        padding: "0",
                        disableRipple: true,
                        background: AppColors.transparent,
                        color: AppColors.white,
                        borderColor: AppColors.transparent
                      }}
                    >
                      <Edit />
                    </Button>
                  )}
                </div>
                <div className="selection">
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ justifyContent: "flex-end" }}
                  >
                    {allUserPreferencesData.allergy.map((allerg, index) => (
                      <Chip
                        key={index}
                        label={allerg}
                        sx={{
                          fontWeight: "500",
                          fontSize: "15px",
                          borderColor: AppColors.primaryGreen
                        }}
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </div>
              </div>
              <div
                // className={`optionWrapper  ${isExecutive ? "isExecutive" : ""}`}
                className={`optionWrapper  ${isExecutive ? "isExecutive" : ""} ${isLoading && currentTypeOfSlider?.includes('Dislikes') ? "loadingOpt" : ""
                  }`}
                style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                onClick={() => {
                  setTypeOfSlider("Dislikes");
                }}
              >
                <div className="optionBox">
                  <Typography
                    variant={"body3"}
                    component={"p"}
                    className={styles.para}
                    sx={{ fontWeight: "500", color: AppColors.primaryGreen }}
                  >
                    {"Dislikes"}
                  </Typography>
                  {renewalView ? null : (
                    <Button
                      variant="outlined"
                      onClick={
                        () => handlePlanPreferenceOnClicks(MealPlanPreferenceOptions.dislike)

                      }
                      sx={{
                        minWidth: "17px",
                        height: "17px",
                        padding: "0",
                        disableRipple: true,
                        background: AppColors.transparent,
                        color: AppColors.white,
                        borderColor: AppColors.transparent
                      }}
                    >
                      <Edit />
                    </Button>
                  )}
                </div>
                <div className="selection">
                  <DislikesBox
                    isExecutive={isExecutive}
                    dislikesData={startUpLocal?.food_ingredients}
                    allDislikes={allUserPreferencesData.food_dislikes}
                  />
                </div>
              </div>
              <div
                ref={box1Ref}
                // className={`optionWrapper  ${isExecutive ? "isExecutive" : ""}`}
                className={`optionWrapper  ${isExecutive ? "isExecutive" : ""} ${isLoading && currentTypeOfSlider?.includes('breakfast') ? "loadingOpt" : ""
                  }`}
                style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                onClick={() => {
                  setTypeOfSlider("breakfast");
                }}
              >
                <div className="optionBox">
                  <Typography
                    variant={"body3"}
                    component={"p"}
                    className={styles.para}
                    sx={{ fontWeight: "500", color: AppColors.primaryGreen }}
                  >
                    {
                      "Do you want to exclude breakfast items?"
                    }
                  </Typography>
                  <div className="vegData">
                    <Typography
                      variant={"body3"}
                      component={"p"}
                      className={styles.para}
                      sx={{ fontWeight: "500", color: AppColors.black }}
                    >
                      {allUserPreferencesData.exclude_breakfast === 1 ? "Yes" : "No"}
                    </Typography>
                    {renewalView ? null : (
                      <Button
                        variant="outlined"
                        onClick={
                          () => handlePlanPreferenceOnClicks(MealPlanPreferenceOptions.breakfast)


                        }
                        sx={{
                          minWidth: "17px",
                          height: "17px",
                          padding: "0",
                          disableRipple: true,
                          background: AppColors.transparent,
                          color: AppColors.white,
                          borderColor: AppColors.transparent
                        }}
                      >
                        <Edit />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              {/* <DisabledComponentWrapper
                isDisabled={MealBoxesDisabledCheck == 'none'?true:false}
                tooltipMessage={"Disbaled because you didn't select start date"}
                right={true}
                opacity={"0.7"}
              > */}
              <div
                className={`optionWrapper  ${isExecutive ? "isExecutive" : ""} ${isLoading && currentTypeOfSlider?.includes('DeliveryDays') ? "loadingOpt" : ""
                  }`}
                style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                onClick={() => {
                  setTypeOfSlider("DeliveryDays");
                }}
              // className={`optionWrapper  ${isExecutive ? "isExecutive" : ""}`}
              >
                <div className="optionBox"

                >
                  <Typography
                    variant={"body3"}
                    component={"p"}
                    className={styles.para}
                    sx={{ fontWeight: "500", color: AppColors.primaryGreen }}
                  >
                    {"Delivery Days"}
                  </Typography>
                  {renewalView ? null : !isExecutive && (
                    <div onClick={() => {
                      if ((router.asPath == "/dashboard" &&
                        mealPlanSliderDisableHandler()) ||
                        (!Renewal && renewalDataLocal) ||
                        (paymentCheck == "paid" && Renewal)
                      ) {
                        setOpenhelp(true)
                        return
                      }
                    }}>

                      <Button
                        variant="outlined"
                        disabled={
                          (router.asPath == "/dashboard" &&
                            mealPlanSliderDisableHandler()) ||
                          (!Renewal && renewalDataLocal) ||
                          (paymentCheck == "paid" && Renewal)
                        }
                        onClick={
                          () => handlePlanPreferenceOnClicks(MealPlanPreferenceOptions.deliveryDays)



                        }
                        sx={{
                          minWidth: "17px",
                          height: "17px",
                          padding: "0",
                          disableRipple: true,
                          background: AppColors.transparent,
                          color: AppColors.white,
                          borderColor: AppColors.transparent
                        }}
                      >
                        <Edit />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="selection">
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ justifyContent: "flex-end" }}
                  >
                    {allUserPreferencesData?.days_food_delivery?.map(
                      (Day, index) => (
                        <Chip
                          key={index}
                          label={Day}
                          sx={{
                            fontWeight: "500",
                            fontSize: "15px",
                            borderColor: AppColors.primaryGreen
                          }}
                          variant="outlined"
                        />
                      )
                    )}
                  </Stack>
                </div>
              </div>

              <div
                className={`optionWrapper  ${isExecutive ? "isExecutive" : ""} ${isLoading && currentTypeOfSlider?.includes('cutlery') ? "loadingOpt" : ""
                  }`}
                style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                onClick={() => {
                  setTypeOfSlider("cutlery");
                }}
              // className={`optionWrapper  ${isExecutive ? "isExecutive" : ""}`}
              >
                <div className="optionBox">
                  <Typography
                    variant={"body3"}
                    component={"p"}
                    className={styles.para}
                    sx={{ fontWeight: "500", color: AppColors.primaryGreen }}
                  >
                    {"Do you want us to deliver cutlery with your food?"}
                  </Typography>
                  <div className="vegData">
                    <Typography
                      variant={"body3"}
                      component={"p"}
                      className={styles.para}
                      sx={{ fontWeight: "500", color: AppColors.black }}
                    >
                      {allUserPreferencesData.culinary_check === 1
                        ? "Yes"
                        : "No"}
                    </Typography>
                    {renewalView ? null : (
                      <Button
                        variant="outlined"
                        onClick={
                          () => handlePlanPreferenceOnClicks(MealPlanPreferenceOptions.cutlery)

                        }
                        sx={{
                          minWidth: "17px",
                          height: "17px",
                          padding: "0",
                          disableRipple: true,
                          background: AppColors.transparent,
                          color: AppColors.white,
                          borderColor: AppColors.transparent
                        }}
                      >
                        <Edit />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              {!isExecutive && <div
                className={`optionWrapper  ${isExecutive ? "isExecutive" : ""} ${isLoading && currentTypeOfSlider?.includes('deliveryPartner') ? "loadingOpt" : ""
                  }`}
                style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                onClick={() => {
                  setTypeOfSlider("deliveryPartner");
                }}
              // className={`optionWrapper  ${isExecutive ? "isExecutive" : ""}`}
              >
                <div className="optionBox">
                  <Typography
                    variant={"body3"}
                    component={"p"}
                    className={styles.para}
                    sx={{ fontWeight: "500", color: AppColors.primaryGreen }}
                  >
                    {
                      "Do you want our delivery partners to let you know each time your food is on its way?"
                    }
                  </Typography>
                  <div className="vegData">
                    <Typography
                      variant={"body3"}
                      component={"p"}
                      className={styles.para}
                      sx={{ fontWeight: "500", color: AppColors.black }}
                    >
                      {allUserPreferencesData.notification === 1 ? "Yes" : "No"}
                    </Typography>
                    {renewalView ? null : (
                      <Button
                        variant="outlined"
                        onClick={
                          () => handlePlanPreferenceOnClicks(MealPlanPreferenceOptions.deliveryPartener)
                        }
                        sx={{
                          minWidth: "17px",
                          height: "17px",
                          padding: "0",
                          disableRipple: true,
                          background: AppColors.transparent,
                          color: AppColors.white,
                          borderColor: AppColors.transparent
                        }}
                      >
                        <Edit />
                      </Button>
                    )}
                  </div>
                </div>
              </div>}
            </div>
          </div>
          <>
            {!buttonState ? null : !btnDisable ? (
              <>
                {" "}
                {renewalView && paymentCheck == "paid" ? (
                  <div
                    className="button"
                  // style={{ pointerEvents: paymentCheck == "paid" ? "none" : "all" }}
                  >
                    <Button
                      href={AppRoutes.dashboard}
                      variant="outlined"
                      className="sub"
                    >
                      Back To My Personal Portal
                    </Button>
                  </div>
                ) : (
                  <div
                    className={`${Renewal ? "" : "renew"} button`}
                  // style={{ pointerEvents: paymentCheck == "paid" ? "none" : "all" }}
                  >
                    {Renewal ? (
                      <>
                        <Button
                          disabled={true || apiLoading}
                          onClick={() => onSavePressHandler()}
                          variant="outlined"
                          className="save"
                        >
                          Save
                        </Button>
                        <Button
                          disabled={apiLoading}
                          onClick={() => onSavePressHandler("dash")}
                          variant="outlined"
                          className="save"
                        >
                          Confirm & Pay
                        </Button>
                      </>
                    ) : (
                      userSubscriptionStatus == 1 && (
                        <Button
                          // onClick={() => setShowCancelSubscriptionPopup(true)}
                          disabled={CancelSubIsLoading}
                          onClick={cancelSubscriptionHandlerWithHook}
                          variant="outlined"
                          className="sub"
                        >
                          Cancel Subscription
                        </Button>
                      )
                    )}
                  </div>
                )}
              </>
            ) : null}
          </>
          {!Renewal && (
            <div className={clsx(styles.editMoreOptions, styles.sty1)}>
              <div
                className={!isOptionsExpanded2 ? "open-option" : "close-option"}
                onClick={addClass2}
              >
                <div className={styles.moreOptionsBar}>
                  <div className={styles.textWrapperstyles}>
                    <Typography
                      variant={"body3"}
                      component={"p"}
                      className={styles.para}
                      sx={{ fontWeight: "500", color: AppColors.white }}
                    >
                      {"Personal Details"}
                    </Typography>
                    <ArrowDown />
                  </div>
                </div>
              </div>
              <div
                className={
                  isOptionsExpanded2 ? "option expanded sty2" : "option"
                }
                style={{
                  // pointerEvents: paymentCheck == "paid" ? "none" : "all"
                }}
              >
                <div
                  className={`optionWrapper sty3 ${isExecutive ? "isExecutive" : ""} ${isLoading && currentTypeOfSlider?.includes('birthday') ? "loadingOpt" : ""
                    }`}
                  style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                  onClick={() => {
                    setTypeOfSlider("birthday");
                    handlePersonalPreferenceOnClicks(PersonalPreferenceOptions.birthday)
                  }}
                // className={`optionWrapper sty3 ${isExecutive ? "isExecutive" : ""}`}
                >
                  <div className="optionBox">
                    <div style={{ display: 'flex', alignItems: "center", gap: '10px' }}>
                      <Typography
                        variant={"body3"}
                        component={"p"}
                        className={styles.para}
                        sx={{ fontWeight: "500", color: AppColors.primaryGreen }}
                      >
                        {"Birthday"}
                      </Typography>
                      <TimerTooltip
                        positionBoxOnMobile={'translateX(-35%)'}
                        matchesSmallTabletPosition={'translateX(-35%)'}
                        matchesSmallMobilePosition={'translateX(-35%)'}
                        title={"We love celebrating our customers! Share your birth date (month and day) to receive a birthday surprise from us."}>
                        i
                      </TimerTooltip>
                    </div>

                    <div className="dateselector">

                      <CalendarsDateRangePicker
                        isExecutive={isExecutive}
                        showYear={false}
                        singlePicker={true}
                        DayMonthPickerOnly={true}
                        toggleShowAll={toggleShowAll}
                        showAll={showAll}
                        condition={false}
                        valuePropFromOldPicker={
                          allUserPreferencesData.dob
                        }
                        justRunOnChangeOnSave={true}
                        format={AppConstants.dateFormat}
                        days_food_delivery={AppConstants.allDeliveryDays}
                        deliveryDays={AppConstants.allDeliveryDays}
                        handleFormChangeData={handleFormChangeData}
                        onChangeHanlder={pauseDateLocalHandler}
                        onSaveDatePressHandler={(date) => {
                          const dateFromatted = moment(date).format('DD/MM/YYYY')
                          const [day, month, year] = dateFromatted.split("/");
                          handleFormChangeData(`${day}/${month}/2004`, "dob")
                        }}
                        lockMinDateyear={true}
                        sx={{
                          padding: '20px 0px'
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={`optionWrapper sty3 ${isExecutive ? "isExecutive" : ""} ${isLoading && currentTypeOfSlider?.includes('Wallet') ? "loadingOpt" : ""
                    }`}
                  style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                  onClick={() => {
                    setTypeOfSlider("Wallet");
                  }}
                // className={`optionWrapper sty3 ${isExecutive ? "isExecutive" : ""}`}
                >
                  <div className="optionBox">
                    <Typography
                      variant={"body3"}
                      component={"p"}
                      className={styles.para}
                      sx={{ fontWeight: "500", color: AppColors.primaryGreen }}
                    >
                      {"Wallet Amount"}
                    </Typography>

                    <div className="vegData">
                      <Typography
                        variant={"body3"}
                        component={"p"}
                        className={styles.para}
                        sx={{ fontWeight: "500", color: AppColors.black }}
                      >
                        {userWalletAmount.toFixed(2)} AED
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          handlePersonalPreferenceOnClicks(PersonalPreferenceOptions.wallet)
                        }}
                        sx={{
                          minWidth: "17px",
                          height: "17px",
                          padding: "0",
                          disableRipple: true,
                          background: AppColors.transparent,
                          color: AppColors.white,
                          borderColor: AppColors.transparent
                        }}
                      >
                        <Edit />
                      </Button>
                    </div>
                  </div>
                </div>
                <div
                  className={`optionWrapper  ${isExecutive ? "isExecutive" : ""} ${isLoading && currentTypeOfSlider?.includes('Phone') ? "loadingOpt" : ""
                    }`}
                  style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                  onClick={() => {
                    setTypeOfSlider("Phone");
                  }}
                // className={`optionWrapper ${isExecutive ? "isExecutive" : ""}`}
                >
                  <div className="optionBox">
                    <Typography
                      variant={"body3"}
                      component={"p"}
                      className={styles.para}
                      sx={{ fontWeight: "500", color: AppColors.primaryGreen }}
                    >
                      {"Phone Number"}
                    </Typography>
                    <div className="vegData">
                      <Typography
                        variant={"body3"}
                        component={"p"}
                        className={styles.para}
                        sx={{ fontWeight: "500", color: AppColors.black }}
                      >
                        {allUserPreferencesData.phone}
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          handlePersonalPreferenceOnClicks(PersonalPreferenceOptions.phone)

                        }}
                        sx={{
                          minWidth: "17px",
                          height: "17px",
                          padding: "0",
                          disableRipple: true,
                          background: AppColors.transparent,
                          color: AppColors.white,
                          borderColor: AppColors.transparent
                        }}
                      >
                        <Edit />
                      </Button>
                    </div>
                  </div>
                </div>
                <div
                  className={`optionWrapper  ${isExecutive ? "isExecutive" : ""} ${isLoading && currentTypeOfSlider?.includes('Cards') ? "loadingOpt" : ""
                    }`}
                  style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                  onClick={() => {
                    setTypeOfSlider("Cards");
                  }}
                // className={`optionWrapper ${isExecutive ? "isExecutive" : ""}`}
                >
                  <div className="optionBox">
                    <Typography
                      variant={"body3"}
                      component={"p"}
                      className={styles.para}
                      sx={{ fontWeight: "500", color: AppColors.primaryGreen }}
                    >
                      {"Credit /Debit Cards"}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        // if( conditionForPaymob || FirstUnPaidOrder ){
                        //   if(defaultAddress?.id == '' || defaultAddress?.id == null ){
                        //     showFaliureToast("Please add your address first.")
                        //     return
                        //   }else{
                        //     getIntention().then((res)=>{
                        //       if(SecretToken || res){
                        //         setShowAddCardPopup(true)
                        //       }
                        //       return
                        //   }).catch(err=>{
                        //     console.log("err",err) 
                        //     return
                        //   })
                        //   }
                        // }else{
                        //   setShowAddCardPopup(true)
                        // }
                        handlePersonalPreferenceOnClicks(PersonalPreferenceOptions.credit)

                      }}
                      sx={{
                        minWidth: "17px",
                        height: "17px",
                        padding: "0",
                        disableRipple: true,
                        background: AppColors.transparent,
                        color: AppColors.white,
                        borderColor: AppColors.transparent
                      }}
                    >
                      <Edit />
                    </Button>
                  </div>
                  <div className="selection sty2">
                    {displayCard && (
                      <div className="CardDetailWrap">
                        {displayCard?.brand === "Visa" ? (
                          <div className="cardImage">
                            <img src={AppDataConstant.visaIcon} alt="visa" />
                          </div>
                        ) : displayCard?.brand === "MasterCard" ? (
                          <div className="cardImage">
                            <img
                              src={AppDataConstant.masterCard}
                              alt="mastercard"
                            />
                          </div>
                        ) : null}
                        <div className="cardInfo">
                          <Typography
                            variant={"body3"}
                            component={"p"}
                            className={styles.para}
                            sx={{
                              textAlign: "right",
                              color: AppColors.black,
                              maxWidth: "83%",
                              marginLeft: "auto"
                            }}
                          >
                            {`${displayCard?.card_number?.slice(
                              9,
                              displayCard?.card_number?.length
                            )}`}
                            { }
                          </Typography>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={`optionWrapper  ${isExecutive ? "isExecutive" : ""} ${isLoading && currentTypeOfSlider?.includes('Address') ? "loadingOpt" : ""
                    }`}
                  style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                  onClick={() => {
                    setTypeOfSlider("Address");
                  }}
                // className={`optionWrapper ${isExecutive ? "isExecutive" : ""}`}
                >
                  <div className="optionBox">
                    <Typography
                      variant={"body3"}
                      component={"p"}
                      className={styles.para}
                      sx={{ fontWeight: "500", color: AppColors.primaryGreen }}
                    >
                      {"Delivery Address & Time"}
                    </Typography>
                    <Button
                      className={`${isExecutive ? styles.isExecutiveAbcd : ""}`}
                      variant="outlined"
                      onClick={() => {
                        handlePersonalPreferenceOnClicks(PersonalPreferenceOptions.deliveryAddress)
                      }}
                      sx={{
                        minWidth: "17px",
                        height: "17px",
                        padding: "0",
                        disableRipple: true,
                        background: AppColors.transparent,
                        color: AppColors.white,
                        borderColor: AppColors.transparent
                      }}
                    >
                      <Edit />
                    </Button>
                  </div>
                  {defaultAddress?.emirate?.name ? (
                    <div className="selection sty2 flex">
                      <Typography
                        variant={"body3"}
                        component={"p"}
                        className={styles.para}
                        sx={{
                          fontWeight: "500",
                          textAlign: "right",
                          color: AppColors.black,
                          maxWidth: "83%",
                          marginLeft: "auto"
                        }}
                      >
                        {defaultAddress?.emirate?.name}&nbsp;{" "}
                      </Typography>
                      <Typography
                        variant={"body3"}
                        component={"p"}
                        className={styles.para}
                        sx={{
                          fontWeight: "500",
                          textAlign: "right",
                          color: AppColors.black,
                          maxWidth: "83%",
                          marginLeft: "auto"
                        }}
                      >
                        {defaultAddress?.area?.name ? "," : ""}&nbsp;{" "}
                        {defaultAddress?.area?.name}
                      </Typography>
                    </div>
                  ) : null}
                </div>

                {/* Hiding from PE/PS 17.10.2024 */}

                {!Renewal && currentUserType == "normal" && (
                  <div
                    className={`optionWrapper  ${isExecutive ? "isExecutive" : ""} ${isLoading && currentTypeOfSlider?.includes('Password') ? "loadingOpt" : ""
                      }`}
                    style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                    onClick={() => {
                      setTypeOfSlider("Password");
                    }}
                  // className={`optionWrapper ${isExecutive ? "isExecutive" : ""}`}
                  >
                    <div className="optionBox">
                      <Typography
                        variant={"body3"}
                        component={"p"}
                        className={styles.para}
                        sx={{
                          fontWeight: "500",
                          color: AppColors.primaryGreen
                        }}
                      >
                        {"Password"}
                      </Typography>
                      <div className="vegData">
                        <Typography
                          variant={"body3"}
                          component={"p"}
                          className={styles.para}
                          sx={{ fontWeight: "500", color: AppColors.black }}
                        >
                          *******
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            handlePersonalPreferenceOnClicks(PersonalPreferenceOptions.password)
                          }}
                          sx={{
                            minWidth: "17px",
                            height: "17px",
                            padding: "0",
                            disableRipple: true,
                            background: AppColors.transparent,
                            color: AppColors.white,
                            borderColor: AppColors.transparent
                          }}
                        >
                          <Edit />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {renewalView && paymentCheck == "paid" ? (
            <div
              className="button"
            // style={{ pointerEvents: paymentCheck == "paid" ? "none" : "all" }}
            >
              <Button href={AppRoutes.dashboard} variant="outlined" className="sub">
                Back To My Personal Portal
              </Button>
            </div>
          ) : (
            <div
              className={`button ${isExecutive ? "isExecutive " : ""}`}
            // style={{ pointerEvents: paymentCheck == "paid" ? "none" : "all" }}
            >
              {Renewal ? (
                <>
                  <Button
                    disabled={apiLoading}
                    onClick={() => onSavePressHandler()}
                    variant="outlined"
                    className="save"
                  >
                    Save
                  </Button>
                  <Button
                    disabled={apiLoading}
                    onClick={() => onSavePressHandler("dash")}
                    variant="outlined"
                    className="save"
                  >
                    Confirm & Pay
                  </Button>
                </>
              ) : (
                userSubscriptionStatus == 1 && (
                  <Button
                    // onClick={() => setShowCancelSubscriptionPopup(true)}
                    disabled={CancelSubIsLoading}
                    onClick={cancelSubscriptionHandlerWithHook}
                    variant="outlined"
                    className="sub"
                  >
                    Cancel Subscription
                  </Button>
                )
              )}
            </div>
          )}

        </div>
      </div>

      {/* All Modals */}
      {
        openReactivateHelp &&
        <NeedHelp
          showButton={true}
          title={"Reactivate Now"}
          confirmText={'Re-activate'}
          open={openReactivateHelp}
          onConfirm={() => { router.push(AppRoutes.renewal); setOpenReactivateHelp(false) }}
          content=
          {<>
            <Typography variant="body2" sx={{ ...textwithmbSX, my: 3 }}>
              Wanting to update this preference? Your curret plan has been expired. Please reactivate your plan to make any changes.
            </Typography>
          </>}
          onClose={() => { setOpenReactivateHelp(false) }}
        />
      }
      {
        openhelp &&
        <NeedHelp
          open={openhelp}
          onClose={() => { setOpenhelp(false) }}
        />
      }
      {
        startDatePopBool &&
        <StartDateModal
          bodyText={'Please pick your start date first.'}
          open={startDatePopBool}
          onConfirm={() => {
            // scrollToTop()
            scrollToDiv(startDatePickerBox).then(() => {
              setTimeout(() => {

                handleBlink()
              }, 800)
            })
            setStartDatePopBool(false)
          }}
          handleClose={() =>
            setStartDatePopBool(false)
          }
        />
      }
      {
        openConfirmationModal &&
        <ConfirmationModal
          open={openConfirmationModal}
          handleClose={() => setOpenConfirmationModal(!openConfirmationModal)}
        />
      }
      {
        priceConfirmationDataLocal.type &&
        <ConfirmationModal2
          onConfirmPress={onClickConfirmButton}
          isDisabledBtn={isLoading}
          tabChange={false}
          open={priceConfirmationDataLocal.type}
          handleClose={() => onClickCancelButton(true)}
          cancelText={"Cancel"}
          confirmText={"Confirm"}
          totalPrice={priceConfirmationDataLocal.price}
          modalBody={"will be credited to your Wallet."}
          modalTitle={"Confirm Add to Wallet"}
          disclaimer={
            "For more information on using the credit in your Wallet, please click "
          }
        />
      }

      {
        passopen &&
        <PassPop open={passopen} handleClose={handleClosePass} />
      }

      {showWalletPop &&
        <WalletPop
          balance={userWalletAmount.toFixed(2)}
          walletData={walletData}
          onCancelPress={cancelSubscriptionHandler}
          open={showWalletPop}
          handleClose={() => setShowWalletPop(false)}
        />
      }
      {
        showCancelSubscriptionPopup &&
        <CancelSub
          onCancelPress={cancelSubscriptionHandler}
          open={showCancelSubscriptionPopup}
          handleClose={() => setShowCancelSubscriptionPopup(false)}
        />
      }
      {
        showAssignDelivery &&
        <AssignDelivery
          open={showAssignDelivery}
          handleClose={() => setShowAssignDelivery(false)}
          availableDays={allUserPreferencesData?.days_food_delivery ?? []}
          availableAddresses={allAddresses}
          handleAddAddress={handleAddAddress}
          handleScheduleAddress={handleScheduleAddress}
          addressWithDays={addressWithDaysLocal}
        />
      }
      {
        showAddAddressPopUp &&
        <AddAddress
          availableDays={allUserPreferencesData?.days_food_delivery ?? []}
          updateDays={updateAddressWithDays}
          updateModeSetter={setUpdateMode}
          open={showAddAddressPopUp}
          updated={() => setAddressUpdated(!addAddressUpdated)}
          handleClose={() => setShowAddAddressPopup(false)}
          preferancesPop={true}
        />
      }
      {
        showPhonePopup &&
        <PhonePopup
          open={showPhonePopup}
          currentModalType={currentModalType}
          handleClose={() => setShowPhonePopup(false)}
          handleClickOpen={handleClickPhoneOpen}
          days={allUserPreferencesData?.meal_days_per_week}
          currentData={currentData}
          handleFormData={handleFormChangeData}
        />
      }
      {open &&
        <Popup
          // selectedAddressTimeSlot={selectedAddressTimeSlot}
          open={open}
          currentModalType={currentModalType}
          handleClose={handleClose}
          handleCloseCross={handleCloseCross}
          onClose={() =>
          (allUserPreferencesData["meal_days_per_week"] =
            updateDeliveryDaysPerWeek)
          }
          handleClickOpen={handleClickOpen}
          days={allUserPreferencesData?.meal_days_per_week}
          currentData={currentData}
          handleFormData={handleFormChangeData}
        />
      }
      {
        //  (showAddCardPopup && !conditionForPaymob && !FirstUnPaidOrder) && <AddCardPopUp
        (showAddCardPopup) && <AddCardPopUp
          conditionForPaymob={conditionForPaymob}
          defaultAddress={defaultAddress}
          FirstUnPaidOrder={FirstUnPaidOrder}
          open={showAddCardPopup}
          updated={() => setCardUpdated(!cardUpdated)}
          handleClose={() => {
            setTimeout(() => {
              document.body.style.overflow = 'auto';
            }, 600);
            setShowAddCardPopup(false);
          }}
          PaymobModal={PaymobModal}
          setPaymobModal={setPaymobModal}
          setSecretToken={setSecretToken}
          getIntention={getIntention}
        />
      }
      {
        PaymobModal &&
        <PaymentPopWithPixelPaymob
          open={PaymobModal}
          userDetails={userDetails}
          onClose={() => {
            setPaymobModal(false);
            setTimeout(() => {
              document.body.style.overflow = 'auto';
            }, 600);
          }}
          saveCardRequest={(cardPayload) => {
            handleGetAllCardsRequest();
            setShowAddCardPopup(true);

          }}
          accessToken={auth_token}
          SecretToken={SecretToken}
        />
      }
      {
        discountWarningData.status &&
        <CustomConfirmationModal
          open={discountWarningData.status}
          handleCancel={handleCancelDiscountConfirmation}
          handleConfirm={handleConfirmDiscountConfirmation}
          modalTitle="Plan Change"
          modalDescription="Please note that changing your plan may affect your current discount. Depending on the new plan, you could either gain or lose the discount amount."
        />
      }
    </div>
  )
}

export default MealPlan
