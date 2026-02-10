import AppColors from '@helpers/AppColors';
import { showFaliureToast } from '@helpers/AppToast';
import { Box, Button, FormControlLabel, styled, Switch, Typography, useMediaQuery } from '@mui/material';
import moment from 'moment';
import React, { useState, useRef } from 'react';
import Calender from "../../../../public/images/icons/calender.svg"
import CalenderOrange from "../../../../public/images/icons/calenderOrange.svg"
import AppConstants from '@helpers/AppConstants';
import AppLogger from '@helpers/AppLogger';
import { convertDatesToRange, convertDatestoSpecificFomates, doesDateExistInRanges, findExactMatchInRanges, generateCalendar, generateMonthOptions, generateYearOptions, getDisabledDatesForMonth, handleOverlappingRanges, hasEmptyStartOrNullEnd, isCompleteRange, isDateDisabled, isDateInRange, isNewRange, removeDuplicateDates, removeObjectAtIndex, removeRangeIfDateMatches, swapDatesIfNeeded } from '@helpers/CommonFunc';
import CustomDropdown from './CustomDropDown';
import {
  styleForEmpty,
  dropdownBox,
  CalenderIconStyle,
  WeekDaysStyle,
  calenderBox,
  arrowTop,
  dropdownBoxSmall,
  calenderBoxSmall
} from './StyleConstant';
import CalendarControls from './CalenderControls';
import DayNames from './DayNames';
import RenderCalendar from './RenderCalender';

