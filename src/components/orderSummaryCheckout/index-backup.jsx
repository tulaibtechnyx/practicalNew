import React, { useState, useEffect } from "react"
import get from "lodash/get"
import { unwrapResult } from "@reduxjs/toolkit"
import { useSelector, useDispatch } from "react-redux"
import { DiscountObjwrtWeek, getCacheKey, getFormattedCapAmount, getPromoCodeDiscountValue, getPromoCodeDiscountValueToDisplay, ifZerothenOk, isDiscountNegative, isDiscountRewardTypeWallet, isNull, mapErrorMessage, pushToDataLayer, roundHalfDown, toSentenceCase } from "../../helpers/CommonFunc"
import {
  addCardRequest,
  editCardRequest,
  deleteCardRequest,
  addAddressRequest,
  updateAddressRequest,
  deleteAddressRequest,
  checkOutRequest,
  getOrderSummaryRequest,
  getOrderSummaryPaidRequest,
  getOrderDiscountSummary,
  saveCheckOutSummary,
  saveOrderLocalSummary,
  clearCheckOutSummary,
  changePrice,
  setpaymentMethod,
  createIntention,
  createIntentionFunc,
  setUserDefaultCardRequest,
  setpaymobRespoUrl,
  setpromoCodeString,
  discountSummaryremover,
} from "../../store/reducers/checkoutReducer"
import { getAllCardsRequest, GetTickersRequest, setDefaultAddressRequest, updateDefCard } from "store/reducers/dashboardReducer"
import {
  StartUpRequest,
  getAllAddressRequest
} from "../../store/reducers/dashboardReducer"

import { useRouter } from "next/router"
import { showFaliureToast } from "helpers/AppToast"
import styles from "./style.module.scss"
import Typography from "@mui/material/Typography"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import AppColors from "helpers/AppColors"
import EditIcon from "../../../public/images/icons/edit-address.svg"
import PlusIcon from "../../../public/images/icons/plus-icon.svg"
import AddCard from "../../../public/images/icons/card.svg"
import InputField from "../../Elements/inputField"
import PriceBox from "../../components/priceBox"
// import TextField from "@mui/material/TextField"
// import InputAdornment from "@mui/material/InputAdornment"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import clsx from "clsx"
import AppLogger from "helpers/AppLogger"
import Loader2 from "components/loader/Loader2"
import AppConstants from "../../helpers/AppConstants"
import AddCardPopup from "../checkout/addNewCard"
import AddAddressPopup from "../checkout/addAddress"
import AppRoutes from "../../helpers/AppRoutes"
import Off50 from "../../../public/images/icons/off50.svg"
import CardsComponent from "./cardsComp1"
import stripe from "stripe"
import DeliveryDays from "components/delivery-days"
import AppDataConstant from "helpers/AppDataConstant"
import { performAddPromoCode } from "../../store/actions/promoCodeAction"
import Edit from "../../../public/images/icons/edit.svg"
import AssignDelivery from "components/mealBox/AssignDelivery"
import { customTimeout, handleShowWalletDiscount, handleSubtotalPrice, isProductionServer, isStagingServer, percentCalculation, transformScheduleDeliveryPayload } from "helpers/ShortMethods"
import { getDeliveryAddressWithDaysRequest, updateCompanyDeliveryAddressWithDaysRequest, updateDeliveryAddressWithDaysRequest, UpdatePreferencesSliderRequest } from "store/reducers/profileReducer"
import { showSuccessToast } from "../../helpers/AppToast"
import AppErrors from "helpers/AppErrors"
import AddressDaysPopup from "./addressDaysPopup";
import Script from "next/script"
import PaymentPopWithPixelPaymob from "@components/popUp/PaymentPopWithPixelPaymob"
import { Box } from "@mui/material"
import { DFJCAC } from "../mealDistrubution/TimerTooltip"
import { isDevServer } from "../../helpers/ShortMethods"
import { toast } from "react-toastify"
import UpgradeOfferBanner from "./UpgradeOfferBanner"
import UpgradeOfferBanne2 from "./UpgradeOfferBanne2"
import UpgradeOfferBannerDynamic from "./UpgradeOfferBannerDynamic"
import { buttonSX } from "@components/popUp/commonSX"
import Additembox from "../Additembox"
import AdditemModal from "./AddItemInModal"
import { ProfileRequest, PromoAvailed } from "../../store/reducers/profileReducer"
import { logOutUserRequest } from "../../store/reducers/authReducer"
import { getPromoCodeDetailsAction } from "../../store/actions/promoCodeDetailsAction"
const lastCallCache = new Map(); // key: payload signature, value: timestamp


const OrderSummaryComp = ({ dataRec }) => {
  const STRIPE = new stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)
  // Thunk Dispatcher
  const dispatch = useDispatch()

  //Navigator

  const router = useRouter()

  // Reducer States
  const { userDetails, isExecutive = null } = useSelector((state) => state.auth)
  const { userProfile, addressWithDays } = useSelector((state) => state.profile)
  const {
    startUpData,
    ticker,
    cards: cardsData,
    addresss,
    UAEAddresses,
    renewalData
  } = useSelector((state) => state.home)
  const { loading, error, orderSummary, discountSummary, checkoutSummary } =
    useSelector((state) => state.CheckOutReducer)
  const promoCodeString =
    useSelector((state) => state.CheckOutReducer.promoCodeString)
  const promo_code = useSelector((state) => state.promoCode)
  const [UAEAddressesLocal, setUAEAddressesLocal] = useState(null)
  const [addressWithDaysLocal, setAddressWithDaysLocal] = useState(null)

  useEffect(() => {
    if (UAEAddresses) {
      setUAEAddressesLocal(UAEAddresses)
    }
  }, [UAEAddresses])
  // Component States
  const [orderSummaryLocal, setOrderSummaryLocal] = useState(null)
  const [checkoutSummaryLocal, setCheckoutSummaryLocal] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [cardError, setCardError] = useState(null)
  const [promoCodeSummaryLocal, setPromoCodeSummaryLocal] = useState(null)
  const [promoCodeWalletCredit, setPromoCodeWalletCredit] = useState(null)
  const [userProfileLocal, setUserProfileLocal] = useState(null)
  const [subDiscount, setSubDiscount] = useState("")
  const [showAddCardPopup, setShowAddCardPopup] = useState(false)
  const [showAddAddressPopup, setShowAddressPopup] = useState(false)
  const [showDaysUpdatePopup, setShowDaysUpdatePopup] = useState(false)
  const [updateMode, setUpdateMode] = useState(false)
  const [tickerLocal, setTickerLocal] = useState(null)
  const [subscriptionDicountLocal, setSubscriptionDiscountLocal] = useState(null)
  const [dataUpdated, setDataUpdated] = useState(false)
  const [allCardsDataLocal, setAllCardsDataLocal] = useState(false)
  const [editCardBody, setEditCardBody] = useState(null)
  const [allAddressDataLocal, setAllAddressDataLocal] = useState(null)
  // const [dataRec, setDataRec] = useState(null)
  const [apiLoading, setApiLoading] = useState(false)
  const [showAssignDelivery, setShowAssignDelivery] = useState(false)
  const [checkoutLoader,setCheckOutLoader]=useState(false)
  const [intentionLoader, setintentionLoader] = useState(false)
  const [promocodeLoader, setpromocodeLoader] = useState(false)
  const [currentAddressData, setCurrentAddressData] = useState({
    days: [],
    address_line_one: "",
    address_line_two: "",
    label: "",
    address_id: "",
    type: "",
    street: "",
    apartment: "",
    time_slot: "",
    emirate_id: "",
    area_id: "",
    emirate: "",
    area: "",
    timeSlots: [],
    cities: [],
  })

  const [startUpLocalSummary, setStartUpLocalSummary] = useState(null)
  // Extracted Auth Token
  const accessToken = get(userDetails, "data.auth_token", null)
  const stripe_reference = get(userProfileLocal, "stripe_reference", null)

  // Extracted States From OrderSummary
  const extraProteinPrice = get(orderSummaryLocal, "extra_protein_price", 0)
  const addon_price = get(orderSummaryLocal, "addon_price", 0)
  const active_order_id = get(orderSummaryLocal, "order.id", null);
  const availableDeliveryDays = get(orderSummaryLocal, "order_history.days_food_delivery", [])
  const addresses = get(orderSummaryLocal, "addresses", [])
  const cardsFiltered = get(orderSummaryLocal, "cards", []);
  const guest = get(orderSummaryLocal, "guest", null)
  const summaryProfile = get(orderSummaryLocal, "profile", null)
  const promoDiscount = get(orderSummaryLocal, "promo_discount", null)
  const subTotalUnRounded = get(orderSummaryLocal, "sub_total", null)
  // const subTotal = subTotalUnRounded ? roundHalfDown(subTotalUnRounded) : subTotalUnRounded;
  const total_bag_fees = get(orderSummaryLocal, "total_bag_fees", null)
  const subTotal = subTotalUnRounded;
  const firstTimeOrder = get(orderSummaryLocal, "order_count_paid", 0)
  const subscriptionDiscount = get(
    orderSummaryLocal,
    "subscription_discount",
    null
  )
  // const userProfileFordiscount = get(orderSummaryLocal, "discount", null) // old code to get promo code
  const discountLocalProfile = get(orderSummaryLocal, "profile", null) // old code to get promo code
  const userProfileFordiscount = discountLocalProfile; 
  // const userProfileFordiscount = {promo_code : discountLocalProfile?.promo_code ?? null} // new code to get promo code from profile
  const checkoutSummarySubscriptionDiscount = get(
    checkoutSummaryLocal,
    "orderData.subscriptionDiscount",
    null
  )
  const checkoutSummaryDiscountType = get(
    checkoutSummaryLocal,
    "orderData.promoSummary.type",
    ""
  )
  const totalAmount = get(orderSummaryLocal, "total_amount", null)
  const totalWeeks = get(
    orderSummaryLocal,
    "order_history.meal_plan_require_weeks",
    ""
  )
  const desclaimer = get(orderSummaryLocal, "order_history.disclaimer", "")
  // const promoSummaryTitle = get(promoCodeSummaryLocal, "promo_code", "");

  // const promoDiscountValueWRTWeek = get(promoCodeSummaryLocal, "value", ""); // use this when want old flow
  const promoId = get(promoCodeSummaryLocal, "id", "")
  const allTimeSlot = get(startUpLocalSummary, "time_slots", [])
  const [discountType, setDiscountType] = useState("")
  const [promoRedux, setPromoRedux] = useState("")

  const subscribedStatus = get(userProfileLocal, "profile.is_subscribed", "")
  const currentTimeSlot = get(userProfileLocal, "profile.delivery_time", "")
  const topUpStatus = get(tickerLocal, "not_paid_type", "")
  const walletAmount = get(tickerLocal, "wallet", 0)
  const mealPlanDuration = get(
    orderSummaryLocal,
    "order_history.meal_plan_require_weeks",
    ""
  )
  const promoDiscountDuration = get(
    promoCodeSummaryLocal,
    "length_plan_weeks",
    ""
  )

  const delivery_time_slot = get(
    orderSummaryLocal,
    "order_history.delivery_time",
    ""
  )

  const proteinDisclaimer = get(
    orderSummaryLocal,
    "order_history.protein_disclaimer",
    ""
  )
  const extras_disclaimer = get(
    orderSummaryLocal,
    "order_history.extras_disclaimer",
    ""
  )
  const addon_disclaimer = get(
    orderSummaryLocal,
    "order_history.addon_disclaimer",
    ""
  )
  const { orderHistory } = useSelector((state) => state.home);
  const UsePaymobAllTime = process.env.NEXT_PUBLIC_USE_PAYMOB_ALL_TIME == 'true' || process.env.NEXT_PUBLIC_USE_PAYMOB_ALL_TIME == true ? true : false;
  const isRenewalOrder = orderHistory?.length > 1 && orderHistory?.some((item)=> item?.payment_status == AppConstants.paid) ? true : false;
  const FirstUnPaidOrder = ((orderHistory?.length == 1 && orderHistory?.[0]?.payment_status == AppConstants.unpaid) && (process.env.NEXT_PUBLIC_PAYMOB_FOR_FIRST_TIME_USER == 'true' || process.env.NEXT_PUBLIC_PAYMOB_FOR_FIRST_TIME_USER == true)) ? true : false; // comenting for striple only
  // const FirstUnPaidOrder =  false; 
  /* NOTE -  
  Address API call is for default Address and default card only
  (Don't use it for anything else as it is not called again)
  */
  const defaultCard = get(allCardsDataLocal, "default_card", null)
  const defaultAddress = get(allAddressDataLocal, "default_address", null)
  const userProfileFromCheckoutSummary = get(orderSummary, "profile", null);
  // Body For API Call
  const [orderSummaryParams, setOrderSummaryParams] = useState({
    type: "",
    promo_code: ""
  })

  const [checkoutBody, setCheckoutBody] = useState({
    is_subscribed: false,
    time_slot: null,
    address_id: null,
    card_id: null,
    price: null,

    instructions: "",
    promo_code: null,
    discount_id: null
  })
  const [defaultAddressLocal, setdefaultAddressLocal] = useState(null)
  const [cardDefaultLocal, setcardDefaultLocal] = useState(null)
  const [radioVal,setRadioVal]=useState(0);
  const [AddressLoader, setAddressLoader] = useState(false)
  const [orderType, setOrderType] = useState(null)
  const [buttonClicked,setButtonClicked]=useState(false)
  // const conditionForPaymob = (userProfileLocal?.profile?.is_beta == 1) ?? false; // comenting fo rsitriple only
  const conditionForPaymob = (UsePaymobAllTime || ((userProfile?.profile?.is_beta == 1) && (process.env.NEXT_PUBLIC_USE_PAYMOB == 'true' || process.env.NEXT_PUBLIC_USE_PAYMOB == true))) ? true : false; // comenting fo rsitriple only
  // const conditionForPaymob =  false;
  const [discountSummaryLocal, setDiscountSummaryLocal] = useState(null)
  const subscriptionStatus = get(ticker, "profile.is_subscribed", -1)
  const renewalPaymentStatus = get(renewalData, "order.payment_status")
  const [IframeUrl,setIframeUrl]=useState('');
  const [PaymentURL,setPaymentURL]=useState('');
  const [ModalPaymentOpen,setModalPaymentOpen]=useState(false);
  const [GtmCodeInject,setGtmCodeInject]=useState(false);
  const [SecretToken, setSecretToken] = useState(null);
  const [promoSummaryTitleVar, setpromoSummaryTitleVar ] = useState('')
  const week_discount_details = get(orderSummaryLocal, "week_discount_details", null);
  const display_key = get(orderSummaryLocal, "week_discount_details.display_key", null);
  const discounted_priceUnRound = get(orderSummaryLocal, "week_discount_details.discounted_price", null);
  const is_new_pricing_user = get(orderSummaryLocal, "is_new_pricing_user", false);
  const discount_amount = get(orderSummaryLocal, "week_discount_details.discount_amount", 0);
  const discounted_price_withoutBagFee = discounted_priceUnRound ? Number(roundHalfDown(discounted_priceUnRound)).toFixed(2) : null;
  // comment // const discounted_price = discounted_price_withoutBagFee ? Number(Number(discounted_price_withoutBagFee) + total_bag_fees).toFixed(2) : Number(discounted_price_withoutBagFee);
  const subtotal_weekDis = (get(orderSummaryLocal, "meal_price", 0) + get(orderSummaryLocal, "snack_price", 0)) + total_bag_fees + extraProteinPrice +addon_price;
  // const discounted_price = discount_amount ? Number( subtotal_weekDis - Number(discount_amount)) : Number(discounted_price_withoutBagFee);
  const discounted_price = discount_amount ? !is_new_pricing_user ? 
                                             Number(subTotal) :
                                             Number( subtotal_weekDis - Number(discount_amount)) :
                          Number(discounted_price_withoutBagFee);
  const NonDisocuntAmountSave = week_discount_details ? week_discount_details?.discount_amount : null;
  // const getPromoCodeDiscountValue = (promoCodeSummary, weekInNumber) => { 
  //   // const meal_plan_require_weeks = orderHistory?.[0]?.history?.meal_plan_require_weeks ?? 0;
  //   const meal_plan_require_weeks = weekInNumber ?? 0;
  //   if(promoCodeSummary?.promo_type == AppConstants?.promoCodeTypes?.referral_friend){

  //     const referalDiscount = get(promoCodeSummary, "referral_discount", []);
  //     const planWeek = referalDiscount?.find((item) => item?.week == meal_plan_require_weeks) ?? '';
  //     if(planWeek?.reward_value == null || planWeek?.reward_value == undefined){
  //       return "";
  //     }
  //     const value = typeof planWeek?.reward_value == 'number' ? planWeek?.reward_value : Number(planWeek?.reward_value) || 0;
  //     return value;

  //   }else{

  //     const referalDiscount = get(promoCodeSummary, "discount_plan_lengths", []);
  //     const planWeek = referalDiscount?.find((item) => Number(item?.plan_length) == meal_plan_require_weeks) ?? '';
  //     if(planWeek?.reward_value == null || planWeek?.reward_value == undefined){
  //       return "";
  //     }
  //     const value = typeof planWeek?.reward_value == 'number' ? planWeek?.reward_value : Number(planWeek?.reward_value) || 0;
  //     return value;
    
  //   }
  // }
  const getTitle=(promoSummary)=>{
    if(promoSummary?.promo_type == AppConstants?.promoCodeTypes?.ambassador_individual){
      const foundYourPromo = promoCodeSummaryLocal?.ambassador_referral_codes?.find((item) => item == promoCodeString);
      if(promoCodeString && foundYourPromo){
        return promoCodeString;
      }else{
         if(userProfileFromCheckoutSummary?.promo_code){
           return userProfileFromCheckoutSummary?.promo_code || "";  
          }else{
            if(promoCodeString){
              return promoCodeString || "";  
            }
            return promoSummary?.promo_code || "";  
          }
      }
    } else{
      return promoSummary?.promo_code || "";
    }
  }
  useEffect(()=>{
    // use effect intnded for title only, and when no avail title, in subscribe case then it wil rmvoe code too
    if(radioVal && meal_plan_require_weeks && promoCodeSummaryLocal ){
      const weekInNumber = radioVal == 0 ? meal_plan_require_weeks : 4; // getting from order summary local
      const type = promoCodeSummaryLocal?.promo_type;
      const refrealType = type === AppConstants?.promoCodeTypes?.referral_friend;
    
      // pick plan (for referral or normal)
      const discountPlanLengths = refrealType
        ? (promoCodeSummaryLocal?.referral_discount || [])
        : (promoCodeSummaryLocal?.discount_plan_lengths || []);
    
      const matchingPlan = discountPlanLengths?.find(
        (item) => Number(refrealType ? item?.week : item?.plan_length) == Number(weekInNumber)
      );
      
      if(!matchingPlan){
        removeAppliedPromo();
        return
      }
    }

    if(isExecutive && promoSummaryTitleVar){
      if(isRenewalOrder){
        setpromoSummaryTitleVar(orderSummaryLocal?.discount?.promo_code)
      }
    }else{
      if(orderSummaryLocal && (promoCodeSummaryLocal || promoCodeString) && isExecutive != null){
        const promoSummaryTitle = getTitle(isExecutive ? discountSummaryLocal : promoCodeSummaryLocal);
        setpromoSummaryTitleVar(promoSummaryTitle)
      }
    }
  },[promoCodeSummaryLocal, promoCodeString, userProfileFromCheckoutSummary, isExecutive, discountSummaryLocal, orderSummaryLocal, radioVal, meal_plan_require_weeks])


  // const promoSummaryTitle = getTitle(promoCodeSummaryLocal);
  const promoSummaryTitle = promoSummaryTitleVar;
  const mealPrice = orderSummaryLocal?.meal_price
  const snackPrice = orderSummaryLocal?.snack_price
  const meal_plan_require_weeks = radioVal == 1 ? 4 : orderSummaryLocal?.order_history?.meal_plan_require_weeks
  const promoDiscountValueWRTWeek = getPromoCodeDiscountValue(promoCodeSummaryLocal, meal_plan_require_weeks ? meal_plan_require_weeks : orderHistory?.[0]?.history?.meal_plan_require_weeks);
  const promoDiscountValueWRTWeekToDisplay = getPromoCodeDiscountValueToDisplay(promoCodeSummaryLocal, meal_plan_require_weeks ? meal_plan_require_weeks : orderHistory?.[0]?.history?.meal_plan_require_weeks);
  
  const percentCalculationV1 = (number, percentToCount, promoCodeSummaryLocal, mealNsnack) => {
    const mealPrice = Number(mealNsnack?.meal_price ?? mealNsnack?.meal_price ?? 0)
    const snackPrice = Number(mealNsnack?.snack_price ?? mealNsnack?.snack_price ?? 0)
    const discountOnArr = Array.isArray(promoCodeSummaryLocal?.discount_on) ? promoCodeSummaryLocal?.discount_on : [];
    const onMeals = discountOnArr?.includes('meals');
    const onSnacks = discountOnArr?.includes('snacks');
    const onBoth = onMeals && onSnacks; 
    const parsedNumber = parseFloat(number);
    const parsedPercent = parseFloat(percentToCount);
    
    if (isNaN(parsedNumber) || isNaN(parsedPercent)) {
      return 0;
    }
    
    if(onBoth){
      const percent = (parsedPercent * parsedNumber) / 100;
      return percent.toFixed(2);
    } else if(onMeals && !onSnacks){
      const percent = (mealPrice * parsedNumber) / 100;
      return percent.toFixed(2);
    } else if(!onMeals && onSnacks){
      const percent = (snackPrice * parsedNumber) / 100;
      return percent.toFixed(2);
    }else{
      return 0;
    }
  };

