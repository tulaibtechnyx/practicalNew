import React, { useEffect, useState } from "react"
import styles from "./style.module.scss"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import AppColors from "helpers/AppColors"
import clsx from "clsx"
import { useRouter } from "next/router"
import AppRoutes from "helpers/AppRoutes"

import moment from "moment"
import { useSelector } from "react-redux"
import AppConstants from "@helpers/AppConstants"

const UnPaidTicker = ({ order_id, type, onPay, updatePrice }) => {
  const [tickerData, setTickerData] = useState({
    price: "",
    endDate: ""
  })
  const { activeTabvalue } = useSelector(
    (state) => state.home
  )
  const TabValues = AppConstants?.TabValues;
  const globalLoading = useSelector((state) => state.home.globalLoading);
  const router = useRouter()
  return (
    <div className="ticker-Active">
      <Box
        className={styles.ticker_sec}
        style={{
          backgroundColor: "#FA7324"
        }}
      >
        <div className="tickerSM">
          <div className={clsx(styles.ticker_wrapper, styles.sty3)}>
            <div className={styles.content}>
              <Typography
                variant="h2"
                color={AppColors.white}
                style={{
                  color: AppColors.white
                }}
              >
                Payment Failed
              </Typography>

              <Typography
                variant="h2"
                color={AppColors.white}
                style={{
                  color: AppColors.white
                }}
              >
                Paynow to resume your subscription
              </Typography>
            </div>
            <div className={styles.btn_sec}>
              <Button
                variant="outlined"
                // onClick={() => router.push(AppRoutes.checkOut)}
                onClick={() => {
                  if (onPay) {
                    onPay()
                  } else {
                    updatePrice(order_id);
                    router.push(
                      `${AppRoutes.checkOut}?type=${type}&order_id=${order_id}`
                    )
                  }
                }}
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

export default UnPaidTicker
