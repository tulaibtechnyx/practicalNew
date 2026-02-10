import React, { useState } from "react"
import { Typography } from "@mui/material"
import Slider from "react-slick"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"

const MealPlan1 = (props) => {
  const { title, mealPlan1 } = props
  const [nav1, setNav1] = useState()

  return (
    <div className={styles.mealBoxWrapper}>
      <div className={styles.mealName}>
        <Typography
          variant={"body3"}
          component={"p"}
          className={styles.para}
          sx={{ color: AppColors.black, fontSize: "10px", fontWeight: "500" }}
        >
          {title}
        </Typography>
      </div>
      <div className={styles.mealBox}>
        <Slider
          arrows={false}
          fade={false}
          dots={false}
          vertical={true}
          slidesToShow={1}
          verticalSwiping={true}
          centerMode={false}
          ref={(slider1) => setNav1(slider1)}
        >
          {mealPlan1.map((val, i) => (
            <div className={styles.mealBoxText} key={i}>
              <Typography
                variant={"h2"}
                className={styles.heading}
                sx={{ color: AppColors.white, fontSize: "22px" }}
              >
                {val.heading}
              </Typography>
              <Typography
                variant={"body3"}
                component={"p"}
                sx={{ color: AppColors.white, fontSize: "10px" }}
                className={styles.para}
              >
                {val.calorieTxt}
              </Typography>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}
MealPlan1.propTypes = {
  title: PropTypes.string,
  mealPlan1: PropTypes.array
}
export default MealPlan1
