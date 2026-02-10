import React from "react"
import { Typography } from "@mui/material"
import Slider from "react-slick"
import styles from "./style.module.scss"

const MealPlan = () => {
  return (
    <div className={styles.boxSlider}>
      <Slider
        arrows={true}
        fade={false}
        dots={false}
        vertical={true}
        slidesToShow={1}
        slidesToScroll={1}
        verticalSwiping={true}
        infinite={true}
        centerMode={true}
        // ref={(slider1) => setNav1(slider1)}
      >
        <div className={styles.boxCol}>
          <Typography variant={"h2"} className={styles.heading}>
            {"4"}
          </Typography>
          <Typography variant={"body3"} component={"p"} className={styles.para}>
            {"Weeks"}
          </Typography>
        </div>
        <div className={styles.boxCol}>
          <Typography variant={"h2"} className={styles.heading}>
            {"5"}
          </Typography>
          <Typography variant={"body3"} component={"p"} className={styles.para}>
            {"Weeks"}
          </Typography>
        </div>
        <div className={styles.boxCol}>
          <Typography variant={"h2"} className={styles.heading}>
            {"6"}
          </Typography>
          <Typography variant={"body3"} component={"p"} className={styles.para}>
            {"Weeks"}
          </Typography>
        </div>
      </Slider>
    </div>
  )
}

export default MealPlan
