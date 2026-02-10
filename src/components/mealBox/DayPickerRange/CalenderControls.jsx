import { Box, useMediaQuery } from '@mui/material';
import moment from 'moment';
import React from 'react';
import AppConstants from '@helpers/AppConstants';
import { generateMonthOptions, generateYearOptions } from '@helpers/CommonFunc';
import CustomDropdown from './CustomDropDown';

const CalendarControls = ({
  minDate,
  maxDate,
  currentYear,
  currentMonth,
  setCurrentMonth,
  setCurrentYear,
  rangeModeOff = false,
  showYear = true
}) => {
  const minDateObj = moment(minDate, AppConstants.dateFormatDash);
  const maxDateObj = moment(maxDate, AppConstants.dateFormatDash);
  const currentDate = moment([currentYear, currentMonth]);
  const matchesSmallMobile = useMediaQuery("(max-width:565px)");

  const disablePrev = currentDate.isSameOrBefore(minDateObj, 'month');
  const disableNext = currentDate.isSameOrAfter(maxDateObj, 'month');

  const monthOptions = generateMonthOptions(currentYear, minDateObj, maxDateObj);
  const yearOptions = generateYearOptions(minDateObj.year(), maxDateObj.year());

  const handleMonthChange = (direction) => {
    if (direction === 'prev' && !disablePrev) {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else if (direction === 'next' && !disableNext) {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };
  return (
    // <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px', alignItems: 'center',}}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: rangeModeOff ? matchesSmallMobile ? "10px" : '24px' : '7px', alignItems: 'center', marginTop: '8px' }}>
      <Box onClick={() => handleMonthChange('prev')} style={{
        height: '20px', display: 'flex', alignItems: 'center',
        cursor: disablePrev ? 'not-allowed' : 'pointer',
        opacity: disablePrev ? 0.5 : 1,
        marginLeft: '10px'
      }}>
        <img style={{ width: '16px' }} src={'/images/icons/calender-left.png'} />
      </Box>
      <div style={{
        display: 'flex',
      }}>
        <CustomDropdown
          matchesSmallMobile={matchesSmallMobile}
          options={monthOptions}
          selectedValue={currentMonth}
          onChange={(value) => setCurrentMonth(value)}
          isDisabled={false}
          showComma={showYear}
          AlloOpen={!showYear}
          widthDrop={!showYear && "100px"}

        />
        {
          showYear &&
          <CustomDropdown
          matchesSmallMobile={matchesSmallMobile}
          options={yearOptions}
            selectedValue={currentYear}
            onChange={(value) => setCurrentYear(value)}
            isDisabled={false}
            width="60px"
          />
        }
      </div>

      <Box onClick={() => handleMonthChange('next')} style={{
        height: '20px', display: 'flex', alignItems: 'center',
        cursor: disableNext ? 'not-allowed' : 'pointer',
        opacity: disableNext ? 0.5 : 1,
        marginRight: '10px'
      }}>
        <img style={{ width: '16px' }} src={'/images/icons/calender-right.png'} />
      </Box>
    </Box>
  );
};

export default CalendarControls