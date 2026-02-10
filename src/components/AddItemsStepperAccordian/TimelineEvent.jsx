import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import moment from 'moment';
import AppColors from '../../helpers/AppColors';

const TimelineEvent = ({ event , noDivider = false}) => {
  const start = moment(event?.event_start_time) ?? null;
  const end = moment(event?.event_end_time) ?? null;
  const duration = moment.duration(end.diff(start)).asMinutes() ?? null;
  return (
    <Box sx={{ mb: 4, pl: 2, borderLeft: `2px solid ${AppColors.primaryGreen}` }}>
      <Box sx={{ position: 'relative', ml: -2 }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            backgroundColor: AppColors.primaryGreen,
            borderRadius: '50%',
            position: 'absolute',
            left: -7,
            top: 4
          }}
        />
        <Typography variant="subtitle1" fontWeight="bold" sx={{mb:'5px'}} color={AppColors.primaryGreen} >
          {event?.event_type_name || 'No Name'}
        </Typography>
        <Typography variant="body2" sx={{fontWeight:500,mb:'3px'}}>
          Scheduled for: {start.format('dddd, MMMM Do YYYY')}
        </Typography>
        <Typography variant="body2">
          Time: {start.format('h:mm A')} – {end.format('h:mm A')} ({duration} mins)
        </Typography>
      </Box>
      {
        !noDivider &&
      <Divider sx={{ mt: 1 }} />
      }
    </Box>
  );
};
export default TimelineEvent;