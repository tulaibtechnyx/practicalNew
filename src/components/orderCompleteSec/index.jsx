import React, { useState, useEffect } from "react"
import styles from "./style.module.scss"
import { Typography, Link, Button } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import get from "lodash/get"
import AppColors from "helpers/AppColors"
import { useRouter } from "next/router"
import Off50 from "../../../public/images/icons/off50.svg"
import {
  userDiscountHandler,
  isStagingServer,
  handleShowWalletDiscount,
  handleSubtotalPrice,
  isProductionServer
} from "../../helpers/ShortMethods"
import Script from "next/script"
import AppConstants from "@helpers/AppConstants"
import { getDiscountDetailsV2, getDiscountDetailsV3, getDiscountDetailsV4, getPromoCodeDiscountValue, isDiscountNegative, isDiscountRewardTypeWallet, isNull, roundHalfDown } from "@helpers/CommonFunc";
import {getUserDiscountbyOrderId} from "../../store/reducers/checkoutReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import AppLogger from "@helpers/AppLogger"
const OrderCompleteSec = ({ paymentMethod = '', loaderSummery, clearCheckoutData, isExecutive }) => {
  const { paidSummary } = useSelector((state) => state.CheckOutReducer)
  const { ticker } = useSelector((state) => state.home)
  const { orderSummary } = useSelector((state) => state.CheckOutReducer)
  const [localSummary, setLocalSummary] = useState(null)
  const [tickerDataLocal, setTickerDataLocal] = useState(null)
  const [orderSummaryData, setOrderSummaryData] = useState(null)
  const [coupenName, setcoupenName] = useState('')
  const [loaderTitle, setloaderTitle] = useState(false)
 const promoCodeString =
    useSelector((state) => state.CheckOutReducer.promoCodeString)

  useEffect(() => {
    if (orderSummary) {
      setOrderSummaryData(orderSummary)
    }
  }, [orderSummary])

  useEffect(() => {
    if (paidSummary) {
      setLocalSummary(paidSummary)
    }
  }, [paidSummary])

  useEffect(() => {
    if (ticker) {
      setTickerDataLocal(ticker)
    }
  }, [ticker])

  const walletAmount = get(tickerDataLocal, "wallet", 0)

  const orderId = get(localSummary, "receipt_no", "")
  const orderIdFromSummary = get(localSummary, "order_id", null)
  const orderTotalPrice = get(localSummary, "price", "")
  const subscriptionStatus = get(localSummary, "is_subscribed", 0)
  const orderPriceWithoutBagFee = get(localSummary, "order.price", "")
  const ordertotal_bag_fees = get(localSummary, "order.total_bag_fees", "");
  const totalBagFee = ordertotal_bag_fees ? Number(ordertotal_bag_fees) : 0;
  const orderPrice = orderPriceWithoutBagFee + totalBagFee;
  const userId = get(localSummary, "order.user_id", "")
  const orderNotPaidType = get(localSummary, "order.not_paid_type", "")
  const order_history = get(
    localSummary,
    "order_history",
    ""
  )
  const weekCount = get(
    localSummary,
    "order_history.meal_plan_require_weeks",
    ""
  )
  const proteinDisclaimer = get(
    localSummary,
    "order_history.protein_disclaimer",
    ""
  )
  const addon_disclaimer = get(
    localSummary,
    "order_history.addon_disclaimer",
    ""
  )
  const extras_disclaimer = get(
    localSummary,
    "order_history.extras_disclaimer",
    ""
  )
  const extraProteinPrice = get(
    localSummary,
    "order_history.protein_price",
    0
  )
  const discount_amount = get(localSummary, "discount_amount", null);
  const discountDetails = get(localSummary, "discount", null);
  const coupenValue = get(localSummary, "discount.value", "")
  const meal_plan_require_weeks = order_history?.meal_plan_require_weeks ?? 0;
  // const discDetails = getDiscountDetailsV2({...localSummary?.discount}, typeof extraProteinPrice == 'number' ? orderPrice - extraProteinPrice : orderPrice, meal_plan_require_weeks) || null;
  // const discDetails = getDiscountDetailsV3({...localSummary?.discount},
  //    {mealPrice:localSummary?.meal_price,snackPrice:localSummary?.snack_price},
  //     meal_plan_require_weeks) || null;
  const discDetails = getDiscountDetailsV4({...localSummary?.discount},
     {mealPrice:localSummary?.meal_price,snackPrice:localSummary?.snack_price},
      meal_plan_require_weeks) || null;
  const PlanWalletCreditChecker = isDiscountRewardTypeWallet(localSummary?.discount, {mealPrice:localSummary?.meal_price,snackPrice:localSummary?.snack_price},Number(meal_plan_require_weeks));

      
  const discounted_price = roundHalfDown(Number(discDetails?.amountSave)).toFixed(2) || 0;
  const subDiscountValue = get(localSummary, "subscription_amount", "")
  const router = useRouter();

  // Discount tiers wala kaama krna hai, or saath mn discount code promo wala bhi
  // console.log("coupenValue", coupenValue)
  // console.log("disounctValueInNumbers", disounctValueInNumbers)
  // console.log("orderPrice", orderPrice)
  // console.log("extraProteinPrice", extraProteinPrice)
  // console.log("discountDetails", discountDetails)
  // console.log("discDetails", discDetails)

  const subDiscountValueRoundOff = Number(subDiscountValue).toFixed(2)
  const MealPlanText = `PractiCal Meal Plan (${weekCount} ${weekCount > 1 ? "weeks" : "week"})` || "PractiCal Meal Plan";
  const paymentMethodVar = paymentMethod ?? ''; //Replace with a dynamic variable (wallet/ direct / manual_renewals) 
  const dispatch = useDispatch();

  const getPromoCodeString = async (orderIdFromSummary) => {
    setloaderTitle(true)
    try {
      await dispatch(getUserDiscountbyOrderId({ orderId : orderIdFromSummary }))
      .then(unwrapResult)
      .then((res) => {
        setloaderTitle(false)
        // console.log("getUserDiscountbyOrderId", res)
        // AppLogger("Response at getUserDiscountbyOrderId", res)
        if (res?.data?.data?.[0]?.promo_code) {
          setcoupenName(res?.data?.data?.[0]?.promo_code)
        }else{
          setcoupenName('')
        }
      })
      .catch((err) => {
        setloaderTitle(false)
        AppLogger("Error at getUserDiscountbyOrderId", err)
      })
    } catch (error) {
      setloaderTitle(false)
      AppLogger("Error at getUserDiscountbyOrderId", error)
    }

  }
  useEffect(() => {
    
    if(orderIdFromSummary ){
      // dispatch(getUserDiscountbyOrderId({ orderId : orderIdFromSummary }))
      getPromoCodeString(orderIdFromSummary)
    }

  },[discountDetails, orderIdFromSummary])
  const isMyDiscountValueNegative = isDiscountNegative(localSummary?.discount, meal_plan_require_weeks);
  console.log("isMyDiscountValueNegative",isMyDiscountValueNegative)
  
  const totalAmountoShow = PlanWalletCreditChecker?.planWalletCredit ? walletAmount >  orderPrice ?  "AED 0.00" : `AED ${orderTotalPrice - walletAmount}` : `AED ${handleSubtotalPrice(orderTotalPrice, walletAmount)}`
  return (
    <section className="secSignUp">
      <div className={styles.userManagementWrapper}>
        {userId &&
          orderId &&
          orderTotalPrice &&
          weekCount &&
          loaderSummery &&
          (isProductionServer() || isStagingServer()) ? (
          <Script
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html:
                `
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                 'event': 'purchase',
                  'payment_method':${JSON.stringify(paymentMethodVar)},
                  'pageTitle': document.title,
                  'pageUrl': window.location.href,
                  'userId':  ${userId},
                  'transaction_id': ${orderId}, 
                  'value':${orderTotalPrice}, 
                  'currency': 'AED',
                  'items': [
                    {
                      'item_name': ${JSON.stringify(MealPlanText)},
                      'item_id': ${weekCount}, 
                      'quantity': 1, 
                      'price':  ${orderTotalPrice} 
                    }
                  ]
                })`
            }}
          ></Script>
        ) : null}
        <div className="container container--custom">
          <div className={styles.secWrapper}>
            <div className={styles.secHeading}>
              <Typography
                className={`${styles.pageTitle} ${isExecutive ? styles.isExecutive : ''}`}
                variant={"h1"}
                sx={{
                  color: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen,
                  textAlign: "center",
                  textTransform: "uppercase",
                  fontFamily: "AWConquerorInline"
                }}
              >
                ORDER <br /> CompletEd!
              </Typography>
              <Typography
                className={styles.description}
                variant={"body3"}
                component={"p"}
                // className={styles.secPara}
                sx={{
                  paddingTop: "10px",
                  color: AppColors.white,
                  fontWeight: "500",
                  textAlign: "center",
                  textTransform: "Captialize",
                  fontSize: "15px"
                }}
              >
                Thanks for placing your order. Look out for an email
                confirmation in your inbox (remember to check the junk folder
                just in case!).
              </Typography>
            </div>
            <div className={styles.secDetail}>
              <Typography
                variant={"body1"}
                className={styles.secPara}
                sx={{
                  color: AppColors.primaryGreen,
                  fontWeight: "500",
                  textAlign: "center",
                  textTransform: "Captialize"
                }}
              >
                Order Summary
              </Typography>
              <Typography
                className={styles.secPara2}
                variant={"body1"}
                sx={{
                  color: AppColors.black,
                  fontWeight: "300",
                  textAlign: "center",
                  textTransform: "uppercase"
                }}
              >
                Order number: #{orderId}
              </Typography>
              <div className={styles.innerWrapper}>
                <div className={styles.textDetail}>
                  <Typography
                    variant={"body1"}
                    className={styles.para}
                    sx={{
                      fontSize: "15px",
                      color: AppColors.black,
                      fontWeight: "500",
                      textAlign: "center",
                      textTransform: "Captialize"
                    }}
                  >
                    {`1 x PractiCal${isExecutive ? " Executive" : ""} Meal Plan`}
                    {orderNotPaidType !== "top up"
                      ? ` (${weekCount} ${weekCount > 1 ? "Weeks" : "Week"})`
                      : null}
                  </Typography>
                  {addon_disclaimer ? (
                    <div>
                      <Typography
                        sx={{ fontSize: "12px" }}
                        color={AppColors.primaryGreen}
                        fontWeight={500}
                      >
                        {addon_disclaimer ?? ""}
                      </Typography>
                    </div>
                  ) : null}
                  {extras_disclaimer ? (
                    <div>
                      <Typography
                        sx={{ fontSize: "12px" }}
                        color={AppColors.primaryGreen}
                        fontWeight={500}
                      >
                        {extras_disclaimer ?? ""}
                      </Typography>
                    </div>
                  ) : null}
                  {proteinDisclaimer ? (
                    <div>
                      <Typography
                        sx={{ fontSize: "12px" }}
                        color={AppColors.primaryGreen}
                        fontWeight={500}
                      >
                        {proteinDisclaimer ?? ""}
                      </Typography>
                    </div>
                  ) : null}
                </div>
                <div className={styles.amount}>
                  <Typography
                    className={styles.para}
                    variant={"body1"}
                    sx={{
                      color: AppColors.black,
                      fontWeight: "500",
                      textAlign: "center",
                      textTransform: "Captialize"
                    }}
                  >
                    {
                      isMyDiscountValueNegative ?
                      `${totalAmountoShow}` :
                      // `AED ${orderPrice}.00` 
                        `AED ${Number(roundHalfDown(orderPrice)).toFixed(2)}`

                    }
                  </Typography>
                </div>
              </div>
              <div className={styles.innerWrapper}>
                <div className={styles.textDetail}>
                  {
                  loaderTitle ? 
                    <Typography
                      className={styles.para}
                      variant={"body1"}
                      sx={{
                        color: AppColors.green,
                        fontWeight: "500",
                        textAlign: "center",
                        textTransform: "Captialize"
                      }}
                    >
                      Loading coupon ...
                    </Typography>:
                  coupenName && !isMyDiscountValueNegative && (
                    <Typography
                      className={styles.para}
                      variant={"body1"}
                      sx={{
                        color: AppColors.green,
                        fontWeight: "500",
                        textAlign: "center",
                        textTransform: "Captialize"
                      }}
                    >
                      <Off50 /> {coupenName.toUpperCase()}
                    </Typography>
                  )}
                  {extraProteinPrice && coupenValue && orderPrice ? (
                    <div className={styles.extraProteinPrice}>
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
                  {PlanWalletCreditChecker?.planWalletCredit && PlanWalletCreditChecker?.rewardValue != 0 && !isMyDiscountValueNegative  ? (
                    <div className={styles.extraProteinPrice}>
                      <Typography
                        sx={{ fontSize: "12px !important" }}
                        variant="body3"
                        fontWeight={500}
                        color={AppColors.primaryGreen}
                      >
                    {`Reward amount ${PlanWalletCreditChecker?.rewardValue} AED will be credited to your wallet`}
                    </Typography>
                    </div>
                  ) : null}
                </div>
                <div className={styles.amount}>
                  {/* {coupenValue && orderPrice && ( */}
                  {
                  loaderTitle ? 
                  "" :
                  PlanWalletCreditChecker?.planWalletCredit  && PlanWalletCreditChecker?.rewardValue != 0 && !isMyDiscountValueNegative ? 
                    <Typography
                      className={styles.para}
                      variant={"body1"}
                      sx={{
                        color: AppColors.green,
                        fontWeight: "500",
                        textAlign: "center",
                        textTransform: "Captialize"
                      }}
                    >
                      {/* AED (-){userDiscountHandler(orderPrice - extraProteinPrice, discountDetails)} */}
                      AED {PlanWalletCreditChecker?.rewardValue}
                    </Typography>:
                 coupenName && !isNull(discount_amount) && discount_amount != 0 && orderPrice && !isMyDiscountValueNegative &&
                  (
                    <Typography
                      className={styles.para}
                      variant={"body1"}
                      sx={{
                        color: AppColors.green,
                        fontWeight: "500",
                        textAlign: "center",
                        textTransform: "Captialize"
                      }}
                    >
                      {/* AED (-){userDiscountHandler(orderPrice - extraProteinPrice, discountDetails)} */}
                      AED (-){discount_amount}
                    </Typography>
                  )}
                </div>
              </div>
              {subscriptionStatus == 1 &&
                orderNotPaidType !== "top up" &&
                subDiscountValue ? (
                <div className={styles.innerWrapper}>
                  <div className={styles.textDetail}>
                    <Typography
                      className={styles.para}
                      variant={"body1"}
                      sx={{
                        color: AppColors.green,
                        fontWeight: "500",
                        textAlign: "center",
                        textTransform: "Captialize"
                      }}
                    >
                      5% Subcription Discount
                    </Typography>
                  </div>
                  {subDiscountValue && (
                    <div className={styles.amount}>
                      <Typography
                        className={styles.para}
                        variant={"body1"}
                        sx={{
                          color: AppColors.green,
                          fontWeight: "500",
                          textAlign: "center",
                          textTransform: "Captialize"
                        }}
                      >
                        AED (-){subDiscountValueRoundOff}
                      </Typography>
                    </div>
                  )}
                </div>
              ) : null}
              {!orderSummaryData?.wallet ? null : (walletAmount &&
                walletAmount < orderTotalPrice) ||
                walletAmount >= orderTotalPrice ? (
                <div className={styles.innerWrapper}>
                  <div className={styles.textDetail}>
                    <Typography
                      className={styles.para}
                      variant={"body1"}
                      sx={{
                        color: AppColors.green,
                        fontWeight: "500",
                        textAlign: "center",
                        textTransform: "Captialize"
                      }}
                    >
                      From your available balance (Wallet)
                    </Typography>
                  </div>

                  <div className={styles.amount}>
                    <Typography
                      className={styles.para}
                      variant={"body1"}
                      sx={{
                        color: AppColors.green,
                        fontWeight: "500",
                        textAlign: "center",
                        textTransform: "Captialize"
                      }}
                    >
                      {`AED (-) ${handleShowWalletDiscount(orderTotalPrice, walletAmount)}.00`}
                    </Typography>
                  </div>
                </div>
              ) : null}
              <div className={styles.totalWrapper}>
                <div className={styles.textDetail}>
                  <Typography
                    className={styles.para}
                    variant={"body1"}
                    sx={{
                      color: AppColors.primaryGreen,
                      fontWeight: "500",
                      textAlign: "center",
                      textTransform: "Captialize"
                    }}
                  >
                    Total
                  </Typography>
                </div>
                <div className={styles.amount}>
                  <Typography
                    variant={"body1"}
                    sx={{
                      fontSize: "15px",
                      color: AppColors.primaryGreen,
                      fontWeight: "500",
                      textAlign: "center",
                      textTransform: "Captialize"
                    }}
                  >
                    {/* AED {orderTotalPrice > 0 ? `${orderTotalPrice}.00` : 0} */}
                    {totalAmountoShow}
                  </Typography>
                </div>
              </div>
              <div className={styles.cta}>
                <Button
                  className={isExecutive ? styles.isExecutive : ''}
                  onClick={() => router.push("dashboard")}
                  variant="contained"
                >
                  Back To My Personal Portal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section >
  )
}

export default OrderCompleteSec
