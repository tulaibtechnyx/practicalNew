import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import { Typography } from "@mui/material";
import AppColors from "../../helpers/AppColors";
import clsx from "clsx";

const CircularNumberSlider = ({
  defaultVal = 0,
  values,
  max,
  onChange,
  color = AppColors.primaryOrange,
  additems = false,
  laoding = false
}) => {
  const options = values && values.length ? values : Array.from({ length: max + 1 }, (_, i) => i);
  const [index, setIndex] = useState(0);
  const [animation, setAnimation] = useState("");
  let touchStartY = 0;

  useEffect(() => {
    const foundIndex = options.indexOf(defaultVal);
    if (foundIndex !== -1 && additems) {
      setIndex(foundIndex);
    }
  }, [defaultVal, options, additems]);

  const handleIncrease = () => {
    setAnimation(styles.slide_up);
    setTimeout(() => {
      const newIndex = (index + 1) % options.length;
      setIndex(newIndex);
      onChange(options[newIndex]);
      setAnimation("");
    }, 650);
  };

  const handleDecrease = () => {
    setAnimation(styles.slide_down);
    setTimeout(() => {
      const newIndex = (index - 1 + options.length) % options.length;
      setIndex(newIndex);
      onChange(options[newIndex]);
      setAnimation("");
    }, 150);
  };

  const handleTouchStart = (e) => {
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    if (diff > 30) handleIncrease();
    else if (diff < -30) handleDecrease();
  };

  const isGreen = color === AppColors.primaryGreen;

  return (
    <div
      className={clsx(styles.slider_container, isGreen ? styles.GreenColor : "")}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.arrow} onClick={handleDecrease}
        style={{ 
          pointerEvents: laoding ? "none" : "auto",
          opacity: laoding ? 0.7 : 1,
         }}
      >
        <img
          className={styles.arrow_up}
          src={
            isGreen
              ? "images/icons/arrow-up-counter.png"
              : "images/icons/arrow-up-counter-yellow.png"
          }
          alt="arrow up"
        />
      </div>
      <div className={`${styles.number_display} ${animation}`}>
        <Typography className={clsx(styles.numberText, isGreen ? styles.GreenColor : "")}>
          {options[index]}
        </Typography>
      </div>
      <div className={styles.arrow} onClick={handleIncrease}
      style={{ 
          pointerEvents: laoding ? "none" : "auto",
          opacity: laoding ? 0.7 : 1,
         }}>
        <img
          className={styles.arrow_down}
          src={
            isGreen
              ? "images/icons/arrow-down-counter.png"
              : "images/icons/arrow-down-counter-yellow.png"
          }
          alt="arrow down"
        />
      </div>
    </div>
  );
};

export default CircularNumberSlider;
