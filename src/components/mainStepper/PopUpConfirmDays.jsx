import React from 'react'
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import { Box, Button, keyframes, styled, Typography } from '@mui/material'
import moment from 'moment'
import { useState } from 'react'
import { convertToFullDayNames } from '@helpers/CommonFunc'
import AppRoutes from '@helpers/AppRoutes'
import { useRouter } from 'next/router'

const shakeAnimation = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
  `;

const PopUpConfirmDays = (props) => {
    const {
        openModalforDayConfirm,
        isExecutive,
        AppColors,
        setOpenModal,
        handleBack,
        formData,
        onYesClick,
        addressBody,
        onNoClick = () => { },
        changeDaysFunc=()=>{}
    } = props;
    let timeslotString = addressBody?.time_slot
    const router = useRouter();
    const [backdropClicked, setBackdropClicked] = useState(false);
    let completeDayName = convertToFullDayNames(formData?.days_food_delivery)
    let days_food_delivery = completeDayName?.map((item, ind) => item + `${(ind + 1) == formData?.days_food_delivery?.length ? '' : ', '}`);
    let colorTextOrBorder = isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen;
    let showChangeDeiveryButton = days_food_delivery?.length == 7;
    const buttonStyle = {
        minWidth: '100%',
        bgcolor: 'transparent  !important',
        borderColor: `${colorTextOrBorder} !important`,
        color: `${colorTextOrBorder} !important`,
    }


    const handleClose = (event, reason) => {
        setBackdropClicked(true);

        if (reason === 'backdropClick') {
            setBackdropClicked(true);
            setTimeout(() => {
                setBackdropClicked(false);
            }, 500);
        }
    }
    const redirectToDashboard = () => {
        return new Promise((resolve) => {
            resolve(router.push(AppRoutes.dashboard))
        })
    }
    // const handleGoToEditPref = () => {
    //     try {
    //         redirectToDashboard().then(() => {
    //             if (window !== 'undefined') {
    //                 if (window.handleGoToEP) window.handleGoToEP().then(() => {
    //                     setTimeout(() => {
    //                         if (window.handleOpenDeliveryDaysPopup) window.handleOpenDeliveryDaysPopup();
    //                     }, 1000)
    //                 });
    //             }
    //         })
    //     } catch (error) {
    //         console.log('error redirecting')
    //     }
    // }


    return (
        <Dialog
            open={openModalforDayConfirm}
            className={`infoPop${isExecutive ? " isExecutive" : ""}`}
            onClose={handleClose}
            sx={{
                ...backdropClicked && {
                    '& .MuiDialog-container': {
                        animation: `${shakeAnimation} 0.5s linear`
                    }
                }
            }}
        >
            <DialogTitle
                sx={{
                    textAlign: "center",
                    lineClamp: "3",
                    color: colorTextOrBorder,
                    padding: "50px 50px 0 50px",
                    marginBottom: "25px",
                }}
            >
                <Typography>
                    {/* Please confirm that you are selecting to get your meals delivered to you at */}
                    Please confirm that you are selecting to have your meals delivered to you in the
                    <Typography component={'span'} color={colorTextOrBorder} > {timeslotString} </Typography>
                    time slot, on the following days:
                    <Typography component={'span'} color={colorTextOrBorder} > {days_food_delivery}. </Typography>
                    <br/>
                    <br/>
                    Please note that afternoon & evening deliveries do not arrive the day before, but on the days selected.
                </Typography>
            </DialogTitle>
            <DialogContent sx={{
                textAlign: 'center',
                width: '100%',
                display: 'flex',
                justifyContent: "center",
                padding: '0px ',
                paddingBottom: '30px !important'
            }}>
                <Box sx={{
                    display: 'flex', flexDirection: 'column',
                    justifyContent: "space-evenly",
                    gap: '10px',
                    width: {
                        sm: '100%',
                        md: '70%'
                    }
                }}>
                    {
                        showChangeDeiveryButton ?

                            <></> :
                            <Button
                                className="marginBottomMobile10"
                                sx={buttonStyle} onClick={() => {
                                    setOpenModal(false);
                                    changeDaysFunc()
                                    // handleGoToEditPref()
                                }}>

                                No, I need to change my delivery days
                            </Button>
                    }

                    <Button
                        className="marginBottomMobile10"
                        sx={buttonStyle} onClick={() => {
                            setOpenModal(false);
                            onNoClick()
                        }}>

                        No, I need to change my time slot
                    </Button>
                    <Button className="marginBottomMobile10"
                        sx={{
                            color: `${AppColors.white} !important`,
                            minWidth: '100%',
                        }} onClick={() => {
                            onYesClick()
                        }}>

                        Yes, I confirm
                    </Button>
                </Box>
            </DialogContent>
            <Button className="crossButton" sx={{
                color: isExecutive && `${AppColors.primaryOrange} !important`,

            }} onClick={() => { setOpenModal(false); onNoClick() }}>
                x
            </Button>
        </Dialog>
    )
}


export default PopUpConfirmDays