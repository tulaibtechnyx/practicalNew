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
    buttonOutlinedSX
} from "./commonSX";
import AppColors from "@helpers/AppColors";

const RevertWeekModal = (props) => {
    const {
        open,
        onClose,
        onConfirm,
        weekName,
        loader,
        targetCopy
    } = props;

    // const ThisWeekContainsAThresoldDate = 
    const handleClose = () => {
        onClose();
    }
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
            sx={{
                ".MuiPaper-root": {
                    maxHeight: { xs: '53vh', md: 'max-content' },
                    overflow: { xs: 'auto', md: "hidden" },
                    "button":{
                        margin:0
                    }
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
                    scrollbarWidth: 'none', // For Firefox
                    '&::-webkit-scrollbar': { // For Chrome, Safari, and Opera
                        display: 'none',
                    },
                    '-ms-overflow-style': 'none', // For Internet Explorer and Edge
                    padding: { xs: "20px 20px", md: "60px 40px" },
                    backgroundSize:'130% !important'
                }}
            >
                <Typography
                    variant="h2"
                    sx={{...titleSX,bgcolor:'transparent'}}
                    color={AppColors.primaryGreen}>
                    {"REVERT WEEK!"}
                </Typography>
                <Box
                    onClick={onClose}
                    sx={{...closeIconSX,color:`${AppColors.primaryGreen} `}}
                >
                    <CloseIcon />
                </Box>

                <Box sx={{  my: 2 }}>
                    <Typography variant="body2"
                        sx={{
                            fontSize: { xs: '13px ', md: '18px' }
                        }}>
                        This will undo the copying of items from Week {targetCopy}. Are you sure you want to continue? 

                    </Typography>
                </Box>
                <Box sx={{display:'flex',justifyContent:'center',gap:'10px'}} >
                <Button
                    onClick={() => {
                        onClose()
                    }}
                    disabled={loader}
                    sx={{...buttonOutlinedSX, minWidth:{xs:'100px',md:'150px'}}}
                >
                    {'No'}
                </Button>
                <Button
                    onClick={() => {
                        onConfirm ? onConfirm() : null;
                    }}
                    disabled={loader}
                    sx={{...buttonSX, minWidth:{xs:'100px',md:'150px'}}}
                >
                    {'Yes'}
                </Button>
                </Box>
            </DialogContent>
        </Dialog >
    );
};

export default RevertWeekModal;