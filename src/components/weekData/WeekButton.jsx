import React, { useState } from 'react'
import Button from "@mui/material/Button"
import CustomTooltip from '@components/CustomTooltip';
import { Box, useMediaQuery } from '@mui/material';
import AppColors from '@helpers/AppColors';
import ReplayIcon from '@mui/icons-material/Replay';
import { formatDate } from '@helpers/CommonFunc';
import { getRenewedPlanRequest, GetTickersRequest, RevertMeals, UpcomingOrdersRequest } from 'store/reducers/dashboardReducer';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import RevertWeekModal from '../popUp/RevertWeekModal';
import DisabledWeekModal from '../popUp/DisabledWeekModal';
import { showFaliureToast } from '../../helpers/AppToast';

const WeekButton = ({ val, i,
    orders,
    handleClick, isPast, disableWeeks, handlePastWeekClick, isExecutive, activeIndex, WeeksCopied, isRenewedPlan,
    token,
    renewalUserId,
    renewalOrderId,
    order_id,
    showIcons,
    handleChange

}) => {
    const dispatch = useDispatch()

    const matchesSmallMobile = useMediaQuery("(max-width:565px)");
    const containsAthresday = val?.weekInThreshold;
    const complete_week = val?.complete_week;
    const pause_week = val?.pause_week;

    const textDis = () => {
        if (containsAthresday) return `Sorry, it’s too late to copy this week.`;
        if (pause_week) return `Sorry, this week has at least one pause day.`;
        if (!complete_week) return `Sorry, this week is not a complete week.`;
        return '';
    };
    const [openTooltip, setopenTooltip] = useState(false);
    const [loadingTool, setloadingTool] = useState(false);
    const [RevertPop, setRevertPop] = useState(false);
    const [DisbaledWeekPop, setDisbaledWeekPop] = useState(false);
    const orderID = isRenewedPlan ? renewalOrderId : order_id;

    const handleMealRevert = async () => {
        try {
            setloadingTool(true)
            if (!isPast) {
                const payload = {
                    revert_week: i + 1,
                    revert_week_start_date: formatDate(val?.startDate),
                    revert_week_end_date: formatDate(val?.endDate),
                    order_id: orderID,
                    token: token
                };
                await dispatch(RevertMeals(payload))
                    .then(unwrapResult)
                    .then(() => {
                        if (isRenewedPlan) {
                            dispatch(
                                getRenewedPlanRequest({
                                    token,
                                    user_id: renewalUserId,
                                    order_id: renewalOrderId
                                })
                            ).then(unwrapResult)
                            dispatch(GetTickersRequest({ token })).then(unwrapResult)
                            setloadingTool(false)
                            setRevertPop(false)
                        } else {
                            dispatch(UpcomingOrdersRequest({ token: token })).then(unwrapResult)
                            dispatch(GetTickersRequest({ token })).then(unwrapResult)
                            setloadingTool(false)
                            setRevertPop(false)
                        }
                    })
                    .catch((err) => {
                        showFaliureToast(`Couldn't revert week.`)
                        console.error("Error:", err)
                        setloadingTool(false)
                    });
            }
        } catch (error) {
            showFaliureToast(`Couldn't revert week.`)
            setloadingTool(false)
            console.error("Error:", error)
        }

    }
    const disabledWeek = isPast ? orders?.[val]?.past_data?.length === 0 : disableWeeks(i);
    return (
        <div style={{ width: 'max-content' }}>
            <Button
                // disabled={isPast ? orders?.[val]?.past_data?.length === 0 : disableWeeks(i)}
                sx={{
                    minWidth: "70px !important",
                    fontWeight: "300",
                    ":hover":{
                        backgroundColor: disabledWeek ?
                        "lightgray !important" :'',
                        color: disabledWeek ?
                        "black !important" :''
                    },
                    backgroundColor: disabledWeek ?
                    "lightgray" :
                    isExecutive ? (isPast ? "#fa7324" : "#fff") : "#D1EBE4",
                    border:disabledWeek?"gray": isExecutive ? "1px solid #fa7324" : "1px solid #D1EBE4",
                    color: AppColors.black,
                    padding: "6px 12px",
                    marginRight: "6px",
                    "@media (min-width: 768px)": { minWidth: "60px !important" },
                    position: "relative"
                }}
                key={i}
                className={activeIndex === i ? "ButtonActive" : ""}
                variant="contained"
                onClick={() => disabledWeek ?
                    setDisbaledWeekPop(true):
                    (isPast ? handlePastWeekClick(val.title, i) : handleClick(val.title, i))}
            >
                {`Week ${i + 1}`}
                {
                    showIcons &&
                    <CustomTooltip open={openTooltip} title={textDis()} placement="top"
                        onMouseEnter={() => {
                            setopenTooltip(true)
                        }}
                        onMouseLeave={() => {
                            setopenTooltip(false)
                        }}
                    >
                        <Box
                            sx={{
                                ...copyStyle,
                                bgcolor:
                                    containsAthresday || !complete_week || pause_week
                                        ? AppColors.lightgray
                                        : val?.source_copy
                                            ? AppColors.yellow
                                            : val?.target_copy
                                                ? AppColors.primaryOrange
                                                : AppColors?.primaryGreen
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (containsAthresday || !complete_week || pause_week) {
                                    setopenTooltip(!openTooltip);
                                    setTimeout(() => setopenTooltip(false), 3000);
                                } else {
                                    WeeksCopied(i);
                                }
                            }}
                        >
                            <img
                                src="/images/meal/copyicon.svg"
                                alt="copyicon"
                                style={{ marginBottom: matchesSmallMobile ? "2px" : "0px", width: matchesSmallMobile ? "11px" : "14px" }}
                            />
                        </Box>
                    </CustomTooltip>
                }
                {val?.target_copy && showIcons && (
                    <Box
                        sx={{
                            ...copyStyle,
                            top: "",
                            bottom: "-12px",
                            left: "-3px",
                            bgcolor: loadingTool ? AppColors?.lightgray : AppColors?.primaryGreen,
                            pointerEvents: loadingTool ? 'none' : 'auto'
                        }}
                        onClick={async (e) => {
                            e.stopPropagation();
                            setRevertPop(true)
                        }}
                    >
                        <ReplayIcon style={{ fontSize: matchesSmallMobile ? "12px" : "14px", color: "white" }} />
                    </Box>
                )}
            </Button>
            <RevertWeekModal
                open={RevertPop}
                onClose={() => { setRevertPop(false) }}
                onConfirm={handleMealRevert}
                weekName={`Week ${i + 1}`}
                loader={loadingTool}
                targetCopy={val?.source_week_name}
            />
            <DisabledWeekModal
            handleChange={handleChange}
                open={DisbaledWeekPop}
                onClose={() => { setDisbaledWeekPop(false) }}
            />

        </div>
    );
};
const copyStyle = {
    cursor: 'pointer',
    position: 'absolute',
    height: { xs: "16px", md: '22px' },
    width: { xs: "16px", md: '22px' },
    borderRadius: '20px',
    border: '2px solid white',
    top: '-13px',
    right: '-3px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}

export default WeekButton