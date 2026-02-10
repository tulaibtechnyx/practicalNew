import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import AppColors from '@helpers/AppColors';
import CustomTooltip from '@components/CustomTooltip';
import { useRouter } from 'next/router'
const CountDownTimerWithSeconds = ({ StartDateTime = null, DateIsInThreshold = false, thresHoldDateLocal }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const router = useRouter()
  useEffect(() => {
    const calculateTimeLeft = () => {

      const now = moment(); // Get the current time
      const startDate = moment(StartDateTime); // Parse the given start date

      // Combine the given start date with the current time
      const currentDateWithCurrentTime = startDate
        .hour(now.hour())
        .minute(now.minute())
        .second(now.second());

      const seventeenTime = moment(startDate).hour(17).minute(0).second(0);
      let thresholdDate = moment(thresHoldDateLocal).hour(17).minute(0).second(0);


      if (currentDateWithCurrentTime.isAfter(seventeenTime)) {

        if (currentDateWithCurrentTime.isAfter(thresholdDate, "day")) {
          // Add 2 days to thresholdDate
          let daysDiff = currentDateWithCurrentTime.diff(thresHoldDateLocal, 'days') ?? 1;
          if (daysDiff == 1) {
            daysDiff = 3
          } else if (daysDiff == 2) {
            daysDiff = 4
          }
          thresholdDate = thresholdDate.add(daysDiff, "days").hour(17).minute(0).second(0);
        }
      }

      if (currentDateWithCurrentTime.isAfter(thresholdDate, "day")) {
        // Add 2 days to thresholdDate
        thresholdDate = thresholdDate.add(2, "days").hour(17).minute(0).second(0);
      }

      // Check if the current date matches the threshold date
      if (currentDateWithCurrentTime.isSame(thresholdDate, "day")) {
        // Check if the current time is after 5:00 PM
        if (currentDateWithCurrentTime.isAfter(thresholdDate)) {
          // Move the threshold to the next day at 5:00 PM
          thresholdDate = thresholdDate.add(1, "day").hour(17).minute(0).second(0);
        }
      }

      const diff = thresholdDate.diff(currentDateWithCurrentTime); // Difference in milliseconds
      if (diff == 0) {
        router.reload();
        return;
      }
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const duration = moment.duration(diff);
      setTimeLeft({
        days: Math.floor(duration.asDays()),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
      });
    };

    calculateTimeLeft();

    const intervalId = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [StartDateTime, thresHoldDateLocal]);

  const [openTooltip, setopenTooltip] = useState(false)
  const navRef = useRef(null);


  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setopenTooltip(false)
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true)
    return () => {
      document.removeEventListener("click", handleClickOutside, true)
    }
  })

  return (
    <div style={TimerBoxStyle}>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          color: AppColors?.mediumGray || '#555',
          alignItems: 'center'
        }}
      >
        <LabelWithValue
          value={timeLeft.days}
          label={'Days'}
        />
        <LabelWithValue
          value={timeLeft.hours}
          label={'Hr'}
        />
        <LabelWithValue
          value={timeLeft.minutes}
          label={'Min'}
        />
        <LabelWithValue
          value={timeLeft.seconds}
          label={'Sec'}
        />
        <CustomTooltip
          arrow
          onOpen={() => {
            setopenTooltip(true);
            setTimeout(() => setopenTooltip(false), 3000); // Tooltip disappears after 3 seconds
          }}
          open={openTooltip}
          disableHoverListener={false}
          title={'Count down before your meal gets locked.'}
        >
          <div style={tooltipStyle}
            ref={navRef}
            onClick={() => {
              setopenTooltip(!openTooltip);
              setTimeout(() => setopenTooltip(false), 3000); // Tooltip disappears after 3 seconds

            }}

          >
            i
          </div>
        </CustomTooltip>
      </div>
    </div>
  );
};
export default CountDownTimerWithSeconds;


const TimerBoxStyle = {
  padding: '7px 20px',
  borderRadius: '10px',
  backgroundColor: AppColors?.appLightGreen || '#f0f9f7',
  border: `1px solid ${AppColors?.primaryGreen || '#179c78'}`,
  width: 'fit-content',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  position: 'relative',
}
const tooltipStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '13px',
  height: '13px',
  borderRadius: '10px',
  backgroundColor: '#ed894e',
  color: 'white',
  fontSize: '9px',
  border: `1px solid ${AppColors?.primaryOrange}`
}
const LabelWithValue = (props) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px' }}>{props.value}</p>
      <p style={{ fontSize: '12px', margin: 0 }} >{props.label}</p>
    </div>
  )
}

