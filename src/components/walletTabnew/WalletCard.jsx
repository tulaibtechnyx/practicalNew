import styles from "./style.module.scss"
import { Typography } from "@mui/material"
import Arrow from "../../../public/images/icons/logarrow-down.svg"
import moment from "moment"
import AppConstants from "helpers/AppConstants"
import AppColors from "helpers/AppColors"
export default function HistoryCard({ walletInfo }) {
  const isExp = moment(walletInfo?.wallet_credit_expiry_date).isBefore(moment());
  return (
    <div className={styles.order_history}>
      <div className={styles.date_meal_plan_wrap}>
        <div className={styles.orderID}>
          <Typography
            sx={{ fontWeight: "500" }}
            variant="body3"
            color="#787F82"
            className={styles.mob_only}
          >
            Date
          </Typography>

          <Typography
            sx={{ fontWeight: "500" }}
            variant="body2"
            color="initial"
            className={styles.ext_mar}
          >
            {moment(walletInfo?.transaction_date).format(
              AppConstants.dateFormat
            )}
          </Typography>
        </div>
        <div className={styles.orderID}>
          <Typography
            sx={{ fontWeight: "500" }}
            variant="body3"
            color="#787F82"
            className={styles.mob_only}
          >
            Amount
          </Typography>

          <Typography
            sx={{ fontWeight: "500" }}
            variant="body2"
            color="initial"
            className={styles.ext_mar}
          >
            {walletInfo?.amount} AED
          </Typography>
        </div>
        <div className={styles.orderID}>
          <Typography
            sx={{ fontWeight: "500" }}
            variant="body3"
            color="#787F82"
            className={styles.mob_only}
          >
            Expiry Date
          </Typography>
          {walletInfo?.wallet_credit_expiry_date ?
            <Typography
              sx={{ fontWeight: "500" }}
              variant="body2"
              color="initial"
              className={styles.ext_mar}
            >
              {moment(walletInfo?.wallet_credit_expiry_date).format(
                AppConstants.dateFormat
              )}
            </Typography>
            : "-"}
        </div>
        <div className={styles.orderID}>
          <Typography
            sx={{ fontWeight: "500" }}
            variant="body3"
            color="#787F82"
            className={styles.mob_only}
          >
            Status
          </Typography>
           {walletInfo?.wallet_credit_expiry_date ?
            <Typography
              sx={{ fontWeight: "500" }}
              variant="body2"
              color={isExp ? AppColors.primaryOrange : AppColors.primaryGreen}
              className={styles.ext_mar}
            >
              {isExp ? "Expired" : "Active"}


            </Typography>            
            : "-"}
        </div>
        <div className={styles.orderID}>
          <Typography
            sx={{ fontWeight: "500" }}
            variant="body3"
            color="#787F82"
            className={styles.mob_only}
          >
            Transaction Type
          </Typography>

          <div className={styles.transaction_type}>
            <Typography
              sx={{ fontWeight: "700" , textAlign:'left'}}
              variant="body2"
              color="initial"
              className={styles.ext_mar}
            >
              {walletInfo?.transaction_type?.toUpperCase()}
            </Typography>
            <div
              className={
                walletInfo?.transaction_type?.toLowerCase() == "debit"
                  ? styles.debit
                  : styles.credit
              }
            >
              <Arrow />
            </div>
          </div>
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
            Description
          </Typography>
          <Typography
            sx={{ fontWeight: "500" }}
            variant="body2"
            color="initial"
            className={styles.ext_mar}
          >
            {walletInfo?.description}
          </Typography>
        </div>
      </div>
    </div>
  )
}
