import React from "react"
import { Typography } from "@mui/material"
import styles from "./style.module.scss"
import AppColors from "helpers/AppColors"
import clsx from "clsx"
import { useSelector } from "react-redux"

const DiscountComponent = (props) => {
  const { bgColor, heading, price, currency, textColor ,sign} = props
  const { isExecutive } = useSelector((state) => state.auth)

  return (
    <div className={clsx(styles.discount, isExecutive && styles.isExecutive)}>
      <div className={styles.discountWrapper}>
        <div className={styles.discountBox}>
          <Typography
            sx={{
              paddingBottom: "12px",
              fontWeight: "500"
            }}
            variant={"body1"}
            className={styles.para}
          >
            {heading}
          </Typography>
          <div
            style={{ background: bgColor }}
            className={styles.discountBoxInner}
          >
            <Typography
              variant={"h1"}
              sx={{
                fontFamily: "AWConquerorInline",
                // fontSize: "49.28px",
                color: textColor
              }}
            >
              {price}
            </Typography>
            <Typography
              sx={{
                color: textColor
              }}
              variant="body3"
            >
              {sign}
            </Typography>
            <Typography
              sx={{
                color: textColor
              }}
              variant="body3"
            >
              {currency}
            </Typography>
          </div>
        </div>
        {/* <div className={styles.discountBox}>
          <Typography
            sx={{ paddingBottom: "12px", fontWeight: "500" }}
            variant={"body1"}
            className={styles.para}
          >
            {"Your friend gets"}
          </Typography>
          <div className={styles.discountBoxInner}>
            <Typography
              variant={"h1"}
              sx={{
                fontFamily: "AWConquerorInline",
                fontSize: "49.28px",
                color: AppColors.white
              }}
            >
              {"20%"}
            </Typography>
            <Typography
              sx={{
                color: AppColors.white
              }}
              variant="body3"
              component="p"
            >
              {"off their first month"}
            </Typography>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default DiscountComponent