const percentCalculationV2 = (
  number,
  percentToCount,
  promoCodeSummaryLocal,
  mealNsnack,
  // weekInNumber
) => {
  const weekInNumber = radioVal == 0 ? meal_plan_require_weeks : 4; // getting from order summary local
  const mealPrice  = Number(mealNsnack?.meal_price ?? 0);
  const snackPrice = Number(mealNsnack?.snack_price ?? 0);

  const discountOnArr = Array.isArray(promoCodeSummaryLocal?.discount_on)
    ? promoCodeSummaryLocal.discount_on
    : [];
  const onMeals  = discountOnArr.includes('meals');
  const onSnacks = discountOnArr.includes('snacks') || discountOnArr.includes('snack');
  const onBoth   = onMeals && onSnacks;

  const parsedPercent = parseFloat(percentToCount); // acts as "base" when onBoth
  const parsedNumber  = parseFloat(number);         // acts as "percent" value (e.g., 50)

  if (isNaN(parsedNumber)) return 0;
  // We'll compute base in a moment; base must be numeric
  if (onBoth && isNaN(parsedPercent)) return 0;

  // --- find cap for the selected week ---
  // const plans = Array.isArray(promoCodeSummaryLocal?.discount_plan_lengths)
  //   ? promoCodeSummaryLocal.discount_plan_lengths
  //   : [];

  // // pick week: prefer explicit arg; fall back to any known hints or first plan
  // const pickedWeek =
  //   Number(weekInNumber ?? promoCodeSummaryLocal?.selected_week ?? promoCodeSummaryLocal?.plan_length
  //     ?? (Array.isArray(promoCodeSummaryLocal?.length_plan_weeks) ? promoCodeSummaryLocal.length_plan_weeks[0] : NaN));

  // let matchingPlan = null;
  // if (!Number.isNaN(pickedWeek)) {
  //   matchingPlan = plans.find(p => Number(p?.plan_length ?? p?.week) === Number(pickedWeek)) || null;
  // }
  // if (!matchingPlan && plans.length) {
  //   matchingPlan = plans[0]; // graceful fallback
  // }


  const type = promoCodeSummaryLocal?.promo_type;
  const refrealType = type === AppConstants?.promoCodeTypes?.referral_friend;

  // pick plan (for referral or normal)
  const discountPlanLengths = refrealType
    ? (promoCodeSummaryLocal?.referral_discount || [])
    : (promoCodeSummaryLocal?.discount_plan_lengths || []);

  const matchingPlan = discountPlanLengths?.find(
    (item) => Number(refrealType ? item?.week : item?.plan_length) == Number(weekInNumber)
  );

  const capRaw    = matchingPlan?.cap_amount;
  const capAmount = (capRaw == null || capRaw === '') ? null : Number(capRaw);

  // --- compute base depending on discount_on ---
  let base = 0;
  if (onBoth) {
    base = Number(parsedPercent);     // your original logic: base comes from percentToCount
  } else if (onMeals && !onSnacks) {
    base = mealPrice;
  } else if (!onMeals && onSnacks) {
    base = snackPrice;
  } else {
    return 0; // no valid discount target
  }

  if (isNaN(base)) return 0;

  // --- raw percent discount ---
  const rawDiscount = (base * parsedNumber) / 100;

  // --- apply cap if present ---
  const appliedDiscount = (capAmount != null && !Number.isNaN(capAmount) && matchingPlan?.reward_type == AppConstants?.foodPriceTypes?.percent)
    ? Math.min(rawDiscount, capAmount)
    : rawDiscount;
 
  // const rounded = roundHalfDown(appliedDiscount.toFixed(2))
  const rounded = roundHalfDown(appliedDiscount)
  // return appliedDiscount.toFixed(2);
  return rounded.toFixed(2)
};
const checkIfCapped = (
  number,
  percentToCount,
  promoCodeSummaryLocal,
  mealNsnack,
  // weekInNumber
) => {
  const weekInNumber = radioVal == 0 ? meal_plan_require_weeks : 4; // getting from order summary local
  const mealPrice  = Number(mealNsnack?.meal_price ?? 0);
  const snackPrice = Number(mealNsnack?.snack_price ?? 0);

  const discountOnArr = Array.isArray(promoCodeSummaryLocal?.discount_on)
    ? promoCodeSummaryLocal.discount_on
    : [];
  const onMeals  = discountOnArr.includes('meals');
  const onSnacks = discountOnArr.includes('snacks');
  const onBoth   = onMeals && onSnacks;

  const parsedPercent = parseFloat(percentToCount); // acts as "base" when onBoth
  const parsedNumber  = parseFloat(number);         // acts as "percent" value (e.g., 50)

  if (isNaN(parsedNumber)) return false;
  // We'll compute base in a moment; base must be numeric
  if (onBoth && isNaN(parsedPercent)) return false;

  // --- find cap for the selected week ---
  // const plans = Array.isArray(promoCodeSummaryLocal?.discount_plan_lengths)
  //   ? promoCodeSummaryLocal.discount_plan_lengths
  //   : [];

  // // pick week: prefer explicit arg; fall back to any known hints or first plan
  // const pickedWeek =
  //   Number(weekInNumber ?? promoCodeSummaryLocal?.selected_week ?? promoCodeSummaryLocal?.plan_length
  //     ?? (Array.isArray(promoCodeSummaryLocal?.length_plan_weeks) ? promoCodeSummaryLocal.length_plan_weeks[0] : NaN));

  // let matchingPlan = null;
  // if (!Number.isNaN(pickedWeek)) {
  //   matchingPlan = plans.find(p => Number(p?.plan_length ?? p?.week) === Number(pickedWeek)) || null;
  // }
  // if (!matchingPlan && plans.length) {
  //   matchingPlan = plans[0]; // graceful fallback
  // }


  const type = promoCodeSummaryLocal?.promo_type;
  const refrealType = type === AppConstants?.promoCodeTypes?.referral_friend;

  // pick plan (for referral or normal)
  const discountPlanLengths = refrealType
    ? (promoCodeSummaryLocal?.referral_discount || [])
    : (promoCodeSummaryLocal?.discount_plan_lengths || []);

  const matchingPlan = discountPlanLengths?.find(
    (item) => Number(refrealType ? item?.week : item?.plan_length) == Number(weekInNumber)
  );

  const capRaw    = matchingPlan?.cap_amount;
  const capAmount = (capRaw == null || capRaw === '') ? null : Number(capRaw);
  if(capAmount == null){
    return false
  }
  // --- compute base depending on discount_on ---
  let base = 0;
  if (onBoth) {
    base = Number(parsedPercent);     // your original logic: base comes from percentToCount
  } else if (onMeals && !onSnacks) {
    base = mealPrice;
  } else if (!onMeals && onSnacks) {
    base = snackPrice;
  } else {
    return false; // no valid discount target
  }

  if (isNaN(base)) return false;

  // --- raw percent discount ---
  const rawDiscount = (base * parsedNumber) / 100;
  if (rawDiscount > capAmount) {
    return true
  }else{
    return false
  }
};
  const [loaderFirsttimeDisc, setloaderFirsttimeDisc] = useState(false);
  const [orderSummeryOnlyLoader, setorderSummeryOnlyLoader] = useState(false);

  const handleGetAllAddressRequest = () => {
    try {
      const { auth_token } = userDetails?.data

      dispatch(getAllAddressRequest({ token: auth_token }))
        .then(unwrapResult)
        .then((res) => {
          const addresses = res?.data?.data?.address;
          const defAddress = res?.data?.data?.default_address;
          if(defAddress){
            setTimeout(() => {
              setdefaultAddressLocal(defAddress)
              // setCheckoutBody({
              //   ...checkoutBody, address_id: defAddress?.id, time_slot: defAddress?.time_slot
              // })
            }, 200);
          }else{
            if (addresses?.length == 1 && (!defaultAddress || (checkoutBody?.address_id == null || checkoutBody?.time_slot == ""))) {
              setdefaultAddressLocal(addresses?.[0])
              // setCheckoutBody({ ...checkoutBody, address_id: addresses?.[0]?.id, time_slot: addresses?.[0]?.time_slot })
            }
          }
          AppLogger("This is resposne aaddress=========", res)
        })
        .catch((err) => {
          AppLogger("This is error=========", err)
        })
    } catch (err) {
      AppLogger("This is error=======", err)
    }
  }
  const handleGetAllCardsRequest = () => {
    try {
      const { auth_token } = userDetails?.data

      dispatch(getAllCardsRequest({ token: auth_token, cardType: conditionForPaymob ? "paymob":'stripe' }))
        .then(unwrapResult)
        .then((res) => {
          const cards = res?.data?.data?.card;
          // const filteredCard = conditionForPaymob ? cards?.find((card)=>card?.paymob_card_id)
          const PaymobCard = res?.data?.data?.default_card?.paymob_card_id ? res?.data?.data?.default_card : null;
          const responseDefCard = conditionForPaymob ? PaymobCard : res?.data?.data?.default_card;
          
          if(responseDefCard){
            setcardDefaultLocal(responseDefCard)
            // setCheckoutBody({
            //   ...checkoutBody,card_id: responseDefCard?.id})
          }
          if(!responseDefCard && cards?.length > 0){
            setcardDefaultLocal(cards?.[0])
            // setCheckoutBody({
            //   ...checkoutBody,card_id: cards?.[0]?.id})
            responseDefCard == null && onSelectCardHandler(cards?.[0]?.id)
            }
          // if(!defaultCard || checkoutBody?.card_id == null){
          //   setCheckoutBody({
          //     ...checkoutBody,card_id: default_card})
          //   defaultCardSelector(res?.data?.cards)
          // }
          AppLogger("This is resposne=========", res)
        })
        .catch((err) => {
          AppLogger("This is error=========", err)
        })
    } catch (err) {
      AppLogger("This is error=======", err)
    }
  }
  const userLocalDataHandler = () => {
    try {
      if (checkoutSummary) {
        const { orderData, address_detail, card_detail } = checkoutSummary

        if (orderData) {
          checkoutBody.address_id = orderData?.address_id
          checkoutBody.card_id = orderData?.card_id
          checkoutBody.discount_id = orderData?.discount_id
          checkoutBody.is_subscribed = orderData?.is_subscribed

          checkoutBody.instructions = orderData?.instructions
          checkoutBody.time_slot = orderData?.time_slot
          if (orderData.discount_id && topUpStatus !== "top up") {
            customTimeout(() => {
              console.log("orderData inside handler",orderData)
              const discountData = isExecutive
              ? (orderData.promoSummary?.parent ?? orderData.promoSummary)
              : orderData.promoSummary
              setPromoCodeSummaryLocal(discountData)

              setPromoApplied(true)
              setPromoCode(orderData?.promoSummary?.promo_code) // open me
            }, 500)
            AppLogger(
              "this is promo summary local=====",
              orderData.promoSummary
            )
            AppLogger("thisi is promoApplied=========", promoApplied)
            AppLogger("thisi is PromoCode=========", promoCode)
          }

          if (orderData.is_subscribed) {
            orderSummaryParams.type = AppConstants.paymentMethods.subscribe

            console.log("Thsisi is in if=========", orderData)
            setOrderSummaryParams({ ...orderSummaryParams })
            checkoutBody.is_subscribed = true
            // handleGetOrderSummaryRequest()
            // handlePaymentMethodType(1)
          }
          console.log("this si checkoutbody==========", checkoutBody)
          console.log(
            "this is subscription discount==========",
            subscriptionDiscount
          )
          setCheckoutBody({ ...checkoutBody })
        }
      }
    } catch (err) {
      AppLogger("This is error at userLocalDataHandler========", err)
    }
  }
  const handleStripeCardEdit = async ({ stripeCardId, payload, cardId }) => {
    try {
      setApiLoading(true)
      if (stripe_reference && stripeCardId) {
        const editCardResponse = await STRIPE.customers.updateSource(
          stripe_reference,
          stripeCardId,
          { ...payload }
        )

        const { name, exp_month, exp_year } = payload

        if (editCardResponse && name && exp_month && exp_year) {
          const editCardBody = {
            name,
            expiry_date: `${exp_month}/${exp_year}`,
            card_id: cardId
          }

          dispatch(editCardRequest({ accessToken, editCardBody }))
            .then(unwrapResult)
            .then((res) => {
              AppLogger("this  is userEditCardHandler", res)
              setDataUpdated(!dataUpdated)
              setShowAddCardPopup(false)
              setApiLoading(false)
            })
            .catch((err) => {
              showFaliureToast(err?.message)
              setApiLoading(false)
              AppLogger("this is error at userEditCardHandler", err)
            })
        }
      }else{
      showFaliureToast("Cannot update card, it doesnt belong to stripe")
      setApiLoading(false)
      }
    } catch (error) {
      setCardError(error?.message)
      customTimeout(() => {
        if (error) {
          setCardError("")
        }
      }, 5000)
      setApiLoading(false)
      AppLogger("Error at userEditCardHandler", error)
    }
  }
  const handleAddCardRequest = async (cardBody) => {
    const expiryD = get(cardBody, "expiryDate", "")
    try {
      setApiLoading(true)
      const paymobCard = cardBody?.type == "paymob" ? true : false; // commenting for stripe only
      // const paymobCard = false;
      if (!paymobCard) {
        await !paymobCard && STRIPE.tokens.create({
          card: {
            number: get(cardBody, "cardNumber", ""),
            exp_month: expiryD.split("/")[1],
            exp_year: expiryD.split("/")[2],
            cvc: get(cardBody, "cvv", "")
          }
        }).then((res) => {
  
          const addCardBody = {
            reference: res?.id,
            card_id: res?.card?.id,
            name: cardBody?.name,
            card_number: `**** **** **** ${res?.card?.last4}`,
            brand: res?.card.brand,
            expiry_date: expiryD?.length > 3 ? expiryD.slice(3, 10) : "",
            type: 'stripe'
          }
          dispatch(
            addCardRequest({
              accessToken: accessToken,
              addCardBody: { ...addCardBody }
            })
          )
            .then(unwrapResult)
            .then((res) => {
              const cardId = res?.data?.id;
              const firstCardCheck = cards?.length == 0;
              AppLogger("Response at addCardRequest", res)
               if(FirstUnPaidOrder ) {
                if(conditionForPaymob){
                  if(firstCardCheck){ 
                   onSelectCardHandler(cardId)
                 }
                }
               }else{
                   onSelectCardHandler(cardId)
               }
              setShowAddCardPopup(false)
              setDataUpdated(!dataUpdated)
              setApiLoading(false)
            })
            .catch((err) => {
              showFaliureToast(err?.message)
              setApiLoading(false)
              AppLogger("Error at addCardRequest", err?.message)
            })
        })
  
      } else {
        if (cardBody?.card_id) {
          dispatch(
            addCardRequest({
              accessToken: accessToken,
              addCardBody: { ...cardBody }
            })
          )
            .then(unwrapResult)
            .then((res) => {
              AppLogger("Response at addCardRequest", res)
              setShowAddCardPopup(false)
              setDataUpdated(!dataUpdated)
              setApiLoading(false)
            })
            .catch((err) => {
              showFaliureToast(err?.message)
              setApiLoading(false)
              AppLogger("Error at addCardRequest", err)
            })
        }
      }
    }
    catch (error) {
      setCardError(error.message)
      customTimeout(() => {
        if (error) {
          setCardError("")
        }
      }, 5000)
      setApiLoading(false)
      AppLogger("Error at categoriesHandler", error.message)
    }
  }
  const callStartUpFilesHandler = () => {
    try {
      dispatch(StartUpRequest({ token: accessToken }))
        .then(unwrapResult)
        .then((response) => {
          AppLogger("Response at StartUpRequest", response)
        })
        .catch((error) => {
          AppLogger("Error at StartUpRequest", error)
        })
    } catch (err) {
      AppLogger("Error at callStartUpFilesHandler", err)
    }
  }
  const handleDeleteCardRequest = (card_id) => {
    dispatch(deleteCardRequest({ accessToken, card_id }))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at deleteCardRequest", res)
        // setcheckOut
        checkoutBody.card_id = null
        setCheckoutBody({ ...checkoutBody })
        handleGetOrderSummaryRequest()
      })
      .catch((err) => {
        AppLogger("Error at deleteCardRequest", err)
      })
  }
  const handleAddAddressRequest = (addressBody) => {
    setAddressLoader(true)
    const addAddressBody = {
      address_line_one: "-",
      ...(!isExecutive && {
        type: get(addressBody, "type", ""),
      }),
      label: get(addressBody, "label", ""),
      emirate_id: get(addressBody, "emirate_id", ""),
      area_id: get(addressBody, "area_id", ""),
      street: get(addressBody, "street", ""),
      apartment: get(addressBody, "apartment", ""),
      time_slot: `${get(addressBody, "emiratesValue", "")}:${get(
        addressBody,
        "time_slot",
        ""
      )}`,
      days: get(addressBody, "days", ""),
      ...(isExecutive && {
        company_address_id: addressBody.company_address_id
      }),
    }
    setTimeout(() => {
      document.body.style.overflow = 'visible'
    }, 300);
    dispatch(addAddressRequest({ accessToken, addAddressBody }))
      .then(unwrapResult)
      .then((res) => {
        setAddressLoader(false)
        AppLogger("Response at addAddressRequest", res)
        // Success Toast for changes in addresses
        showSuccessToast(AppConstants.checkoutAddressToastMessage);
        getAddressWithDays();
        handleGetAllAddressRequest()
        setShowAddressPopup(false)
        setDataUpdated(!dataUpdated)
      })
      .catch((err) => {
        setAddressLoader(false)
        showFaliureToast(err.message)
        AppLogger("Error at addAddressRequest", err)
      })
  }
  const handleUpdateAddressRequest = (addressData) => {
    setAddressLoader(true)
    
    const updateAddressBody = {
      label: get(addressData, "label", ""),
      address_line_one: "-",
      [isExecutive ? "company_address_id" : "address_id"]: get(addressData, "address_id", ""),
      emirate_id: get(addressData, "emirate_id", ""),
      type: get(addressData, "type", ""),
      area_id: get(addressData, "area_id", ""),
      street: get(addressData, "street", ""),
      apartment: get(addressData, "apartment", ""),
      time_slot: `${get(addressData, "emiratesValue", "")}:${get(
        addressData,
        "time_slot",
        ""
      )}`,
      days:  get(addressData, "days", ""),
    }
    dispatch(updateAddressRequest({ accessToken, updateAddressBody }))
      .then(unwrapResult)
      .then((res) => {
        setAddressLoader(false)
        AppLogger("Response at addAddressRequest", res)
        // Success Toast for changes in addresses
        showSuccessToast(AppConstants.checkoutAddressToastMessage);
        getAddressWithDays()
        setShowAddressPopup(false)
        setDataUpdated(!dataUpdated)
      })
      .catch((err) => {
        setAddressLoader(false)
        AppLogger("Error at updateAddressRequest", err)
      })
  }
  const handleDeleteAddressRequest = (address_id) => {
    dispatch(deleteAddressRequest({ accessToken, address_id }))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at deleteAddressRequest", res)
        handleGetOrderSummaryRequest()
        checkoutBody.address_id = null
        setCheckoutBody({ ...checkoutBody })
      })
      .catch((err) => {
        AppLogger("Error at deleteAddressRequest", err)
      })
  }
  const handleGetOrderSummaryRequest = async (order_id) => {
    try {
      setorderSummeryOnlyLoader(true) 
      await dispatch(
        getOrderSummaryRequest({
          accessToken,
          orderSummaryParams,
          order_id: order_id ?? null,
          promo_code: ''
        })
      )
        .then(unwrapResult)
        .then((res) => {
          if(orderSummaryParams.type ==  AppConstants.paymentMethods.subscribe){
            setRadioVal(1)
          } else {
            setRadioVal(0)
          }
        setorderSummeryOnlyLoader(false) 
          AppLogger("Response at getOrderSummaryRequest", res);
            const repsonseCards = res?.data?.cards;
            const firstCardCheck = repsonseCards?.length == 1;
            if( firstCardCheck && !defaultCard){
            defaultCard == null &&  onSelectCardHandler(repsonseCards?.[0]?.id);
              // setTimeout(() => {
              //   setCheckoutBody({
              //     ...checkoutBody,
              //     card_id: repsonseCards?.[0]?.id
              //   })
              // }, 800);
            }else{
              if(defaultCard && repsonseCards?.length > 0){
                // setCheckoutBody({
                //   ...checkoutBody,
                //   card_id: defaultCard?.id
                // })
              }else{
                // setCheckoutBody({
                //   ...checkoutBody,
                //   card_id: repsonseCards?.[0]?.id
                // })
              }
            }
            if(!defaultCard){
              // defaultCardSelector()
            }
            // if (promoCode && topUpStatus !== "top up") {
            //   handleGetOrderDiscount({
            //     promoCode,
            //     is_subscribed: checkoutBody.is_subscribed,
            //     order_id: router.query.order_id
            //   })
            // }
          return res;
        })
        .catch((err) => {
        setorderSummeryOnlyLoader(false) 
          console.log("order iddddd",router.query.order_id ? router.query.order_id : order_id)
          AppLogger("Error at getOrderSummaryRequest", err)
          if (err?.message == "Your Order is already paid") {
            showFaliureToast(err?.message);
            handleGetOrderSummaryPaidRequest(router.query.order_id ? router.query.order_id : order_id )
          }
          // seterror
        })
      
    } catch (error) {
        setorderSummeryOnlyLoader(false) 
    } 
  }
  const goToCompleteOrderRequest = (localDataToSave) => {
    try {
      // if(conditionForPaymob == true){
      //   return
      // }
      handlePlaceMyOrderRequest(localDataToSave)
      // Removed final order API as it is depriciated
      // dispatch(
      //   saveCheckOutSummary({
      //     accessToken,
      //     checkoutBody,
      //     orderSummary,
      //     subTotal,
      //     subscriptionDiscount,
      //     promoCodeSummaryLocal,
      //     order_id: router.query.order_id != 'null' && router.query.order_id ? router.query.order_id : orderSummary?.order_history?.order_id,
      //     extra_protein_price: extraProteinPrice
      //   })
      // )
      //   .then(unwrapResult)
      //   .then((res) => {
      //     console.log("this is res======", res)
      //     // setPromoCodeSummaryLocal(null)
      //     // setSubDiscount(null)
      //     // setCheckoutBody({
      //     //   is_subscribed: false,
      //     //   time_slot: null,
      //     //   address_id: null,
      //     //   card_id: null,
      //     //   price: null,
      //     //   instructions: null,
      //     //   promoCode: null,
      //     //   discount_id: null
      //     // })
      //     // router.push(AppRoutes.confirmCheckOut)
      //     handlePlaceMyOrderRequest()
      //     AppLogger("Response at checkOutRequest", res)
      //   })
      //   .catch((err) => {
      //     AppLogger("Error at checkOutRequest", err)
      //     showFaliureToast(err?.message)
      //   })
    } catch (err) {
      AppLogger("this is error at=========goToCompleteOrderRequest", err)
    }
  }

  const renewalTickerChecker = () => {
    if (subscriptionStatus == 0) {
      if (renewalPaymentStatus) {
        if (renewalPaymentStatus == "unpaid") {
          return true
        } else {
          return false
        }
      } else if (!renewalPaymentStatus) {
        return true
      }
    } else {
      return false
    }
  }
  function getOrderId(router, orderSummary) {
  const rawId = router.query.order_id !== 'null' && router.query.order_id
    ? router.query.order_id
    : orderSummary?.order_history?.order_id;

  return Number.isInteger(rawId)
    ? rawId
    : parseInt(rawId, 10) || null;
}
  const handlePlaceMyOrderRequest = (localDataToSave) => {
    try {

      if (checkoutBody) {
        // setLoading(true)
        const addedWalletAmount = promoCodeWalletCredit?.planWalletCredit ? 
        walletAmount ?
        walletAmount > subTotal ? subTotal :
        Number(walletCreditAmount) + walletAmount :
        Number(walletCreditAmount): 0;
        let newCheckoutBody = {
          ...checkoutBody,
          price: 
          week_discount_details && !discountSummaryLocal?
          discounted_price :
          promoCodeWalletCredit?.planWalletCredit ? addedWalletAmount :  checkoutBody.price > 0 ? checkoutBody.price : 0,
          is_cap_amount: (localDataToSave?.is_cap_amount == 1 || localDataToSave?.is_cap_amount == true) ? 1 : 0,
          // price: 884,
          discount_id:
          checkoutBody.discount_id ? checkoutBody.discount_id :
          // promoCodeSummaryLocal ? promoCodeSummaryLocal?.id :
          topUpStatus == "top up" ? null : checkoutBody.discount_id,
          checkout_type:(conditionForPaymob || FirstUnPaidOrder) ? "paymob":'stripe',
          time_slot: checkoutBody.time_slot ? checkoutBody.time_slot : defaultAddressLocal?.time_slot,
          address_id: checkoutBody.address_id ? checkoutBody.address_id : defaultAddressLocal?.id,
          card_id: checkoutBody.card_id ? checkoutBody.card_id : cardDefaultLocal?.id,
          // promo_code: checkoutBody.promo_code ? checkoutBody.promo_code : promoSummaryTitle,
          promo_code: promoSummaryTitle ? promoSummaryTitle : checkoutBody.promo_code,
          cashback_amount : promoCodeWalletCredit ? 50 : 0,
          is_wallet_credit : promoCodeWalletCredit ? 1 : 0,
          is_renewal: isRenewalOrder ? 1 : 0,
          // order_id:checkoutBody.order_id ? checkoutBody.order_id : router.query.order_id != 'null' && router.query.order_id ? router.query.order_id : orderSummary?.order_history?.order_id,
        }
        setCheckOutLoader(true)
        dispatch(
          checkOutRequest({
            accessToken,
            newCheckoutBody,
            totalWeeks,
            // order_id: checkoutSummary?.history?.order_id
            // order_id: router.query.order_id != 'null' && router.query.order_id ? router.query.order_id : orderSummary?.order_history?.order_id,
            order_id: getOrderId(router, orderSummary)
          })
        )
          .then(unwrapResult)
          .then((res) => {
            Paymethod == 'wallet' ? null : setGtmCodeInject(true); // adding comment to redeploy prod
            // setGtmCodeInject(true) 
            dispatch(setpaymentMethod(Paymethod))
            dispatch(PromoAvailed({token:accessToken ,data:{promo_avail: false}}))
            // setLoading(false)
            AppLogger("this is rseposne of checkoutrequest========", res)
            // remove redux promo code after payment
            dispatch(performAddPromoCode(""))
            setPromoCodeSummaryLocal(null)
            setSubDiscount(null)
            setCheckoutBody({
              is_subscribed: false,
              time_slot: null,
              address_id: null,
              card_id: null,
              price: null,
              instructions: null,
              promoCode: null,
              discount_id: null
            })
            // Paymob work
            // const paymentKey = res?.data?.payment_url ?? ''; // depends on your API response
            // const paymentToken = res?.data?.payment_token ?? ''; // depends on your API response
            // const iframeUrl = `https://uae.paymob.com/api/acceptance/iframes/30987?payment_token=${paymentToken}`;
            // if(res?.data?.payment_url){
              // showSuccessToast("Currently Paymob work is in progress")
              // setIframeUrl(iframeUrl)
              // setPaymentURL(paymentKey)
              // setModalPaymentOpen(true)
              // window.location.href = res?.data?.payment_url;
              // }else{
              // showSuccessToast("Order Created Successfully")
              // router.push(AppRoutes.orderComplete)
              // }
              showSuccessToast("Order Created Successfully",3000)
              router.push(AppRoutes.orderComplete)
              setCheckOutLoader(false)
          })
          .catch((err) => {
            // setLoading(false)
            // setTimeout(() => {
            //   router.reload()
            // }, 800);
            AppLogger("this is  error at checkout request==========", err)
            showFaliureToast( err?.error ? err?.error :  err?.message)
            setCheckOutLoader(false)
          }).finally(() => {setCheckOutLoader(false)})
      }
    } catch (err) {
      AppLogger("this is err at  handlePlaceMyOrderRequest======", err)
    }
  }
  function isDateAfterCurrent(date) {
    if(!date) return false
    const today = new Date()
    const inputMonth = parseInt(date.substr(0, 2), 10)
    const inputYear = parseInt(date.substr(3), 10)
    return (
      inputYear > today.getFullYear() ||
      (inputYear === today.getFullYear() && inputMonth >= today.getMonth() + 1)
    )
  }
  console.log("editCardBody",editCardBody)
  const handleCheckOutRequest = () => {
    try {

      var totalPayable = subTotal
      totalPayable = totalPayable - extraProteinPrice - addon_price - (total_bag_fees ?? 0);
      if (promoApplied) {
        if (discountType !== "flat") {  
          totalPayable =
            // totalPayable - percentCalculation(promoDiscountValueWRTWeek, totalPayable)
            totalPayable - percentCalculationV2(
                                  promoDiscountValueWRTWeek,
                                  totalPayable,
                                  promoCodeSummaryLocal,
                                  {meal_price: mealPrice, snack_price: snackPrice}
                                )
        } else {
          totalPayable = totalPayable - promoDiscountValueWRTWeek
        }
      }
      if (subscriptionDiscount && !promoApplied) {
        totalPayable = totalPayable - getSubscriptionDiscount()
      }
      totalPayable = totalPayable + extraProteinPrice + addon_price + (total_bag_fees ?? 0);
      const roundedDown = roundHalfDown(totalPayable);
      checkoutBody.price = roundedDown
      
      const localDataToSave = {
        checkoutBody,
        subTotal,
        subscriptionDiscount,
        orderSummary,
        order_id: router.query.order_id ? router.query.order_id : orderSummary?.order?.id,
        is_cap_amount : checkIfCapped(  promoDiscountValueWRTWeek,  subTotal - extraProteinPrice - addon_price,  promoCodeSummaryLocal,  {meal_price: mealPrice, snack_price: snackPrice})
      };
      const currentCardIndex = cards.findIndex(card => card.id == checkoutBody.card_id);
      const currentCard = cards[currentCardIndex] ?? null;
      const cardExpired = isDateAfterCurrent(currentCard?.expiry_date) ?? false;
  
      const saveAndProceed = () => {
        AppLogger("this is order to save==========", localDataToSave);
        dispatch(saveOrderLocalSummary(localDataToSave))
          .then(unwrapResult)
          .then(res => {
            dispatch(changePrice(Number(handleSubtotalPrice(getTotalPayable(), walletAmount))));
            AppLogger("this is res======", res);
            goToCompleteOrderRequest(localDataToSave);
            // goToCompleteOrderRequest(false);
          })
          .catch(err => AppLogger("this is err", err));
      };
      if(cardDefaultLocal?.id == null  ){
        showFaliureToast("Please Select Card to Proceed");
        return
      }
      if (checkoutBody.card_id) {
        // if (FirstUnPaidOrder) {
          if (currentCardIndex !== -1 || conditionForPaymob || FirstUnPaidOrder) {
          // if (currentCardIndex !== -1) {
            if (cardExpired || conditionForPaymob || FirstUnPaidOrder ) {
              saveAndProceed();
              return
            } else {
              showFaliureToast("Your card is expired");
            }
            // }  
          // }
        } else {
          showFaliureToast("Please Select Card to Proceed");
        } 
      } else {
        showFaliureToast("Please Select Card to Proceed");
      }
      
      if (!checkoutBody.address_id) {
        showFaliureToast("Please Select Address to Proceed");
      } else {
        if (currentCardIndex !== -1) {
          if (cardExpired) {
            saveAndProceed();
            return
          } else {
            showFaliureToast("Your card is expired");
          }
        }
      }
    } catch (err) {
      setCheckoutBody({...checkoutBody})
      console.error('err',err)
      // Silent fail - consider logging if needed
    }
  };
  const handleGetOrderSummaryPaidRequest =async (order_id) => {
    try {
      await dispatch(getOrderSummaryPaidRequest({ accessToken, order_id }))
        .then(unwrapResult)
        .then((res) => {
          AppLogger("Response at getOrderSummaryPaidRequest", res)
          router.push("orderComplete")
        })
        .catch((err) => {
          AppLogger("Error at getOrderSummaryPaidRequest", err)
        })
      } catch (err) {
        AppLogger("Error at getOrderSummaryPaidRequest", err)
    }
  }
  const getTotalPayable = () => {
    let totalPayable = subTotal
    totalPayable = totalPayable - extraProteinPrice - addon_price - (total_bag_fees ?? 0);

    if (promoApplied && orderType !== "top up") {
      if (discountType != "flat") {
        totalPayable =
          // totalPayable - percentCalculation(promoDiscountValueWRTWeek, totalPayable)
          totalPayable -  percentCalculationV2(
                                  promoDiscountValueWRTWeek,
                                  totalPayable,
                                  promoCodeSummaryLocal,
                                  {meal_price: mealPrice, snack_price: snackPrice}
                                )
      } else {
        totalPayable = totalPayable - promoDiscountValueWRTWeek
      }
    }
    if (subscriptionDiscount && !promoApplied) {
      totalPayable = totalPayable - getSubscriptionDiscount()
    }

    totalPayable = totalPayable + extraProteinPrice + addon_price + (total_bag_fees ?? 0);
    const roundedDown = roundHalfDown(Math.max(0, totalPayable));

    // console.log("this is subtotal======", totalPayable)
    // setCheckoutBody({...checkoutBody,price:totalPayable})
    // return `${Math.round(totalPayable)}`
    return `${roundedDown}`
  }
  const getSubscriptionDiscount = () => {
    var subDiscount = ""
    if (subscriptionDiscount) {
      subDiscount = (
        (get(subscriptionDiscount, "value", "") / 100) *
        subTotal
      ).toFixed(2)
    }

    return subDiscount
  }
