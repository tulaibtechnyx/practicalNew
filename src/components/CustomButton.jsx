import { Box } from '@mui/material'
import React from 'react'
import AppColors from "@helpers/AppColors";
import { buttonOutlinedSX, buttonSX, roundBtn } from './popUp/commonSX';


const CustomButton = (props) => {
    const { onClick, disabled = false, children, minWidth = '220px', customXS = {},
        outlined = true
    } = props;
    const btnStyle = outlined ? buttonOutlinedSX : buttonSX;

    return (
        <Box
            onClick={onClick}
            disabled={disabled}
            sx={{
                ...btnStyle,
                textAlign: 'center', px: '10px !important',
                ":hover": {
                    bgcolor: 'rgba(0,0,0,0.1) !important'
                }, width: 'max-content',
                bgcolor: disabled ? "lightgray  !important" : 'white !important',
                pointerEvents: disabled ? "none  !important" : 'auto !important',
                minWidth: minWidth,
                ...customXS,
            }}
        >
            {children}
        </Box>
    )
}

export default CustomButton