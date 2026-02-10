import { Box } from '@mui/material'
import React, { useState } from 'react'
import RoundButton from './RoundButton';
import AppColors from '@helpers/AppColors';
import CustomTooltip from './CustomTooltip';
import { dfac, toolTipText } from './popUp/commonSX';

const StepBox = (props) => {
    const { selectedBtn, setselectedBtn, disabledbtn1, disabledbtn2 } = props;
    return (
        <Box sx={{ ...dfac, flexDirection: 'column' }} >
            <Box sx={{ ...dfac, gap: '10px', ml: '20px' }} >
                <Box sx={{ ...dfac, gap: '10px', borderRadius: '30px', border: `1px solid ${AppColors.primaryGreen}`, padding: '6px' }}  >
                    <RoundButton
                        disabled={disabledbtn1}
                        selected={selectedBtn == '1'}
                        text={'1'}
                        onClick={() => { setselectedBtn('1') }} />
                    <RoundButton
                        disabled={disabledbtn2}
                        selected={selectedBtn == '2'}
                        text={'2'}
                        onClick={() => { disabledbtn2 ? null : setselectedBtn('2') }} />
                </Box>
                <CustomTooltip title={"Please don't play with it"} >
                    <Box sx={toolTipText} >
                        i
                    </Box>
                </CustomTooltip>
            </Box>
            {props?.children}
        </Box>
    )
}


export default StepBox;
