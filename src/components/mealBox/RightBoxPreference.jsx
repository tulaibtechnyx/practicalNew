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

import { Box, Typography, Slider, styled, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import AppColors from '../../helpers/AppColors'
import { useSelector } from 'react-redux'
import { isLastIndex } from '@helpers/CommonFunc'
const RightBoxPreference = (props) => {
    const {
        disableOnchange,
        isLoading,
        currentTypeOfSlider,
        setCurrentTypeOfSlider,
        initialDataFromPropObj,
        onChangeWeek,
        onChangeDays,
        onChangeMeals,
        onChangeSnack,
        onChangeCalorie,
        onChangeCalorieOnlyPlanWhenMealsChanges = () => { },
        caloriBoxOnClick,
        snackBoxOnClick,
        caloriDisabler,
        snackDisabler,
        checkMealPlanChanges = false,
    } = props;
    const { decorationQuizData } = useSelector((state) => state.homepage);
    const { userProfile } = useSelector((state) => state.profile)

    const router = useRouter()
    const [mealPlanState, setMealPlanState] = useState([]);
    const [mealsPerDay, setMealsPerDay] = useState(null);
    const [snacksPerDay, setSnacksPerDay] = useState(null);
    const [deliveryDays, setDeliveryDays] = useState(null);
    const [weeks, setWeeks] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [previousValues, setPreviousValues] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [mealPlanInitialized, setMealPlanInitialized] = useState(false);
    const mobile786 = useMediaQuery("(max-width: 786px)")
    const mobile450 = useMediaQuery("(max-width: 450px)")
    const mobile400 = useMediaQuery("(max-width: 400px)")
    const desktop1400 = useMediaQuery("(max-width: 1400px)")
    const desktop1024 = useMediaQuery("(max-width: 1024px)")
    const desktop900 = useMediaQuery("(max-width: 900px)")
    const desktop850 = useMediaQuery("(max-width: 850px)")

    const values = {
        meal_days_per_week: deliveryDays,
        meal_plan_require_weeks: weeks,
        meals_deliver_per_day: initialDataFromPropObj?.meals_deliver_per_day,
        meal_plan: mealPlanState,
        snacks_deliver_per_day: snacksPerDay,
    };



    const getQuizConfigByKey = (key) => {
        return decorationQuizData?.decorationArray?.find(q => q.questionId === key);
    };
    const SnackQuestionConfig = getQuizConfigByKey(snackKey);
    let showQuestionLevelDecorBranding;

    if (userProfile) {
        if (userProfile.is_new_pricing_user === true) {
            showQuestionLevelDecorBranding = true;
        } else if (userProfile.is_new_pricing_user === false) { // means logged user is old user
            if (SnackQuestionConfig?.showToOldCustomers == true) {
                showQuestionLevelDecorBranding = true
            } else {
                showQuestionLevelDecorBranding = false;
            }
        } else {
            showQuestionLevelDecorBranding = true;
        }
    } else {
        showQuestionLevelDecorBranding = true;
    }
    console.log("showQuestionLevelDecorBranding",showQuestionLevelDecorBranding)

    const isOptionValueDisabled = (fieldKey, optionValue, currentValues) => {
        const question = getQuizConfigByKey(fieldKey);
        if (!question) return false;

        const option = question.options?.find(opt => opt.value === optionValue);
        if (!option || !Array.isArray(option.dynamicStates)) return false;

        return option.dynamicStates.some(rule => {
            const sourceQuestionId = rule.sourceQuestionId;
            if (!sourceQuestionId || !Array.isArray(rule.disabledValues)) return false;

            const currentValue = currentValues[sourceQuestionId];

            // Check if current source value matches any disabledValue
            return rule.disabledValues.some(dis =>
                String(dis.value) === String(currentValue)
            );
        });
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

    const handleSnacksPerDayChange = (newValue) => {

        setSnacksPerDay(newValue)
        setTypeOfSlider(newValue, snackKey)
        onChangeSnack(newValue, snackKey)
    };

    const handleMealCalorieChange = (index, newValue) => {
        if (index == null) {
            setMealPlanState([...mealPlanState]);
        } else {
            setMealPlanState((prev) => {
                const updated = [...prev];
                updated[index] = newValue;
                return updated;
            });
        }
        setTypeOfSlider(newValue, snackKey)
        onChangeCalorie(newValue, snackKey, index)
    };
    useEffect(() => {
        if (!mealPlanInitialized) return;
        if (!initialDataFromPropObj) return;
        if (initialDataFromPropObj?.meals_deliver_per_day == null) return;

        const defCalorie = initialDataFromPropObj?.default_calorie ?? 0;

        // ✅ Prefer backend reference plan
        const backendPlan =
            Array.isArray(initialDataFromPropObj?.meal_plan) && initialDataFromPropObj.meal_plan.length > 0
                ? initialDataFromPropObj.meal_plan
                : Array.isArray(initialDataFromPropObj?.meal_plan)
                    ? initialDataFromPropObj.meal_plan
                    : [];

        let updated = [...mealPlanState];
        let lastMealValue = updated[updated.length - 1] ?? defCalorie;
        setMealPlanState((prev = []) => {
            updated = [...prev];

            if (initialDataFromPropObj?.meals_deliver_per_day > updated.length) {
                const extraMeals = [];
                for (let i = updated.length; i < initialDataFromPropObj?.meals_deliver_per_day; i++) {
                    const backendValue = backendPlan[i];
                    // ✅ New meal should match the last meal’s calorie
                    // const lastMealValue = updated[updated.length - 1] ?? defCalorie;
                    lastMealValue = updated[updated.length - 1] ?? defCalorie;
                    extraMeals.push(backendValue ?? lastMealValue);
                }
                updated = [...updated, ...extraMeals];
            } else if (initialDataFromPropObj?.meals_deliver_per_day < updated.length) {
                // ✅ Just trim down safely
                updated = updated.slice(0, initialDataFromPropObj?.meals_deliver_per_day);
            }
            console.log("updated", updated)

            return updated;

        });
    }, [initialDataFromPropObj?.meals_deliver_per_day, mealPlanInitialized, initialDataFromPropObj]);

    useEffect(() => {
        if (!initialDataFromPropObj || mealPlanInitialized) return;

        const guest = initialDataFromPropObj || {};
        // initial meals count to consider during initialization
        const initialMeals =
            initialDataFromPropObj?.meals_deliver_per_day ??
            guest?.meals_deliver_per_day ??
            1;

        // prefer top-level meal_plan, then guest meal_plan, else empty
        const apiPlan =
            Array.isArray(initialDataFromPropObj?.meal_plan) && initialDataFromPropObj.meal_plan.length > 0
                ? [...initialDataFromPropObj.meal_plan]
                : Array.isArray(guest?.meal_plan) && guest.meal_plan.length > 0
                    ? [...guest.meal_plan]
                    : [];

        const defCalorie = guest?.default_calorie ?? 0;

        let initialPlan = [];

        if (apiPlan.length > 0) {
            // If API provided a plan, use it but ensure length === initialMeals
            if (apiPlan.length >= initialMeals) {
                initialPlan = apiPlan.slice(0, initialMeals);
            } else {
                // extend apiPlan to match initialMeals using last value or default
                const filler = apiPlan[apiPlan.length - 1] ?? defCalorie;
                initialPlan = [...apiPlan, ...Array(initialMeals - apiPlan.length).fill(filler)];
            }
        } else {
            // No API plan — use guest plan or fill with default calorie
            if (guest?.meal_plan?.length > 0) {
                const gp = [...guest.meal_plan];
                if (gp.length >= initialMeals) initialPlan = gp.slice(0, initialMeals);
                else initialPlan = [...gp, ...Array(initialMeals - gp.length).fill(gp[gp.length - 1] ?? defCalorie)];
            } else {
                initialPlan = Array(initialMeals).fill(defCalorie);
            }
        }
        setMealPlanState(initialPlan);
        // also ensure your mealsPerDay state is set accordingly if not already
        setMealsPerDay((prev) => prev ?? initialMeals);
        setMealPlanInitialized(true);
    }, [initialDataFromPropObj?.meals_deliver_per_day, mealPlanInitialized]);

    useEffect(() => {
        if (initialDataFromPropObj && !initialized) {
            const guest = initialDataFromPropObj || {};
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
    useEffect(() => {
        if (!previousValues) return;

        const diffs = [];

        if (previousValues.mealsPerDay !== mealsPerDay) diffs.push('mealsPerDay');
        if (previousValues.snacksPerDay !== snacksPerDay) diffs.push('snacksPerDay');
        if (previousValues.deliveryDays !== deliveryDays) diffs.push('deliveryDays');
        if (previousValues.weeks !== weeks) diffs.push('weeks');

        // Compare mealPlanState arrays by value (deep equality)
        const mealPlanChanged =
            JSON.stringify(previousValues.mealPlanState) !== JSON.stringify(mealPlanState);
        if (mealPlanChanged) diffs.push('mealPlanState');

        setHasChanges(diffs.length > 0);
    }, [mealsPerDay, snacksPerDay, deliveryDays, weeks, mealPlanState, previousValues]);

    useEffect(() => {
        // if(hasChanges){
        // onChangeSnack(snacksPerDay)
        onChangeCalorieOnlyPlanWhenMealsChanges(mealPlanState);
        // }
    }, [hasChanges, JSON.stringify(mealPlanState)])
    console.log("hasChanges", hasChanges)
    useEffect(() => {
        console.log("xxxx", mealsPerDay, hasChanges, snacksPerDay)
        hasChanges && onChangeSnack(snacksPerDay)
    }, [mealsPerDay, hasChanges, snacksPerDay]);



    useEffect(() => {
        if (!initialized) return;

        const currentValues = {
            [mealsKey]: initialDataFromPropObj?.meals_deliver_per_day,
            [snackKey]: snacksPerDay,
            [daysKey]: deliveryDays,
            [weekKey]: weeks,
        };

        const questionKey = snackKey;
        const questionConfig = getQuizConfigByKey(questionKey);
        if (!questionConfig) return;
        console.log("questionConfig", questionConfig)
        const showToOldCustomersQuesLevel = !!questionConfig?.showToOldCustomers;
        console.log("showToOldCustomersQuesLevel", showToOldCustomersQuesLevel);

        const isDisabled = isOptionValueDisabled(
            questionKey,
            currentValues[questionKey],
            currentValues
        );
        console.log("isDisabled", isDisabled)

        if (!showQuestionLevelDecorBranding) return;
        if (!isDisabled) return;

        console.warn("Current snack value disabled. Searching replacement…");

        // Find nearest valid option
        const replacement = questionConfig.options.find(opt =>
            !isOptionValueDisabled(
                questionKey,
                opt.value,
                { ...currentValues, [questionKey]: opt.value }
            )
        );
        console.log("replacement", replacement)

        if (replacement) {
            console.log("Auto-selecting:", replacement.value);
            setSnacksPerDay(replacement.value);
        } else {
            console.error("No valid replacement option found.");
        }
    }, [initialDataFromPropObj?.meals_deliver_per_day, snacksPerDay, deliveryDays, weeks, decorationQuizData, showQuestionLevelDecorBranding]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: "column",
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'

        }}>
            {/* Calories per meal */}
            <Box
                onClick={caloriBoxOnClick}
                sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ mb: 1 }} variant='p'>
                    Calories per Meal (Portion Size)
                </Typography>
                {mealPlanState?.map((calorie, index) => (
                    <Box key={index} sx={{
                        position: 'relative', display: 'flex', alignItems: 'center', gap: '10px', mb: isLastIndex(mealPlanState, index) ? "8px" : mobile450 ? "10px" : mobile786 ? '20px' : desktop1400 ? '20px' : '25px'
                    }}>
                        <Typography sx={{
                            fontSize: mobile400 ? '8px' : mobile450 ? '9px' : desktop1024 ? '10px' : '12px',
                            position: { xs: 'absolute' },
                            left: { md: desktop850 ? "-40px" : desktop900 ? "-55px" : desktop1024 ? '-60px' : desktop1400 ? "-68px" : '-75px', xs: mobile400 ? '-35px' : mobile450 ? '-50px' : '-60px' },
                            top: { md: '35%', xs: '30%' },
                            fontWeight: 'bold', p: "0 !important", m: "0 !important", minWidth: "60px"
                        }}>
                            Meal {index + 1}:
                        </Typography>
                        <BoxWithDiscountPromoPreference
                            extraOptionsWrapperstyles={{
                                gap: desktop900 ? "15px" : desktop1024 ? "20px" : desktop1400 ? '20px' : '30px',
                            }}
                            extraSxEpandRenewal={{
                                height: desktop1024 ? "40px" : desktop1400 ? '45px' : '55px',
                                width: desktop1024 ? "40px" : desktop1400 ? '45px' : '55px',
                                fontSize: desktop1024 ? "12px" : desktop1400 ? '14px' : '16px',
                            }}
                            PlanPreferenceChanger
                            EpandRenewal
                            isDisabledfromProp={isLoading}
                            isDisabledfromPropOnClickOnly={caloriDisabler}
                            promoDetails={null}
                            fieldToUpdate={mealPlanKey}
                            options={MealCalorieArray}
                            values={values}
                            value={calorie}
                            onChange={(newValue) => handleMealCalorieChange(index, newValue)}
                            arrayFind
                        />
                    </Box>
                ))}
                {/* {mealPlanState?.map((calorie, index) => (
                    <MealCalorieSlider
                        key={index}
                        mealName={`Meal ${index + 1}`}
                        calorieValue={calorie}
                        onChange={(newValue) => handleMealCalorieChange(index, newValue)}
                        isDisabled={caloriDisabler || isLoading}
                    />
                ))} */}
            </Box>
            {/* Snacks per day */}
            <Box
                onClick={snackBoxOnClick}
                sx={{ my: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ mb: 1, textAlign: 'center' }} variant='p'>
                    Number of snacks per day
                </Typography>
                <BoxWithDiscountPromoPreference
                    extraOptionsWrapperstyles={{
                        gap: desktop900 ? "15px" : desktop1024 ? "20px" : desktop1400 ? '25px' : '30px',
                    }}
                    extraSxEpandRenewal={{
                        height: desktop1024 ? "40px" : desktop1400 ? '45px' : '55px',
                        width: desktop1024 ? "40px" : desktop1400 ? '45px' : '55px',
                        fontSize: desktop1024 ? "12px" : desktop1400 ? '14px' : '19px',
                    }}
                    PlanPreferenceChanger
                    EpandRenewal
                    isDisabledfromProp={isLoading}
                    isDisabledfromPropOnClickOnly={snackDisabler}
                    promoDetails={null}
                    fieldToUpdate={snackKey}
                    options={SnacksArray}
                    values={values}
                    value={snacksPerDay}
                    onChange={handleSnacksPerDayChange}
                />
            </Box>

        </Box>
    )
}

export default RightBoxPreference;



const CustomSliderTrack = styled(Slider)(({ theme, value }) => ({
    color: AppColors.primaryGreen, // Green for food/health theme
    height: 6,
    padding: '15px 0',
    '& .MuiSlider-thumb': {
        height: 16,
        width: 16,
        backgroundColor: '#fff',
        border: `3px solid ${AppColors.primaryGreen}`,
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: '0 0 0 8px rgba(106, 168, 79, 0.16)', // Subtle hover effect
        },
    },
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-rail': {
        color: '#E0E0E0',
        opacity: 1,
    },
    '& .MuiSlider-mark': {
        backgroundColor: '#E0E0E0',
        height: 8,
        width: 1,
        marginTop: -3,
    },
    '& .MuiSlider-markLabel': {
        // Hide default marks if only showing min/max/current value
        display: 'none',
    },
}));

