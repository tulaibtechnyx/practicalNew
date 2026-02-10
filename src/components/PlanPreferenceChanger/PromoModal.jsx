import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import AppColors from '../../helpers/AppColors';
import { buttonOutlinedSX, buttonSX, dfjac } from '../popUp/commonSX';

const PromoInvalidModal = ({ open, reason, onConfirm, onCancel }) => (
    <Dialog open={open} onClose={onCancel}  >
        <DialogTitle>
            <Typography color={AppColors.white} variant='h4' sx={{ mt: 1 }}>
                Promo Code Update
            </Typography>
        </DialogTitle>
        <DialogContent>
            <Typography color={AppColors.white} sx={{ mt: 1 }}>
                {reason}
            </Typography>
            <Typography color={AppColors.white} sx={{ mt: 2 }}>
                Changing your plan will make this promo inapplicable. Do you still want to continue?
            </Typography>
            <Box sx={{...dfjac,mt:2,flexWrap:'wrap',gap:'10px'}}>
                <Box sx={{ ...buttonOutlinedSX, maxWidth: '120px !important' }} onClick={onCancel} >Cancel</Box>
                <Box sx={{ ...buttonOutlinedSX, maxWidth: '120px !important' }} onClick={onConfirm} >
                    Continue Anyway
                </Box>
            </Box>
        </DialogContent>
    </Dialog>
);

export default PromoInvalidModal;
