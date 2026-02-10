import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Box, Typography } from "@mui/material"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import AppLogger from "helpers/AppLogger"
import Button from "@mui/material/Button"
export default function AllergiesEdit({
  currentData,
  setCurrentData,
  handleClose,
  selectedAddressTimeSlot
}) {
  const { startUpData } = useSelector((state) => state.home)
  const { isExecutive } = useSelector((state) => state.auth)

  const [selectedTimeSlot, setSelectedTimeSlot] = useState([])
  const [allTimeSlots, setAllTimeSlots] = useState([])

  useEffect(() => {
    try {
      if (startUpData) {
        const { time_slots } = startUpData
        if (time_slots) {
          setAllTimeSlots(time_slots)
        }
        setSelectedTimeSlot(currentData)
      }
    } catch (err) {
      AppLogger("Error at currenData", err)
    }
  }, [currentData])

  const addAllergyHandler = (currAllerg) => {
    setCurrentData(currAllerg)
    handleClose()
  }

  return (
    <div className="popItems">
      <Typography
        variant="h3"
        className="headingTime"
        sx={{ color: AppColors.primaryGreen, fontWeight: "bold" }}
      >
        {"Delivery Time Slot"}
      </Typography>
      <div className="selectItem--list btns">
        {allTimeSlots.map((timeSlot) => {
          if (selectedAddressTimeSlot !== "") {
            if (timeSlot.city == selectedAddressTimeSlot?.city) {
              return (
                <Box className="TimeWrapper" sx={{ paddingBottom: "10px" }}>
                  <Typography variant="body3" component={"p"}>
                    {timeSlot.city}
                  </Typography>
                  {timeSlot?.values.map((ts, index) => {
                    return (
                      <Button
                        className={
                          ts == selectedTimeSlot.split(":")[1]
                            ? "timeSelected"
                            : null
                        }
                        onClick={() =>
                          addAllergyHandler(`${timeSlot.city}:${ts}`)
                        }
                        disabled={
                          timeSlot.city !== selectedAddressTimeSlot?.city
                        }
                        style={{
                          textTransform: "lowercase",
                          borderColor:
                            ts == selectedTimeSlot.split(":")[1] &&
                            currentData.split(":")[0] == timeSlot.city
                              ? AppColors.appOrange
                              : AppColors.primaryGreen,
                          backgroundColor:
                            ts == selectedTimeSlot.split(":")[1] &&
                            currentData.split(":")[0] == timeSlot.city
                              ? AppColors.appOrange
                              : AppColors.primaryGreen,
                          color:
                            ts == selectedTimeSlot.split(":")[1] &&
                            currentData.split(":")[0] == timeSlot.city
                              ? AppColors.white
                              : AppColors.white
                        }}
                        key={index}
                      >
                        {ts}
                      </Button>
                    )
                  })}
                </Box>
              )
            } else {
              return null
            }
          } else {
            return (
              <Box className="TimeWrapper" sx={{ paddingBottom: "10px" }}>
                <Typography variant="body3" component={"p"}>
                  {timeSlot.city}
                </Typography>
                {timeSlot?.values.map((ts, index) => {
                  return (
                    <Button
                      className={ts == selectedTimeSlot ? "timeSelected" : null}
                      onClick={() =>
                        addAllergyHandler(`${timeSlot.city}:${ts}`)
                      }
                      style={{
                        textTransform: "lowercase",
                        borderColor:
                          ts == selectedTimeSlot &&
                          currentData.split(":")[0] == timeSlot.city
                            ? AppColors.appOrange
                            : AppColors.primaryGreen,
                        backgroundColor:
                          ts == selectedTimeSlot &&
                          currentData.split(":")[0] == timeSlot.city
                            ? AppColors.appOrange
                            : AppColors.primaryGreen,
                        color:
                          ts == selectedTimeSlot &&
                          currentData.split(":")[0] == timeSlot.city
                            ? AppColors.white
                            : AppColors.white
                      }}
                      key={index}
                    >
                      {ts}
                    </Button>
                  )
                })}
              </Box>
            )
          }
        })}
      </div>
      {/* <button onClick={onSavePressHandler}>Save</button> */}
      <Button 
      // className="crossButton"
      className={`crossButton ${isExecutive ? 'isExecutive':'' }`}
       onClick={handleClose}>
        x
      </Button>
    </div>
  )
}
AllergiesEdit.propTypes = {
  currentData: PropTypes.func,
  setCurrentData: PropTypes.func,
  handleClose: PropTypes.func
}
