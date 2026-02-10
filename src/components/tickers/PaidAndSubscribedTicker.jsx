import React,{useState,useEffect} from "react"
import styles from "./style.module.scss"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import AppColors from "helpers/AppColors"
import clsx from "clsx"
import moment from "moment"
const PaidAndSubscribedTicker = ({ endDate,renewDate }) => {
    const [tickerEndDate, setTickerEndDate] = useState("")

  useEffect(() => {
    setTickerEndDate(endDate)
  }, [endDate])

  
  return (
    // <>
    //   <Box
    //     className={styles.ticker_sec}
    //     style={{
    //       backgroundColor: AppColors.secondaryGreen
    //     }}
    //   >
    //     <div className={styles.ticker_wrapper}>
    //       <div className={styles.content}>
    //         <Typography
    //           variant="h5"
    //           color={AppColors.white}
    //           sx={{ pb: 1 }}
    //           style={{
    //             color: TextcolorOrange
    //           }}
    //         >
    //           Meal Plan Renews: 31 December
    //         </Typography>
    //         <Typography
    //           variant="h5"
    //           color={AppColors.white}
    //           sx={{ pb: 1 }}
    //           style={{
    //             color: TextcolorOrange
    //           }}
    //         >
    //           Next Meal Plan Auto Payment on: 15th February
    //         </Typography>
    //         {/* <Typography
    //           variant="body3"
    //           color={AppColors.white}
    //           style={{
    //             color: TextcolorOrange
    //           }}
    //         >
    //           Status: Unpaid
    //         </Typography>
    //         <Box>
    //           <Typography
    //             variant="body3"
    //             color={AppColors.white}
    //             sx={{ pb: 1 }}
    //             style={{
    //               color: TextcolorOrange
    //             }}
    //           >
    //             Payment due by: 15th November
    //           </Typography>
    //         </Box> */}
    //       </div>
    //       {/* <div className={styles.btn_sec}>
    //         <Button
    //           variant="outlined"
    //           className={styles.btn_small}
    //           style={{
    //             color: btnTextcolorOrange
    //           }}
    //         >
    //           Pay Now
    //         </Button>
    //       </div> */}
    //     </div>
    //   </Box>
    // </>
    <div className="ticker-Active">
      <Box
        className={styles.ticker_sec}
        style={{
          backgroundColor: "#119A77"
        }}
      >
        <div className="tickerSM">
          <div className={clsx(styles.ticker_wrapper, styles.sty2)}>
            <div className={styles.content}>
              <Typography
                variant="h2"
                color={AppColors.white}
                style={{
                  color: AppColors.white
                }}
              >
                Meal Plan Renews: {moment(tickerEndDate).format("DD MMMM YYYY")}
              </Typography>
              <Typography
                variant="h2"
                color={AppColors.white}
                style={{
                  color: AppColors.white
                }}
              >
                Next Meal Plan Auto Payment on: {moment(renewDate).format("DD MMMM")}
              </Typography>
            </div>
            <div className={styles.btn_sec}>
              {/* <Button
                variant="outlined"
                className={styles.btn_small}
                style={{
                  color: AppColors.black
                }}
              >
                Renew Meal Plan
              </Button> */}
            </div>
          </div>
        </div>
      </Box>
    </div>
  )
}

export default PaidAndSubscribedTicker
