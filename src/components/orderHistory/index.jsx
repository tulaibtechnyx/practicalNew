import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Typography } from "@mui/material"

import AppColors from "helpers/AppColors"
import HistoryCard from "./HistoryCard"
import get from "lodash/get"
import AppConstants from "helpers/AppConstants"

import styles from "./style.module.scss"
import moment from "moment"

const OrderHistoryComp = ({ handleTabChange }) => {
  const { orderHistory, startUpData } = useSelector((state) => state.home)
  const { userProfile } = useSelector((state) => state.profile)

  const [historyDataLocal, setHistoryDataLocal] = useState([])
  const [startUpDataLocal, setstartUpDataLocal] = useState(null)
  const [historySortedData, setHistorySortedData] = useState([])

  const [userProfileLocal, setUserProfileLocal] = useState(null)

  const isSubscribed = get(userProfileLocal, "profile.is_subscribed", "")
  const deliveryDays = get(userProfileLocal, "profile.days_food_delivery", "")
  const thresholdDate = get(startUpDataLocal, "threshold_day", "")

  useEffect(() => {
    if (startUpData) {
      setstartUpDataLocal(startUpData)
    }
  }, [startUpData])

  useEffect(() => {
    if (userProfile) {
      setUserProfileLocal(userProfile)
    }
  }, [userProfile])

  useEffect(() => {
    if (orderHistory) {
      setHistoryDataLocal(orderHistory)
    }
  }, [orderHistory])

  useEffect(() => {
    sortArrayData()
  }, [historyDataLocal])

  const sortArrayData = () => {
    const allData = [...historyDataLocal]
    // allData.sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime());
    allData.sort((a, b) => b.id - a.id)

    setHistorySortedData(allData)
  }
  // const isExecutive = AppConstants.isExecutive
  const { isExecutive } = useSelector((state) => state.auth)
  return (
    <div className="container container--custom">
      {/* <div className={styles.orderHeading}>
        <Typography
          variant={"h2"}
          sx={{ fontWeight: "600" }}
          component={"h1"}
          className={styles.heading}
        >
          {"Order History"}
        </Typography>
      
      </div> */}

      <div className={`${styles.orderHistorySec} `}>
        <div className={styles.head_sec_Desktop}>
          <div className={styles.date_meal_plan_wrap}>
            <div className={styles.orderID}>
              <Typography
                variant="body3"
                sx={{ fontWeight: "500", fontSize: "15px !important" }}
                color="#787F82"
                className={styles.mob_only}
              >
                Order ID
              </Typography>
            </div>
            <div className={styles.date}>
              <Typography
                variant="body3"
                sx={{ fontWeight: "500", fontSize: "15px !important" }}
                color="#787F82"
                className={styles.mob_only}
              >
                Date
              </Typography>
            </div>
            <div className={styles.meal_plan}>
              <Typography
                variant="body3"
                sx={{ fontWeight: "500", fontSize: "15px !important" }}
                color="#787F82"
                className={styles.mob_only}
              >
                Meal Plan
              </Typography>
            </div>
          </div>
          <div className={styles.duration_sec}>
            <div className={styles.durationCheck}>
              <Typography
                variant="body3"
                sx={{ fontWeight: "500", fontSize: "15px !important" }}
                color="#787F82"
                className={styles.mob_only}
              >
                Duration
              </Typography>
            </div>
            <div className={styles.PaymentStatus}>
              <Typography
                variant="body3"
                sx={{ fontWeight: "500", fontSize: "15px !important" }}
                color="#787F82"
                className={styles.PaidStatus}
              >
                Payment
              </Typography>
            </div>
          </div>
          <div className={styles.status_price_wrap}>
            <div className={styles.status}>
              <Typography
                variant="body3"
                sx={{ fontWeight: "500", fontSize: "15px !important" }}
                color="#787F82"
                className={styles.mob_only}
              >
                Status
              </Typography>
            </div>
            <div className={styles.price}>
              <Typography
                variant="body3"
                sx={{ fontWeight: "500", fontSize: "15px !important" }}
                color="#787F82"
                className={styles.mob_only}
              >
                Price
              </Typography>
            </div>
          </div>
        </div>
        {historySortedData.length > 0 ? (
          historySortedData.map((history, index) => {
            return (
              <HistoryCard
                handleTabChange={handleTabChange}
                isSubscribed={isSubscribed}
                historyData={history}
                thresholdDate={moment(thresholdDate).toDate() ?? new Date()}
                deliveryDays={deliveryDays}
                key={index}
              />
            )
          })
        ) : (
          <p>No History Found</p>
        )}
      </div>
    </div>
  )
}

export default OrderHistoryComp
