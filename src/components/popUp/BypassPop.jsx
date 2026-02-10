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
    priceSX,
    buttonSX,
    textwithmbSX,
    disclaimerSX,
    undertakingSX
} from "./commonSX";
const BypassDialog = (props) => {
    const {
        open,
        onClose,
        onConfirm,
        common_allergies,
        common_dislikes,
        isVeg,
        mealorderId,
        mealId,
        orderId,
        token,
        onCloseSnack,
        ByPassMealRequestfromProp,
        openByLoader=false
    } = props;

    const [bypassLoader, setbypassLoader] = useState(false)
    const allergyTitles = [...new Set(common_allergies?.map((item) => item?.title) || [])];
    const dislikeTitles = [...new Set(common_dislikes?.map((item) => item?.title) || [])];
    const dispatch = useDispatch();
    const router = useRouter();
    let reasons = [];

    if (allergyTitles.length) {
        reasons.push(
            <>
                <strong>"{allergyTitles.join(", ")}"</strong> as an{" "}
                <strong>allergen</strong>
            </>
        );
    }
    if (dislikeTitles.length) {
        reasons.push(
            <>
                <strong>"{dislikeTitles.join(", ")}"</strong> as a{" "}
                <strong>dislike</strong>
            </>
        );
    }
    if (isVeg == 1) {
        reasons.push(
            <>
                the <strong> Vegetarian </strong>meal plan option
            </>
        );
    }
    const ByPassMealRequest = async () => {
        try {
            setbypassLoader(true)
            dispatch(setcheatMealRequest({
                token: token,
                orderId: orderId,
                meal_order_id: mealorderId,
                meal_id: mealId
            })).then(unwrapResult).then((res) => {
                setbypassLoader(false)
                onCloseSnack()
            })
        } catch (err) {
            console.log('err', err)
            setbypassLoader(false)
        }

    }
    const redirectToDashboard = () => {
        return new Promise((resolve) => {
            resolve(router.push(AppRoutes.dashboard))
        })
    }
    const handleGoToEditPref = () => {
        try {
            localStorage.setItem("scrollToAllergy", "true"); 
            redirectToDashboard().then(() => {
                if (window !== "undefined") {
                    if (window.handleGoToEP) window.handleGoToEP();
                }
            });
        } catch (error) {
            console.log("Error redirecting", error);
        }
    };
    
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
            sx={{
                ".MuiPaper-root": {
                    maxHeight: { xs: '52vh', md: 'max-content' },
                    overflow: { xs: 'auto', md: "hidden" }
                }
            }}
            PaperProps={{
                sx: {
                    backgroundColor: "white !important",
                }
            }}
        >
            <DialogContent
                sx={DialogSX}
            >
                <Typography
                    variant="h2"
                    sx={titleSX}>
                    {"Attention!"}
                </Typography>
                <Box
                    onClick={onClose}
                    sx={closeIconSX}
                >
                    <CloseIcon />
                </Box>

                {/* Dynamic Reason Message */}
                {reasons.length > 0 && (
                    <Typography variant="body1" sx={textwithmbSX}>
                        This item is currently locked due to the selection of {reasons.reduce((prev, curr) => [prev, " & ", curr])}, in Preferences.
                    </Typography>
                )}
                {/* Instructions */}
                <Typography variant="body2" sx={textwithmbSX}>
                    To bypass this preference, and add this specific item to your plan, click the{" "}
                    "Confirm Bypass" button below:
                </Typography>

                {/* Confirm Bypass Button */}
                <Button
                    variant="contained"
                    disabled={bypassLoader || openByLoader}
                    onClick={() => {
                        onConfirm ? onConfirm() : null;
                         ByPassMealRequestfromProp?ByPassMealRequestfromProp(): ByPassMealRequest()
                    }}
                    sx={buttonSX}
                >
                    {'Confirm Bypass'}
                </Button>

                {/* Alternative Option */}
                <Typography variant="body2" sx={{...textwithmbSX,my:3}}>
                    Alternatively, you can remove this lock permanently by changing your preferences{" "}
                    <Box component={'span'} sx={{ color: AppColors?.primaryGreen, cursor: "pointer", ":hover": { textDecoration: 'underline' } }} onClick={handleGoToEditPref} >HERE</Box>.
                </Typography>

                {/* Disclaimer Section */}
                <Typography
                    variant="body2"
                    sx={disclaimerSX}
                >
                    Please read the disclaimer below:
                </Typography>

                <Typography variant="body2" sx={undertakingSX}>
                    {AppConstants.undertakingText1}
                </Typography>

                <Typography variant="body2" sx={undertakingSX}>
                    {AppConstants.undertakingText2}
                </Typography>
            </DialogContent>
        </Dialog>
    );
};


export default BypassDialog;