const CustomDateRangePicker = (props) => {
  const {
    minDate: minDateFromProp,
    maxDate: maxDateFromProp,
    format,
    disabledDates: disabledDatesFromProp = [],
    days_food_delivery,
    valuePropFromOldPicker,
    mealPlanPauseDateLocal,
    onChangeHanlder,
    onSaveDatePressHandler,
    showSavebutton = true,
    disablePicker = false,
    justRunOnChangeOnSave = false,
    justRunSaveOnChange = false,
    // convertIsotoFomatePropDates = false,
    convertToDefinedFormateWhileSaving = false,
    sx = {},
    selectedDatesDependency = null,
    toggleShowAll = () => { },
    showAll = false,
    condition = true,
    PSQ = false,
    singlePicker = false,
    showYear = true,
    lockMinDateyear = false,
    DayMonthPickerOnly = false,
    dropdownBoxsx,
    ShowCalenderDirectly = false,
    selectedDatesOut = [],
    setselectedDatesOut = () => { },
    saveButtonText = 'Save',
    isExecutive=false
  } = props;

  const [selectedDate, setSelectedDate] = useState(null); // To store multiple selected ranges
  const [DatetoShow, setDatetoShow] = useState(null); // To store multiple selected ranges
  const [selectedRanges, setSelectedRanges] = useState([]); // To store multiple selected ranges
  const [selectedRangesForChecking, setSelectedRangesForChecking] = useState([]); // To store multiple selected ranges
  const [deletedDatesFromRange, setDeletedDatesFromRange] = useState([]); // Track deleted dates
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [rangeMode, setrangeMode] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const calendarRef = useRef(null);
  const [minDate, setMinDate] = useState(new Date(2023, 0, 1)); // Example: Jan 1, 2023
  const [maxDate, setMaxDate] = useState(new Date(2024, 11, 31)); // Example: Dec 31, 2024
  const [disabledDates, setDisabledDates] = useState([]);
  const [maxDateBoolean, setMaxDateBooleanSet] = useState(false);
  const [showText, setshowText] = useState(false);
  const [initialRender, setinitialRender] = useState(false);
  const weekDays = AppConstants.allDeliveryDaysTwoLetters;
  const matchesSmallMobile = useMediaQuery("(max-width:565px)");
  const DropBoxstyle = matchesSmallMobile ? dropdownBoxSmall : dropdownBox;
  const handleDateClick = (date) => {
    // Prevent selecting dates that are disabled
    if (isDateDisabled(date, minDate, maxDate, disabledDates)) return;

    let newRanges = [...selectedRanges];
    const exactMatchIndex = findExactMatchInRanges(newRanges, date);

    // If the clicked date exactly matches a selected date (single-date range)
    if (exactMatchIndex !== -1) {
      // Remove the matching date range
      newRanges = removeObjectAtIndex(newRanges, exactMatchIndex);

      // If all ranges are removed, update state and exit
      if (newRanges.length === 0) {
        setSelectedRanges([]);
        setSelectedRangesForChecking([]);
        return;
      }

      // Update the end date for the last incomplete range if necessary
      const lastRange = newRanges[newRanges.length - 1];
      if (lastRange.start && lastRange.end === null) lastRange.end = date;

      // Check if the clicked date exists in any range
      const checker = doesDateExistInRanges(newRanges, date);
      if (checker?.rangeBool && lastRange.end) {
        // If the date exists, either remove the matching range or update ranges
        const updatedRanges = checker.index !== -1
          ? removeObjectAtIndex(newRanges, checker.index)
          : removeRangeIfDateMatches(newRanges, date);

        setSelectedRanges(updatedRanges);
        setSelectedRangesForChecking(updatedRanges);
        return;
      }

      // Update the selected ranges
      setSelectedRanges(newRanges);
      setSelectedRangesForChecking(newRanges);
    } else {
      // If the date does not match any existing range
      const checker = doesDateExistInRanges(newRanges, date);

      // Handle the case where the date overlaps with an existing range
      if (checker?.rangeBool && newRanges[newRanges.length - 1]?.end) {
        const updatedRanges = checker.index !== -1
          ? removeObjectAtIndex(newRanges, checker.index)
          : removeRangeIfDateMatches(newRanges, date);

        setSelectedRanges(updatedRanges);
        setSelectedRangesForChecking(updatedRanges);
        return;
      }

      // If starting a new range
      if (isNewRange(newRanges)) {
        newRanges.push({ start: date, end: null });
      } else {
        // Otherwise, update the end date of the current range
        newRanges[newRanges.length - 1].end = date;
      }

      // Ensure the start and end dates are in the correct order
      swapDatesIfNeeded(newRanges);

      // Handle completed ranges
      if (isCompleteRange(newRanges)) {
        // Find any overlapping ranges
        const overlappingIndices = handleOverlappingRanges(newRanges, selectedRangesForChecking);

        // Remove overlapping ranges if they exist
        const updatedRanges = overlappingIndices.length > 0
          ? selectedRanges.filter((_, i) => !overlappingIndices.includes(i))
          : newRanges;

        // Update the selected ranges
        setSelectedRanges(updatedRanges);
        setSelectedRangesForChecking(updatedRanges);
      } else {
        // For incomplete ranges, just update the state
        setSelectedRanges(newRanges);
      }
    }
  };

  // Get the final array of selected dates (excluding deleted dates)
  const getFinalDates = () => {
    let allDates = [];

    // Add dates from multiple ranges
    selectedRanges.forEach((range) => {
      if (range.start && range.end) {
        let currentDate = new Date(range.start);
        while (currentDate <= range.end) {
          allDates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });

    // Exclude deleted dates
    return allDates.filter(date =>
      !disabledDates.some(deletedDate => deletedDate.toDateString() === date.toDateString())
    );
  };
  // Handle click outside to close the calendar
  const handleOutsideClick = (e) => {
    if (calendarRef.current && !calendarRef.current.contains(e.target)) {
      setIsCalendarOpen(false);
      setMaxDateBooleanSet(false)
      setSelectedDate(null)
      // setrangeMode(false)
    }
  };
  // final level bosss save data on BE:
  const onSaveDatePressHandlerForButtonLocal = () => {
    try {
      if (singlePicker) {
        onSaveDatePressHandler(selectedDate)
        setIsCalendarOpen(!isCalendarOpen)
        return
      }

      let meal_plan_pause_date = getFinalDates();

      if (convertToDefinedFormateWhileSaving) {
        meal_plan_pause_date = convertDatestoSpecificFomates(meal_plan_pause_date, null, format);
      }
      onChangeHanlder(meal_plan_pause_date)
      setMaxDateBooleanSet(false)
      setIsCalendarOpen(false)
      if (!justRunOnChangeOnSave) {
        onSaveDatePressHandler(meal_plan_pause_date)
      }
    } catch (err) {
      AppLogger("this is error at onsavedatepress=======", err)
    }
  }
  React.useEffect(() => {
    setinitialRender(true)
  }, []);
  React.useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);
  React.useEffect(() => {
    // Commenting this work as it has beend handled from CommonFunciton but we may need it in future
    // let mind = moment(minDateFromProp).subtract(1, 'days');
    // console.log("mind", mind)
    // if (minDateFromProp && !Renewal) {
    //   setMinDate(mind)
    //   setCurrentMonth(mind.month())
    //   setCurrentYear(mind.year())
    // } else {
    if (minDateFromProp) {
      setMinDate(minDateFromProp)
    }
    // }
  }, [mealPlanPauseDateLocal?.length > 0 && mealPlanPauseDateLocal?.length, minDateFromProp ? minDateFromProp : null])
  React.useEffect(() => {

    let formattedMaxDate = new Date(maxDateFromProp)
    if (formattedMaxDate) {
      setMaxDateBooleanSet(true)
      setMaxDate(formattedMaxDate)
    }
  }, [maxDateBoolean, mealPlanPauseDateLocal?.length, maxDateFromProp])
  // React.useEffect(() => {
  //   if (disabledDatesFromProp) {
  //     setDisabledDates([...disabledDates,...disabledDatesFromProp])
  //   }
  // }, [disabledDatesFromProp])
  // run on save on onchange
  React.useEffect(() => {
    let checkIfAnyEndDateIsNull = hasEmptyStartOrNullEnd(selectedRanges);
    if (justRunSaveOnChange && !checkIfAnyEndDateIsNull && selectedRanges?.length > 0) {
      onSaveDatePressHandlerForButtonLocal()
    } 
  }, [showText,selectedRanges])
  React.useEffect(() => {
    if (valuePropFromOldPicker && !singlePicker) {
      // use below two lines only if in future there are different formate when saving and getting new from prop
      // const result = convertDatesToRange(valuePropFromOldPicker);
      // const passTheseDates = convertIsotoFomatePropDates ? convertDatestoSpecificFomates(valuePropFromOldPicker,null,format) : valuePropFromOldPicker;
      // below to use when show selected ranges instead of bubbles
      // const result = checked ? convertDatesToRange(passTheseDates) : convertDatesToRangesMultiple(passTheseDates);
      const result = convertDatesToRange(valuePropFromOldPicker)
      setSelectedRanges(result)
      setSelectedRangesForChecking(result)
    }
    if (valuePropFromOldPicker && singlePicker) {

      if (valuePropFromOldPicker?.includes('/')) {

        const [day, month, year] = valuePropFromOldPicker.split("/").map(Number)
        const formattedDate = new Date(year, month - 1, day)
        setSelectedDate(formattedDate)
        setDatetoShow(formattedDate)
        setCurrentYear(year)
        setCurrentMonth(month - 1)
        setMinDate(new Date(2004, 0, 1))
        setMaxDate(new Date(2004, 11, 31))

      } else {
        setSelectedDate(valuePropFromOldPicker)
        setDatetoShow(valuePropFromOldPicker)
      }
    }
  }, [selectedDatesDependency, valuePropFromOldPicker?.length, mealPlanPauseDateLocal?.length, isCalendarOpen])

  React.useEffect(() => {
    if (days_food_delivery) {
      let allDisabledDates = [...disabledDatesFromProp]; // Start with prop-provided disabled dates
  
      // Always calculate disabled dates for the current month
      const currentMonthDisabledDates = getDisabledDatesForMonth(
        currentMonth,
        currentYear,
        days_food_delivery
      );
      allDisabledDates = [...allDisabledDates, ...currentMonthDisabledDates];
  
      // If there are selected ranges, calculate disabled dates for all months in the range
      if (selectedRanges.length > 0) {
        selectedRanges.forEach((range) => {
          if (range.start && range.end) {
            // Get the start and end months/years of the range
            const startDate = new Date(range.start);
            const endDate = new Date(range.end);
            let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
            const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
  
            // Iterate through all months in the range
            while (currentDate <= endMonth) {
              if (
                currentDate.getMonth() !== currentMonth ||
                currentDate.getFullYear() !== currentYear
              ) {
                // Avoid recalculating the current month
                const monthDisabledDates = getDisabledDatesForMonth(
                  currentDate.getMonth(),
                  currentDate.getFullYear(),
                  days_food_delivery
                );
                allDisabledDates = [...allDisabledDates, ...monthDisabledDates];
              }
              currentDate.setMonth(currentDate.getMonth() + 1); // Move to next month
            }
          }
        });
      }
  
      // Remove duplicates and update disabledDates state
      const duplicatesRem = removeDuplicateDates(allDisabledDates);
      setDisabledDates(duplicatesRem);
    }
  }, [currentMonth, currentYear, days_food_delivery, days_food_delivery?.length, mealPlanPauseDateLocal?.length, disabledDatesFromProp?.length, selectedRanges]);

  React.useEffect(() => {
    return () => {
      setMaxDateBooleanSet(false)
      setDisabledDates([])
    }
  }, [])

  React.useEffect(() => {
    let checkIfAnyEndDateIsNull = hasEmptyStartOrNullEnd(selectedRanges);

    if (checkIfAnyEndDateIsNull) {
      setshowText(true)
    } else {
      setshowText(false)
    }
  }, [selectedRanges, selectedRanges?.length])

  React.useEffect(() => {
    if (selectedRanges?.length == 0) {
      setselectedDatesOut([])
    }

    if (ShowCalenderDirectly && selectedRanges?.length > 0) {
      const meal_plan_pause_date = convertDatestoSpecificFomates(getFinalDates(), null, format);
      setselectedDatesOut(meal_plan_pause_date)
    }
  }, [selectedRanges, selectedRanges?.length])
  React.useEffect(() => {
    if (singlePicker) {
      if (lockMinDateyear) {
        setTimeout(() => {
          setCurrentYear(2004)
          setCurrentMonth(0)
          setMinDate(new Date(2004, 0, 1))
          setMaxDate(new Date(2004, 11, 31))
        }, 100);
      }
      setrangeMode(false)
    }
  }, [singlePicker, lockMinDateyear])

  return (
    <Box sx={{
      position: 'relative', maxWidth: '300px', margin: '0 auto', ...sx,
    }}>
      {/* Calendar Icon */}
      <div
        style={{
          ...CalenderIconStyle,
          display: 'flex',
          flexDirection: 'row-reverse',
          gap: '10px',
        }}
      >
        {
          ShowCalenderDirectly ?
            <CalenderRenderView
              ShowCalenderDirectly={ShowCalenderDirectly}
              calendarRef={calendarRef}
              PSQ={PSQ}
              isCalendarOpen={isCalendarOpen}
              DayMonthPickerOnly={DayMonthPickerOnly}
              matchesSmallMobile={matchesSmallMobile}
              minDate={minDate}
              maxDate={maxDate}
              currentYear={currentYear}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              setCurrentYear={setCurrentYear}
              showYear={showYear}
              weekDays={weekDays}
              calenderBoxSmall={calenderBoxSmall}
              calenderBox={calenderBox}
              singlePicker={singlePicker}
              generateCalendar={generateCalendar}
              selectedRanges={selectedRanges}
              deletedDatesFromRange={deletedDatesFromRange}
              isDateInRange={isDateInRange}
              isDateDisabled={isDateDisabled}
              disabledDates={disabledDates}
              handleDateClick={handleDateClick}
              rangeMode={rangeMode}
              setrangeMode={setrangeMode}
              setSelectedRanges={setSelectedRanges}
              setSelectedRangesForChecking={setSelectedRangesForChecking}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              showSavebutton={showSavebutton}
              showText={showText}
              onSaveDatePressHandlerForButtonLocal={onSaveDatePressHandlerForButtonLocal}
              DropBoxstyle={DropBoxstyle}
              dropdownBoxsx={dropdownBoxsx}
              saveButtonText={saveButtonText}
            />
            : <Box
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              sx={{
                cursor: disablePicker ? 'not-allowed' : 'pointer',
                opacity: disablePicker ? 0.5 : 1,
                pointerEvents: disablePicker ? "none" : 'auto',

              }}
            >
              {isExecutive ? <CalenderOrange />:<Calender />}
            </Box>
        }
        {
          singlePicker &&
          <Typography
            onClick={toggleShowAll}
            sx={{
              ":hover": {
                textDecoration: 'underline',
              },
              fontSize: { xs: '13px', md: '18px' },
              cursor: 'pointer',
              fontWeight: '400',
              marginRight: '10px'

            }}>
            {DatetoShow && moment(DatetoShow).format('MMMM DD')}
          </Typography>
        }
        {
          condition &&
          <Typography
            onClick={toggleShowAll}
            color={AppColors.primaryGreen}
            sx={{
              ":hover": {
                textDecoration: 'underline',
              },
              fontSize: { xs: '11px', md: '16px' },
              cursor: 'pointer'
            }}>
            {showAll ? "Show Less" : (
              'Show more'
            )}
          </Typography>
        }
      </div>

      {/* Display the calendar when it's open */}
      {isCalendarOpen && (
        <CalenderRenderView
          calendarRef={calendarRef}
          PSQ={PSQ}
          isCalendarOpen={isCalendarOpen}
          DayMonthPickerOnly={DayMonthPickerOnly}
          matchesSmallMobile={matchesSmallMobile}
          minDate={minDate}
          maxDate={maxDate}
          currentYear={currentYear}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
          showYear={showYear}
          weekDays={weekDays}
          calenderBoxSmall={calenderBoxSmall}
          calenderBox={calenderBox}
          singlePicker={singlePicker}
          generateCalendar={generateCalendar}
          selectedRanges={selectedRanges}
          deletedDatesFromRange={deletedDatesFromRange}
          isDateInRange={isDateInRange}
          isDateDisabled={isDateDisabled}
          disabledDates={disabledDates}
          handleDateClick={handleDateClick}
          rangeMode={rangeMode}
          setrangeMode={setrangeMode}
          setSelectedRanges={setSelectedRanges}
          setSelectedRangesForChecking={setSelectedRangesForChecking}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          showSavebutton={showSavebutton}
          showText={showText}
          onSaveDatePressHandlerForButtonLocal={onSaveDatePressHandlerForButtonLocal}
          DropBoxstyle={DropBoxstyle}
          dropdownBoxsx={dropdownBoxsx}
          saveButtonText={saveButtonText}
        />
      )}
    </Box>
  );
};

const CalenderRenderView = (props) => {
  const
    {
      calendarRef,
      PSQ,
      isCalendarOpen,
      DayMonthPickerOnly,
      matchesSmallMobile,
      minDate,
      maxDate,
      currentYear,
      currentMonth,
      setCurrentMonth,
      setCurrentYear,
      showYear,
      weekDays,
      calenderBoxSmall,
      calenderBox,
      singlePicker,
      generateCalendar,
      selectedRanges,
      deletedDatesFromRange,
      isDateInRange,
      isDateDisabled,
      disabledDates,
      handleDateClick,
      rangeMode,
      setrangeMode,
      setSelectedRanges,
      setSelectedRangesForChecking,
      selectedDate,
      setSelectedDate,
      showSavebutton,
      showText,
      onSaveDatePressHandlerForButtonLocal,
      DropBoxstyle,
      dropdownBoxsx,
      ShowCalenderDirectly,
      saveButtonText
    } = props
  return (
    <div style={{
      position: 'relative',
      zIndex: ShowCalenderDirectly ? 1 : 2,
      overflow: 'visible !important'
    }} >
      <Box
        sx={{
          ...arrowTop,
          top: PSQ && "0px",
          right: PSQ && "0px",
          visibility: PSQ && isCalendarOpen ? 'visible' : 'hidden'
        }}
      />
      <div
        ref={calendarRef}
        style={{
          ...DropBoxstyle,
          minHeight: DayMonthPickerOnly ? "270px" : matchesSmallMobile ? "235px" : '260px',
          position: ShowCalenderDirectly ? "static" : 'absolute',
          boxShadow: ShowCalenderDirectly ? `${AppColors.primaryGreen} 0px 1px 4px, ${AppColors.primaryGreen} 0px 0px 0px 3px` : '0 0 5px #8798ad',
          ...dropdownBoxsx
        }}
      >

        {/* Month and Year Navigation */}
        <CalendarControls
          minDate={minDate}
          maxDate={maxDate}
          currentYear={currentYear}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
          rangeModeOff={true}
          showYear={showYear}
        />

        {/* Day Names */}
        {
          !DayMonthPickerOnly &&
          <DayNames weekDays={weekDays} />
        }

        {/* Render Calendar Days */}

        <div style={matchesSmallMobile ? calenderBoxSmall : calenderBox}>
          <RenderCalendar
            singlePicker={singlePicker}
            DayMonthPickerOnly={DayMonthPickerOnly}
            currentYear={currentYear}
            currentMonth={currentMonth}
            generateCalendar={generateCalendar}
            selectedRanges={selectedRanges}
            deletedDatesFromRange={deletedDatesFromRange}
            isDateInRange={isDateInRange}
            isDateDisabled={isDateDisabled}
            minDate={minDate}
            maxDate={maxDate}
            disabledDates={disabledDates}
            handleDateClick={handleDateClick}
            rangeMode={rangeMode}
            setrangeMode={setrangeMode}
            setSelectedRanges={setSelectedRanges}
            setSelectedRangesForChecking={setSelectedRangesForChecking}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onSaveDatePressHandlerForButtonLocal={onSaveDatePressHandlerForButtonLocal}
          />
        </div>
        {/* We Will use after prod */}
        <div>
          {
            showText ?
              <Typography fontSize={11} >
                *Please select an end date for range or reselect the start date for a single date.
              </Typography> : ''
          }
        </div>
        {
          showSavebutton &&
          <Box sx={{ width: '100%', textAlign: 'center',mt:'20px' }}>
            <Box
              className={showText ? "custom_Button disabledbtn" : 'custom_Button'}
              onClick={onSaveDatePressHandlerForButtonLocal}
              sx={{ fontSize: matchesSmallMobile ? "12px" : '14px' }}
            >
              {saveButtonText}
            </Box>
          </Box>
        }
      </div>
    </div>
  )
}
export default CustomDateRangePicker;

