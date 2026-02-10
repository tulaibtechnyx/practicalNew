import React, { useMemo } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import Image from "next/image";
import { buttonSX } from "@components/popUp/commonSX";
import styles from "./style.module.scss"
import AppColors from "@helpers/AppColors";

const UpgradeOfferBanner = ({
    mealsPerDay,
    snacksPerDay,
    daysPerWeek,
    weeks,
    onUpgrade, loaderupdate, isExecutive
}) => {
    const { decorationQuizData } = useSelector((state) => state.homepage);
    const pricingJson = decorationQuizData;
    const { offerText, buttonText, offerType, oldValue, newValue, aboveText, offeraboveText, offerbelowText } = useMemo(() => {
        if (!pricingJson?.decorationArray) return {};

        // Helper: find question
        const getQuestion = (id) =>
            pricingJson.decorationArray.find((q) => q.questionId === id);

        const mealQuestion = getQuestion("meals_deliver_per_day");
        const snackQuestion = getQuestion("snacks_deliver_per_day");

        const findNextOption = (question, currentValue) => {
            if (!question) return null;
            const options = question.options || [];
            return options.find((opt) => opt.value === currentValue + 1);
        };

        let offerText = "";
        let buttonText = "";
        let offerType = "";
        let oldValue = "";
        let newValue = "";
        let aboveText = "";
        let offeraboveText = "";
        let offerbelowText = "";

        if (mealsPerDay === 1 && snacksPerDay >= 1) {
            const nextMeal = findNextOption(mealQuestion, 1);
            if (nextMeal?.aboveCapsule?.text) {
                offeraboveText = `2nd Meals are`;
                offerbelowText = `for the whole of your plan`;
                offerText = `2nd Meals are ${nextMeal.aboveCapsule.text} for the whole of your plan`;
                buttonText = `Upgrade to 2 Meals Now`;
                offerType = "meal";
                oldValue = mealsPerDay
                newValue = mealsPerDay + 1
                aboveText = nextMeal.aboveCapsule.text
            }
        }
        // 2️⃣ 2 Meals + ≥1 Snack → Promote 3rd Meal (66% off)
        else if (mealsPerDay === 2 && snacksPerDay >= 1) {
            const nextMeal = findNextOption(mealQuestion, 2);
            if (nextMeal?.aboveCapsule?.text) {
                offeraboveText = `3rd Meals are`;
                offerbelowText = `for the whole of your plan`;
                offerText = `3rd Meals are ${nextMeal.aboveCapsule.text} for the whole of your plan`;
                buttonText = `Upgrade to 3 Meals Now`;
                offerType = "meal";
                oldValue = mealsPerDay
                newValue = mealsPerDay + 1
                aboveText = nextMeal.aboveCapsule.text
            }
        }
        // 🧩 FIXED: 1+ Meals + 0 Snack → Promote Snack (25% off)
        else if (mealsPerDay >= 1 && snacksPerDay === 0) {
            const nextSnack = findNextOption(snackQuestion, 0);
            if (nextSnack?.aboveCapsule?.text) {
                offerText = `Snack Special Offer: ${nextSnack.aboveCapsule.text}! (Limited Time)`;
                buttonText = `Add Daily Snack`;
                offerType = "snack";
                oldValue = snacksPerDay
                newValue = snacksPerDay + 1
                aboveText = nextSnack.aboveCapsule.text
            }
        }
        // 4️⃣ ≥2 Meals + 1 Snack → Promote 2nd Snack (33% off)
        else if (mealsPerDay >= 2 && snacksPerDay === 1) {
            const nextSnack = findNextOption(snackQuestion, 1);
            if (nextSnack?.aboveCapsule?.text) {
                offerText = `2nd Snack Special Offer: ${nextSnack.aboveCapsule.text}! (Limited Time)`;
                buttonText = `Add 2nd Snack`;
                offerType = "snack";
                oldValue = snacksPerDay
                newValue = snacksPerDay + 1
                aboveText = nextSnack.aboveCapsule.text
            }
        }
        else if (mealsPerDay >= 2 && snacksPerDay === 2) {
            const nextSnack = findNextOption(snackQuestion, 2);
            if (nextSnack?.aboveCapsule?.text) {
                offerText = `3rd Snack Special Offer: ${nextSnack.aboveCapsule.text}! (Limited Time)`;
                buttonText = `Add 3rd Snack`;
                offerType = "snack";
                oldValue = snacksPerDay
                newValue = snacksPerDay + 1
                aboveText = nextSnack.aboveCapsule.text
            }
        }

        return { offerText, buttonText, offerType, oldValue, newValue, aboveText,offeraboveText, offerbelowText };
    }, [pricingJson, mealsPerDay, snacksPerDay, daysPerWeek, weeks]);

    if (!offerText) return null;


    const snackImages = {
        mainImage:"/images/meal/snack3.png",
        sideImage1:"/images/meal/snack1.png",
        sideImage2:"/images/meal/snack2.png",
    }
    const mealImages = {
        mainImage:"/images/meal/decorateMeal.png",
        sideImage1:"/images/meal/decorateMeal2.png",
        sideImage2:"/images/meal/decorateMeal3.png",
    }

    return (
        <div className={styles.sec_payment_method}>
            <Typography
                variant="h6"
                sx={{ color: AppColors.primaryGreen }}
                className={styles.heading}
            >
                <span
                    style={{
                        backgroundColor: isExecutive
                            ? AppColors.primaryOrange
                            : AppColors.primaryGreen,
                    }}
                >
                    2
                </span>{" "}
                {offerType === "snack" ? (
                    <>
                        Snack Special Offer:{" "}
                        <Typography component={'p'} sx ={{
                            color: AppColors.primaryGreen,
                            fontSize: {md:'22px',xs:'16px'},
                            fontWeight: "bold", textDecoration: "underline", backgroundColor: 'none !important', width: 'max-content', margin: '0px', marginLeft: '5px !important'
                        }}>
                            {aboveText}
                        </Typography>
                        !
                        <Typography component={'p'} sx ={{
                            color: AppColors.primaryGreen,
                            fontSize: {md:'12px',xs:'10px'},
                            fontWeight: "lighter", textDecoration: "underline", backgroundColor: 'none !important', width: 'max-content', margin: '0px', marginLeft: '5px !important'
                        }}>
                            {'(Limited time)'}
                        </Typography>
                    </>
                ) : (
                    "Order more, save more"
                )}
            </Typography>


            <Box
                sx={{
                    mt: 1,
                    p: 1,
                    borderRadius: "16px",
                    backgroundColor: "#fff",
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        fontSize: "18px",
                        fontWeight: 500,
                        color: "#000",
                        mb: 2,
                    }}
                >
                    {

                        offerType == 'snack' ?
                            `Want to add a discounted Snack each day on your plan?`
                            :
                            // offerText
                            offeraboveText
                    }
                    <Typography component={'span'} sx ={{
                            fontSize: {md:'18px',xs:'13px'},
                            fontWeight: "normal", textDecoration: "underline", backgroundColor: 'none !important', width: 'max-content', margin: '0px', mx: '5px !important'
                        }}>
                            {aboveText}
                        </Typography>
                        {offerbelowText}
                </Typography>

                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        my: 1,
                        maxWidth: "300px",
                    }}
                >
                    <Box
                        sx={{
                            width: "25%",
                            height: "auto",
                            position: "relative",
                            zIndex: 1,
                            transform: "translateX(25%)",
                        }}
                    >
                        <Image
                            src={
                                offerType == 'snack' ?
                                snackImages?.sideImage1:
                                mealImages?.sideImage1
                                }
                            height={230}
                            width={230}
                            layout="responsive"
                            objectFit={"contain"}
                        />
                    </Box>

                    <Box
                        sx={{
                            width: "50%",
                            height: "auto",
                            position: "relative",
                            zIndex: 2,
                            mx: -2,
                        }}
                    >
                        <Image
                            src={
                                offerType == 'snack' ?
                                snackImages?.mainImage:
                                mealImages?.mainImage
                                }
                            height={400}
                            width={400}
                            layout="responsive"
                            objectFit={"contain"}
                        />
                    </Box>

                    <Box
                        sx={{
                            width: "25%",
                            height: "auto",
                            position: "relative",
                            zIndex: 1,
                            transform: "translateX(-25%)",
                        }}
                    >
                        <Image
                            src={
                                offerType == 'snack' ?
                                snackImages?.sideImage2:
                                mealImages?.sideImage2
                                }
                            height={230}
                            width={230}
                            layout="responsive"
                            objectFit={"contain"}
                        />
                    </Box>
                </Box>

                <Button
                    disabled={loaderupdate}
                    variant="contained"
                    color="success"
                    sx={{
                        ...buttonSX,
                        maxWidth: "380px",
                        mt: '10px',
                        mx: 'auto'
                    }}
                    onClick={() => onUpgrade?.({
                        offerText: offerText,
                        offerType: offerType,
                        oldValue: oldValue,
                        newValue: newValue,
                    })}
                >
                    {loaderupdate ? "Updating your current meal plan.." : buttonText}
                </Button>
            </Box>
        </div>
    );
};

export default UpgradeOfferBanner;
