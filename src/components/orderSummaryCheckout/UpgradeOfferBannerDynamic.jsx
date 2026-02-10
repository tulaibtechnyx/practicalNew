import React, { useMemo } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import Image from "next/image";
import { buttonSX } from "@components/popUp/commonSX";
import styles from "./style.module.scss";
import AppColors from "@helpers/AppColors";

const UpgradeOfferBanner = ({
    mealsPerDay,
    snacksPerDay,
    daysPerWeek,
    weeks,
    onUpgrade,
    loaderupdate,
    isExecutive,
}) => {
    const { decorationQuizData } = useSelector((state) => state.homepage);
    const checkoutDecoration = decorationQuizData?.checkoutDecoration || [];

    // Compute current applicable offer

    const {
        offerText,
        buttonText,
        offerType,
        oldValue,
        newValue,
        aboveText,
        offeraboveText,
        offerbelowText,
    } = useMemo(() => {
        const matchesTrigger = (trigger) =>
            Object.entries(trigger).every(([key, value]) => {
                const current = { mealsPerDay, snacksPerDay, daysPerWeek, weeks }[key];
                if (typeof value === "object") {
                    if (value.$gte !== undefined) return current >= value.$gte;
                    if (value.$eq !== undefined) return current === value.$eq;
                }
                return current === value;
            });

        // 1️⃣ Filter all matching triggers
        const matchedRules = checkoutDecoration.filter(rule => matchesTrigger(rule.trigger));

        if (matchedRules.length === 0) return {};

        // 2️⃣ Pick the rule with the highest oldValue (biggest upgrade)
        const bestRule = matchedRules.sort((a, b) => b.oldValue - a.oldValue)[0];

        // 3️⃣ Get discount text from decorationArray options
        const question = decorationQuizData?.decorationArray?.find(
            q => q.questionId === bestRule.nextQuestionId
        );
        const nextOption = question?.options?.find(
            opt => opt.value === bestRule.oldValue + 1
        );
        const discountText = nextOption?.aboveCapsule?.text || "";

        // 4️⃣ Build offer text dynamically
        const text = bestRule.offeraboveText && bestRule.offerbelowText
            ? `${bestRule.offeraboveText} ${discountText} ${bestRule.offerbelowText}`
            : `${bestRule.offeraboveText || ""} ${discountText} ${bestRule.offerbelowText || ""}`;

        return {
            offerText: text.trim(),
            buttonText: bestRule.buttonText,
            offerType: bestRule.type,
            oldValue: bestRule.oldValue,
            newValue: bestRule.oldValue + 1,
            aboveText: discountText,
            offeraboveText: bestRule.offeraboveText,
            offerbelowText: bestRule.offerbelowText,
        };
    }, [checkoutDecoration, mealsPerDay, snacksPerDay, daysPerWeek, weeks, decorationQuizData]);

    if (!offerText) return null;

    const snackImages = {
        mainImage: "/images/meal/snack3.png",
        sideImage1: "/images/meal/snack1.png",
        sideImage2: "/images/meal/snack2.png",
    };
    const mealImages = {
        mainImage: "/images/meal/decorateMeal.png",
        sideImage1: "/images/meal/decorateMeal2.png",
        sideImage2: "/images/meal/decorateMeal3.png",
    };
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
                        <Typography component={'p'} sx={{
                            color: AppColors.primaryGreen,
                            fontSize: { md: '22px', xs: '16px' },
                            fontWeight: "bold", textDecoration: "underline", backgroundColor: 'none !important', width: 'max-content', margin: '0px', marginLeft: '5px !important'
                        }}>
                            {aboveText}
                        </Typography>
                        !
                        <Typography component={'p'} sx={{
                            color: AppColors.primaryGreen,
                            fontSize: { md: '12px', xs: '10px' },
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
                        fontSize: { md: "18px", xs: "14px" },
                        fontWeight: 500,
                        color: "#000",
                        mb: 2,
                    }}
                >
                    {offerText}
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
                            src={offerType === "snack" ? snackImages.sideImage1 : mealImages.sideImage1}
                            height={230}
                            width={230}
                            layout="responsive"
                            objectFit="contain"
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
                            src={offerType === "snack" ? snackImages.mainImage : mealImages.mainImage}
                            height={400}
                            width={400}
                            layout="responsive"
                            objectFit="contain"
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
                            src={offerType === "snack" ? snackImages.sideImage2 : mealImages.sideImage2}
                            height={230}
                            width={230}
                            layout="responsive"
                            objectFit="contain"
                        />
                    </Box>
                </Box>

                <Button
                    disabled={loaderupdate}
                    variant="contained"
                    color="success"
                    sx={{ ...buttonSX, maxWidth: "380px", mt: 2, mx: "auto" }}
                    onClick={() =>
                        onUpgrade?.({
                            offerText,
                            offerType,
                            oldValue,
                            newValue,
                        })
                    }
                >
                    {loaderupdate ? "Updating your current meal plan..." : buttonText}
                </Button>
            </Box>
        </div>
    );
};

export default UpgradeOfferBanner;
