import React, { useEffect, useRef, useState } from "react"
import { Box, Button, Dialog, DialogContent, Typography, useMediaQuery } from "@mui/material"
import PropTypes from "prop-types"
import AppColors from "@helpers/AppColors"
import { useDispatch, useSelector } from "react-redux"
import CustomDialog from "../popUp/CustomDialog"
import AppDataConstant from "../../helpers/AppDataConstant"
import { buttonOutlinedSX, buttonSX, dfac, dfjac } from "../popUp/commonSX"
import Image from "next/image"
import { getOrdinalSuffix, toSentenceCase } from "../../helpers/CommonFunc"

export default function PromoLockedMealAlert({
    handleYesClick = () => { },
    handleCloseOut = () => { },
    open,
    openAlertObj = null,

}) {

    const is400px = useMediaQuery(`(max-width: 400px)`)
    // 🧠 Compute dynamic offer text


    const minUpgradeMeal = openAlertObj?.value + 1;
    return (
        <Dialog
            open={open}
            onClose={handleCloseOut}
            maxWidth="xs"
            fullWidth
            sx={{
                "& .MuiPaper-root": {
                    // bgcolor: "white !important",
                    minHeight: { xs: "230px", md: "260px" },
                    borderRadius: { xs: "20px", md: "30px" },
                    border: `8px solid ${AppColors.primaryGreen}`,
                    zIndex: 99999999,
                    maxHeight: { xs: '70vh', md: 'auto' },
                    position:'relative'
                }
            }}
        >
            <DialogContent sx={{ padding: { xs: "30px", md: "30px" }, height: "100%" }}>
                <TextComponent fontSize={{ xs: "24px", md: "32px" }} color={AppColors.white}>
                    Attention!
                </TextComponent>

                <TextComponent extraSx={{ mt: { xs: 2, md: 3 }, fontWeight: 300 }} fontSize={{ xs:is400px ?"14px": "18px", md: "20px" }} color={AppColors.white}>
                    This option required at least {minUpgradeMeal} meals per day. Please upgrade your plan to continue.
                </TextComponent>

                <Box>
                    <ButtonComponent
                        onClick={handleYesClick}
                        extraSx={{ mt: 3, border: "none !important", color: AppColors.primaryGreen, backgroundColor: AppColors.white,  
                            minWidth: { xs:"100px !important", md: '220px' },
                            maxWidth: { xs:is400px?"120px !important": '100%', md: '160px' }}} 
                    >
                        Upgrade
                    </ButtonComponent>
                </Box>
            </DialogContent>
            <Button className="crossButton"onClick={() => handleCloseOut()} sx={{color:'white !important'}}>
                x
            </Button>
        </Dialog>
    );
}

const ButtonComponent = (props) => {
    const { btnType = 'contained', onClick = () => { }, extraSx } = props;
    const btnStyle = btnType === 'outlined' ? buttonOutlinedSX : buttonSX;
    return (
        <Box
            onClick={onClick}
            sx={{ ...btnStyle,  height: { md: '40px', xs: '30px' }, mt: { md: 3, xs: 2 }, mx: 'auto', ...dfjac, fontSize: { xs: '18px', md: '24px' }, borderRadius: '40px', ...extraSx }} >
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
PromoLockedMealAlert.propTypes = {
    handleClose: PropTypes.func,
    handleShowCode: PropTypes.func
}
