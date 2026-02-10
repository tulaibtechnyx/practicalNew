import React, { useEffect, useState } from "react"
import OneTimePaidTicker from "../../components/tickers/OneTimePaidTicker"
import NotPaidSubscribedTicker from "../../components/tickers/NotPaidSubscribedTicker"
import UnPaidTicker from "../../components/tickers/UnPaidTicker"
import TopUpTicker from "../../components/tickers/TopUpTicker"
import { useSelector } from "react-redux"
import get from "lodash/get"
import $ from "jquery"
import AppLogger from "helpers/AppLogger"
import { formateDateFrom } from "../../helpers/ShortMethods"

export default function index({ onPay , isExecutive}) {
  // Redux states
  const { userProfile } = useSelector((state) => state.profile)
  const { renewalData, cards, startUpData, ticker  } = useSelector(
    (state) => state.home
  )

  // Local States
  const [planExpired, setPlanExpired] = useState(false)
  const [userProfileLocal, setUserProfileLocal] = useState(null)
  const [tickerData, setTickerData] = useState(null)
  const [cardExpiredStatus, setCardExpiredStatus] = useState(false)
  const [cardsDataLocal, setCardDataLocal] = useState(null)
  const [renewalDataLocal, setRenewalDataLocal] = useState(null)
  const [startUpDataLocal, setStartUpDataLocal] = useState(null)

  // Profile Dependent Variables
  const userEndDate = get(userProfileLocal, "profile.meal_plan_end_date", "")
  const PhoneCheck = get(userProfileLocal, "phone", "")
  const userStartDate = get(
    userProfileLocal,
    "profile.meal_plan_start_date",
    ""
  )

  // Ticker Dependent Variables
  const paymentStatus = get(tickerData, "payment_status", "")
  const notPaidType = get(tickerData, "not_paid_type", "")
  const tickerPrice = get(tickerData, "price", 0)
  const tickerOrderId = get(tickerData, "history_latest.order_id", "")
  const subscriptionStatus = get(tickerData, "profile.is_subscribed", -1)
  const tickerPaymentDate = get(tickerData, "payment_date", "")
  const tickerEndDate = get(
    tickerData,
    "profile.meal_plan_end_date",
    new Date()
  )

  // Card Dependent Variables
  const defaultCard = get(cardsDataLocal, "default_card", null)

  // Startup Dependent Variables
  const thresholdDays = get(startUpDataLocal, "threshold_day_count", "")

  // Renewal Dependent Variables
  const renewalPaymentStatus = get(renewalDataLocal, "order.payment_status")
  const renewalOrderId = get(renewalDataLocal, "order_id", null)

  // ======= Local State Setters =======
  useEffect(() => {
    if (userProfile) {
      setUserProfileLocal(userProfile)
      getExpiredStatusHandler()
    }
  }, [userProfile])

  useEffect(() => {
    if (ticker) {
      setTickerData(ticker)
    }
  }, [ticker])

  useEffect(() => {
    cardExpiryHandler()
  }, [cards, ticker])

  useEffect(() => {
    if (cards) {
      setCardDataLocal(cards)
    }
  }, [cards])

  useEffect(() => {
    if (renewalData) {
      setRenewalDataLocal(renewalData)
    }
  }, [renewalData])

  useEffect(() => {
    if (startUpData) {
      setStartUpDataLocal(startUpData)
    }
  }, [startUpData])

  // ======= Helper Functions =======
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
    } catch (err) {
      return err
    }
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

  
  function isCurrentDateBetween(startDateStr, endDateStr) {
    // Convert the start and end date strings to Date objects
    // Convert the start and end date strings to Date objects
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

  console.log(
    isExecutive ,'rohan'
  )
  // Conditional Rendering
  function tickerHandle() {
    if (!planExpired) {
      // $("body").addClass("tickerON")
      if (paymentStatus == "unpaid") {
        if (notPaidType == "top up") {
          return (
            <TopUpTicker
              order_id={tickerOrderId}
              price={tickerPrice}
              onPay={onPay}
            />
          )
        } else if (notPaidType == "full") {
          if (subscriptionStatus == 1) {
            return (
              <NotPaidSubscribedTicker
                order_id={tickerOrderId}
                type={notPaidType}
                onPay={onPay}
              />
            )
          } else {
            return (
              <UnPaidTicker
                PhoneCheck={PhoneCheck}
                paymentDate={tickerPaymentDate}
                price={tickerPrice}
                endDate={tickerEndDate}
                order_id={tickerOrderId}
                type={notPaidType}
                onPay={onPay}
                isExecutive={isExecutive}
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
                onPay={onPay}
              />
            )
          }
        }

        if (renewalTickerChecker()) {
          if (isCurrentDateBetween(userStartDate, userEndDate)) {
            return (
              <OneTimePaidTicker
                endDate={tickerEndDate}
                paymentDate={tickerPaymentDate}
                type={"renewal"}
                order_id={renewalOrderId}
              />
            )
          } else {
            AppLogger("this  is else=============")
            // $("body").removeClass("tickerON")
            return
          }
        } else {
          // $("body").removeClass("tickerON")

          return
        }
      }
    } else {
      // $("body").removeClass("tickerON")
      return
    }
  }

  return <div>{tickerHandle()}</div>
}
