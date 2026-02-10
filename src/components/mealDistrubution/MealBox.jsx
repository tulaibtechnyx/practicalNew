import React, { useState, useEffect } from "react"
import Button from "@mui/material/Button"
import { Box, Popover, Typography, useMediaQuery } from "@mui/material"
import styles from "./style.module.scss"
import SwapIcon from "../../../public/images/meal/swap.svg"
import Meal from "./Meal"
import moment from "moment"
import PropTypes, { number } from "prop-types"
import clsx from "clsx"
import AppColors from "helpers/AppColors"
import AppLogger from "../../helpers/AppLogger"
import { animateScroll as scroll } from "react-scroll"
import { useSelector } from "react-redux"
import get from "lodash/get"
import AppConstants from "../../helpers/AppConstants"
import { useRouter } from "next/router"
import { useDispatch } from "react-redux"
import {
  StartUpRequest,
  UpcomingOrdersRequest,
  getRenewedPlanRequest
} from "../../store/reducers/dashboardReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import { customTimeout } from "helpers/ShortMethods"
import CountDownTimerWithSeconds from "./CountDownTimerWithSeconds"
import CountDownBoxTimer from "./CountDownBoxTimer"
import CustomButton from "@components/CustomButton"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { dfjac } from "@components/popUp/commonSX"
import { saveOrderId } from "../../store/reducers/ordersReducer"
import { prevPlanActiveChecker } from "@helpers/CommonFunc"
import CustomTooltip from "@components/CustomTooltip"
import Loader2 from "@components/loader/Loader2"

