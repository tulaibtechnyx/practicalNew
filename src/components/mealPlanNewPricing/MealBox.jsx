import React, { useState, useEffect, useRef } from "react"
import { Typography } from "@mui/material"
import Slider from "react-slick"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import $ from "jquery"
import AppLogger from "helpers/AppLogger"
export default function MealBox({
  meal,
  mealIndex,
  onAfterChange,
  result,
  meals
  // currentType
}) {
  const calorieList = [400, 500, 600, 700, 800]
  const [currentActiveIndex, setCurrentActiveIndex] = useState(1)
  const [showSlider, setShowSlider] = useState(false)

  const sliderRef = useRef()
  useEffect(() => {
    indexFinder()
    $(".style_mealBoxWrapper___b_K2").on("touchstart", function () {
      $("body").addClass("touched")
    })

    $("div").on("touchend", function () {
      $("body").removeClass("touched")
    })

    // $(".style_mealBoxWrapper___b_K2").hover(
    //   function () {ƒ
    //     $("body").addClass("hovered")
    //   },
    //   function () {
    //     $("body").removeClass("hovered")
    //   }
    // )
  }, [meals])
  useEffect(() => {
    AppLogger("This is called=============", currentActiveIndex)
    if (sliderRef) {
      sliderRef?.current?.slickGoTo(currentActiveIndex)
    }
  }, [currentActiveIndex])

  const indexFinder = () => {
    setShowSlider(false)
    const currentActive = calorieList.findIndex((val) => val == meal)
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
          {`Meal ${mealIndex}`}
        </Typography>
      </div>
      <div className={styles.mealBox}>
        {showSlider && (
          <Slider
            // ref={sliderRef}
            afterChange={(e) => onAfterChange(calorieList[e])}
            arrows={true}
            initialSlide={currentActiveIndex} // ✅ Correct prop
            fade={false}
            dots={false}
            vertical={true}
            slidesToShow={1}
            centerMode={false}
            swipeToSlide={true}
            infinite={true}
            verticalSwiping={true}
          >
            {calorieList.map((mealData, index) => {
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
                    {"Calorie meal"}
                  </Typography>
                </div>
              )
            })}
          </Slider>
        )}
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
          {`Calorie Meal`}
        </Typography>
      </div>
    </div>
  )
}

MealBox.propTypes = {
  meal: PropTypes.any,
  mealIndex: PropTypes.any,
  onAfterChange: PropTypes.any
}