//   const getSubscriptionDiscount = () => {
//     // Ensure subscriptionDiscount object exists and has required fields
//     if (!subscriptionDiscount || !subscriptionDiscount?.planLength?.reward_type) {
//         return 0; // Return 0 if no valid subscription discount is available
//     }

//     const discountType = subscriptionDiscount?.planLength?.reward_type;
//     const discountValue = subscriptionDiscount?.planLength?.reward_value;
//     const isWalletCredit = subscriptionDiscount.planLength?.wallet_credit_enabled; // Use optional chaining for safety

//     // 1. Check if the discount is for Wallet Credit
//     // If wallet_credit_enabled is true, no immediate monetary discount is applied.
//     if (isWalletCredit) {
//         return 0; 
//     }

//     let calculatedDiscount = 0;

//     // 2. Calculate discount based on type
//     if (discountType === "percentage") {
//         // Calculate percentage discount based on the 'value' field and subTotal
//         // The result of the percentage calculation should be a float/number.
//         calculatedDiscount = (discountValue / 100) * subTotal;
//     } else if (discountType === "flat") {
//         // Apply flat discount directly using the 'value' field (assuming 'value' holds the flat amount)
//         calculatedDiscount = discountValue;
//     } 
//     // Note: If discountType is unknown, calculatedDiscount remains 0.
//     console.log("calculatedDiscount",calculatedDiscount)
//     // Return the calculated discount amount, rounded to 2 decimal places.
//     // Ensure the return value is a number (or string representation of a number)
//     // For simplicity in calculation, we return a number here.
//     return calculatedDiscount
// }

