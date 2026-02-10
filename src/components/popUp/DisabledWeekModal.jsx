import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    Typography,
    Button,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
    DialogSX,
    titleSX,
    closeIconSX,
    buttonSX,
} from "./commonSX";
import AppColors from "@helpers/AppColors";
import AppConstants from "@helpers/AppConstants";

const DisabledWeekModal = (props) => {
    const {
        open,
        onClose,
        handleChange
    } = props;
    const handleClose = () => {
        onClose();
    }
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
            sx={{
                ".MuiPaper-root": {
                    maxHeight: { xs: '53vh', md: 'max-content' },
                    overflow: { xs: 'auto', md: "hidden" },
                    "button": {
                        margin: 0
                    }
                }
            }}
            PaperProps={{
                sx: {
                    backgroundColor: "white !important",
                    backgroundImage: 'url(/images/bg/quiz-bg-webp.png)',
                    backgroundSize: 'cover',
                }
            }}
        >

            <DialogContent
                sx={{
                    ...DialogSX,
                    scrollbarWidth: 'none', // For Firefox
                    '&::-webkit-scrollbar': { // For Chrome, Safari, and Opera
                        display: 'none',
                    },
                    '-ms-overflow-style': 'none', // For Internet Explorer and Edge
                    padding: { xs: "20px 20px", md: "60px 40px" },
                }}
            >
                <Typography
                    variant="h2"
                    color={AppColors.primaryGreen}
                    sx={{ ...titleSX, bgcolor: 'transparent' }}>
                    {"PAST   WEEK!"}
                </Typography>
                <Box
                    onClick={onClose}
                    sx={closeIconSX}
                >
                    <CloseIcon />
                </Box>

                <Box sx={{ my: 2 }}>
                    <Typography variant="body2"
                        sx={{
                            fontSize: { xs: '13px ', md: '18px' }
                        }}>
                        To see your previous deliveries and rate your food, go to the Past Orders tab.
                    </Typography>
                </Box>
                <Box sx={{mt:5}}>
                <Button
                    onClick={() => {
                        handleClose()
                        handleChange(0, AppConstants?.TabValues.PAST_ORDERS)
                    }}
                    sx={{...buttonSX}}
                >
                    {'Go to past order'}
                </Button>
                </Box>
            </DialogContent>
        </Dialog >
    );
};

export default DisabledWeekModal;