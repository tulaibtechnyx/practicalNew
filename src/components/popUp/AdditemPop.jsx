import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    Typography,
    Button,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import {
    DialogSX,
    titleSX,
    closeIconSX,
    buttonSX
} from "./commonSX";
import { showFaliureToast } from "@helpers/AppToast";
import AppColors from "@helpers/AppColors";
import StepBox from '@components/StepBox'
import AddItemsStepperAccordian from "../AddItemsStepperAccordian";
import AppConstants from "@helpers/AppConstants";

const AdditemPop = (props) => {
    const {
        open,
        onClose,
        onConfirm,
        weeksLen,
        isPast,
        title,
        AddItemType,
        QuestionsChecked,
        setQuestionsChecked,
        modalMode = false
    } = props;

    const dispatch = useDispatch();
    const [AddsnackLoader, setAddsnackLoader] = useState(false)
    const handleClose = () => {
        onClose()
    }
    const handleSubmit = async () => {
        try {
            console.log("API responses:", results);
        } catch (err) {
            console.error("Error in copying meals:", err);
            showFaliureToast("Error copying meals: " + err?.response?.data?.data?.error);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth
            sx={{
                ".MuiPaper-root": {
                    height: {
                        xs: modalMode ? '30vh' : '52vh', 
                        md:
                            AddItemType == AppConstants.AdditemModal.Consultation ||
                                AddItemType == AppConstants.AdditemModal.Coaching ?'62vh' :'72vh' },
                                
                }
            }}
            PaperProps={{
                sx: {
                    backgroundColor: "white !important",
                }
            }}
        >

            <DialogContent
                sx={{
                    ...DialogSX,
                    overflow: { xs: 'auto', md: "auto" },
                    scrollbarWidth: 'none', // For Firefox
                    '&::-webkit-scrollbar': { // For Chrome, Safari, and Opera
                        display: 'none',
                    },
                    '-ms-overflow-style': 'none', // For Internet Explorer and Edge
                    padding: { xs: "40px 20px", md: "60px 40px" },
                }}
            >
                <Typography
                    variant="h1"
                    sx={{ ...titleSX, textTransform: 'none', mb: '10px' }}
                    color={AppColors.primaryGreen}
                >
                    {title}
                </Typography>
                <Typography sx={{
                    fontSize: { xs: '13px', md: '18px' },
                }} >
                    {
                        AddItemType == AppConstants.AdditemModal.Consultation ||
                            AddItemType == AppConstants.AdditemModal.Coaching
                            ?
                            "with Taz (Msc. Nutr)" :
                            'What do you want to Add?'
                    }
                </Typography>
                <Box
                    onClick={onClose}
                    sx={closeIconSX}
                >
                    <CloseIcon />
                </Box>

                <Box sx={{ my: '30px' }}>
                    <AddItemsStepperAccordian
                        AddItemType={AddItemType}
                        title={title}
                        QuestionsChecked={QuestionsChecked}
                        setQuestionsChecked={setQuestionsChecked}
                        onClose={onClose}
                    />
                </Box>

                {/* Confirm Bypass Button */}
                {/* <Button
                    onClick={() => {
                        onConfirm ? onConfirm() : null;
                        handleSubmit()
                    }}
                    disabled={AddsnackLoader || isPast}
                    sx={buttonSX}
                >
                    {'Confirm'}
                </Button> */}

            </DialogContent>
        </Dialog >
    );
};

export default AdditemPop;