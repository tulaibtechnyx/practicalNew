import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Tooltip, Typography, useMediaQuery } from "@mui/material"
import styles from "./weeksData.module.scss"
import Button from "@mui/material/Button"
import PropTypes from "prop-types"
import moment from "moment"
import AppColors from "helpers/AppColors"
import Nextmeal from "components/popUp/nextMealPop"
import AppConstants from "helpers/AppConstants"
import AppLogger from "../../helpers/AppLogger"
import { useRouter } from "next/router"
import get from "lodash/get"
import AppRoutes from "helpers/AppRoutes"
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CopyWeekModal from '../popUp/CopyWeekModal'
import ReplayIcon from '@mui/icons-material/Replay';
import { RevertMeals, UpcomingOrdersRequest } from "store/reducers/dashboardReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import { formatDate,findIdFromOrders } from "@helpers/CommonFunc";
import CustomTooltip from '@components/CustomTooltip'
import WeekButton from './WeekButton'
const WeekData = ({
  weekChange,
  past,
  startDateCheck,
  currentTab,
  isRenewedPlan,
  handleTabChange,
  isExecutive,
  weekCopied,
  setWeekCopied,
  handleChange =() =>{}
}) => {
  const matchesSmallMobile = useMediaQuery("(max-width:565px)");
  const { orders, renewalData, renewedPlanOrders } = useSelector(
    (state) => state.home
  )
  const { startUpData } = useSelector((state) => state.home)
  const { userDetails } = useSelector((state) => state.auth);
  const auth_token = userDetails?.data?.auth_token;
  const { userProfile } = useSelector((state) => state.profile)
  const [activeIndex, setActiveIndex] = useState(0)
  const [renewalDataLocal, setRenewalDataLocal] = useState(null)
  const [currentDate, setCurrentDate] = useState("")
  const [allOrders, setAllOrders] = useState([])
  const [orderDataLocal, setOrdersDataLocal] = useState([])
  const [renewedPlanOrdersLocal, setRenewedPlanOrdersDataLocal] = useState([])
  const [currentSwappedWeek, setCurrentSwappedIndex] = useState(null)
  const paymentStatus = get(renewalDataLocal, "order.payment_status", "")
  const order_id = findIdFromOrders(orders);
  const order_id_renewal = findIdFromOrders(renewedPlanOrders);
  const router = useRouter()
  const thresholdDate = startUpData?.threshold_day?.split("T")?.[0];
 
   const renewalOrderId = get(renewalDataLocal, "order_id", null)
   const renewalUserId = get(renewalDataLocal, "user_id", null)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentSwappedIndex(JSON.parse(localStorage.getItem("currentWeek")))
    }
  }, [router.isReady])

  useEffect(() => {
    currentOrderHandler()
  }, [])

  const handleActiveScroll = () => {
    if (currentSwappedWeek && !isRenewedPlan) {
      const currentIndex = orders.findIndex(
        (val) => val.title == currentSwappedWeek.currentWeek
      )
      if (currentIndex !== -1) {
        weekChange(orders[currentIndex].title)
        setActiveIndex(currentIndex)
        localStorage.removeItem("currentWeek")
      }
    }

    if (currentSwappedWeek && isRenewedPlan) {
      const currentIndex = renewedPlanOrders?.findIndex(
        (val) => val.title == currentSwappedWeek?.currentWeek
      )
      if (currentIndex !== -1) {
        weekChange(renewedPlanOrders[currentIndex].title)
        setActiveIndex(currentIndex)
        localStorage.removeItem("currentWeek")
      }
    }
  }

  useEffect(() => {
    handleActiveScroll()
  }, [currentSwappedWeek, isRenewedPlan])

  useEffect(() => {
    if (renewalData) {
      setRenewalDataLocal(renewalData)
    }
  }, [renewalData])

  useEffect(() => {
    if (isRenewedPlan) {
      setCurrentDate(renewalDataLocal?.meal_plan_start_date)
    }
  }, [renewalDataLocal, isRenewedPlan])

  useEffect(() => {
    if (userProfile && !isRenewedPlan) {
      setCurrentDate(userProfile?.profile?.meal_plan_start_date)
    }
  }, [userProfile])

  useEffect(() => {
    currentOrderHandler()
    if (orders) {
      setOrdersDataLocal(orders)
    }
    if (isRenewedPlan) {
      if (renewedPlanOrders) {
        setRenewedPlanOrdersDataLocal(renewedPlanOrders)
      }
    }
  }, [orders, renewedPlanOrders])

  useEffect(() => {
    if (!currentSwappedWeek && activeIndex == 0) {
      currentTabHandler()
    }
  }, [orderDataLocal, renewedPlanOrdersLocal])

  const currentTabHandler = () => {
    if (!isRenewedPlan) {
      if (orders && !past) {
        const currentOrderIndex = orders.findIndex((val) => val.data.length > 0)
        if (orders[0]?.data.length === 0 && currentOrderIndex !== -1) {
          const currentOrder = orders[currentOrderIndex]
          handleClick(currentOrder?.title, currentOrderIndex)
        }
      }

      if (orders && past) {
        const currentOrderIndex = orders.findIndex(
          (val) => val.past_data.length > 0
        )
        if (orders[0]?.past_data.length === 0 && currentOrderIndex !== -1) {
          const currentOrder = orders[currentOrderIndex]
          handleClick(currentOrder?.title, currentOrderIndex)
        } else {
          const currentOrder = orders[activeIndex]
          handleClick(currentOrder?.title, activeIndex)
        }
      }
    } else {
      if (renewedPlanOrders && !past) {
        const currentOrderIndex = renewedPlanOrders.findIndex(
          (val) => val.data.length > 0
        )
        if (
          renewedPlanOrders[0]?.data.length === 0 &&
          currentOrderIndex !== -1
        ) {
          const currentOrder = renewedPlanOrders[currentOrderIndex]
          handleClick(currentOrder?.title, currentOrderIndex)
        }
      }
    }
  }

  // useEffect(() => {
  //   currentWeekHandler()
  // }, [allOrders])

  const handleClick = (week, index) => {
    setActiveIndex(index)
    if (!isRenewedPlan) {
      weekChange(orders[index]?.title)
    } else {
      weekChange(renewedPlanOrders[index]?.title)
    }
  }

  const handlePastWeekClick = (week, index) => {
    setActiveIndex(index)
    weekChange(orders[index]?.title)
  }

  //ANCHOR - COMMENTED the useEffect call of this func b/c not needed anymore as per reqs
  const currentWeekHandler = () => {
    try {
      const currentIndex = orders.findIndex(
        (val) => val.is_current_week == true
      )

      if (currentIndex !== -1) {
        const currentOrder = orders[currentIndex]
        // AppLogger("this si order=====", currentOrder)
        handleClick(currentOrder?.title, currentIndex)
      } else {
        const currentOrder = orders[0]
        if (orders.length > 0) {
          handleClick(currentOrder?.title, 0)
        }
      }
    } catch (err) {
      AppLogger("this is error at currentWeekHandler====", err)
    }
  }

  function findLatestWeekObject(arr, week) {
    return arr
      ?.filter(obj => obj?.source_week === String(week) || obj?.target_week === String(week))
      ?.sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at))?.[0] || null;
  }

  const currentOrderHandler = () => {
    if (!isRenewedPlan) {
      if (orders) {
        const historySwapps = orders[0]?.total_history ?? [];
        const ord = [];

        for (let index = 0; index < orders.length; index++) {
          const orderItem = orders[index];
          const thresPassedDate = moment(orders[index]?.data?.[0]?.delivery_date).startOf("day").isBefore(thresholdDate);
          const LatestStatus = findLatestWeekObject(orders[index]?.total_history, index + 1)
          const source_copy = historySwapps?.length <= 0 ? orderItem?.source_copy : LatestStatus?.source_week == index + 1;
          const target_copy = historySwapps?.length <= 0 ? orderItem?.target_copy : LatestStatus?.target_week == index + 1;
          
          const startDate = orders[index]?.data?.[0]?.delivery_date;
          const endDate = orders[index]?.data?.[orders[index]?.data?.length - 1]?.delivery_date;

          const weekName = `week_${index + 1}`
          target_copy ? weekCopied.push(weekName) : setWeekCopied(weekCopied?.filter((item)=>item!=weekName))
        
          ord.push({
            number: index,
            complete_week: orderItem?.complete_week ?? false,
            is_current_week: orderItem?.is_current_week ?? false,
            pause_week: orderItem?.pause_week ?? false,
            source_copy: source_copy ?? false,
            target_copy: target_copy ?? false,
            weekInThreshold: thresPassedDate ?? false,
            startDate: startDate ?? null,
            endDate: endDate ?? null,
            source_week_name: LatestStatus?.source_week
          })
        }
        setAllOrders(ord)
        AppLogger("this is order======", ord)
        // setCurrentDate()
      }
    } else {
      if (renewedPlanOrders) {
        const historySwapps = renewedPlanOrders[0]?.total_history ?? [];
        const ord = []
        for (let index = 0; index < renewedPlanOrders.length; index++) {
          const orderItem = renewedPlanOrders[index];
          const thresPassedDate = moment(renewedPlanOrders[index]?.data?.[0]?.delivery_date).startOf("day").isBefore(thresholdDate);
          const LatestStatus = findLatestWeekObject(renewedPlanOrders[index]?.total_history, index + 1)
          const source_copy = historySwapps?.length <= 0 ? orderItem?.source_copy : LatestStatus?.source_week == index + 1;
          const target_copy = historySwapps?.length <= 0 ? orderItem?.target_copy : LatestStatus?.target_week == index + 1;
          
          const startDate = renewedPlanOrders[index]?.data?.[0]?.delivery_date;
          const endDate = renewedPlanOrders[index]?.data?.[renewedPlanOrders[index]?.data?.length - 1]?.delivery_date;
          const weekName = `week_${index + 1}`
          target_copy ? setWeekCopied([...weekCopied,weekName]) : setWeekCopied(weekCopied?.filter((item)=>item!=weekName))
          
          ord.push({
            number: index,
            complete_week: orderItem?.complete_week ?? false,
            is_current_week: orderItem?.is_current_week ?? false,
            pause_week: orderItem?.pause_week ?? false,
            source_copy: source_copy ?? false,
            target_copy: target_copy ?? false,
            weekInThreshold: thresPassedDate ?? false,
            startDate: startDate ?? null,
            endDate: endDate ?? null,
            source_week_name: LatestStatus?.source_week
          })
        }
        setAllOrders(ord)
        AppLogger("this is order======", ord)
        // setCurrentDate()
      }
    }
  }
  const [open, setOpen] = useState(false)
  const handleClose = () => {
    setOpen(false)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  function isBefore(date1, date2) {
    return date1.isBefore(date2)
  }

  const disableWeeks = (val) => {
    if (isRenewedPlan && renewedPlanOrders) {
      if (renewedPlanOrders[val]?.data?.length == 0) {
        return true
      } else {
        return false
      }
    } else {
      if (orders && orders[val]?.data?.length == 0) {
        return true
      } else {
        return false
      }
    }
  }
  //Copy meals new work 
  const [openCopyWeekModal, setOpenCopyWeekModal] = useState(false);
  const [openCopyWeekNumber, setOpenCopyWeekNumber] = useState(null);

  const WeeksCopied = (weekNum) => {
    setOpenCopyWeekModal(true);
    setOpenCopyWeekNumber(weekNum)
  }
  const WeeksCopiedClose = () => {
    setOpenCopyWeekModal(false);
    setOpenCopyWeekNumber(null)
  };

  return (
    <div className={`${styles.secWeeksWrapper} ${isExecutive ? "isExecutive" : ""}`}>
      <div className="container container--custom">
        <div className={`${styles.weeksWrapper} `}>
          {isBefore(
            moment(),
            moment(currentDate)
          ) && currentTab !== "pastOrders" ? (
            <Typography
              variant={"h3"}
              sx={{ color: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen, fontWeight: "600" }}
              className={"titleStyle"}
            >
              Start Date:
              <span>
                {" "}
                {moment(currentDate).format(AppConstants.dateFormat)}
              </span>
            </Typography>
          ) : (
            <div></div>
          )}
          <div className={`${styles.buttonWrapper} ${isExecutive ? "isExecutive" : ""}`}>
           
             {allOrders?.map((val, i) => (
              <WeekButton
                key={i}
                val={val}
                i={i}
                handleClick={handleClick}
                handleChange={handleChange}
                isPast={past}
                disableWeeks={disableWeeks}
                handlePastWeekClick={handlePastWeekClick}
                isExecutive={isExecutive}
                activeIndex={activeIndex}
                WeeksCopied={WeeksCopied}
                isRenewedPlan={isRenewedPlan}
                token={auth_token}
                renewalUserId={renewalUserId}
                renewalOrderId={renewalOrderId}
                order_id={order_id}
                showIcons={allOrders?.length > 1 ? true : false}
              />
            ))}
            <div>
              {renewalDataLocal && !past && !isRenewedPlan && (
                <Button
                  className="sty2"
                  sx={{
                    // backgroundColor:  isExecutive ? "#fa7324" : "#D1EBE4",
                    border: isExecutive ? "1px solid #fa7324" : "1px solid #D1EBE4",
                    color: isExecutive ? AppColors.black : "",
                    minWidth: "90px !important",
                    fontWeight: "300",
                    padding: "6px 12px",
                    marginRight: "6px",
                    "@media (min-width: 768px)": {
                      minWidth: "120px !important"
                    }
                  }}
                  onClick={handleClickOpen}
                  variant={"outlined"}
                // onClick={() => handleClick(val.title, i)}
                >
                  Next Plan
                </Button>
              )}
            </div>
            <div>
              {isRenewedPlan && paymentStatus == "unpaid" && (
                <Button
                  className="sty2"
                  sx={{
                    minWidth: "250px !important",
                    maxWidth: "100%",
                    fontWeight: "300",
                    padding: "6px 12px",
                    marginRight: "6px",
                    "@media (min-width: 768px)": {
                      minWidth: "120px !important"
                    }
                  }}
                  onClick={handleClickOpen}
                  variant={"outlined"}
                // onClick={() => handleClick(val.title, i)}
                >
                  Edit Renewed Plan Preferences
                </Button>
              )}
            </div>
            <div>
              {isRenewedPlan && paymentStatus == "paid" && (
                <Button
                  className="sty2"
                  sx={{
                    minWidth: "250px !important",
                    maxWidth: "100%",
                    fontWeight: "300",
                    padding: "6px 12px",
                    marginRight: "6px",
                    "@media (min-width: 768px)": {
                      minWidth: "120px !important"
                    }
                  }}
                  onClick={() => {
                    router.push(AppRoutes.viewRenewal)
                  }}
                  variant={"outlined"}
                // onClick={() => handleClick(val.title, i)}
                >
                  View Renewed Plan Preferences
                </Button>
              )}
            </div>
          </div>
        </div>
        <Nextmeal
          isRenewedPlan={isRenewedPlan}
          handleTabChange={handleTabChange}
          open={open}
          handleClose={handleClose}
          handleClickOpen={handleClickOpen}
          isExecutive={isExecutive}
        />
      </div>
      <CopyWeekModal
        open={openCopyWeekModal}
        onClose={WeeksCopiedClose}
        weeksLen={allOrders?.length}
        orderData={
        !isRenewedPlan ?
          orders :
          renewedPlanOrders ? renewedPlanOrders:[]
        }
        selectedWeek={openCopyWeekNumber}
        orderId={!isRenewedPlan ?order_id : order_id_renewal}
        token={auth_token}
        threshold_day={thresholdDate}
        isRenewalPlan={(isRenewedPlan && renewedPlanOrders)?true :false}
        renewalOrderId={renewalOrderId}
        renewalUserId={renewalUserId}
        isPast={past}

      />
    </div>
  )
}

const copyStyle = {
  cursor: 'pointer',
  position: 'absolute',
  height: {xs:"16px",md:'20px'},
  width: {xs:"16px",md:'20px'},
  borderRadius: '20px',
  border: '2px solid white',
  top: '-13px',
  right: '0px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

WeekData.propTypes = {
  weekChange: PropTypes.func
}
export default WeekData
