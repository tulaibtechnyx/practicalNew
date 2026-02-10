import { Typography } from "@mui/material"
import React, { useState } from "react"
import styles from "./style.module.scss"
import Popup from "../../components/popUp"
import Button from "@mui/material/Button"
import PropTypes from "prop-types"
import AppColors from "../../helpers/AppColors"
import Tooltip from "@mui/material/Tooltip"
import AppConstants from "helpers/AppConstants"

const MealTypes = (props) => {
  const {
    paraSm,
    para,
    title,
    popUp,
    calories,
    protien,
    crabs,
    fat,
    percentage1,
    percentage2,
    percentage3,
    mb,
    isExecutive
  } = props
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  return (
    <div className={`${styles.mealWrapper} ${isExecutive ? styles.isExecutive : ''}`}>
      <Popup
        open={open}
        handleClose={handleClose}
        handleClickOpen={handleClickOpen}
      />
      <div className={styles.mealText}>
        <Typography sx={{ paddingBottom: "9px" }} variant={"h3"}>
          {title}
        </Typography>
        <div className={styles.buttonWrapper}>
          <Typography variant={"body2"}>
            {para} &nbsp;
            {mb ? <span className={styles.macroStyle}>MB</span> : null}
            {popUp ? (
              <span>
                <Tooltip
                  leaveTouchDelay={10000000}
                  enterTouchDelay={50}
                  className="toolTip sty2 style"
                  title="In this world, there are some incredibly tasty meals that, let’s face it, are not perfectly Macro-Balanced. Banana Pancakes: High Carb, Cheese Omelette: High Fat. Grilled Beef Steak & Sauce: High Protein. We love meals like this & think they deserve a place on our Meal Plan. We’ll still tell you the calories & give you the macros. So it’s all good!"
                  placement="top"
                  arrow
                  componentsProps={{
                    popper: {
                      className: `${isExecutive ? 'isExecutive' : ''}`,
                    },
                  }}
        
                >
                  <Button>i</Button>
                </Tooltip>
              </span>
            ) : null}
          </Typography>
        </div>
      </div>
      <div className={styles.mealBoxes}>
        <div className={styles.mealboxWrap}>
          <div className={styles.Mealbox}>
            <Typography sx={{color:  isExecutive ? AppColors.primaryOrange :  AppColors.primaryGreen }} variant={"h2"}>
              {calories}
            </Typography>
            <Typography
              variant="body3"
              component={"p"}
              sx={{ paddingTop: "5px", color:  isExecutive ? AppColors.primaryOrange :  AppColors.primaryGreen  }}
            >
              {"Calories"}
            </Typography>
          </div>
        </div>
        <div className={styles.mealboxWrap}>
          <Typography sx={{ color:  isExecutive ? AppColors.primaryOrange :  AppColors.primaryGreen  }} variant={"body2"}>
            {percentage1}
          </Typography>
          <div className={styles.Mealbox}>
            <Typography sx={{ color:  isExecutive ? AppColors.primaryOrange :  AppColors.primaryGreen }} variant={"h2"}>
              {protien}
            </Typography>
            <Typography
              variant="body3"
              component={"p"}
              sx={{ paddingTop: "5px", color:  isExecutive ? AppColors.primaryOrange :  AppColors.primaryGreen }}
            >
              {"Protein"}
            </Typography>
          </div>
        </div>
        <div className={styles.mealboxWrap}>
          <Typography sx={{ color:  isExecutive ? AppColors.primaryOrange :  AppColors.primaryGreen  }} variant={"body2"}>
            {percentage2}
          </Typography>
          <div className={styles.Mealbox}>
            <Typography sx={{ color:  isExecutive ? AppColors.primaryOrange :  AppColors.primaryGreen  }} variant={"h2"}>
              {crabs}
            </Typography>
            <Typography
              variant="body3"
              component={"p"}
              sx={{ paddingTop: "5px", color:  isExecutive ? AppColors.primaryOrange :  AppColors.primaryGreen  }}
            >
              {"Carbs"}
            </Typography>
          </div>
        </div>
        <div className={styles.mealboxWrap}>
          <Typography sx={{ color:  isExecutive ? AppColors.primaryOrange :  AppColors.primaryGreen  }} variant={"body2"}>
            {percentage3}
          </Typography>
          <div className={styles.Mealbox}>
            <Typography sx={{ color:  isExecutive ? AppColors.primaryOrange :  AppColors.primaryGreen  }} variant={"h2"}>
              {fat}
            </Typography>
            <Typography
              variant="body3"
              component={"p"}
              sx={{ paddingTop: "5px", color:  isExecutive ? AppColors.primaryOrange :  AppColors.primaryGreen  }}
            >
              {"Fats"}
            </Typography>
          </div>
        </div>
      </div>
      {paraSm ? (
        <div className={styles.calorieDatra}>
          <Typography
            sx={{ textAlign: "center", padding: " 0 15px" }}
            variant={"body3"}
            component={"p"}
          >
            {paraSm}
          </Typography>
        </div>
      ) : null}
    </div>
  )
}

MealTypes.propTypes = {
  percentage1: PropTypes.string,
  percentage2: PropTypes.string,
  percentage3: PropTypes.string,
  calories: PropTypes.string,
  protien: PropTypes.string,
  crabs: PropTypes.string,
  fat: PropTypes.string,
  title: PropTypes.string,
  para: PropTypes.string,
  paraSm: PropTypes.string,
  popUp: PropTypes.any
}
export default MealTypes
