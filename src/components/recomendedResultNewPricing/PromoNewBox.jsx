import { Box, Button, TextField, ThemeProvider, Typography } from '@mui/material';
import InputField from 'Elements/inputField';
import React, { useEffect, useState } from 'react'
import theme from 'styles/themes/theme';
import styles from './style.module.scss';

const PromoNewBox = (props) => {
    const {
        isPromoApplicable,
        discountData,
        togglePromoPopup,
        handleApplyPromo = () => { },
        appliedPromoCode = '',
        isDiscountApplied = false
    } = props;
    const [promoCode, setPromoCode] = useState("");
    const [promoBoxChanged, setpromoBoxChanged] = useState(false);

    const handleClearField = () => {
        if (!isDiscountApplied) setPromoCode("");
    }
    useEffect(() => {
        if (promoCode == appliedPromoCode) {
            setpromoBoxChanged(false)
        } else {
            setpromoBoxChanged(true)
        }
    }, [promoCode])
    useEffect(() => {
        if (!appliedPromoCode || !discountData.isDiscountApplied) { handleClearField() }
        else {
            setPromoCode(appliedPromoCode);
        }
        // Cleanup listeners and classes when the component unmounts or `open` changes
        return () => {
            togglePromoPopup(false);
            setpromoBoxChanged(false)
            handleClearField();
        };
    }, [togglePromoPopup]);

    return (
        <ThemeProvider theme={theme}>
            <div style={{ display: 'flex', justifyContent: 'center' }} >
                {isPromoApplicable && (
                    <div>
                        <Typography
                            sx={{ color: '#fff', mb: '10px',fontSize:'16px' }}
                            // onClick={() => togglePromoPopup(true)}
                        >
                            {discountData.isDiscountApplied && !promoBoxChanged ? "Promo Code Applied" : "Got a Promo Code?"}
                        </Typography>
                        <Box sx={{
                            bgcolor: '#fff',
                            borderRadius: '40px',
                            width: 'max-content',
                            overflow: 'hidden',
                            height: promoBoxChanged ? "100px" : '50px',
                            p: promoBoxChanged ? "10px" : '0px',
                            transition: 'ease 0.3s'

                        }} >
                            <div className={` promoInputWrapper`}>
                                <InputField
                                    dontuseUserInput={true}
                                    sx={{ width: '100%', borderRadius: '20px' }}
                                    size='small'
                                    defaultValue={isDiscountApplied ? appliedPromoCode : ''}
                                    customClass="inputFieldPromo-2"
                                    name="promoCode"
                                    placeholder="Enter Promo Code"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                />
                            </div>
                            <Button
                                sx={{ maxWidth: '250px' }}
                                fullWidth
                                variant="contained"
                                onClick={() => {handleApplyPromo(promoCode); setpromoBoxChanged(false)

                                }}
                                disabled={isDiscountApplied && appliedPromoCode == promoCode}
                            >
                                {isDiscountApplied && appliedPromoCode == promoCode ? "Promo Applied" : "Apply Promo"}
                            </Button>
                        </Box>
                    </div>
                )}
            </div>
        </ThemeProvider>
    )
}

export default PromoNewBox