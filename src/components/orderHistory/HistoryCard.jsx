import React, { useState, useEffect } from "react"
import styles from "./style.module.scss"
import get from "lodash/get"
import { Link, Typography } from "@mui/material"
import moment from "moment"
// import clsx from "clsx"
import AppColors from "helpers/AppColors"
import AppConstants from "helpers/AppConstants"
import { useRouter } from "next/router"
import OrderStatus from "../../components/popUp/orderStatus"
import { useDispatch, useSelector } from "react-redux"
import AppLogger from "helpers/AppLogger"
import AppRoutes from "helpers/AppRoutes"
import ConfirmationModal2 from "../popUp/confirmationModal2"
import { addToWalletRequest, updatePriceRequest } from "../../store/reducers/dashboardReducer"
import {
  GetTickersRequest,
  GetOrderHistory,
  UpcomingOrdersRequest
} from "../../store/reducers/dashboardReducer"
import { ProfileRequest } from "../../store/reducers/profileReducer"
import { showSuccessToast } from "../../helpers/AppToast"
import { unwrapResult } from "@reduxjs/toolkit"
import { showFaliureToast } from "../../helpers/AppToast"
import { roundHalfDown } from "@helpers/CommonFunc"

export default function HistoryCard({
  historyData,
  isSubscribed,
  handleTabChange,
  thresholdDate,
  deliveryDays
}) {
  const { userDetails, isExecutive } = useSelector((state) => state.auth)
  const { ticker } = useSelector((state) => state.home)

  const router = useRouter()
  const dispatch = useDispatch()

  const [status, setStatus] = useState("")
  const [totalCalories, setTotalCalories] = useState(0)
  const [tickerData, setTickerData] = useState(null)
  const [loading, setLoading] = useState(false)

  const date = get(historyData, "history.meal_plan_start_date", new Date())
  const affectedDate = get(historyData, "affected_date", "")
  const currentDate = get(historyData, "updated_at", "")
  const mealCount = get(historyData, "history.meals_deliver_per_day", "")
  const snackCount = get(historyData, "history.snacks_deliver_per_day", "")
  const paymentDate = get(historyData, "payment_date", "")
  const orderCreationDate = get(historyData, "created_at", "")
  const paidDate = get(historyData, "paid_date", "")
  const ordersArray = get(historyData, "history.meal_plan", [])
  const snacksArray = get(historyData, "history.snack_plan", [])
  const totalWeek = get(historyData, "history.meal_plan_require_weeks", "")

  const endDate = get(historyData, "history.meal_plan_end_date", "")
  const paymentStatus = get(historyData, "payment_status", "")
  const notPaidType = get(historyData, "not_paid_type", "")
  const totalPriceWithoutBagfee = get(historyData, "price", "")
  const total_bag_fees = get(historyData, "total_bag_fees", "");
  const totalPrice = totalPriceWithoutBagfee ? Number(totalPriceWithoutBagfee) + Number(total_bag_fees) : 0;
  
  const paidPrice = get(historyData, "payment.price", "")
  const orderId = get(historyData, "id", "")

  const isActive = get(historyData, "is_active", "")
  const isRenewed = get(historyData, "history.is_renewed", "")
  const isPlanEnd = get(historyData, "is_plan_end", "")
  const disclaimer = get(historyData, "history.disclaimer")
  const proteinDisclaimer = get(historyData, "history.protein_disclaimer", '')
  const addon_disclaimer = get(historyData, "history.addon_disclaimer", '')
  const extras_disclaimer = get(historyData, "history.extras_disclaimer", '')

  const paymentDisclaimer = get(historyData, "history.payment_disclaimer")
  const subscriptionStatus = get(historyData, "history.is_subscribed")
  const walletAmount = get(historyData, "payment.wallet_amount")

  const token = get(userDetails, "data.auth_token", null)

  const discountedPrice = get(historyData, "discounted_price", 0)

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

  const extendThresholdDate = (thresHoldDate) => {
    try {
      let thresHoldDateLocal = moment(thresHoldDate)
      while (
        !alterFoodDays(deliveryDays).includes(thresHoldDateLocal.format("ddd"))
      ) {
        thresHoldDateLocal.add(1, "day")
      }
      return thresHoldDateLocal.toDate()
    } catch (error) {
      AppLogger("Error at extendThresholdDate", error)
      return new Date()
    }
  }

  const getTickersData = () => {
    dispatch(GetTickersRequest({ token }))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at getTickersData", res)
      })
      .catch((err) => {
        AppLogger("Error at getTickersData", err)
      })
  }

  const getOrderHistoryRequestHandler = () => {
    dispatch(GetOrderHistory({ token }))
      .then(unwrapResult)
      .then((res) => {
        // console.log("this is res========", res)
      })
      .catch((err) => {
        // console.log("this is err=======", err)
      })
  }

  const callUpcomingOrdersHandler = () => {
    try {
      dispatch(UpcomingOrdersRequest({ token }))
    } catch (error) {
      AppLogger("Error at callUpcomingOrdersHandler", error)
    }
  }

  const getUserProfileHandler = () => {
    try {
      dispatch(ProfileRequest({ token }))
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

  const handleAddToWallet = () => {
    try {
      setLoading(true)
      dispatch(addToWalletRequest({ token }))
        .then(unwrapResult)
        .then((response) => {
          showSuccessToast(response?.data?.message)
          getTickersData()
          getOrderHistoryRequestHandler()
          getUserProfileHandler()
          callUpcomingOrdersHandler()
          setOpenWallet(false)
          setLoading(false)
          AppLogger("Response at handleAddToWallet", response)
        })
        .catch((err) => {
          showFaliureToast(err?.message)
          setLoading(false)
          setOpenWallet(false)
          AppLogger("Error at handleAddToWallet api", err)
        })
    } catch (error) {
      setOpenWallet(false)
      setLoading(false)
      AppLogger("Error at handleAddToWallet", error)
    }
  }

  useEffect(() => {
    if (ticker) {
      setTickerData(ticker)
    }
  }, [ticker])

  useEffect(() => {
    totalCaloriesCount()
  }, [historyData])

  const statusHandler = () => {
    if (paymentStatus == "unpaid") {
      return "Un Paid"
    }
  }
  const totalCaloriesCount = () => {
    var total = 0
    for (let index = 0; index < snacksArray.length; index++) {
      const snack = snacksArray[index]
      total = total + snack
    }
    for (let i = 0; i < ordersArray.length; i++) {
      const order = ordersArray[i]

      total = total + order
    }

    setTotalCalories(total)
    AppLogger("this is total count=====", total)
  }
  const [open, setOpen] = useState(false)
  const [openWallet, setOpenWallet] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const orderStatusHandler = () => {
    if (isActive == 1) {
      if (notPaidType == "top up") {
        return "Top Up"
      } else if (notPaidType == "top down") {
        return "Plan Reduction"
      } else if (notPaidType == "full" && paymentStatus == "unpaid") {
        return "Pending"
      } else if (subscriptionStatus == 1 && paymentStatus == "paid") {
        return "Subscribed"
      } else {
        return "Active"
      }
    }

    if (isRenewed == 1) {
      if (isRenewed == 1 && !subscriptionStatus == 1) {
        return "Renewed"
      } else if (
        isRenewed == 1 &&
        subscriptionStatus == 1 &&
        paymentStatus == "paid"
      ) {
        return "Auto Subscribed"
      } else if (
        isRenewed == 1 &&
        subscriptionStatus == 1 &&
        paymentStatus == "unpaid"
      ) {
        return "Pending"
      }
    }

    if (isPlanEnd == 1) {
      return "Finished"
    }
    if (notPaidType == "top up") {
      return "Top Up"
    }
    if (notPaidType == "top down") {
      return "Plan Reduction"
    }
  }
  // Commneting this and adding new logic

  // const priceHandler = () => {
  //   if (notPaidType !== "top down") {
  //     if (paymentStatus == "paid") {
  //       return paidPrice
  //     } else return totalPrice
  //   } else {
  //     return totalPrice
  //   }
  // }

  const priceHandler = () => {
    if (notPaidType !== "top down") {
      if (paymentStatus == "paid") {
        return paidPrice
      } 
      else if (paymentStatus =="unpaid" && notPaidType == 'full' && discountedPrice) {
        // return Math.round(discountedPrice)
        return roundHalfDown(discountedPrice + (total_bag_fees || 0))
      }
      else return roundHalfDown(totalPrice)
    } else {
      return roundHalfDown(totalPrice)?.toFixed(2)
    }
  }

  const topUpDurationDateHandler = () => {
    if (notPaidType == "top up" || notPaidType == "top down") {
      if (paymentStatus == "paid") {
        if (affectedDate) {
          return moment(affectedDate).format(AppConstants.dateFormat)
        } else {
          return moment(date).format(AppConstants.dateFormat)
        }
      } else if (paymentStatus == "unpaid") {
        if (thresholdDate) {
          if (thresholdDate > moment(date)) {
            return moment(extendThresholdDate(thresholdDate)).format(
              AppConstants.dateFormat
            )
          } else {
            return moment(date).format(AppConstants.dateFormat)
          }
        } else {
          return moment(date).format(AppConstants.dateFormat)
        }
      }
    } else {
      return moment(date).format(AppConstants.dateFormat)
    }
  }

  const updatePrice = (order_id) => {
    try {
      if (token && order_id) {
        dispatch(updatePriceRequest({ token, order_id }))
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
  // const isExecutive = AppConstants.isExecutive
  return (
    <>
      <div className={`${styles.order_history} ${isExecutive ? styles.Executive : ""}`}>
        <ConfirmationModal2
          onConfirmPress={handleAddToWallet}
          tabChange={handleTabChange}
          open={openWallet}
          handleClose={() => setOpenWallet(false)}
          cancelText={"No"}
          confirmText={"Yes"}
          totalPrice={totalPrice}
          modalBody={"will be credited to your Wallet."}
          modalTitle={"Confirm Add to Wallet"}
          disclaimer={
            "For more information on using the credit in your Wallet, please click "
          }
        />
        <div className={styles.date_meal_plan_wrap}>
          <div className={styles.orderID}>
            <Typography
              sx={{ fontWeight: "500" }}
              variant="body3"
              color="#787F82"
              className={styles.mob_only}
            >
              Order ID
            </Typography>

            <a
              className={styles.anchorArea}
              color={AppColors.black}
              onClick={handleClickOpen}
            >
              <Typography
                sx={{ fontWeight: "500" }}
                variant="body2"
                color="initial"
                className={styles.ext_mar}
              >
                {orderId}
              </Typography>
            </a>
          </div>
          <div className={styles.date}>
            <Typography
              sx={{ fontWeight: "500" }}
              variant="body3"
              color="#787F82"
              className={styles.mob_only}
            >
              Date
            </Typography>
            {paymentStatus == "unpaid"
              ? orderCreationDate && (
                <Typography
                  sx={{ fontWeight: "500" }}
                  variant="body2"
                  color="initial"
                  className={styles.ext_mar}
                >
                  {moment(orderCreationDate).format(AppConstants.dateFormat)}
                </Typography>
              )
              : paidDate && (
                <Typography
                  sx={{ fontWeight: "500" }}
                  variant="body2"
                  color="initial"
                  className={styles.ext_mar}
                >
                  {moment(paidDate).format(AppConstants.dateFormat)}
                </Typography>
              )}
            {/* {currentDate && (
              <Typography
                sx={{ fontWeight: "500" }}
                variant="body2"
                color="initial"
                className={styles.ext_mar}
              >
                {moment(currentDate).format(AppConstants.dateFormat)}
              </Typography>
            )} */}
          </div>
          <div className={styles.meal_plan}>
            <Typography
              sx={{ fontWeight: "500" }}
              variant="body3"
              color="#787F82"
              className={styles.mob_only}
            >
              Meal Plan
            </Typography>
            <Typography
              sx={{ fontWeight: "500" }}
              variant="body2"
              color="initial"
              className={styles.ext_mar}
            >
              {`${mealCount} Meals ${snackCount} Snacks | ${totalCalories} Calories`}
            </Typography>
          </div>
        </div>
        <div className={styles.duration_sec}>
          <div className={styles.durationCheck}>
            <Typography
              sx={{ fontWeight: "500" }}
              variant="body3"
              color="#787F82"
              className={styles.mob_only}
            >
              Duration
            </Typography>
            {disclaimer ? null : (
              <Typography
                sx={{ fontWeight: "500" }}
                variant="body2"
                color="initial"
                className={styles.ext_mar}
              >
                {`${totalWeek} ${totalWeek > 1 ? "Weeks" : "Week"}`}
              </Typography>
            )}

            <Typography
              sx={{ fontWeight: "500" }}
              variant="body2"
              color="initial"
              className={styles.ext_mar}
            >
              {`${date ? topUpDurationDateHandler() : ""} - ${endDate ? moment(endDate).format(AppConstants.dateFormat) : ""
                }`}
            </Typography>
          </div>
          <div className={styles.PaymentStatus}>
            <Typography
              sx={{ fontWeight: "500" }}
              variant="body3"
              color="#787F82"
              className={styles.mob_only}
            >
              Payment
            </Typography>
            {paymentStatus == "unpaid" && notPaidType !== "top down" ? (
              <Typography
                sx={{ fontWeight: "500", textTransform: "capitalize" }}
                variant="body2"
                color="initial"
                className={styles.ext_mar}
              >
                <Link
                  onClick={() => {
                    updatePrice(orderId);
                    router.push(
                      `${AppRoutes.checkOut}?type=${isRenewed == 1 ? "renewal" : notPaidType
                      }&order_id=${orderId}`
                    )
                  }}
                  color={AppColors.black}
                  style={{ cursor: "pointer" }}
                // ?type=${
                //   isRenewed == 1 ? "renewal" : notPaidType
                // }&order_id=${orderId}`
                // href={AppRoutes.checkOut}
                >
                  {paymentStatus}
                </Link>
              </Typography>
            ) : (
              paymentStatus == "paid" &&
              notPaidType !== "top down" && (
                <Typography
                  sx={{ fontWeight: "500", textTransform: "capitalize" }}
                  variant="body2"
                  color="initial"
                  className={styles.ext_mar}
                >
                  {paymentStatus}
                </Typography>
              )
            )}
            {notPaidType == "top down" && paymentStatus == "unpaid" ? (
              <Typography
                sx={{ fontWeight: "500", textTransform: "capitalize" }}
                variant="body2"
                color="initial"
                className={styles.ext_mar}
              >
                <Link
                  onClick={() => setOpenWallet(true)}
                  color={AppColors.black}
                  sx={{ cursor: "pointer", textDecorationColor: "black" }}
                // ?type=${
                //   isRenewed == 1 ? "renewal" : notPaidType
                // }&order_id=${orderId}`
                // href={AppRoutes.checkOut}
                >
                  Add to Wallet
                </Link>
              </Typography>
            ) : notPaidType == "top down" && paymentStatus == "paid" ? (
              <Typography
                sx={{ fontWeight: "500", textTransform: "capitalize" }}
                variant="body2"
                color="initial"
                className={styles.ext_mar}
              >
                Credited
              </Typography>
            ) : null}
            {/* <Typography
              sx={{ fontWeight: "500", textTransform: "capitalize" }}
              variant="body2"
              color="initial"
              className={styles.ext_mar}
            >
              {paymentStatus}
            </Typography> */}
          </div>
        </div>
        <div className={styles.status_price_wrap}>
          <div className={styles.status}>
            <Typography
              sx={{ fontWeight: "500" }}
              variant="body3"
              color="#787F82"
              className={styles.mob_only}
            >
              Status
            </Typography>
            <Typography
              variant="body2"
              color="initial"
              className={styles.ext_mar}
              sx={{
                textTransform: "capitalize",
                color: `${notPaidType === "full"
                  ? AppColors.primaryGreen
                  : notPaidType === "top up"
                    ? AppColors.yellow
                    : notPaidType === "finsihed"
                      ? AppColors.appOrange
                      : null
                  }`,
                fontWeight: "500"
              }}
            >
              {/* {notPaidType == "full" ? "Active" : notPaidType} */}
              {orderStatusHandler()}
              {/* {notPaidType} */}
            </Typography>
          </div>
          <div className={styles.price}>
            <Typography
              sx={{ fontWeight: "500" }}
              variant="body3"
              color="#787F82"
              className={styles.mob_only}
            >
              Price
            </Typography>
            <Typography
              variant="body2"
              color="initial"
              className={styles.ext_mar}
              sx={{
                color: AppColors.primaryGreen,
                fontWeight: "600"
              }}
            >
              AED{" "}
              {`${priceHandler()
                // paymentStatus == "paid"
                //   ? paidPrice > 0
                //     ? paidPrice
                //     : 0
                //   : totalPrice > 0
                //   ? totalPrice
                //   : 0
                }`}
            </Typography>
          </div>
        </div>
        {disclaimer ? (
          <>
            <div className={styles.disclaimer}>
              <Typography
                sx={{
                  fontWeight: "500",
                  fontSize: "13px",
                  padding: "10px 0px 0px 0px",
                  color: AppColors.primaryGreen
                }}
                variant="body2"
                color="initial"
                className={styles.para}
              >
                {disclaimer}
              </Typography>
            </div>
          </>
        ) : null}
        {addon_disclaimer ? (
          <>
            <div className={styles.disclaimer}>
              <Typography
                sx={{
                  fontWeight: "500",
                  fontSize: "13px",
                  padding: "10px 0px 0px 0px",
                  color: AppColors.primaryGreen
                }}
                variant="body2"
                color="initial"
                className={styles.para}
              >
                {addon_disclaimer}
              </Typography>
            </div>
          </>
        ) : null}
        {extras_disclaimer ? (
          <>
            <div className={styles.disclaimer}>
              <Typography
                sx={{
                  fontWeight: "500",
                  fontSize: "13px",
                  padding: "10px 0px 0px 0px",
                  color: AppColors.primaryGreen
                }}
                variant="body2"
                color="initial"
                className={styles.para}
              >
                {extras_disclaimer}
              </Typography>
            </div>
          </>
        ) : null}
        {proteinDisclaimer ? (
          <>
            <div className={styles.disclaimer}>
              <Typography
                sx={{
                  fontWeight: "500",
                  fontSize: "13px",
                  padding: "10px 0px 0px 0px",
                  color: AppColors.primaryGreen
                }}
                variant="body2"
                color="initial"
                className={styles.para}
              >
                {proteinDisclaimer}
              </Typography>
            </div>
          </>
        ) : null}
        {paymentDisclaimer && walletAmount && walletAmount > 0 ? (
          <div className={styles.disclaimer}>
            <Typography
              sx={{
                fontWeight: "500",
                fontSize: "13px",
                padding: "10px 0px 0px 0px",
                color: AppColors.primaryGreen
              }}
              variant="body2"
              color="initial"
              className={styles.para}
            >
              {paymentDisclaimer}
            </Typography>
          </div>
        ) : null}
        {/* {disclaimer && notPaidType == "top down" ? (
          <>
            <div className={styles.disclaimer}>
              <Typography
                sx={{
                  fontWeight: "500",
                  fontSize: "13px",
                  padding: "10px 0px 0px 0px",
                  color: AppColors.primaryGreen
                }}
                variant="body2"
                color="initial"
                className={styles.para}
              >
                {paymentDisclaimer}
              </Typography>
            </div>
          </>
        ) : null} */}
      </div>

          {
            open &&
      <OrderStatus
        orderData={historyData}
        open={open}
        handleClose={handleClose}
        handleClickOpen={handleClickOpen}
        notPaidType={notPaidType}
        priceHandler={priceHandler}
        isExecutive={isExecutive}
      />
          }
    </>
  )
}
