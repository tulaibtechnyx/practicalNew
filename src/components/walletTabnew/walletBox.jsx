import { Typography, useMediaQuery } from "@mui/material"
import styles from "./style.module.scss"
import AppColors from "helpers/AppColors"
import AppConstants from "helpers/AppConstants"
import { useSelector } from "react-redux"
import Loader from "../ThemeLoader"

const WalletBox = ({ walletPrice, loading = false }) => {
  // const isExecutive = AppConstants.isExecutive
  const { isExecutive } = useSelector((state) => state.auth)
  const matchesMediumScreen = useMediaQuery("(max-width:1400px)");

  return (
    <div>
      <div className={styles.container_main}>
        <div className={`${styles.balance_header_wrapper}  ${isExecutive ? styles.isExecutive : ""}`}>
          <Typography
            sx={{
              color: AppColors.primaryGreen,
              fontWeight: "500"
            }}
            className={styles.balance_header}
            variant="body2"
          >
            Your Balance
          </Typography>
        </div>
        <div className={`${styles.value_header} ${isExecutive ? styles.isExecutive : ""}`}>
          {
            loading ?
            <div > 
              <Loader
              // top={matchesMediumScreen ? "50%" : "53%"}
              /> 
            </div>
              :
              <Typography
                variant={"h1"}
                sx={{
                  paddingBottom: "9px",
                  color: AppColors.primaryGreen,
                  fontFamily: "AWConquerorInline",
                  fontSize: 40,
                  fontWeight: "medium",
                  textAlign: "Center"
                }}
              >
                {walletPrice} AED
              </Typography>
          }
        </div>
      </div>
    </div>
  )
}

export default WalletBox
