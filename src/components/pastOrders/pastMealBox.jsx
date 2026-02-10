import React, { useState, useEffect } from "react"
import PastMeals from "./pastMeals"
import clsx from "clsx"
import styles from "./style.module.scss"
import { Typography } from "@mui/material"
import AppColors from "helpers/AppColors"
import Button from "@mui/material/Button"
import SwapIcon from "../../../public/images/meal/swap.svg"
import NoOrders from "../../../public/images/icons/no-order.svg"
import AppLogger from "../../helpers/AppLogger"
import moment from "moment"
import AppConstants from "../../helpers/AppConstants"
import RatingPopup from "../../components/popUp/ratingPop"
import { useDispatch, useSelector } from "react-redux"
import get from "lodash/get"
import { postFeedBackRequest } from "../../store/reducers/dashboardReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import Slider from "react-slick"

const PastMealBox = ({ allMeals, rateFunc, updated, totalDays , isExecutive}) => {
  const dispatch = useDispatch()
  const { userDetails } = useSelector((state) => state.auth)
  const [ordersData, setOrdersData] = useState([])
  const [userDetaislsLocal, setUserDetailsLocal] = useState(null)
  const [ratingValue, setRatingValue] = useState(0)
  const [currentMeal, setCurrentMeal] = useState(false)
  const [showRatePopup, setShowRatePopup] = useState(false)
  const token = get(userDetaislsLocal, "data.auth_token", "")

  useEffect(() => {
    orderDataHandler()
  }, [allMeals])

  useEffect(() => {
    if (userDetails) {
      setUserDetailsLocal(userDetails)
    }
  }, [userDetails])

  const orderDataHandler = () => {
    try {
      if (allMeals.length > 0) {
        // if (currentWeekIndex !== -1) {
        const groups = allMeals.reduce((groups, datee) => {
          const date = moment(datee?.delivery_date).format("YYYY-MM-DD")
          if (!groups[date]) {
            groups[date] = []
          }
          groups[date].push(datee)
          return groups
        }, {})

        // Edit: to add it in the array format instead
        const groupArrays = Object.keys(groups)?.map((date) => {
          return {
            date,
            is_pause: groups[date][0].is_pause,
            day: groups[date][0]?.day,
            data: groups[date]
          }
        })
        setOrdersData(groupArrays)
        AppLogger("This is groupsArray========", groupArrays)
      } else {
        const groups = allMeals.reduce((groups, datee) => {
          const date = moment(datee?.delivery_date).format("YYYY-MM-DD")
          if (!groups[date]) {
            groups[date] = []
          }
          groups[date].push(datee)
          return groups
        }, {})

        // Edit: to add it in the array format instead
        const groupArrays = Object.keys(groups)?.map((date, index) => {
          return {
            date,
            is_pause: groups[date][0].is_pause,
            data: groups[date]
          }
        })
        setOrdersData(groupArrays)
        AppLogger("This is groupsArray========", groupArrays)
      }
      // }
    } catch (error) {
      AppLogger("Error at orderDataHandler", error)
    }
  }

  const ratePressHandler = (id) => {
    setCurrentMeal(id)
    setShowRatePopup(true)
  }
  const onSubmitPressHandler = (mealData) => {
    dispatch(postFeedBackRequest({ token, mealData, currentMeal }))
      .then(unwrapResult)
      .then((res) => {
        updated()
        setShowRatePopup(false)
        setRatingValue(0)
        AppLogger("this is response at onSubmitPressHandler=======", res)
      })
      .catch((err) => {
        AppLogger("this  is  error at onSubmitPressHandler", err)
      })
    // rateFunc(values, currentMeal)
  }
  var settings = {
    dots: false,
    arrows: false,
    infinite: false,
    autoplay: false,
    slidesToShow: 50,
    slidesToScroll: 1,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  }

  const handleDays = (currentDay) => {
    try {
      if (totalDays) {
        if (currentDay) {
          return `Day ${currentDay} of ${totalDays}`
        } else {
          return null
        }
      }
    } catch (error) {
      AppLogger("Error at handleDays", error)
    }
  }
   function reorderMeals(meals) {
                const mainMeals = [];
                const extraMeals = [];
                const addonItems = [];
                const snacks = [];
                const snacksOther = [];
                let totalMeal = 1;
                let totalSnack = 1;
                let totalOther = 1;
                // Split meals into categories
                meals.forEach(item => {
                  if (item.is_extra != 1 && item.type == AppConstants.meal) {
                    mainMeals.push(item);
                  } if (item.type == AppConstants.addon) {
                    addonItems.push({...item, meal_count: totalMeal });
                    totalMeal ++
                  } if (item.is_extra == 1 && item.type == AppConstants.meal) {
                    extraMeals.push({...item, meal_count: totalOther});
                    totalOther++
                  } if (item.is_extra == 1 && item.type === AppConstants.snack) {
                    snacksOther.push({...item, meal_count: totalSnack});
                    totalSnack++
                  } if (item.is_extra != 1 && item.type === AppConstants.snack) {
                    snacks.push(item);
                  }
                });
              
                // Attach extras and addons to the last main meal
                const reordered = [
                  ...mainMeals,
                  ...extraMeals,
                  ...snacks,
                  ...snacksOther,
                  ...addonItems,
                ];
                return reordered;
              }
  return (
    <div className={styles.SliderWrappers}>
      <RatingPopup
      isExecutive={isExecutive}
        currentMeal={currentMeal}
        value={ratingValue}
        setValue={setRatingValue}
        submitPress={onSubmitPressHandler}
        open={showRatePopup}
        handleClose={() => {
          setShowRatePopup(false)
          setRatingValue(0)
        }}
        token={token}
      />
      <Slider {...settings}>
        {ordersData.length > 0 ? (
          ordersData.map((order, index) => {
            const { data } = order
            let totalCalories = 0
            let totalFats = 0
            let totalCarbs = 0
            let totalProtiens = 0
            for (let index = 0; index < data.length; index++) {
              totalCalories = ( data[index].addon_id ? totalCalories + 0 : typeof data[index].calories == 'number' && totalCalories + data[index].calories)
              // totalCalories = typeof data[index].calories == 'number' && totalCalories + data[index].calories
              totalFats = data[index].fats ? typeof data[index].fats == 'number' &&  totalFats + data[index].fats : totalFats + 0;
              totalCarbs = data[index].carbs ? typeof data[index].carbs == 'number' && totalCarbs + data[index].carbs : totalCarbs + 0;
              totalProtiens = data[index].proteins ? typeof data[index].proteins == 'number' && totalProtiens + data[index].proteins : totalProtiens + 0;
              if (data[index]?.is_extra_proteins) {
                totalCalories = totalCalories +
                  data[index]?.extra_protein_calories ?? 0
                totalFats =
                  totalFats + data[index]?.extra_protein_fats ?? 0
                totalCarbs =
                  totalCarbs+ data[index]?.extra_protein_carbs ?? 0
                totalProtiens =
                  totalProtiens +
                  +data[index]?.extra_proteins_gram ?? 0
              }
            }
           
            
            return (
              <React.Fragment key={index}>
                <div
                  // style={{ backgroundColor: mealData?.is_pause == 1 ? "#ddd" : "" }}
                  className={clsx(
                    styles.mealDistrubutionBox
                    //   id == currentActiveIndex && id !== 0 ? styles.sty2 : null
                  )}
                  id={`wrapperIndex${"1"}`}
                  name="arrow"
                >
                  <div className={styles.titleBar}>
                    <div className={styles.barTitle}>
                      <Typography
                        variant={"h2"}
                        className={styles.heading}
                        sx={{ color: AppColors.white }}
                      >
                        {/* Monday, Sept 1 */}
                        {moment(order.date).format(AppConstants.dateFormat)}
                        &nbsp;
                        {handleDays(
                          order?.day,
                          order?.is_pause == 0 ? true : false
                        )}
                      </Typography>
                    </div>
                  </div>
                  <div
                    className={styles.mealDetailBoxWrapper}
                    style={{ opacity: "mealData?.is_pause" == 1 ? 0.6 : "" }}
                  >
                    {reorderMeals(order?.data)?.map((meal, index) => {
                      return (
                        <PastMeals
                        isExecutive={isExecutive}
                        isAddonItem={meal?.type == AppConstants?.addon}
                        isAddonMealorSnack={meal?.is_extra == 1}
                          meal={meal}
                          rateFunc={ratePressHandler}
                          // disabled={pausePassDisabledHandler()}
                          // pauseStatus={mealData?.is_pause}
                          key={index}
                          mealNumber={index + 1}
                        />
                      )
                    })}
                  </div>
                  <div>
                    <div
                      className={clsx(styles.totalCalories, styles.sty2)}
                      style={{ opacity: "mealData?.is_pause" == 1 ? 0.6 : "" }}
                    >
                      <div className={`${styles.totalCaloriesBox} ${isExecutive ? styles.isExecutive : ""}`}>
                        <Typography
                          variant={"h3"}
                          className={styles.heading}
                          sx={{ fontSize: "12px" }}
                        >
                          {`Daily total from PractiCal${isExecutive ? " Executive" : ""}`}
                        </Typography>
                        <div className={styles.caloriesTotalBox}>
                          <Typography
                            variant={"h1"}
                            className={styles.heading}
                            sx={{
                              fontWeight: "400",
                              fontFamily: "AWConquerorInline",
                              color: AppColors.primaryGreen
                              // lineHeight: "1"
                            }}
                          >
                            {`${totalCalories ?? 0} Calories`}
                          </Typography>
                          <div className={styles.caloriesCountBox}>
                            <div className={styles.caloriesBox}>
                              <Typography
                                variant={"body3"}
                                sx={{
                                  textAlign: "center",
                                  display: "inline-block",
                                  fontSize: "10px",
                                  fontWeight: "500",
                                  color: AppColors.primaryGreen
                                }}
                                component="p"
                              >
                                {`${totalProtiens ?? 0}g `}
                              </Typography>
                              <Typography
                                variant={"body3"}
                                sx={{
                                  textAlign: "center",
                                  display: "inline-block",
                                  fontSize: "8px",
                                  color: AppColors.primaryGreen,
                                  fontWeight: "300"
                                }}
                                component="p"
                              >
                                Protein
                              </Typography>
                            </div>
                            <div className={styles.caloriesBox}>
                              <Typography
                                variant={"body3"}
                                sx={{
                                  textAlign: "center",
                                  display: "inline-block",
                                  fontSize: "10px",
                                  fontWeight: "500",
                                  color: AppColors.primaryGreen
                                }}
                                component="p"
                              >
                                {`${totalCarbs ?? 0}g `}
                              </Typography>
                              <Typography
                                variant={"body3"}
                                sx={{
                                  textAlign: "center",
                                  display: "inline-block",
                                  fontSize: "8px",
                                  color: AppColors.primaryGreen,
                                  fontWeight: "300"
                                }}
                                component="p"
                              >
                                Carbs
                              </Typography>
                            </div>
                            <div className={styles.caloriesBox}>
                              <Typography
                                variant={"body3"}
                                sx={{
                                  textAlign: "center",
                                  display: "inline-block",
                                  fontSize: "10px",
                                  fontWeight: "500",
                                  color: AppColors.primaryGreen
                                }}
                                component="p"
                              >
                                {`${totalFats ?? 0}g `}
                              </Typography>
                              <Typography
                                variant={"body3"}
                                sx={{
                                  textAlign: "center",
                                  display: "inline-block",
                                  fontSize: "8px",
                                  color: AppColors.primaryGreen,
                                  fontWeight: "300"
                                }}
                                component="p"
                              >
                                Fats
                              </Typography>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )
          })
        ) : (
          <div className={styles.pastOrder}>
            <NoOrders />
            <Typography variant="h1" color={AppColors.lightgray}>
              {" "}
              You don’t have <br />
              any past orders yet!
            </Typography>
          </div>
        )}
      </Slider>
    </div>
  )
}

export default PastMealBox
