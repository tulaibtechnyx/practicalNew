import { Chip, Stack } from '@mui/material'
import AppColors from 'helpers/AppColors';
import AppConstants from 'helpers/AppConstants'
import { useState } from 'react';

const index = ({ assignedDays = [], selectedDays=[], onClickDay, id }) => {
    const isDaySelected = (assignedDays, day) => {
        if (Array.isArray(assignedDays)) {
          const allDays = AppConstants.allDeliveryDays;
          return allDays.some(() => assignedDays.includes(day))
        }
      
        return false;
      }

    return (
        <Stack
            className="daysDelivery"
            direction="row"
            spacing={1}
            sx={{ justifyContent: "flex-end" }}
        >
            {selectedDays.map((day, index) => (
                <Chip
                    onClick={() => onClickDay(day, id)}
                    key={index}
                    label={day}
                    className={
                        isDaySelected(assignedDays, day)
                            ? "selected"
                            : ""
                    }
                    sx={{
                        fontWeight: "500",
                        fontSize: "12px",
                        borderColor:
                            isDaySelected(assignedDays, day)
                                ? AppColors.appOrange
                                : AppColors.primaryGreen,
                        backgroundColor:
                            isDaySelected(assignedDays, day)
                                ? AppColors.appOrange
                                : "transparent",
                        color:
                            isDaySelected(assignedDays, day)
                                ? `${AppColors.white} !important`
                                : AppColors.black
                    }}
                    variant="outlined"
                />
            ))}
        </Stack>
    )
}

export default index
