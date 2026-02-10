import AppColors from '@helpers/AppColors'
import { Box, Typography, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'
import { dfac } from './popUp/commonSX';

const CustomAccordian = (props) => {
    const {
        title = '',
        onClick = () => { },
        setAddItemType,
        ticked = false,
        onClickCheck = () => { },
        open = false,
        setOpen = () => { },
        price
    } = props;
    const matchesSmall = useMediaQuery("(max-width:575px)");
    return (
        <Box sx={{
            ...acrordStyle,
            minHeight: open ? "200px" : '63px',
        }}>
            <Box sx={{
                ...accordBoxStyle,
                borderBottomLeftRadius: open && '0px',
                borderBottomRightRadius: open && '0px',

            }} >
                <Box sx={{
                    ...dfac,
                    bgcolor: AppColors.appLightGreen,
                    gap: '20px',
                }}>
                    <Box sx={{
                        ...dfac,
                        bgcolor: AppColors.appLightGreen,
                        gap: '20px',
                    }}>
                        {
                            ticked ?
                                <img src='/images/icons/tick.svg' alt={"tick"} style={{ height: matchesSmall ? "21px" : '24px', cursor: 'pointer' }} onClick={onClickCheck} />
                                :
                                <Box sx={unTickedCircle} ></Box>
                        }
                    </Box>
                    <Typography sx={{
                        fontSize: { xs: '14px', md: '17px' },
                    }} color={AppColors.primaryGreen} fontWeight={'500'}>
                        {title}
                    </Typography>
                </Box>
                <Box sx={{ ...dfac, gap: '10px' }} >
                    {
                        !Number.isNaN(price) && price &&
                        <Box>
                            <Typography color={AppColors.primaryGreen} >{price + ' AED'}</Typography>
                        </Box>
                    }
                    <img
                        onClick={() => {
                            setAddItemType(title)
                            onClick();
                            setOpen()
                        }}
                        style={{ transform: open ? 'rotate(360deg)' : 'rotate(270deg)', height: '17px', marginTop: '3px', cursor: 'pointer' }} src={'images/icons/arrow-lg.png'} alt="arrowup" />
                </Box>
            </Box>
            <Box sx={{
                bgcolor: AppColors.appLightGreen,
                borderBottomLeftRadius: open && '12px',
                borderBottomRightRadius: open && '12px',
            }}>
                {open ? props?.children : null}
            </Box>
        </Box>
    )
}
const unTickedCircle = {
    height: { xs: '19px', md: '24px' },
    width: { xs: '19px', md: '24px' },
    borderRadius: '50px',
    border: `1px solid ${AppColors.primaryGreen}`,
    cursor: 'pointer'
}
const acrordStyle = {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    maxWidth: { md: '700px', xs: '100%' },
    overflow: 'hidden',
    transition: '0.3s linear all'
}
const accordBoxStyle = {
    bgcolor: AppColors.appLightGreen,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px 30px',
    borderRadius: '12px',
    bgcolor: AppColors.appLightGreen,
}
export default CustomAccordian