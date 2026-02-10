import Header from "../../components/header"
import Footer from "../../components/footer"
import VideoScreen from "../../screens/videoComponent"
import { useState, useEffect, useRef } from "react"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../styles/themes/theme"
import Head from "next/head"
import ContentBox from "../../components/contentBox"
import QuickRecap from "../../components/quickRecap"
import OtherCalories from "../../components/otherCalories"
import RecomendedResult from "../../components/recomendedResult"
import RecomendedResultNewPricing from "../../components/recomendedResultNewPricing"
import MealPlan from "../../components/mealPlan"
import MealPlanNewPricing from "../../components/mealPlanNewPricing"
import { useDispatch, useSelector } from "react-redux"
import {
  updateQuizResult,
  clearFieldsRequest,
  resetQuizRequest
} from "../../store/reducers/quizPageReducer"
import get from "lodash/get"
import { unwrapResult } from "@reduxjs/toolkit"
import AppLogger from "helpers/AppLogger"
import { Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, useMediaQuery } from "@mui/material"
import AppColors from "helpers/AppColors"
import Script from "next/script"
import AppDataConstant from "helpers/AppDataConstant"
import { isStagingServer } from "../../helpers/ShortMethods"
import CustomConfirmationModal from '../../components/custom-confirmation-modal';
import PromoCodeModal from '../../components/promo-code-popup';
import ApiResource from "../../services/api/api"
import { getPromoCodeDetailsAction } from "store/actions/promoCodeDetailsAction"
import { performAddPromoCode } from "store/actions/promoCodeAction";
import { showFaliureToast } from "../../helpers/AppToast";
import { getDiscountDetailsV2, getDiscountDetailsV3, getDiscountDetailsV4, isDiscountRewardTypeWallet, isNull, pushToDataLayer, roundHalfDown, verifyURLforExe } from '../../../src/helpers/CommonFunc'
import AppConstants from "helpers/AppConstants"
import moment from "moment"

