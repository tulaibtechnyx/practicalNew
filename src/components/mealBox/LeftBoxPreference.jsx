import BoxWithDiscountPromoPreference from '@components/BoxWithDiscountPromoPreference'
import {
    daysKey,
    weekKey,
    mealsKey,
    mealPlanKey,
    snackKey,
    MealCalorieArray,
    MealsArray,
    DaysArray,
    WeeksArray,
    SnacksArray
} from '@components/PlanPreferenceChanger'

import { Box, Typography, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
const LeftBoxPreference = (props) => {
    const {
        disableOnchange,
        isLoading,
        currentTypeOfSlider,
        setCurrentTypeOfSlider,
        initialDataFromPropObj,
        onChangeWeek,
        onChangeDays,
        onChangeMeals,
        weekBoxOnClick,
        daysBoxOnClick,
        mealsBoxOnClick,
        weeksDisabler,
        daysDisabler,
        mealsDisabler,
        weeksVisibility = true,
        daysVisibility = true,
        mealsVisibility = true,
    } = props;

    const router = useRouter()
    const [mealPlanState, setMealPlanState] = useState([]);
    const [mealsPerDay, setMealsPerDay] = useState(null);
    const [snacksPerDay, setSnacksPerDay] = useState(null);
    const [deliveryDays, setDeliveryDays] = useState(null);
    const [weeks, setWeeks] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [previousValues, setPreviousValues] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const desktop1400 = useMediaQuery("(max-width: 1400px)")
    const desktop1024 = useMediaQuery("(max-width: 1024px)")
    const desktop900 = useMediaQuery("(max-width: 900px)")
    const desktop850 = useMediaQuery("(max-width: 850px)")
  
    const values = {
        meal_days_per_week: deliveryDays,
        meal_plan_require_weeks: weeks,
        meals_deliver_per_day: mealsPerDay,
        meal_plan: mealPlanState,
        snacks_deliver_per_day: snacksPerDay,
    };

    const setTypeOfSlider = useCallback((type) => {
        setCurrentTypeOfSlider((prev) => {
            const updated = Array.isArray(prev) ? [...prev] : [];
            if (!updated.includes(type)) {
                updated.push(type);
            }
            return updated;
        });
    }, [setCurrentTypeOfSlider]);

    const handleMealsPerDayChange = (newValue) => {

        setMealsPerDay(newValue)
        setTypeOfSlider(mealsKey)
        onChangeMeals(newValue, mealsKey)
    };
    const handleSnacksPerDayChange = (newValue) => {

        setSnacksPerDay(newValue)
        setTypeOfSlider()
    };
    const handleDaysChange = (newValue) => {

        setDeliveryDays(newValue)
        setTypeOfSlider(daysKey)
        onChangeDays(newValue, daysKey)
    };
    const handleWeeksChange = (newValue) => {

        setWeeks(newValue)
        setTypeOfSlider(weekKey)
        onChangeWeek(newValue, weekKey)
    };

    useEffect(() => {
        if (initialDataFromPropObj && !initialized) {
            const guest = initialDataFromPropObj || {};
            console.log("guest", guest)
            const m = initialDataFromPropObj?.meals_deliver_per_day ?? 1;
            const s = initialDataFromPropObj?.snacks_deliver_per_day ?? 0;
            const d = initialDataFromPropObj?.meal_days_per_week ?? 5;
            const w = initialDataFromPropObj?.meal_plan_require_weeks ?? 1;

            setMealsPerDay(m);
            setSnacksPerDay(s);
            setDeliveryDays(d);
            setWeeks(w);

            // Save baseline for rollback
            setPreviousValues({
                mealsPerDay: m,
                snacksPerDay: s,
                deliveryDays: d,
                weeks: w,
                mealPlanState: initialDataFromPropObj?.meal_plan || guest?.meal_plan || [],
            });

            setInitialized(true);
        }
    }, [initialDataFromPropObj, initialized]);
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: "column",
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        }}>
            {/* Weeks */}
            {
                weeksVisibility &&
            <Box
                onClick={weekBoxOnClick}
                sx={{ mt: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ mb: 1, textAlign: 'center', fontSize: { md: '16px', xs: '14px' } }} variant='p'>
                    Number of weeks
                </Typography>
                <BoxWithDiscountPromoPreference
                    extraOptionsWrapperstyles={{
                        gap: desktop900 ? "15px" : desktop1024 ? "20px" : desktop1400 ? '25px' : '30px',
                    }}
                    extraSxEpandRenewal={{
                        height: desktop1024 ? "40px" : desktop1400 ? '45px' : '55px',
                        width: desktop1024 ? "40px" : desktop1400 ? '45px' : '55px',
                        fontSize: desktop1024 ? "12px" : desktop1400 ? '14px' : '16px',
                    }}
                    PlanPreferenceChanger
                    EpandRenewal
                    isDisabledfromProp={isLoading}
                    isDisabledfromPropOnClickOnly={weeksDisabler}
                    noModal={true}
                    promoDetails={null}
                    fieldToUpdate={weekKey}
                    options={WeeksArray}
                    values={values}
                    value={weeks}
                    onChange={handleWeeksChange}
                    tabbyCondition={mealsPerDay == 1 || mealsPerDay == '1'}
                />
            </Box>
            }
            {/* Delivery Days */}
            {
                daysVisibility &&
            <Box
                onClick={daysBoxOnClick}
                sx={{ my: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ mb: 1, textAlign: 'center', fontSize: { md: '16px', xs: '14px' } }} variant='p'>
                    Delivery Days per week
                </Typography>
                <BoxWithDiscountPromoPreference
                    extraOptionsWrapperstyles={{
                        gap: desktop900 ? "15px" : desktop1024 ? "20px" : desktop1400 ? '25px' : '30px',
                    }}
                    extraSxEpandRenewal={{
                        height: desktop1024 ? "40px" : desktop1400 ? '45px' : '55px',
                        width: desktop1024 ? "40px" : desktop1400 ? '45px' : '55px',
                        fontSize: desktop1024 ? "12px" : desktop1400 ? '14px' : '16px',
                    }}
                    PlanPreferenceChanger
                    EpandRenewal
                    isDisabledfromProp={isLoading}
                    isDisabledfromPropOnClickOnly={daysDisabler}
                    noModal={true}
                    promoDetails={null}
                    fieldToUpdate={daysKey}
                    options={DaysArray}
                    values={values}
                    value={deliveryDays}
                    onChange={handleDaysChange}
                />
            </Box>
            }
            {/* Meals per day */}
            {
                mealsVisibility && 
            <Box
                onClick={mealsBoxOnClick}
                sx={{ my: 1, display: 'flex', flexDirection: 'column', }}>
                <Typography sx={{ mb: 1, textAlign: 'center', fontSize: { md: '16px', xs: '14px' } }} variant='p'>
                    Number of meals per day
                </Typography>
                <BoxWithDiscountPromoPreference
                    extraSxEpandRenewal={{
                        height: desktop1024 ? "40px" : desktop1400 ? '45px' : '55px',
                        width: desktop1024 ? "40px" : desktop1400 ? '45px' : '55px',
                        fontSize: desktop1024 ? "12px" : desktop1400 ? '14px' : '16px',
                    }}
                    PlanPreferenceChanger
                    EpandRenewal
                    isDisabledfromProp={isLoading}
                    isDisabledfromPropOnClickOnly={mealsDisabler}
                    noModal={true}
                    promoDetails={null}
                    fieldToUpdate={mealsKey}
                    options={MealsArray}
                    values={values}
                    value={mealsPerDay}
                    onChange={handleMealsPerDayChange}
                    extraOptionsWrapperstyles={{
                        marginLeft: '0px',
                        marginRight: '0px',
                        gap: desktop900 ? "15px" : desktop1024 ? "20px" : desktop1400 ? '25px' : '30px',
                    }}
                />
            </Box>
            }

        </Box>
    )
}

export default LeftBoxPreference