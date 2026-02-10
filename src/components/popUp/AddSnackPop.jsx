import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Button,
    IconButton,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AppColors from "../../helpers/AppColors";
import { clearOrdersData, getSwapItemCategoriesRequest, setcheatMealRequest, snackAdd, snackPricingRequest } from "../../store/reducers/ordersReducer";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import CircularNumberSlider from "../CircularNumberSlider/CircularNumberSlider";
import { useRouter } from "next/router";
import AppRoutes from "@helpers/AppRoutes";
import { UpcomingOrdersRequest } from "store/reducers/dashboardReducer";
import {
    DialogSX,
    titleSX,
    closeIconSX,
    priceSX,
    buttonSX
} from "./commonSX";
import { showFaliureToast } from "@helpers/AppToast";

const AddSnackDialog = (props) => {
    const {
        open,
        onClose,
        onConfirm,
        mealId,
        orderId,
        token,
        setAddSnackPop,
        additems=false
    } = props;
    const dispatch = useDispatch();
    const router = useRouter()
    const [pricingLoader, setpricingLoader] = useState(false)
    const [AddsnackLoader, setAddsnackLoader] = useState(false)
    const [snackCount, setsnackCCount] = useState(0)
    const [snackData, setsnackData] = useState({
        price: 0,
        days_remaining: 0
    })
    const changeCountRequest = async (snackCount) => {
        try {
            setpricingLoader(true)

            if (snackCount == 0) {
                setsnackData({
                    price: 0,
                    days_remaining: 0,
                })
                setpricingLoader(false);
                return
            }

            dispatch(snackPricingRequest({
                token: token,
                order_id: orderId,
                meal_id: mealId,
                snack_count: snackCount

            })).then(unwrapResult).then((res) => {
                const resData = res?.data?.data
                setsnackData({
                    price: resData?.price,
                    days_remaining: resData?.days_remaining,
                })
                setpricingLoader(false)

            })
        } catch (err) {
            console.log('err', err)
            setpricingLoader(false)
        }
    }
    const handleClose = () => {
        onClose();
        setsnackData({ price: 0, days_remaining: 0 }
        )
    }
    const onSliderChangeHandler = (value) => {
        setsnackCCount(value)
        changeCountRequest(value)
    }
    const handleSubmit = async () => {
        try {
            setAddsnackLoader(true)
            dispatch(snackAdd({
                token: token,
                order_id: orderId,
                meal_id: mealId,
                snack_count: snackCount
            })).then((res) => {
                const statusCode = res?.payload?.response?.status;
                if(statusCode && (statusCode != 200 || statusCode!= 201) ){
                    showFaliureToast(`Can't add snack to your plan`);
                    handleClose()
                }else{
                    if (token) {
                        dispatch(
                            getSwapItemCategoriesRequest({ token: token, order_id: orderId })
                        )
                        dispatch(UpcomingOrdersRequest({ token })).then(() => {
                            router.push(AppRoutes.dashboard);
                            setAddsnackLoader(false);
                        })
                    }
                }
                setAddsnackLoader(false)
            })
        } catch (err) {
            console.log("err", err)
            setAddsnackLoader(false)
        }
    }
    React.useEffect(() => {
        changeCountRequest(0);
    }, [])

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth
            sx={{
                ".MuiPaper-root": {
                    maxHeight: { xs: '53vh', md: 'max-content' },
                    overflow: { xs: 'auto', md: "hidden" },
                }
            }}
            PaperProps={{
                sx: {
                    backgroundColor: "white !important",
                }
            }}
        >

            <DialogContent
                sx={{...DialogSX,
                    scrollbarWidth: 'none', // For Firefox
                    '&::-webkit-scrollbar': { // For Chrome, Safari, and Opera
                        display: 'none',
                    },
                    '-ms-overflow-style': 'none', // For Internet Explorer and Edge
                    backgroundSize:'cover'
                }}
            >
                <Typography
                    variant="h2"
                    sx={{...titleSX, bgcolor:''}}>
                    {"Want to add snacks?"}
                </Typography>
                <Box
                    onClick={onClose}
                    sx={closeIconSX}
                >
                    <CloseIcon />
                </Box>
                <Box sx={{
                    width: '99%',
                    display: 'flex',
                    justifyContent: 'center',
                }} >

                    <CircularNumberSlider
                    laoding={pricingLoader}
                    additems={additems}
                    max={5} onChange={onSliderChangeHandler} />
                </Box>
                <p >200 Calorie Snacks</p>
                <Box sx={{ my: 2 }}>
                    <Typography variant="body1" sx={{
                        fontSize: { xs: '13px ', md: '18px' }
                    }} >
                        Select how many snacks per day you would like to add, using the scroll wheel above
                    </Typography>
                </Box>

                <Box sx={{ my: 2, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: "center" }}>
                    <Box sx={{

                        color: AppColors?.primaryGreen,
                        border: `1px solid ${AppColors?.primaryGreen}`,
                        borderRadius: '40px',
                    }}>
                        <Typography variant="h5" color={AppColors?.primaryGreen} sx={{
                            ...priceSX,
                            fontFamily: 'EuclidCircularB',
                            fontSize: { xs: '18px ', md: '24px' },
                            bgcolor: 'white',
                        }} >
                            {
                                pricingLoader ?
                                    "Updating price" :
                                    `${snackData?.price} AED`
                            }
                        </Typography>
                    </Box>
                    <Box sx={{ my: 1, mt: 2 }}>
                        <Typography variant="body2"
                            sx={{
                                fontSize: { xs: '13px ', md: '18px' }
                            }}>
                            Total for the remaining {snackData?.days_remaining} day(s) of your plan
                        </Typography>
                    </Box>
                </Box>
                {/* Confirm Bypass Button */}
                <Button
                    onClick={() => {
                        onConfirm ? onConfirm() : null;
                        handleSubmit()
                    }}
                    disabled={AddsnackLoader || pricingLoader || snackCount == 0}
                    sx={buttonSX}
                >
                    {'Confirm'}
                </Button>

            </DialogContent>
        </Dialog >
    );
};

export default AddSnackDialog;
