import React, { useState, useEffect } from "react"
import { Box, Typography } from "@mui/material"
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
import PlanPreferenceChanger from "@components/PlanPreferenceChanger"


const MealPlanNewPricing = ({
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
  resetLoader = false,
  promoDetails,
  resultData,
  resultDataRequest,
  handleInvalidPromoCode,
  loading = false,
  refForPreferenceChangeBox,
  setResultChangedStatus,
  isExecutive=false
}) => {
// console.log("promodetails on meal pricing",promoDetails)
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
    // <div className="mealPlanScreen" style={{
    //   border:'1px solid red'
    // }}>
    <div
      className={""
        //   isResultPage
        //     ? clsx(styles.planBoxWrapper, styles.sty2)
        //     : styles.planBoxWrapper
        // }
      }
    >
      <div
      // className={
      //   isResultPage
      //     ? clsx(styles.BoxWrapper, styles.sty2)
      //     : styles.BoxWrapper
      // }
      >
        {isResultPage ? (
          <>
            {changed ? (
              <Box onClick={() => resetLoader ? null : onResetClick()} className="resultReset"
                sx={{
                  filter: resetLoader ? "grayscale(0.7)" : "none",
                  display: 'flex',
                  justifyContent: 'end',
                  paddingRight:{md:'40px',xs:'0px'}
                }}
              >
                <Box>
                  <img src="images/icons/reset.svg" alt="reset" style={{ height: '20px' }} />
                  {/* <Reset  /> */}
                  <Typography
                    sx={{
                      fontSize: "10px",
                      fontWeight: "600",
                      color: AppColors.primaryGreen
                    }}
                  >
                    Reset
                  </Typography>
                </Box>
              </Box>
            ) : null}
          </>
        ) : null}
        {
          resetLoader ? 
          <Box className={styles.resetLoaderBox}>
            <Typography
              variant={"body2"}
              className={styles.resetLoaderText}
            >
              Resetting to your initial plan...
            </Typography>
          </Box>
          :
        <PlanPreferenceChanger
          isExecutive={isExecutive}
          resultDataRequest={resultDataRequest}
          resultData={resultData}
          handleInvalidPromoCode={handleInvalidPromoCode}
          loading={loading}
          promoDetails={promoDetails}
          refForPreferenceChangeBox={refForPreferenceChangeBox}
          setResultChangedStatus={setResultChangedStatus}
        />
        }

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
    // </div>
  )
}
MealPlanNewPricing.propTypes = {
  dataRec: PropTypes.any,
  day: PropTypes.string,
  meals: PropTypes.array,
  snacks: PropTypes.array,
  totalCalories: PropTypes.number,
  updateMeal: PropTypes.func
}
export default MealPlanNewPricing
