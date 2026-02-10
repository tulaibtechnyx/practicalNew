import AppConstants from '@helpers/AppConstants';
import { Box, Button, TextField, ThemeProvider, Typography } from '@mui/material';
import InputField from 'Elements/inputField';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import theme from 'styles/themes/theme';
import { isNull } from '../../helpers/CommonFunc';
import AppColors from '@helpers/AppColors';

const PromoDiscountFeild = (props) => {
    const {
        isPromoApplicable = false,
        promoDetails = null,
        togglePromoPopup = () => { },
        handleApplyPromo = () => { },
        appliedPromoCode = '',
        isDiscountApplied = false,
        removePromoCode = false,
        appliedPromoCodeState = '',
        setAppliedPromoCodeState = () => { },
        removeDiscountClick = () => { },
        loader = false,
    } = props;

    const { isExecutive } = useSelector((state) => state.auth)

    const [promoCode, setPromoCode] = useState("");
    const [promoBoxChanged, setpromoBoxChanged] = useState(false);

    const handleClearField = () => {
        if (!isDiscountApplied) setPromoCode("");
    }

    // useEffect(() => {
    //     if (removePromoCode) {
    //         setPromoCode("");
    //         setpromoBoxChanged(false);
    //     }
    // }, [removePromoCode]);

    useEffect(() => {
        if (promoDetails && (AppConstants.promoCodeTypes.ambassador_individual == promoDetails?.promo_type)) {
            const foundYourPromo = promoDetails?.ambassador_referral_codes?.find((item) => item == promoCode);
            if (foundYourPromo) {
                setPromoCode(foundYourPromo);
            } else {
                if (promoDetails && isNull(promoDetails?.promo_code)) {
                    if (typeof window !== 'undefined') {
                        let storedcode = sessionStorage.getItem('promoCode');
                        storedcode = JSON.parse(storedcode);
                        setPromoCode(storedcode || '');
                    }
                } else {
                    setPromoCode(promoDetails?.promo_code || '');

                }
            }
        } else {
            if (promoDetails && promoDetails?.promo_code == '') {
                if (typeof window !== 'undefined') {
                    let storedcode = sessionStorage.getItem('promoCode');
                    storedcode = JSON.parse(storedcode);
                    setPromoCode(storedcode || '');
                }
            } else {
                setPromoCode(promoDetails?.promo_code || '');
            }
        }
    }, [promoDetails]);

    useEffect(() => {
        if (promoCode == appliedPromoCode) {
            setpromoBoxChanged(false)
        } else {
            if (promoCode) {
                setpromoBoxChanged(true)
                // setconditionForRemove(false)
            } else {
                setpromoBoxChanged(false)
                // setconditionForRemove(true)
            }
        }
    }, [promoCode])
    useEffect(() => {
        if (!appliedPromoCode || !isDiscountApplied) { handleClearField() }
        else {
            promoCode == '' ? setPromoCode(appliedPromoCode) : setPromoCode(promoCode)
            setconditionForRemove(true)
        
        }
        // Cleanup listeners and classes when the component unmounts or `open` changes
        return () => {
            togglePromoPopup(false);
            setpromoBoxChanged(false)
            handleClearField();
        };
    }, [appliedPromoCode]);
    const [conditionForRemove,setconditionForRemove] = useState(false);

    useEffect(()=>{
        if(isDiscountApplied || promoDetails){
            setconditionForRemove(true)
        } else{
            setconditionForRemove(false)
        }   
    },[isDiscountApplied,promoDetails])

    return (
            <div style={{ display: 'flex', justifyContent: 'center' }} >
                {isPromoApplicable && (
                    <div>
                        <Typography
                            sx={{ color: '#fff', mb: '10px', fontSize: '16px' }}
                        // onClick={() => togglePromoPopup(true)}
                        >
                            {isDiscountApplied && !promoBoxChanged ? "Promo Code Applied" : "Got a Promo Code?"}
                        </Typography>
                        <Box sx={{
                            bgcolor: '#fff',
                            borderRadius: '45px',
                            width: 'max-content',
                            overflow: 'hidden',
                            p:'1px',
                            pb:'12px'
                            // height: promoBoxChanged ? "100px" : '45px',
                            // p: promoBoxChanged ? "3px" : '0px',
                            // pb: promoBoxChanged ? "8px" : '0px',
                            // transition: 'ease 0.3s'

                        }} >
                            <div className={` promoInputWrapper`}>
                                <InputField
                                    dontuseUserInput={true}
                                    sx={{ width: '100%', borderRadius: '20px' }}
                                    size='small'
                                    defaultValue={isDiscountApplied ? appliedPromoCode : ''}
                                    customClass="inputFieldPromo-2"
                                    name="promoCode"
                                    placeholder="Insert Promo Code Here"
                                    value={promoCode}
                                    isExecutive={isExecutive}
                                    onChange={(e) => {
                                        if(conditionForRemove){
                                            setconditionForRemove(false)
                                        }
                                        setPromoCode(e.target.value.toUpperCase())}}
                                />
                            </div>
                            <Button
                                sx={{ 
                                    maxWidth: '280px !important',
                                    padding:"8px !important",
                                    borderRadius:'20px !important',
                                 }}
                                fullWidth
                                color={conditionForRemove ?'error' :'primary' }
                                variant={conditionForRemove ? 'outlined': "contained"}
                                onClick={() => {
                                    if(conditionForRemove){
                                        removeDiscountClick()
                                    } else{
                                        handleApplyPromo(promoCode);
                                        setpromoBoxChanged(false)
                                        setAppliedPromoCodeState(promoCode);
                                    }

                                }}
                                disabled={loader}
                                // disabled={conditionForRemove}
                            >
                                {conditionForRemove ? "Remove Promo Code" : "Apply Promo Code"}
                            </Button>
                        </Box>
                    </div>
                )}
            </div>
    )
}

export default PromoDiscountFeild