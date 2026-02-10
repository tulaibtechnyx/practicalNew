import React, { useEffect, useState } from "react"
import {
  pausePassRequest,
  revertPausePassRequest
} from "../../store/reducers/ordersReducer"
import { GetTickersRequest, StartUpRequest } from "../../store/reducers/dashboardReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import { useSelector, useDispatch } from "react-redux"
import PropTypes from "prop-types"
import moment from "moment"
import Slider from "react-slick"
import styles from "./style.module.scss"
import MealBox from "./MealBox"
import PausePopup from "./PausePopup"
import AppLogger from "helpers/AppLogger"
import { useRouter } from "next/router"
import { calculateTotalDays, customTimeout } from "../../helpers/ShortMethods"
import { showFaliureToast } from "helpers/AppToast"
import AppConstants from "helpers/AppConstants"
import { Box, CircularProgress, Typography } from "@mui/material"
import { get } from "lodash"
import AppColors from "@helpers/AppColors"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import dynamic from 'next/dynamic'; 
import ThemeLoader from "@components/ThemeLoader"
const DynamicMealBox = dynamic(() => import('./MealBox'), {
  ssr: false,
  loading: () => null,
});
const MealDistrubution = ({
  currentWeek,
  updated,
  weekChanged,
  pastOrders,
  isRenewedPlan,
  isOrderReady,
  token,
  firstOpenDate,
  setFirstOpenDate,
  weekCopied,
  setWeekCopied,
  AddItemsBool=false,
  setAddItems=()=>{},
  setValue=()=>{},
  setMealDate=()=>{},
}) => {
  const dispatch = useDispatch()
  const { orders, renewedPlanOrders, ordersLoader, AddprotienLoader } = useSelector((state) => state.home)
  const { error } = useSelector((state) => state.orders)
  const { userDetails, isExecutive } = useSelector((state) => state.auth)
  const { userProfile } = useSelector((state) => state.profile)

  const [ordersData, setOrdersData] = useState(null)
  const [showPausePassModal, setShowPausePassModal] = useState(false)
  const [upComingLoader, setupComingLoader] = useState(false)
  const [pausePassError, setPausePassError] = useState("")
  const [allDates, setAllDates] = useState([])
  const [currentData, setCurrentDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [allDays, setAllDays] = useState(0)

  const router = useRouter()

  useEffect(()=>{
      setupComingLoader(ordersLoader)
  },[ordersLoader])

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof JSON.parse(localStorage.getItem("currentSlide")) == "number"
    ) {
      setCurrentSlide(JSON.parse(localStorage.getItem("currentSlide")))
    }
  }, [router.isReady])

  useEffect(() => {
    if (typeof JSON.parse(localStorage.getItem("currentSlide")) == "number") {
      customTimeout(() => localStorage.removeItem("currentSlide"), 1000)
    }
  }, [currentSlide])

  useEffect(() => {
    orderDataHandler()
  }, [currentWeek, orders, showPausePassModal, renewedPlanOrders])

  useEffect(() => {
    if (
      calculateTotalDays(
        isRenewedPlan ? renewedPlanOrders : orders,
        isRenewedPlan ? "renewal" : "upcoming"
      )
    ) {
      setAllDays(
        calculateTotalDays(
          isRenewedPlan ? renewedPlanOrders : orders,
          isRenewedPlan ? "renewal" : "upcoming"
        )
      )
    }
  }, [orders, renewedPlanOrders, userProfile])

  useEffect(() => {
    setPausePassError(error)
  }, [error])


  useEffect(() => {
    allDatesHandler()
  }, [ordersData])

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
      }
      // {
      //   breakpoint: 576,
      //   settings: {
      //     slidesToShow: 1
      //   }
      // }
    ]
  }

  const getTickersData = () => {
    const { auth_token } = userDetails?.data
    dispatch(GetTickersRequest({ token: auth_token }))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at getTickersData", res)
      })
      .catch((err) => {
        AppLogger("Error at getTickersData", err)
      })
  }

  const callStartUpFilesHandler = () => {
    try {
      const { auth_token } = userDetails?.data
      if (auth_token) {
        dispatch(StartUpRequest({ token: auth_token }))
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

  const orderDataHandler = () => {
    try {
      if (!isRenewedPlan) {
        if (orders.length > 0) {
          const currentWeekIndex = orders?.findIndex(
            (val) => val.title == currentWeek
          )
          if (currentWeekIndex !== -1) {
            const groups = orders?.[
              currentWeekIndex ? currentWeekIndex : 0
            ]?.data.reduce((groups, datee) => {
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
                data: groups[date],
                day: groups[date][0]?.day,
                index: index,
                currentWeek:currentWeek
              }
            })
            setOrdersData(groupArrays)
          } else {
            const groups = orders?.[0]?.data.reduce((groups, datee) => {
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
                data: groups[date],
                index: index,
                currentWeek:currentWeek

              }
            })
            setOrdersData(groupArrays)
          }
        }
      } else {
        if (renewedPlanOrders.length > 0) {
          const currentWeekIndex = renewedPlanOrders?.findIndex(
            (val) => val.title == currentWeek
          )
          if (currentWeekIndex !== -1) {
            const groups = renewedPlanOrders[
              currentWeekIndex ? currentWeekIndex : 0
            ]?.data.reduce((groups, datee) => {
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
          } else {
            const groups = renewedPlanOrders[0]?.data.reduce(
              (groups, datee) => {
                const date = moment(datee?.delivery_date).format("YYYY-MM-DD")
                if (!groups[date]) {
                  groups[date] = []
                }
                groups[date].push(datee)
                return groups
              },
              {}
            )

            // Edit: to add it in the array format instead
            const groupArrays = Object.keys(groups)?.map((date, index) => {
              return {
                date,
                is_pause: groups[date][0].is_pause,
                data: groups[date],
                day: groups[date][0]?.day,
                currentWeek:currentWeek

              }
            })
            setOrdersData(groupArrays)
          }
        }
      }
    } catch (error) {
      AppLogger("Error at orderDataHandler", error)
    }
  }

  const onPausePassClickHandler = (e) => {
    setCurrentDate(e?.date)
    setPausePassError("")
    setShowPausePassModal(true)
  }

  const pausePassHandler = () => {
    try {
      const { auth_token } = userDetails?.data
      const pauseData = { delivery_date: currentData }
      setLoading(true)
      dispatch(pausePassRequest({ token: auth_token, pauseData: pauseData }))
        .then(unwrapResult)
        .then((res) => {
          getTickersData()
          callStartUpFilesHandler()
          AppLogger("Response at pausePassRequest", res)
          setShowPausePassModal(false)
          updated()
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          showFaliureToast(err?.response?.data?.message)
          AppLogger("Error at pausePassRequest", err)
        })
    } catch (err) {
      AppLogger("Error at pausePassHandler", err)
    }
  }

  const reverPausePassHandler = (value) => {
    try {
      const { auth_token } = userDetails?.data
      const pauseData = { delivery_date: value?.date }
      setLoading(true)
      dispatch(
        revertPausePassRequest({ token: auth_token, pauseData: pauseData })
      )
        .then(unwrapResult)
        .then((res) => {
          AppLogger("Response at revertPausePassRequest", res)
          callStartUpFilesHandler()
          setShowPausePassModal(false)
          updated()
          setLoading(false)
        })
        .catch((err) => {
          showFaliureToast(err?.response?.data?.message)
          AppLogger("Error at revertPausePassRequest", err)
          setLoading(false)
        })
    } catch (err) {
      AppLogger("Error at pausePassHandler", err)
    }
  }

  const allDatesHandler = () => {
    const allDatess = []
    for (let index = 0; index < ordersData?.length; index++) {
      const element = ordersData?.[index]
      allDatess?.push(element?.date)
    }

    setAllDates(allDatess)
  }
  // START => work to show timer functionality
  const { startUpData } = useSelector((state) => state.home)
  const [thresHoldDateLocal, setThresholdDateLocal] = useState(new Date())

  useEffect(() => {
    if (startUpData) {
      setThresholdDateLocal(startUpData.threshold_day.split("T")[0])
    }
  }, [startUpData])
  const pausePassDisabledHandler = (mealData) => {
    const currentDate = new Date(mealData)
    const today = new Date(thresHoldDateLocal)
    if (currentDate < today) {
      return true
    }
    else {
      return false
    }
  }
  const filterMealData = () => {
    return ordersData?.filter((meal) => !pausePassDisabledHandler(meal.date));
  };
  useEffect(() => {
    if (!firstOpenDate) {
      const filteredDate = filterMealData();
      filteredDate?.length > 0 && setFirstOpenDate(filteredDate?.[0]?.date)
    }
  }, [startUpData, ordersData,startUpData?.threshold_day])

  const handleGoToEditPref = () => {
    try {
        localStorage.setItem("scrollToAllergy", "true"); 
            if (window !== "undefined") {
                if (window.handleGoToEP) window.handleGoToEP();
            }
    } catch (error) {
        console.log("Error redirecting", error);
    }
};


  // work to show timer functionality <= END
  return (
    <div className={`${styles.mealDistrubutionBoxWrapper} ${isExecutive ? styles.isExecutive : ""}`}>
      <PausePopup
        open={showPausePassModal}
        error={pausePassError}
        onPauseClick={pausePassHandler}
        handleClose={() => setShowPausePassModal(false)}
        date={currentData}
        loading={loading}
      />
      <Box sx={{minHeight:'70vh'}}>
      {
      //  AddprotienLoader || (upComingLoader && ordersData == null) ?
       AddprotienLoader || (upComingLoader) ?
        <Box sx={{ minHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" color={'GrayText'} className="loading" >
              Building your Meal Plan: In Progress
            </Typography>
            <Box sx={{
                    justifyContent: {md:'center',xs:'flex-start'},
                    alignItems: {md:'center',xs:'flex-start'},
                    alignContent:'center',
                    flexGrow: 1,      
                    width: '100%',
                    height:'100%',
                }}>
                    <ThemeLoader/>
                </Box>
            {/* <CircularProgress size={200}/> */}
            </Box>
        // upComingLoader == false && ordersData == null ?
        //  <Box sx={{width:'100%',textAlign:'center'}} >
        //       <Typography variant="h1" sx={{fontSize:'24px',fontWeight:'500',color:AppColors.primaryGreen}} >
        //         No Meals Available
        //       </Typography>
        //         <Box component={'span'} sx={{ color: AppColors?.primaryGreen, cursor: "pointer", ":hover": { textDecoration: 'underline' } }} onClick={
        //           ()=>{
        //             router.reload()
        //           }
        //         } >{' '}Refresh meals{' '}
        //         </Box>
        //   </Box>
        :
        ordersData?.length > 0 ? (
          <Slider
          afterChange={(newIndex) => setCurrentSlide(newIndex)}
          initialSlide={currentSlide}
          {...settings}
          lazyLoad="ondemand"
          onLazyLoad={() => {
          }}
        >
          {
          ordersData?.map((val, index) => {
            return (
              
                <DynamicMealBox
                  firstOpenDate={ordersData.filter((meal) => !pausePassDisabledHandler(meal.date))?.[0]?.date}
                  token={token}
                  currentDate={val?.date}
                  currentWeek={currentWeek}
                  currentSlide={currentSlide}
                  pastOrders={pastOrders}
                  updated={updated}
                  weekChanged={weekChanged}
                  pauseClick={onPausePassClickHandler}
                  revertPauseClick={reverPausePassHandler}
                  key={index}
                  id={index}
                  allDates={allDates}
                  mealData={val}
                  loading={loading}
                  isRenewedPlan={isRenewedPlan}
                  totalDays={allDays}
                  isOrderReady={isOrderReady}
                  weekCopied={weekCopied}
                  setWeekCopied={setWeekCopied}
                  setAddItems={setAddItems}
                  AddItemsBool={AddItemsBool}
                  setValue={setValue}
                  setMealDate={setMealDate}
                />
         
            )
          })}
        
          </Slider>
        )
        :
        Array.isArray(ordersData) && ordersData?.length <= 0 && 
          <Box sx={{width:'100%',textAlign:'center'}} >
              <Typography variant="h1" sx={{fontSize:'24px',fontWeight:'500',color:AppColors.primaryGreen}} >
                No Meals Available
              </Typography>
              <Typography variant="body2" sx={{my:3}}>
                Please change your preferences  
                <Box component={'span'} sx={{ color: AppColors?.primaryGreen, cursor: "pointer", ":hover": { textDecoration: 'underline' } }} onClick={
                  ()=>{
                    handleGoToEditPref()
                  }
                } >{' '}here{' '}
                </Box>
                to be able to get meals.
              </Typography>
          </Box>
      }
      </Box>
    </div>
  )
}
MealDistrubution.propTypes = {
  currentWeek: PropTypes.string
}

export default MealDistrubution;