import React, { useState, useEffect, useRef } from "react"
import { Typography } from "@mui/material"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
import Slider from "react-slick"
import clsx from "clsx"
import AppColors from "helpers/AppColors"
import PreferencesSlider from "components/mealBox/PreferencesSlider"
import AppLogger from "helpers/AppLogger"
const snacks = [0, 1, 2, 3, 4, 5]

export default function SnackBox({ snackCount, updateMeal }) {
  const [currentActiveIndex, setCurrentActiveIndex] = useState(1)
  const [showSlider, setShowSlider] = useState(false)

  const sliderRef = useRef()
  useEffect(() => {
    indexFinder()
  }, [snackCount])

  useEffect(() => {
    AppLogger("This is called=============", currentActiveIndex)
    if (sliderRef) {
      sliderRef?.current?.slickGoTo(currentActiveIndex)
    }
  }, [currentActiveIndex])

  const indexFinder = () => {
    setShowSlider(false)
    const currentActive = snacks.findIndex((val) => val == snackCount)
    if (currentActive !== -1) {
      setCurrentActiveIndex(currentActive)
    } else {
      setCurrentActiveIndex(0)
    }
    setShowSlider(true)
  }
  return (
    <div className={styles.mealBoxWrapper}>
      <div className={styles.mealName}>
        <Typography
          variant={"body3"}
          component={"p"}
          className={styles.para}
          sx={{ color: AppColors.black, fontSize: "10px", fontWeight: "500" }}
        >
          {`Snacks / Sides`}
        </Typography>
      </div>
      <div className={clsx(styles.mealBox, styles.sty2)}>
        <div className={styles.boxGrid}>
          <div className={styles.sliderBox}>
            {/* <PreferencesSlider
              currentType={"snacks_deliver_per_day"}
              sliderChange={updateMeal}
              currentData={snackCount}
              type="snack"
            /> */}

            {showSlider && (
              <Slider
                ref={sliderRef}
                afterChange={(e) => updateMeal(snacks[e], sliderRef ?? null)}
                arrows={true}
                currentSlide={currentActiveIndex}
                fade={false}
                dots={false}
                vertical={true}
                slidesToShow={1}
                centerMode={false}
                swipeToSlide={true}
                infinite={true}
                verticalSwiping={true}
              >
                {snacks.map((mealData, index) => {
                  return (
                    <div key={index} className={styles.mealBoxText}>
                      <Typography
                        variant={"h2"}
                        className={styles.heading}
                        sx={{ fontSize: "22px", fontWeight: "400" }}
                      >
                        {mealData}
                      </Typography>
                      <Typography
                        variant={"body3"}
                        component={"p"}
                        sx={{ fontSize: "10px" }}
                        className={styles.para}
                      >
                        {"200 Calorie Snacks"}
                      </Typography>
                    </div>
                  )
                })}
              </Slider>
            )}
          </div>
        </div>
      </div>
      <div className={styles.mealName}>
        <Typography
          variant={"body1"}
          component={"p"}
          className={styles.para}
          sx={{
            color: AppColors.black,
            fontSize: "12px",
            fontWeight: "300",
            paddingTop: "10px"
          }}
        >
          {`200 Calorie Snacks `}
        </Typography>
      </div>
    </div>
  )
}
SnackBox.propTypes = {
  snackCount: PropTypes.number
}
