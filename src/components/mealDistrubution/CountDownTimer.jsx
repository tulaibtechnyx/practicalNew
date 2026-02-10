import React, { useState, useEffect } from 'react';
import moment from 'moment';

const CountDownTimer = ({ thresHoldDateLocal }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = moment();
      const thresholdDate = moment(thresHoldDateLocal);
      const diff = thresholdDate.diff(now); // Get difference in milliseconds

      if (diff <= 0) {
        // If the threshold date has passed, set everything to zero
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      const duration = moment.duration(diff); // Convert diff into duration
      setTimeLeft({
        days: Math.floor(duration.asDays()), // Get full days
        hours: duration.hours(), // Get remaining hours
        minutes: duration.minutes(), // Get remaining minutes
      });
    };

    // Initial calculation
    calculateTimeLeft();

    // Update every second
    const intervalId = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [thresHoldDateLocal]);

  return (
    <div style={{display:'flex',gap:'5px'}}>
      <p>Time Left:</p>
      <p>
        {timeLeft.days} days, {timeLeft.hours} hours, {timeLeft.minutes} minutes
      </p>
    </div>
  );
};

export default CountDownTimer;

// Button for use
{/*    <button onClick={() => {
        // debugger;
        const now = moment(); // Get the current time
        const startDate = moment(StartDateTime); // Parse the given start date

        // Combine the given start date with the current time
        const currentDateWithCurrentTime = startDate
          .hour(now.hour())
          .minute(now.minute())
          .second(now.second());

        let thresholdDate = moment(thresHoldDateLocal).hour(17).minute(0).second(0);
        console.log("ghanta :",currentDateWithCurrentTime?.get(''))
        console.log('now', now)
        console.log('StartDateTime', new Date(StartDateTime))
        console.log('startDate', new Date(startDate))
        console.log('currentDateWithCurrentTime', new Date(currentDateWithCurrentTime))
        console.log('thresHoldDateLocal', thresHoldDateLocal)


        if (currentDateWithCurrentTime.isAfter(thresholdDate, "day")) {
          // Add 2 days to thresholdDate
          thresholdDate = thresholdDate.add(2, "days").hour(17).minute(0).second(0);
        }
        console.log('thresholdDate after 1 ', new Date(thresholdDate))

        // Check if the current date matches the threshold date
        if (currentDateWithCurrentTime.isSame(thresholdDate, "day")) {
          // Check if the current time is after 5:00 PM
          if (currentDateWithCurrentTime.isAfter(thresholdDate)) {
            // Move the threshold to the next day at 5:00 PM
            thresholdDate = thresholdDate.add(1, "day").hour(17).minute(0).second(0);
          }
        }
        console.log('thresholdDate after 2', new Date(thresholdDate))
        const diff = thresholdDate.diff(currentDateWithCurrentTime); // Difference in milliseconds
        const duration = moment.duration(diff);
        
        console.log('difference:',{
          days: Math.floor(duration.asDays()),
          hours: duration.hours(),
          minutes: duration.minutes(),
          seconds: duration.seconds(),
        })
      }} >LCICK AH</button> */}