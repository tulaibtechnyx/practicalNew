import React, { useState, useEffect, useRef, useMemo } from "react"
import { useSelector } from "react-redux"
import get from "lodash/get"
import DatePicker from "react-multi-date-picker"

import { Box, Typography, Button, Chip } from "@mui/material"
import { Animated } from "react-animated-css"
import moment from "moment"
import clsx from "clsx"
import PropTypes from "prop-types"

import AppColors from "helpers/AppColors"
import AppConstants from "helpers/AppConstants"
import Calender from "../../../public/images/icons/calender.svg"
import styles from "./style.module.scss"
import ReactHtmlParser from "react-html-parser"
import Tooltip from "@mui/material/Tooltip"
import AppLogger from "../../helpers/AppLogger"
import CalendarsDateRangePicker from "../mealBox/DayPickerRange/DayPickerRange"
import { filterDatesBetweenRangeNewWithExcludedRange, getDisabledDatesInRangeFromRange, getValidDates2 } from "@helpers/CommonFunc"
import ThemeLoader from "@components/ThemeLoader"
const Snacks = ({
  handleFormData,
  fieldToUpdate,
  question,
  fieldToUpdate2,
  fieldToUpdate3,
  description,
  values,
  animatedState,
  alternative_tool_tip,
  loading=false
}) => {
  const { currentQuizType } = useSelector((state) => state.quiz)
  const { userDetails, isExecutive } = useSelector((state) => state.auth)
  const { startUpData } = useSelector((state) => state.home)
  const [startDate, setStartDate] = useState("")
  const [dates, setDates] = useState([])
  const [renewalDate, setRenewalDate] = useState("")
  const [numberOfDays, setNumberOfDays] = useState(0)
  const [startUpDataLocal, setStartUpDataLocal] = useState(null)
  const [validDatesArray, setValidDates] = useState([])
  const numberOfWeeks = get(userDetails, "data.meal_plan_require_weeks", "")
  let thresHoldDate = get(startUpDataLocal, "threshold_day", new Date())
  const [thresHoldDateLocal, setThresHoldDateLocal] = useState(new Date())
  let planLenght = userDetails?.data?.meal_days_per_week ?? 1;
  let planLenghtWeeks = userDetails?.data?.meal_plan_require_weeks ?? 1;
  useEffect(() => {
    if (thresHoldDate != new Date()) {
      const fixedThresHoldDate = moment(thresHoldDate).toDate()

      setThresHoldDateLocal(fixedThresHoldDate)
    }
  }, [thresHoldDate])

  useEffect(() => {
    handleStartValuesHandler()
  }, [])

  useEffect(() => {
    setStartUpDataLocal(startUpData)
  }, [startUpData])

  useEffect(() => {
    if (numberOfWeeks) {
      const days = parseInt(numberOfWeeks) * 7
      setNumberOfDays(days + dates.length)
    }
    AppLogger("This is start date========", convertDateFormat(startDate))
  }, [startDate, dates, userDetails])

  const pauseDatesHandler = (e) => {

    const CorrectDates2 = filterDatesBetweenRangeNewWithExcludedRange(MinDateForPauseDateRanger, new Date(RenewalDate), e, disabledDates);
    const getValidDatesObj = getValidDates2(MinDateForPauseDateRanger, new Date(RenewalDate), CorrectDates2, disabledDates, planLenghtWeeks * planLenght, AppConstants.dateFormat)
    const validDates = [...getValidDatesObj?.validDates];
    const IgnoredPauseAfterLastOpenDate = [...getValidDatesObj?.validDatesTrimmed];

    if (validDates?.length <= 0) {
      setDates(CorrectDates2)
      // setValidDates([validDates[validDates?.length - 1]])

    } else {
      const [day, month, year] = validDates?.[validDates?.length - 1]?.split(".")?.map(Number);
      const lastDate = new Date(Date.UTC(year, month - 1, day)); // Normalize to UTC midnight

      if (IgnoredPauseAfterLastOpenDate?.length == 0) {
        setDates([])
        addDays(
          moment(thresHoldDateLocal)?.format(AppConstants.dateFormat)
        )

      } else {

        setDates(IgnoredPauseAfterLastOpenDate)
        setValidDates([moment(lastDate)])
      }
    }

    if (e.length == 0) {
      getRenewalDateV5(startDate)
    }
  }

  function add28Days(date) {
    let newDate = new Date(date)
    newDate.setDate(newDate.getDate() + 27)
    return newDate
  }

  function convertDateFormat(dateString) {
    const dateParts = dateString?.split(".")
    const day = dateParts?.[0]
    const month = dateParts?.[1]
    const year = dateParts?.[2]
    const dateObject = new Date(`${year}-${month}-${day}`)
    // const formattedDate = dateObject.toLocaleDateString()
    return dateObject
  }

  function getDayNames(arr) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const dayNames = []

    for (let i = 0; i < arr.length; i++) {
      const index = arr[i]

      if (index >= 0 && index < daysOfWeek.length) {
        dayNames.push(daysOfWeek[index])
      } else {
        dayNames.push(null) // or you can skip invalid indexes using 'continue;'
      }
    }

    return dayNames
  }

  function calculateEndDate(
    startDate,
    numberOfWeeks,
    pauseDatesLength,
    disabledDaysOfWeek
  ) {
    // Convert the input to a Date object
    let startDateObj
    if (typeof startDate === "string") {
      const [day, month, year] = startDate.split(".")
      startDateObj = new Date(`${year}-${month}-${day}`)
    } else if (startDate instanceof Date) {
      startDateObj = startDate
    } else {
      throw new Error("Invalid start date format")
    }

    // Calculate the end date by adding the number of weeks to the start date
    let endDateObj = new Date(
      startDateObj.getTime() + numberOfWeeks * 7 * 24 * 60 * 60 * 1000
    )

    // Increment the end date based on the length of pause dates array
    const pauseDuration = pauseDatesLength * 24 * 60 * 60 * 1000
    endDateObj = new Date(endDateObj.getTime() + pauseDuration)

    // Check if the end date falls on any disabled days
    while (
      disabledDaysOfWeek.includes(
        endDateObj.toLocaleString("en-US", { weekday: "short" })
      )
    ) {
      endDateObj = new Date(endDateObj.getTime() + 24 * 60 * 60 * 1000) // Add one day
    }

    // Format the end date as "YYYY-MM-DD"
    const endDate = endDateObj.toISOString().split("T")[0]

    if (typeof endDate === "string") {
      const [year, month, day] = endDate.split("-")
      return `${day}.${month}.${year}`
    }
    return endDate
  }

  const setEndDate = () => {
    const pauseDatesLength = dates.length
    const disabledDaysOfWeek = getDayNames(
      disabledDateIndices(values.days_food_delivery)
    )

    if (startDate && disabledDaysOfWeek) {
      const endDate = calculateEndDate(
        startDate,
        numberOfWeeks,
        pauseDatesLength,
        disabledDaysOfWeek
      )
    }
  }

  useEffect(() => {
    if (validDatesArray?.length > 0) {
      setRenewalDate(
        validDatesArray?.[validDatesArray?.length - 1]?.format("DD.MM.YYYY")
      )
    }
  }, [validDatesArray, startDate, dates])

  const checkDateFormat = (dateString, format) => {
    const momentDate = moment(dateString, format)
    return momentDate.isValid()
  }
  const handleContinuePress = () => {
    const datee = []
    for (let index = 0; index < dates.length; index++) {
      const element = dates[index]

      if (!checkDateFormat(element, AppConstants.dateFormat)) {
        datee.push(moment(new Date(element))?.format(AppConstants.dateFormat))
      } else {
        datee.push(element)
      }
    }
    let renewalDate
    handleFormData(
      fieldToUpdate,
      startDate,
      fieldToUpdate2,
      datee,
      fieldToUpdate3,
      (renewalDate =
        validDatesArray?.[validDatesArray?.length - 1]?.format("DD.MM.YYYY"))
      // renewalDate
    )
  }

  const handleStartValuesHandler = () => {
    const pauseDates = []

    if (values[fieldToUpdate]) {
      setStartDate(values[fieldToUpdate])
      const date = moment(values[fieldToUpdate], "DD.MM.YYYY")
      getRenewalDateV5(date)
    }
    if (values.meal_plan_end_date) {
      setValidDates([moment(values.meal_plan_end_date, "DD.MM.YYYY")])
    }
    if (values[fieldToUpdate2]) {
      const dates = values[fieldToUpdate2]
      for (let index = 0; index < dates.length; index++) {
        const element = dates[index]
        pauseDates.push(element)
      }
    }
    setDates(pauseDates)
  }
  const datePickerRef = useRef()
  const datePickerRef2 = useRef()

  const onDateChangeHandler = (e) => {
    try {
      setStartDate(e)
      setDates([])
    } catch (err) {
      AppLogger("thsi si err-", err)
    }
  }

  function disabledDateIndices(presentDays) {
    const days = ["Sun", "Mon", "Tues", "Weds", "Thur", "Fri", "Sat"]
    const disable = []

    for (let index = 0; index < days.length; index++) {
      const element = days[index]
      const currentIndex = presentDays.findIndex((val) => val == element)
      if (currentIndex !== -1) {
      } else {
        disable.push(element)
      }
    }
    const disabledIndices = disable.map((day) => days.indexOf(day))
    return disabledIndices
  }

  const alterFoodDays = (days) => {
    return days.map((day) => {
      if (day === "Tues") {
        return "Tue"
      } else if (day === "Weds") {
        return "Wed"
      } else if (day === "Thur") {
        return "Thu"
      } else {
        return day
      }
    })
  }

  const [calendar, setCalendar] = useState([])

  // This was written by prev dev, now not needed
  // useEffect(() => {
  //   if (dates.length > 0) {
  //     const index = dates.length - 1
  //     // setValidDates([calendar[index]])
  //   }
  // }, [dates])


  const getRenewalDateV5 = (e) => {
    const startDateMoment = moment(e, AppConstants.dateFormat)
    const numberOfWeeksV2 = parseInt(numberOfWeeks)
    const numberOfDaysV2 = numberOfWeeksV2 * 7
    let endDateV2 = startDateMoment.clone().add(numberOfDaysV2 - 1, "days")
    const validDates = []

    let currentDate = startDateMoment.clone()
    while (currentDate.isSameOrBefore(endDateV2)) {
      const currentDay = currentDate?.format("ddd")

      if (alterFoodDays(values.days_food_delivery).includes(currentDay)) {
        validDates.push(currentDate.clone())
      }

      currentDate.add(1, "day")
    }
    setValidDates(validDates)

    let calendar = []
    let calendarDate = currentDate.clone()
    let calendarEndDate = currentDate.add(2, "months")
    while (calendarDate.isSameOrBefore(calendarEndDate)) {
      if (
        alterFoodDays(values.days_food_delivery).includes(
          calendarDate?.format("ddd")
        )
      ) {
        calendar.push(calendarDate.clone())
      }

      calendarDate.add(1, "day")
    }
    setCalendar(calendar)
  }

  const addDays = (date) => {
    let result = moment(date, "DD.MM.YYYY")

    while (
      !alterFoodDays(values.days_food_delivery).includes(result?.format("ddd"))
    ) {
      result.add(1, "day")
    }
    setStartDate(result?.format("DD.MM.YYYY"))
    getRenewalDateV5(result)
    return result
  }


  let MinDateForPauseDateRanger = startDate
    ? convertDateFormat(startDate)
    : thresHoldDateLocal
  let MaxDateForPauseDateRanger = validDatesArray?.length > 0 ?
    convertDateFormat(
      validDatesArray?.[validDatesArray?.length - 1]?.format(
        "DD.MM.YYYY"
      )
    ) : '';
  const RenewalDate = startDate && validDatesArray?.length > 0
    ? validDatesArray?.[validDatesArray?.length - 1]
    : // renewalDate
    ""
  const [disabledDates, setdisabledDates] = useState([]);

  useEffect(() => {
    if (RenewalDate) {
      setdisabledDates(getDisabledDatesInRangeFromRange(new Date().getMonth(), new Date().getFullYear(), values.days_food_delivery, new Date(RenewalDate)));
    }
  }, [
    dates?.length, validDatesArray?.length, RenewalDate,
    validDatesArray?.[validDatesArray?.length - 1],
    renewalDate
  ]);

  return (
    <div className={styles.quizSelection}>
      <div className="container container--custom">
        <div className="animatedWrapper sty2">
          <Animated
            animationIn="fadeInRight"
            animationOut="fadeOutLeft"
            animationInDuration={currentQuizType == "quiz_preference" ? 0 : 500}
            animationOutDuration={
              currentQuizType == "quiz_preference" ? 0 : 500
            }
            isVisible={animatedState}
          >
            <Typography variant={"h2"} className={styles.quizTitle}>
              {question}
            </Typography>
            <Typography
              variant={"body3"}
              component="p"
              className={styles.quizPara}
            >
              {description}
            </Typography>
            <div
              className={styles.dateWrapper}
              onClick={() => {
                if (startDate === "") {
                  addDays(
                    moment(thresHoldDateLocal)?.format(AppConstants.dateFormat)
                  )
                }
                datePickerRef.current.openCalendar()
              }}
            >
              <div className={styles.text}>
                <Typography
                  variant={"body3"}
                  component={"p"}
                  className={styles.para}
                  sx={{ fontWeight: "500", color: AppColors.primaryGreen }}
                >
                  {"Start Date"}
                </Typography>
              </div>
              <div className={styles.date}>
                <div className="dateselector">
                  <button
                    className="calenderBtn"
                    onClick={() => {
                      if (startDate === "") {
                        addDays(
                          moment(thresHoldDateLocal)?.format(
                            AppConstants.dateFormat
                          )
                        )
                      }
                      datePickerRef.current.openCalendar()
                    }}
                  >
                    <Calender />
                  </button>
                  <DatePicker
                    ref={datePickerRef}
                    value={startDate}
                    mapDays={({ date }) => {
                      if (
                        disabledDateIndices(values.days_food_delivery).includes(
                          date.weekDay.index
                        ) &&
                        disabledDateIndices(values.days_food_delivery).length >
                        0
                      ) {
                        return {
                          disabled: true,
                          style: { color: "#ccc" }
                          // onClick: () => alert("weekends ")
                        }
                      }
                    }}
                    minDate={thresHoldDateLocal}
                    format={AppConstants.dateFormat}
                    currentDate={""}
                    onOpenPickNewDate={false}
                    maxDate={add28Days(thresHoldDateLocal)}
                    onChange={(e) => {
                      onDateChangeHandler(e?.format(AppConstants.dateFormat))
                      getRenewalDateV5(e?.format(AppConstants.dateFormat))
                    }}
                    // render={<InputIcon />}
                    calendarPosition="bottom-right"
                  />
                </div>
              </div>
            </div>
            {!isExecutive &&
              <>
                <div className={styles.MultidateWrapper}>
                  <div
                    className={styles.Wrappeinner}
                  // onClick={() => datePickerRef2.current.openCalendar()}
                  >
                    <div className={styles.text}>
                      <Typography
                        variant={"body3"}
                        component={"p"}
                        className={styles.para}
                        sx={{ fontWeight: "500", color: AppColors.primaryGreen }}
                      >
                        {"Pause Date(s)"}
                      </Typography>
                      {alternative_tool_tip && alternative_tool_tip !== "" ? (
                        <div className={styles.Btn}>
                          <Tooltip
                            leaveTouchDelay={10000000}
                            enterTouchDelay={50}
                            title={ReactHtmlParser(alternative_tool_tip)}
                            placement="top"
                            arrow
                          >
                            <Button>
                              <span>i</span>
                            </Button>
                          </Tooltip>
                        </div>
                      ) : null}
                    </div>
                    <div className={styles.date}>
                      <div className="dateselectorMulti sty2" style={{
                        marginTop: '0px'

                      }}>
                        {/* <button
                          className="calenderBtn"
                          onClick={() => datePickerRef2.current.openCalendar()}
                        >
                          <Calender />
                        </button> */}
                        {/* <DatePicker
                          ref={datePickerRef2}
                          value={dates}
                          disabled={startDate === "" ? true : false}
                          // disabledDays={disabledDays}
                          onChange={(e) => {
                            console.log("PAUSE DATE", e)
                            pauseDatesHandler(e)
                          }}
                          // onPropsChange={(e) => console.log("onPropsChange", e)}
                          multiple
                          mapDays={({ date }) => {
                            if (
                              disabledDateIndices(
                                values.days_food_delivery
                              ).includes(date.weekDay.index) &&
                              disabledDateIndices(values.days_food_delivery)
                                .length > 0
                            ) {
                              return {
                                disabled: true,
                                style: { color: "#ccc" }
                                // onClick: () => alert("weekends ")
                              }
                            }
                          }}
                          sort
                          form
                          minDate={
                            startDate
                              ? convertDateFormat(startDate)
                              : thresHoldDateLocal
                          }
                          // minDate={minPauseDate._d ?? thresHoldDate}
                          // minDate={
                          //   startDate
                          //     ? moment(new Date(startDate))?.format(
                          //         AppConstants.dateFormat
                          //       )
                          //     : thresHoldDate
                          // }
                          maxDate={
                            validDatesArray?.length > 0 &&
                            convertDateFormat(
                              validDatesArray?.[validDatesArray?.length - 1]?.format(
                                "DD.MM.YYYY"
                              )
                            )
                          }
                          format={AppConstants.dateFormat}
                          calendarPosition="bottom-right"
                        /> */}

                        <CalendarsDateRangePicker
                          PSQ={true}
                          condition={false}
                          disablePicker={startDate === "" ? true : false}
                          showSavebutton={true}
                          valuePropFromOldPicker={
                            dates
                          }
                          minDate={MinDateForPauseDateRanger}
                          maxDate={
                            MaxDateForPauseDateRanger
                          }
                          selectedDatesDependency={dates?.length}
                          convertIsotoFomatePropDates={true}
                          format={AppConstants.dateFormat}
                          disabledDates={[]}
                          days_food_delivery={values.days_food_delivery}
                          onChangeHanlder={pauseDatesHandler}
                          justRunOnChangeOnSave={true}
                          convertToDefinedFormateWhileSaving={true}
                          // padding={false}
                          sx={{
                            padding: '0px',
                            margin: '0px'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <ul className={styles.chips}>
                    {dates?.map((date, index) => (
                      <Chip
                        // onClick={() => deletePauseDateHandler(index)}
                        sx={{
                          borderColor: AppColors.primaryGreen,
                          color: AppColors.black,
                          marginTop: "10px",
                          marginLeft: "10px",
                          marginBottom: "5px",
                          width: "90px",
                          "@media(minWidth: 768px)": {
                            marginTop: "20px"
                          }
                        }}
                        size="small"
                        key={index}
                        label={`${date}`}
                        variant="outlined"
                      ></Chip>
                    ))}
                  </ul>
                </div>
                <div className={clsx(styles.dateWrapper, styles.sty2)}>
                  <div className={styles.text}>
                    <Typography
                      variant={"body3"}
                      component={"p"}
                      className={styles.para}
                      sx={{ fontWeight: "500", color: AppColors.primaryGreen }}
                    >
                      {"Renewal Date"}
                    </Typography>
                  </div>
                  <div className={styles.date}>
                    <div className="dateselector">
                      <Typography
                        variant={"body3"}
                        component={"p"}
                        className={styles.para}
                        sx={{ fontWeight: "500", color: AppColors.black }}
                      >
                        {RenewalDate ? RenewalDate?.format(
                          "DD.MM.YYYY"
                        ) : ""}
                      </Typography>
                    </div>
                  </div>
                </div>
              </>
            }
            <div className={clsx(styles.quizPara, styles.sty2)}>
              <Typography
                variant={"body3"}
                component="p"
                className={styles.quizPara}
                style={{ marginTop: isExecutive ? 50 : 0 }}
              >
                {isExecutive ?
                  "PractiCal Executive boasts a Pausing feature which allows you to build your Plan around your own schedule. Have a trip coming up? Got a business lunch meeting next week? No problem – simply Pause these dates in the Edit Preferences section."
                  :
                  "The Renewal Date automatically changes based on how long you told us you want your Meal Plan to last. You can change this in the “Edit Preferences” section of your Personal Portal. No drama!"
                }
              </Typography>
            </div>
            <Box>
        
              <Button
                disabled={
                  startDate == "" || validDatesArray?.length == 0 ? true : false || 
                  loading
                }
                className={`${styles.btn} ${isExecutive ? styles.isExecutive : ''}`}
                onClick={handleContinuePress}
                variant="contained"
              >
                {loading ?
                 <div style={{alignItems:'center'}}>
                  <ThemeLoader />
                   </div>:
                    "continue"}
              </Button>
            </Box>
          </Animated>
        </div>
        {/* <button onClick={handleContinuePress}>Continue</button> */}
      </div>
    </div>
  )
}

Snacks.propTypes = {
  values: PropTypes.any,
  handleFormData: PropTypes.func,
  options: PropTypes.array,
  fieldToUpdate2: PropTypes.string,
  fieldToUpdate: PropTypes.string,
  fieldToUpdate3: PropTypes.string,
  question: PropTypes.string,
  description: PropTypes.string
}
export default Snacks
