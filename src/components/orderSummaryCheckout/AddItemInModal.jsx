import React, { useEffect, useRef, useState } from "react"
import { Box, Dialog, DialogContent, Typography, useMediaQuery } from "@mui/material"
import PropTypes from "prop-types"
import AppColors from "@helpers/AppColors"
import { useDispatch, useSelector } from "react-redux"
import AppDataConstant from "../../helpers/AppDataConstant"
import { buttonOutlinedSX, buttonSX, dfac, dfjac } from "../popUp/commonSX"
import Image from "next/image"
import { getOrdinalSuffix, toSentenceCase } from "../../helpers/CommonFunc"
import Additems from "../../screens/AddItems"
import CustomDialog from "../popUp/CustomDialog"
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
    numberToAddforNextValue = () => { },
    orderIDfromProps = null,
    finalData,
    setFinalData
}) {

    const is768px = useMediaQuery(`(max-width: 768px)`)
    return (
        <CustomDialog
            open={open}
            onClose={handleCloseOut}
            fullWidth
            extraSxMain={{ zIndex: 999 }}
            extraSx={{
                width: '100%', maxWidth: is768px ? '90vw' : '70%', marginTop: is768px ? '170px' : '50px', maxHeight: is768px ? '70vh' : '70vh', overflowY: 'auto', minHeight: is768px ? '70vh' : '70vh',
                backgroundImage: `url(/images/bg/quiz-bg-webp.webp)`,
                backgroundRepeat: "repeat-y",
                backgroundPosition: "fixed",
                backgroundSize: 'cover',
            }}
        >
            <DialogContent sx={{ height: "100%", p: "10px" }}>
                <Additems
                    orderIDfromProps={orderIDfromProps}
                    finalData={finalData}
                    setFinalData={setFinalData}
                    modalMode={true}
                    handleCloseOut={handleCloseOut}
                />
            </DialogContent>
        </CustomDialog>
    );
}

PromoBoxModal.propTypes = {
    handleClose: PropTypes.func,
    handleShowCode: PropTypes.func
}