// NOTE: The getTotalPayable function relies on getSubscriptionDiscount returning a number 
// that can be subtracted from totalPayable. Returning a fixed float is recommended.
  const handlePaymentMethodType = (value) => {
    try {
      setRadioVal(value)
      // console.log("this is value=======", value)
      // handleClearCheckOutSummary()
      setSubDiscount(null)
      const status = value == 1
      checkoutBody.is_subscribed = status
      setCheckoutBody({ ...checkoutBody })
      orderSummaryParams.type = status
        ? AppConstants.paymentMethods.subscribe
        : AppConstants.paymentMethods.once
      setOrderSummaryParams({ ...orderSummaryParams })
      handleGetOrderSummaryRequest()
    } catch (err) {
      console.log("this is err============", err)
    }
  }
  const handleGetOrderDiscount =async ({ promoCode, is_subscribed, order_id }) => {
    setpromocodeLoader(true)
    try {
      await dispatch(
        getOrderDiscountSummary({
          accessToken,
          discountCode: promoCode ,
          is_subscribed: is_subscribed,
          order_id: order_id,
          isRenewal: isRenewalOrder ? 1 : 0
        })
      )
        .then(unwrapResult)
        .then((res) => {
          setpromocodeLoader(false)
          pushToDataLayer("promo_code_claimed")
          if (res.data) {
            setPromoApplied(true)
          } else {
            setPromoCode("")
            dispatch(setpromoCodeString(''))
            setPromoCodeSummaryLocal(null)
            setErrorMessage("Please enter a valid promo code")
            setPromoCodeWalletCredit(null)
            customTimeout(() => {
              setErrorMessage(null)
            }, 3000)
          }
        })
        .catch((err) => {
          removeAppliedPromo()
          AppLogger("This  is error=====", err)
          err?.message?.length > 1 ? showFaliureToast(err?.message) : null
          dispatch(performAddPromoCode(""))
          console.log("this is er====", err)
        })
      } catch (error) {
        removeAppliedPromo()
        AppLogger("This  is error=====", err)
        err?.message?.length > 1 ? showFaliureToast(err?.message) : null
        dispatch(performAddPromoCode(""))
        console.log("this is er====", err)
        
    }
  }
  const handleApplyPromoCode = () => {
    setPromoCodeWalletCredit(null)
    setPromoCodeSummaryLocal(null)
    dispatch(setpromoCodeString(promoCode))
    if (promoCode && orderType !== "top up") {
      orderSummaryParams.promo_code = promoCode
      handleGetOrderDiscount({
        promoCode,
        is_subscribed: checkoutBody.is_subscribed,
        order_id: router.query.order_id
      })
    } else {
      removeAppliedPromo()
      setErrorMessage("Please enter a valid promo code")
        customTimeout(() => {
              setErrorMessage(null)
            }, 3000)
    }
  }
  const defaultAddressSelector = () => {
    try {
      if (!checkoutBody.address_id && defaultAddress) {
        const currentIndex = addresses.findIndex(
          (val) => val.id == defaultAddress.id
        )
  
        if (currentIndex !== -1) {
          const currentAddress = addresses[currentIndex]
  
          // if (addresses.length > 0) {
          //   const currentAddress = addresses[0]
  
          if (currentAddress) {
             setCheckoutBody({ 
              ...checkoutBody, 
              address_id: currentAddress.id,
              time_slot: currentAddress?.time_slot
            })
          }
        }
        // }
      } else {
        if (addresses.length === 1 && !defaultAddress) {
          checkoutBody.address_id = addresses[addresses.length - 1].id
          const selectedAddressTimeSlot =
            addresses[addresses.length - 1]?.time_slot
  
          if (selectedAddressTimeSlot) {
            setCheckoutBody({ ...checkoutBody, time_slot: selectedAddressTimeSlot, address_id: addresses[addresses.length - 1].id })
          }
        } else if (addresses.length > 1 && !defaultAddress) {
          checkoutBody.address_id = addresses[0].id
          const selectedAddressTimeSlot = addresses[0]?.time_slot
  
          if (selectedAddressTimeSlot) {
             setCheckoutBody({ 
              ...checkoutBody, 
              time_slot: selectedAddressTimeSlot,
              address_id: addresses[0].id
            })
          }
        }
      }
    } catch (error) {
      console.log("this is useeffect for checkoutBody.address_id =------------", error)
    }
  }
  const defaultCardSelector = () => {
    if (!checkoutBody.card_id && defaultCard) {
      if (cards.length > 0) {
        const currentIndex = cards.findIndex((val) => val.id == defaultCard.id)
        if (currentIndex !== -1) {
          const currentCard = cards[currentIndex]

          // console.log("thisi s current card", currentCard)

          if (currentCard) {
            setCheckoutBody({ ...checkoutBody, card_id: currentCard?.id })
          }
        }
      }
    } else {
      if (cards.length == 1 && !defaultCard) {
          setCheckoutBody({ ...checkoutBody, card_id: cards?.[0]?.id })
        }
    }
  }
  const onEditPressHandler = (card) => {
    setUpdateMode(true)
    setShowAddCardPopup(true)
    setEditCardBody(card)
  }
  const onSelectDefaultHandler = (address_id) => {
    dispatch(setDefaultAddressRequest({ accessToken, address_id }))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("This si resposne at onSelectDefaultHandler==========", res)
      })
      .catch((err) => {
        AppLogger("This  is error at onSelectDefaultHandler============", err)
      })
  }
  const handleAddAddress = () => {
    setCurrentAddressData({
      address_line_one: "",
      address_line_two: "",
      label: "",
      address_id: ""
    })
    setShowAssignDelivery(false), setShowAddressPopup(true);
  }
  const getAddressWithDays = () => {
    try {
      if (accessToken) {
        dispatch(getDeliveryAddressWithDaysRequest({ token: accessToken }))
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
      if (accessToken && payload && active_order_id) {
        setIsLoading(true);
        dispatch(updateDeliveryAddressWithDaysRequest({
          token: accessToken,
          scheduleDeliveryBody: {
            data: payload,
            order_id: active_order_id
          }
        }))
          .then(unwrapResult)
          .then((response) => {
            handleGetOrderSummaryRequest(router.query.order_id)
            // Success Toast for changes in addresses
            showSuccessToast(AppConstants.checkoutAddressToastMessage);
            getAddressWithDays()
            setIsLoading(false);
            AppLogger("Response at updateAddressWithDays", response)
          })
          .catch((error) => {
            showFaliureToast(AppErrors.SOMETHING_WENT_WRONG)
            getAddressWithDays();
            setIsLoading(false);
            AppLogger("Error at updateAddressWithDays", error)
          })
      }
    } catch (err) {
      AppLogger("Error at updateAddressWithDays", err)
    }
  }
  const handleScheduleAddress = (payload) => {

    setShowAssignDelivery(false);
    const transformedPayload = transformScheduleDeliveryPayload(payload);
    if (transformedPayload) {
      updateAddressWithDays(transformedPayload);
    }
  }
  const updateDays = (payload) => {
    try {
      const { auth_token } = userDetails?.data
      if (auth_token && payload) {
        setIsLoading(true);
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
            setIsLoading(false);
            handleGetOrderSummaryRequest();
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
  
  useEffect(() => {
    // defaultAddressSelector()
    if (checkoutBody.address_id) {
      const selectedAddress = addresses.find(
        (val) => val.id == checkoutBody.address_id
      )
      if (selectedAddress) {
        setCheckoutBody({ ...checkoutBody, time_slot: selectedAddress?.time_slot })
      }
    }
  }, [orderSummaryLocal])
  useEffect(() => {
    if (addresss) {
      setAllAddressDataLocal(addresss)
    }
  }, [addresss])
  useEffect(() => {
    if (addressWithDays) {
      setAddressWithDaysLocal(addressWithDays)
    }
  }, [addressWithDays])
  useEffect(() => {
    if (checkoutSummary) {
      setCheckoutSummaryLocal(checkoutSummary)
    }
  }, [checkoutSummary])
  useEffect(() => {
    if (orderSummary) {
      setOrderSummaryLocal({
        ...orderSummary,
        // meal_price: 210,
        // snack_price: 100
      })
    }
  }, [orderSummary])
  useEffect(() => {
    setIsLoading(loading)
  }, [loading])
  useEffect(() => {
    setErrorMessage(mapErrorMessage(error))
    // console.log("this is error======", error)
  }, [error])
  // useEffect(() => { 
  //   // old work
  //   // info discountSummary se discountSummarylocal set hoti or usse promoCodeSummaryLocal set hota, ab discountSummary redux mn hai or wo presisted ha tw referesh m local s code uth k set hota hai.
  //   if (promoCodeSummaryLocal?.promo_code && topUpStatus !== "top up") {
  //     setPromoCode(promoCodeSummaryLocal.promo_code)
  //   } else {
  //     setPromoRedux(promo_code)
  //     setPromoCode(promo_code)
  //   }
  // }, [promo_code, promoCodeSummaryLocal])
  useEffect(() => {
    // old work
    // info discountSummary se discountSummarylocal set hoti or usse promoCodeSummaryLocal set hota, ab discountSummary redux mn hai or wo presisted ha tw referesh m local s code uth k set hota hai.
    if (promoCodeSummaryLocal?.promo_code && topUpStatus !== "top up") {
      const foundYourPromo = promoCodeSummaryLocal?.ambassador_referral_codes?.find((item) => item == promoCode || promoCodeString);
      if(promoCodeString && foundYourPromo && AppConstants.promoCodeTypes.ambassador_individual == promoCodeSummaryLocal?.promo_type){
        setPromoCode(promoCodeString)
      }else{
        if(AppConstants.promoCodeTypes.ambassador_individual == promoCodeSummaryLocal?.promo_type){
        if(userProfileFromCheckoutSummary){
          setPromoCode(userProfileFromCheckoutSummary?.promo_code || '');
        }
      }else{
        setPromoCode(promoCodeSummaryLocal.promo_code)
        }
      }
      // const foundYourPromo = promoCodeSummaryLocal?.ambassador_referral_codes?.find((item) => item == promoCode);
      // if (foundYourPromo) {
      //     setPromoCode(foundYourPromo);
      // } else {
      //     setPromoCode(promoCodeSummaryLocal?.promo_code || '');
      // }
      // setPromoCode(promoCodeSummaryLocal.promo_code)
    } else {
        if(promoCodeString && promoCodeSummaryLocal && isNull(promoCodeSummaryLocal?.promo_code)){
            setPromoCode(promoCodeString);
        }
        else if(promoCodeSummaryLocal && isNull(promoCodeSummaryLocal?.promo_code)){
            const userProfileFromCheckoutSummaryCode = userProfileFromCheckoutSummary?.promo_code || '';
            setPromoCode(userProfileFromCheckoutSummaryCode);
          }
    } 
  }, [promo_code, promoCodeSummaryLocal,promoCodeString, userProfileFromCheckoutSummary])
  useEffect(() => {
    if (
      promoCodeSummaryLocal &&
      promoDiscountDuration !== "" &&
      mealPlanDuration !== ""
    ) {
      // if (promoDiscountDuration > mealPlanDuration) {''
      //   setPromoApplied(false)
      //   setPromoCode("")
      //   dispatch(setpromoCodeString(''))
      //   setPromoCodeSummaryLocal(null)
      //   setPromoCodeWalletCredit(null)
      // }
    }
  }, [promoCodeSummaryLocal, promoDiscountDuration, mealPlanDuration])
  useEffect(() => {
    if (cardsData) {
      setAllCardsDataLocal(cardsData)
    }
  }, [cardsData])
  useEffect(() => {
    // AppLogger("this is checkout body", checkoutBody)
  }, [checkoutBody.address_id])
  useEffect(() => {
    if (ticker) {
      setTickerLocal(ticker)
    }
  }, [ticker])
  useEffect(() => {
    setUserProfileLocal(userProfile)
  }, [userProfile])
  useEffect(() => {
    if (startUpData) {
      setStartUpLocalSummary(startUpData)
    }
  }, [startUpData])
  useEffect(() => {
    // setDiscountSummaryLocal(discountReponse1) // open this
    if (discountSummary) { // open this when you want normal flow
      setDiscountSummaryLocal(discountSummary)
    }
  }, [discountSummary])
  useEffect(() => {
    // const meal_plan_require_weeks = orderHistory?.[0]?.history?.meal_plan_require_weeks ?? 0;
    const meal_plan_require_weeksInUseEffect = meal_plan_require_weeks ?? 0;
    let rewardType = "";
    if(discountSummaryLocal?.promo_type == AppConstants?.promoCodeTypes?.referral_friend){
      const referalDiscount = get(discountSummaryLocal , "referral_discount", []);
      const planWeek = referalDiscount?.find((item) => item?.week == meal_plan_require_weeksInUseEffect) ?? '';
      rewardType = planWeek?.reward_type ?? AppConstants.getDiscountRewardType.percent;
    }else{
      const referalDiscount = get(discountSummaryLocal , "discount_plan_lengths", []);
      const planWeek = referalDiscount?.find((item) => Number(item?.plan_length) == meal_plan_require_weeksInUseEffect) ?? '';
      rewardType = planWeek?.reward_type ?? '';
    }
    
    if (discountSummaryLocal) {
      setDiscountType(rewardType)
    } else if (checkoutSummaryDiscountType != "") {
      setDiscountType(checkoutSummaryDiscountType)
    } else {
      setDiscountType("")
    }
  }, [discountSummaryLocal, checkoutSummaryLocal, orderHistory?.length, orderHistory?.[0]?.history?.meal_plan_require_weeks, meal_plan_require_weeks])
 
  useEffect(()=>{
    return()=>{
      setButtonClicked(false)
    }
  },[])
  useEffect(() => {
    // setupUiHandler()
    callStartUpFilesHandler()
    handleGetAllAddressRequest()
    handleGetAllCardsRequest()
    getAddressWithDays();
  }, [])
  useEffect(() => {
    try {
      if (promoId) {
        setCheckoutBody({...checkoutBody,discount_id:promoId})
        // checkoutBody.discount_id = promoId
      } else {
        setCheckoutBody({...checkoutBody,discount_id:null})
        // checkoutBody.discount_id = null
      }
    } catch (err) {
      console.log("this is useeffect=------------", err)
    }
  }, [promoId])
  // console.log("discountSummaryLocal",discountSummaryLocal)
  // console.log("checkoutSummary",checkoutSummary)
  useEffect(() => {
    if (discountSummaryLocal && orderType !== "top up") {
       const discountData = isExecutive
              ? (discountSummaryLocal?.parent ?? discountSummaryLocal)
              : discountSummaryLocal
      setPromoCodeSummaryLocal(discountData)
      setPromoApplied(true)
    } else {
      if (!checkoutSummary) {
        setPromoApplied(false)
      }
    }
  }, [discountSummaryLocal, checkoutSummary,isExecutive])
  useEffect(() => {
    AppLogger("This is promo summary ============", discountSummary)
  }, [discountSummary])

  // _____________________________________________________________
  // above useEffects either setting states or runs one time only
  // _____________________________________________________________

  useEffect(() => {
    if (
      promo_code !== "" &&
      promoCode !== "" &&
      topUpStatus !== "top up" &&
      orderType !== "top up"
    ) {
      handleApplyPromoCode()
    }
  }, [dataUpdated, promoRedux])
  //below useffect had issue now fixed, for multiple rerender added conditional dependency.
  useEffect(() => {
    try {
      AppLogger("this is subscribed status=======", subscribedStatus)

      if (orderType !== "top up") {
        if (subscriptionDiscount) {
          checkoutBody.is_subscribed = true
          setCheckoutBody({ ...checkoutBody, is_subscribed: true })
        } else if (!checkoutSummaryLocal) {
          if (subscribedStatus == 1) {
            checkoutBody.is_subscribed = true
            handlePaymentMethodType(1)
            setCheckoutBody({ ...checkoutBody })
          }
        } else {
        }
        setCheckoutBody({ ...checkoutBody })
      }
    } catch (err) {
      AppLogger("Error at useeffect order summary checkout", err)
    }
  }, [conditionForPaymob ? orderType : orderSummaryLocal, orderType ])
  useEffect(() => {
    if (
      orderSummaryLocal &&
      (userProfileFordiscount) &&
      !promoApplied &&
      !promoCodeSummaryLocal &&
      orderType !== "top up"
      // checkDays()
    ) {
      try{
        const payload = {
         promoCode: userProfileFordiscount?.promo_code || promoCode || orderSummaryLocal?.discount?.promo_code,
         is_subscribed: checkoutBody.is_subscribed,
         order_id: router.query.order_id
       }

         const cacheKey = getCacheKey(payload);
         const now = Date.now();
         const lastCall = lastCallCache.get(cacheKey);
        
         // If same payload was requested within last 3 seconds → skip
         if (lastCall && now - lastCall < 3000) {
           return console.log('calls')
           // return rejectWithValue({ message: "Duplicate request blocked" });
         }
        
         // update timestamp
         lastCallCache.set(cacheKey, now);
        


        if(orderSummaryLocal?.discount){
          (userProfileFordiscount?.promo_code || promoCode || orderSummaryLocal?.discount?.promo_code) && setloaderFirsttimeDisc(true);
         (userProfileFordiscount?.promo_code || promoCode || orderSummaryLocal?.discount?.promo_code) && handleGetOrderDiscount(payload).then(()=>{
           setloaderFirsttimeDisc(false);}).catch((err)=>{
             setloaderFirsttimeDisc(false);
           })
        }
        // else{
        //   if(orderSummaryLocal?.subscription_discount){
        //     console.log("inelse if",orderSummaryLocal?.subscription_discount?.promo_code)
        //     (orderSummaryLocal?.subscription_discount?.promo_code) && setloaderFirsttimeDisc(true);
        //         handleGetOrderDiscount(`${orderSummaryLocal?.subscription_discount?.promo_code}`).then(()=>{
        //         setloaderFirsttimeDisc(false);}).catch((err)=>{
        //         setloaderFirsttimeDisc(false);
        //       })
        //   }
        // }
      }catch(err){
          setloaderFirsttimeDisc(false);
      }
    }
  }, [userProfileFordiscount, totalWeeks, orderType, checkoutBody.is_subscribed, orderSummaryLocal ])
  console.log("discountSummaryLocal",discountSummaryLocal)
  console.log("promoCodeSummaryLocal",promoCodeSummaryLocal)
  useEffect(() => {
    console.log("orderSummaryLocal",orderSummaryLocal)
    console.log("orderSummaryLocal?.subscription_discount",orderSummaryLocal?.subscription_discount)
    console.log("radioVal",radioVal)
    if (
      orderSummaryLocal &&
      orderSummaryLocal?.subscription_discount 
    ) {
      try{
           const payload = {
         promoCode: orderSummaryLocal?.subscription_discount?.promo_code,
         is_subscribed: checkoutBody.is_subscribed,
         order_id: router.query.order_id ?? orderSummaryLocal?.order_history?.id
       }
       if(orderSummaryLocal?.subscription_discount && radioVal == '1'){

         orderSummaryLocal?.subscription_discount && setPromoCode(orderSummaryLocal?.subscription_discount?.promo_code);
            orderSummaryLocal?.subscription_discount && setloaderFirsttimeDisc(true);
            handleGetOrderDiscount(payload).then(()=>{
             setloaderFirsttimeDisc(false);}).catch((err)=>{
               setloaderFirsttimeDisc(false);
             })
       }else{
          if(promoCodeSummaryLocal?.promo_code == 'SUBSCRIBE'){
            removeAppliedPromo()
            setPromoCode("")
            dispatch(setpromoCodeString(''))
            setPromoCodeSummaryLocal(null)
            setPromoCodeWalletCredit(null)
          }
       }  
      }catch(err){
          setloaderFirsttimeDisc(false);
        }
      }else{
            //   setPromoCode("")
            // dispatch(setpromoCodeString(''))
            // setPromoCodeSummaryLocal(null)
            // setErrorMessage("Please enter a valid promo code")
            // setPromoCodeWalletCredit(null)
      }
  }, [ orderSummaryLocal, radioVal, ])
  useEffect(()=>{
    if (
    (
      (promoCode) ||
      (discountSummaryLocal))
      &&
      orderType !== "top up"
      &&
      !userProfileFordiscount
      && buttonClicked != true
    ) {
       try{

        const conditionalCall = (userProfileFordiscount?.promo_code || promoCode || discountSummaryLocal?.promo_code);
        const payload = {
          promoCode: userProfileFordiscount?.promo_code || promoCode || discountSummaryLocal?.promo_code,
          is_subscribed: checkoutBody.is_subscribed,
          order_id: router.query.order_id
        }

        const cacheKey = getCacheKey(payload);
        const now = Date.now();
        const lastCall = lastCallCache.get(cacheKey);
      
        // If same payload was requested within last 3 seconds → skip
        if (lastCall && now - lastCall < 3000) {
          return console.log('xxx bar bar call mt kr 2')
          // return rejectWithValue({ message: "Duplicate request blocked" });
        }
        
        // update timestamp
        lastCallCache.set(cacheKey, now);
        
        conditionalCall && setloaderFirsttimeDisc(true);
        conditionalCall && handleGetOrderDiscount(payload).then(()=>{
          setloaderFirsttimeDisc(false);}).catch((err)=>{
            setloaderFirsttimeDisc(false);
          })
          
         }catch(err){
          setloaderFirsttimeDisc(false);
      }
    }

  },[discountSummaryLocal?.promo_code])
  //first
  useEffect(() => {
    if (router.query.order_id) {
      if (checkoutSummary) {
        const { orderData } = checkoutSummary
        if (orderData.is_subscribed) {
          orderSummaryParams.type = AppConstants.paymentMethods.subscribe
          checkoutBody.is_subscribed = true
        } else {
          orderSummaryParams.type = AppConstants.paymentMethods.once
          checkoutBody.is_subscribed = false
        }
      }
      setCheckoutBody({ ...checkoutBody })
      setOrderSummaryParams({ ...orderSummaryParams })
      handleGetOrderSummaryRequest(router.query.order_id)
      setOrderType(router.query.type)
    }
  }, [dataUpdated, router.isReady, router.query])
  useEffect(() => {
    if (!checkoutSummary) {
      defaultCardSelector()
      defaultAddressSelector()
    }
  }, [defaultAddress, checkoutSummary, cards, addresses])
  useEffect(() => {
    if (checkoutSummary) {
      userLocalDataHandler()
    }
  }, [checkoutSummary])
  const getIntention = async () =>{
    try {
      setintentionLoader(true)
      await dispatch(createIntentionFunc({accessToken : accessToken, address_id : checkoutBody.address_id}))
      .then(unwrapResult)
      .then((resp)=>{
        setintentionLoader(false)
        setSecretToken(resp?.data?.data?.client_secret)
        return resp
      }).catch((err)=>{
        setintentionLoader(false)
        console.log("err",err)
      })
    } catch (error) {
        setintentionLoader(false)
        console.log("error",error)
    }
  }
  const onSelectCardHandler = async (card_id) => {
    const cardData = { card_id: card_id }
    await dispatch(setUserDefaultCardRequest({ accessToken, cardData }))
      .then(unwrapResult)
      .then((res) => {
        // setCheckoutBody({
        // ...checkoutBody, 
        // address_id: defaultAddressLocal?.id, time_slot: defaultAddressLocal?.time_slot,
        // card_id: cardDefaultLocal?.id,
        // })
        handleGetAllCardsRequest()
        // if (cards.length == 1 && !defaultCard) {
        //   setCheckoutBody({ ...checkoutBody, card_id: cards?.[0]?.id })
        // }
        AppLogger("this is response==========", res)
      })
      .catch((err) => {
        AppLogger("this  is err", err)
      })
  }

  const price = getTotalPayable() &&
            ` ${getTotalPayable() > 0 ? Math.round(getTotalPayable()) : 0
            }`;
  const Paymethod =
              orderSummary?.wallet
                ? walletAmount >= price
                  ? "wallet"
                  : renewalTickerChecker() ?
                    "manual_renewals" 
                  : "direct"
                : "direct";
  const handleCardClick = () => { 
    if(intentionLoader){
      return
    }
    if(conditionForPaymob || FirstUnPaidOrder){
      if(addresses.length <=0){
        showFaliureToast("Please add address first to add card.")
        return
      }else{
        if(checkoutBody.address_id == ''){
          showFaliureToast("Please select address first.")
          return
        }
      }
      getIntention().then((res)=>{
        setModalPaymentOpen(true)
          return res
      }).catch(err=>{
        console.log("err",err) 
        return
      })
    } else{
      setErrorMessage("")
      setShowAddCardPopup(true)
    }
  }
  const cards = cardsFiltered?.filter((item)=>{
      if(conditionForPaymob || FirstUnPaidOrder) {return  item?.stripe_card_id == null}
      else {return  item?.stripe_card_id ? item : null}
    }
  )
  function getPromoMessage({
    promoCodeWalletCredit,
    rewardValue,
    discountType,
    conditionToShowCappedMsg,
    promoDiscountValueWRTWeekToDisplay
    }) {
  
      if (promoCodeWalletCredit?.planWalletCredit) {
    if(rewardValue != 0){
      return `Reward amount ${rewardValue} AED will be credited to your wallet`;
    }
    return ``;
      }
    
      const hasCap =
          DiscountObj?.cap_amount &&
          DiscountObj?.reward_type !== AppConstants.getDiscountRewardType.wallet_credit;
      const discountUnit = discountType !== "flat" ? "%" : "AED";
      const CappedAmount = getFormattedCapAmount(DiscountObj?.cap_amount)
      const discountOnArr = Array.isArray(promoCodeSummaryLocal?.discount_on)
        ? promoCodeSummaryLocal.discount_on
        : [];
      const onMeals  = discountOnArr.includes('meals');
      const onSnacks = discountOnArr.includes('snacks');
      const onBoth   = onMeals && onSnacks;
      if (Number(promoDiscountValueWRTWeekToDisplay) === 0) {
        // return "This promo currently offers 0 discount.";
        return "";
      }
    
      if (hasCap) {
         if (onBoth) {
           return `*YAY! You saved up to ${promoDiscountValueWRTWeekToDisplay}${discountUnit}. There is a ${CappedAmount} AED cap on this discount.`;
         }
         if (onMeals) {
           return `*YAY! You saved up to ${promoDiscountValueWRTWeekToDisplay}${discountUnit}. It is applicable only on Meals. 
          There is a ${CappedAmount} AED cap on this discount.`;
         }
         if (onSnacks) {
           return `*YAY! You saved up to ${promoDiscountValueWRTWeekToDisplay}${discountUnit}. It is applicable only on Snacks. 
          There is a ${CappedAmount} AED cap on this discount.`;
         }
      }
      return `YAY! You saved up to ${promoDiscountValueWRTWeekToDisplay} ${discountUnit}`;
  }

  useEffect(() => {
    if (allAddressDataLocal?.length > 0) {
      if(allAddressDataLocal?.default_address){
        setTimeout(() => {
              setCheckoutBody({
                ...checkoutBody, address_id: allAddressDataLocal?.default_address?.id, time_slot: allAddressDataLocal?.default_address?.time_slot
              })
            }, 200);
      }
    }
  }, [allAddressDataLocal, addresses])

  useEffect(() => {
    if (defaultAddressLocal) {
              setCheckoutBody({
                ...checkoutBody, 
                address_id: defaultAddressLocal?.id, time_slot: defaultAddressLocal?.time_slot
              })
    }
    if (defaultAddressLocal && cardDefaultLocal) {
              setCheckoutBody({
                ...checkoutBody, 
                card_id: cardDefaultLocal?.id,
                address_id: defaultAddressLocal?.id, time_slot: defaultAddressLocal?.time_slot
              })
    }
  }, [allAddressDataLocal, addresses, defaultAddressLocal, cardDefaultLocal, allCardsDataLocal, cardsData])
  
  useEffect(() => {
    if (cardDefaultLocal) {
        setCheckoutBody({
        ...checkoutBody, 
        card_id: cardDefaultLocal?.id,
        })
    }
    if (cardDefaultLocal && defaultAddressLocal) {
        setCheckoutBody({
        ...checkoutBody, 
        address_id: defaultAddressLocal?.id, time_slot: defaultAddressLocal?.time_slot,
        card_id: cardDefaultLocal?.id,
        })
    }
  }, [allCardsDataLocal, cardsData, cardDefaultLocal, defaultAddressLocal, allAddressDataLocal, addresses])
  useEffect(() => {
    return()=>{
          // dispatch(setpromoCodeString(''))
          setPromoCodeWalletCredit(null)
    }
  }, [])
  
  // useffec tot check if discount is wallet credit 
  useEffect(() => {
    if(promoCodeSummaryLocal && meal_plan_require_weeks &&  mealPrice && !isNull(snackPrice) && ifZerothenOk(radioVal)){
      const WeekWRTtoSubscribe = radioVal == 1 ? 4 : meal_plan_require_weeks;
      const PlanWalletCreditChecker = isDiscountRewardTypeWallet(promoCodeSummaryLocal, { mealPrice: mealPrice, snackPrice: snackPrice },WeekWRTtoSubscribe);
      if (PlanWalletCreditChecker?.planWalletCredit) {
        setPromoCodeWalletCredit(PlanWalletCreditChecker)
      } else {
        setPromoCodeWalletCredit(null)
      }
    }else{
      setPromoCodeWalletCredit(null)
    }
  }, [promoCodeSummaryLocal,meal_plan_require_weeks, mealPrice, snackPrice, promoCodeSummaryLocal, radioVal]);
  
  const walletCreditAmount = handleSubtotalPrice(subTotal, walletAmount);

  const DiscountObj = DiscountObjwrtWeek(promoCodeSummaryLocal, meal_plan_require_weeks)
  const loader = loaderFirsttimeDisc || orderSummeryOnlyLoader;
  
  const conditionToShowCappedMsg = DiscountObj?.reward_type != AppConstants.getDiscountRewardType.wallet_credit && DiscountObj?.cap_amount && (Number(DiscountObj?.cap_amount) <= handleSubtotalPrice(getTotalPayable(), walletAmount));
  
  const totalAmounttoShow = promoCodeWalletCredit?.planWalletCredit ? 
  ` AED ${walletCreditAmount}` :
   getTotalPayable() && `AED ${handleSubtotalPrice(getTotalPayable(), walletAmount)}`;
  
  const promoMessage = getPromoMessage({
  promoCodeWalletCredit,
  rewardValue: promoCodeWalletCredit?.rewardValue ? promoCodeWalletCredit?.rewardValue : 0,
  discountType,
  conditionToShowCappedMsg,
  promoDiscountValueWRTWeekToDisplay
  });

  const removeAppliedPromo =()=>{
    setPromoCodeWalletCredit(null)
    setpromocodeLoader(false)
    setPromoApplied(false)
    setPromoCodeSummaryLocal(null)
    setPromoCode("")
    dispatch(setpromoCodeString(''))
    dispatch(discountSummaryremover(null))
    setDiscountSummaryLocal(null)
    setCheckoutBody({...checkoutBody,discount_id:null,promo_code:''})
    setpromoSummaryTitleVar('')
  }

  const isMyDiscountValueNegative = isDiscountNegative(promoCodeSummaryLocal, meal_plan_require_weeks);

  /*
  IMPORTANT NOTES
  1- "discountSummary" is setting discountSummarylocal;
  2- discountSummarylocal is setting promoCodeSummaryLocal;
  3- even if you null promoCodeSummaryLocal to null "discountSummary" has data still there an even you invalidate code or referesh it will comeback;
  */

  // Below work for chekcout decoration 
  const [conditionForPromoApplied,setconditionForPromoApplied]=useState(false)
  const { decorationQuizData } = useSelector((state) => state.homepage);
  const [loaderupdate,setloaderupdate]= useState(false);
  const [showCheckoutDecor,setshowCheckoutDecor]= useState(false);
  const [showAdditemDecor,setshowAdditemDecor]= useState(false);
  console.log("userProfileLocal",userProfileLocal)
  const userProfilePromoAvail = get(userProfileLocal, 'profile.promo_avail', 0);
  // const is_new_pricing_user = get(userProfileLocal, 'is_new_pricing_user', true);
  const showoldCustomerAdditemDecoration = decorationQuizData?.showoldCustomerAdditemDecoration ?? false;
  const showoldCustomerCheckoutDecoration = decorationQuizData?.showoldCustomerCheckoutDecoration ?? false;
  const showoldCustomerDecoration = decorationQuizData?.showoldCustomerDecoration ?? false;
  useEffect(()=>{
    if (!is_new_pricing_user) {
      if (decorationQuizData?.showDecoration && decorationQuizData?.showAdditemDecor ) {
        if(showoldCustomerDecoration && showoldCustomerAdditemDecoration ){
          setshowAdditemDecor(true)
          return
        }
      }
      setshowAdditemDecor(false)
    }else{
      if(decorationQuizData?.showDecoration && decorationQuizData?.showAdditemDecor) {
        setshowAdditemDecor(true)
      }else{
        setshowAdditemDecor(false)
      }
    }

  },[decorationQuizData, userProfilePromoAvail, showoldCustomerAdditemDecoration, showoldCustomerDecoration,is_new_pricing_user])
  useEffect(()=>{
    if (!is_new_pricing_user) {
      if (decorationQuizData?.showDecoration && decorationQuizData?.showCheckoutDecoration ) {
        if(showoldCustomerDecoration && showoldCustomerCheckoutDecoration ){
          setshowCheckoutDecor(true)
          return
        }
      }
      setshowCheckoutDecor(false)
    }else{
      if((userProfilePromoAvail == 0 || userProfilePromoAvail == false ) && decorationQuizData?.showDecoration && decorationQuizData?.showCheckoutDecoration){
        setshowCheckoutDecor(true)
      }else{
        setshowCheckoutDecor(false)
      }
    }

  },[decorationQuizData, userProfilePromoAvail, showoldCustomerCheckoutDecoration, showoldCustomerDecoration,is_new_pricing_user])
  useEffect(()=>{
    if((promoApplied || promoCodeSummaryLocal) && topUpStatus !== "top up"){
      setconditionForPromoApplied(true)
    }else{
      setconditionForPromoApplied(false)
    }

  },[promoApplied,promoCodeSummaryLocal,topUpStatus])

  console.log("discountSummaryLocal",discountSummaryLocal)
  
  const mealsPerDay = orderSummaryLocal?.order_history?.meals_deliver_per_day
  const snacksPerDay = orderSummaryLocal?.order_history?.snacks_deliver_per_day
  const daysPerWeek = orderSummaryLocal?.order_history?.meal_days_per_week
  const weeks = orderSummaryLocal?.order_history?.meal_plan_require_weeks

  const sampleData = {
  allergy: orderSummaryLocal?.order_history?.allergies ?? [],
  food_dislikes:
    orderSummaryLocal?.order_history?.dislikes ?? [],
  meal_plan_pause_date:
    orderSummaryLocal?.order_history?.meal_plan_pause_date ?? [],
  vegeterian: orderSummaryLocal?.order_history?.vegeterian == 0 ? "No I am not":'Yes I am',
  days_food_delivery:
    orderSummaryLocal?.order_history?.days_food_delivery ?? [],
  meal_plan_start_date:
    orderSummaryLocal?.order_history?.meal_plan_start_date ??
    "",
  phone:
    userDetails?.data?.phone ??
    "",
  meal_plan_end_date:
    orderSummaryLocal?.order_history?.meal_plan_end_date ??
    "",
  delivery_address:
    orderSummaryLocal?.order_history?.delivery_address ?? null,
  snacks_deliver_per_day:
    orderSummaryLocal?.order_history?.snacks_deliver_per_day ?? 1,
  meals_deliver_per_day:
    orderSummaryLocal?.order_history?.meals_deliver_per_day ?? 1,
  meal_days_per_week:
    orderSummaryLocal?.order_history?.meal_days_per_week ?? 5,
  meal_plan_require_weeks:
    orderSummaryLocal?.order_history?.meal_plan_require_weeks ?? 1,
  meal_plan: orderSummaryLocal?.order_history?.meal_plan ?? [],
  culinary_check: orderSummaryLocal?.order_history?.culinary_check ?? 0,
  notification: orderSummaryLocal?.order_history?.notification ?? 1,
  exclude_breakfast:
    orderSummaryLocal?.order_history?.exclude_breakfast ?? 0,
  dob: orderSummaryLocal?.order_history?.dob ?? "",
  };

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
      const { auth_token } = userDetails?.data
      if (auth_token) {
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
      }
    } catch (err) {
      AppLogger("Error at getUserProfileHandler", err)
    }
  }
  const getTickersData =async () => {
    try {
      const { auth_token } = userDetails?.data

      dispatch(GetTickersRequest({ token: auth_token }))
        .then(unwrapResult)
        .then((res) => {
          AppLogger("Response at GetResturantsRequest", res)
        })
        .catch((err) => {
        })
    } catch (err) { }
  }

  const handleUpgrade = async (upgradeInfo) => {
  if (!upgradeInfo) return;

  const updatedData = { ...sampleData }; // clone existing data

  switch (upgradeInfo.offerType) {
    case "meal":
      // Increase number of meals per day
      updatedData.meals_deliver_per_day = upgradeInfo.newValue;

      // Clone meal_plan array and add same calorie as last one
      const lastCalorie =
        updatedData.meal_plan?.[updatedData.meal_plan.length - 1] ?? 700;

      updatedData.meal_plan = [
        ...updatedData.meal_plan,
        lastCalorie, // add one more same calorie
      ];
      break;

    case "snack":
      // Increase number of snacks per day
      updatedData.snacks_deliver_per_day = upgradeInfo.newValue;
      break;

    case "days":
      updatedData.meal_days_per_week = upgradeInfo.newValue;
      break;

    case "weeks":
      updatedData.meal_plan_require_weeks = upgradeInfo.newValue;
      break;

    default:
      break;
  }

    try {

        setloaderupdate(true)
        await dispatch(
          UpdatePreferencesSliderRequest({
            preferenceData: updatedData,
            token: accessToken ,
          })
        )
          .then(unwrapResult)
          .then((res) => {
            dispatch(PromoAvailed({token:accessToken ,data:{promo_avail: true}}))
            getTickersData()
            getUserProfileHandler()
            setloaderupdate(false)
              customTimeout(() => {
                router.reload()
              }, 2000)
            AppLogger("Response at updateEditPreferenceSliderHandler", res)
          })
          .catch((error) => {
          setloaderupdate(false)
            "Your Order is about to end Can't update due to Threshold"
            if (
              error?.response?.data?.message ==
              "Your Order is about to end Can't update due to Threshold"
            ) {
              customTimeout(() => {
                setErrorString2(false)
              }, 5000)
              // showFaliureToast("Cannot heheheheheeheh update")
            } else {
          setloaderupdate(false)
              const errroorMsg = error?.response?.data?.message ? toSentenceCase(error?.response?.data?.message) : '';
              errroorMsg ?  showFaliureToast(errroorMsg ):''
            }
            AppLogger("Error at updateEditPreferenceSliderHandler", error)
          })
    } catch (error) {
      setloaderupdate(false)
      console.log(error)
    }


  return updatedData;
  };

  const [ showAdditemModal, setShowAdditemModal ] = useState(false);
  const [finalData, setFinalData] = useState({ otherItemData: null, snackData: null, mealData: null });

  const handleAddItemModalClose = () => {
    setShowAdditemModal(false);
  };
  
  const handleAddItemModalOpen = () => {
    setShowAdditemModal(true);
  };

  return (
    <>
      {/* { 
       cards?.length >=1 &&
        (isStagingServer() || isProductionServer()) ? (
          <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: 
              `
               window.dataLayer.push({
               event: "add_payment_info"
               });
                `
          }}
        >
          </Script>
          ) : null} */}
          {
            GtmCodeInject && (isStagingServer()  || isProductionServer())? (
               <Script
               strategy="afterInteractive"
               dangerouslySetInnerHTML={{
                 __html: 
                   `
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                    event: "pay_now_clicks",
                    });
                     `
               }}
             ></Script>
           ) : null}
            {/* { 
             isStagingServer() ? (
               <Script
               strategy="afterInteractive"
               dangerouslySetInnerHTML={{
                 __html: 
                   `
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                    event: "payment_method",
                    payment_method: ${JSON.stringify(Paymethod)}
                    });
                     `
               }}
             ></Script>
           ) : null} */}

      {/* <CheckOutTicker  clicked={handleCheckOutRequest} /> */}
      {/* {isLoading  && <Loader2 />} */}
      {loader && <Loader2 />}
      {/* <ConditionalTicker onPay={handleCheckOutRequest} /> */}
      {showAddCardPopup && (
        <AddCardPopup
          cardError={cardError}
          saveCardRequest={handleAddCardRequest}
          editCardRequest={handleStripeCardEdit}
          updateMode={updateMode}
          open={showAddCardPopup}
          editCardBody={editCardBody}
          handleClose={() => {
            setShowAddCardPopup(false)
            if (updateMode) {
              setUpdateMode(false)
              setEditCardBody(null)
            }
          }}
          loading={apiLoading}
        />
      )}
      {
        showDaysUpdatePopup &&
         <AddressDaysPopup
           open={showDaysUpdatePopup}
           availableDays={availableDeliveryDays} 
           updateDays={updateDays}
           handleClose={() => {setShowDaysUpdatePopup(false)}}
         />
      }
      {showAddAddressPopup && (
        <AddAddressPopup
          availableDeliveryDays={availableDeliveryDays}
          handleAddAddressRequest={handleAddAddressRequest}
          open={showAddAddressPopup}
          currentAddress={currentAddressData}
          updateAddress={handleUpdateAddressRequest}
          handleClose={() => setShowAddressPopup(false)}
          AddressLoader={AddressLoader}
          setShowAddressPopup={setShowAddressPopup}
          TotalAddressLength = {addresses?.length ?? 0}
        />
      )}
      <div className={`checkout--pageSummary ${isExecutive ? "isExecutive" : ""} `}>
        <div className="container container--custom">
          <div className={`${styles.checkoutWrapper} ${isExecutive ? styles.isExecutive : ""}`}>
            <div className={styles.summaryBox}>
              {/* Meal Plan Details BOX */}
              <div className={styles.order_summary}>
                <Typography
                  variant="h4"
                  sx={{ color: AppColors.primaryGreen }}
                  className={clsx(styles.heading, styles.pageTitle)}
                >
                  Order Summary
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: AppColors.primaryGreen,
                    fontWeight: "500 !important"
                  }}
                  className={styles.heading}
                >
                  <span style={{backgroundColor:isExecutive?AppColors.primaryOrange:AppColors.primaryGreen}}>1</span> Meal Plan Details
                </Typography>
                <div className={styles.summary_details}>
                  <div className={styles.price_wrapper}>
                    <div className={styles.details_wrapper}>
                      {totalWeeks && (
                        <Typography
                          variant="body3"
                          color="initial"
                          fontWeight={500}
                          sx={{}}
                        >
                          {`1 x PractiCal${isExecutive ? " Executive" : ""} Meal Plan`}
                          {orderType !== "top up"
                            ? ` (${checkoutBody.is_subscribed
                              ? 4
                              : totalWeeks ?? totalWeeks
                            } ${checkoutBody.is_subscribed
                              ? "weeks"
                              : totalWeeks > 1
                                ? "weeks"
                                : "week"
                            })`
                            : null}
                        </Typography>
                      )}
                      <Typography
                        className={styles.paraSM}
                        variant="body3"
                        color="initial"
                      >
                        {console.log("walletAmount",walletAmount)}
                        {console.log("walletAmount",walletAmount)}
                        {
                        promocodeLoader ? "Updating price ..." :  
                        isMyDiscountValueNegative ? 
                        `${totalAmounttoShow}` :
                        `AED ${Number(roundHalfDown(week_discount_details && !discountSummaryLocal ? 
                            discounted_price : 
                          subTotal)).toFixed(2)}`
                        }
                      </Typography>
                    </div>
                    {desclaimer ? (
                      <div>
                        <Typography
                          sx={{ fontSize: "12px !important" }}
                          variant="body3"
                          fontWeight={500}
                          color={AppColors.primaryGreen}
                        >
                          {desclaimer ?? ""}
                        </Typography>
                      </div>
                    ) : null}
                    {addon_disclaimer ? (
                      <div>
                        <Typography
                          sx={{ fontSize: "12px !important" }}
                          variant="body3"
                          fontWeight={500}
                          color={AppColors.primaryGreen}
                        >
                          {addon_disclaimer ?? ""}
                        </Typography>
                      </div>
                    ) : null}
                    {extras_disclaimer ? (
                      <div>
                        <Typography
                          sx={{ fontSize: "12px !important" }}
                          variant="body3"
                          fontWeight={500}
                          color={AppColors.primaryGreen}
                        >
                          {extras_disclaimer ?? ""}
                        </Typography>
                      </div>
                    ) : null}
                    {proteinDisclaimer ? (
                      <div>
                        <Typography
                          sx={{ fontSize: "12px !important" }}
                          variant="body3"
                          fontWeight={500}
                          color={AppColors.primaryGreen}
                        >
                          {proteinDisclaimer ?? ""}
                        </Typography>
                      </div>
                    ) : null}
                    {/* {week_discount_details && !discountSummaryLocal ? (
                      <div>
                        <Typography
                          sx={{ fontSize: "12px !important" }}
                          variant="body3"
                          fontWeight={500}
                          color={AppColors.primaryGreen}
                        >
                          {`You saved ${roundHalfDown(NonDisocuntAmountSave)} AED as ${display_key}` ?? ""}
                        </Typography>
                      </div>
                    ) : null} */}
                    {/* {promoCodeWalletCredit ? (
                      <div>
                        <Typography
                          sx={{ fontSize: "12px !important" }}
                          variant="body3"
                          fontWeight={500}
                          color={AppColors.primaryGreen}
                        >
                          {`Reward amount ${promoCodeWalletCredit?.rewardValue} AED be credited to your wallet`}
                        </Typography>
                      </div>
                    ) : null} */}
                  </div>
                  {/* <div className={styles.price_wrapper}>
                    <div className={styles.details_wrapper}>
                      <Typography
                        variant="body3"
                        color="initial"
                        sx={{ color: AppColors.green }}
                      >
                        5% Subcription Discount
                      </Typography>
                      <Typography
                        className={styles.paraSM}
                        sx={{ color: AppColors.green }}
                        variant="body3"
                        color="initial"
                      >
                        {`AED ${subTotal}`}
                      </Typography>
                    </div>
                  </div> */}
                  {promoApplied && orderType !== "top up" && (
                    <div className={styles.price_wrapper}>
                      {promoCodeSummaryLocal === null || promoDiscountValueWRTWeekToDisplay == 0  || isMyDiscountValueNegative ? null :
                      // promoCodeWalletCredit ? null : (
                      // promoCodeWalletCredit ? null : (
                  (
                        <>
                          <div className={styles.details_wrapper}>
                            <Typography
                              variant="body3"
                              color="initial"
                              sx={{
                                color: AppColors.green,
                                textTransform: "uppercase"
                              }}
                            >
                              <Off50 />
                              {promocodeLoader ? "loading promo code ..." :  promoSummaryTitle}
                            </Typography>
                          
                                {/* {
                                  console.log('funccc',percentCalculationV2(
                                  promoDiscountValueWRTWeek,
                                  addon_price != 0 ? ((subTotal - extraProteinPrice) - addon_price - total_bag_fees ?? 0):(subTotal - extraProteinPrice),
                                  promoCodeSummaryLocal,
                                  {meal_price: mealPrice, snack_price: snackPrice}
                                )) */}
                                {/* } */}
                            <Typography
                              className={styles.paraSM}
                              variant="body3"
                              sx={{ color: AppColors.green }}
                              color="initial"
                            >
                              {
                                promoCodeWalletCredit?.rewardValue ?
                                `AED ${promoCodeWalletCredit?.rewardValue}`
                                :
                              `AED (-)  ${discountType !== "flat"
                                ? percentCalculationV2(
                                  promoDiscountValueWRTWeek,
                                  addon_price != 0 ? ((subTotal - extraProteinPrice) - addon_price - (total_bag_fees ?? 0)):(subTotal - extraProteinPrice - (total_bag_fees ?? 0)),
                                  promoCodeSummaryLocal,
                                  {meal_price: mealPrice, snack_price: snackPrice}
                                )
                                : Number(promoDiscountValueWRTWeek).toFixed(2)
                                }`
                              }
                            </Typography>
                          </div>
                        </>
                      )}
                      {extraProteinPrice && promoApplied && orderType !== "top up" ? (
                        <div>
                          <Typography
                            sx={{ fontSize: "12px !important" }}
                            variant="body3"
                            fontWeight={500}
                            color={AppColors.primaryGreen}
                          >
                            {'Please note: Discounts do not apply to "Add Protein" Top Ups.'}
                          </Typography>
                        </div>
                      ) : null}
                    </div>
                  )}
                  {/* {checkoutBody.is_subscribed &&
                    orderType !== "top up" &&
                    subscriptionDiscount?.value && !promoApplied && (
                      <div className={styles.discount_wrapper}>
                        <div className={styles.details_wrapper}>
                          {subscriptionDiscount?.value && (
                            <Typography
                              variant="body3"
                              sx={{ color: AppColors.green }}
                              fontWeight={600}
                            >
                              {`${subscriptionDiscount?.value}% Subcription Discount`}
                            </Typography>
                          )}
                          {getSubscriptionDiscount() && (
                            <Typography
                              variant="body3"
                              sx={{ color: AppColors.green }}
                              fontWeight={600}
                            >
                              {`AED (-) ${getSubscriptionDiscount()}`}
                            </Typography>
                          )}
                        </div>
                      </div>
                    )} */}
                  {walletAmount &&
                    (walletAmount < getTotalPayable() ||
                      walletAmount >= getTotalPayable()) ? (
                    <div className={styles.discount_wrapper}>
                      <div className={styles.details_wrapper}>
                        <Typography
                          variant="body3"
                          sx={{ color: AppColors.green }}
                          fontWeight={600}
                        >
                          From your available balance (Wallet)
                        </Typography>

                        <Typography
                          variant="body3"
                          sx={{ color: AppColors.green }}
                          fontWeight={600}
                        >
                          {`AED (-) ${handleShowWalletDiscount(
                            week_discount_details && !discountSummaryLocal ? discounted_price : getTotalPayable(), walletAmount)}.00`}
                        </Typography>
                      </div>
                    </div>
                  ) : null}
                  {/* {promoApplied && (
                    <div className={styles.coupon_wrapper}>
                      <div className={styles.details_wrapper}>
                        <div className={styles.sty1}>
                          <div className="image">
                            <img
                              src="/images/checkout/coupon-svgrepo.png"
                              alt=""
                            />
                          </div>
                          <Typography
                            variant="body3"
                            sx={{ color: AppColors.green }}
                            ml={1}
                            fontWeight={600}
                          >
                            {promoSummaryTitle}
                          </Typography>
                        </div>

                        <Typography
                          variant="body3"
                          sx={{ color: AppColors.green }}
                          fontWeight={600}
                        >
                          AED (-){promoDiscountValueWRTWeek}
                        </Typography>
                      </div>
                    </div>
                  )} */}
                  <div className={styles.total_wrapper}>
                    <div className={styles.details_wrapper}>
                      <Typography
                        variant="body1"
                        sx={{ color: AppColors.primaryGreen }}
                        fontWeight={600}
                      >
                        Total
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: AppColors.primaryGreen }}
                        fontWeight={600}
                      >
                        {
                        promocodeLoader ? "Updating price ..." :  
                        week_discount_details && !discountSummaryLocal ? `AED ${Number(roundHalfDown(discounted_price - (walletAmount ?? 0))).toFixed(2)}` : totalAmounttoShow}
                        {/* {getTotalPayable() && `AED ${handleSubtotalPrice(getTotalPayable(), walletAmount)}`} */}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>


              {/* Decoraton work start */}
                  {
                    showCheckoutDecor && topUpStatus != "top up" &&
                      <UpgradeOfferBannerDynamic
                       mealsPerDay={mealsPerDay}
                       snacksPerDay={snacksPerDay}
                       daysPerWeek={daysPerWeek}
                       loaderupdate={loaderupdate}
                       weeks={weeks}
                       isExecutive={isExecutive}
                       onUpgrade={(type) => {
                         handleUpgrade(type)
                         console.log("User clicked upgrade for:", type)
                       }}
                       />
                  }
                    {
                      showAdditemDecor && topUpStatus != "top up" &&
                        <Additembox 
                          showCheckoutDecor={showCheckoutDecor}
                            onClick={handleAddItemModalOpen}
                            mealsOnClick={handleAddItemModalOpen}
                            snacksOnClick={handleAddItemModalOpen}
                            extrasOnClick={handleAddItemModalOpen} />
                    }
                  {showAdditemModal &&
                    <AdditemModal
                      open={showAdditemModal}
                      handleCloseOut={handleAddItemModalClose} 
                      orderIDfromProps={orderSummaryLocal?.order_history?.order_id}
                      finalData={finalData}
                      setFinalData={setFinalData}
                     
                    />
                  }
                 {/* <Button
                    variant="contained"
                    color="success"
                    sx={{
                        ...buttonSX,
                        mt: '30px !important',
                        mx: 'auto'
                    }}
                   
                >
                  Want to add extra items? like coffee, electrolytes etc.
                </Button> */}
              {/* Decoraton work end */}

              {topUpStatus !== "top up" && !isExecutive && (
                <div className={styles.sec_payment_method}>
                  <Typography
                    variant="h6"
                    sx={{ color: AppColors.primaryGreen }}
                    className={styles.heading}
                  >
                    <span style={{backgroundColor:isExecutive?AppColors.primaryOrange:AppColors.primaryGreen}}>{(showCheckoutDecor || showAdditemDecor) ?"3" :"2"}</span> Choose your preferred Plan mode
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: AppColors.black }}
                    className={styles.optionTitle}
                  >
                    I want to:
                  </Typography>
                  <div className={styles.payment_wrapper}>
                    <div className={styles.radio_wrapper}>
                      <RadioGroup
                        aria-labelledby="buttons-group-label"
                        // defaultValue={subscribedStatus.toString()}
                        name="radio-buttons-group"
                        value={radioVal}
                        className={clsx(styles.radio_group, styles.style2, isExecutive ? styles.isExecutive : '')}
                        onChange={(_, value) => {
                          handlePaymentMethodType(value)
                        }}
                      >
                        <PaymentMethodComp
                          title="Make a one-time payment"
                          description=" Useful if you want to try us out!"
                          value={0}
                          makeFullWidth={FirstUnPaidOrder && !conditionForPaymob}
                          // currentValue={
                          //   checkoutBody.is_subscribed == true ? 1 : 0
                          // }
                        />
                      {(!isExecutive && (!FirstUnPaidOrder || conditionForPaymob)) && <PaymentMethodComp title="Subscribe & Save" description=" Get a subscription discount when your Meal Plan auto-renews. 4 week plans only , cannot be used together with another discount offer." caption="Valid on Full Price Plans Only" value={1} />}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              )}
              <div
                className={clsx(
                  styles.delivery_wrapper,
                  styles.sty2,
                  styles.mblOnly
                )}
              >
                <div className={styles.Headingwrap}>
                  <Typography
                    variant="h6"
                    sx={{ color: AppColors.primaryGreen }}
                    className={styles.heading}
                  >
                    <span style={{backgroundColor:isExecutive?AppColors.primaryOrange:AppColors.primaryGreen}}>
                      {topUpStatus !== "top up" && !isExecutive ? (showCheckoutDecor || showAdditemDecor) ? "4": "3" : "2"} 
                    </span>{" "}
                    Delivery Address
                  </Typography>
                  <div
                    style={{
                      pointerEvents: addresses.length >= 5 ? "none" : "all",
                      opacity: addresses.length >= 5 ? 0.5 : 1
                    }}
                    className={styles.addNewAddress}
                    onClick={() => {
                      setShowAddressPopup(true)
                      setCurrentAddressData({
                        address_line_one: "",
                        address_line_two: "",
                        label: "",
                        address_id: ""
                      })
                    }}
                  >
                    <div className={`${styles.addIcon} `}>
                      <PlusIcon />
                    </div>
                    <Typography
                      variant="body2"
                      sx={{ color: AppColors.black, paddingBottom: "0" }}
                    >
                      Add New Address
                    </Typography>
                  </div>
                </div>
                <RadioGroup
                  aria-labelledby="buttons-group-label"
                  value={
                    addresses.length > 0 ? addresses?.[0]?.id : null
                  }
                  name="radio-buttons-group"
                  className={styles.radio_group}
                  onChange={(_, value) => {
                    AppLogger("Clicked address", value)
                    onSelectDefaultHandler(value)
                    const selectedAddressTimeSlot = addresses.find(
                      (val) => val.id == value
                    )?.time_slot

                    if (selectedAddressTimeSlot) {
                      checkoutBody.time_slot = selectedAddressTimeSlot
                    }
                    checkoutBody.address_id = value
                    setCheckoutBody({ ...checkoutBody })
                  }}
                >
                  {addresses.map((address, index) => {
                    const {
                      label,
                      address_line_one,
                      address_line_two,
                      id,
                      type,
                      street,
                      apartment,
                      time_slot,
                      emirate_id,
                      area_id,
                      emirate,
                      area,
                      days
                    } = address
                    return (
                      <AddressComp
                        value={id}
                        key={index}
                        currentValue={checkoutBody.address_id}
                        label={type !== "other" ? type ?? "" : label ?? ""}
                        address_line_one={address_line_one ?? ""}
                        address_line_two={address_line_two ?? ""}
                        address_area={address?.area?.name}
                        address_emirates={address?.emirate?.name}
                        street={address?.street}
                        apartment={address?.apartment}
                        time_slot={address?.time_slot}
                        days={days}
                        availableDays={availableDeliveryDays}
                        id={id}
                        onEdit={() => {
                          if(isExecutive){
                            // if executive case add stuff here
                          }else{
                            setShowAddressPopup(true)
                            setCurrentAddressData({
                              address_line_one: address_line_one ?? "",
                              label: label,
                              address_line_two: address_line_two ?? "",
                              address_id: id,
                              type: type ?? "",
                              street: street ?? "",
                              apartment: apartment ?? "",
                              time_slot: time_slot ?? "",
                              emirate_id: emirate_id ?? "",
                              area_id: area_id ?? "",
                              emirate: emirate ?? "",
                              area: area ?? "",
                              days: days ?? "",
                              timeSlots: allTimeSlot?.find(
                                (val) => val.city == emirate?.name
                              )?.values,
                              cities: UAEAddressesLocal?.find(
                                (val) => val.name == emirate?.name
                              )?.areas
                            })
                          }
                        }}
                        onRemove={() => {
                          AppLogger("Clicked Remove Address")
                          handleDeleteAddressRequest(id)
                        }}
                      />
                    )
                  })}
                </RadioGroup>
                {
                  addresses?.length > 1 ?
                    <div className={styles.assignDelivery}>
                      <Typography
                        variant="body2"
                        sx={{ color: AppColors.black, paddingBottom: "0" }}
                      >
                        Assign Delivery Address Days
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setShowDaysUpdatePopup(true)
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
                    </div> : null
                }
                <div className={styles.specialInstrucion}>
                  <Typography
                    variant="body2"
                    sx={{ color: AppColors.black, paddingBottom: "0" }}
                    className={styles.heading}
                  >
                    Please write any special instructions here
                  </Typography>
                  <div className={styles.textBox}>
                    <textarea
                      placeholder="Please leave outside the front door"
                      value={checkoutBody.instructions ?? ""}
                      onChange={(e) => {
                        AppLogger("Value", e.target.value)
                        checkoutBody.instructions = e.target.value
                        setCheckoutBody({ ...checkoutBody })
                      }}
                      className={styles.instrucionBox}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* for mobile only */}
              {
                // ( !conditionForPaymob ? 
                //   FirstUnPaidOrder ? false : true : false
                ( true
                ) && 
              <div className={clsx(styles.cardDetailBox, styles.mblOnly, isExecutive && styles.isExecutive)}>
                <div className={styles.postBox}>
                  <div className={styles.postBoxWrapper}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: AppColors.primaryGreen,
                        fontWeight: "500",
                        marginBottom: "15px"
                      }}
                      className={styles.title}
                    >
                      <span style={{backgroundColor:isExecutive?AppColors.primaryOrange:AppColors.primaryGreen}}>
                        {topUpStatus !== "top up" && !isExecutive ? (showCheckoutDecor || showAdditemDecor) ? "5": "4" : "3"}
                        </span>{" "}
                      Credit/Debit Cards
                    </Typography>
                    {cards.length < 5 && (
                       <Box sx={{...DFJCAC,gap:'10px'}} > 
                     <div
                        className={styles.addCard}
                        onClick={handleCardClick}
                      >
                        <div className={styles.addIcon}>
                          <AddCard />
                        </div>
                        <Typography
                          variant="body2"
                          sx={{ color: AppColors.black, paddingBottom: "0" }}
                        >
                          Add Card
                        </Typography>
                      </div>
                      {/* {
                        isDevServer() &&
                     <div
                        className={styles.addCard}
                        onClick={() => {
                          setModalPaymentOpen(true)
                          // if(conditionForPaymob || FirstUnPaidOrder){
                          //   return
                          // } 
                          // // console.log("this is clicked=====")
                          // setErrorMessage("")
                          // setShowAddCardPopup(true)
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: AppColors.black, paddingBottom: "0" }}
                        >
                          Add PM Card
                        </Typography>
                      </div>
                      } */}
                       
                       </Box>
                    
                    )}
                  </div>
                  <div className={styles.payment_wrapper}>
                    <div className={styles.radio_wrapper}>
                      <RadioGroup
                        value={checkoutBody.card_id}
                        aria-labelledby="buttons-group-label"
                        // defaultValue="card1"
                        name="radio-buttons-group"
                        className={styles.radio_group}
                        onChange={(_, value) => {
                          AppLogger("Clicked card", value)
                          checkoutBody.card_id = value
                          setCheckoutBody({ ...checkoutBody })
                        }}
                      >
                        {cards.map((card, index) => {
                          const { name, card_number, id, brand } = card
                          return (
                            <CardsComponent
                              brand={brand}
                              onEditPressHandler={() =>
                                onEditPressHandler(card)
                              }
                              canEdit={card?.stripe_card_id == null ? false : true}
                              key={index}
                              name={name}
                              currentValue={checkoutBody.card_id}
                              card_number={card_number}
                              id={id}
                              onDelete={() => {
                                AppLogger("Clicked Delete Card")
                                handleDeleteCardRequest(id)
                              }}
                            />
                          )
                        })}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
              }
              <div
                className={clsx(
                  styles.delivery_wrapper,
                  styles.sty2,
                  styles.hide
                )}
              >
                <div className={styles.Headingwrap}>
                  <Typography
                    variant="h6"
                    sx={{ color: AppColors.primaryGreen }}
                    className={styles.heading}
                  >
                    <span style={{backgroundColor:isExecutive?AppColors.primaryOrange:AppColors.primaryGreen}}>
                      {topUpStatus !== "top up" && !isExecutive ?(showCheckoutDecor || showAdditemDecor) ? "4": "3" : "2"}</span> Delivery
                    Address
                  </Typography>
                    <div
                      style={{
                        pointerEvents: addresses.length >= 5 ? "none" : "all",
                        opacity: addresses.length >= 5 ? 0.5 : 1
                      }}
                      className={`${styles.addNewAddress} ${isExecutive ? styles.isExecutive : ""}`}
                      onClick={() => {
                        setShowAddressPopup(true)
                        setCurrentAddressData({
                          address_line_one: "",
                          address_line_two: "",
                          label: "",
                          address_id: ""
                        })
                      }}
                    >
                      <div className={styles.addIcon}>
                        <PlusIcon />
                      </div>
                      <Typography
                        variant="body2"
                        sx={{ color: AppColors.black, paddingBottom: "0" }}
                      >
                        Add New Address
                      </Typography>
                    </div>
                </div>
                <RadioGroup
                  aria-labelledby="buttons-group-label"
                  // defaultValue={
                  //   addresses.length > 0 ? addresses?.[0]?.id : null
                  // }
                  value={
                    addresses.length > 0 ? addresses?.[0]?.id : null
                  }
                  name="radio-buttons-group"
                  className={clsx(styles.radio_group)}
                  onChange={(_, value) => {
                    AppLogger("Clicked address", value)
                    onSelectDefaultHandler(value)
                    const selectedAddressTimeSlot = addresses.find(
                      (val) => val.id == value
                    )?.time_slot

                    if (selectedAddressTimeSlot) {
                      checkoutBody.time_slot = selectedAddressTimeSlot
                    }
                    checkoutBody.address_id = value
                    setCheckoutBody({ ...checkoutBody })
                  }}
                >
                  {addresses.map((address, index) => {
                    const {
                      label,
                      address_line_one,
                      address_line_two,
                      id,
                      type,
                      street,
                      apartment,
                      time_slot,
                      emirate_id,
                      area_id,
                      emirate,
                      area,
                      days
                    } = address
                    return (
                      <AddressComp
                        key={index}
                        currentValue={checkoutBody.address_id}
                        label={type !== "other" ? type ?? "" : label ?? ""}
                        address_line_one={address_line_one ?? ""}
                        address_line_two={address_line_two ?? ""}
                        address_area={address?.area?.name}
                        address_emirates={address?.emirate?.name}
                        street={address?.street}
                        apartment={address?.apartment}
                        time_slot={address?.time_slot}
                        id={id}
                        days={days}
                        availableDays={availableDeliveryDays}
                        onEdit={() => {
                          if(isExecutive){
                            // if executive case add stuff here
                          }else{
                            setShowAddressPopup(true)
                            setCurrentAddressData({
                              address_line_one: address_line_one ?? "",
                              label: label,
                              address_line_two: address_line_two ?? "",
                              address_id: id,
                              type: type ?? "",
                              street: street ?? "",
                              apartment: apartment ?? "",
                              days: days ?? '',
                              time_slot: time_slot ?? "",
                              emirate_id: emirate_id ?? "",
                              area_id: area_id ?? "",
                              emirate: emirate ?? "",
                              area: area ?? "",
                              timeSlots: allTimeSlot?.find(
                                (val) => val.city == emirate?.name
                              )?.values,
                              cities: UAEAddressesLocal?.find(
                                (val) => val.name == emirate?.name
                              )?.areas
                            })
                          }
                        }}
                        onRemove={() => {
                          AppLogger("Clicked Remove Address")
                          handleDeleteAddressRequest(id)
                        }}
                      />
                    )
                  })}
                </RadioGroup>
                {
                  addresses?.length > 1 ?
                    <div className={styles.assignDelivery}>
                      <Typography
                        variant="body2"
                        sx={{ color: AppColors.black, paddingBottom: "0" }}
                      >
                        Assign Delivery Address Days
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setShowDaysUpdatePopup(true)
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
                    </div> : null
                }
                <div className={styles.specialInstrucion}>
                  <Typography
                    variant="body2"
                    sx={{ color: AppColors.black, paddingBottom: "0" }}
                    className={styles.heading}
                    component={'p'}
                  >
                    Please write any special instructions here
                  </Typography>
                  <div className={styles.textBox}>
                    <textarea
                      placeholder="Please leave outside the front door"
                      value={checkoutBody.instructions}
                      onChange={(e) => {
                        AppLogger("Value", e.target.value)
                        checkoutBody.instructions = e.target.value
                        setCheckoutBody({ ...checkoutBody })
                      }}
                      className={styles.instrucionBox}
                    ></textarea>
                  </div>
                </div>
              </div>
              {/* <div className={styles.delivery_time}>
                <div className="deliveryTime">
                  <Typography
                    variant="h6"
                    sx={{ color: AppColors.primaryGreen }}
                    className={styles.heading}
                  >
                    Delivery Time Slot
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: AppColors.black, paddingBottom: "0" }}
                    className={styles.heading}
                  >
                    What time slot do you want your food delivered?
                  </Typography>
                  <div className={styles.time_slots}>
                    <div className={styles.radio_wrapper}>
                      <RadioGroup
                        aria-labelledby="buttons-group-label"
                        defaultValue={checkoutBody.time_slot?.split(":")[1]}
                        value={checkoutBody.time_slot?.split(":")[1]}
                        name="radio-buttons-group"
                        className={styles.radio_group}
                        onChange={(_, value) => {
                          AppLogger("Clicked delivery timeslot", value)
                          checkoutBody.time_slot = value
                          setCheckoutBody({ ...checkoutBody })
                        }}
                      >
                        {allTimeSlot.map((time, i) => {
                          return (
                            <div key={i} className={styles.deliveryWrap}>
                              <div className={styles.Heading}>
                                <Typography variant="body3">
                                  {time.city}
                                </Typography>
                              </div>

                              {time.values.map((ts, index) => {
                                return (
                                  <TimeSlotComp
                                    disabled={time.city !== selectedAddress}
                                    key={index}
                                    delivery_time={`${time.city}:${ts}`}
                                    currentTime={checkoutBody.time_slot}
                                    // delivery_time={get(
                                    //   summaryProfile,
                                    //   "delivery_time",
                                    //   ""
                                    // )}
                                  />
                                )
                              })}
                            </div>
                          )
                        })}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div> */}
              {
                //  ( !conditionForPaymob ? 
                //   FirstUnPaidOrder ? false : true : false
                // ) &&
                 ( true
                ) &&
              <div
                className={clsx(
                  styles.cardDetailBox,
                  styles.desktopOnly,
                  styles.sty2
                )}
              >
                <div className={styles.postBox}>
                  
                  <div className={styles.headingWrap}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: AppColors.primaryGreen,
                        fontWeight: "500"
                      }}
                      className={styles.heading}
                    >
                      <span style={{backgroundColor:isExecutive?AppColors.primaryOrange:AppColors.primaryGreen}}>
                        {topUpStatus !== "top up" && !isExecutive ?(showCheckoutDecor || showAdditemDecor) ? "5": "4" : "3"}</span> Credit
                      /Debit Cards
                    </Typography>
                    {cards.length < 5 && (
                      <Box sx={{...DFJCAC,gap:'10px'}} > 
                      <div
                        className={`${styles.addCard} ${isExecutive ? styles.isExecutive : ""}`}
                        onClick={handleCardClick}>
                        <div className={styles.addIcon}>
                          <AddCard />
                        </div>
                        <Typography
                          variant="body2"
                          sx={{ color: AppColors.black, paddingBottom: "0" }}
                        >
                          Add Card
                        </Typography>
                      </div>
                      {/* {
                        isDevServer() &&
                      <div
                        className={`${styles.addCard} ${isExecutive ? styles.isExecutive : ""}`}
                        onClick={() => {
                          setModalPaymentOpen(true)
                          // if(conditionForPaymob || FirstUnPaidOrder){
                          //   setModalPaymentOpen(true)
                          //   return
                          // } 
                          // setErrorMessage("")
                          // setShowAddCardPopup(true)
                        }}
                      >
                      
                        <Typography
                          variant="body2"
                          sx={{ color: AppColors.primaryGreen, paddingBottom: "0" }}
                        >
                          Add PM Card
                        </Typography>
                      </div>
                      } */}
                      </Box>
                    )}
                  </div>
                  <div className={styles.payment_wrapper}>
                    <div className={styles.radio_wrapper}>
                      <RadioGroup
                        aria-labelledby="buttons-group-label"
                        // defaultValue={checkoutBody.card_id}
                        name="radio-buttons-group"
                        className={styles.radio_group}
                        onChange={(_, value) => {
                          AppLogger("Clicked card", value)
                          // checkoutBody.card_id = value
                          onSelectCardHandler(value)
                          setCheckoutBody({ ...checkoutBody,card_id:value })
                        }}
                      >
                        {/* {console.log(checkoutBody.card_id, "cards?.[0]?.id")} */}

                        {cards?.map((card, index) => {
                          const { name, card_number, id, brand } = card
                          return (
                            <CardComp
                              brand={brand}
                              key={index}
                              name={name}
                              canEdit={card?.stripe_card_id == null ? false : true}
                              currentValue={checkoutBody.card_id ? checkoutBody.card_id : cardDefaultLocal?.id}
                              card_number={card_number}
                              id={id}
                              onEditPressHandler={() =>
                                onEditPressHandler(card)
                              }
                              onDelete={() => {
                                AppLogger("Clicked Delete Card")
                                handleDeleteCardRequest(id)
                              }}
                            />
                          )
                        })}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
              }
            </div>
            {/* for mobile only */}
            {!isExecutive && orderType !== "top up" && (
              <div className={clsx(styles.paymentWrapper, styles.mblOnly)}>
                <Typography
                  variant="body2"
                  sx={{ color: AppColors.black, marginBottom: "20px" }}
                  className={styles.heading}
                >
                  Now let’s make it as cost effective as possible
                </Typography>
                <div className={styles.promoBox}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: AppColors.white,
                      fontWeight: "500",
                      marginBottom: "15px"
                    }}
                    className={styles.heading}
                  >
                    Promo Code*
                  </Typography>
                  <form action="">
                    <div className={styles.btn_sec} >
                      <div className="subCta sty2">
                        <div className="input-group promo-input">
                          <InputField
                            disabled={promocodeLoader}
                            placeholder="Enter Promo Code"
                            value={promoCode}
                            customClass="promoCodeInputField"
                            onChange={(e) => {
                              setconditionForPromoApplied(false)
                              setPromoCode(e.target.value.toUpperCase())
                              AppLogger("Promo Code", e.target.value)
                            }}
                          />
                          {errorMessage && errorMessage !== "" && (
                            <Typography
                              sx={{
                                color: AppColors.lightRed,
                                textAlign: "center",
                                fontSize: "15px",
                                paddingBottom: "5px"
                              }}
                            >
                              {errorMessage}
                            </Typography>
                          )}
                          <span className="input-group-btn">
                            <Button
                            onClick={() => {
                                  if(conditionForPromoApplied){
                                    removeAppliedPromo()
                                  }else{
                                  setButtonClicked(true)
                                  AppLogger("Clicked apply promo")
                                  handleApplyPromoCode()
                                }
                                }}
                              variant="outlined"
                              sx={{
                                minWidth: "114px",
                                padding: "0",
                                fontSize: "12px !important",
                                disableRipple: true,
                                background: AppColors.white,
                                color:conditionForPromoApplied?AppColors.lightRed: AppColors.primaryGreen,
                                borderRadius: "50px",
                                borderColor: AppColors.white,
                                "&:hover": {
                                  background: AppColors.white,
                                  color:conditionForPromoApplied?AppColors.lightRed: AppColors.primaryGreen,
                                  borderRadius: "50px",
                                  borderColor: AppColors.white
                                }
                              }}
                            >
                             {
                                  conditionForPromoApplied? 
                                  "Remove":
                                  "Apply"
                                }
                            </Button>
                          </span>
                        </div>
                      </div>
                    </div>
                  </form>
                  <Typography
                    variant="body2"
                    sx={{
                      color: AppColors.white,
                      fontSize: "8px",
                      textAlign: "center",
                      marginTop: "10px"
                    }}
                    className={styles.heading}
                  >
                    *Please note: Only one discount code can be used per
                    purchase
                  </Typography>{" "}
                  {/* topUpStatus !== "top up" */}
                  {promoApplied &&
                    topUpStatus !== "top up" &&
                    orderType !== "top up" &&
                    (
                      <>
                        {
                        !isMyDiscountValueNegative &&
                          <Typography
                            variant="body2"
                            sx={{
                              color: AppColors.white,
                              fontWeight: "500",
                              marginBottom: "5px",
                              marginTop: "20px",
                              textAlign: "center",
                              fontSize: '13px'
                            }}
                            className={styles.heading}
                          >
                            {promoMessage}
                            
                          </Typography>
                        }
                        {/* {
                          DiscountObj?.reward_type != AppConstants.getDiscountRewardType.wallet_credit && DiscountObj?.cap_amount &&
                            <Typography
                          variant="body2"
                          sx={{
                            color: AppColors.white,
                            textAlign: "center",
                            fontSize: "12px"
                          }}
                          className={styles.heading}
                        >
                        {"*Maximum discount amount capped at "+DiscountObj?.cap_amount+" AED"}
                        </Typography>
                        } */}
                        <Typography
                          variant="body2"
                          className={styles.heading}
                          sx={{
                            color: AppColors.white,
                            textAlign: "center",
                            fontSize: "12px",
                            marginTop:'8px',
                            fontWeight:500

                          }}
                        >
                          {
                              isMyDiscountValueNegative || promoDiscountValueWRTWeekToDisplay == 0 ?
                                `Code ${promoSummaryTitle} is active`
                              :
                            "Coupon Applied"
                          }
                        </Typography>
                      </>
                    )}
                  {
                    week_discount_details && !discountSummaryLocal &&
                      <Typography
                            variant="body2"
                            sx={{
                              color: AppColors.white,
                              fontWeight: "500",
                              marginBottom: "5px",
                              marginTop: "20px",
                              textAlign: "center",
                              fontSize: '13px'
                            }}
                            className={styles.heading}
                          >
                            {`You just saved ${roundHalfDown(NonDisocuntAmountSave)} AED by choosing your plan smartly — with our limited time discounts`}
                          </Typography>
                  }

                </div>
              </div>
            )}
            <div className={styles.paymentWrapper}>
              {orderType !== "top up" && (
                <>
                  {!isExecutive ?
                    <Typography
                      variant="body2"
                      sx={{ color: AppColors.black, marginBottom: "20px" }}
                      className={styles.desktopOnly}
                    >
                      Now let’s make it as cost effective as possible
                    </Typography>
                    : null
                  }
                  {!isExecutive ?
                    <div className={clsx(styles.promoBox, styles.desktopOnly)}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: AppColors.white,
                          fontWeight: "500",
                          marginBottom: "15px"
                        }}
                        className={styles.heading}
                      >
                        Promo Code*
                      </Typography>
                      <div className={styles.btn_sec} >
                        <div className="subCta" >
                          <div className="input-group" >
                            <InputField
                              placeholder="Enter Promo Code"
                              value={promoCode}
                              customClass="promoCodeInputField"
                              onChange={(e) => {
                              setconditionForPromoApplied(false)
                                setPromoCode(e.target.value.toUpperCase())
                                setErrorMessage("")
                                AppLogger("Promo Code", e.target.value)
                              }}
                              
                            />

                            <span className="input-group-btn">
                              <Button
                              disabled={promocodeLoader}
                                onClick={() => {
                                  if(conditionForPromoApplied){
                                    removeAppliedPromo()
                                  }else{
                                  setButtonClicked(true)
                                  AppLogger("Clicked apply promo")
                                  handleApplyPromoCode()
                                }
                                }}
                                variant="outlined"
                                sx={{
                                  minWidth: "114px",
                                  padding: "0",
                                  fontSize: "12px !important",
                                  disableRipple: true,
                                  background: AppColors.white,
                                  color:conditionForPromoApplied?AppColors.lightRed: AppColors.primaryGreen,
                                  borderRadius: "50px",
                                  borderColor: AppColors.white,
                                  "&:hover": {
                                    background: AppColors.white,
                                    color:conditionForPromoApplied?AppColors.lightRed: AppColors.primaryGreen,
                                    borderRadius: "50px",
                                    borderColor: AppColors.white
                                  }
                                }}
                              >
                                {
                                  conditionForPromoApplied? 
                                  "Remove":
                                  "Apply"
                                }
                              </Button>
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* {promoApplied && topUpStatus !== "top up" 
                      &&
                      <Typography
                        className={styles.heading}
                        variant="body2"
                        component="p"
                        color={AppColors.white}
                        sx={{ textDecoration: 'underline',   
                        cursor: 'pointer',textAlign:'center',paddingBottom:'14px' }}
                        onClick={()=>{removeAppliedPromo()}}
                      >
                          Remove promocode
                          </Typography>
                        } */}
                      {errorMessage && errorMessage !== "" && errorMessage !== 0 && (
                        <Typography
                          sx={{
                            color: AppColors.lightRed,
                            textAlign: "center",
                            fontSize: "15px",
                            paddingBottom: "5px"
                          }}
                        >
                          {errorMessage}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          color: AppColors.white,
                          fontSize: "12px",
                          textAlign: "center"
                        }}
                        className={styles.heading}
                      >
                        *Please note: Only one discount code can be used per
                        purchase
                      </Typography>
                      {promoApplied && topUpStatus !== "top up" && (
                        <>
                          {promoMessage && !isMyDiscountValueNegative &&
                           (
                            <Typography
                              variant="body2"
                              sx={{
                                color: AppColors.white,
                                fontWeight: "500",
                                marginBottom: "5px",
                                marginTop: "20px",
                                textAlign: "center",
                                fontSize: '13px'
                              }}
                              className={styles.heading}
                            >
                              {/* {
                                promoCodeWalletCredit ? 
                                `Reward amount ${promoCodeWalletCredit?.rewardValue} AED be credited to your wallet` : 
                                `
                                YAY! You saved {promoDiscountValueWRTWeek}
                                ` + discountType !== "flat" ? "%" : ""
                              } */}
                              { promoMessage }
                            </Typography>
                          )}
                           {/* {
                          DiscountObj?.reward_type != AppConstants.getDiscountRewardType.wallet_credit && DiscountObj?.cap_amount &&
                            <Typography
                          variant="body2"
                          sx={{
                            color: AppColors.white,
                            textAlign: "center",
                            fontSize: "12px"
                          }}
                          className={styles.heading}
                        >
                        {"*Maximum discount amount capped at "+DiscountObj?.cap_amount+" AED"}
                        </Typography>
                        } */}
                          <Typography
                            variant="body2"
                            className={styles.heading}
                            sx={{
                              color: AppColors.white,
                              textAlign: "center",
                              fontSize: "12px",
                              marginTop:'8px',
                              fontWeight:500
                            }}
                          >
                            {
                              isMyDiscountValueNegative || promoDiscountValueWRTWeekToDisplay == 0 ?
                                `Code ${promoSummaryTitle} is active`
                                :
                              "Coupon Applied"
                            }
                            
                          </Typography>
                        </>
                      )}
                      {
                          week_discount_details && !discountSummaryLocal &&
                            <Typography
                                  variant="body2"
                                  sx={{
                                    color: AppColors.white,
                                    fontWeight: "500",
                                    marginBottom: "5px",
                                    marginTop: "20px",
                                    textAlign: "center",
                                    fontSize: '13px'
                                  }}
                                  className={styles.heading}
                                >
                                  {`You just saved ${roundHalfDown(NonDisocuntAmountSave)} AED by choosing your plan smartly — with our limited time discounts`}
                                </Typography>
                        }
                    </div>
                    : null
                  }
                </>
              )}

              {/* <div className={clsx(styles.cardDetailBox, styles.desktopOnly)}>
                <div className={styles.postBox}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: AppColors.primaryGreen,
                      fontWeight: "500",
                      marginBottom: "15px"
                    }}
                    className={styles.heading}
                  >
                    Credit /Debit Cards
                  </Typography>
                  <div className={styles.payment_wrapper}>
                    <div className={styles.radio_wrapper}>
                      <RadioGroup
                        aria-labelledby="buttons-group-label"
                        name="radio-buttons-group"
                        className={styles.radio_group}
                        onChange={(_, value) => {
                          AppLogger("Clicked card", value)
                          checkoutBody.card_id = value
                          setCheckoutBody({ ...checkoutBody })
                        }}
                      >

                        {cards.map((card, index) => {
                          const { name, card_number, id } = card
                          return (
                            <CardComp
                              key={index}
                              name={name}
                              currentValue={checkoutBody.card_id}
                              card_number={card_number}
                              id={id}
                              onDelete={() => {
                                AppLogger("Clicked Delete Card")
                                handleDeleteCardRequest(id)
                              }}
                            />
                          )
                        })}
                      </RadioGroup>
                    </div>
                  </div>

                  {cards.length < 5 && (
                    <div
                      className={styles.addCard}
                      onClick={() => {
                        // console.log("this is clicked=====")
                        setErrorMessage("")
                        setShowAddCardPopup(true)
                      }}
                    >
                      <div className={styles.addIcon}>
                        <AddCard />
                      </div>
                      <Typography
                        variant="body2"
                        sx={{ color: AppColors.black, paddingBottom: "0" }}
                        className={styles.heading}
                      >
                        Add Card
                      </Typography>
                    </div>
                  )}
                </div>
              </div> */}
              <div style={{border:isExecutive? "1px solid #fa7324":""}} className={styles.priceBox}>
                <PriceBox
                  disable={checkoutLoader}
                  promoApplied={promoApplied}
                  promoCode={promoCode}
                  checkOutBody={checkoutBody.is_subscribed}
                  checkOut={true}
                  loading={apiLoading}
                  dataRec={dataRec}
                  secStyle={true}
                  placeOrderRequest={() => console.log("this is clicked")}
                  clicked={handleCheckOutRequest}
                  price={
                    week_discount_details && !discountSummaryLocal ?
                    Number(discounted_price).toFixed(0) :
                    promoCodeWalletCredit ? 
                    subTotal :
                    getTotalPayable() &&
                    ` ${getTotalPayable() > 0 ? Math.round(getTotalPayable()) : 0
                    }`
                  }
                />
                
              </div>
         
              {walletAmount && walletAmount > 0 ? (
                 <div style={{border:isExecutive? "1px solid #fa7324":"",backgroundColor:isExecutive?AppColors.lightOrange:""    
                 }} className={styles.walletbox}>
                 <Typography variant="h2" color={isExecutive?AppColors.black:AppColors.white}>
                   Available Balance
                 </Typography>
                 <div style={{border:isExecutive?"1px solid #fa7324":"",
                  backgroundColor:isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen
                 }} className={styles.valueBox}>
                   <Typography
                     variant="h1"
                     color={isExecutive?AppColors.black:AppColors.white}
                   >{`${walletAmount} AED`}</Typography>
                 </div>
               </div>
              ) : null}
            </div>
          </div>
        </div>
        {
          showAssignDelivery &&
            <AssignDelivery
              customClass={'checkOut'}
              open={showAssignDelivery}
              handleClose={() => setShowAssignDelivery(false)}
              availableDays={availableDeliveryDays}
              availableAddresses={addresses}
              handleAddAddress={handleAddAddress}
              handleScheduleAddress={handleScheduleAddress}
              addressWithDays={addressWithDaysLocal}
            />
        }
        {/* This modal is for backup */}
        {/* <PaymentPop
          open={false}
          onClose={()=>setModalPaymentOpen(false)}
          IframeUrl={IframeUrl} 
          PaymentURL={PaymentURL} 
        /> */}
        {
          ModalPaymentOpen &&
        <PaymentPopWithPixelPaymob
          open={ModalPaymentOpen}
          userDetails={userDetails}
          onClose={()=>{
            dispatch(setpaymobRespoUrl(null))
            setModalPaymentOpen(false)
          }}
          IframeUrl={IframeUrl} 
          saveCardRequest={(cardPayload)=>{
            handleGetOrderSummaryRequest().then((res)=>{
               const repsonseCards = res?.data?.cards;
               const firstCardCheck = repsonseCards?.length == 1;
               const cardsData = allCardsDataLocal;
               if(cardsData?.length == repsonseCards?.length){
                 // showFaliureToast("Failed to add card, please check your card details.")
                 console.log("doesnt added card successfully")
                 setModalPaymentOpen(false)
                }else{
                // showSuccessToast("Card Added Successfully")
                 console.log("added card successfully")
               }
            
                if(conditionForPaymob && firstCardCheck){
                 onSelectCardHandler(repsonseCards?.[0]?.id)
               }
            }).catch((err)=>{ 
              console.log("this is error",err)
            })
          }}
          PaymentURL={PaymentURL} 
          accessToken={accessToken} 
          SecretToken={SecretToken} 
        />
        }
      </div>
    </>
  )
}

