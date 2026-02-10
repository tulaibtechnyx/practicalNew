import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { DisabledOption, isOptionDisabled, truncateText } from "@helpers/CommonFunc";
import AppConstants from "@helpers/AppConstants";
import styles from "./style.module.scss";
import HelpConfirmationPopCustom from '../popUp/HelpConfirmationPopCustom';
import PromoBoxModal from '../PromoBoxModal';
import PromoLockedMealAlert from '../PromoLockedMealAlert';
import Image from 'next/image';
import AppColors from '@helpers/AppColors';
import LockIcon from '@mui/icons-material/Lock';

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
        tabbyCondition = false,
        handleUpgradefun = () => { }
        // ... all other props
    } = props;

    const router = useRouter();
    const [beautify, setBeautify] = useState(null);
    const [openModal, setopenModal] = useState(false);
    const [openAlertModal, setopenAlertModal] = useState(false);
    const [openAlertObj, setopenAlertObj] = useState(null);
    const [openModalinfo, setopenModalinfo] = useState(null);
    const [openModalinfoOtherOptions, setopenModalinfoOtherOptions] = useState(null);
    const { decorationQuizData } = useSelector((state) => state.homepage);
    const isMobile400 = useMediaQuery('(max-width:400px)');
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

    const handleCloseAndEmpty = () => {
        setopenModalinfoOtherOptions(null)
        setopenModalinfo(null)
        setopenModal(false)
    }


    const handleOptionClick = (e, isDisabled, objectBeauti, optionValue) => {
        if (isDisabled) return;

        try {
            const numberToAdd = numberToAddforNextValue(optionValue)
            const nextOption = beautiObj?.options?.find(
                (opt) => opt.value === (typeof objectBeauti?.value == 'number' ? objectBeauti?.value + numberToAdd : Number(objectBeauti?.value) + numberToAdd)
            );
            const hasNextCapsule = nextOption?.aboveCapsule?.text;
            // if (objectBeauti?.showoptionModal && hasNextCapsule && !hasFieldValue(values, fieldToUpdate)) { // work with selected option doesnot show modal but now changed to clicked option
            if (objectBeauti?.showoptionModal && hasNextCapsule && shouldShowModalOnThisQuestion) {
                setopenModalinfoOtherOptions(beautiObj?.options);
                setopenModalinfo(objectBeauti);
                setopenModal(true);

            } else {
                e.stopPropagation();
                onChange(optionValue);
            }

        } catch (error) {
            console.log("error", error)
        }
        // Find the next option
    }

    useEffect(() => {
        if (decorationQuizData) {
            setBeautify(decorationQuizData?.decorationArray)
        }
    }, [decorationQuizData]);

    return (
        // NOTE: Replace inline styling with your imported styles.OptionsWrapper
        <Box>
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
                    const DisabledOptionObj = DisabledOption(objectBeauti, values);
                    const optionClasses = `${isSelectedForDis(values[fieldToUpdate], optionValue) ? "Mui-checked" : ""}
                   ${isMeal && !isDisabled && !isSelectedForDis(values[fieldToUpdate], optionValue) && !hasAllOption1(typeofMeal1) && isInArray(defaultValue, optionValue) ? "highlighted " : ""}
                   ${isSnack && !isDisabled && !isSelectedForDis(values[fieldToUpdate], optionValue) && !hasAllOptions2(typeofMeal2) && isInArray(defaultValue, optionValue) ? "highlighted" : ""} 
                   ${isDisabled ? `${styles.option} ${((isDays || isWeeks) && !PlanPreferenceChanger) && styles.optionWeeksDays} ${styles.disabled}` : isSelected(optionValue) ? `${styles.option} ${styles.selected} ${((isDays || isWeeks) && !PlanPreferenceChanger) && styles.optionWeeksDays}` : `${styles.option} ${((isDays || isWeeks) && !PlanPreferenceChanger) && styles.optionWeeksDays} ${PlanPreferenceChanger && styles.PlanPreferenceChanger}`}`;

                    return (
                        <Box key={optionValue}
                            // NOTE: Use styles.option instead of inline class names
                            className={optionClasses}
                            data-content={optionValue}
                            onClick={(e) => {
                                if(isDisabled){
                                        setopenAlertObj(DisabledOptionObj)
                                        setopenAlertModal(true)
                                }else{
                                    handleOptionClick(e, isDisabled, objectBeauti, optionValue)}}
                                }
                            sx={{
                                backgroundColor: `${AppColors.primaryGreen}`,
                                ":hover": {
                                    backgroundColor: '#cfebe4',
                                    '& p': {
                                        color: `${AppColors.primaryGreen} !important`,
                                    },
                                }
                            }}
                        >

                            {/* Above Capsule (upto) - Conditional on showDecorationElements */}
                            {!isDisabled && !PlanPreferenceChanger && showDecorationElements && objectBeauti?.aboveCapsule?.upto && (
                                <Box className={styles.upto}>
                                    {'Up to'}
                                </Box>
                            )}

                            {/* Above Capsule - Conditional on showDecorationElements */}
                            {!isDisabled && !PlanPreferenceChanger && showDecorationElements && objectBeauti?.aboveCapsule && (
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
                            {/* Above Capsule - Conditional on showDecorationElements */}
                            {isDisabled && showDecorationElements && (
                                <Box
                                    className={styles.aboveCapsule}
                                    style={{
                                        backgroundColor: '#AA2831',
                                        color: `${AppColors.white}`,
                                        zIndex: 30,
                                        cursor: 'pointer',
                                        pointerEvents: 'all'
                                    }}
                                    onClick={(e) => {
                                        setopenAlertObj(DisabledOptionObj)
                                        setopenAlertModal(true)
                                    }}
                                >
                                    <img src='/images/meal/lockWhite.svg' style={{ width:isMobile400 ? "15px" : '18px', }} />
                                </Box>
                            )}

                            {/* Main Pill (Value) */}
                            {
                                PlanPreferenceChanger ?
                                    <Typography className={`${styles.optionText} ${styles.PlanPreferenceChanger}`}>
                                        {optionValue}
                                    </Typography>
                                    : <Typography className={`${styles.optionText} ${((isDays || isWeeks)) ? styles.textWeekDays : ''}`}
                                    >
                                        {optionValue}<br />
                                        {isDays ? "Days" : isWeeks ? (optionValue == '1' || optionValue == 1) ? "Week" : "Weeks" : ""}
                                    </Typography>

                            }

                            {/* Dislabed option decor */}
                            {isDisabled && DisabledOptionObj && DisabledOptionObj?.value && (
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: PlanPreferenceChanger ? "-60%" : '-73%',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    pointerEvents: 'all'
                                }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                        }}
                                    >
                                        <Box sx={{ border: `1px solid ${AppColors.primaryOrange}`, p: { md: '2px 4px', xs: '1px 2px' }, borderRadius: '10px', }}>
                                            <Box sx={{ color: AppColors.primaryOrange, m: '0px', p: '0px', width: 'max-content', fontSize: { md: '8px', xs: '7px', }, textTransform: 'capitalize' }} >
                                                {/* {DisabledOptionObj?.text} */}
                                                {`Min ${DisabledOptionObj?.value + 1} ${DisabledOptionObj?.sourceQuestionId == AppConstants.quizQuestionsTypeKeys.meals_deliver_per_day ? "Meals" :
                                                    DisabledOptionObj?.sourceQuestionId == AppConstants.quizQuestionsTypeKeys.snacks_deliver_per_day ? "Snacks" :
                                                        DisabledOptionObj?.sourceQuestionId == AppConstants.quizQuestionsTypeKeys.meals_deliver_per_day ? "Days" : "Weeks"
                                                    }`}
                                            </Box>
                                        </Box>
                                    </Box>
                                    {/* <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '100%',
                                        mt: '4px'
                                    }}
                                >
                                    <Box sx={{
                                        border: `1px solid ${AppColors.primaryGreen}`, p: { md: '2px 4px', xs: '1px 2px' }, borderRadius: '10px', ":hover": {
                                            bgcolor: AppColors.primaryGreen,
                                            color: AppColors.white
                                        },
                                        color: AppColors.primaryGreen
                                    }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            console.log("DisabledOptionObj", DisabledOptionObj)
                                            // handleUpgradefun(DisabledOptionObj)
                                        }}

                                    >
                                        <Box
                                            sx={{ m: '0px', p: '0px', width: 'max-content', fontSize: { md: '8px', xs: '7px', }, textTransform: 'capitalize', }} >
                                            {
                                                typeof DisabledOptionObj?.value == 'number' ?
                                                    `Upgrade to ${DisabledOptionObj?.value + 1} meals`
                                                    : DisabledOptionObj?.text
                                            }</Box>
                                    </Box>
                                </Box> */}
                                </Box>
                            )}

                            {/* Tabby option decor */}

                            {showDecorationElements && objectBeauti?.tabbySupport && (
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: PlanPreferenceChanger ? "-60%" : '-78%',
                                    right: PlanPreferenceChanger ? "-5px" : '3px',
                                    width: '100%',

                                }}>
                                    {
                                        tabbyCondition ?
                                            <Box
                                                sx={{
                                                    height: '30px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '100%',
                                                }}
                                            >
                                                <Box sx={{ border: `1px solid ${AppColors.primaryOrange}`, p: { md: '2px 4px', xs: '1px 2px' }, borderRadius: '10px', mt: '6px' }}>
                                                    <Box sx={{ color: AppColors.primaryOrange, m: '0px', p: '0px', width: 'max-content', fontSize: { md: '8px', xs: '7px', } }} >Tabby - 2 Meals a Day min</Box>
                                                </Box>
                                                {/* <Box sx={{ border: `1px solid ${AppColors.primaryOrange}`, p: '2px 4px', borderRadius: '10px', mt: '6px' }}>
                                                <Typography color={AppColors.primaryOrange} sx={{ m: '0px', p: '0px', width: 'max-content', fontSize: { md: '8px', xs: '7px', } }} >2 Meals a Day min</Typography>
                                            </Box> */}
                                            </Box>
                                            :
                                            <Box
                                                sx={{
                                                    height: '30px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
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
                                    }
                                </Box>
                            )}


                            {/* Below Pills - Conditional on showDecorationElements */}
                            {!isDisabled && showDecorationElements && objectBeauti?.belowPills?.length > 0 && (
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
                                            {truncateText(pill?.text, isMobile400 ? 13 : pill?.textlength ?? 17, pill?.showElipses ?? false)}
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
                {
                    openAlertModal && openAlertObj &&
                    <PromoLockedMealAlert
                        openAlertObj={openAlertObj}
                        open={openAlertModal}
                        handleYesClick={() => {
                            handleUpgradefun(openAlertObj)
                            setopenAlertModal(false)
                        }}
                        handleCloseOut={() => {
                            setopenAlertModal(false)
                        }}
                    />
                }

            </Box>
            
        </Box>
    );
};

export default BoxWithDiscountPromo;