import React, { useEffect, useRef, useState } from "react"
import { Box, Dialog, DialogContent, Typography, useMediaQuery } from "@mui/material"
import PropTypes from "prop-types"
import AppColors from "@helpers/AppColors"
import { useDispatch, useSelector } from "react-redux"
import CustomDialog from "../popUp/CustomDialog"
import AppDataConstant from "../../helpers/AppDataConstant"
import { buttonOutlinedSX, buttonSX, dfac, dfjac } from "../popUp/commonSX"
import Image from "next/image"
import { getOrdinalSuffix, toSentenceCase } from "../../helpers/CommonFunc"

export default function PromoBoxModal({
    handleYesClick = () => { },
    handleCloseOut = () => { },
    open,
    selectedOptionValue,
    openModalinfoOtherOptions,
    isMeal,
    isSnack,
    isDays,
    isWeeks,
    numberToAddforNextValue = () => { }
}) {

    const is768px  = useMediaQuery(`(max-width: 768px)`)
    // 🧠 Compute dynamic offer text
    const getOfferText = () => {
        if (!selectedOptionValue || !openModalinfoOtherOptions?.length) return "";
        const numberToAdd = numberToAddforNextValue(selectedOptionValue.value)

        const nextValue = openModalinfoOtherOptions.find(
            opt => opt.value === selectedOptionValue.value + numberToAdd
        );

        if (nextValue?.aboveCapsule?.text) {
            // Determine the type word dynamically
            let typeLabel = "meal";
            if (isSnack) typeLabel = "snack";
            else if (isDays) typeLabel = "plan";
            else if (isWeeks) typeLabel = "plan";

            return `A ${nextValue.pill?.text || nextValue.value}${getOrdinalSuffix(nextValue.value, isDays, isWeeks)} ${typeLabel} is ${nextValue.aboveCapsule.text} for your whole plan`;
        }

        return "Upgrade your plan for more benefits!";
    };

    const offerText = getOfferText();
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
        <Dialog
            open={open}
            onClose={handleCloseOut}
            maxWidth="sm"
            fullWidth
            sx={{
                "& .MuiPaper-root": {
                    bgcolor: "white !important",
                    minHeight: { xs: "40%", md: "60vh" },
                    borderRadius: { xs: "40px", md: "70px" },
                    border: `8px solid ${AppColors.primaryGreen}`,
                    zIndex:99999999,
                    maxHeight:{xs:'70vh',md:'auto'}
                }
            }}
        >
            <DialogContent sx={{ padding: { xs: "30px", md: "30px" }, height: "100%" }}>
                <TextComponent fontSize={{ xs: "24px", md: "28px" }} color={AppColors.black}>
                    Are you Sure?
                </TextComponent>

                <RenderOfferText offerText={offerText} />
                {/* <TextComponent extraSx={{ mt: { xs: 3, md: 5 } }} fontSize={{ xs: "18px", md: "25px" }} color={AppColors.black}>
                    {toSentenceCase(offerText)}
                </TextComponent> */}

                <TextComponent extraSx={{ mt: { xs: 2, md: 3 } }} fontSize={{ xs: "18px", md: "22px" }} color={AppColors.black}>
                    Want to add it?
                </TextComponent>

                <Box>
                    <ButtonComponent
                        onClick={handleYesClick}
                    >Yes Please</ButtonComponent>
                    <ButtonComponent
                        onClick={handleCloseOut}
                        btnType="outlined"
                        extraSx={{ mt: 1, border: "none !important", color: "black" }}
                    >
                        No thanks
                    </ButtonComponent>
                </Box>


                <Box sx={{
                    width: "100%", // Use full width to contain the three elements
                    display: "flex",
                    alignItems: "center", // Vertically center the items
                    justifyContent: "center", // Horizontally center the group
                    mx: "auto",
                    mt: 1,
                    // Optional: Set a max-width if you don't want it to stretch too wide
                    maxWidth: {xs:"400px",md:'400px'}
                }}>
                    {/* 1. Left Image: snack1.png */}
                    <Box sx={{ width: "25%", height: "auto", position: "relative", zIndex: 1, transform: "translateX(25%)" }}>
                        <Image
                          src={
                                isSnack ?
                                snackImages?.sideImage1:
                                mealImages?.sideImage1
                                }
                            height={is768px ? 200 :230} // Set explicit height for better layout control
                            width={is768px ? 200 :230}
                            layout="responsive"
                            objectFit={"contain"}
                        />
                    </Box>

                    {/* 2. Main Central Image: decorateMeal.png - Largest and most prominent */}
                    <Box sx={{ width: "50%", height: "auto", position: "relative", zIndex: 2, mx: -2 }}>
                        <Image
                            src={
                                isSnack ?
                                snackImages?.mainImage:
                                mealImages?.mainImage
                                }
                            height={is768px ? 300 : 400} // Larger height for the main image
                            width={is768px ? 300 : 400}
                            layout="responsive"
                            objectFit={"contain"}
                        />
                    </Box>

                    {/* 3. Right Image: snack2.png */}
                    <Box sx={{ width: "25%", height: "auto", position: "relative", zIndex: 1, transform: "translateX(-25%)" }}>
                        <Image
                            src={
                                isSnack ?
                                snackImages?.sideImage2:
                                mealImages?.sideImage2
                                }
                            height={is768px ? 200:230} // Set explicit height for better layout control
                            width={is768px ? 200:230}
                            layout="responsive"
                            objectFit={"contain"}
                        />
                    </Box>
                </Box>

                <Box
                    sx={{
                        width: "max-content",
                        height: "40px",
                        bgcolor: AppColors.primaryOrange,
                        ...dfjac,
                        padding: "7px 16px",
                        borderRadius: "40px",
                        mx: "auto",
                        mt: 1,
                    }}
                >
                    <TextComponent color={AppColors.white}>Limited time deal</TextComponent>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

const ButtonComponent = (props) => {
    const { btnType = 'contained', onClick = () => { }, extraSx } = props;
    const btnStyle = btnType === 'outlined' ? buttonOutlinedSX : buttonSX;
    return (
        <Box
            onClick={onClick}
            sx={{ ...btnStyle, maxWidth: { xs: '100%', md: '160px' }, height: {md:'40px',xs:'30px'}, mt: {md:3,xs:2}, mx: 'auto', ...dfjac, fontSize: { xs: '18px', md: '24px' }, borderRadius: '40px', ...extraSx }} >
            {props?.children}
        </Box>
    )
}
const TextComponent = (props) => {
    const { fontSize = { xs: '18px', md: '24px' }, color = AppColors.primaryGreen } = props
    return (
        <Typography color={color} sx={{ textAlign: 'center', fontSize: fontSize, fontWeight: 400, lineHeight: 1, fontFamily: "EuclidCircularB !important", ...props?.extraSx }}>
            {props?.children}
        </Typography>
    )
}
PromoBoxModal.propTypes = {
    handleClose: PropTypes.func,
    handleShowCode: PropTypes.func
}
const RenderOfferText = (props) => {
    const {offerText} =props;
  if (!offerText) return null;

  // Match "50% off" or similar discount patterns
  const regex = /(\d+% off)/i;
  const parts = offerText.split(regex);

  return (
    <Typography
      color={AppColors.black}
      sx={{
        textAlign: "center",
        fontSize: { xs: "18px", md: "25px" },
        fontWeight: 400,
        lineHeight: 1.3,
        fontFamily: "EuclidCircularB !important",
        mt: { xs: 2, md: 3 },
      }}
    >
      {parts?.map((part, index) =>
        regex?.test(part) ? (
          <span
            key={index}
            style={{
              textDecoration: "underline",
              fontWeight: "normal",
            }}
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </Typography>
  );
};

