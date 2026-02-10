import React, { useEffect, useState } from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import get from "lodash/get"
import DialogTitle from "@mui/material/DialogTitle"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import { Typography } from "@mui/material"
import clsx from "clsx"
import Off50 from "../../../public/images/icons/off50.svg"
import styles from "./style.module.scss"
import moment from "moment"
import AppConstant from "../../helpers/AppConstants"
import { percentCalculation, userDiscountHandler } from "../../helpers/ShortMethods"
import { useDispatch, useSelector } from "react-redux"
import AppConstants from "../../helpers/AppConstants"
import { unwrapResult } from "@reduxjs/toolkit"
import { getUserDiscountbyOrderId } from "store/reducers/checkoutReducer"
import AppLogger from "@helpers/AppLogger"
import { isDiscountNegative, roundHalfDown } from "../../helpers/CommonFunc"
const OrderStatus = ({
  open,
  handleClose,
  handleClickOpen,
  orderData,
  notPaidType,
  isExecutive,
  priceHandler=()=>{}
}) => {
  const { userProfile } = useSelector((state) => state.profile)
  const orderDataId = get(orderData, "id", "")
  const duration = get(orderData, "history.meal_plan_require_weeks", "")
  const startDate = get(orderData, "history.meal_plan_start_date", "")
  const paymentDate = get(orderData, "paid_date", "")
  const EndDate = get(orderData, "history.meal_plan_end_date", "")
  const orderId = get(orderData, "history.order_id", "")
  const extraProteinPrice = get(orderData, "history.protein_price", 0)
  const orderNumber = get(orderData, "payment.receipt_no", "")
  const isSubscribed = get(orderData, "payment.is_subscribed", 0)
  const subscriptionAmount = get(orderData, "payment.subscription_amount", 0)
  const subscriptionValue = get(orderData, "payment.subscription_value", 0)
  const subscription_type = get(orderData, "payment.subscription_type", 0)
  // Commenting for bug fixation/ new change
  // const discountDetails = get(orderData, "payment.discount", null)
  // const totalPrice = get(orderData, "price", "")
  //bag fee work
  const totalPriceWithoutBagfee = get(orderData, "price", "")
  const total_bag_fees = get(orderData, "total_bag_fees", "");
  const totalPrice = totalPriceWithoutBagfee ? Number(totalPriceWithoutBagfee) + Number(total_bag_fees) : 0;
    
  // const paidPrice = get(orderData, "payment.price", "")
  const paymentStatus = get(orderData, "payment_status", "")
  const amountPaidFromWallet = get(orderData, "payment.wallet_amount", 0)
  const discountValue = get(orderData, "payment.discount_value", 0)
  // Commenting for bug fixation/ new change
  // const discountAmount = get(orderData, "payment.discount_amount", 0)
  const discountType = get(orderData, "payment.discount_type", "flat  ")

  const getSubscriptionDiscount = () => {
    var subDiscount = ""
    if (subscriptionDetails) {
      subDiscount = (
        (get(subscriptionDetails, "value", "") / 100) *
        totalPrice
      ).toFixed(2)
    }
    return subDiscount
  }
  // New logic for bug fixation/ new change amount

  const discountDetailsObjWRTstatus = (paymentStatus, keyName, defaultVal) => {
    if(paymentStatus == "unpaid" && notPaidType == 'full'){
      return get(orderData, keyName, null)
    }else{
      return get(orderData, `payment.[${keyName}]`, defaultVal)
    }
  }
  console.log("orderData",orderData)
  const discountDetails = discountDetailsObjWRTstatus(paymentStatus, "discount", null)
  // const discountAmount = discountDetailsObjWRTstatus(paymentStatus, "discount_amount", 0);
  const discountAmount = get(orderData, "payment.discount_amount", null)

  // Enhanced Function from props
  // const priceHandler = () => {
  //   if (notPaidType !== "top down") {
  //     if (paymentStatus == "paid") {
  //       return paidPrice
  //     } 
  //     else if (paymentStatus =="unpaid" && notPaidType == 'full' && discountedPrice) {
  //       return Math.round(discountedPrice)
  //     }
  //     else return totalPrice
  //   } else {
  //     return totalPrice
  //   }
  // }
    const [loaderTitle, setloaderTitle] = useState(false);
    const [coupenName, setcoupenName] = useState('');
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
    
    if(orderDataId ){
      // dispatch(getUserDiscountbyOrderId({ orderId : orderDataId }))
      getPromoCodeString(orderDataId)
    }

  },[discountDetails, orderDataId])

  const isWalletCredit = orderData?.payment?.discount_type == AppConstant.getDiscountRewardType.wallet_credit;
  const promoFromProfile = get(userProfile, "profile.promo_code", "") 
  const discountAmountToShow = isWalletCredit ? get(orderData, "payment.discount_value", "") :
  paymentStatus == AppConstant.unpaid && notPaidType == 'full' ? get(orderData, "discount_amount", "") : discountAmount;
  let discountTitleToShow = coupenName; // Default value

  if (paymentStatus === AppConstant.unpaid && notPaidType === 'full' && orderData?.discount) {
      const promoCode = get(orderData, "discount.promo_code", "");

      if (promoCode) {
          discountTitleToShow = promoCode;
      } else {
          discountTitleToShow = promoFromProfile;
      }
  }
  else{
    const discountFromOrderPayment = get(orderData, "payment.discount.promo_code", "");
    if( coupenName ) {
      discountTitleToShow = coupenName;
    }else if(discountFromOrderPayment){
      discountTitleToShow = discountFromOrderPayment;
    } else{
      discountTitleToShow = promoFromProfile;
    }
  }
  const isMyDiscountValueNegative = discountAmountToShow < 0; 

  return (
    <Dialog open={open} onClose={handleClose} className="orderStatus">
      <DialogContent className={styles.orderSummaryWrapper}>
        <div className={styles.orderWrapper}>
          {orderId && (
            <Typography variant="h2" sx={{ color: AppColors.primaryGreen }}>
              Order ID {orderId}
            </Typography>
          )}
          {orderNumber && (
            <Typography
              component={"p"}
              variant="body3"
              sx={{ color: AppColors.primaryGreen }}
              className={styles.orderNum}
            >
              Order number: #{orderNumber}
            </Typography>
          )}
          <Typography
            component={"p"}
            variant="body1"
            sx={{
              color: AppColors.primaryGreen,
              fontWeight: "500",
              paddingTop: "15px",
              paddingBottom: "15px"
            }}
            className={styles.subHead}
          >
            Meal Plan Details
          </Typography>
          <div className={clsx(styles.personalDetail, styles.sty2)}>
            <div className={styles.contentSec}>
              <Typography variant="body1" className={styles.paraBold}>
                Duration
              </Typography>
              {duration && (
                <Typography variant="body1">{`${duration} ${
                  duration > 1 ? "weeks" : "week"
                }`}</Typography>
              )}
            </div>
            <div className={styles.contentSec}>
              <Typography variant="body1" className={styles.paraBold}>
                Start Date
              </Typography>
              {startDate && (
                <Typography variant="body1">
                  {moment(startDate).format(AppConstant.dateFormat)}
                </Typography>
              )}
            </div>
            <div className={styles.contentSec}>
              <Typography variant="body1" className={styles.paraBold}>
                End Date
              </Typography>
              {EndDate && (
                <Typography variant="body1">
                  {moment(EndDate).format(AppConstant.dateFormat)}
                </Typography>
              )}
            </div>
          </div>
          <Typography
            variant="body1"
            sx={{
              color: AppColors.primaryGreen,
              fontWeight: "500",
              paddingBottom: "15px"
            }}
            className={styles.subHead}
          >
            Order Details
          </Typography>
          <div className={styles.summary_details}>
            <div className={styles.price_wrapper}>
              <div className={styles.details_wrapper}>
                {duration && (
                  <Typography
                    variant="body3"
                    color="initial"
                    fontWeight={500}
                    sx={{}}
                  >
                    {`1 x PractiCal${isExecutive ? " Executive" : ""} Meal Plan`} (
                    {`${duration} ${duration > 1 ? "weeks" : "week"}`})
                  </Typography>
                )}
                {totalPrice && (
                  <Typography
                    className={styles.paraSM}
                    variant="body3"
                    color="initial"
                  >
                    {
                    isMyDiscountValueNegative ? 
                    `AED ${amountPaidFromWallet && amountPaidFromWallet > 0
                      ? priceHandler() - amountPaidFromWallet
                      : priceHandler()}`:
                    `AED ${roundHalfDown(totalPrice)?.toFixed(2)}`
                    }
                  </Typography>
                )}
              </div>
            </div>

            {discountDetails && (
              <div className={styles.price_wrapper}>
                <div className={styles.details_wrapper}>
                  {/* {discountDetails?.promo_code && (
                    <Typography
                      variant="body3"
                      color="initial"
                      sx={{ color: AppColors.green }}
                    >
                      <Off50 /> {discountDetails.promo_code?.toUpperCase()}
                    </Typography>
                  )} */}
                  {
                    loaderTitle ? 
                    <Typography
                      className={styles.para}
                      sx={{
                        color: AppColors.green,
                        fontWeight: "500",
                        textAlign: "center",
                        textTransform: "Captialize"
                      }}
                    >
                      Loading coupon ...
                    </Typography>:
                  discountTitleToShow && !isMyDiscountValueNegative && (
                    <Typography
                      variant="body3"
                      color="initial"
                      sx={{ color: AppColors.green }}
                    >
                      <Off50 /> {discountTitleToShow?.toUpperCase()}
                    </Typography>
                  )}
                  {loaderTitle ? "" : discountAmountToShow != 0 && !isMyDiscountValueNegative&& (
                    <Typography
                      className={styles.paraSM}
                      variant="body3"
                      sx={{ color: AppColors.green }}
                      color="initial"
                    >{
                      isWalletCredit ? 
                      `AED ${discountAmountToShow}.00`
                    :
                    ` AED (-) ${Number(discountAmountToShow).toFixed(2)}`
                    }
                    </Typography>
                  )}
                </div>
                {extraProteinPrice && discountDetails ? (
                    <div className={styles.extra_protein_disclaimer}>
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
                {loaderTitle ? "" : isWalletCredit && discountAmountToShow != 0 ? (
                    <div className={styles.extra_protein_disclaimer}>
                      <Typography
                        sx={{ fontSize: "12px !important" }}
                        variant="body3"
                        fontWeight={500}
                        color={AppColors.primaryGreen}
                      >
                      {`Reward amount ${discountAmountToShow} AED will be credited to your wallet`}
                      </Typography>
                    </div>
                  ) : null}
              </div>
            )}
            {isSubscribed && subscriptionValue ? (
              <div className={styles.discount_wrapper}>
                <div className={styles.details_wrapper}>
                    <Typography
                      variant="body3"
                      sx={{ color: AppColors.green }}
                      fontWeight={600}
                    >
                      {
                        subscription_type == AppConstants.getDiscountRewardType.percent ?
                        `${subscriptionValue}% Subscription Discount` :
                        subscription_type == AppConstants.getDiscountRewardType.wallet_credit ? 
                        `AED ${subscriptionValue} Subscription Reward amount will be credited to your wallet`
                        :`AED ${subscriptionValue} Subscription Discount`
                      }
                    </Typography>

                  <Typography
                    variant="body3"
                    sx={{
                      color: AppColors.green,
                      fontWeight: "500 !important"
                    }}
                  >
                    AED (-){subscriptionAmount}
                  </Typography>
                </div>
              </div>
            ) : null}
            {amountPaidFromWallet && amountPaidFromWallet > 0 ? (
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
                    sx={{
                      color: AppColors.green,
                      fontWeight: "500 !important"
                    }}
                  >
                    AED (-){amountPaidFromWallet}.00
                  </Typography>
                </div>
              </div>
            ) : null}

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
                  {/* AED {`${priceHandler()}.00`} */}
                  AED{" "}
                  {`${
                    (Number(roundHalfDown(priceHandler() - (amountPaidFromWallet || 0))) || 0).toFixed(2)
                  }`}
                </Typography>
                {/* {paymentStatus == "paid" ? (
                  <Typography
                    variant="body1"
                    sx={{ color: AppColors.primaryGreen }}
                    fontWeight={600}
                  >
                    AED {paidPrice > 0 ? `${paidPrice}.00` : 0}
                  </Typography>
                ) : (
                  <Typography
                    variant="body1"
                    sx={{ color: AppColors.primaryGreen }}
                    fontWeight={600}
                  >
                    AED {totalPrice > 0 ? `${totalPrice}.00` : 0}
                  </Typography>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      <Button 
      // className="crossButton"
      className={`crossButton ${isExecutive ? 'isExecutive':'' }`}
       onClick={handleClose}>
        x
      </Button>
    </Dialog>
  )
}

export default OrderStatus
