import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Button,
    IconButton,
    Box,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AppColors from "../../helpers/AppColors";
import { clearOrdersData, getSwapItemCategoriesRequest, setcheatMealRequest, snackAdd, snackPricingRequest } from "../../store/reducers/ordersReducer";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { useRouter } from "next/router";
import AppRoutes from "@helpers/AppRoutes";
import { CopyMeals, getRenewedPlanRequest, GetTickersRequest, UpcomingOrdersRequest } from "store/reducers/dashboardReducer";
import {
    DialogSX,
    titleSX,
    closeIconSX,
    priceSX,
    buttonSX
} from "./commonSX";
import { showFaliureToast } from "@helpers/AppToast";
import DynamicCheckboxes from '@components/DynamicCheckboxes'
import CopyLoader from '@components/CopyLoader'
import moment from "moment";
import { formatDate } from "@helpers/CommonFunc";

const CopyWeekModal = (props) => {
    const {
        open,
        onClose,
        onConfirm,
        mealId,
        orderId,
        token,
        setAddSnackPop = () => { },
        weeksLen,
        orderData,
        selectedWeek,
        threshold_day,
        isRenewalPlan,
        renewalOrderId,
        renewalUserId,
        isPast
    } = props;

    const dispatch = useDispatch();
    const [AddsnackLoader, setAddsnackLoader] = useState(false)
    const [copyStatus, setCopyStatus] = useState("");
    const [checkedState, setCheckedState] = useState({});
    const totalWeeks = weeksLen; // Change this dynamically if needed
    // const ThisWeekContainsAThresoldDate = 
    const handleClose = () => {
        setAddsnackLoader(false);
        setCopyStatus("");
        setCheckedState({}); // Reset checkboxes
        onClose();
    }
    const handleSubmit = async () => {
        try {
            setAddsnackLoader(true);
            setCopyStatus("Preparing to copy meals...");

            // Identify the selected weeks
            const selectedWeeks = Object.keys(checkedState).filter(week => checkedState[week]);

            // Convert selectedWeek to match orderData index (week_1 -> index 0, week_2 -> index 1, etc.)
            const sourceWeekIndex = selectedWeek;
            const sourceWeekData = orderData[sourceWeekIndex];

            if (!sourceWeekData || !sourceWeekData?.data.length) {
                console.error("Invalid source week data");
                setAddsnackLoader(false);
                setCopyStatus("");
                return;
            }

            const source_week_start_date = formatDate(sourceWeekData?.data[0]?.delivery_date);

            // Extract source week end date (last delivery date)
            const source_week_end_date = formatDate(sourceWeekData?.data[sourceWeekData?.data.length - 1]?.delivery_date) || "";



            // Prepare API calls for each selected week
            const apiCalls = selectedWeeks.map(weekKey => {
                const targetWeekIndex = parseInt(weekKey.replace("week", "")) - 1;
                const targetWeekData = orderData[targetWeekIndex];

                if (!targetWeekData || !targetWeekData.data.length) return null;

                // Extract target week start & end dates
                const target_week_start_date = formatDate(targetWeekData.data[0]?.delivery_date) || "";
                const target_week_end_date = formatDate(targetWeekData.data[targetWeekData.data.length - 1]?.delivery_date) || "";

                // API payload
                const payload = {
                    target_week: targetWeekIndex + 1, // Convert back to human-readable week (1-based index)
                    source_week: selectedWeek + 1,
                    source_week_start_date,
                    source_week_end_date,
                    target_week_start_date,
                    target_week_end_date,
                    order_id: orderId,
                    token: token
                };

                setCopyStatus(`Copying week ${selectedWeek + 1} to target weeks...`);
                return dispatch(CopyMeals(payload)).then(unwrapResult);
                // return payload
            });

            // Execute all API calls in parallel
            const results = await Promise.all(apiCalls);

            if (results.some(res => res?.status == 200 || res?.status == 201)) {
                setCopyStatus("Finalizing...");
                if (isRenewalPlan) {
                    dispatch(
                        getRenewedPlanRequest({
                            token,
                            user_id: renewalUserId,
                            order_id: renewalOrderId
                        })
                    )
                        .then(() => {
                            dispatch(GetTickersRequest({ token }))
                            .then(unwrapResult)
                            setCopyStatus("Copy process completed!");
                            setAddsnackLoader(false);
                            handleClose()
                        })
                        .catch(err => {
                            console.error("Error in final API call:", err);
                            showFaliureToast("Final step failed: " + err?.response?.data?.data?.error);
                            setCopyStatus("Error in final step.");
                        });
                } else {
                    await dispatch(UpcomingOrdersRequest({ token }))
                        .then(unwrapResult)
                        .then(() => {
                            dispatch(GetTickersRequest({ token }))
                            .then(unwrapResult)
                            setCopyStatus("Copy process completed!");
                            setAddsnackLoader(false);
                            handleClose()
                        })
                        .catch(err => {
                            console.error("Error in final API call:", err);
                            showFaliureToast("Final step failed: " + err?.response?.data?.data?.error);
                            setCopyStatus("Error in final step.");
                        });
                }

            } else {
                setCopyStatus("Some weeks failed to copy.");
            }
            // Check for errors in responses

            console.log("API responses:", results);
            setAddsnackLoader(false);
        } catch (err) {
            console.error("Error in copying meals:", err);
            showFaliureToast("Error copying meals: " + err?.response?.data?.data?.error);
            setAddsnackLoader(false);
            setCopyStatus(``);
            setCheckedState({}); // Reset checkboxes
        }
    };

    // Initialize state when the component mounts or totalWeeks changes
    React.useEffect(() => {
        const initialState = {};
        for (let i = 1; i <= weeksLen; i++) {
            initialState[`week${i}`] = false;
        }
        setCheckedState(initialState);
    }, [weeksLen]); // Reinitialize if totalWeeks changes


    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
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
                sx={{
                    ...DialogSX,
                    scrollbarWidth: 'none', // For Firefox
                    '&::-webkit-scrollbar': { // For Chrome, Safari, and Opera
                        display: 'none',
                    },
                    '-ms-overflow-style': 'none', // For Internet Explorer and Edge
                    padding: { xs: "20px 20px", md: "60px 40px" },
                    backgroundSize:'130% !important'
                }}
            >
                <Typography
                    variant="h2"
                    sx={{...titleSX,bgcolor:'transparent'}}
                    color={AppColors.primaryGreen}>
                    {"WEEK COPIED!"}
                </Typography>
                <Box
                    onClick={onClose}
                    sx={{...closeIconSX,
                        color:AppColors.primaryGreen
                    }}
                >
                    <CloseIcon />
                </Box>

                <Box sx={{ my: 1, mt: 2 }}>
                    <Typography variant="body2"
                        sx={{
                            fontSize: { xs: '13px ', md: '18px' }
                        }}>
                        Now, select which week(s) you would like to copy these meals to:

                    </Typography>
                </Box>
                <Box sx={{ my: 2, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: "center" }}>
                    <DynamicCheckboxes
                        totalWeeks={totalWeeks}
                        checkedState={checkedState}
                        setCheckedState={setCheckedState}
                        dontRenderthisWeek={selectedWeek}
                        orderData={orderData}
                        thresholdDate={threshold_day}
                        isPast={isPast}
                    />
                </Box>
                {/* Confirm Bypass Button */}
                <CopyLoader isLoading={AddsnackLoader} copyStatus={copyStatus} />
                <Button
                    onClick={() => {
                        onConfirm ? onConfirm() : null;
                        handleSubmit()
                    }}
                    disabled={AddsnackLoader || isPast}
                    sx={buttonSX}
                >
                    {'Confirm'}
                </Button>

            </DialogContent>
        </Dialog >
    );
};

export default CopyWeekModal;