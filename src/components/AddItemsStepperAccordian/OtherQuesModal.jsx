import React from 'react'
import { closeIconSX, DialogSX, titleSX } from '../popUp/commonSX'
import AppColors from '../../helpers/AppColors';
import CloseIcon from "@mui/icons-material/Close";
import { Box, Dialog, DialogContent, Typography } from '@mui/material';
import OtherItemsSearch from './SearchMealComp';

const OtherQuesModal = (props) => {
    const { open,
        onClose, onSaveClick = () => { }, selectedItemOthers,
        MealDate,
        setMealDate } = props;
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
            sx={{
                ".MuiPaper-root": {
                    maxHeight: { xs: '60vh', md: '80vh' }
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
                    sx={{ ...titleSX, textTransform: 'none', mb: '30px' }}
                    color={AppColors.primaryGreen}
                >
                    Search Other Items
                </Typography>
                <Box
                    onClick={onClose}
                    sx={closeIconSX}
                >
                    <CloseIcon />
                </Box>
                <OtherItemsSearch
                    selectedItemOthers={selectedItemOthers}
                    onSaveClick={onSaveClick}
                    MealDate={MealDate}
                    setMealDate={setMealDate}
                />
            </DialogContent>
        </Dialog >
    )
}

export default OtherQuesModal