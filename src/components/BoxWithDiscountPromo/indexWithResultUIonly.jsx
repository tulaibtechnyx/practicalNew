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
const BoxWithDiscountPromo = (props) => {
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
        AllArrayMeal,
        AllArraySnack,
        hasAllOption1,
        hasAllOptions2,
        typeofMeal1,
        typeofMeal2,
        isInArray,
        // ... all other props
    } = props;

    const router = useRouter();
    const [beautify, setBeautify] = useState(null);
    const [openModal, setopenModal] = useState(false);
    const [openModalinfo, setopenModalinfo] = useState(null);
    const [openModalinfoOtherOptions, setopenModalinfoOtherOptions] = useState(null);
    const { decorationQuizData } = useSelector((state) => state.homepage);

    console.log("decorationQuizData", decorationQuizData)
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

    const isSelected = (optVal) => optVal == values?.[fieldToUpdate];

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

                return (
                    <Box key={optionValue}
                        // NOTE: Use styles.option instead of inline class names
                        className={optionClasses}
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
                            PlanPreferenceChanger ?
                                <Typography className={`${styles.optionText} ${styles.PlanPreferenceChanger}`}>
                                    {optionValue}
                                </Typography>
                                : <Typography className={styles.optionText}>
                                    {optionValue}<br />
                                    {isDays ? "Days" : isWeeks ? optionValue == '1' ? "Week" : "Weeks" : ""}
                                </Typography>

                        }

                        {showDecorationElements && objectBeauti?.tabbySupport && (
                            <Box sx={{
                                position: 'absolute',
                                bottom: PlanPreferenceChanger ? "-60%" : '-75%',
                                right: PlanPreferenceChanger ? "-5px" : '3px',
                                width: '100%',
                            }}>
                                <Box
                                    sx={{
                                        height: '30px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'end',
                                        width: '100%',
                                    }}
                                >
                                    <Box sx={{ fontSize: { xs: '8px !important', md: '11px !important' }, minWidth: { xs: 'auto', md: '80px' }, color: 'black !important' }}>
                                        {PlanPreferenceChanger ? "" : "Pay weekly"}
                                    </Box>
                                    <Box sx={{ height: { xs: "20px", md: '30px' }, width: 'auto' }}>
                                        <img
                                            src="/images/icons/tabby.png"
                                            alt="tabby"
                                            style={{
                                                height: '100%', display: 'block',
                                                objectFit: 'contain',
                                                float: 'right'
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

export default BoxWithDiscountPromo;