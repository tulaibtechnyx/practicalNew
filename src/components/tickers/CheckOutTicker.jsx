import React, { useEffect, useState } from "react"
import styles from "./style.module.scss"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import { useRouter } from "next/router"
import AppRoutes from "helpers/AppRoutes"
import clsx from "clsx"
import AppColors from "helpers/AppColors"
import moment from "moment"
import { useSelector } from "react-redux"
import AppConstants from "@helpers/AppConstants"

const CheckOutTicker = ({ endDate, paymentDate, clicked }) => {
  const router = useRouter()

  const [tickerEndDate, setTickerEndDate] = useState("")
  const [tickerPaymentDate, setTickerPaymentDate] = useState("")
  const { activeTabvalue } = useSelector(
    (state) => state.home
  )
  const TabValues = AppConstants?.TabValues;
  const globalLoading = useSelector((state) => state.home.globalLoading);
  useEffect(() => {
    setTickerEndDate(endDate)
    setTickerPaymentDate(paymentDate)
  }, [endDate, paymentDate])
  return (
    <div className="ticker-Active">
      <Box
        className={styles.ticker_sec}
        style={{
          backgroundColor: "#FA7324"
        }}
      >
        <div className="tickerSM">
          <div className={clsx(styles.ticker_wrapper, styles.messageSec)}>
            <div className={styles.content}>
              <Typography
                variant="h2"
                color={AppColors.white}
                style={{
                  color: AppColors.white
                }}
              >
                Below are our Meal/Snack recommendations based on the
                information you’ve given us. You can swap them anytime… even
                after you have paid!
              </Typography>
            </div>
            <div className={styles.btn_sec}>
              <Button
                onClick={clicked}
                variant="outlined"
                className={styles.btn_small}
                style={{
                  color: AppColors.black,pointerEvents:activeTabvalue===TabValues.EDIT_PREFERENCES && globalLoading?'none':'auto',
                }}
              >
                Pay Now
              </Button>
            </div>
          </div>
        </div>
      </Box>
    </div>
  )
}

export default CheckOutTicker
