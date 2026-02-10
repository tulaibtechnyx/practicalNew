import React, { useEffect, useState } from "react"
import styles from "./style.module.scss"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import AppColors from "helpers/AppColors"
import clsx from "clsx"

const PromoBanner = ({
  offerPrice,
  weeks,
  noOfMeals,
  noOfSnacks,
  extraMealElectro,
  promoCode,
  timer,
  onClaim,
  isExecutive,
  cta_text = 'Claim',
  loader = false
}) => {
  const [isHeaderFixed, setIsHeaderFixed] = useState(false)
  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    if (!timer) return;

    const targetDate = new Date(timer).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setCountdown("EXPIRED");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(
        `${days.toString().padStart(2, "0")} days, ` +
        `${hours.toString().padStart(2, "0")}h, ` +
        `${minutes.toString().padStart(2, "0")}m, ` +
        `${seconds.toString().padStart(2, "0")}s`
      );
    };

    updateTimer(); // Initial
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [timer]);
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10
      setIsHeaderFixed(scrolled)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  const getTopValue = () => {
    const isSmallScreen = window.innerWidth <= 767;
    if (isHeaderFixed) {
      return isSmallScreen ? "89.4px" : "74px";
    } else {
      return isSmallScreen ? "89.4px" : "99px";
    }
  };
  return (
    <div >
      <Box
        className={`${styles.banner_sec} ${isExecutive ? styles.isExecutive : ""
          }`}
        style={{
          backgroundColor: "#fa7324",
          top: getTopValue(),
          transition: "top 0.3s ease"
        }}
      >
        <div className={clsx(styles.banner_wrapper, styles.sty3)}>
          <div className={styles.content}>
            <div className={styles.first_line}>
              <p className={styles.italic} style={{ color: AppColors.white }}>
                {offerPrice}
              </p>
              {/* <p className={styles.italic} style={{ color: AppColors.white }}>
                  {weeks}
                </p> */}
              {/* <p className={styles.italic} style={{ color: AppColors.white }}>
                  {noOfMeals}
                </p>
                <p className={styles.italic} style={{ color: AppColors.white }}>
                  {noOfSnacks}
                </p> */}
            </div>

            <div className={styles.second_line}>
              <p className={styles.italic} style={{ color: AppColors.white }}>
                {extraMealElectro}
              </p>
              <p className={styles.bold} style={{ color: AppColors.white }}>
                Promo Code: {promoCode}
              </p>
            </div>
          </div>

          <div className={styles.btn_sec}>
            <Button
              variant="contained"
              disabled={loader}
              onClick={onClaim}
              className={styles.btn_small}
              sx={{
                backgroundColor: AppColors.primaryGreen,
                color: AppColors.white,
                ":disabled": {
                  backgroundColor: AppColors.lightgray,
                },
                ":hover": {
                  backgroundColor: AppColors.white,

                }
              }}
            >
              {cta_text}
            </Button>
          </div>
        </div>
        <Box className={styles.lower_div}>
          <p className={styles.greenText}>Ends:</p>
          <p className={styles.greenText}>{countdown}</p>
        </Box>
      </Box>
    </div>
  )
}

export default PromoBanner
