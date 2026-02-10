import React from 'react'
import { WeekDaysStyle, WeekDaysStyleSmall, weekDay, weekDaySmall } from './StyleConstant'
import { useMediaQuery } from '@mui/material';

const DayNames = ({ weekDays }) => {
    const matchesSmallMobile = useMediaQuery("(max-width:565px)");

    return (
        <div
            style={matchesSmallMobile ? WeekDaysStyleSmall : WeekDaysStyle}
        >
            {weekDays.map((day, index) => (
                <div key={index} style={matchesSmallMobile ? weekDaySmall: weekDay}>
                    {day}
                </div>
            ))}
        </div>
    )
}

export default DayNames