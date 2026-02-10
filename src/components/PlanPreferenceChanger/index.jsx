import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, useMediaQuery } from '@mui/material';
import BoxWithDiscountPromoPreference from '@components/BoxWithDiscountPromoPreference';
import AppConstants from '@helpers/AppConstants';
import { isLastIndex, isPromoValidV2Message } from '../../helpers/CommonFunc';
import PromoInvalidModal from './PromoModal';
import CustomConfirmationModal from '@components/custom-confirmation-modal';
import { useRouter } from 'next/router';
import AppRoutes from '../../helpers/AppRoutes';
import { useSelector } from 'react-redux';

let counter = 0;
const PlanPreferenceChanger = ({ promoDetails, resultData, resultDataRequest, handleInvalidPromoCode, loading = false, refForPreferenceChangeBox ,setResultChangedStatus, isExecutive}) => {

    const router = useRouter()
    const { decorationQuizData } = useSelector((state) => state.homepage);
    const [mealPlanState, setMealPlanState] = useState([]);
    const [mealsPerDay, setMealsPerDay] = useState(null);
    const [snacksPerDay, setSnacksPerDay] = useState(null);
    const [deliveryDays, setDeliveryDays] = useState(null);
    const [weeks, setWeeks] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [mealPlanInitialized, setMealPlanInitialized] = useState(false);
    const [promoModalOpen, setPromoModalOpen] = useState(false);
    const [promoReason, setPromoReason] = useState('');
    const [previousValues, setPreviousValues] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [CustomConfirmationModalState, setCustomConfirmationModalState] = useState(false);
    const [changesDetectModal, setchangesDetectModal] = useState(false);
    const [changedFields, setChangedFields] = useState([]);
    const mobile786 = useMediaQuery("(max-width: 786px)")
    const mobile450 = useMediaQuery("(max-width: 450px)")
    const mobile520 = useMediaQuery("(max-width: 520px)")
    // 🔹 Snapshot of last valid data (for rollback)
    // ✅ Unified values object (passed to all child components)
    const values = {
        meal_days_per_week: deliveryDays,
        meal_plan_require_weeks: weeks,
        meals_deliver_per_day: mealsPerDay,
        meal_plan: mealPlanState,
        snacks_deliver_per_day: snacksPerDay,
    };

    // All handlers

    // ----------------------------------------------------
    // 🔸 HELPER FUNCTION TO READ QUIZ CONFIG
    // ----------------------------------------------------
    const getQuizConfigByKey = (key) => {
        return decorationQuizData?.decorationArray?.find(item => item.questionId === key);
    };

    const isOptionValueDisabled = (fieldKey, optionValue, currentValues) => {
        const config = getQuizConfigByKey(fieldKey);

        // 1. Check if the current option value is listed as disabled
        // Note: The optionValue must match the key in disabledValues (usually string or number)
        // const disabledValueConfig = config?.dynamicStates?.disabledValues?.[`${optionValue}`];
        const disabledValueConfig = config?.options?.find(opt => opt.value === optionValue)?.dynamicStates;
        if (!disabledValueConfig) {
            return false; // Not explicitly disabled
        }

        // 2. Check the condition (dependency field and value)
        const dependencyFieldKey = disabledValueConfig?.[0]?.sourceQuestionId;
        const dependencyCurrentValue = currentValues[dependencyFieldKey];

        // The specific rule logic from the user context: 
        // If snacks 0 is the value being checked, it is disabled if mealsPerDay is 1.
        if (fieldKey === snackKey && optionValue === 0) {
            if (dependencyFieldKey === mealsKey) {
                // Check if the dependency value is 1 (number or string)
                if (Number(dependencyCurrentValue) === 1) {
                    return true;
                }
            }
        }

        return false;
    };


    const handleMealCalorieChange = (index, newValue) => {
        setMealPlanState((prev) => {
            const updated = [...prev];
            updated[index] = newValue;
            return updated;
        });
        // handleSave(false)
    };
    const handleMealsPerDayChange = (newValue) => {
        setMealsPerDay(newValue)
        // handleSave(false)
    };
    const handleSnacksPerDayChange = (newValue) => {
        setSnacksPerDay(newValue)
        // handleSave(false)
    };
    const handleDaysChange = (newValue) => {
        setDeliveryDays(newValue)
        // handleSave(false)
    };
    const handleWeeksChange = (newValue) => {
        setWeeks(newValue)
        // handleSave(false)
    };

    const handleRedirect = () => {
        router.push(AppRoutes.signup);
    };
    const handleSave = (redirect = false) => {
        console.log('promo details on save',promoDetails)
        const { isValid, message } = isPromoValidV2Message(promoDetails, {
            AllMeals: mealsPerDay,
            AllSnacks: snacksPerDay,
            AllDays: deliveryDays,
            AllWeeks: weeks,
        });

        if (!isValid) {
            setPromoReason(message);
            setPromoModalOpen(true);
            return;
        }

        // ✅ Check if user added a new meal
        const addedMeal =
            previousValues && mealsPerDay > previousValues.mealsPerDay;

        if (addedMeal && redirect) {
            // 🔸 Show confirmation modal before saving
            setCustomConfirmationModalState(true);
        } else {
            // 🔸 Directly save and redirect (no modal)
            const snackPlan = Array(snacksPerDay).fill(200);
            const updatedData = {
                ...resultData,
                meal_plan: mealPlanState,
                meals_deliver_per_day: mealsPerDay,
                snacks_deliver_per_day: snacksPerDay,
                meal_days_per_week: deliveryDays,
                meal_plan_require_weeks: weeks,
                snack_plan: snackPlan,
                is_executive: isExecutive
            };
            const { plan_week, ...newData } = updatedData;

            resultDataRequest(newData).then(() => {
                if (redirect) router.push(AppRoutes.signup);
            })
            setPreviousValues({
                mealsPerDay,
                snacksPerDay,
                deliveryDays,
                weeks,
                mealPlanState: [...mealPlanState],
            });


            // ✅ redirect only after save
        }
    };


    const handlePromoConfirm = () => {
        handleInvalidPromoCode();

        const snackPlan = Array(snacksPerDay).fill(200);
        const { plan_week, ...newData } = {
            ...resultData,
            meal_plan: mealPlanState,
            meals_deliver_per_day: mealsPerDay,
            snacks_deliver_per_day: snacksPerDay,
            meal_days_per_week: deliveryDays,
            meal_plan_require_weeks: weeks,
            snack_plan: snackPlan,
        };

        resultDataRequest(newData);
        setPromoModalOpen(false);
        setchangesDetectModal(false)
        console.log("⚠️ Promo invalid but continued:", newData);
    };
    const cancelButtonAndRevertToPrevState = () => {
        if (previousValues) {
            setMealsPerDay(previousValues.mealsPerDay);
            setSnacksPerDay(previousValues.snacksPerDay);
            setDeliveryDays(previousValues.deliveryDays);
            setWeeks(previousValues.weeks);
            setMealPlanState([...previousValues.mealPlanState]);
        }
        setPromoModalOpen(false);
        setchangesDetectModal(false)
        console.log("↩️ Changes reverted to last valid state");
    };

    const handleConfirmationYes = () => {
        const snackPlan = Array(snacksPerDay).fill(200);
        const updatedData = {
            ...resultData,
            meal_plan: mealPlanState,
            meals_deliver_per_day: mealsPerDay,
            snacks_deliver_per_day: snacksPerDay,
            meal_days_per_week: deliveryDays,
            meal_plan_require_weeks: weeks,
            snack_plan: snackPlan,
        };
        const { plan_week, ...newData } = updatedData;
        resultDataRequest(newData).then(() => {
            // router.push(AppRoutes.signup); // ✅ redirect only after save
        })
        setPreviousValues({
            mealsPerDay,
            snacksPerDay,
            deliveryDays,
            weeks,
            mealPlanState: [...mealPlanState],
        });
        setCustomConfirmationModalState(false)
        setchangesDetectModal(false)
        document.body.style.overflow = 'auto'

    }
    const handleConfirmationCancel = () => {
        setCustomConfirmationModalState(false)
        setchangesDetectModal(false)
        document.body.style.overflow = 'auto'
    }

    useEffect(() => {
        if (resultData && !initialized) {
            console.log("resultData",resultData)
            const guest = resultData?.guest_detail || {};
            console.log("guest",guest)
            const m = resultData?.meals_deliver_per_day ?? guest?.meals_deliver_per_day ??null;
            const s = resultData?.snacks_deliver_per_day ?? guest?.snacks_deliver_per_day ??null;
            const d = resultData?.meal_days_per_week ?? guest?.meal_days_per_week ??null;
            const w = resultData?.meal_plan_require_weeks ?? guest?.meal_plan_require_weeks ??null;
            const ps = resultData?.meal_plan ?? guest?.meal_plan ?? [];
            if(m == null && s == null && d == null && w == null && ps.length === 0){
                return
            }
            setMealsPerDay(m);
            setSnacksPerDay(s);
            setDeliveryDays(d);
            setWeeks(w);
            setMealPlanState(ps);   
            // Save baseline for rollback
            setPreviousValues({
                mealsPerDay: m,
                snacksPerDay: s,
                deliveryDays: d,
                weeks: w,
                mealPlanState: [...ps],
            });

            setInitialized(true);
            setMealPlanInitialized(true);
        }
    }, [resultData, initialized]);
    // ---------- 1) Initialize once when resultData arrives ----------
    useEffect(() => {
        if (!resultData || mealPlanInitialized) return;

        const guest = resultData?.guest_detail || {};
        // initial meals count to consider during initialization
        const initialMeals =
            resultData?.meals_deliver_per_day ??
            guest?.meals_deliver_per_day ??
            1;

        // prefer top-level meal_plan, then guest meal_plan, else empty
        const apiPlan =
            Array.isArray(resultData?.meal_plan) && resultData.meal_plan.length > 0
                ? [...resultData.meal_plan]
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
    }, [resultData, mealPlanInitialized]);

    useEffect(() => {
        if (!mealPlanInitialized) return;
        if (!resultData) return;
        if (mealsPerDay == null) return;

        const defCalorie = resultData?.guest_detail?.default_calorie ?? 0;

        // ✅ Prefer backend reference plan
        const backendPlan =
            Array.isArray(resultData?.meal_plan) && resultData.meal_plan.length > 0
                ? resultData.meal_plan
                : Array.isArray(resultData?.guest_detail?.meal_plan)
                    ? resultData.guest_detail.meal_plan
                    : [];

        setMealPlanState((prev = []) => {
            let updated = [...prev];

            if (mealsPerDay > updated.length) {
                const extraMeals = [];
                for (let i = updated.length; i < mealsPerDay; i++) {
                    const backendValue = backendPlan[i];
                    // ✅ New meal should match the last meal’s calorie
                    const lastMealValue = updated[updated.length - 1] ?? defCalorie;
                    extraMeals.push(backendValue ?? lastMealValue);
                }
                updated = [...updated, ...extraMeals];
            } else if (mealsPerDay < updated.length) {
                // ✅ Just trim down safely
                updated = updated.slice(0, mealsPerDay);
            }

            return updated;
        });
    }, [mealsPerDay, mealPlanInitialized, resultData]);
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

        setChangedFields(diffs);
        setHasChanges(diffs.length > 0);
    }, [mealsPerDay, snacksPerDay, deliveryDays, weeks, mealPlanState, previousValues]);


    // ---------- 3) CORE FIX: Correct snacksPerDay if current value becomes disabled ----------
    useEffect(() => {
        // Only run if both values are set
        if (snacksPerDay === null || mealsPerDay === null) return;

        const currentValues = {
            [mealsKey]: mealsPerDay,
            [snackKey]: snacksPerDay,
        };

        // Check if the currently selected snacksPerDay value is now disabled
        const isCurrentSnackDisabled = isOptionValueDisabled(snackKey, snacksPerDay, currentValues);
        if (isCurrentSnackDisabled) {
            console.log(`Selected snack value (${snacksPerDay}) is now disabled (Meals: ${mealsPerDay}). Searching for enabled option.`);

            const snackConfig = getQuizConfigByKey(snackKey);
            const allSnackOptions = snackConfig?.options || [];

            // Find the first option that is NOT disabled by the current mealsPerDay setting
            const nextClosestOption = allSnackOptions.find(option => {
                const optionValue = option.value;

                // Check if this potential new value is also disabled.
                // If isOptionValueDisabled returns false, this option is valid.
                return !isOptionValueDisabled(snackKey, optionValue, { [mealsKey]: mealsPerDay, [snackKey]: optionValue });
            });
            if (nextClosestOption) {
                console.log(` Auto-selecting next available snack option: ${nextClosestOption.value}`);
                // Use Number() just in case the value is a string in the options array
                setSnacksPerDay(Number(nextClosestOption.value));
            } else {
                console.error(" No available snack option found after meal change.");
            }
        }
    }, [mealsPerDay, snacksPerDay, decorationQuizData]); // Depends on mealsPerDay change

    useEffect(() => {
        if (!refForPreferenceChangeBox?.current) return;

        const handleClickOutside = (event) => {
            if (
                hasChanges &&
                refForPreferenceChangeBox.current &&
                !refForPreferenceChangeBox.current.contains(event.target)
            ) {
                setchangesDetectModal(true);
                document.body.style.overflow = 'hidden';
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [hasChanges, refForPreferenceChangeBox]);

    useEffect(() => {
        if (hasChanges) {
            handleSave(false)
        }
    }, [hasChanges])

    console.log("counter",counter++)
    console.log("initialized",initialized)
    console.log("previousValues",previousValues)
    console.log("hasChanges",hasChanges)
    console.log("changedFields",changedFields)
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            {/* Meals per day */}
            <Box sx={{ my: 1, display: 'flex', flexDirection: 'column', width: { md: '60%', xs: '100%' } }}>
                <Typography sx={{ mb: 1, fontSize: { md: '22px', xs: '16px' }, fontWeight: '500' }}>
                    Number of meals per day
                </Typography>
                <BoxWithDiscountPromoPreference
                    PlanPreferenceChanger
                    promoDetails={promoDetails}
                    fieldToUpdate={mealsKey}
                    options={MealsArray}
                    values={values}
                    value={mealsPerDay}
                    onChange={handleMealsPerDayChange}
                />
            </Box>

            {/* Snacks per day */}
            <Box sx={{ my: 1, display: 'flex', flexDirection: 'column', width: { md: '60%', xs: '100%' } }}>
                <Typography sx={{ mb: 1, fontSize: { md: '22px', xs: '16px' }, fontWeight: '500' }}>
                    Number of snacks per day
                </Typography>
                <BoxWithDiscountPromoPreference
                    PlanPreferenceChanger
                    promoDetails={promoDetails}
                    fieldToUpdate={snackKey}
                    options={SnacksArray}
                    values={values}
                    value={snacksPerDay}
                    onChange={handleSnacksPerDayChange}
                />
            </Box>

            {/* Calories per meal */}
            <Box sx={{ my: 1, display: 'flex', flexDirection: 'column', width: { md: '60%', xs: '100%' }, alignItems: 'center' }}>
                <Typography sx={{ mb: 1, fontSize: { md: '22px', xs: '16px' }, fontWeight: '500' }}>
                    Calories per Meal (Portion Size)
                </Typography>
                {mealPlanState?.map((calorie, index) => (
 
                    // <Box key={index} sx={{ display: 'flex',
                    //  alignItems: 'center',
                    //  gap: '10px',
                    //  mb: isLastIndex(mealPlanState,index) ? "8px" : mobile450?"10px": mobile786 ? '20px':'25px', 
                    //  position: 'relative',
                    //  }}>
                    //     <Typography 
                    //     sx={{ 
                    //          fontWeight: 'bold',
                    //          fontSize: mobile450 ? '11px' : mobile786 ? '12px' :'14px',
                    //          p: "0 !important",
                    //          m: "0 !important",
                    //          width: {md:"60px",xs:'45px'} ,
                    //          }}>
                    //         Meal {index + 1}:
                    //     </Typography>
                                       <Box key={index} sx={{ display: 'flex',
                     alignItems: 'center',
                     gap: '10px',
                     mb: isLastIndex(mealPlanState,index) ?mobile450?"4px": "8px" : mobile450?"10px": mobile786 ? '20px':'25px', 
                     position: 'relative',
                     }}>
                        <Typography 
                        sx={{ 
                             fontWeight: 'bold',
                             fontSize: mobile450 ? '10px' :  mobile520 ? '12px' : '14px',
                             p: "0 !important",
                             m: "0 !important",
                             minWidth: "60px" ,
                             position: 'absolute',
                             left: {md:'-85px',xs: mobile450 ? '-65px': mobile520 ? '-60px': '-85px'},
                             top: {md:'35%',xs:'30%'},
                             }}>
                            Meal {index + 1}:
                        </Typography>
                        <BoxWithDiscountPromoPreference
                            PlanPreferenceChanger
                            promoDetails={promoDetails}
                            fieldToUpdate={mealPlanKey}
                            options={MealCalorieArray}
                            values={values}
                            value={calorie}
                            onChange={(newValue) => handleMealCalorieChange(index, newValue)}
                            arrayFind
                        />
                    </Box>
                ))}
            </Box>
            {/* Delivery Days */}
            <Box sx={{ my: 1, display: 'flex', flexDirection: 'column', width: { md: '60%', xs: '100%' } }}>
                <Typography sx={{ mb: 1, fontSize: { md: '22px', xs: '16px' }, fontWeight: '500' }}>
                    Delivery Days per week
                </Typography>
                <BoxWithDiscountPromoPreference
                    PlanPreferenceChanger
                    promoDetails={promoDetails}
                    fieldToUpdate={daysKey}
                    options={DaysArray}
                    values={values}
                    value={deliveryDays}
                    onChange={handleDaysChange}
                />
            </Box>

            {/* Weeks */}
            <Box sx={{ my: 1, display: 'flex', flexDirection: 'column', width: { md: '60%', xs: '100%' } }}>
                <Typography sx={{ mb: 1, fontSize: { md: '22px', xs: '16px' }, fontWeight: '500' }}>
                    Number of weeks
                </Typography>
                <BoxWithDiscountPromoPreference
                    PlanPreferenceChanger
                    promoDetails={promoDetails}
                    fieldToUpdate={weekKey}
                    options={WeeksArray}
                    values={values}
                    value={weeks}
                    onChange={handleWeeksChange}
                    tabbyCondition={mealsPerDay == 1 || mealsPerDay == '1'}
                />
            </Box>

            {/* Save Button */}
            <Box sx={{ mt: 3 }}>
                {/* <Button
                    disabled={loading || !hasChanges}
                    variant='contained' color='primary' sx={{ minWidth: '190px' }} onClick={()=>handleSave()}>
                    {loading ? "Updating your plan" : hasChanges ? "Save Changes" : "No Changes"}
                </Button>
                <br /> */}
                {/* <Button
                    disabled={loading || !hasChanges}
                    variant='contained' color='primary' sx={{ minWidth: '240px', }} onClick={() => handleSave(true)}>
                    {loading ? "Updating your plan" : hasChanges ? "Save Changes & Sign Up" : "No Changes"}
                </Button> */}
                <Button
                    disabled={loading}
                    variant='contained' color='primary' sx={{ minWidth: '240px', }} onClick={() => handleRedirect()}>
                    {"Continue to Sign Up"}
                </Button>
            </Box>
            {promoModalOpen && (
                <PromoInvalidModal
                    open={promoModalOpen}
                    reason={promoReason}
                    onConfirm={handlePromoConfirm}
                    onCancel={cancelButtonAndRevertToPrevState} // ✅ rollback handler
                />
            )}
            {CustomConfirmationModalState && (
                <CustomConfirmationModal
                    open={CustomConfirmationModalState}
                    reason={promoReason}
                    onCancelBtnTitle={'Yes I am, take me to Sign Up'}
                    onConfirmBtnTitle={'Go Back'}
                    variantCancel={"contained"}
                    variantConifrm={"text"}
                    modalColorType="white"
                    modalDescription="Please confirm you are happy with the
                                    Calories selected for your Added Meal(s)?"
                    modalDescriptionSx={{ fontWeight: '500', fontSize: { md: '20px', xs: '14px', mb: '10px' }, my: '10px' }}
                    extraSx={{
                        p: { md: '10px', xs: '0px' },
                        border: '5px solid #a7c1b9',
                        borderRadius: { md: '70px !important', xs: '40px !important' },
                        maxWidth: { md: '500px', xs: '320px' }
                    }}
                    handleConfirm={handleConfirmationCancel}
                    handleCancel={handleConfirmationYes} // ✅ rollback handler
                />
            )}
            {!promoModalOpen && !CustomConfirmationModalState && changesDetectModal && (
                <CustomConfirmationModal
                    open={changesDetectModal}
                    reason={promoReason}
                    onCancelBtnTitle={'Save Changes'}
                    onConfirmBtnTitle={'Discard'}
                    variantCancel={"contained"}
                    variantConifrm={"text"}
                    modalColorType="white"
                    modalDescription="You have made changes in preference please save or discard changes before doing any other action."
                    modalDescriptionSx={{ fontWeight: '500', fontSize: { md: '20px', xs: '14px', mb: '10px' }, my: '10px' }}
                    extraSx={{
                        p: { md: '10px', xs: '0px' },
                        border: '5px solid #a7c1b9',
                        borderRadius: { md: '70px !important', xs: '40px !important' },
                        maxWidth: { md: '500px', xs: '320px' }
                    }}
                    handleConfirm={() => {
                        cancelButtonAndRevertToPrevState();
                        setchangesDetectModal(false)
                        document.body.style.overflow = 'auto';
                    }
                    }
                    handleCancel={() => {
                        // handleConfirmationYes();
                        handleSave(false);
                        setchangesDetectModal(false)
                        document.body.style.overflow = 'auto';
                    }
                    } // ✅ rollback handler
                />
            )}

        </Box>
    );
};

export default PlanPreferenceChanger;
export const daysKey = AppConstants.quizQuestionsTypeKeys.meal_days_per_week;
export const weekKey = AppConstants.quizQuestionsTypeKeys.meal_plan_require_weeks;
export const mealsKey = AppConstants.quizQuestionsTypeKeys.meals_deliver_per_day;
export const mealPlanKey = AppConstants.quizQuestionsTypeKeys.meal_plan;
export const snackKey = AppConstants.quizQuestionsTypeKeys.snacks_deliver_per_day;

export const MealCalorieArray = AppConstants.quizQuestionsTypeArray.mealCalorieArray;
export const MealsArray = AppConstants.quizQuestionsTypeArray.mealsArray;
export const DaysArray = AppConstants.quizQuestionsTypeArray.daysArray;
export const WeeksArray = AppConstants.quizQuestionsTypeArray.weeksArray;
export const SnacksArray = AppConstants.quizQuestionsTypeArray.snacksArray;
