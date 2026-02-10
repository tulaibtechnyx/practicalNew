import React, { useEffect, useState } from "react"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker"
import AppConstants from "helpers/AppConstants"
import TextField from "@mui/material/TextField"
import moment from "moment"
import PropTypes from "prop-types"

const DatePickerComp = ({ dates, arrayMode, formChange }) => {
  const [value, setValue] = useState(null)
  const [datesValue, setDatesValue] = useState([])

  useEffect(() => {
    // const
    if (arrayMode) {
      setDatesValue(dates)
    } else {
      setValue(dates)
    }
  }, [dates, arrayMode])

  const onMultiDateSelect = (e) => {
    const allDates = [...datesValue]
    const currDate = e.target.value
    const currentDateIndex = allDates.findIndex(
      (val) => moment(val).format(AppConstants.dateFormat) == currDate
    )
    if (currentDateIndex == -1) {
      allDates.push(currDate)
    } else {
      allDates[currentDateIndex] = currDate
    }
    setDatesValue(allDates)
    formChange(allDates)
    setValue("")
  }

  const onDeletePressHandler = (date) => {
    const datess = [...datesValue]
    const currentDateIndex = datess.findIndex(
      (val) => moment(val).format(AppConstants.dateFormat) == date
    )

    datess.splice(currentDateIndex, 1)
    setDatesValue(datess)
    formChange(datess)
  }

  const DatesComponent = ({ date }) => (
    <div>
      <button onClick={() => onDeletePressHandler(date)}>x</button>
      {date}
    </div>
  )
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {arrayMode ? (
        <div>
          {datesValue.length > 0 &&
            datesValue.map((val, index) => (
              <DatesComponent
                date={moment(val).format(AppConstants.dateFormat)}
                key={index}
              />
            ))}{" "}
          <input onChange={onMultiDateSelect} type="date" />
        </div>
      ) : (
        <DesktopDatePicker
          value={value}
          onChange={(newValue) => {
            setValue(newValue)
            formChange(moment(newValue).format(AppConstants.dateFormat))
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      )}
    </LocalizationProvider>
  )
}
DatePickerComp.propTypes = {
  dates: PropTypes.any,
  arrayMode: PropTypes.bool,
  formChange: PropTypes.func,
  date: PropTypes.string
}
export default DatePickerComp
