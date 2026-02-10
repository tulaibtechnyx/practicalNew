import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import AppColors from '@helpers/AppColors';
import { useRouter } from 'next/router'
import { Box, Typography, useMediaQuery } from '@mui/material';
import TimerTooltip from './TimerTooltip'
import { useDispatch, useSelector } from 'react-redux';
import AppConstants from '@helpers/AppConstants';
import TZone from "moment-timezone";

const CountDownBoxTimer = ({
  StartDateTime = null,
  thresHoldDateLocal,
  mobileMode = false,
  timerPaused = true,
  setTimerPaused = () => { },
  currentSlide
}) => {
  const matchesSmallMobile = useMediaQuery("(max-width:431px)");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const router = useRouter();
  const [colorChanged, setcolorChanged] = useState(false);
  const { timerData } = useSelector(state => state?.home)
  useEffect(() => {
    if (timerData) {
      const calculateTimeLeft = (timerData) => {
        const now = TZone(timerData).tz("Asia/Dubai");  // Get the current time
        const startMealDate = TZone(StartDateTime); // Parse the given start date
        const LastThreshHourNumer = AppConstants?.practiCalDayEndTime;
        const LastThreshMinNumer = 0;
        // Combine the given start date with the current time
        const currentMealDateWithCurrentTime = startMealDate
          .hour(now.hour())
          .minute(now.minute())
          .second(now.second());

        const seventeenTime = TZone(startMealDate).hour(LastThreshHourNumer).minute(LastThreshMinNumer).second(0);
        let thresholdDate = TZone(thresHoldDateLocal).hour(LastThreshHourNumer).minute(LastThreshMinNumer).second(0);

        if (currentMealDateWithCurrentTime?.isBefore(thresholdDate, 'day')) {
          setTimerPaused(true)
          return
        }

        if (currentMealDateWithCurrentTime.isAfter(seventeenTime)) {

          if (currentMealDateWithCurrentTime.isAfter(thresholdDate, "day")) {
            // Add 2 days to thresholdDate
            let daysDiff = currentMealDateWithCurrentTime.diff(thresHoldDateLocal, 'days') ?? 1;
            if (daysDiff == 1) {
              daysDiff = 3
            } else if (daysDiff == 2) {
              daysDiff = 5
            } else if (daysDiff == 3) {
              daysDiff = 7
            }
            thresholdDate = thresholdDate.add(daysDiff, "days").hour(LastThreshHourNumer).minute(LastThreshMinNumer).second(0);
          }
        }

        if (currentMealDateWithCurrentTime.isAfter(thresholdDate, "day")) {
          // Add 2 days to thresholdDate
          let daysDiff = currentMealDateWithCurrentTime.diff(thresHoldDateLocal, 'days') ?? 2;

          if (daysDiff == 1) {
            daysDiff = 2
          } else if (daysDiff == 2) {
            daysDiff = 4
          }
          thresholdDate = thresholdDate.add(daysDiff, "days").hour(LastThreshHourNumer).minute(LastThreshMinNumer).second(0);
        }
        // Check if the current date matches the threshold date
        if (currentMealDateWithCurrentTime.isSame(thresholdDate, "day")) {
          // Check if the current time is after 5:00 PM
          if (currentMealDateWithCurrentTime.isAfter(thresholdDate)) {
            // Move the threshold to the next day at 5:00 PM
            thresholdDate = thresholdDate.add(1, "day").hour(LastThreshHourNumer).minute(LastThreshMinNumer).second(0);
          }
        }

        const diff = thresholdDate.diff(currentMealDateWithCurrentTime); // Difference in milliseconds
        if (diff == 0) {
          setTimerPaused(true)
          router.reload();
          return;
        }
        if (diff <= 0) {//86491000
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          setTimerPaused(true)
          return;
        }
        const duration = moment.duration(diff);
        if (
          Math.floor(duration.asDays()) == 0 &&
          Math.floor(duration.hours()) == 0 &&
          Math.floor(duration.minutes()) <= 1 &&
          duration.seconds() <= 40
        ) {
          setTimerPaused(true)
          return
        }

        if (
          Math.floor(duration.asDays()) == 0 &&
          Math.floor(duration.asHours()) <= 23 &&
          duration.minutes() <= 59
        ) {
          setcolorChanged(true)
        }

        setTimeLeft({
          days: Math.floor(duration.asDays()),
          hours: Math.floor(duration.asHours()),
          minutes: duration.minutes(),
          seconds: duration.seconds(),
        });
      };
      calculateTimeLeft(timerData?.datetime)
    }

  }, [StartDateTime, thresHoldDateLocal, timerData]);


  if (timerPaused) {
    return (
      <div
        style={{
          ...TimerBoxStyle,
          padding: mobileMode && '10px',
          border: mobileMode && `1px solid ${AppColors?.primaryGreen}`,
          marginBottom: mobileMode && '10px',
          minHeight: '32px',
          justifyContent: 'center',
          overflow: 'hidden !important'
        }}
      >

        <div
          style={{
            display: 'flex',
            gap: '10px',
            color: AppColors?.mediumGray || '#555',
            alignItems: 'center'
          }}
        >
          <Typography variant="p" sx={{ fontSize: mobileMode ? matchesSmallMobile ? "12px" : "15px" : '18px', ml: '-3px', color: AppColors.secondryGray }} >
            This delivery's already cooking! No changes possible
          </Typography>

        </div>
      </div>
    );

  } else {
    return (
      <div style={{
        ...TimerBoxStyle,
        padding: mobileMode && '10px',
        border: mobileMode && `1px solid ${colorChanged ? AppColors.primaryOrange : AppColors.primaryGreen}`,
        marginBottom: mobileMode && '10px',
      }}>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            color: AppColors?.mediumGray || '#555',
            alignItems: 'center'
          }}
        >
          <LabelWithValue
            matchesSmallMobile={mobileMode}
            label={'hrs'}
            value={timeLeft.hours}
            fontSize={mobileMode ? matchesSmallMobile ? "12px" : "15px" : '18px'}
            color={colorChanged ? AppColors.primaryOrange : AppColors.primaryGreen}
            border={`1px solid ${colorChanged ? AppColors.primaryOrange : AppColors.primaryGreen}`}

          />
          <LabelWithValue
            matchesSmallMobile={mobileMode}
            label={'mins'}
            value={timeLeft.minutes}
            fontSize={mobileMode ? matchesSmallMobile ? "12px" : "15px" : '18px'}
            color={colorChanged ? AppColors.primaryOrange : AppColors.primaryGreen}
            border={`1px solid ${colorChanged ? AppColors.primaryOrange : AppColors.primaryGreen}`}

          />
          <Typography variant="p" sx={{ fontSize: mobileMode ? matchesSmallMobile ? "12px" : "15px" : '18px', ml: '-4px' }} >remaining to swap items</Typography>

          <TimerTooltip
            heading={'What is this timer?'}
            title={`
              Here's the deal: we prep everything fresh just for you, and our timer lets you
              know exactly when we need to start. After the timer runs out, we're all hands on
              deck - shopping, cooking, and packing your meals. So whether it's switching up
              your menu, changing delivery details or pausing your plan, make sure to do it before the clock runs down!
              `}
            positionBoxOnMobile={'translateX(-85%)'}>
            i
          </TimerTooltip>
        </div>
      </div>
    );

  }
};
export default CountDownBoxTimer;


const TimerBoxStyle = {
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  position: 'relative',
}

const DFJCAC = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}


const LabelWithValue = (props) => {
  return (
    <Box sx={{
      ...DFJCAC,
      fontSize: props?.matchesSmallMobile && "13px"
    }}>
      <Box
        sx={{
          border: props.border,
          color: props.color,
          height: '30px',
          width: '30px',
          ...DFJCAC,
          borderRadius: '5px'
        }} >
        <Typography variant="p" fontSize={15} >{props.value}</Typography>
      </Box>
      <Typography variant="p" sx={{
        pl: '4px',
        fontSize: props.fontSize

      }}>{props.label}</Typography>
    </Box>
  )
}

