import React, { useState, useEffect } from "react"
import { Typography } from "@mui/material"
import styles from "./style.module.scss"
import SnackBox from "./SnackBox"
import MealBox from "./MealBox"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import AppLogger from "../../helpers/AppLogger"
import PreferencesSlider from "components/mealBox/PreferencesSlider"
import Tooltip from "@mui/material/Tooltip"
import Reset from "../../../public/images/icons/reset.svg"
import clsx from "clsx"
const MealPlan = ({
  snacks,
  meals,
  day,
  dataRec,
  updateMeal,
  mealIndex,
  updateSnacks,
  protiens,
  onResetClick,
  result,
  totalCalories,
  changed,
  isResultPage,
  resetLoader=false
}) => {

  useEffect(() => {
    totalCaloriesHandler()
  }, [meals])

  const totalCaloriesHandler = () => {
    try {
      var total = 0
      for (let index = 0; index < meals.length; index++) {
        const element = meals[index]
        total = total + element
      }

      for (let i = 0; i < snacks.length; i++) {
        const snack = snacks[i]
        total = total + snack
      }
    } catch (error) {
      AppLogger("Error at totalCaloriesHandler", error)
    }
  }

  return (
    <div className="mealPlanScreen">
      <div
        className={
          isResultPage
            ? clsx(styles.planBoxWrapper, styles.sty2)
            : styles.planBoxWrapper
        }
      >
        <div
          className={
            isResultPage
              ? clsx(styles.BoxWrapper, styles.sty2)
              : styles.BoxWrapper
          }
        >
          {isResultPage ? null : (
            <div className={styles.mealText}>
              {dataRec?.mealPlan?.heading && (
                <Typography variant={"h2"} className={styles.heading}>
                  {dataRec?.mealPlan?.heading}
                </Typography>
              )}
              {dataRec?.mealPlan?.para && (
                <Typography
                  variant={"body3"}
                  component={"p"}
                  className={styles.para}
                >
                  {dataRec?.mealPlan?.para}
                </Typography>
              )}
            </div>
          )}

          <div className={styles.mealPlanWrapper}>
            {/* <div className={styles.mealIcon}>
              <img src={dataRec?.mealPlan?.img} />
            </div> */}
            {/* <div className={styles.mealPlanText}>
              {day && (
                <Typography variant={"h2"} className={styles.heading}>
                  {`${day} Week Meal Plan`}
                </Typography>
              )}
            </div> */}
            <div className={styles.mealContentBoxWrapper}>
              {meals.length >= 0 &&
                meals.map((meal, index) => {
                  return (
                    <MealBox
                      resetLoader={resetLoader}
                      onAfterChange={(e) => {
                        console.log("this is event=======", e)
                        updateMeal(e, index)
                      }}
                      mealIndex={index + 1}
                      key={index+meal}
                      meals={meals}
                      meal={meal}
                    />
                  )
                })}
              {snacks && snacks.length >= 0 && (
                <>
                  <SnackBox
                    snackCount={snacks?.length}
                    updateMeal={(e, ref) => updateSnacks(e, ref ?? null)}
                  />
                  {isResultPage ? (
                    <>
                      {changed ? (
                        <div onClick={()=>resetLoader?null:onResetClick()} className="resultReset"
                          style={{
                            filter:resetLoader?"grayscale(0.7)":"none"
                          }}
                        >
                          <Reset />
                          <Typography
                            sx={{
                              fontSize: "10px",
                              fontWeight: "600",
                              color: AppColors.primaryGreen
                            }}
                          >
                            Reset
                          </Typography>
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </>
              )}
            </div>

            {!isResultPage ? (
              <>
                {dataRec?.mealPlan?.totalCalories && (
                  <div className={styles.countText}>
                    <Typography
                      variant={"body3"}
                      component={"p"}
                      className={styles.para}
                    >
                      {dataRec?.mealPlan?.totalCalories}
                    </Typography>
                  </div>
                )}
                <div className={styles.quantityBox}>
                  {totalCalories && (
                    <div className={styles.quantityBoxContent}>
                      <Typography
                        variant={"h1"}
                        className={styles.heading}
                        sx={{
                          fontSize: "32px",
                          color: AppColors.primaryGreen,
                          fontFamily: "AWConquerorInline"
                        }}
                      >
                        {`${totalCalories} CALORIES `}
                      </Typography>
                      {changed && (
                        <div onClick={onResetClick} className={styles.reset}>
                          <Reset />
                          <Typography
                            sx={{
                              fontSize: "10px",
                              fontWeight: "600",
                              color: AppColors.primaryGreen
                            }}
                          >
                            Reset
                          </Typography>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className={styles.proteinPara}>
                  <div className={styles.text}>
                    {protiens && (
                      <Typography
                        variant={"body3"}
                        component={"p"}
                        className={styles.para}
                        sx={{
                          color: AppColors.primaryGreen
                        }}
                      >
                        Includes at least <span>{`${protiens}g`}</span> of
                        Protein
                      </Typography>
                    )}
                  </div>
                  <Tooltip
                    leaveTouchDelay={10000000}
                    enterTouchDelay={50}
                    title="All of our Calorie-Counted & Macro-Balanced Meals are designed so that 25% of the Calories come from Protein. Our aim is that you enjoy a wide selection of delicious food options confident in the knowledge that no matter which one you choose you will not missing out on this crucial macro-nutrient."
                    placement="top"
                    arrow
                  >
                    <div className={styles.img}>
                      <Typography
                        variant={"body3"}
                        component={"p"}
                        className={styles.para}
                        sx={{
                          fontSize: "10px !important",
                          color: AppColors.white
                        }}
                      >
                        i
                      </Typography>
                    </div>
                  </Tooltip>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
MealPlan.propTypes = {
  dataRec: PropTypes.any,
  day: PropTypes.string,
  meals: PropTypes.array,
  snacks: PropTypes.array,
  totalCalories: PropTypes.number,
  updateMeal: PropTypes.func
}
export default MealPlan