const ResultPage = () => {
  const dispatch = useDispatch()
  const { result, error, currentQuizType, resultDataToCompare } = useSelector(
    (state) => state.quiz
  )
  const { homeData } = useSelector((state) => state.homepage)
  const isMobile = useMediaQuery(`(max-width:768px)`);
  const [promoCodeLocal, setPromoCodeLocal] = useState(null)
  const [promoCode, setpromoCode] = useState(null)
  const [resetLoader, setresetLoader] = useState(false)
  const [promoDetails, setpromoDetails] = useState(null)
console.log('promoDetails on result page',promoDetails)
console.log('moment expiry log',moment(promoDetails?.expiry_date).isBefore(moment()))
  // let promoCode=null;
  useEffect(() => {
    // Check if we're running on the client (browser)
    if (typeof window !== 'undefined') {
      // Retrieve session data
      const storedData = sessionStorage.getItem('promoCode');
      if (storedData) {
        setpromoCode(JSON.parse(storedData))
        setPromoCodeLocal(JSON.parse(storedData));
      }
    }
  }, [promoCodeLocal]);

  useEffect(() => {
    // Check if we're running on the client (browser)
    if (typeof window !== 'undefined') {
      // Retrieve session data
      let storedData = sessionStorage.getItem('promoDetails');
      console.log('stored data before parsing',storedData)
      storedData = JSON.parse(storedData);
      storedData = storedData?.data ? storedData?.data : storedData;
      console.log("storedData on result page", storedData)
      if (storedData) {
        setpromoDetails(storedData)
      }
    }
  }, []);

  const AllArray = [1, 2, 3, 4, 5];
  const hasAll = (key) => AllArray?.every(num => key?.includes(num));

  const { snack } = promoDetails || {};
  let totalSnacks = snack || null;

  if (totalSnacks === "All" || hasAll(snack)) {
    totalSnacks = AllArray;
  }
  const [openPopup, setOpenPopup] = useState(false) // State for dialog popup
  const [openPromoPopup, setOpenPromoPopup] = useState(false);

  const [dataRec, setDataRec] = useState(null)
  const [currentQuizTypeLocal, setCurrentQuizTypeLocal] = useState("")
  const [errorString, setErrorString] = useState(".")
  const [resultChangedStatus, setResultChangedStatus] = useState(false)
  const [resultDataToCompareLocal, setResultDataToCompareLocal] = useState(null)
  const [resultData, setResultData] = useState(null)
  const [loading, setLoading] = useState(false);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);

  const [snackValues, setSnackValues] = useState({
    previousValue: get(result, "snacks_deliver_per_day", 0),
    current: get(result, "snacks_deliver_per_day", 0),
  });

  const AllSnacks = get(result, "guest_detail.snacks_deliver_per_day", "")
  const AllMeals = get(result, "guest_detail.meals_deliver_per_day", "")
  const AllDays = get(result, "guest_detail.meal_days_per_week", "")
  const AllWeeks = get(result, "guest_detail.meal_plan_require_weeks", "")

  const caloriesWithoutWateWeight = get(
    resultData,
    "calories_without_water_weight",
    ""
  )

  const averageMealsDay = get(resultData, "guest_detail.average_meals_day", "")
  const averageSnacksDay = get(
    resultData,
    "guest_detail.average_snacks_day",
    ""
  )

  const mealPlanCount = get(resultData, "meal_plan", [])
  const mealPlanCountToCompare = get(resultDataToCompareLocal, "meal_plan", [])
  const InitialMaxProteins = get(
    resultDataToCompareLocal,
    "max_proteins",
    ''
  )
  const InitialleastProteins = get(
    resultDataToCompareLocal,
    "least_proteins",
    ''
  )
  const snackPlanCount = get(resultData, "snack_plan", [])
  const snackPlanCountToCompare = get(
    resultDataToCompareLocal,
    "snack_plan",
    []
  )
  const practicalCalories = get(
    resultData,
    "practical_deliver_calories_per_day",
    0
  )
  const uuid = get(resultData, "key", "")
  const updateStatus = get(
    resultDataToCompareLocal,
    "practical_deliver_calories_per_day",
    0
  )


  const oldDaysPerWeek = get(
    resultData,
    "meal_days_per_week",
    0
  )
  const oldWeek = get(
    resultData,
    "meal_plan_require_weeks",
    0
  )
  const LocakDaysPerWeek = get(
    resultDataToCompareLocal,
    "total_delivery_days",
    0
  )
  const LocakWeek = get(
    resultDataToCompareLocal,
    "plan_weeks", 
    0
  )

  const totalPrice = resultData?.total_price;

  const undiscountedPrice = resultData?.meal_price + resultData?.snack_price;
  // const getDiscountDetailsV2 = (promoDetails, totalPriceFunc, undiscountedPrice) => {
  //   if (!promoDetails) return null;

  //   const currentWeeks = Number(AllWeeks);
  //   const type = promoDetails?.promo_type;
  //   const refrealType =  type === AppConstants?.promoCodeTypes?.referral_friend;

  //   // Find matching plan
  //   const discountPlanLengths = refrealType ? promoDetails?.referral_discount : promoDetails?.discount_plan_lengths || [];
  //   const matchingPlan = discountPlanLengths?.find(
  //       (item) => Number(refrealType ? item?.week : item?.plan_length) == currentWeeks
  //     );
  //   if (!matchingPlan) return null;

  //   const promoType = refrealType ? AppConstants?.foodPriceTypes?.percent : matchingPlan.reward_type;
  //   const rewardValue = Number(matchingPlan.reward_value);

  //   let finalPrice = totalPriceFunc;
  //   let amountSaved = 0;

  //   if (promoType === AppConstants?.foodPriceTypes?.percent) {
  //     amountSaved = (rewardValue / 100) * totalPriceFunc;
  //     finalPrice = totalPriceFunc - amountSaved;
  //   } else if (promoType === AppConstants?.foodPriceTypes?.flat) {
  //     amountSaved = rewardValue;
  //     finalPrice = totalPriceFunc - rewardValue;
  //   }

  //   // Ensure we don't go below 0
  //   finalPrice = Math.max(0, finalPrice);
  //   // capped amount work
  //   // const amountSave =  Math.round(Math.round(totalPriceFunc)-finalPrice);
  //   // if (amountSave > matchingPlan?.cap_amount) {
  //   //   finalPrice = totalPriceFunc - matchingPlan?.cap_amount;
  //   // }
  //   // console.log({
  //   //   promoType: promoType,
  //   //   symbol: promoType === AppConstants?.foodPriceTypes?.percent ? "%" : " AED",
  //   //   percentNum: rewardValue,
  //   //   AmountSaved: Math.round(finalPrice),
  //   //   totalAmount: Math.round(totalPriceFunc),
  //   //   finalPrice: Math.round(finalPrice),
  //   //   amountSave: Math.round(Math.round(totalPriceFunc)-finalPrice)
  //   // })
  //   return {
  //     promoType: promoType,
  //     symbol: promoType === AppConstants?.foodPriceTypes?.percent ? "%" : " AED",
  //     percentNum: rewardValue,
  //     AmountSaved: Math.round(finalPrice),
  //     totalAmount: Math.round(totalPriceFunc),
  //     finalPrice: Math.round(finalPrice)
  //   };
  // };
  const getDiscountDetails = (promoDetails, totalPriceFunc, FinalPriceFunc) => {
    if (promoDetails?.type == AppConstants?.foodPriceTypes?.percent) {
      return {
        promoType: AppConstants?.foodPriceTypes?.percent,
        symbol: '%',
        percentNum: promoDetails?.value,
        AmountSaved: totalPriceFunc - FinalPriceFunc,
        totalAmount: Math.round(totalPriceFunc)
      }
    }
    else {
      return {
        promoType: AppConstants?.foodPriceTypes?.flat,
        symbol: ` AED`,
        percentNum: promoDetails?.value,
        AmountSaved: totalPriceFunc - FinalPriceFunc,
        totalAmount: Math.round(totalPriceFunc)
      }
    }
  }
  const [discDetails, setDiscDetails] = useState(null);
  const [walletCredit, setwalletCredit] = useState(null);
  // useEffect(() => {
  //   // const details = getDiscountDetailsV2(promoDetails, undiscountedPrice, Number(AllWeeks));
  //   // const details = getDiscountDetailsV3(promoDetails, { mealPrice: resultData?.meal_price, snackPrice: resultData?.snack_price }, Number(AllWeeks));
  //   let details = null;
  //   const PlanWalletCreditChecker = isDiscountRewardTypeWallet(promoDetails, { mealPrice: resultData?.meal_price, snackPrice: resultData?.snack_price }, Number(AllWeeks));
  //     details = getDiscountDetailsV4(promoDetails, { mealPrice: resultData?.meal_price, snackPrice: resultData?.snack_price }, Number(AllWeeks));
    
  //   const week_based_discount_applied = get(resultData, 'week_based_discount_applied',false);
  //   const day_based_discount_applied = get(resultData, 'day_based_discount_applied',false);
  //   const week_discount_amount = get(resultData, 'week_discount_amount',0);
  //   const base_total_price = get(resultData, 'base_total_price',0);
  //   const total_price = get(resultData, 'total_price',0);
  //   const original_total = get(resultData, 'original_total',0);
  //   const total_bag_fees = get(resultData, 'total_bag_fees',0);
  //   const amounSave = roundHalfDown(base_total_price - total_price);
  //   const amounSaveWithDisc = roundHalfDown(original_total - base_total_price );
  //   console.log("details before",details)
  //   // if((week_based_discount_applied || day_based_discount_applied) && !promoDetails){
  //   if(!promoDetails){
  //     details = {
  //          promoType: AppConstants.foodPriceTypes.flat,
  //          symbol:" AED",
  //          percentNum: 1,
  //          extra_AmountSaved: roundHalfDown(amounSave),
  //          extra_amountSave: roundHalfDown(amounSave),
  //          extra_totalAmount: base_total_price,
  //          extra_finalPrice: base_total_price - roundHalfDown(amounSave),
  //          extra_isWalletCredit: false, // 🟡 extra info if needed
  //          extra_discount_only: true
  //     }
  //     setDiscDetails(details)
  //     setwalletCredit(null)
  //     return
  //   }
    
  //   if (PlanWalletCreditChecker?.planWalletCredit) {
  //     console.log("PlanWalletCreditChecker",PlanWalletCreditChecker)
  //     setwalletCredit({...PlanWalletCreditChecker,combinedTotal:PlanWalletCreditChecker?.combinedTotal + total_bag_fees } || null);
  //     setDiscDetails({...details, 
  //         extra_AmountSaved: roundHalfDown(amounSave) ,
  //          extra_amountSave: roundHalfDown(amounSave) ,
  //          extra_totalAmount: base_total_price,
  //          extra_finalPrice: base_total_price - roundHalfDown(amounSave),
  //          extra_isWalletCredit: false, // 🟡 extra info if needed
  //          finalPrice: details?.finalPrice + total_bag_fees
  //     })
  //   } else {
  //     setDiscDetails({...details, 
  //         extra_AmountSaved: roundHalfDown(amounSave),
  //          extra_amountSave: roundHalfDown(amounSave),
  //          extra_totalAmount: base_total_price,
  //          extra_finalPrice: base_total_price - roundHalfDown(week_discount_amount),
  //          extra_isWalletCredit: false, // 🟡 extra info if needed
  //          finalPrice: details?.finalPrice + total_bag_fees
  //     });
  //     setwalletCredit(null)
  //   }
  // }, [promoDetails, undiscountedPrice, totalPrice, resultData]);
  useEffect(() => {
    let details = null;
    const PlanWalletCreditChecker = isDiscountRewardTypeWallet(promoDetails, { mealPrice: resultData?.meal_price, snackPrice: resultData?.snack_price }, Number(AllWeeks));
      // details = getDiscountDetailsV4(promoDetails, { mealPrice: resultData?.meal_price, snackPrice: resultData?.snack_price }, Number(AllWeeks));
      console.log("PlanWalletCreditChecker",PlanWalletCreditChecker)
    const displayValues  = get(resultData, 'display_values',null);
    const additional_services_amount = get(displayValues, 'additional_services_amount',0);
    const discount_amount = get(displayValues, 'discount_amount',0);
    const subtotal = get(displayValues, 'subtotal',0);
    const total = get(displayValues, 'total',0);
    const total_discount_amount = get(displayValues, 'total_discount_amount',0);
    const wallet_deduction = get(displayValues, 'wallet_deduction',0);
    const wallet_credit_amount = get(displayValues, 'wallet_credit_amount',null) ? get(displayValues, 'wallet_credit_amount',null) : PlanWalletCreditChecker?.rewardValue ? PlanWalletCreditChecker?.rewardValue : 0;
    details = {
      additional_services_amount: roundHalfDown(additional_services_amount),
      discount_amount: roundHalfDown(discount_amount),
      subtotal: roundHalfDown(subtotal),
      total: roundHalfDown(total),
      total_discount_amount: roundHalfDown(total_discount_amount),
      wallet_deduction: roundHalfDown(wallet_deduction),
      wallet_credit_amount: roundHalfDown(wallet_credit_amount),
      }

    if (PlanWalletCreditChecker?.planWalletCredit) {
      setDiscDetails({...details, isWalletCredit:true})
    } else {
      setDiscDetails(details)
      setwalletCredit(null)
    }
  }, [promoDetails, undiscountedPrice, totalPrice, resultData]);

  useEffect(() => {
    if ((undiscountedPrice > totalPrice) && (promoDetails)) {
      setIsDiscountApplied(true);
    }
  }, [undiscountedPrice, totalPrice, promoDetails, resultData])

  const differenceInCalories =
    caloriesWithoutWateWeight -
    get(resultData, "practical_deliver_calories_per_day", "")

  const defaultCalorie = get(resultData, "guest_detail.default_calorie", "")

  const leastProteins = get(resultData, "least_proteins", "")
  const maxProteins = get(resultData, "max_proteins", "")

  const remainCalories =
    get(resultData, "practical_deliver_calories_per_day", "") -
    caloriesWithoutWateWeight

  const sliderRef = useRef();


  // Auto apply promo discount whenever refresh
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log("do i run")
      // Retrieve session data
      let storedDatacode = sessionStorage.getItem('promoDetails');
      let storedcode = sessionStorage.getItem('promoCode');
      storedcode = JSON.parse(storedcode);
      storedDatacode = JSON.parse(storedDatacode);
      const dataPromo = storedDatacode?.data ? storedDatacode?.data : storedDatacode;
      console.log("storedDatacode", storedDatacode)
      console.log("dataPromo", dataPromo)
      if (promoDetails || dataPromo) {
        onClickApplyPromoCode(dataPromo?.promo_code ?? promoDetails?.promo_code ?? storedcode);
      }
    }
    // commented dep as we will handle later
    // }, [promoDetails?.promo_code])
  }, [])

  useEffect(() => {
    if (promoCode) {
      setPromoCodeLocal(promoCode)
    }
  }, [promoCode])

  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])
  useEffect(() => {
    if (currentQuizType) {
      setCurrentQuizTypeLocal(currentQuizType)
    }
  }, [currentQuizType])

  useEffect(() => {
    if (resultDataToCompare) {
      setResultDataToCompareLocal(resultDataToCompare)
    }
  }, [resultDataToCompare])

  useEffect(() => {
    clearSavedFields()
  }, [])
  console.log("resultChangedStatus",resultChangedStatus)
  useEffect(() => {
    try {
      const status = compareHandler2()
      setResultChangedStatus(status)
    } catch (err) {
      AppLogger("This  is error on useffect========", err)
    }
  }, [updateStatus, practicalCalories, resultData])
  const compareHandler = () => {
    try {
      if (updateStatus && practicalCalories) {
        if (updateStatus !== practicalCalories) {
          return true
        } else {
          if (
            snackPlanCount.length == snackPlanCountToCompare.length &&
            mealPlanCount.length === mealPlanCountToCompare.length
          ) {
            alert('2')
            return false
          } else if (oldWeek !== LocakWeek || oldDaysPerWeek !== LocakDaysPerWeek) {
            return true
          } else if (updateStatus !== practicalCalories) {
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
// ASSUMPTION: Variables like LocakWeek, oldWeek, etc., are defined in the component scope.

  const compareHandler2 = () => {
    try {
      // 1. Check for change in primary status/calorie value
      if (updateStatus && practicalCalories && updateStatus !== practicalCalories) {
        return true;
      }

      // If Status/Calories are the same, check for changes in week/day settings
      if (oldWeek !== LocakWeek || oldDaysPerWeek !== LocakDaysPerWeek) {
        return true;
      }

      // *** Replication of Original Behavior ***
      // The original function reached this point when:
      // 1. Status/Calories are equal.
      // 2. Week/DaysPerWeek are equal.
      // In the original function, this scenario resulted in a final `return true`.
      return false; 

    } catch (error) {
      AppLogger("This is error======", error);
      // Return true on error to indicate a status change or unknown state
      return true; 
    }
  };
  useEffect(() => {
    try {
      if (result) {
        setResultData(result)
        setSnackValues({ current: get(result, "snacks_deliver_per_day", 0), previousValue: get(result, "snacks_deliver_per_day", 0) });
      }
    } catch (err) {
      AppLogger("Error at setResultData", err)
    }
  }, [result])

  useEffect(() => {
    if (error) {
      setErrorString(error.message)
    } else {
      setErrorString("")
    }
  }, [error])

  const clearSavedFields = () => {
    dispatch(clearFieldsRequest())
      .then(unwrapResult)
      .then((res) => {
        AppLogger("this is res=====", res)
      })
      .catch((err) => {
        AppLogger("this is err======", err)
      })
  }

  const updateMealHandler = (value, meal, index, key) => {
    try {
      var test = []
      for (let i = 0; i < value.length; i++) {
        const element = value[i]

        if (i !== index) {
          test.push(element)
        } else {
          test.push(meal)
        }
      }
      const meals = get(resultData, "meal_plan", [])
      const snacks = get(resultData, "snack_plan", [])
      var data = {
        ...resultData,
        [`${key}`]: test,
        meals_deliver_per_day: meals.length,
        snacks_deliver_per_day: snacks.length
      }
      setResultData(data)
      resultDataRequest(data)
    } catch (err) { }
  }

  const updateSnackHandler = (event, key) => {
    console.log("this is event=====", event)
    const meals = get(resultData, "meal_plan", [])
    console.log("this is key=====", key)
    var data = { ...resultData, meals_deliver_per_day: meals.length }
    data[`${key}`] = event
    setResultData(data)
    resultDataRequest(data)
  }

  const storedData = sessionStorage.getItem('promoCode');
  const promoStr = JSON.parse(storedData);
  const resultDataRequest =async (data) => {
    setLoading(true)
    try {
      if (resultData) {
        await  dispatch(updateQuizResult({ resultData: { ...data, promo_code: promoStr ?? promoCode ?? promoCodeLocal ?? null }, is_executive: isExecutive }))
          .then(unwrapResult)
          .then((res) => {
            AppLogger("Response at updateQuizResult", res)
            setLoading(false)
          })
          .catch((err) => {
            AppLogger("Error at updateQuizResult", err)
            setLoading(false)
          })
          .finally(() => setLoading(false))
      }
    } catch (err) {
      setLoading(false)
      AppLogger("Error at resultDataRequest", err)
    }
  }

  const onResetPresshandler = async () => {
    setresetLoader(true)
    try {
      AppLogger("this is on reset press handler=======")
      await dispatch(resetQuizRequest({ uuid }))
        .then(unwrapResult)
        .then((res) => {
          console.log("promoDetails in reset", promoDetails)
          console.log("res", res?.data?.data)
          const meals = get(res?.data, "data.meal_plan", []);
          const snacks = get(res?.data, "data.snack_plan", []);

          const data = {
            ...res?.data?.data,
            meals_deliver_per_day: meals.length,
            snacks_deliver_per_day: snacks.length,
          }
          dispatch(updateQuizResult({ resultData: { ...data, promo_code: get(promoDetails, "promo_code", '') } }))
            .then(unwrapResult)
            .catch((err) => {
              AppLogger("Error at updateQuizResult", err)
            })
            .finally(() => {
              setresetLoader(false)
              setLoading(false)
            })
          AppLogger("This is response at on reset press handler========", res)
        })
        .catch((err) => {
          setLoading(false)
          setresetLoader(false)
          AppLogger("This  is error at on reset press hander======", err)
        })

    } catch (error) {
      setLoading(false)
      setresetLoader(false)
      AppLogger("This  is error at on reset press hander======", error)

    }
  }

  const totalAmount = Math.round(
    resultData?.meal_price + resultData?.snack_price
  )

  const handleConfirmChange = () => {
    setIsDiscountApplied(false);
    handleInvalidPromoCode()
    updateSnackHandler(snackValues.current, "snacks_deliver_per_day"); // Proceed with the update
    setOpenPopup(false);
  }

  const handleSyncSliderWithApi = () => {
    if (sliderRef && get(sliderRef, 'current.props.currentSlide', 0) == snackValues.previousValue) {
      sliderRef?.current?.slickGoTo(snackValues.previousValue)
    }
  }

  // Handle canceling the change
  const handleCancelChange = () => {
    setSnackValues({ ...snackValues, current: snackValues.previousValue });
    sliderRef?.current?.slickGoTo(snackValues.previousValue)
    // updateSnackHandler(snackValues.previousValue, "snacks_deliver_per_day"); // Revert update
    // handleSyncSliderWithApi() // this is for only 1 case lol
    setOpenPopup(false);
  }
  const isDiscountApplicable = (key) => {

    const applicableKeys = {
      // "snacks_deliver_per_day": snack !== 'All'
      "snacks_deliver_per_day": !hasAll(snack)
    };

    return key && applicableKeys[key] !== undefined ? applicableKeys[key] : false;
  };

  const handleUpdateSnacks = (event, ref = null) => {
    if (!sliderRef.current && ref) sliderRef.current = ref?.current;
    setSnackValues({ current: event, previousValue: snackValues.current });
    // Set new value and open popup only if it's not already open
    if (event == 0 && totalSnacks?.length == 0) {
      updateSnackHandler(event, "snacks_deliver_per_day")
      return;
    }
    console.log("dis us", isDiscountApplicable("snacks_deliver_per_day"))
    if (promoDetails
      // && event !== Number(totalSnacks)
      && !totalSnacks?.includes(event)
      && !openPopup && event !== snackValues.current
      && !isDiscountApplicable("snacks_deliver_per_day")
    ) {
      setOpenPopup(true)
    } else if (totalSnacks?.includes(event)) {
      updateSnackHandler(Number(event), "snacks_deliver_per_day")
    } else {
      updateSnackHandler(event, "snacks_deliver_per_day")
    }
  }
  const { isExecutive } = useSelector((state) => state.auth)

  const checkExecutive = window.location.hostname.split(".").find((item) => {
    return item == AppConstants.executive
  })
  let locationName = window.location.hostname;
  let ExecutiveCheck = locationName == 'localhost' ? isExecutive : checkExecutive == AppConstants.executive
  const handleVerifyPromoCode = async (promoCode = '') => {
    try {
      if (!promoCode) return;
      const response = await ApiResource.get(`/discount/${promoCode}?is_executive=${ExecutiveCheck ? 1 : 0}`);
      return get(response, "data", null);
    } catch (error) {
      AppLogger("Error at handleVerifyPromoCode", error);
      return null;
    }
  }

  const handleUpdatePriceForDiscount = (promoDetails) => {
    try {
      if (!result && promoDetails) return;

      const meals = get(result, "meal_plan", []);
      const snacks = get(result, "snack_plan", []);
      const data = {
        ...result,
        meals_deliver_per_day: meals.length,
        snacks_deliver_per_day: snacks.length,
      }
      setResultData(data);
      setLoading(true);
      dispatch(updateQuizResult({ resultData: { ...data, promo_code: get(promoDetails, "promo_code", '') } }))
        .then(unwrapResult)
        .catch((err) => {
          AppLogger("Error at updateQuizResult", err)
        })
        .finally(() => setLoading(false));
    } catch (err) {
      AppLogger("Error at resultDataRequest", err)
    }
  }


  const isPromoValid = (promoDetails) => {
    try {
      console.log("sususus",promoDetails)
       const currentWeeks = AllWeeks;
       const type = promoDetails?.promo_type;
       const refrealType = type === AppConstants?.promoCodeTypes?.referral_friend;

       const discountPlanLengths = refrealType
         ? (promoDetails?.referral_discount || [])
         : (promoDetails?.discount_plan_lengths || []);

       const matchingPlan = discountPlanLengths?.find(
         (item) => Number(refrealType ? item?.week : item?.plan_length) === currentWeeks
       );
   
      if (!promoDetails) {
        showFaliureToast('Invalid Promo Code');
        return false
      }
      if (moment(promoDetails?.expiry_date).isBefore(moment())) {
        // Promo has expired
        showFaliureToast('The applied promo code has expired');
        return false
      }
      const promoMeal = Number(get(promoDetails, 'meal', 0) == 'All' ? 5 : get(promoDetails, 'meal', 0));
      const promoSnacks = Number(get(promoDetails, 'snack', 0) == 'All' ? 5 : get(promoDetails, 'snack', 0));
      const promoDays = Number(get(promoDetails, 'days', 0) == 'All' ? 5 : get(promoDetails, 'days', 0));
      // Changes initial value to All - As zero is equivalent to All
      const promoWeeks = get(promoDetails, 'length_plan_weeks', 'All');

      if (
        (get(promoDetails, 'meal', 0) == 'All' || Number(AllMeals) === promoMeal) &&
        (get(promoDetails, 'snack', 0) == 'All' || Number(AllSnacks) === promoSnacks) &&
        (get(promoDetails, 'days', 0) == 'All' || Number(AllDays) === promoDays) &&
        (promoWeeks === "All" || promoWeeks === 0 || promoWeeks === Number(AllWeeks))
      ) {
        return true
      } else {
        console.log("get(", get(promoDetails, 'length_plan_weeks', 'All'))
        showFaliureToast(`Your current plan doesn't match with applied promo code.
          <br>
          Promo code plan: <br>
          ${get(promoDetails, 'meal', 0) == 'All' ? "" : `Meals per day:  ${promoMeal}<br>`}
          ${get(promoDetails, 'snack', 0) == 'All' ? "" : `Snacks per day:  ${promoSnacks}<br>`}
          ${get(promoDetails, 'days', 0) == 'All' ? "" : `Delivery Days per week:  ${promoDays}<br>`}
          ${get(promoDetails, 'length_plan_weeks', 'All') == 'All' || get(promoDetails, 'length_plan_weeks', 'All') == 0 ? "" : `Plan length Weeks:  ${promoWeeks}<br>`}`);
        // Snacks per day:  ${promoSnacks}<br>
        // No of delivery Days:  ${promoDays}<br>
        // Plan length Weeks:  ${promoWeeks}<br>
        handleInvalidPromoCode()
        return false

      }

    } catch (error) {
      AppLogger("Error at isPromoValid", error)
      return false;
    }
  }

  const handleInvalidPromoCode = () => {
    togglePromoPopup(false);
    setIsDiscountApplied(false);
    handleUpdatePriceForDiscount("")
    setPromoCodeLocal(null);
    setpromoCode(null);
    // showFaliureToast('Invalid Promo Code');
    if (promoDetails) dispatch(getPromoCodeDetailsAction({}));
    if (promoCode) dispatch(performAddPromoCode(''));
    setpromoDetails(null)
    sessionStorage.clear();
  }

  const onClickApplyPromoCodeOld = async (promoCode = '') => {
    togglePromoPopup(false);
    const promoDetails = await handleVerifyPromoCode(promoCode);
    const isPromoValidAndApplicable = isPromoValid(get(promoDetails, 'data', null));
    if (!isPromoValidAndApplicable) return handleInvalidPromoCode();
    dispatch(getPromoCodeDetailsAction(promoDetails));
    dispatch(performAddPromoCode(get(promoDetails, 'data.promo_code', '')));
    handleUpdatePriceForDiscount(get(promoDetails, 'data', null));
    pushToDataLayer("promo_code_claimed")
    sessionStorage.setItem('promoDetails', JSON.stringify(promoDetails));
    sessionStorage.setItem('promoCode', JSON.stringify(promoCode));
    setpromoDetails(get(promoDetails, 'data', null))
    setIsDiscountApplied(true);
  }
  // console.log("dataresponse",dataresponse)
  const onClickApplyPromoCode = async (promoCode = '') => {
    console.log("going inside", promoCode)
    togglePromoPopup(false);
    // const promoDetailsApiRes = dataresponse; // For testing purposes, using mock data
    const promoDetailsApiRes = await handleVerifyPromoCode(promoCode);
    const promoDetailsfun = promoDetailsApiRes?.data ? promoDetailsApiRes?.data : promoDetailsApiRes;
    // const res = await fetch('/api/mock-discount/new2');
    // const promoDetailsfun = await res?.json();
    const isPromoValidAndApplicable = isPromoValidV2(promoDetailsfun);
    if (!isPromoValidAndApplicable) return handleInvalidPromoCode();
    dispatch(getPromoCodeDetailsAction(promoDetailsfun));
    dispatch(performAddPromoCode(promoDetailsfun?.promo_code));
    handleUpdatePriceForDiscount(promoDetailsfun);
    pushToDataLayer("promo_code_claimed")
    sessionStorage.setItem('promoDetails', JSON.stringify(promoDetailsfun));
    sessionStorage.setItem('promoCode', JSON.stringify(promoCode));
    setpromoDetails(promoDetailsfun)
    setIsDiscountApplied(true);
  }
  const isPromoApplicable = true; //TODO - Make Dynamic

  const togglePromoPopup = (toggleValue) => {
    if (typeof toggleValue !== 'boolean') return;

    setOpenPromoPopup(toggleValue);
  }
  const isPromoValidV2 = (promoDetails) => {
    try {
      // if (promoDetails?.promo_restrictions == AppConstants?.promo_restrictions?.renewal_customers) {
      //   showFaliureToast('This promo code is valid for renewal customers only');
      //   return false;
      // }
      if (promoDetails?.status == 0 || promoDetails?.status == false) {
        showFaliureToast('Invalid Promo Code');
        return false;
      }
      if (!promoDetails) {
        showFaliureToast('Invalid Promo Code');
        return false;
      }

      const currentMeal = Number(AllMeals);
      const currentSnack = Number(AllSnacks);
      const currentDays = Number(AllDays);
      const currentWeeks = Number(AllWeeks);
      const type = get(promoDetails, 'promo_type', '');
      const refrealType = type === AppConstants?.promoCodeTypes?.referral_friend;

      // Helper function to normalize "All" or empty into always-valid
      const includesOrAll = (list, value) => {
        if (!list || list === 'All' || list.length === 0) return true;
        return list.includes(value);
      };
     
      // Promo expiry w.r.t to validity_type
      if (promoDetails?.validity_type === 'duration_from_creation') {
        // Convert "2025-08-06 09:39:00" → "2025-08-06T09:39:00"
        const createdOnStr = promoDetails?.created_on.replace(" ", "T");
        const createdOn = new Date(createdOnStr);

        const durationInDays = promoDetails?.duration_from_creation ?? 0;
        const expiryDate = new Date(createdOn);
        expiryDate.setDate(expiryDate.getDate() + durationInDays);
        const renewalCondition = !(promoDetails?.promo_restrictions == AppConstants?.promo_restrictions?.renewal_customers)

        if (new Date() > expiryDate) {
          showFaliureToast("The applied promo code has expired from creation date");
          return false;
        }
      } else {
        // Promo has expired
        if (moment(promoDetails?.expiry_date).isBefore(moment())) {
          showFaliureToast('The applied promo code has expired');
          return false
        }
      }



      // Validate Meals
      // if (!includesOrAll(promoDetails?.meal, currentMeal) ) {
      if (!includesOrAll(promoDetails?.meal, currentMeal)) {
        showFaliureToast(`This promo code is not valid for ${currentMeal} meals per day`);
        handleInvalidPromoCode();
        return false;
      }

      // Validate Snacks
      // if (!includesOrAll(promoDetails?.snack, currentSnack) ) {
      if (!includesOrAll(promoDetails?.snack, currentSnack)) {
        showFaliureToast(`This promo code is not valid for ${currentSnack} snacks per day`);
        handleInvalidPromoCode();
        return false;
      }

      // Validate Days
      // if (!includesOrAll(promoDetails?.days, currentDays)) {
      if (!includesOrAll(promoDetails?.days, currentDays)) {
        showFaliureToast(`This promo code is not valid for ${currentDays} delivery days per week`);
        handleInvalidPromoCode();
        return false;
      }

      // Validate Weeks + Select Discount Plan
      // if (!includesOrAll(promoDetails?.length_plan_weeks, currentWeeks)) {
      if (!includesOrAll(promoDetails?.length_plan_weeks, currentWeeks)) {
        showFaliureToast(`This promo code is not valid for ${currentWeeks} week plans`);
        handleInvalidPromoCode();
        return false;
      }

      // Validate `discount_plan_lengths` and apply correct value & type
      const discountPlanLengths = refrealType ? promoDetails?.referral_discount : promoDetails?.discount_plan_lengths || [];
      const matchingPlan = discountPlanLengths?.find(
        (item) => Number(refrealType ? item?.week : item?.plan_length) === currentWeeks
      );

      if (!matchingPlan) {
        showFaliureToast(`No discount found for ${currentWeeks} week plan`);
        handleInvalidPromoCode();
        return false;
      }
      if(isNull(matchingPlan?.cohort_discount) && !refrealType && !isExecutive){
        showFaliureToast('Invalid Promo Code');
        handleInvalidPromoCode();
        return false
       }
      // Overwrite promo value and type based on matchingPlan
      promoDetails.value = Number(matchingPlan.reward_value);
      promoDetails.type = refrealType ? AppConstants?.foodPriceTypes?.percent : matchingPlan.reward_type;

      return true;

    } catch (error) {
      AppLogger("Error at isPromoValid", error);
      return false;
    }
  };

  const refForPreferenceChangeBox = useRef();

  return (
    <div className="animate__animated animate__fadeIn animate__faster" >
      {caloriesWithoutWateWeight && totalAmount && isStagingServer() ? (
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer.push({
            'event': 'add_to_cart',
            'pageTitle': document.title,
            'pageUrl': window.location.href,
            'totalDailyCalories': ${caloriesWithoutWateWeight},
            'totalAmount': ${totalAmount}
          })`
          }}
        ></Script>
      ) : null}
      <ThemeProvider theme={theme}>
        {dataRec && <Header dataRec={dataRec} isExecutive={
          // AppConstants.isExecutive
          isExecutive
        } />}

        {dataRec && (
          <ContentBox
            error={errorString !== "" ? true : false}
            dataRec={dataRec}
          />
        )}

        {resultData && (
          <QuickRecap
            yourUsualData={{
              averageMealsDay,
              averageSnacksDay
            }}
            isExecutive={isExecutive}
            currentQuizType={currentQuizTypeLocal}
            portionSize={defaultCalorie}
            toBeDeliveredByPracticalData={{
              AllSnacks,
              AllMeals,
              AllDays,
              AllWeeks
            }}
          />
        )}

        {/* <Button onClick={ApplyPromoWithNewLogic} >
          Promo apply kr bhai 
        </Button> */}

        {resultData && Object.keys(resultData).length > 1 && 
        
        !isMobile ? (
          <RecomendedResult
            weekBasedDiscount={resultData?.week_based_discount_applied}
            promoDetailsWeek={Number(AllWeeks)}
            refForPreferenceChangeBox={refForPreferenceChangeBox}
            promoDetails={promoDetails}
            walletCredit={walletCredit}
            loader={resetLoader || loading}
            // InitialleastProteins={InitialMaxProteins?InitialMaxProteins:InitialleastProteins??''}
            InitialleastProteins={maxProteins ? maxProteins : leastProteins ?? ''}
            leastProteins={maxProteins ? maxProteins : leastProteins ?? ''}
            error={errorString !== "" ? true : false}
            // totalPrice={resultData?.recommended_calories_per_day ?? ""}
            totalPrice={totalPrice ?? ""}
            // totalCalories={totalCalories ?? ""}
            totalCalories={resultData?.practical_deliver_calories_per_day ?? ""}
            adjustedCalories={
              resultData?.practical_deliver_calories_per_day ?? ""
            }
            isPromoApplicable={isPromoApplicable}
            adjustedPrice={totalPrice}
            handleApplyPromoCode={onClickApplyPromoCode}
            discountData={{ isDiscountApplied: isDiscountApplied }}
            togglePromoPopup={togglePromoPopup}
            discDetails={discDetails}
            isDiscountApplied={isDiscountApplied}
            appliedPromoCode={get(promoDetails, "promo_code", "") && isDiscountApplied ? get(promoDetails, "promo_code", "") : promoCode ?? ''}
            handleApplyPromo={onClickApplyPromoCode}
            removeDiscountClick={handleInvalidPromoCode}
          >
            <div style={{ pointerEvents: loading ? 'none' : 'all' }}>
              <MealPlanNewPricing
                setResultChangedStatus={setResultChangedStatus}
                refForPreferenceChangeBox={refForPreferenceChangeBox}
                resultData={{...resultData,is_executive: isExecutive}}
                handleInvalidPromoCode={handleInvalidPromoCode}
                promoDetails={promoDetails}
                isExecutive={isExecutive}
                dataRec={dataRec}
                loading={loading}
                day={resultData?.plan_weeks}
                changed={resultChangedStatus}
                protiens={resultData?.least_proteins}
                // result={result}
                updateMeal={(meal, index) =>
                  updateMealHandler(
                    resultData["meal_plan"],
                    meal,
                    index,
                    "meal_plan"
                  )
                }
                updateSnacks={handleUpdateSnacks}
                onResetClick={onResetPresshandler}
                resultDataRequest={resultDataRequest}
                totalCalories={resultData?.practical_deliver_calories_per_day}
                snacks={resultData?.snack_plan ?? []}
                meals={resultData?.meal_plan ?? []}
                isResultPage={true}
                resetLoader={resetLoader}
              />
            </div>

            {errorString !== "" && (
              <Typography
                style={{
                  color: AppColors.red,
                  fontWeight: "bold",
                  textAlign: "center",
                  textTransform: "capitalize",
                  paddingBottom: "20px"
                }}
              >{`Error:${errorString}`}</Typography>
            )}
            {/* <div style={{pointerEvents: loading ? 'none' : 'all'}}>
            <MealPlan
            promoDetails={promoDetails}
              isExecutive={isExecutive}
              dataRec={dataRec}
              day={resultData?.plan_weeks}
              changed={resultChangedStatus}
              protiens={resultData?.least_proteins}
              // result={result}
              updateMeal={(meal, index) =>
                updateMealHandler(
                  resultData["meal_plan"],
                  meal,
                  index,
                  "meal_plan"
                )
              }
              updateSnacks={handleUpdateSnacks}
              onResetClick={onResetPresshandler}
              totalCalories={resultData?.practical_deliver_calories_per_day}
              snacks={resultData?.snack_plan ?? []}
              meals={resultData?.meal_plan ?? []}
              isResultPage={true}
              resetLoader={resetLoader}
            />
            </div>

            {errorString !== "" && (
              <Typography
                style={{
                  color: AppColors.red,
                  fontWeight: "bold",
                  textAlign: "center",
                  textTransform: "capitalize",
                  paddingBottom: "20px"
                }}
              >{`Error:${errorString}`}</Typography>
            )} */}
          </RecomendedResult>
          ):
          <RecomendedResultNewPricing
          setResultChangedStatus={setResultChangedStatus}
            weekBasedDiscount={resultData?.week_based_discount_applied}
            promoDetailsWeek={Number(AllWeeks)}
            refForPreferenceChangeBox={refForPreferenceChangeBox}
            promoDetails={promoDetails}
            walletCredit={walletCredit}
            loader={resetLoader||loading}
            // InitialleastProteins={InitialMaxProteins?InitialMaxProteins:InitialleastProteins??''}
            InitialleastProteins={maxProteins ? maxProteins: leastProteins??''}
            leastProteins={maxProteins ? maxProteins: leastProteins??''}
            error={errorString !== "" ? true : false}
            // totalPrice={resultData?.recommended_calories_per_day ?? ""}
            totalPrice={totalPrice ?? ""}
            // totalCalories={totalCalories ?? ""}
            totalCalories={resultData?.practical_deliver_calories_per_day ?? ""}
            adjustedCalories={
              resultData?.practical_deliver_calories_per_day ?? ""
            }
            isPromoApplicable={isPromoApplicable}
            adjustedPrice={totalPrice}
            handleApplyPromoCode={onClickApplyPromoCode}
            discountData={{isDiscountApplied : isDiscountApplied}}
            togglePromoPopup={togglePromoPopup}
            discDetails={discDetails}
            isDiscountApplied={isDiscountApplied}
            appliedPromoCode={get(promoDetails, "promo_code", "") && isDiscountApplied ? get(promoDetails, "promo_code", "") :promoCode ?? ''}
            handleApplyPromo={onClickApplyPromoCode}
            removeDiscountClick={handleInvalidPromoCode}
          >
            <div style={{pointerEvents: loading ? 'none' : 'all'}}>
               <MealPlanNewPricing
                setResultChangedStatus={setResultChangedStatus}
                refForPreferenceChangeBox={refForPreferenceChangeBox}
                resultData={{...resultData}}
                handleInvalidPromoCode={handleInvalidPromoCode}
                promoDetails={promoDetails}
                isExecutive={isExecutive}
                dataRec={dataRec}
                loading={loading}
                day={resultData?.plan_weeks}
                changed={resultChangedStatus}
                protiens={resultData?.least_proteins}
                // result={result}
                updateMeal={(meal, index) =>
                  updateMealHandler(
                    resultData["meal_plan"],
                    meal,
                    index,
                    "meal_plan"
                  )
                }
                updateSnacks={handleUpdateSnacks}
                onResetClick={onResetPresshandler}
                resultDataRequest={resultDataRequest}
                totalCalories={resultData?.practical_deliver_calories_per_day}
                snacks={resultData?.snack_plan ?? []}
                meals={resultData?.meal_plan ?? []}
                isResultPage={true}
                resetLoader={resetLoader}
              />
            </div>

            {errorString !== "" && (
              <Typography
                style={{
                  color: AppColors.red,
                  fontWeight: "bold",
                  textAlign: "center",
                  textTransform: "capitalize",
                  paddingBottom: "20px"
                }}
              >{`Error:${errorString}`}</Typography>
            )}
          </RecomendedResultNewPricing>
        }
        {/* {!isExecutive ?
          <OtherCalories
            remainCalories={remainCalories}
            error={errorString !== "" ? true : false}
            currentQuizType={currentQuizTypeLocal}
            totalCalories={caloriesWithoutWateWeight}
            // totalCalories={totalCaloriesPerDay}
            differenceInCalories={differenceInCalories}
          />
          : null
        } */}
        <br />
        <br />
        {/* {dataRec && !isExecutive && (
          <VideoScreen
            onLoop={false}
            dataRec={dataRec}
            videoLink={AppDataConstant.macroVideo}
            // utubeLink={dataRec?.video?.utubeVideoPath}
            videoPoster={AppDataConstant.macroPoster}
          />
        )} */}
        <Footer isExecutive={
          // AppConstants.isExecutive
          isExecutive
        } />
      </ThemeProvider>

      {/* <Dialog
        open={openPopup}
        onClose={handleCancelChange}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{color:"white"}}>
          {"Warning: Changing Plan"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{color:"white"}}>
            You will lose your discount if you change your plan. Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelChange} color="primary" style={{borderWidth:1, borderColor: "white", color:"white"}}>
            Cancel
          </Button>
          <Button onClick={handleConfirmChange} color="primary" autoFocus style={{borderWidth:1, borderColor: "white", color:"white"}}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog> */}
      <CustomConfirmationModal
        open={openPopup}
        handleCancel={handleCancelChange}
        handleConfirm={handleConfirmChange}
        modalTitle="Plan Change"
        modalDescription="Please note that changing your plan may affect your current discount. Depending on the new plan, you could either gain or lose the discount amount."
      />
      <PromoCodeModal
        isDiscountApplied={isDiscountApplied}
        appliedPromoCode={get(promoDetails, "promo_code", "") && isDiscountApplied ? get(promoDetails, "promo_code", "") : ''}
        open={openPromoPopup}
        handleApplyPromo={onClickApplyPromoCode}
        modalTitle="Apply Promo"
        togglePromoPopup={togglePromoPopup}
        modalDescription="Let's make your first order with us a bit cheaper"
      />
    </div>
  )
}

export default ResultPage