import React, { useEffect, useState } from "react"
import styles from "./style.module.scss"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import { useRouter } from "next/router"
import AppRoutes from "helpers/AppRoutes"
import get from "lodash/get"
import AppColors from "helpers/AppColors"
import moment from "moment"
import { useSelector } from "react-redux"
import AppConstants from "@helpers/AppConstants"

const OneTimePaidTicker = ({ endDate, paymentDate, type, order_id, updatePrice, userData }) => {
  const router = useRouter()
  const { isExecutive } = useSelector((state) => state.auth)

  const [tickerEndDate, setTickerEndDate] = useState("")
  const { activeTabvalue } = useSelector(
    (state) => state.home
  )
  const TabValues = AppConstants?.TabValues;
  const globalLoading = useSelector((state) => state.home.globalLoading);

  useEffect(() => {
    setTickerEndDate(endDate)
  }, [endDate, paymentDate])

  const today = moment().startOf("day")
  const isDiffTwoDays = moment(tickerEndDate, "YYYY-MM-DD").diff(today, "days")
  const planStartDate = moment(get(userData, "userStartDate", null), "YYYY-MM-DD")
  const planEndDate = moment(tickerEndDate, "YYYY-MM-DD")

  const handleTodayDate = () => {
    if(today.isSameOrBefore(planStartDate)){
      return planStartDate
    }

    return today;
  }

  const handleCopyChange = (date) => {
    try {
      if(date){
        // return `Enjoying PractiCal? Renew your plan here! Renew before 4pm on ${date} for uninterrupted deliveries.`
        return ` Enjoying PractiCal${isExecutive ? " Executive" : ""}? For uninterrupted deliveries renew your plan before 4pm on  ${date}.`
      }

      return '';
    } catch (error) {
      console.log("Error at handleCopyChange", error);
      return ''
    }
  }

  return (
    <div className="ticker-Active">
      <Box
        className={styles.ticker_sec}
        style={{
          backgroundColor: "#FAB03B"
        }}
      >
        <div className="tickerSM">
          <div className={styles.ticker_wrapper}>
            {isDiffTwoDays > 2 ? (
              <div className={styles.content}>
                {tickerEndDate && (
                  <Typography
                    variant="h2"
                    color={AppColors.white}
                    style={{
                      color: AppColors.black
                    }}
                  >
                    {/* Meal Plan Expires:{" "}
                    {moment(tickerEndDate).format("DD MMMM YYYY")} */}
                    {/* Your Meal Plan expires soon! */}
                    {handleCopyChange(moment(tickerEndDate)
                      .subtract(2, "day")
                      .format("DD MMMM YYYY").toString())}
                  </Typography>
                )}
              </div>
            ) : (
              <Typography
                variant="h2"
                color={AppColors.white}
                style={{
                  color: AppColors.black
                }}
              >
                Your Meal Plan expires soon!
              </Typography>
            )}
            <div className={styles.btn_sec}>
              <Button
                onClick={() =>
                 {
                  updatePrice(order_id);
                  router.push(
                    `${AppRoutes.renewal}?type=${type}&order_id=${order_id}`
                  )
                }
                }
                variant="outlined"
                className={styles.btn_small}
                style={{
                  color: AppColors.black,pointerEvents:activeTabvalue===TabValues.EDIT_PREFERENCES && globalLoading?'none':'auto',
                }}
              >
                {/* {isDiffTwoDays == 2 ? "Renew Now!" : "Renew Meal Plan"} */}
                Renew Now
              </Button>
            </div>
          </div>
        </div>
      </Box>
    </div>
  )
}

export default OneTimePaidTicker
