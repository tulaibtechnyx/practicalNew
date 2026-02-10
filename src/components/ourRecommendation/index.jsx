import React from "react"
import { Typography } from "@mui/material"
import styles from "./style.module.scss"
import RecomendationBox from "./RecomendationBox"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import DisclaimerComp from "../disclaimer"

const OurRecommendation = ({
  practicalCalorie,
  recommendedCalorie,
  dataRec,
  AllWeeks,
  AllDays,
  AllMeals,
  AllSnacks,
  changed
}) => {
  return (
    <>
      <div className={styles.boxWrapper}>
        <div className={styles.boxText}>
          <Typography variant={"h2"} className={styles.heading}>
            {dataRec?.recommendation?.heading}
          </Typography>
          <Typography variant={"body3"} component={"p"} className={styles.para}>
            {dataRec?.recommendation?.para}
          </Typography>
        </div>
        <DisclaimerComp
          AllSnacks={AllSnacks}
          AllMeals={AllMeals}
          AllDays={AllDays}
          AllWeeks={AllWeeks}
          totalCalories={practicalCalorie ? practicalCalorie : 0}
          totalDays={7}
        />

        <div className={styles.recommendBoxWrapper}>
          <RecomendationBox
            style={styles.totalQuantityBox}
            topHeading={"Total number of Calories you need per day"}
            topCount={recommendedCalorie ? recommendedCalorie : 0}
            color={AppColors.appOrange}
            bottomDescription={
              "Includes ALL the Meals, Snacks & Drinks you could have in one day "
            }
          />
          <RecomendationBox
            style={styles.numberBox}
            color={AppColors.primaryGreen}
            topHeading={
              "Number of Calories PractiCal will deliver per day based on your previous Quiz answers"
            }
            topCount={practicalCalorie ? practicalCalorie : 0}
            changed={changed}
            bottomDescription={
              "See below to find out how these Calories are split across your PractiCal Delivery"
            }
          />
        </div>
      </div>
    </>
  )
}

OurRecommendation.propTypes = {
  practicalCalorie: PropTypes.number,
  recommendedCalorie: PropTypes.number,
  dataRec: PropTypes.any
}

export default OurRecommendation