const MealCalorieSlider = ({ mealName, calorieValue, onChange, isDisabled }) => {
    // Defines the range and steps based on the common calorie options
    const minCalorie = MealCalorieArray[0] || 400;
    const maxCalorie = MealCalorieArray[MealCalorieArray.length - 1] || 800;
    const step = 100;

    const handleSliderChange = (event, newValue) => {
        // Ensure the value is rounded to the nearest step (100)
        const snappedValue = Math.round(newValue / step) * step;
        if (onChange) {
            onChange(snappedValue);
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100% !important',
            // maxWidth: 400, 
            py: 1,
            // borderBottom: '1px solid #f0f0f0' 
        }}>
            <Typography
                sx={{
                    fontWeight: 'medium',
                    minWidth: '80px',
                    color: '#4A4A4A'
                }}
            >
                {mealName}
            </Typography>

            <Box sx={{ flexGrow: 1, mr: '8px' }}>
                <CustomSliderTrack
                    value={calorieValue}
                    onChange={handleSliderChange}
                    min={minCalorie}
                    max={maxCalorie}
                    step={step}
                    disabled={isDisabled}
                    valueLabelDisplay="off"
                />
            </Box>

            <Typography
                sx={{
                    fontWeight: 'normal',
                    minWidth: '70px',
                    textAlign: 'right',
                    color: AppColors.primaryGreen
                }}
            >
                {calorieValue} Cal
            </Typography>
        </Box>
    );
};

