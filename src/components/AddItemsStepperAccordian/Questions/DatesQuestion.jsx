import { Box, Chip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { dfac, dfjac } from '../../popUp/commonSX';
import AppColors from '../../../helpers/AppColors';
import CalendarsDateRangePicker from '../../mealBox/DayPickerRange/DayPickerRange'
import AppConstants from '../../../helpers/AppConstants';
import { liststyle } from './OtherQuestionOne';
import { useDispatch, useSelector } from 'react-redux';
import get from "lodash/get"
import moment from 'moment';
import { formatAllergens, isNull, parseAllergens, updateKeyInArray } from '@helpers/CommonFunc';
import { getPausePassDatesRequest } from 'store/reducers/dashboardReducer';
import AppLogger from '@helpers/AppLogger';
import ConfirmDates from '@components/popUp/confirmDates';
import 'animate.css'
import { useSwipeable } from 'react-swipeable';

const DatesQuestion = (props) => {
    const {
        AddItemType,
        snack = false,
        selectedItems,
        setSelectedItems,
        other = false,
        dates,
        setDates,
        handleClick,
        MealDate,
        setMealDate,
        setAlreadyOpened,
        itemIndex,
        setitemIndex = () => { },
        animationDirection,
        setAnimationDirection = () => { },
        itemIndexes,
        setitemIndexes = () => { },
    } = props;
    const dispatch = useDispatch()
    const { userProfile } = useSelector((state) => state.profile)
    const { startUpData } = useSelector((state) => state.home)
    const [disabledDates, setDisabledDates] = useState([])

    function convertToStartOfDay(dateString) {
        const date = new Date(dateString);
        date.setHours(0, 0, 0, 0); // Set to start of day
        return date;
    }

    const mealStartDate = userProfile?.profile?.meal_plan_start_date ?? null;
    const mealEndDate = userProfile?.profile?.meal_plan_end_date ?? null;
    const dayDelivery = userProfile?.profile?.days_food_delivery ?? [];
    const userPauseDates = userProfile?.pause_dates ?? [];
    const thresholdDate = moment(get(startUpData, "threshold_day", new Date())).toDate();

    const disableDatesHandler = (userPauseDates) => {
        try {
            const allDates = userPauseDates?.map((date) =>
                convertToStartOfDay(date?.meal_plan_pause_date)
            )
            setDisabledDates(allDates)

        } catch (Err) { console.log("err", Err) }
    }
    const pauseDatesHandler = (newDeliveryDates) => {

        if (newDeliveryDates && !other) {
            setDates(newDeliveryDates)
            // handleClick(newDeliveryDates)
        } else {
            updateKeyInArray(selectedItems?.[itemIndex]?.id, 'deliveryDates', newDeliveryDates, setSelectedItems)
            // handleClick(newDeliveryDates)
        }
    }

    const handlePauseDateThreshold = () => {
        const startMoment = moment(mealStartDate)

        if (thresholdDate) {
            if (startMoment.isSameOrAfter(thresholdDate)) {
                return startMoment.toDate()
            } else {
                return thresholdDate
            }
        }
    }

    useEffect(() => {
        if (userPauseDates?.length != 0 || userPauseDates != null) {
            disableDatesHandler(userPauseDates)
        }
    }, [userPauseDates?.length])

    const datesToMap = other ? selectedItems?.[itemIndex]?.deliveryDates : dates;
    const ItemText = AddItemType == AppConstants.AdditemModal.Meal ? "Meal(s)"
        : AddItemType == AppConstants.AdditemModal.Snack ? "Snack(s)" : "Item(s)";


    const leftArrowClick = () => {
        setAnimationDirection('slideInLeft')
        itemIndex <= 1 ?
            setitemIndex(0)
            :
            setitemIndex(itemIndex - 1)
    }
    const rightArrowClick = () => {
        setAnimationDirection('slideInRight')
        setAlreadyOpened(true)
        itemIndex == selectedItems?.length - 1 ?
            setitemIndex(selectedItems?.length - 1)
            :
            setitemIndex(itemIndex + 1)

        if (itemIndex == selectedItems?.length - 2) {
            setitemIndexes([...itemIndexes, itemIndex + 1, itemIndex + 2])
        } else {
            setitemIndexes([...itemIndexes, itemIndex + 1])
        }
    }
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => {
            if (itemIndex < selectedItems?.length - 1) {
                setAlreadyOpened(true)
                setAnimationDirection('slideInRight');
                setitemIndex(itemIndex + 1);
                if (itemIndex == selectedItems?.length - 2) {
                    setitemIndexes([...itemIndexes, itemIndex + 1, itemIndex + 2])
                } else {
                    setitemIndexes([...itemIndexes, itemIndex + 1])
                }
            }
        },
        onSwipedRight: () => {
            if (itemIndex > 0) {
                setAlreadyOpened(true)
                setAnimationDirection('slideInLeft');
                setitemIndex(itemIndex - 1);
                
            }
        },
        trackMouse: true, // Enables mouse drag support on web
    });
    return (
        <Box
            key={other ? selectedItems?.[itemIndex]?.id : AddItemType}
            sx={{ px: { xs: "20px", md: '30px' }, }}>
            <Typography sx={{ textAlign: 'center', fontSize: {xs:'14px ',md:'22px'}, fontWeight: 500 }}>
                Step 2:
            </Typography>
            <Typography sx={{ textAlign: 'center', mt: '5px', px: 1 ,fontSize: {xs:'14px ',md:'18px'}}}>
                Select the dates you want your added {ItemText} to be delivered.
                <br />
                {selectedItems?.length > 1 && 'Use the arrows or swipe left/right to choose a different item.'}
            </Typography>
            {
                other && selectedItems?.length >= 1 &&
                (
                    <>
                        <Box sx={{ ...dfac, gap: '10px', mt: '20px' }}>
                            {
                                <img
                                    onClick={leftArrowClick}
                                    src={"images/icons/arrow-down-counter.png"} alt="arrowup" style={{
                                        cursor: 'pointer', transform: 'rotate(90deg)',
                                        visibility: itemIndex != 0 ? 'visible' : 'hidden'
                                    }} />
                            }
                            <Box
                                key={selectedItems?.[itemIndex]?.id}
                                sx={{
                                    // ...liststyle,
                                    borderRadius: 2,
                                    transition: "0.3s ease",
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    flexWrap: { md: 'nowrap', xs: 'wrap' }
                                }}
                            >
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography
                                        color="textSecondary"
                                        sx={{ textAlign: 'center', fontSize: { sm: '14px', md: '22px' }, fontWeight: 400 }}>
                                        Item {`${itemIndex + 1} of ${selectedItems?.length}`}
                                    </Typography>
                                </Box>
                            </Box>{
                                <img
                                    onClick={rightArrowClick}
                                    src={"images/icons/arrow-down-counter.png"} alt="arrowup" style={{
                                        cursor: 'pointer', transform: 'rotate(270deg)',
                                        visibility: selectedItems?.length > 1 && itemIndex != selectedItems?.length - 1 ? 'visible' : 'hidden'

                                    }} />
                            }

                        </Box>
                        <Box sx={{ width: '100%', textAlign: 'center' }}>
                            <Typography sx={{ textAlign: 'center', mt: '5px', fontSize: { sm: '14px', md: '22px' }, fontWeight: 600 }}>
                                {selectedItems?.[itemIndex]?.title}
                            </Typography>
                            {
                                !isNull(selectedItems?.[itemIndex]?.allergens) &&
                                    <Typography fontSize={12} color="textSecondary">
                                        Allergen: {formatAllergens(parseAllergens(selectedItems?.[itemIndex]?.allergens))}
                                    </Typography>
                            }
                        </Box>
                    </>
                )
            }
            {/* OLD NORMAL CALENDER */}
            {/* <Box sx={{
                bgcolor: AppColors.appLightGreen,
                padding: '30px',
                borderRadius: '14px',
                mt: other ? "10px" : '0px',
                display: 'flex',
                justifyContent: 'center'
                // mr: 2
            }}
                key={selectedItems?.[itemIndex]?.id}

            >
                <CalendarsDateRangePicker
                    key={selectedItems?.[itemIndex]?.id}
                    ShowCalenderDirectly={true}
                    justRunSaveOnChange={true}
                    toggleShowAll={false}
                    showAll={false}
                    condition={false}
                    valuePropFromOldPicker={datesToMap}
                    minDate={handlePauseDateThreshold()}
                    maxDate={mealEndDate}
                    disablePicker={false}
                    format={AppConstants.dateFormat}
                    disabledDates={disabledDates}
                    days_food_delivery={dayDelivery}
                    setMealPlanPauseDateLocal={() => { }}
                    handleFormChangeData={() => { }}
                    onChangeHanlder={(e) => {
                        // pauseDatesHandler(e)
                    }}
                    // justRunOnChangeOnSave={true}
                    convertToDefinedFormateWhileSaving={true}
                    onSaveDatePressHandler={pauseDatesHandler}
                    dropdownBoxsx={{ bottom: '40px' }}
                    saveButtonText='Save Dates'
                    showSavebutton={false}
                />
            </Box> */}

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    mt: other ? "10px" : '0px',
                    position: 'relative',
                }}
                {...swipeHandlers}

            >
                {itemIndex > 0 && (
                    <Box sx={{
                        opacity: 0.4,
                        display: other ? { xs: 'none', md: 'block' } : 'none',
                        position: 'absolute',
                        left: '-180px',
                        cursor: 'pointer',
                    }}
                        onClick={leftArrowClick}
                        className={`animate__animated animate__fadeIn `}
                    >
                        <Box sx={{ pointerEvents: 'none', opacity: 0.4 }}>
                            <CalendarsDateRangePicker
                                key={selectedItems?.[itemIndex - 1]?.id}
                                ShowCalenderDirectly={true}
                                justRunSaveOnChange={false}
                                toggleShowAll={false}
                                showAll={false}
                                condition={false}
                                valuePropFromOldPicker={selectedItems?.[itemIndex - 1]?.deliveryDates}
                                minDate={handlePauseDateThreshold()}
                                maxDate={mealEndDate}
                                disablePicker={true}
                                format={AppConstants.dateFormat}
                                disabledDates={disabledDates}
                                days_food_delivery={dayDelivery}
                                convertToDefinedFormateWhileSaving={true}
                                showSavebutton={false}
                            />
                        </Box>
                    </Box>
                )}

                <Box
                    key={selectedItems?.[itemIndex]?.id}
                    sx={{
                        bgcolor: AppColors.appLightGreen,
                        padding: '30px',
                        borderRadius: '14px',
                    }}
                    className={`noselect animate__animated animate__${animationDirection} animate__faster`}
                // key={selectedItems?.[itemIndex]?.id}
                // sx={{
                //     bgcolor: AppColors.appLightGreen,
                //     padding: '30px',
                //     borderRadius: '14px',
                // }}
                // className={`animate__animated animate__${animationDirection} animate__faster`}
                >
                    <CalendarsDateRangePicker
                        key={selectedItems?.[itemIndex]?.id}
                        ShowCalenderDirectly={true}
                        justRunSaveOnChange={true}
                        toggleShowAll={false}
                        showAll={false}
                        condition={false}
                        valuePropFromOldPicker={datesToMap}
                        minDate={handlePauseDateThreshold()}
                        maxDate={mealEndDate}
                        disablePicker={false}
                        format={AppConstants.dateFormat}
                        disabledDates={disabledDates}
                        days_food_delivery={dayDelivery}
                        setMealPlanPauseDateLocal={() => { }}
                        handleFormChangeData={() => { }}
                        onChangeHanlder={(e) => { }}
                        convertToDefinedFormateWhileSaving={true}
                        onSaveDatePressHandler={pauseDatesHandler}
                        dropdownBoxsx={{ bottom: '40px' }}
                        saveButtonText='Save Dates'
                        showSavebutton={false}
                    />
                </Box>

                {itemIndex < selectedItems?.length - 1 && (
                    <Box sx={{
                        opacity: 0.4,
                        display: other ? { xs: 'none', md: 'block' } : 'none',
                        position: 'absolute',
                        right: '-180px',
                        cursor: 'pointer',
                    }}
                        className={`animate__animated animate__fadeIn `}
                        onClick={rightArrowClick}
                    >
                        <Box sx={{ pointerEvents: 'none', opacity: 0.4 }}>
                            <CalendarsDateRangePicker
                                key={selectedItems?.[itemIndex + 1]?.id}
                                ShowCalenderDirectly={true}
                                justRunSaveOnChange={false}
                                toggleShowAll={false}
                                showAll={false}
                                condition={false}
                                valuePropFromOldPicker={selectedItems?.[itemIndex + 1]?.deliveryDates}
                                minDate={handlePauseDateThreshold()}
                                maxDate={mealEndDate}
                                disablePicker={true}
                                format={AppConstants.dateFormat}
                                disabledDates={disabledDates}
                                days_food_delivery={dayDelivery}
                                convertToDefinedFormateWhileSaving={true}
                                showSavebutton={false}
                            />
                        </Box>
                    </Box>
                )}
            </Box>


        </Box>
    )
}
const chipStyle = {
    borderColor: AppColors.primaryGreen,
    color: AppColors.black,
    marginTop: "10px",
    marginLeft: "10px",
    marginBottom: "5px",
    width: "90px",
    "@media(minWidth: 768px)": {
        marginTop: "20px"
    }
}
export default DatesQuestion