export default OrderSummaryComp

const CardComp = ({
  name,
  currentValue,
  card_number,
  id,
  onDelete,
  onEditPressHandler,
  brand,
  canEdit = true
}) => {
  return (
    <div className="radioCard">
      <div className={styles.radio_btn}>
        <FormControlLabel
          checked={currentValue == id ? true : false}
          value={id}
          control={<Radio />}
        />
        <div className={clsx(styles.cardBoxBar, styles.sty2)}>
          <div className={styles.radio_content}>
            <div className={styles.cardLogo}>
              {brand === "Visa" ? (
                <img src={AppDataConstant.visaSm} />
              ) : brand === "MasterCard" ? (
                <img src={AppDataConstant.masterCard} />
              ) : null}
            </div>
            <Typography variant={"body3"}>{name}</Typography>
          </div>
          <div className={styles.cardEdit}>
            {
            canEdit && <div className={styles.optionalIcon} onClick={onEditPressHandler}>
              <EditIcon />
            </div>
            }
            <div className={styles.cardNum}>
              {card_number && (
                <Typography variant={"body3"} className={styles.cardNumber}>
                  {/* {card_number} */}

                  {`${card_number.slice(9, card_number.length)}`}
                </Typography>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
const PaymentMethodComp = ({
  value,
  currentValue,
  title,
  description,
  disabled,
  caption,
  makeFullWidth
}) => {
  return (
    <div className={styles.radio_btn} style={{
      flex: makeFullWidth && "0 0 100%",
      maxWidth: makeFullWidth && "100%",
      minHeight: makeFullWidth && '100px'
    }} >
      <FormControlLabel
        // checked={value == currentValue ? true : false}
        value={value}
        control={<Radio />}
        disabled={disabled}
      />
      <div className={styles.radio_content}>
        <Typography
          variant={"body3"}
          className={styles.title}
          sx={{ paddingRight: "16px" }}
        >
          {title}
        </Typography>
        <Typography variant={"body3"}>{description}</Typography>
        {
          caption && <Typography style={{ fontSize: '10px', marginTop: '5px' }}>{caption}</Typography>
        }
      </div>
    </div>
  )
}

const TimeSlotComp = ({ delivery_time, currentTime, disabled }) => {
  return (
    <div className={styles.radio_btn}>
      <FormControlLabel
        disabled={disabled}
        checked={currentTime == delivery_time ? true : false}
        value={delivery_time}
        label={delivery_time?.split(":")[1]}
        control={<Radio />}
      />
      {/* <div className={styles.radio_content}>
        <Typography variant={"body3"} className={styles.title}>
          {delivery_time}
        </Typography>
      </div> */}
    </div>
  )
}

const AddressComp = ({
  label,
  address_line_one,
  address_line_two,
  id,
  onEdit,
  onRemove,
  currentValue,
  address_area,
  address_emirates,
  street,
  apartment,
  time_slot,
  days,
  availableDays,

}) => {
  const { startUpData } = useSelector((state) => state.home)
  const { isExecutive } = useSelector((state) => state.auth)

  const [startUpLocalSummary, setStartUpLocalSummary] = useState(null)

  useEffect(() => {
    if (startUpData) {
      setStartUpLocalSummary(startUpData)
    }
  }, [startUpData])

  const allTimeSlot = get(startUpLocalSummary, "time_slots", [])

  const getSelectedAddressTimeSlots = () => {
    const ts = allTimeSlot.find((val) => val?.city == time_slot?.split(":")[0])
    if (ts) {
      return ts?.values
    }
  }

  return (
    <div className={`addressBar${isExecutive ? " isExecutive" : ""}`}>
      <div className={styles.radio_btn}>
        <FormControlLabel
          checked={currentValue == id && !isExecutive ? true : false}
          disabled={isExecutive} 
          value={id}
          control={<Radio />}
        />
        <div className={styles.addressBar}>
          <div className={styles.radio_content}>
            <Typography variant={"body3"} className={styles.title}>
              {label}
            </Typography>
            <div className="areaWrap">
              <div className="areaDetail">
                <Typography sx={{ fontSize: "13px", lineHeight: "1.5" }}>
                  {address_emirates}
                </Typography>
              </div>
              <div className="areaDetail">
                <Typography sx={{ fontSize: "13px", lineHeight: "1.5" }}>
                  {address_area}
                </Typography>
              </div>
            </div>
            <Typography variant={"body3"} className={`${styles.para} para`}>
              {street}
            </Typography>
            <Typography variant={"body3"} className={`${styles.para} para`}>
              {apartment}
            </Typography>
            <Stack
              className="timeslot"
              direction="row"
              spacing={1}
              sx={{ justifyContent: "flex-end" }}
            >
              {/* <Chip
                // key={index}
                label={time_slot?.split(":")[1]}
                sx={{
                  fontWeight: "500",
                  fontSize: "12px",
                  borderColor: AppColors.primaryGreen
                }}
                variant="outlined"
              /> */}
              {getSelectedAddressTimeSlots()?.length > 0
                ? getSelectedAddressTimeSlots().map((x) => (
                  <Chip
                    key={x}
                    label={x}
                    className={
                      x == time_slot?.split(":")[1] ? "selected" : ""
                    }
                    sx={{
                      fontWeight: "500",
                      fontSize: "12px",
                      borderColor:
                        x == time_slot?.split(":")[1]
                          ? AppColors.appOrange
                          : AppColors.primaryGreen,
                      backgroundColor:
                        x == time_slot?.split(":")[1]
                          ? AppColors.appOrange
                          : "transparent",
                      color:
                        x == time_slot?.split(":")[1]
                          ? `${AppColors.white} !important`
                          : AppColors.black
                    }}
                    variant="outlined"
                  />
                ))
                : null}
            </Stack>
            <DeliveryDays assignedDays={days} selectedDays={availableDays} />
          </div>
          {
            !isExecutive && (
              <div className={styles.addRemove}>
                <div className={styles.optionalIcon} onClick={onEdit}>
                  <EditIcon />
                </div>
                {/* <div className={styles.optionalIcon} onClick={onRemove}>
                  <RemoveIcon />
                </div> */}
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
