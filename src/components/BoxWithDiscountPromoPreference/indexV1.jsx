import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography } from "@mui/material";
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { truncateText } from "@helpers/CommonFunc";
import AppConstants from "@helpers/AppConstants";
import styles from "./style.module.scss";
import HelpConfirmationPopCustom from '../popUp/HelpConfirmationPopCustom';
import PromoBoxModal from '../PromoBoxModal';
import Image from 'next/image';
import AppColors from '@helpers/AppColors';
// NOTE: In a real Next.js app, you would use:
const getRouteKey = (pathname) => {
    if (!pathname) return 'showOnHomePage';
    const cleanPath = pathname.split('/')[1]?.toLowerCase();
    switch (cleanPath) {
        case 'quicksignup': return 'showOnQuickSignUp';
        case 'thankyou': return 'showOnThankyou';
        case 'result': case 'resultnew': return 'showOnResult';
        case 'renewal': case 'view-renewal': return 'showOnRenewal';
        case 'edit-preference': case 'quizpreferences': return 'showOnEditPreference';
        case '': return 'showOnHomePage';
        default: return 'showOnHomePage';
    }
};
const BoxWithDiscountPromoPreference = (props) => {
    const {
        PlanPreferenceChanger = false,
        fieldToUpdate,
        options,
        values = { [fieldToUpdate]: 1 },
        onChange = () => { },
        isDiscountApplicable = () => true,
        defaultValue = 1,
        pathname,
        promoDetails,
        question,
        value,
        AllArrayMeal=()=>{},
        AllArraySnack=()=>{},
        hasAllOption1=()=>{},
        hasAllOptions2=()=>{},
        typeofMeal1,
        typeofMeal2,
        isInArray=()=>{},
        arrayFind
        // ... all other props
    } = props;

    const router = useRouter();
    const [beautify, setBeautify] = useState(null);
    const [openModal, setopenModal] = useState(false);
    const [openModalinfo, setopenModalinfo] = useState(null);
    const [openModalinfoOtherOptions, setopenModalinfoOtherOptions] = useState(null);
    const { decorationQuizData } = useSelector((state) => state.homepage);

    // 1. Determine the current page's decoration visibility key (e.g., 'showOnResult')
    const currentRouteKey = getRouteKey(router.pathname);

    const isMeal = fieldToUpdate === AppConstants.quizQuestionsTypeKeys.meals_deliver_per_day;
    const isSnack = fieldToUpdate === AppConstants.quizQuestionsTypeKeys.snacks_deliver_per_day;
    const isDays = fieldToUpdate === AppConstants.quizQuestionsTypeKeys.meal_days_per_week;
    const isWeeks = fieldToUpdate === AppConstants.quizQuestionsTypeKeys.meal_plan_require_weeks;

    let optionsToRender =
        Array.isArray(options) && options?.length > 0
            ? options
            : isMeal
                ? AppConstants.quizQuestionsTypeArray.mealsArray
                : isSnack
                    ? AppConstants.quizQuestionsTypeArray.snacksArray
                    : isDays
                        ? AppConstants.quizQuestionsTypeArray.daysArray
                        : isWeeks
                            ? AppConstants.quizQuestionsTypeArray.weeksArray
                            : [];


    const numberToAddforNextValue = (valueProvided) => {
        return isWeeks ? valueProvided == 2 ? 2 : 1 : 1
    }
    const beautiObj =
        Array.isArray(beautify) &&
        beautify?.find((beauty) => beauty?.questionId == fieldToUpdate);

    // 2. Question-level check: Decoration must be allowed for this question on the current page.
    const shouldShowQuestionDecoration = beautiObj?.[currentRouteKey] === true;
    const shouldShowModalOnThisQuestion = beautiObj?.['showoptionModal'] == true;

    const isSelected = (optVal) => {
        const currentValue = values?.[fieldToUpdate];
        if (arrayFind) {
            return optVal == value;
        }
        else {
            // Case 2: The stored value is a primitive (string/number) (e.g., meals_deliver_per_day: 2)
            // Perform a simple direct comparison.
            return optVal == currentValue;
        }
    };

    const hasFieldValue = (values, fieldToUpdate) => {
        // check that both arguments are valid
        if (!values || typeof values !== "object" || !fieldToUpdate) return false;

        // check if the property exists and has a non-null / non-undefined / non-empty value
        const val = values[fieldToUpdate];
        return val !== undefined && val !== null && val !== "";
    };
    const isSelectedForDis = (selectedValue, loopedValue) => {
        if (selectedValue) return selectedValue === loopedValue;
        return defaultValue === loopedValue && isDiscountApplicable();
    }

    const isOptionDisabled = (option, answers) => {
        if (!option?.dynamicStates || option?.dynamicStates.length === 0) return false;
        return option?.dynamicStates?.some((rule) => {
            const selectedValue = answers?.[rule?.sourceQuestionId];
            if (selectedValue === undefined || selectedValue === null) return false;
            return rule.disabledOnValues.includes(selectedValue);
        });
    };

    const handleCloseAndEmpty = () => {
        setopenModalinfoOtherOptions(null)
        setopenModalinfo(null)
        setopenModal(false)
    }


    const handleOptionClick = (e, isDisabled, objectBeauti, optionValue) => {
        if (isDisabled) return;

        // Find the next option
        const numberToAdd = numberToAddforNextValue(optionValue)
        const nextOption = beautiObj?.options?.find(
            (opt) => opt.value === (typeof objectBeauti?.value == 'number' ? objectBeauti?.value + numberToAdd : Number(objectBeauti?.value) + numberToAdd)
        );
        const hasNextCapsule = nextOption?.aboveCapsule?.text;

        if (objectBeauti?.showoptionModal && hasNextCapsule && !hasFieldValue(values, fieldToUpdate)) {
            // if (objectBeauti?.showoptionModal && hasNextCapsule) {
            setopenModalinfoOtherOptions(beautiObj?.options);
            setopenModalinfo(objectBeauti);
            setopenModal(true);

        } else {
            e.stopPropagation();
            onChange(optionValue);
        }
    }

    useEffect(() => {
        if (decorationQuizData) {
            setBeautify(decorationQuizData?.decorationArray)
        }
    }, [decorationQuizData]);

    return (
        // NOTE: Replace inline styling with your imported styles.OptionsWrapper
        <Box className={`${styles.OptionsWrapper} ${(isDays || isWeeks) ? styles.belowPillWeekDays : ''} ${PlanPreferenceChanger ? styles.PlanPreferenceChanger : ''}`}>
            {optionsToRender?.map((optionValue) => {
                const objectBeauti = beautiObj?.options?.find(
                    (decor) => decor?.value == optionValue
                );
                // 3. Option-level check: Decoration must be allowed for this specific option on the current page.
                const shouldShowOptionDecoration = objectBeauti?.[currentRouteKey] === true;

                // Combined check: Only show decoration elements if both Q and Option are allowed
                const showDecorationElements = shouldShowQuestionDecoration && shouldShowOptionDecoration;

                const isDisabled = isOptionDisabled(objectBeauti, values);
                const optionClasses = `${isSelectedForDis(values[fieldToUpdate], optionValue) ? "Mui-checked" : ""}
                   ${isMeal && !isDisabled && !isSelectedForDis(values[fieldToUpdate], optionValue) && !hasAllOption1(typeofMeal1) && isInArray(defaultValue, optionValue) ? "highlighted " : ""}
                   ${isSnack && !isDisabled && !isSelectedForDis(values[fieldToUpdate], optionValue) && !hasAllOptions2(typeofMeal2) && isInArray(defaultValue, optionValue) ? "highlighted" : ""} 
                   ${isDisabled ? `${styles.option} ${((isDays || isWeeks) && !PlanPreferenceChanger) && styles.optionWeeksDays} ${styles.disabled}` : isSelected(optionValue) ? `${styles.option} ${styles.selected} ${((isDays || isWeeks) && !PlanPreferenceChanger) && styles.optionWeeksDays}` : `${styles.option} ${((isDays || isWeeks) && !PlanPreferenceChanger) && styles.optionWeeksDays} ${PlanPreferenceChanger && styles.PlanPreferenceChanger}`}`;
                const optionTextClasses = `${isSelectedForDis(values[fieldToUpdate], optionValue) ? "Mui-checked" : ""}
                   ${isMeal && !isDisabled && !isSelectedForDis(values[fieldToUpdate], optionValue) && !hasAllOption1(typeofMeal1) && isInArray(defaultValue, optionValue) ? "highlighted " : ""}
                   ${isSnack && !isDisabled && !isSelectedForDis(values[fieldToUpdate], optionValue) && !hasAllOptions2(typeofMeal2) && isInArray(defaultValue, optionValue) ? "highlighted" : ""} 
                   ${isDisabled ? `${styles.optionText} ${((isDays || isWeeks) && !PlanPreferenceChanger) && styles.optionWeeksDays} ${styles.disabled}` : isSelected(optionValue) ? `${styles.optionText} ${styles.selected} ${((isDays || isWeeks) && !PlanPreferenceChanger) && styles.optionWeeksDays}` : `${styles.optionText} ${((isDays || isWeeks) && !PlanPreferenceChanger) && styles.optionWeeksDays} ${PlanPreferenceChanger && styles.PlanPreferenceChanger}`}`;

                return (
                    <Box key={optionValue}
                        // NOTE: Use styles.option instead of inline class names
                        // className={optionClasses}
                        className={styles.option}
                        onClick={(e) => handleOptionClick(e, isDisabled, objectBeauti, optionValue)}
                    >

                        {/* Above Capsule (upto) - Conditional on showDecorationElements */}
                        {!PlanPreferenceChanger && showDecorationElements && objectBeauti?.aboveCapsule?.upto && (
                            <Box className={styles.upto}>
                                {'Up to'}
                            </Box>
                        )}

                        {/* Above Capsule - Conditional on showDecorationElements */}
                        {!PlanPreferenceChanger && showDecorationElements && objectBeauti?.aboveCapsule && (
                            <Box
                                className={styles.aboveCapsule}
                                style={{
                                    backgroundColor: `${objectBeauti.aboveCapsule.backgroundColor}`,
                                    color: `${objectBeauti.aboveCapsule.textColor}`,
                                }}
                            >
                                {truncateText(objectBeauti.aboveCapsule.text, objectBeauti.aboveCapsule.textlength ?? 8, objectBeauti.aboveCapsule.showElipses ?? false)}
                            </Box>
                        )}

                        {/* Main Pill (Value) */}
                        {
                            // <Typography className={`${styles.optionText} ${isSelected(optionValue) ? styles.selected : ''} ${isDisabled ? styles.disabled : ''}`}>
                            <Typography className={optionTextClasses}>
                                {optionValue}
                            </Typography>
                        }
                        <div className={styles.belowPillsSpacer}>
                            {showDecorationElements && objectBeauti?.tabbySupport && (
                                <Box sx={{
                                    width: '100%',
                                }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'end',
                                            width: '100%',
                                            mb: '-5px'
                                        }}
                                    >
                                        <Box sx={{ fontSize: { xs: '8px !important', md: '11px !important' }, color: 'black !important' }}>
                                            {"Pay weekly"}
                                        </Box>
                                        <Box sx={{ height: { xs: "20px", md: '30px' }, width: 'auto' }}>
                                            <img
                                                src="/images/icons/tabby.png"
                                                alt="tabby"
                                                style={{
                                                    height: '100%', display: 'block',
                                                    objectFit: 'contain',
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            )}


                            {/* Below Pills - Conditional on showDecorationElements */}
                            {showDecorationElements && objectBeauti?.belowPills?.length > 0 && (
                                <Box
                                    className={`${styles.belowPillsWrapper} ${(isDays || isWeeks) && !PlanPreferenceChanger && styles.PillWeekDays} ${PlanPreferenceChanger && styles.PlanPreferenceChanger} ${objectBeauti?.tabbySupport && styles.tabbySupport} `}
                                >
                                    {objectBeauti.belowPills.map((pill, idx) => (
                                        <Box
                                            key={idx}
                                            className={`${styles.belowPill} ${((isDays || isWeeks) && !PlanPreferenceChanger) ? styles.belowPillWeekDays : ''} ${PlanPreferenceChanger && styles.PlanPreferenceChanger}`}
                                            style={{
                                                backgroundColor: `${pill.backgroundColor}`,
                                                color: `${pill.textColor}`,
                                            }}
                                        >
                                            {truncateText(pill?.text, pill?.textlength ?? 17, pill?.showElipses ?? false)}
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </div>
                    </Box>
                );
            })}

            {
                shouldShowModalOnThisQuestion && openModalinfo?.showoptionModal &&
                <PromoBoxModal
                    isMeal={isMeal}
                    isSnack={isSnack}
                    isDays={isDays}
                    isWeeks={isWeeks}
                    open={openModal}
                    selectedOptionValue={openModalinfo}
                    openModalinfoOtherOptions={openModalinfoOtherOptions}
                    beautify={beautify}
                    numberToAddforNextValue={numberToAddforNextValue}
                    handleYesClick={() => {
                        const numberToAdd = numberToAddforNextValue(openModalinfo?.value)
                        const valueToPass = typeof openModalinfo?.value == 'number' ? openModalinfo?.value + numberToAdd : Number(openModalinfo?.value) + numberToAdd;
                        onChange(valueToPass)
                        handleCloseAndEmpty()
                    }}
                    handleCloseOut={() => {
                        const valueToPass = openModalinfo?.value;
                        onChange(valueToPass)
                        handleCloseAndEmpty()
                    }}
                />
            }

        </Box>
    );
};

export default BoxWithDiscountPromoPreference;