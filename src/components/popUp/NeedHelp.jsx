import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
    DialogSX,
    titleSX,
    closeIconSX,
    textwithmbSX,
    buttonOutlinedSX,
    buttonSX,
    dfac,
    dfjac,
} from "./commonSX";
import AppColors from "@helpers/AppColors";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useSelector } from "react-redux";
import AppConstants from "@helpers/AppConstants";
const NeedHelp = (props) => {
    const {
        open,
        onClose,
        onConfirm,
        title = 'Need Help?',
        content =
        <>
            <Typography variant="body2" sx={{ ...textwithmbSX, my: 3 }}>
                Wanting to update this preference? Please call or WhatsApp Customer Care on {' '}
                <Box component={'span'} sx={{ color: AppColors?.primaryGreen, cursor: "pointer", ":hover": { textDecoration: 'underline' }, }} onClick={handleWhatsAppRedirect} >
                    +971-52-3271183  <WhatsAppIcon style={{ marginBottom: "-5px" }} />
                </Box>{' '}
                to assist you.
            </Typography>
        </>
        ,
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        showCloseIcon = true,
        showButton = false,
    } = props;

    const { userDetails } = useSelector((state) => state.auth)

    const handleWhatsAppRedirect = () => {
        const message = `Hello, I'm ${userDetails?.data?.first_name} ${userDetails?.data?.sur_name} need assistance regarding`;

        // Encode the message and create the WhatsApp URL
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${AppConstants.whatsAppNumber}?text=${encodedMessage}`;

        // Set the WhatsApp link
        window.open(url, '_blank');
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
            sx={{
                ".MuiPaper-root": {
                    maxHeight: { xs: '52vh', md: 'max-content' },
                    overflow: { xs: 'auto', md: "hidden" }
                }
            }}
            PaperProps={{
                sx: {
                    backgroundColor: "white !important",
                }
            }}
        >
            <DialogContent
                sx={DialogSX}
            >
                <Typography
                    variant="h2"
                    sx={{...titleSX,bgcolor:'transparent'}}>
                    {title}
                </Typography>
                <Box
                    onClick={onClose}
                    sx={closeIconSX}
                >
                    <CloseIcon />
                </Box>
                {/* Instructions */}
                {content}
                <Box sx={{...dfjac}}>
                {
                    showButton && 
                    <Box sx={{...buttonSX, maxWidth:'220px',}} onClick={onConfirm}>
                        {confirmText}
                    </Box>
                }
                </Box>
            </DialogContent>
        </Dialog>
    );
};


export default NeedHelp;
