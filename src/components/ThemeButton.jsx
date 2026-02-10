import React from 'react';
import {
    buttonOutlinedSX,
    buttonSX
} from '../components/popUp/commonSX';
import { CircularProgress } from '@mui/material';
import { Box, Typography } from '@mui/material';
import AppConstants from '@helpers/AppConstants';
import AppColors from '@helpers/AppColors';

const ThemeButton = (props) => {
    const {
        disabled = false,
        onClick = () => { },
        variant = AppConstants.buttonVariants.contained,
        extraSX = {},
        loading = false,
        textSx,
        ...extras
    } = props;

    const btnType = variant === AppConstants.buttonVariants.contained ? buttonSX : buttonOutlinedSX;

    return (
        <Box
            component="button"
            sx={{
                ...btnType,
                pointerEvents: disabled ? "none" : 'auto',
                opacity: disabled ? 0.7 : 1,
                filter: disabled ? "grayscale(0.7)" : 'none',
                overflow: 'hidden',
                position: 'relative',
                transition: 'background 0.2s',
                ":hover": {
                    backgroundColor: 'rgba(0,0,0,0.5)', // slight grey hover
                },
                "&::after": {
                    content: '""',
                    position: 'absolute',
                    width: '100px',
                    height: '100px',
                    background: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '50%',
                    transform: 'scale(0)',
                    opacity: 0,
                    pointerEvents: 'none',
                },
                "&:active::after": {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) scale(3)',
                    opacity: 1,
                    transition: 'transform 0.4s ease-out, opacity 0.6s ease-out',
                },
                ...extraSX
            }}
            onClick={onClick}
            {...extras}
        >
            <Typography color={variant === AppConstants.buttonVariants.contained ? AppColors.white : AppColors.primaryGreen} sx={{fontFamily: "EuclidCircularB !important",...textSx}} >
                {loading ? <CircularProgress size={16} /> : props?.children}
            </Typography>
        </Box>
    );
};

export default ThemeButton;
