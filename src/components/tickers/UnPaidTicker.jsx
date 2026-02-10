import React, { useEffect, useState } from "react"
import styles from "./style.module.scss"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import AppColors from "helpers/AppColors"
import clsx from "clsx"
import { useRouter } from "next/router"
import AppRoutes from "helpers/AppRoutes"
import AppConstants from "helpers/AppConstants"
import moment from "moment"
import { Link } from "@mui/material"
import { ifZerothenOk, pushToDataLayer } from "@helpers/CommonFunc"
import { useSelector } from "react-redux"

const UnPaidTicker = ({
  price,
  endDate,
  paymentDate,
  PhoneCheck,
  order_id,
  type,
  onPay,
  updatePrice,
  isExecutive,
}) => {
  // Rounding off price to nearest value: Bug Fixation
  price = typeof price == 'number'? Math.round(price):price
  const [tickerData, setTickerData] = useState({
    price: "",
    endDate: ""
  })
  const globalLoading = useSelector((state) => state.home.globalLoading);
  const { activeTabvalue } = useSelector(
    (state) => state.home
  )
  const TabValues = AppConstants?.TabValues;
  useEffect(() => {
    if (price) {
      tickerData.price = price
    }
    if (endDate) {
      tickerData.endDate = endDate
    }
  }, [endDate, price])
  const router = useRouter()
  return (
    <div className={`ticker-Active ${isExecutive ? "isExecutive" : ""}`}>
      <Box
        className={`${styles.ticker_sec} ${isExecutive ? styles.isExecutive : ""}`}
        style={{
          backgroundColor: isExecutive ? "#fa7324" : "#fa7324" 
        }}
      >
        <div className="tickerSM">
          <div className={clsx(styles.ticker_wrapper, styles.sty3)}>
            {PhoneCheck === null ? (
              <>
                <div className={styles.content} style={{ height: "46.78px" }}>
                  <Typography
                    variant="h2"
                    color={AppColors.white}
                    style={{
                      color: AppColors.white
                    }}
                  >
                    Kindly Update Your Phone Number.{" "}
                    <Link sx={{ display: "inline-block" }}>Click Here</Link>
                  </Typography>
                </div>
                <div className={styles.btn_sec}></div>
              </>
            ) : (
              <>
                <div className={styles.content}>
                  {(ifZerothenOk(price) || price) && (
                    <Typography
                      variant="h2"
                      color={isExecutive ? AppColors.white : AppColors.white}
                      style={{
                        color:isExecutive ? AppColors.white : AppColors.white
                      }}
                    >
                      Total to pay: {price} AED
                    </Typography>
                  )}
                  {/* <Typography
                variant="h2"
                color={AppColors.white}
                style={{
                  color: AppColors.primaryGreen
                }}
              ></Typography> */}
                  {paymentDate && (
                    <Typography
                      variant="h2"
                      color={isExecutive ? AppColors.white : AppColors.white}
                      style={{
                        color: isExecutive ? AppColors.white : AppColors.white
                      }}
                    >
                      Payment due by:{" "}
                      {moment(paymentDate).format("DD MMMM YYYY")}
                    </Typography>
                  )}
                </div>
                <div className={styles.btn_sec}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      const screen = typeof window !== "undefined" ? window.location.pathname.replace("/", "") : "";
                      if (screen == "dashboard") {
                        pushToDataLayer("dashboard_paynow_clicks");
                      }
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
              </>
            )}
          </div>
        </div>
      </Box>
    </div>
  )
}

export default UnPaidTicker
