import { Box, Typography } from '@mui/material'
import React from 'react'
import TimelineEvent from '../TimelineEvent'
const ConsultationQuestion = (props) => {
  const { AddItemType, Coaching = false, eventData = [] } = props;

  return (
    <Box key={AddItemType} padding={'0px 40px 20px 40px'} maxWidth={{ md: '400px', xs: '100%' }} sx={{ marginX: 'auto' }} >
      <Box sx={{ borderRadius: '20px', border: '1px solid #E6E6E6', textAlign: 'center' }} >
        <Box sx={{ mb: '20px' }} >
          <Typography sx={{ fontSize: '18px', fontWeight: 500, textAlign: 'center' }} color={'black'} >With Taz (Msc Nutr)</Typography>
        </Box>
        {
          Coaching ?
            <>
              <Typography sx={{ fontSize: '15px', textAlign: 'center' }} color={'#787F82'}>
                4 weeks intensive support,
                accountability & guidance
                from our qualified nutritionist so you
                can make the most of your meal plan
                and get lasting results.
              </Typography>

              <Box sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6" mb={2}>
                  Schedule of Events
                </Typography>
                {eventData?.length > 0 ? (
                  eventData?.map((event) => (
                    <TimelineEvent key={event?.id} event={event} />
                  ))
                ) : (
                  <Typography variant="body1">No events found for this ID.</Typography>
                )}
              </Box>
            </>
            :
            <>
              <Typography sx={{ fontSize: '15px', textAlign: 'center' }} color={'#787F82'}>
                A 30 minute call to learn about you,
                your life, your goals & make a
                sustainable plan of action.
              </Typography>
              <Box sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6" mb={2}>
                  Schedule of Events
                </Typography>
                {eventData?.length > 0 ? (
                  eventData?.map((event) => (
                    <TimelineEvent key={event?.id} event={event} noDivider={true} />
                  ))
                ) : (
                  <Typography variant="body1">No events found for this ID.</Typography>
                )}
              </Box>
            </>
        }
      </Box>
    </Box>
  )
}

export default ConsultationQuestion