export default function MealBox({
  mealData,
  pauseClick,
  revertPauseClick,
  id,
  allDates,
  weekChanged,
  currentWeek,
  loading,
  currentDate,
  currentSlide,
  isRenewedPlan,
  totalDays,
  isOrderReady,
  firstOpenDate,
  weekCopied,
  setWeekCopied,
  AddItemsBool=false,
  setAddItems=()=>{},
  setValue=()=>{},
  setMealDate=()=>{},
}) {
  const [dailyTotal, setDailyTotal] = useState({
    calories: 0,
    protien: 0,
    carbs: 0,
    fats: 0
  })

  const { startUpData,orderHistory } = useSelector((state) => state.home)
  const { orders, renewalData } = useSelector((state) => state.home)
  const userData = useSelector((state) => state.auth.userDetails)

  const [currentActiveIndex, setCurrentActiveIndex] = useState(-1)
  const [weekStatus, setWeekStatus] = useState(false)
  const [startUpDataLocal, setStartUpDataLocal] = useState(null)
  const thresHoldDate = get(startUpDataLocal, "threshold_day", new Date())
  const [renewalDataLocal, setRenewalDataLocal] = useState(false)
  const [thresHoldDateLocal, setThresholdDateLocal] = useState(null)
  const [swappedScroll, setSwappedScroll] = useState(null)
  const [APIloading, setAPILoading] = useState(false)
  const router = useRouter()

  const renewalOrderId = get(renewalDataLocal, "order_id", null)
  const renewalUserId = get(renewalDataLocal, "user_id", null)
  const token = get(userData, "data.auth_token", null)

  const dispatch = useDispatch()

  useEffect(() => {
    if (startUpDataLocal) {
      setThresholdDateLocal(startUpDataLocal.threshold_day.split("T")[0])
      // setThresholdDateLocal('2025-01-22T18:03:29'.split("T")[0])
    }
  }, [startUpDataLocal])

  useEffect(() => {
    if (startUpData) {
      setStartUpDataLocal(startUpData)
    }
  }, [startUpData])

  useEffect(() => {
    if (renewalData) {
      setRenewalDataLocal(renewalData)
    }
  }, [renewalData])

  useEffect(() => {
    currentWeekHandler()
  }, [orders, weekChanged])

  useEffect(() => {
    dailyCountHandler()

    // pausePassDisabledHandler()
  }, [mealData])
  useEffect(() => {
    if (currentActiveIndex !== -1 && currentActiveIndex !== 0) {
      if (weekStatus) {
        scrollFn(currentActiveIndex)
      } else {
        return
      }
    }
  }, [currentActiveIndex, weekStatus])

  const currentWeekHandler = () => {
    try {
      const currentIndex = orders.findIndex(
        (val) => val.is_current_week == true
      )

      if (currentIndex !== -1) {
        const currentOrder = orders[currentIndex]

        setWeekStatus(true)
        // handleClick(currentOrder.title, currentIndex)
      } else {
        setWeekStatus(false)
      }
    } catch (err) {
      AppLogger("This is error at currentWeekHandler=======", err)
    }
  }
  const dailyCountHandler = () => {
    try {
      const { data } = mealData
      let totalCalories = 0
      let totalFats = 0
      let totalCarbs = 0
      let totalProtiens = 0
      for (let index = 0; index < data.length; index++) {
        totalCalories = ( data[index].addon_id ? totalCalories + 0 : typeof data[index].calories == 'number' && totalCalories + data[index].calories)
        totalFats = data[index].fats ? typeof data[index].fats == 'number' &&  totalFats + data[index].fats : totalFats + 0;
        totalCarbs = data[index].carbs ? typeof data[index].carbs == 'number' && totalCarbs + data[index].carbs : totalCarbs + 0;
        totalProtiens = data[index].proteins ? typeof data[index].proteins == 'number' && totalProtiens + data[index].proteins : totalProtiens + 0;
        if (data[index]?.is_extra_proteins) {
          totalCalories =
            totalCalories + data[index]?.extra_protein_calories ?? 0
          totalFats = totalFats + data[index]?.extra_protein_fats ?? 0
          totalCarbs = totalCarbs + data[index]?.extra_protein_carbs ?? 0
          totalProtiens = totalProtiens + +data[index]?.extra_proteins_gram ?? 0
        }
      }

      setDailyTotal({
        calories: totalCalories,
        protien: totalProtiens,
        carbs: totalCarbs,
        fats: totalFats
      })
    } catch (err) {
      AppLogger("Error at dailyCountHandler", err)
    }
  }
  const swapDisabler = () => {
    const currentDate = new Date(mealData.date)
    const today = new Date(thresHoldDateLocal)

    if (currentDate < today) {
      return true
    } else {
      return false
    }
  }

  const pausePassDisabledHandler = () => {
    const currentDate = new Date(mealData.date)
    const today = new Date(thresHoldDateLocal)

    if (currentDate < today) {
      return true
    }

    else {
      return false
    }
  }

  useEffect(() => {
    if (allDates) {
      findCurrentDate(allDates)
    }
  }, [allDates])
  function findCurrentDate(datesArray) {
    try {
      const today = new Date()
      const currentMonth = today.getMonth() + 1
      const currentDate = `${today.getFullYear()}-${currentMonth < 10 ? "0" + currentMonth : currentMonth
        }-${today.getDate() < 10 ? "0" + today.getDate() : today.getDate()}`
      let resultIndex = -1

      for (let i = 0; i < datesArray.length; i++) {
        if (datesArray[i] >= currentDate) {
          resultIndex = i
          break
        }
      }

      setCurrentActiveIndex(resultIndex)
      return resultIndex
    } catch (err) {
      AppLogger("this is erorr", err)
    }
  }

  const scrollFn = (indexToScroll) => {
    try {
      const element = document.getElementById(`wrapperIndex${indexToScroll}`)
      // console.log("element", element)
      if (element) {
        customTimeout(() => {
          scroll.scrollTo(element.offsetTop + 120)
        }, 1000)
      }
    } catch (err) {
      console.log("this is  err====", err)
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSwappedScroll(JSON.parse(localStorage.getItem("currentScroll")))
    }
  }, [router.isReady])

  useEffect(() => {
    if (typeof swappedScroll == "number") {
      customTimeout(() => {
        scroll.scrollTo(swappedScroll, {
          duration: 50
        })
        localStorage.removeItem("currentScroll")
      }, [250])
    }
  }, [swappedScroll])

  // useEffect(() => {
  //   const obj = swappedOrderId
  //   if (obj) {
  //     const { orderId } = obj
  //     if (orderId) {
  //       const item = itemRefs.current.find((ref) => ref.id === orderId)
  //       console.log(item, "ITEMMM")
  //       if (item && item.id == orderId) {
  //         item.ref.current?.scrollIntoView({ behavior: "smooth" })
  //         // localStorage.removeItem("swappedmeal")
  //       }
  //     }
  //   }
  // }, [swappedOrderId, mealData])

  const handleDays = (isNotPaused) => {
    try {
      if (totalDays) {
        if (isNotPaused && mealData?.day) {
          return `Delivery Day ${mealData?.day} of ${totalDays}`
        } else {
          return null
        }
      }
    } catch (error) {
      AppLogger("Error at handleDays", error)
    }
  }

  const checkLoader = () => {
    if (!isOrderReady && mealData?.is_pause == 1 && !loading) {
      return false
    }
    return true
  }

  const callUpcomingOrdersHandler = () => {
    try {
      if (token) {
        setAPILoading(true)
        dispatch(UpcomingOrdersRequest({ token }))
          .then(() => {
            setAPILoading(false)
          })
          .catch(() => {
            setAPILoading(false)
          })
      }
    } catch (error) {
      setAPILoading(false)
      AppLogger("Error at callUpcomingOrdersHandler", error)
    }
  }

  const callRenewedPlanHandler = () => {
    try {
      if (renewalUserId && renewalOrderId && token) {
        dispatch(
          getRenewedPlanRequest({
            token,
            user_id: renewalUserId,
            order_id: renewalOrderId
          })
        )
          .then(() => {
            setAPILoading(false)
          })
          .catch(() => {
            setAPILoading(false)
          })
      }
    } catch (error) {
      setAPILoading(false)
      AppLogger("Error at callRenewedPlanHandler", error)
    }
  }

  const callStartUpFilesHandler = () => {
    try {
      if (token) {
        dispatch(StartUpRequest({ token }))
          .then(unwrapResult)
          .then((response) => {
            AppLogger("Response at StartUpRequest", response)
          })
          .catch((error) => {
            AppLogger("Error at StartUpRequest", error)
          })
      }
    } catch (err) {
      AppLogger("Error at callStartUpFilesHandler", err)
    }
  }

  // useEffect(() => {
  //   if (APIloading) {
  //     document.querySelector("html").classList.add("nprogress-busy")
  //   } else {
  //     document.querySelector("html").classList.remove("nprogress-busy")
  //   }
  // }, [APIloading])

  const { isExecutive } = useSelector((state) => state.auth)

  // START => work to show timer functionality
  const matchesSmallMobile = useMediaQuery("(max-width:768px)");

  const DateIsInThreshold = pausePassDisabledHandler();
  const { ticker } = useSelector((state) => state.home)
  const tickerPaymentType = get(ticker, "payment_status", "")

  function checkToShowTimer(targetDate) {
    const now = moment(); // Get the current time
    // Will use when case occur commenting for now    
    const targetMoment = moment(targetDate);
    const currentDateWithCurrentTime = targetMoment
      .hour(now.hour())
      .minute(now.minute())
      .second(now.second());

    const diffInHours = currentDateWithCurrentTime.diff(thresHoldDateLocal, 'hours');
    // Check if the target date is within 48 hours from the start date;
    if (diffInHours <= 72) {
      return true
    } else {

      return false
    }
  }
  const showTimerComponent = () => {

    const currenDateNow = moment(thresHoldDateLocal);
    const myCurrentPlanMealDate = mealData?.date;

    // Check if the meal date is more than 2 days away
    const twoDaysBeforeMeal = moment(myCurrentPlanMealDate).clone().subtract(3, 'days');
    if (currenDateNow < twoDaysBeforeMeal) {
      return false; // Too early to show the timer
    }
    if (DateIsInThreshold) {
      return true
    } else {

      if (firstOpenDate && startUpData?.threshold_day && checkToShowTimer(myCurrentPlanMealDate, firstOpenDate)) {
        return true
      } else {
        return false
      }
    }
  }
  const [timerPaused, setTimerPaused] = useState("")

  function TimePasssed() {
    if (tickerPaymentType == 'unpaid') {
      setTimerPaused(false)
    }
    try {
      const now = moment(); // Get the current time
      let thresholdDate = moment(thresHoldDateLocal).hour(AppConstants?.practiCalDayEndTime).minute(0).second(0);
      const currentMealDateWithCurrentTime = moment(mealData?.date)
        .hour(now.hour())
        .minute(now.minute())
        .second(now.second());
      if (currentMealDateWithCurrentTime?.isBefore(thresholdDate, 'day')) {
        setTimerPaused(true)
      } else {
        setTimerPaused(false)
      }
    } catch (e) { console.log(e) }
  }

  useEffect(() => {
      if(thresHoldDateLocal && mealData?.date){
        TimePasssed()
      }else{
        setTimerPaused(true)
      }
  }, [thresHoldDateLocal, mealData?.date])

  const prevActivePlanChecker = prevPlanActiveChecker(orderHistory)
  // work to show timer functionality <= END
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

  
  const reOrderedData = reorderMeals(mealData?.data);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDisabledClick = (event) => {
      setAnchorEl(event.currentTarget);
      setTimeout(() => setAnchorEl(null), 2000); // Tooltip auto-closes after 2s
  };

  function shouldShowDesktopTimer() {
  // Show timer if:
  // - Not on a small mobile device
  // - Timer component should be shown (business logic)
  // - Previous active plan exists
  // - Meal data has a date
  // - Timer paused state is set (not empty string)
  // - Threshold date is available
  return (
    !matchesSmallMobile &&
    showTimerComponent() &&
    prevActivePlanChecker &&
    mealData?.date &&
    timerPaused !== '' &&
    thresHoldDateLocal
  );
}
function shouldShowMobileTimer() {
  /**
   * Determines if the timer should be shown on small mobile devices.
   * Returns true if:
   * - The device is a small mobile
   * - The timer component should be shown (business logic)
   * - There is a previous active plan
   * - The meal data has a date
   * - The timerPaused state is set (not empty string)
   * - The threshold date is available
   */
  return (
    matchesSmallMobile &&
    showTimerComponent() &&
    prevActivePlanChecker &&
    mealData?.date &&
    timerPaused !== '' &&
    thresHoldDateLocal
  );
}

  return (
    <>
      <div style={{
        minHeight: matchesSmallMobile && tickerPaymentType != 'unpaid'? '64px' : '0px'
      }} >

        {
          shouldShowMobileTimer() &&
          // matchesSmallMobile &&
          <CountDownBoxTimer
            thresHoldDateLocal={thresHoldDateLocal}
            StartDateTime={mealData?.date}
            mobileMode={true}
            timerPaused={timerPaused}
            setTimerPaused={setTimerPaused}
            currentSlide={currentSlide}
          />
        }
      </div>
      <div
        className={clsx(
          styles.mealDistrubutionBox,
          id == currentActiveIndex && id !== 0 ? styles.sty2 : null
        )}
        id={`wrapperIndex${id}`}
        name="arrow"
        style={{border:matchesSmallMobile && weekCopied?.includes(currentWeek)&&`1px solid ${AppColors.yellow}`}}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%'
        }}>
          <div className={clsx(styles.titleBar,
            weekCopied?.includes(currentWeek) && styles.weekCopied
          )}>
            <div className={styles.barTitle} >
              <Typography
                variant={"h2"}
                className={styles.heading}
                sx={{ color: AppColors.white }}
              >
                {moment(mealData?.date).format(AppConstants.dateFormat)}
                &nbsp;&nbsp;
                <span>{handleDays(mealData?.is_pause == 0 ? true : false)}</span>
              </Typography>
            </div>
          
            {
              // !timerPaused &&
              <AddItemBtn
              disabled={timerPaused}
                onClick={() => {
                  dispatch(
                    saveOrderId({
                      orderId: mealData?.data?.[0]?.id,
                      orderCalories: mealData?.data?.[0]?.base_calories,
                      orderType: mealData?.data?.[0]?.type,
                      customMeal: null,
                      parentOrderId: mealData?.data?.[0]?.order_id
                    })
                  ).then(unwrapResult).then(()=>{
                    setMealDate(mealData?.date)
                    setAddItems(true);
                    setValue(AppConstants?.TabValues?.ADD_ITEMS) 
                  }).catch((err)=>console.log(err))
              }}
                setAddItems={setAddItems}
                AddItemsBool={AddItemsBool}
                setValue={setValue}
                color={'white'}
                title={'Add items' }
                display={{xs:'flex',md:'none'}}
              />
            }
            {
              shouldShowDesktopTimer() &&
              // !matchesSmallMobile &&
              <CountDownBoxTimer
                thresHoldDateLocal={thresHoldDateLocal}
                StartDateTime={mealData?.date}
                timerPaused={timerPaused}
                setTimerPaused={setTimerPaused}
              />
            }
          </div>
        </div>
          {
               !isRenewedPlan &&
              <Box sx={{display:{ xs:'none', md:'flex' },justifyContent:'end',mt:'8px',mb:'-18px'}}>
                <CustomTooltip 
                 open={Boolean(anchorEl)}
                 anchorel={anchorEl}
                 onClose={() => setAnchorEl(null)}
                  title={timerPaused ? `This delivery's already cooking! No changes possible` : ''}>
                <Box
                onMouseEnter={e=>handleDisabledClick(e)}
                onMouseLeave={() => setAnchorEl(null)}
                display={{ xs:'none', md:'flex' }}
                onClick={(e) => {
                  if(timerPaused){
                    handleDisabledClick(e)
                    return
                  }
                  dispatch(
                       saveOrderId({
                         orderId: mealData?.data?.[0]?.id,
                         orderCalories: mealData?.data?.[0]?.base_calories,
                         orderType: mealData?.data?.[0]?.type,
                         customMeal: null,
                         parentOrderId: mealData?.data?.[0]?.order_id
                       })
                     ).then(unwrapResult).then(()=>{
                      setMealDate(mealData?.date)
                       setAddItems(true);
                       setValue(AppConstants?.TabValues?.ADD_ITEMS) 
                     }).catch((err)=>console.log(err))
                   }}
                sx={{
                  bgcolor: isExecutive ? AppColors.primaryOrange: AppColors.primaryGreen,
                  borderRadius:'22px',
                  display:'flex',flexDirection:'',
                  justifyContent:'center',
                  cursor:'pointer',
                  alignItems:'center',
                  gap:'8px',
                  p:'8px 10px 8px 8px',
                  opacity:timerPaused?'0.7':'none',
                  }} >
                  <img src="/images/icons/additemWite.svg" alt="add item" style={{height:'24px'}}  />
                  <Typography sx={{fontWeight:500,mt:'3px'}} textAlign={'center'}  color={'white'} fontSize={16} >Add Items</Typography>
                </Box>
                </CustomTooltip>
                
                {/* <AddItemBtn
                 onClick={() => {
                   dispatch(
                        saveOrderId({
                          orderId: mealData?.data?.[0]?.id,
                          orderCalories: mealData?.data?.[0]?.base_calories,
                          orderType: mealData?.data?.[0]?.type,
                          customMeal: null,
                          parentOrderId: mealData?.data?.[0]?.order_id
                        })
                      ).then(unwrapResult).then(()=>{
                        setAddItems(true);
                        setValue(AppConstants?.TabValues?.ADD_ITEMS) 
                      }).catch((err)=>console.log(err))
              }}
                  setAddItems={setAddItems}
                  AddItemsBool={AddItemsBool}
                  setValue={setValue}
                  color={AppColors.primaryGreen}
                  display={{ xs:'none', md:'flex' }}
                  title={'Add items to your meal'}
              /> */}
              </Box>
            }
        <div
          className={`${styles.mealDetailBoxWrapper} ${isExecutive ? styles.isExecutive : ""}`}
          style={{
            opacity: mealData?.is_pause == 1 ? 0.6 : "",
            pointerEvents: mealData?.is_pause == 1 ? "none" : "all"
          }}
        >
          {Array.isArray(reOrderedData) &&
            reOrderedData?.map((meal, index) => {
              return (
                <Meal
                  canDeleteMeal={swapDisabler() || timerPaused}
                  isAddonItem={meal?.type == AppConstants?.addon}
                  isAddonMealorSnack={ meal?.is_extra == 1}
                  isExecutive={isExecutive}
                  is_switch={meal?.is_switch}
                  currentWeek={currentWeek}
                  currentDate={currentDate}
                  currentSlide={currentSlide}
                  meal={meal}
                  callUpcomingOrdersHandler={callUpcomingOrdersHandler}
                  callRenewedPlanHandler={callRenewedPlanHandler}
                  callStartUpFilesHandler={callStartUpFilesHandler}
                  loading={APIloading}
                  disabled={pausePassDisabledHandler()}
                  disableSwap={swapDisabler() || mealData?.is_pause == 1 || timerPaused}
                  pauseStatus={mealData?.is_pause}
                  setLoading={setAPILoading}
                  key={index}
                  mealNumber={index + 1}
                  isRenewedPlan={isRenewedPlan}
                />
              )
            })}
            
        </div>
        <div
          className={clsx(styles.totalCalories, styles.sty2)}
          style={{ opacity: mealData?.is_pause == 1 ? 0.6 : "" }}
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
                {`${dailyTotal.calories} Calories`}
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
                    {`${dailyTotal.protien}g `}
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
                    {`${dailyTotal.carbs}g `}
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
                <div className={clsx(styles.caloriesBox, styles.stysmall)}>
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
                    {`${dailyTotal.fats}g `}
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
    </>
  )
}

MealBox.propTypes = {
  mealData: PropTypes.any
}

const AddItemBtn = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);

  const handleDisabledClick = (event) => {
    if (props?.disabled) {
      setAnchorEl(event.currentTarget);
      setTimeout(() => setAnchorEl(null), 2000); // Tooltip auto-closes after 2s
    }
  };

  return (
    <CustomTooltip 
    title={props?.disabled ? `This delivery's already cooking! No changes possible` : ''}
    arrow
    open={Boolean(anchorEl)}
        anchorel={anchorEl}
        onClose={() => setAnchorEl(null)}>
      <Box sx={{ display: props?.display,
        alignItems: 'center',
        gap: '8px',
        justifyContent: 'end',
        width: 'max-content',
        cursor: 'pointer',
        filter: props?.disabled ? 'grayscale(1)' : 'none',
        // pointerEvents: props?.disabled ? 'none' : 'all',
      }}
              onClick={(e)=>props?.disabled ? handleDisabledClick(e) : props?.onClick()}
          >
          <img src={props?.color == 'white' ? "/images/icons/roundPlusWhite.svg" : "/images/icons/roundPlus.svg"} />
          <Typography color={props?.color}>
              {props?.title}
          </Typography>
      </Box>
    </CustomTooltip>
  )
}