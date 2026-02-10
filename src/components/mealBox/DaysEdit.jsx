import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Typography, Box } from "@mui/material"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import AppLogger from "helpers/AppLogger"
import Button from "@mui/material/Button"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import get from "lodash/get"
import DisclaimerComp from "../disclaimer"

export default function AllergiesEdit({
  currentData,
  setCurrentData,
  handleClose,
  crossClose,
  days,
  onClose,
  loading=false,
  dontCloseOnsave=false
}) {
  const { startUpData } = useSelector((state) => state.home)
  const { isExecutive } = useSelector((state) => state.auth)
  const { userProfile } = useSelector((state) => state.profile)
  const [resultData, setResultData] = useState(null)
  const [selectedDays, setSelectedDays] = useState([])
  const [startUpDataLocal, setStartUpDataLocal] = useState(null)
  const [allDays, setAllDays] = useState([])
  const [errorString, setErrorString] = useState("")
  const { result } = useSelector((state) => state.quiz)
  const [profileDataLocal, setProfileLocal] = useState(null)
  const AllSnacks = get(resultData, "guest.snacks_deliver_per_day", "")
  const AllMeals = get(resultData, "guest.meals_deliver_per_day", "")
  const AllDays = get(resultData, "guest.meal_days_per_week", "")
  const AllWeeks = get(resultData, "guest.meal_plan_require_weeks", "")
  const deliveryDays = get(startUpDataLocal, "delivery_days", [])
  const mealsDeliverPerDay = get(
    profileDataLocal,
    "guest.meal_days_per_week",
    0
  )

  useEffect(() => {
    try {
      if (userProfile) {
        setResultData(userProfile)
      }
    } catch (err) {
      AppLogger("Error at setResultData", err)
    }
  }, [userProfile])

  useEffect(() => {
    daysErrorHandler()
  }, [selectedDays,selectedDays?.length])

  const daysErrorHandler = () => {
    if (selectedDays.length > days) {
      setErrorString("Oops! You've selected too many delivery days.")
    } else if (selectedDays.length < days) {
      setErrorString("Oops! You need to select more delivery days.")
    } else if (selectedDays.length === days) {
      setErrorString("")
    }
  }

  useEffect(() => {
    startDataHandler()
  }, [currentData, startUpDataLocal])

  useEffect(() => {
    if (userProfile) {
      setProfileLocal(userProfile)
    }
  }, [userProfile])

  useEffect(() => {
    if (startUpData) {
      setStartUpDataLocal(startUpData)
    }
  }, [startUpData])

  const startDataHandler = () => {
    AppLogger("this  is currentData=======", currentData)
    const allData = []
    const selected = []
    console.log("deliveryDays",deliveryDays)
    for (let index = 0; index < deliveryDays.length; index++) {
      const element = deliveryDays[index]
      const currentIndex = currentData.findIndex((val) => val == element)
      if (currentIndex !== -1) {
        var selectedDay = { title: element, selected: true }
        allData.push(selectedDay)
        selected.push(selectedDay)
      } else {
        var nonSelectedDay = { title: element, selected: false }
        allData.push(nonSelectedDay)
        selected.push(selectedDay)
      }
    }

    let arr = allData
      .filter((val) => val.selected == true)
      .map((val) => val.title)
    // AppLogger("this  is all data======", allData)
    setAllDays(allData)
    setSelectedDays(arr)
  }

  const addAllergyHandler = (currAllerg) => {
    try {
      // AppLogger("this is curr  allerg", currAllerg)

      const currentIndex = deliveryDays.findIndex((val) => val == currAllerg)
      if (currentIndex !== -1) {
        const allAvailableDays = [...allDays]
        allAvailableDays[currentIndex] = {
          ...allAvailableDays[currentIndex],
          selected: !allAvailableDays[currentIndex].selected
        }
        setAllDays(allAvailableDays)

        // AppLogger("This is All Days========", allAvailableDays)
        const selected = []
        for (let index = 0; index < allAvailableDays.length; index++) {
          const aller = allAvailableDays[index]
          AppLogger("This is  aller=====", aller)
          if (aller.selected) {
            selected.push(aller.title)
          }
          AppLogger("This is allergies", selected)
          setSelectedDays(selected)
        }
      }
    } catch (err) {
      AppLogger("This is error at addAllergyHandler======", err)
    }
  }

  const onSavePressHandler = () => {

    if (selectedDays.length > days) {
      // setErrorString("Days Should be less then Delievery Days")
    } else if (selectedDays.length == days) {
      // setErrorString("")
      setCurrentData(selectedDays)
      !dontCloseOnsave &&  handleClose()
    } else {
      // setErrorString("Days Should be Greater then Delievery Days")
    }
  }
  return (
    <div className="popItems">
      <Typography
        variant="h3"
        sx={{ fontWeight: "bold", color: AppColors.primaryGreen }}
      >
        {"Delivery Days"}
      </Typography>
      <Box sx={{ paddingTop: "15px" }}>
        <DisclaimerComp
          AllSnacks={AllSnacks}
          AllMeals={AllMeals}
          AllDays={days}
          AllWeeks={AllWeeks}
        />
      </Box>
      {/* <div className="selectItem--list">
        {selectedDays.map((val, index) => (
          <div key={index}>
            <button
              onClick={() => deleteAllergyHandler(val)}
              style={{
                backgroundColor: AppColors.primaryGreen,
                color: AppColors.white
              }}
            >
              {val}
            </button>
          </div>
        ))}
      </div>
      <Typography
        variant="h3"
        sx={{ fontWeight: "bold", color: AppColors.primaryGreen }}
      >
        {"All Days"}
      </Typography>
      <div className="selectItem--list">
        {allDays
          .filter((dayy) => !selectedDays.includes(dayy))
          .map((day, index) => (
            <button
              onClick={() => addAllergyHandler(day)}
              style={{
                backgroundColor: selectedDays.includes(day)
                  ? "yellow"
                  : "transparent",
                color: AppColors.primaryGreen
              }}
              key={index}
            >
              {day}
            </button>
          ))}
      </div> */}
      <div className="selectItem--list--New no-pad">
        {allDays.filter((_,index)=>!isExecutive || index<=4).map((dayy, index) => {
          return (
            <FormControlLabel
              key={index}
              control={<Checkbox checked={dayy.selected} />}
              label={dayy.title}
              onClick={() => addAllergyHandler(dayy.title)}
            />
          )
        })}
      </div>
      {errorString && (
        <Typography style={{ color: AppColors.red }}>{errorString}</Typography>
      )}
      <Box
        className="saveButton"
        sx={{
          borderTop: "1px solid #fff",
          // marginTop: "30px",
          paddingTop: "20px",
          textAlign: "center"
        }}
      >
        <button
          disabled={loading}
          onClick={() => {
            onSavePressHandler()
          }}
        >
          {loading ? "Updating..." : 'Save'}
        </button>
      </Box>
      <Button
        // className="crossButton"
        className={`crossButton ${isExecutive ? 'isExecutive':'' }`}
        onClick={() => {
          if(crossClose){
            crossClose()
          }else{
            onClose()
            handleClose()
          }
        }}
      >
        x
      </Button>
    </div>
  )
}
AllergiesEdit.propTypes = {
  currentData: PropTypes.any,
  setCurrentData: PropTypes.any,
  handleClose: PropTypes.func
}
