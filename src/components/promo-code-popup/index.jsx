import { useEffect, useState } from "react";
import { Button, ThemeProvider, Typography } from "@mui/material";
import styles from './style.module.scss';
import InputField from "Elements/inputField";
import theme from "../../styles/themes/theme"

const PromoCodePopup = ({
    handleApplyPromo = () => { },
    open = false,
    modalTitle = '',
    modalDescription = '',
    togglePromoPopup = () => {},
    appliedPromoCode = '',
    isDiscountApplied = false
}) => {
    const [promoCode, setPromoCode] = useState("");

    const handleClearField = () => {
        if(!isDiscountApplied) setPromoCode("");
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                togglePromoPopup(false);
                handleClearField();
            }
        };

        const handleClickOutside = (event) => {
            if (event.target.id === 'backdrop') {
                togglePromoPopup(false);
                handleClearField();
            }
        };

        const handlePrefillField = () => {

            if(!appliedPromoCode || !isDiscountApplied) handleClearField();

            setPromoCode(appliedPromoCode);
        }

        if (open) {
            handlePrefillField();
            window.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('keydown', handleKeyDown);
            document.body.classList.add("modalOpen");
        } else {
            document.body.classList.remove("modalOpen");
        }

        // Cleanup listeners and classes when the component unmounts or `open` changes
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('keydown', handleKeyDown);
            document.body.classList.remove("modalOpen");
        };
    }, [open, togglePromoPopup]);

    return (
        <ThemeProvider theme={theme}>
            <div id="backdrop" className={`${styles.backdrop} ${open ? styles.open : ''}`}>
                <div className={styles.modalWrapper}>
                    <div className={styles.modalContent}>
                        <Typography color="initial" className={styles.modalTitle}>
                            {modalTitle}
                        </Typography>
                        <Typography color="initial" className={styles.modalBody}>
                            {modalDescription}
                        </Typography>
                        <div className={`${styles.inputWrapper} promoInputWrapper`}>
                            <InputField
                                defaultValue={isDiscountApplied ? appliedPromoCode : ''}
                                customClass="inputFieldPromo"
                                name="promoCode"
                                placeholder="Enter Promo Code"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            />
                        </div>
                        <div className={styles.buttonWrapper}>
                            <Button
                                onClick={() => handleApplyPromo(promoCode)}
                                className={styles.button}
                                disabled={isDiscountApplied && appliedPromoCode == promoCode}
                            >
                                {isDiscountApplied && appliedPromoCode == promoCode ? "Promo Applied" : "Apply Promo"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default PromoCodePopup;
