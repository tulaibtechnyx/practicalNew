import React, { useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Button,
    IconButton,
    Box,
    useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AppColors from "../../helpers/AppColors";
import { setcheatMealRequest } from "../../store/reducers/ordersReducer";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import AppConstants from "@helpers/AppConstants";
import { useRouter } from "next/router";
import AppRoutes from "@helpers/AppRoutes";
import {
    DialogSX,
    titleSX,
    closeIconSX,

} from "./commonSX";
import { showFaliureToast, showSuccessToast } from "@helpers/AppToast";
const PaymentPop = (props) => {
    const {
        open,
        onClose,
        onConfirm,
        IframeUrl,
        PaymentURL
    } = props;

    const router = useRouter();
    const matchesExSmallMobile = useMediaQuery("(max-width:768px)");
    const iframeRef = useRef();


    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data === "payment-success") {
                onClose(); // your custom function
                showSuccessToast("Payment Completed Successfully")
                router.push(AppRoutes.orderComplete)
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    const handleclose=()=>{
        onClose();router.reload()
    }
    return (
        <Dialog open={open} onClose={handleclose} maxWidth="lg" fullWidth
            sx={{
                ".MuiPaper-root": {
                    height: { xs: '62vh', md: '61vh' },
                    overflow: { xs: 'auto', md: "hidden" }
                }
            }}
            PaperProps={{
                sx: {
                    backgroundColor: "transparent !important",
                    backgroundImage: 'none !important',
                    background: 'URL(xx) !important',
                    boxShadow: 'none !important',
                }
            }}
        >
            <DialogContent
                sx={{
                    ...DialogSX, padding: '0px !important',
                    background: 'URL(xx) !important',

                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "90%",
                        height: "100%",
                        borderRadius: '20px',
                        overflow: 'hidden',
                        mt:!matchesExSmallMobile&&'-50px',
                    }}
                >
                    <Box
                        onClick={handleclose}
                        sx={{...closeIconSX,
                            top: matchesExSmallMobile?'20px':'60px',
                            right: "20px",
                        }}
                    >
                        <CloseIcon />
                    </Box>
                    <iframe
                        ref={iframeRef}
                        src={PaymentURL}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{
                            border: "none",
                            // margin: matchesExSmallMobile ? '-60px 0px 50px 0px' : '',
                            margin: matchesExSmallMobile ? '-60px 0px 50px 0px' : '50px 0px 50px 0px',
                            borderRadius: '25px',

                        }}
                    />
                </Box>
            </DialogContent>
        </Dialog>
    );
};


export default PaymentPop;
