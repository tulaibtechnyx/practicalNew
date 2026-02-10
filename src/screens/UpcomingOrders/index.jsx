import React, { useEffect, useState } from "react"
import WeekData from "../../components/weekData"
import Portal from "../portal"

export default function UpcomingOrders({
  updated,
  startDateCheck,
  order_id,
  type,
  isRenewedPlan,
  handleTabChange,
  isOrderReady,
  isExecutive,
  AddItemsBool=false,
  setAddItems=()=>{},
  setValue=()=>{},
  handleChange=()=>{},
  setMealDate=()=>{},
}) {

  const [currentWeek, setCurrentWeek] = useState("week_1")
  const [weekChanged, setWeekChanged] = useState(false)
  const [weekCopied, setWeekCopied] = useState([])

  const handleWeekChangeHandler = (e) => {
    setCurrentWeek(e)
    setWeekChanged(!weekChanged)
  }

  return (
    <React.Fragment>
      {
          <React.Fragment>
            <WeekData
              currentTab={isRenewedPlan ? "renewalOrders" : "upcomingOrders"}
              startDateCheck={startDateCheck}
              weekChange={handleWeekChangeHandler}
              isRenewedPlan={isRenewedPlan}
              handleTabChange={handleTabChange}
              isExecutive={isExecutive}
              weekCopied={weekCopied}
              setWeekCopied={setWeekCopied}
              handleChange={handleChange}
            />
            <Portal
              order_id={order_id}
              type={type}
              weekChanged={weekChanged}
              updated={updated}
              currentWeek={currentWeek}
              isRenewedPlan={isRenewedPlan}
              isOrderReady={isOrderReady}
              weekCopied={weekCopied}
              setWeekCopied={setWeekCopied}
              setAddItems={setAddItems}
              AddItemsBool={AddItemsBool}
              setValue={setValue}
              setMealDate={setMealDate}
            />
          </React.Fragment>
      }
    
    </React.Fragment>
  )
}
