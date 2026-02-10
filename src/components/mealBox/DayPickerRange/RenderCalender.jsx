import { doesDateExistInRanges, generateCalendar, getAllDatesInRangeExculdingMultipleDate, getAllDatesInRangeExculdingSingleDate, hasEmptyStartOrNullEnd, isDateDisabled, isDateInRange, removeObjectAtIndex } from '@helpers/CommonFunc';
import React from 'react'
import { styleForEmpty, styleForEmptySmall } from './StyleConstant';
import AppColors from '@helpers/AppColors';
import { Box, useMediaQuery } from '@mui/material';
import moment from 'moment';

const RenderCalender = (props) => {
    const {
        currentYear,
        currentMonth,
        selectedRanges,
        deletedDatesFromRange,
        handleDateClick,
        minDate,
        maxDate,
        disabledDates,
        rangeMode,
        setrangeMode,
        setSelectedRanges,
        setSelectedRangesForChecking,
        singlePicker,
        selectedDate,
        setSelectedDate,
        DayMonthPickerOnly
    } = props;
    const matchesSmallMobile = useMediaQuery("(max-width:565px)");
    const calendarDays = generateCalendar(currentYear, currentMonth);

    // Generate day cells
    const renderStyles = matchesSmallMobile ? dateStyles2 : dateStyles;
    const renderStylesForEmpty = matchesSmallMobile ? styleForEmptySmall : styleForEmpty;
    const dayCells = calendarDays.map((date, index) => {
        if (!date) {
            return <div key={index} style={
                DayMonthPickerOnly ? {} :
                    {
                        ...renderStylesForEmpty
                    }}>{DayMonthPickerOnly ? "" : ` `}</div>;
        }
        let RenderObj = {
            isInAnyRange: null,
            isInAnyRangeWithIndex: null,
            isDeleted: null,
            isStartDate: null,
            isEndDate: null,
            isDisabled: null,
            isSingleDateRange: null,
            isSelectedOrInRange: null,
        }
        RenderObj.isInAnyRange = isDateInRange(date, selectedRanges);
        RenderObj.isInAnyRangeWithIndex = doesDateExistInRanges(selectedRanges, date);
        RenderObj.isDeleted = deletedDatesFromRange.some(deletedDate => deletedDate.toDateString() === date.toDateString());
        RenderObj.isStartDate = selectedRanges.some(range => range.start && range.start.toDateString() === date.toDateString());
        RenderObj.isEndDate = selectedRanges.some(range => range.end && range.end.toDateString() === date.toDateString());
        RenderObj.isDisabled = isDateDisabled(date, minDate, maxDate, disabledDates);
        RenderObj.isSingleDateRange = RenderObj?.isStartDate && RenderObj?.isEndDate && selectedRanges.some(range => range.start?.toDateString() === range.end?.toDateString());
        RenderObj.isSelectedOrInRange = RenderObj?.isInAnyRange || (RenderObj?.isStartDate && RenderObj?.isEndDate) || RenderObj?.isSingleDateRange;

        const isSameDate = singlePicker ? moment(date).isSame(selectedDate) : false;
        return (
            <Box
                key={index}
                onClick={() => {

                    if (singlePicker) {
                        setSelectedDate(date)
                        return
                    }

                    let newRanges = [...selectedRanges];
                    let checkIfAnyEndDateIsNull = hasEmptyStartOrNullEnd(newRanges);

                    if (RenderObj.isInAnyRange &&
                        RenderObj.isInAnyRangeWithIndex?.rangeBool &&
                        RenderObj.isInAnyRangeWithIndex?.rangeBool &&
                        !RenderObj.isSingleDateRange &&
                        !checkIfAnyEndDateIsNull

                    ) {

                        if (RenderObj?.isInAnyRangeWithIndex?.index != -1) {

                            let DateRangeWhichIsRemovedBelow = newRanges[RenderObj.isInAnyRangeWithIndex?.index];
                            let AllDatesWithInRangeExcludingSelectedDate = getAllDatesInRangeExculdingMultipleDate(DateRangeWhichIsRemovedBelow?.start, DateRangeWhichIsRemovedBelow?.end, [...disabledDates, date])
                            let RemovedDateRange = removeObjectAtIndex(newRanges, RenderObj.isInAnyRangeWithIndex?.index);

                            setSelectedRanges(RemovedDateRange)
                            setSelectedRangesForChecking(RemovedDateRange)

                            let NowPushTheseDatesAsSeperateDateRanges = AllDatesWithInRangeExcludingSelectedDate?.map((dateOfArr) => {
                                let DateToPush = new Date(dateOfArr)
                                return {
                                    start: DateToPush, end: DateToPush
                                }
                            })

                            newRanges = [...RemovedDateRange, ...NowPushTheseDatesAsSeperateDateRanges];
                            setSelectedRanges(newRanges)
                            setSelectedRangesForChecking(newRanges)

                            return
                        }
                    }

                    // This work is for toggle signle select date
                    if (!rangeMode && !RenderObj.isSingleDateRange && !RenderObj.isSelectedOrInRange && !RenderObj.isDisabled) {

                        newRanges.push({ start: date, end: date });
                        setSelectedRanges(newRanges);
                        setSelectedRangesForChecking(newRanges);

                    } else {

                        !RenderObj?.isDisabled && handleDateClick(date)

                    }
                }}

                sx={
                    singlePicker ?
                        {
                            ...renderStyles,
                            borderRadius: isSameDate ? "50%" : '0px',
                            backgroundColor: isSameDate ? AppColors.primaryGreen : '',
                            color: isSameDate ? '#fff' : '#000',
                            ":hover": {
                                borderRadius: "50%",
                                color: '#fff',
                                backgroundColor: isSameDate ? AppColors.primaryGreen : AppColors.primaryOrange,
                            }
                        }
                        :

                        {
                            ...renderStyles,
                            cursor: RenderObj?.isDisabled ? 'not-allowed' : 'pointer',
                            borderRadius:
                                RenderObj?.isSingleDateRange ? "50%" :
                                    RenderObj?.isStartDate ? '10px 0 0 10px' : RenderObj?.isEndDate ? '0 10px 10px 0' :
                                        '0px',
                            backgroundColor: RenderObj?.isDisabled
                                ? 'transparent'
                                : (RenderObj?.isStartDate && !RenderObj.isSingleDateRange)
                                    ? AppColors.primaryGreen // Background for start date
                                    : (RenderObj?.isEndDate && !RenderObj.isSingleDateRange)
                                        ? AppColors.primaryGreen // Background for end date
                                        : RenderObj.isSingleDateRange
                                            ? AppColors.primaryGreen // Background for selected range
                                            : RenderObj.isInAnyRange ?
                                                AppColors.appMidLightGreen :
                                                RenderObj?.isDeleted
                                                    ? '#e57373'
                                                    : "",
                            color: RenderObj?.isDisabled
                                ? '#9e9e9e' // Lighter color for disabled dates
                                : RenderObj?.isSelectedOrInRange
                                    ? '#fff' // White text color for selected and range dates
                                    : RenderObj?.isStartDate
                                        ? '#fff' // White text color for selected and range dates

                                        : '#000', // Default text color for other dates

                            ...(!matchesSmallMobile && {
                                ":hover": {
                                    backgroundColor: RenderObj?.isDisabled ? "" : AppColors.primaryOrange,
                                    borderRadius: RenderObj?.isSingleDateRange ? "50%" :
                                        RenderObj?.isStartDate ? '10px 0 0 10px' : RenderObj?.isEndDate ? '0 10px 10px 0' :
                                            RenderObj?.isSelectedOrInRange ? "" : '50%',
                                    color: RenderObj?.isDisabled ? '#9e9e9e' : 'white'
                                },
                            })
                        }}
            >
                {date.getDate()}
            </Box>
        );
    });

    return dayCells; // Combine empty slots with days
};

export default RenderCalender

const dateStyles = {
    textAlign: 'center',
    width: '31px',
    height: '27px',
    display: 'inline-block',
    lineHeight: '25px',
    fontSize: '14px',
    padding: '3px',
    mb: '2px',
    cursor: 'pointer',
}

const dateStyles2 = {
    textAlign: 'center',
    width: '26px', // Reduced width
    height: '22px', // Reduced height
    display: 'inline-block',
    lineHeight: '20px', // Adjusted line height
    fontSize: '12px', // Reduced font size
    padding: '2px', // Reduced padding
    marginBottom: '2px',
    cursor: 'pointer',
};