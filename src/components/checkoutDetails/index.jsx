import { Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import styles from "./style.module.scss"
import PriceBox from "../../components/priceBox"
import AppColors from "helpers/AppColors"
import Off50 from "../../../public/images/icons/off50.svg"
import clsx from "clsx"
import { useDispatch, useSelector } from "react-redux"
import AppLogger from "../../helpers/AppLogger"
import AppRoutes from "../../helpers/AppRoutes"
import get from "lodash/get"
import {
  checkOutRequest,
  clearCheckOutSummary
} from "../../store/reducers/checkoutReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import { showFaliureToast, showSuccessToast } from "../../helpers/AppToast"
import { useRouter } from "next/router"
import { performAddPromoCode } from "../../store/actions/promoCodeAction"
import { handleShowWalletDiscount, handleSubtotalPrice, percentCalculation } from "../../helpers/ShortMethods"

const CheckoutDetails = ({ dataRec , isExecutive }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { checkoutSummary, orderLocalSummary } = useSelector(
    (state) => state.CheckOutReducer
  )
  const { userProfile } = useSelector((state) => state.profile)
  const { userDetails } = useSelector((state) => state.auth)
  const { ticker } = useSelector((state) => state.home)

  const [summaryLocal, setSummaryLocal] = useState(null)
  const [userProfileLocal, setUserProfileLocal] = useState(null)
  const [userLocalData, setUserLocalData] = useState(null)
  const [authObjLocal, setAuthObjLocal] = useState(null)
  const [tickerDataLocal, setTickerDataLocal] = useState(null)
  const [loading, setLoading] = useState(false)

  const userFirstName = get(userProfileLocal, "first_name", "")
  const userLastName = get(userProfileLocal, "sur_name", "")
  const userEmail = get(userProfileLocal, "email", "")
  const userPhone = get(userProfileLocal, "phone", "")
  const userId = get(summaryLocal, "history.user_id", "")
  const order_id = get(summaryLocal, "history.order_id", "")
  const proteinDisclaimer = get(summaryLocal, "history.protein_disclaimer", "")

  const totalWeeks = get(summaryLocal, "history.meal_plan_require_weeks", "")
  // const discount = get(summaryLocal, "", "")
  const cardUser = get(summaryLocal, "card_detail.name", "")
  const cardNumber = get(summaryLocal, "card_detail.card_number", "")
  const userAddress = get(summaryLocal, "address_detail.address_line_one", "")
  const addressLabel = get(summaryLocal, "address_detail.label", "")
  const specialInstruction = get(summaryLocal, "orderData.instructions", "")
  const totalPrice = get(summaryLocal, "orderData.price", "")
  const subTotal = get(summaryLocal, "orderData.subTotal", "")
  const extraProteinPrice = get(summaryLocal, "orderData.extra_protein_price", 0)
  const street = get(summaryLocal, "address_detail.street", "")
  const apartment = get(summaryLocal, "address_detail.apartment", "")

  const paymentNotPaidType = get(summaryLocal, "not_paid_type", "")

  const subscriptionStatus = get(
    userLocalData,
    "checkoutBody.is_subscribed",
    ""
  )
  const deliveryTimeSlot = get(userLocalData, "checkoutBody.time_slot", "")
  const checkoutBody = get(userLocalData, "checkoutBody", null)
  const subscriptionDiscount = get(userLocalData, "subscriptionDiscount", null)

  const userDiscount = get(summaryLocal, "orderData.promoSummary", null)
  const not_paid_type = get(summaryLocal, "not_paid_type", "")
  const paymentType = get(summaryLocal, "not_paid_type", "")

  const accessToken = get(authObjLocal, "data.auth_token", "")
  const disclaimer = get(
    userLocalData,
    "orderSummary.order_history.disclaimer",
    ""
  )
  const selectedAddressId = get(userLocalData, "checkoutBody.address_id", null);

  const walletAmount = get(tickerDataLocal, "wallet", 0)

  useEffect(() => {
    if (checkoutSummary) {
      setSummaryLocal(checkoutSummary)
    }
  }, [checkoutSummary, orderLocalSummary])

  useEffect(() => {
    if (ticker) {
      setTickerDataLocal(ticker)
    }
  }, [ticker])

  useEffect(() => {
    if (userDetails) {
      setAuthObjLocal(userDetails)
    }
  }, [userDetails])
  useEffect(() => {
    if (orderLocalSummary) {
      setUserLocalData(orderLocalSummary)
    }
  }, [orderLocalSummary])

  useEffect(() => {
    if (userProfile) {
      setUserProfileLocal(userProfile)
    }
  }, [userProfile])
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

  const getSelectedAddress = () => {
    if(!selectedAddressId) return null;
  
    const allAddresses = get(userLocalData, 'orderSummary.addresses', []);

    return (allAddresses.find((address) => address.id == selectedAddressId))
  }

  const selectedAddress = getSelectedAddress();

  const handleClearCheckOutFields = () => {
    try {
      dispatch(clearCheckOutSummary())
        .then(unwrapResult)
        .then((res) => {
          AppLogger(
            "This is response at handleClearCheckOutFields==========",
            res
          )
        })
        .catch((err) => {
          AppLogger("This is error at handleClearCheckOutFields=========", err)
        })
    } catch (err) {
      AppLogger("This is error at handleClearCheckOutFields=========", err)
    }
  }
  const handlePlaceMyOrderRequest = () => {
    try {
      if (checkoutBody) {
        setLoading(true)
        let newCheckoutBody = {
          ...checkoutBody,
          price: checkoutBody.price > 0 ? checkoutBody.price : 0,
          discount_id:
            not_paid_type == "top up" ? null : checkoutBody.discount_id
        }
        dispatch(
          checkOutRequest({
            accessToken,
            newCheckoutBody,
            totalWeeks,
            order_id: checkoutSummary?.history?.order_id
          })
        )
          .then(unwrapResult)
          .then((res) => {
            setLoading(false)
            AppLogger("this is rseposne of checkoutrequest========", res)
            // remove redux promo code after payment
            dispatch(performAddPromoCode(""))
            // showSuccessToast("Order Created Successfully")
            router.push(AppRoutes.orderComplete)
          })
          .catch((err) => {
            setLoading(false)
            AppLogger("this is  error at checkout request==========", err)
            showFaliureToast(err?.message)
          })
      }
    } catch (err) {
      AppLogger("this is err at  handlePlaceMyOrderRequest======", err)
    }
  }

  const handlePrice = () => {
    if (totalPrice > 0) {
      return Number(totalPrice)
    } else {
      return 0
    }
  }

  const TotalNewPrice = Number(totalPrice)

  return (
    <div className={`${styles.checkOutWrapper} ${isExecutive ? styles.isExecutive : ''}`}>
      {/* {userId && order_id && subTotal && totalWeeks ? (
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer.push({

              'event': 'order_complete',
          
              'pageTitle': document.title,
          
              'pageUrl': window.location.href,
          
              'userId': ${userId},
          
              'orderNumber': ${order_id},
          
              'quantity': 1, 
          
              'mealName': 'PractiCal Meal Plan (${totalWeeks} ${
              totalWeeks > 1 ? "weeks" : "week"
            })',
          
              'totalAmount': ${subTotal}, 
          
            })`
          }}
        ></Script>
      ) : null} */}
      <div className="container container--custom">
        <Typography
          className={styles.MainHeading}
          variant="h2"
          sx={{
            fontWeight: "600",
            color: AppColors.primaryGreen,
            paddingBottom: "22px"
          }}
        >
          Confirm Payment
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: AppColors.primaryGreen,
            fontWeight: "500",
            paddingBottom: "13px"
          }}
        >
          Personal Details
        </Typography>
        <div className={styles.secWrapper}>
          <div className={styles.Details}>
            <div className={clsx(styles.personalDetail, styles.sty3)}>
              <div className={styles.contentSec}>
                <Typography variant="body1" className={styles.paraBold}>
                  Name
                </Typography>
                <Typography variant="body1">{`${userFirstName} ${userLastName}`}</Typography>
              </div>
              <div className={styles.contentSec}>
                <Typography variant="body1" className={styles.paraBold}>
                  Email
                </Typography>
                {userEmail && (
                  <Typography variant="body1" className={styles.email}>
                    {userEmail}
                  </Typography>
                )}
              </div>
              <div className={styles.contentSec}>
                <Typography variant="body1" className={styles.paraBold}>
                  Phone number
                </Typography>
                {userPhone && (
                  <Typography variant="body1">{userPhone}</Typography>
                )}
              </div>
            </div>
            <Typography
              variant="body1"
              sx={{
                color: AppColors.primaryGreen,
                fontWeight: "500",
                paddingBottom: "13px"
              }}
            >
              Order Details
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
                      {paymentNotPaidType !== "top up"
                        ? ` (${totalWeeks} ${
                            totalWeeks > 1 ? "weeks" : "week"
                          })`
                        : null}
                    </Typography>
                  )}
                  <Typography
                    className={styles.paraSM}
                    variant="body3"
                    color="initial"
                  >
                    {`AED ${subTotal}.00`}
                  </Typography>
                </div>
                {disclaimer ? (
                  <div>
                    <Typography
                      sx={{ fontSize: "12px" }}
                      color={AppColors.primaryGreen}
                      fontWeight={500}
                    >
                      {disclaimer ?? ""}
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
              {userDiscount && (
                <div className={styles.price_wrapper}>
                  <div className={styles.details_wrapper}>
                    {userDiscount?.title && paymentType !== "top up" && (
                      <Typography
                        variant="body3"
                        color="initial"
                        sx={{
                          color: AppColors.green,
                          textTransform: "uppercase"
                        }}
                      >
                        <Off50 /> {userDiscount?.promo_code}
                      </Typography>
                    )}
                    {userDiscount?.value &&
                      subTotal &&
                      paymentType !== "top up" && (
                        <Typography
                          className={styles.paraSM}
                          variant="body3"
                          sx={{ color: AppColors.green }}
                          color="initial"
                        >
                          AED (-)
                          {userDiscount?.type !== "flat"
                            ? percentCalculation(subTotal - extraProteinPrice, userDiscount.value)
                            : userDiscount.value}
                        </Typography>
                      )}
                  </div>
                  {extraProteinPrice && userDiscount ? (
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
              {subscriptionStatus && !userDiscount && (
                <div className={styles.discount_wrapper}>
                  <div className={styles.details_wrapper}>
                    {subscriptionDiscount && subscriptionDiscount.value && (
                      <Typography
                        variant="body3"
                        sx={{ color: AppColors.green }}
                        fontWeight={600}
                      >
                        {subscriptionDiscount.value}% Subcription Discount
                      </Typography>
                    )}

                    {getSubscriptionDiscount() && (
                      <Typography
                        variant="body3"
                        sx={{
                          color: AppColors.green,
                          fontWeight: "500 !important"
                        }}
                      >
                        {`AED (-)${getSubscriptionDiscount()}`}
                      </Typography>
                    )}
                  </div>
                </div>
              )}

              {walletAmount &&
              (walletAmount < totalPrice || walletAmount >= totalPrice) ? (
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
                      {`AED (-) ${handleShowWalletDiscount(handlePrice(), walletAmount)}.00`}
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
                    {`AED ${handleSubtotalPrice(handlePrice(), walletAmount)}`}
                    {/* AED {totalPrice > 0 ? `${totalPrice}.00` : 0} */}
                  </Typography>
                </div>
              </div>
            </div>
            <Typography
              variant="body1"
              sx={{
                color: AppColors.primaryGreen,
                fontWeight: "500",
                paddingBottom: "13px"
              }}
            >
              Payment Details
            </Typography>
            <div className={clsx(styles.personalDetail, styles.sty3)}>
              {paymentNotPaidType !== "top up" && (
                <div className={styles.contentSec}>
                  <Typography variant="body1" className={styles.paraBold}>
                    Payment Method
                  </Typography>
                  <Typography variant="body1">{`${
                    subscriptionStatus
                      ? "Subscribe and Save"
                      : "One Time Payment"
                  }`}</Typography>
                </div>
              )}
              <div className={styles.contentSec}>
                <Typography variant="body1" className={styles.paraBold}>
                  Card details
                </Typography>
                <div className={styles.numberWrapper}>
                  <Typography variant="body1">{`${cardUser}`}</Typography>
                  {cardNumber && (
                    <Typography variant="body1">{`${cardNumber.slice(
                      9,
                      cardNumber.length
                    )}`}</Typography>
                  )}
                </div>
              </div>
            </div>
            <Typography
              variant="body1"
              sx={{
                color: AppColors.primaryGreen,
                fontWeight: "500",
                paddingBottom: "13px"
              }}
            >
              Delivery Details
            </Typography>
            <div className={clsx(styles.personalDetail, styles.sty2)}>
              <div className={styles.contentSec}>
                <Typography variant="body1" className={styles.paraBold}>
                  Address
                </Typography>
                {
                  selectedAddress && (
                    <>
                      <Typography variant="body1">{`${get(selectedAddress, "emirate.name", "")}, ${get(selectedAddress, "area.name", "")}`}</Typography>
                      <Typography variant="body1">{get(selectedAddress, "street", "")}</Typography>
                      <Typography variant="body1">{get(selectedAddress, "apartment", "")}</Typography>
                    </>
                  )
                }
              </div>
              <div className={styles.contentSec}>
                <Typography variant="body1" className={styles.paraBold}>
                  Delivery Time Slot
                </Typography>
                {deliveryTimeSlot && (
                  <Typography variant="body1">{`${
                    deliveryTimeSlot.split(":")[0]
                  }: ${deliveryTimeSlot.split(":")[1]}`}</Typography>
                )}
              </div>
              <div className={styles.contentSec}>
                <Typography variant="body1" className={styles.paraBold}>
                  Special Instructions
                </Typography>
                {specialInstruction && (
                  <Typography variant="body1">{specialInstruction}</Typography>
                )}
              </div>
            </div>
          </div>
          <div className={styles.Price}>
            <div className="checkoutDetail">
              <PriceBox
                userDiscount={userDiscount}
                subscriptionDiscount={subscriptionDiscount}
                checkoutDetails={true}
                checkOut={false}
                dataRec={dataRec}
                loading={loading}
                secStyle={false}
                price={handlePrice()}
                placeOrderRequest={handlePlaceMyOrderRequest}
                // clicked={handleCheckOutRequest}
                // price={getTotalPayable()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutDetails
