import { Box } from '@mui/material'
import React from 'react'
import AppColors from "@helpers/AppColors";
import { roundBtn } from './popUp/commonSX';


const RoundButton = (props) => {
    return (
        <Box sx={{
            ...roundBtn,
            bgcolor: props?.selected ? AppColors.primaryGreen :
                props?.disabled ? AppColors.lightgray :
                    AppColors.appLightGreen,
            color: props?.selected ? 'white' : props?.disabled ? 'black' : 'black',
            ":hover": {
                bgcolor: props?.disabled ? '' : AppColors.primaryGreen,
                color: props?.disabled ? '' : 'white'
            },


        }} onClick={props?.onClick} >
            {props?.text}
        </Box>
    )
}

export default RoundButton