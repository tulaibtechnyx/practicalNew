import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import AppConstants from "@helpers/AppConstants";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { truncateText } from "@helpers/CommonFunc";

const BoxWithDiscountPromo = (props) => {
    const {
        pathname,
        promoDetails,
        fieldToUpdate,
        options,
        question,
        values,
        value,
        onChange,
        isDiscountApplicable,
        defaultValue,
        AllArrayMeal,
        AllArraySnack,
        hasAllMeal,
        hasAllSnack,
        snack,
        meal,
        isInArray
    } = props;

    const [beautify, setBeautify] = useState(null);
    const { decorationQuizData } = useSelector((state) => state.homepage)

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

    useEffect(() => {
        if (decorationQuizData) {
            setBeautify(decorationQuizData?.decorationArray)
        }
    }, [decorationQuizData]);

    const beautiObj =
        Array.isArray(beautify) &&
        beautify?.find((beauty) => beauty?.questionId == fieldToUpdate);

    const isSelected = (optVal) => {
        if (optVal && optVal == values?.[fieldToUpdate]) {
            return true
        }
        return false
    }
    const isSelectedForDis = (selectedValue, loopedValue) => {
        if (selectedValue) return selectedValue === loopedValue;
        // return defaultValue?.includes(loopedValue) && isDiscountApplicable();
        return defaultValue === loopedValue && isDiscountApplicable();
    }
    const isOptionDisabled = (option, answers) => {
        if (!option?.dynamicStates || option?.dynamicStates.length === 0) return false;

        return option?.dynamicStates?.some((rule) => {
            // check if we have the dependent field answered
            const selectedValue = answers?.[rule?.sourceQuestionId];
            if (selectedValue === undefined || selectedValue === null) return false;

            return rule.disabledOnValues.includes(selectedValue);
        });
    };
    return (
        <Box className={styles.OptionsWrapper}>
            {optionsToRender?.map((optionValue) => {
                const objectBeauti = beautiObj?.options?.find(
                    (decor) => decor?.value == optionValue
                );
                const isDisabled = isOptionDisabled(objectBeauti, values);
                return (
                    <Box key={optionValue}
                        className={
                            `${isSelectedForDis(values[fieldToUpdate], optionValue) ? "Mui-checked" : ""}
                   ${isMeal && !isDisabled && !isSelectedForDis(values[fieldToUpdate], optionValue) && !hasAllMeal(meal) && isInArray(defaultValue, optionValue) ? "highlighted " : ""}
                   ${isSnack && !isDisabled && !isSelectedForDis(values[fieldToUpdate], optionValue) && !hasAllSnack(snack) && isInArray(defaultValue, optionValue) ? "highlighted" : ""} 
                   ${isDisabled ? `${styles.option} ${styles.disabled}` : isSelected(optionValue) ? `${styles.option} ${styles.selected}` : styles.option}
                   `}
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange(optionValue)
                        }} >
                        {/* Above Capsule */}
                        {objectBeauti?.aboveCapsule?.upto && (
                            <Box
                                className={styles.upto}
                            >
                                {'Up to'}
                            </Box>
                        )}
                        {objectBeauti?.aboveCapsule && (
                            <Box
                                className={styles.aboveCapsule}
                                style={{
                                    backgroundColor: objectBeauti?.aboveCapsule?.backgroundColor,
                                    color: objectBeauti?.aboveCapsule?.textColor,
                                }}
                            >
                                {truncateText(objectBeauti?.aboveCapsule?.text, 7, false)}
                            </Box>
                        )}

                        {/* Main Pill */}
                        <Typography
                            className={styles.optionText}
                        >
                            {optionValue}
                        </Typography>

                        {/* Below Pills */}
                        {objectBeauti?.belowPills?.length > 0 && (
                            <Box className={styles.belowPillsWrapper}>
                                {objectBeauti?.belowPills?.map((pill, idx) => (
                                    <Box
                                        key={idx}
                                        className={styles.belowPill}
                                        style={{
                                            backgroundColor: pill?.backgroundColor,
                                            color: pill?.textColor,
                                        }}
                                    >
                                        {truncateText(pill?.text, 17, false)}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
};

export default BoxWithDiscountPromo;
