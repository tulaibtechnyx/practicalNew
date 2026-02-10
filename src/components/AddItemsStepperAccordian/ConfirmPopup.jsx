import { Box, Button, Dialog, DialogContent, DialogTitle, Typography, useMediaQuery } from '@mui/material'
import React from 'react'
import AppColors from "@helpers/AppColors"
import { buttonOutlinedSX } from '@components/popUp/commonSX';
import AppConstants from '@helpers/AppConstants';

const ConfirmPopup = (props) => {
    const {
        isExecutive = false,
        handleClose = () => { },
        onSaveClick = () => { },
        open = false,
        typeItem = '',
        modalMode = false


    } = props;
        const is768px = useMediaQuery(`(max-width: 768px)`)
    
    return (
        <Dialog className={`thankYou-pop ${isExecutive ? "isExecutive " : ""}`} open={open} onClose={handleClose}
        sx={{
            ".MuiPaper-root":{
            backgroundSize:'110% !important',
            backgroundImage: "url(/images/bg/popup-bg.png) !important",
            maxHeight: modalMode ? { md: 'auto', xs: '55vh !important'}:'auto',
            }}}>
            <DialogContent sx={{ padding: modalMode && is768px ? "20px" : "30px",  }}>
                <Typography fontSize={modalMode && is768px ? "18px":'24px'} color={'white'} variant='h1' sx={{ paddingBottom: modalMode && is768px ? "15px" :'25px' }}>
                    Please Note:
                </Typography>
                {
                    (typeItem == AppConstants.AdditemModal.Meal || typeItem == AppConstants.AdditemModal.Snack) ?
                        <>
                            <Typography fontSize={modalMode && is768px ? "14px":'18px'} color={'white'} >
                                You can choose your added {typeItem} in the ‘Upcoming Orders’ section of your personal portal.
                            </Typography>
                            <br />
                            <Typography fontSize={modalMode && is768px ? "14px":'18px'} color={'white'} >
                                If you wish to do this now, please close this pop up, then scroll to the bottom of the Add Item screen and press
                            </Typography>
                        </>
                        :
                        <>
                            <Typography fontSize={modalMode && is768px ? "14px":'18px'} color={'white'} >
                                Adding an extra item? You can remove it later
                                anytime from your ‘Upcoming Orders’ tab — just
                                select the item and tap the bin icon.
                            </Typography>
                            <br />
                            <Typography fontSize={modalMode && is768px ? "14px":'18px'} color={'white'} >
                                If you are all good with your selection please close this popup, then scroll to the bottom of the Add Item screen and press
                            </Typography>
                        </>

                }


                <br />
                <Typography color={'white'}fontSize={modalMode && is768px ? "14px":'18px'} >
                    ‘Confirm and Close’
                </Typography>
                <Box
                    onClick={onSaveClick}
                    sx={{
                        ...buttonOutlinedSX, textAlign: 'center', px: '10px !important',
                        width: 'max-content',
                        mx: 'auto',
                        mt: '20px'
                    }} >
                    I Understand
                </Box>
            </DialogContent>
            <Button
                // className="crossButton"
                className={`crossButton ${isExecutive ? 'isExecutive' : ''}`}
                sx={{ color: "#fff !important" }}
                onClick={handleClose}
            >
                x
            </Button>
        </Dialog>
    )
}

export default ConfirmPopup