import AppColors from '@helpers/AppColors'
import { Box, Typography, useMediaQuery } from '@mui/material'
import React from 'react'
import { dfjac } from './popUp/commonSX';

const AccordBox = (props) => {
    const { title = '', onClick = () => { }, setAddItemType, ticked = false,
        QuestionsChecked, setQuestionsChecked, onClickCheck
    } = props;
    const matchesSmall = useMediaQuery("(max-width:575px)");

    return (
        <Box sx={{ ...dfjac, width: '100%', gap: '10px' }} >
            {
                ticked ?
                    <img src='/images/icons/tick.svg' alt={"tick"} style={{ height: matchesSmall ? "21px" : '24px', cursor: 'pointer' }} onClick={onClickCheck} />
                    :
                    <Box sx={unTickedCircle} ></Box>
            }
            <Box sx={AccordianBoxStyle} >
                <Typography sx={{ fontSize: { xs: '15px', md: '17px' } }} color={AppColors.primaryGreen} fontWeight={'500'}>
                    {title}
                </Typography>
                <img
                    onClick={() => {
                        setAddItemType(title)
                        onClick()
                    }}
                    style={{ transform: 'rotate(270deg)', height: '17px', marginTop: '3px', cursor: 'pointer' }} src={'images/icons/arrow-lg.png'} alt="arrowup" />
            </Box>
        </Box>
    )
}
const AccordianBoxStyle = {
    width: '100%',
    maxWidth: { md: '600px', xs: '90%' },
    bgcolor: AppColors.appLightGreen,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px 30px',
    borderRadius: '12px'
}
const unTickedCircle = {
    height: { xs: '19px', md: '24px' },
    width: '24px',
    borderRadius: '50px',
    border: `1px solid ${AppColors.primaryGreen}`,
    cursor: 'pointer'
}
export default AccordBox