import Typography from "@mui/material/Typography";
import InputField from "../../Elements/inputField";
import Button from "@mui/material/Button"
import { useState } from "react";
import AppColors from "../../helpers/AppColors";
import styles from './style.module.scss'
import AppLogger from "helpers/AppLogger";

const PromoCode = ({
    handleApplyPromoCode = () => {},
    discountApplied = false ,
    errorMessage = '',
    discountValue = 0,
    discountType = '',
}) => {
    const [promoCode, setPromoCode] = useState("");

    return (
        <div className="promoWrapper">
            <div className={styles.promoBox}>
                <Typography
                    variant="body1"
                    sx={{
                        color: AppColors.primaryGreen,
                        fontWeight: "500",
                        marginBottom: "15px"
                    }}
                    className={styles.heading}
                >
                    Promo Code*
                </Typography>
                <form action="">
                    <div className={styles.btn_sec}>
                        <div className="subCta sty2">
                            <div className="input-group">
                                <InputField
                                    customClass={'inputCustom'}
                                    placeholder="Enter Promo Code"
                                    value={promoCode}
                                    onChange={(e) => {
                                        setPromoCode(e.target.value.toUpperCase())
                                    }}
                                />
                                {errorMessage && errorMessage !== "" && (
                                    <Typography
                                        sx={{
                                            color: AppColors.lightRed,
                                            textAlign: "center",
                                            fontSize: "15px",
                                            paddingBottom: "5px"
                                        }}
                                    >
                                        {errorMessage}
                                    </Typography>
                                )}
                                <span className="input-group-btn">
                                    <Button
                                        onClick={() => {
                                            handleApplyPromoCode(promoCode);
                                            AppLogger("Clicked apply promo")
                                        }}
                                        variant="outlined"
                                        sx={{
                                            minWidth: "114px",
                                            padding: "0",
                                            fontSize: "12px !important",
                                            disableRipple: true,
                                            background: AppColors.primaryGreen,
                                            color: AppColors.white,
                                            borderRadius: "50px",
                                            borderColor: AppColors.primaryGreen,
                                            "&:hover": {
                                                background: AppColors.white,
                                                color: AppColors.primaryGreen,
                                                borderRadius: "50px",
                                                borderColor: AppColors.primaryGreen
                                            }
                                        }}
                                    >
                                        APPLY
                                    </Button>
                                </span>
                            </div>
                        </div>
                    </div>
                </form>
                <Typography
                    variant="body2"
                    sx={{
                        color: AppColors.primaryGreen,
                        fontSize: "8px",
                        textAlign: "center",
                        marginTop: "10px"
                    }}
                    className={styles.heading}
                >
                    *Please note: Only one discount code can be used per
                    purchase
                </Typography>{" "}
                {discountApplied && (
                        <>
                            {
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: AppColors.primaryGreen,
                                        fontWeight: "500",
                                        marginBottom: "5px",
                                        marginTop: "20px",
                                        textAlign: "center"
                                    }}
                                    className={styles.heading}
                                >
                                    YAY! You saved {discountType == "flat" ? "AED" : ""}{" "}
                                    {discountValue}
                                    {discountType !== "flat" ? "%" : ""}
                                </Typography>
                            }
                            <Typography
                                variant="body2"
                                sx={{
                                    color: AppColors.primaryGreen,
                                    textAlign: "center",
                                    fontSize: "12px"
                                }}
                                className={styles.heading}
                            >
                                Coupon Applied
                            </Typography>
                        </>
                    )}
            </div>
        </div>
    )
}

export default PromoCode
