import React from "react"
import styles from "./style.module.scss"
import Typography from "@mui/material/Typography"
import AppColors from "helpers/AppColors"
import { useSelector } from "react-redux"
import { Box } from "@mui/system"
import AppConstants from "helpers/AppConstants"
import AppLogger from "helpers/AppLogger"

const EditPrefBox = ({
  textColor,
  color,
  calorie,
  PrimaryText,
  SecondryText,
  changed,
  price,
  renewalView,
  renewalText,
  className

}) => {
  // const isExecutive = AppConstants.isExecutive
  const { isExecutive } = useSelector((state) => state.auth)
  return (
    <>
      <section className={`editBoxSec ${styles.editBoxSec} ${isExecutive ? styles.isExecutive : ""} `}>
        <Box
          className={`editBox ${styles.edit_box} ${className} `}
          color={AppColors.white}
          style={{
            backgroundColor: color
          }}
        >
          <div className={styles.edit_box_wrapper}>
            <div className={styles.content}>
              <Typography
                variant="body3"
                className={styles.heading1}
                color={textColor}
                mb={1}
              >
                {PrimaryText}
              </Typography>
              <Typography
                variant="body2"
                className={styles.heading2}
                color={textColor}
              >
                {SecondryText}
              </Typography>
            </div>
            <div className={styles.calories_txt}>
              <Typography
                variant="h2"
                color={textColor}
                sx={{
                  color: changed ? "#FAD036" : textColor,
                  fontFamily: "AWConquerorInline"
                }}
              >
                {renewalView ? price : calorie}
              </Typography>
              {renewalView ? (
                <Typography
                  variant="body3"
                  color={changed ? "#FAD036" : textColor}
                  sx={{ fontSize: "12px !important" }}
                >
                  {renewalText}
                </Typography>
              ) : (
                <Typography
                  variant="body3"
                  color={changed ? "#FAD036" : textColor}
                >
                  {"Calories"}
                </Typography>
              )}
            </div>
          </div>
        </Box>
      </section>
    </>
  )
}

export default EditPrefBox
