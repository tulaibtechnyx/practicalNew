import React, { useMemo } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import Image from "next/image";

const UpgradeOfferBanner = ({
    mealsPerDay,
    snacksPerDay,
    daysPerWeek,
    weeks,
    onUpgrade,
}) => {
    const { decorationQuizData } = useSelector((state) => state.homepage);

    const pricingJson = decorationQuizData;
    const { offerText, buttonText, offerType } = useMemo(() => {
        if (!pricingJson?.decorationArray) return {};

        const getQuestion = (id) =>
            pricingJson.decorationArray.find((q) => q.questionId === id);

        const mealQuestion = getQuestion("meals_deliver_per_day");
        const snackQuestion = getQuestion("snacks_deliver_per_day");
        const daysQuestion = getQuestion("meal_days_per_week");
        const weeksQuestion = getQuestion("meal_plan_require_weeks");

        const findNextOption = (question, currentValue) => {
            if (!question) return null;
            const options = question.options || [];
            return options.find((opt) => opt.value === currentValue + 1);
        };

        let offerText = "";
        let buttonText = "";
        let offerType = "";

        // 1️⃣ --- Meal Upgrade Offer ---
        if (mealsPerDay < 5) {
            const nextMeal = findNextOption(mealQuestion, mealsPerDay);
            if (nextMeal?.aboveCapsule?.text) {
                offerText = `${nextMeal.value} Meal Plan: ${nextMeal.aboveCapsule.text} for the whole of your plan`;
                buttonText = `Upgrade to ${nextMeal.value} Meals Now`;
                offerType = "meal";
            }
        }

        // 2️⃣ --- Snack Offer ---
        if (!offerText && mealsPerDay >= 2) {
            const nextSnack = findNextOption(snackQuestion, snacksPerDay);
            if (nextSnack?.aboveCapsule?.text) {
                offerText = `${nextSnack.value === 1 ? "Snack" : `${nextSnack.value} Snacks`} Special Offer: ${nextSnack.aboveCapsule.text}! (Limited Time)`;
                buttonText = `Add ${nextSnack.value === 1 ? "Daily Snack" : `${nextSnack.value} Snacks`}`;
                offerType = "snack";
            }
        }

        // 3️⃣ --- Days per Week Upgrade ---
        if (!offerText) {
            const nextDay = findNextOption(daysQuestion, daysPerWeek);
            if (nextDay?.aboveCapsule?.text) {
                offerText = `${nextDay.value}-Day Plan: ${nextDay.aboveCapsule.text}!`;
                buttonText = `Upgrade to ${nextDay.value} Days a Week`;
                offerType = "days";
            }
        }

        // 4️⃣ --- Weeks Plan Upgrade ---
        if (!offerText) {
            const nextWeek = findNextOption(weeksQuestion, weeks);
            if (nextWeek?.aboveCapsule?.text) {
                offerText = `${nextWeek.pill.text}: ${nextWeek.aboveCapsule.text}`;
                buttonText = `Upgrade to ${nextWeek.pill.text}`;
                offerType = "weeks";
            }
        }

        return { offerText, buttonText, offerType };
    }, [pricingJson, mealsPerDay, snacksPerDay, daysPerWeek, weeks]);

    if (!offerText) return null;

    return (
        <Box
            sx={{
                mt: 1,
                p: 1,
                borderRadius: "16px",
                backgroundColor: "#fff",
                textAlign: "center",
            }}
        >
            {/* <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 1, color: "#000" }}
            >
                Order more, save more!
            </Typography> */}

            <Typography
                variant="body1"
                sx={{
                    fontSize: "18px",
                    fontWeight: 500,
                    color: "#000",
                    mb: 2,
                }}
            >
                {offerText}
            </Typography>
            <Box sx={{
                width: "100%", // Use full width to contain the three elements
                display: "flex",
                alignItems: "center", // Vertically center the items
                justifyContent: "center", // Horizontally center the group
                mx: "auto",
                my: 1,
                // Optional: Set a max-width if you don't want it to stretch too wide
                maxWidth: "300px"
            }}>
                {/* 1. Left Image: snack1.png */}
                <Box sx={{ width: "25%", height: "auto", position: "relative", zIndex: 1, transform: "translateX(25%)" }}>
                    <Image
                        src={"/images/meal/snack1.png"}
                        height={230} // Set explicit height for better layout control
                        width={230}
                        layout="responsive"
                        objectFit={"contain"}
                    />
                </Box>

                {/* 2. Main Central Image: decorateMeal.png - Largest and most prominent */}
                <Box sx={{ width: "50%", height: "auto", position: "relative", zIndex: 2, mx: -2 }}>
                    <Image
                        src={"/images/meal/decorateMeal.png"}
                        height={400} // Larger height for the main image
                        width={400}
                        layout="responsive"
                        objectFit={"contain"}
                    />
                </Box>

                {/* 3. Right Image: snack2.png */}
                <Box sx={{ width: "25%", height: "auto", position: "relative", zIndex: 1, transform: "translateX(-25%)" }}>
                    <Image
                        src={"/images/meal/snack2.png"}
                        height={230} // Set explicit height for better layout control
                        width={230}
                        layout="responsive"
                        objectFit={"contain"}
                    />
                </Box>
            </Box>

            <Button
                variant="contained"
                color="success"
                sx={{
                    px: 4,
                    py: 1.3,
                    borderRadius: "30px",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "15px",
                }}
                onClick={() => onUpgrade?.(offerType)}
            >
                {buttonText}
            </Button>
        </Box>
    );
};

export default UpgradeOfferBanner;
