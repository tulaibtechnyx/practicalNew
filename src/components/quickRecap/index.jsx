import React from "react"
import styles from "./style.module.scss"
import Typography from "@mui/material/Typography"
import AppColors from "helpers/AppColors"
import clsx from "clsx"
import AppRoutes from "../../helpers/AppRoutes"
import Tooltip from "@mui/material/Tooltip"
import { Button } from "@mui/material"

const QuickRecap = ({
  yourUsualData,
  toBeDeliveredByPracticalData,
  portionSize,
  currentQuizType,
  isExecutive=false,
}) => {
  return (
    <div className={styles.QuickRecap}>
      <div className={styles.wrapper}>
        <div className={styles.textAreaWrap}>
          <div className={styles.contentWrap}>
            <div className={styles.Text}>
              <Typography variant="h2" className={styles.heading}>
                Quick Recap of your selection:
              </Typography>
              {currentQuizType == "quiz_a" ? (
                <>
                  <Typography
                    variant="body3"
                    component="p"
                    sx={{ fontWeight: "500" }}
                    className={styles.SMheading}
                  >
                    You usually have:
                    <div
                      className={styles.Btn}
                      style={{
                        marginLeft: "5px",
                        marginTop: "-9px"
                      }}
                    >
                      <Tooltip
                        leaveTouchDelay={10000000}
                        enterTouchDelay={50}
                        arrow
                        title="This small section is about the number of Meals & Snacks you told us you usually have in a day."
                        className="toolTip sty2 style"
                        style={{
                          width: "18px",
                          height: "18px",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <Button sx={{ fontSize: "12px" }}>
                          <span className="sm">i</span>
                        </Button>
                      </Tooltip>
                    </div>
                  </Typography>
                </>
              ) : null}
            </div>
            {currentQuizType == "quiz_a" ? (
              <div className={styles.MealType}>
                <div className={styles.mealStyle}>
                  <Typography
                    variant="body3"
                    component="p"
                    className={styles.Number}
                    color={AppColors.white}
                  >
                    {yourUsualData ? yourUsualData.averageMealsDay : ""}
                  </Typography>
                  <div className={styles.mealDetail}>
                    <Typography variant="body3" component="p">
                      {yourUsualData.averageMealsDay == 1
                        ? "Meal a Day"
                        : "Meals a Day"}
                    </Typography>
                  </div>
                </div>
                <div className={styles.mealStyle}>
                  <Typography
                    variant="body3"
                    component="p"
                    className={clsx(styles.Number, styles.sty1)}
                    color={AppColors.white}
                  >
                    {yourUsualData ? yourUsualData.averageSnacksDay : ""}
                  </Typography>
                  <div className={styles.mealDetail}>
                    <Typography variant="body3" component="p">
                      {yourUsualData.averageSnacksDay == 1
                        ? "Snack a Day"
                        : "Snacks a Day"}
                    </Typography>
                  </div>
                </div>
              </div>
            ) : null}
            {isExecutive ? <Typography
              component="p"
              variant="body3"
              sx={{ fontWeight: "500" }}
              className={styles.midHead}
            >
             To be delivered to your workplace by PractiCal Executive:
            </Typography>
           :
           <Typography
              component="p"
              variant="body3"
              sx={{ fontWeight: "500" }}
              className={styles.midHead}
            >
              To be delivered by PractiCal
            </Typography>  
          }
            <div className={clsx(styles.MealType, styles.sty1)}>
              <div className={styles.mealStyle}>
                <Typography
                  variant="body3"
                  component="p"
                  className={styles.Number}
                  color={AppColors.white}
                >
                  {toBeDeliveredByPracticalData
                    ? toBeDeliveredByPracticalData.AllMeals
                    : ""}
                </Typography>
                <div className={styles.mealDetail}>
                  <Typography variant="body3" component="p">
                    {toBeDeliveredByPracticalData.AllMeals == 1
                      ? " Meal a Day"
                      : " Meals a Day"}
                  </Typography>
                </div>
              </div>
              <div className={styles.mealStyle}>
                <Typography
                  variant="body3"
                  component="p"
                  className={clsx(styles.Number, styles.sty1)}
                  color={AppColors.white}
                >
                  {toBeDeliveredByPracticalData
                    ? toBeDeliveredByPracticalData.AllSnacks
                    : ""}
                </Typography>
                <div className={styles.mealDetail}>
                  <Typography variant="body3" component="p">
                    {toBeDeliveredByPracticalData.AllSnacks == 1
                      ? "Snack a Day"
                      : "Snacks a Day"}
                  </Typography>
                </div>
              </div>
              <div className={styles.mealStyle}>
                <Typography
                  variant="body3"
                  component="p"
                  className={styles.Number}
                  color={AppColors.white}
                >
                  {toBeDeliveredByPracticalData
                    ? toBeDeliveredByPracticalData.AllDays
                    : ""}
                </Typography>
                <div className={styles.mealDetail}>
                  <Typography variant="body3" component="p">
                    {toBeDeliveredByPracticalData.AllDays == 1
                      ? "Day a Week for"
                      : "Days a Week for"}
                  </Typography>
                </div>
              </div>
              <div className={styles.mealStyle}>
                <Typography
                  variant="body3"
                  component="p"
                  className={styles.Number}
                  color={AppColors.white}
                >
                  {toBeDeliveredByPracticalData
                    ? toBeDeliveredByPracticalData.AllWeeks
                    : ""}
                </Typography>
                <div className={styles.mealDetail}>
                  <Typography variant="body3" component="p">
                    {toBeDeliveredByPracticalData.AllWeeks == 1
                      ? "Week"
                      : "Weeks"}
                  </Typography>
                </div>
              </div>
            </div>
            <Typography variant="body3" component="p" className={styles.quiz}>
              Want to re-do the Quiz? No worries, click{" "}
              <a
                href={
                  isExecutive ? AppRoutes.home :  currentQuizType == "quiz_a" ? AppRoutes.home : AppRoutes.quizB
                }
              >
                here
              </a>
            </Typography>
          </div>
        </div>
        <div className={styles.textAreaWrap}>
          <div className={styles.contentWrap}>
            <div className={styles.Text}>
              <Typography variant="h2" className={styles.heading}>
                Your Perfect Portion size
              </Typography>
              <Typography variant="body3" component="p">
                To keep things easy, we recommend that each of your meals
                contains:
              </Typography>
            </div>
            <div className={styles.caloriesBox}>
              <Typography variant="h2" className={styles.heading}>
                {portionSize ?? ""} CALORIES
              </Typography>
            </div>
            <Typography
              variant="body3"
              className={styles.portionPara}
              component="p"
            >
              This is so you can swap between meals whenever you want & don’t
              have to worry about the calories changing.
            </Typography>
            <Typography
              variant="body3"
              className={styles.portionPara}
              component="p"
            >
              It should be a size that is comfortable for you to eat. Not too
              little, not too much.
            </Typography>
            <Typography
              variant="body3"
              className={styles.portionPara}
              component="p"
            >
              Want to adjust your portion size, don’t worry, you can adjust this
              easily below!
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickRecap
