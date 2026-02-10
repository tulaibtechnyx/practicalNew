import React, { useState } from "react"
import { Button, Typography } from "@mui/material"
import styles from "./style.module.scss"
import clsx from "clsx"
import AppColors from "helpers/AppColors"
import useMediaQuery from "@mui/material/useMediaQuery"
import MealInfoPop from "components/popUp/mealInfoPop"
import AppDataConstant from "helpers/AppDataConstant"
import Chilli from "../../../public/images/icons/chilli.svg"
import { extractObjects } from "helpers/ShortMethods"
import Protiens from "../../../public/images/icons/protiens.svg"
import ProtienPop from "components/popUp/protienPop"
const PastMeals = ({ meal, rateFunc , isExecutive, 
    isAddonItem=false,
  isAddonMealorSnack=false,
 }) => {
  const matches = useMediaQuery("(min-width:768px)")
  const isScreenSmall = useMediaQuery("(max-width:767px)")
  const [isExpanded, setIsExpanded] = useState(false)
  const [openProtien, setOpenProtien] = useState(false)
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }
  // const description = meal?.meals?.description
  //   ? meal?.meals?.description
  //   : meal?.custom_meals?.description

  const [open2, setOpen2] = useState(false)
  const handleClose = () => {
    setOpen2(false)
  }
  const handleMealMacros = (grammage, extra_grammage) => {
    if (meal?.is_extra_proteins) {
      return grammage + extra_grammage
    }
    return grammage
  }
    const description = 
  isAddonItem ? meal?.addon?.description:
    meal?.meals?.description
    ? meal?.meals?.description
    : meal?.custom_meals?.description

  const mealTitle = isAddonItem ? meal?.addon?.title : meal?.meals?.title ? meal?.meals?.title:meal?.custom_meals?.title;
  const mealCalories = isAddonItem ? meal?.size : meal?.calories;
  const mealImage = isAddonItem ?  meal?.addon?.image : meal?.meals?.image ?meal?.meals?.image:meal?.custom_meals?.image

  return (
    <>
      <ProtienPop
        isExecutive={isExecutive}
        view={true}
        open={openProtien}
        proteinPaymentStatus={meal?.extra_proteins_payment_status == 'paid'}
        handleClose={() => setOpenProtien(false)}
        protein={meal.meals?.extra_protein}
        proteinId={meal?.extra_proteins_gram}
        popUpData={(e) => setProteinPopupData(e)}
        onConfirm={() => {}}
        // onDelete={deleteProtein}
        isExtraProteins={meal?.is_extra_proteins}
      />

      <MealInfoPop
        info={{
          ingredients:
                     meal?.meals?.ingredients ?? extractObjects(meal?.custom_meals),
                   title: mealTitle
                     ? mealTitle
                     : meal?.custom_meals?.title,
                   type: meal?.type,
                   image: mealImage,
                   description: description,
                   calories: handleMealMacros(
                     mealCalories,
                     meal?.extra_protein_calories
                   ),
          proteins: handleMealMacros(meal?.proteins, meal?.extra_proteins_gram),
          carbs: handleMealMacros(meal?.carbs, meal?.extra_protein_carbs),
          fats: handleMealMacros(meal?.fats, meal?.extra_protein_fats),
          mb: meal?.mb,
          isChilli: meal?.meals?.is_chilli
        }}
        // view={!disabled}
        // handleSwap={onSwapItemHandler}
        open={open2}
        handleClose={handleClose}
        isExecutive={isExecutive}
      />
      <div
        className={clsx(
          `${styles.mealDetailBox} ${meal?.type == "snack" ? "snacks" : ""} ${isExecutive ? "isExecutive " : ""} `
        )}
      >
        <Typography
          variant={"body2"}
          className={styles.heading}
          sx={{
            textTransform: "capitalize",
            color: "#787F82",
            fontWeight: "500"
          }}
        >
        {
          isAddonMealorSnack ? 
          `Extra ${meal?.type} ${meal?.meal_count ? meal?.meal_count : ''}`:
          isAddonItem ?  
          `Extra item ${meal?.meal_count ? meal?.meal_count : ''}`:
        `${meal?.type} ${meal?.meal_count ? meal?.meal_count : ''}`
        }
        </Typography>
        {/* <SwapItemPopup
          open={showSwapPopUp}
          handleClose={() => setShowPopup(false)}
        /> */}
        <div
          className={clsx(styles.mealBox)}
          onClick={() => {
            setOpen2(!open2)
          }}
        >
          <div className={styles.postImg}>
            <div className={styles.boxImg}>
              <div className={styles.secWrap}>
                <img
                  src={
                   mealImage
                  }
                  alt={`${
                    isAddonItem ?  meal?.addon?.title:
                    meal?.meals?.title
                      ? meal?.meals?.title
                      : meal?.custom_meals?.title
                  }`}
                />
                {meal?.meals?.is_chilli === 1 ? (
                  <div className={styles.chilli}>
                    <Chilli />
                  </div>
                ) : null}
              </div>
            </div>
            <div className={styles.boxText}>
              <Typography variant={"h3"} className={styles.boxTitle}>
                {`${
                mealTitle
                  ? mealTitle
                  : meal?.custom_meals?.title
              }`}
              </Typography>

              <Typography
                variant={"body3"}
                component={"p"}
                sx={{ fontSize: "10px" }}
              >
                {/* {isScreenSmall
                  ? description
                  : description.length <= 60 || isExpanded
                  ? description
                  : description.slice(0, 60) + "... "}
                {!isScreenSmall && description.length > 60 && (
                  <span className={styles.read_more} onClick={toggleExpand}>
                    {isExpanded ? " Read less" : "Read more"}
                  </span>
                )} */}
                {description ?? ""}
              </Typography>

              {/* <Typography
              variant={"body3"}
              component={"p"}
              sx={{ fontSize: "10px" }}
            >
              {meal?.meals?.description
                ? meal?.meals?.description
                : meal?.custom_meals?.description}
            </Typography> */}
            </div>
          </div>
          <div className={styles.postDetail}>
            <div
              className={
                meal.type == "snack"
                  ? clsx(styles.caloriesCount, styles.sty2)
                  : styles.caloriesCount
              }
            >
            { 
            isAddonItem ? 
            <Typography
              variant={"body3"}
              sx={{ color: AppColors.white, textAlign: "center" }}
              component="p"
            >
              {`${mealCalories}`}
            </Typography>:
            <Typography
              variant={"body3"}
              sx={{ color: AppColors.white, textAlign: "center" }}
              component="p"
            >
              {`${Math.floor(
                handleMealMacros(mealCalories, meal?.extra_protein_calories)
              )} Calories`}
            </Typography>
            }
            </div>
            <div className={styles.caloriesCountBox}>
                {
              meal.qty ?
            <div className={styles.caloriesBox}>
              <Typography
                variant={"body3"}
                sx={{
                  textAlign: "center",
                  fontSize: "10px",
                  color: AppColors.primaryGreen,
                  fontWeight: "500"
                }}
                component="p"
              >
                {`${Math.floor(
                  meal.qty
                )}`}
              </Typography>
              <Typography
                variant={"body3"}
                sx={{
                  textAlign: "center",
                  fontSize: "8px",
                  color: AppColors.primaryGreen
                }}
                component="p"
              >
                {"Qty"}
              </Typography>
            </div>:
            <div style={{minHeight:'43px'}}>
            </div>
            }
            {
              meal.proteins ?
            <div className={styles.caloriesBox}>
              <Typography
                variant={"body3"}
                sx={{
                  textAlign: "center",
                  fontSize: "10px",
                  color: AppColors.primaryGreen,
                  fontWeight: "500"
                }}
                component="p"
              >
                {`${Math.floor(
                  handleMealMacros(meal.proteins, meal?.extra_proteins_gram)
                )}g`}
              </Typography>
              <Typography
                variant={"body3"}
                sx={{
                  textAlign: "center",
                  fontSize: "8px",
                  color: AppColors.primaryGreen
                }}
                component="p"
              >
                {"Protein"}
              </Typography>
            </div>:
            <div style={{minHeight:'43px'}}>
            </div>
            }
            {meal?.carbs ?
            <div className={styles.caloriesBox}>
              <Typography
                variant={"body3"}
                sx={{
                  textAlign: "center",
                  fontSize: "10px",
                  color: AppColors.primaryGreen,
                  fontWeight: "500"
                }}
                component="p"
              >
                {`${Math.floor(
                  handleMealMacros(meal?.carbs, meal?.extra_protein_carbs)
                )}g`}
              </Typography>
              <Typography
                variant={"body3"}
                sx={{
                  textAlign: "center",
                  fontSize: "8px",
                  color: AppColors.primaryGreen
                }}
                component="p"
              >
                {"Carbs"}
              </Typography>
            </div>:
             <div style={{minHeight:'43px'}}>
            </div>
            }
            {meal?.fats ?
            <div className={styles.caloriesBox}>
              <Typography
                variant={"body3"}
                sx={{
                  textAlign: "center",
                  fontSize: "10px",
                  color: AppColors.primaryGreen,
                  fontWeight: "500"
                }}
                component="p"
              >
                {`${Math.floor(
                  handleMealMacros(meal?.fats, meal?.extra_protein_fats)
                )}g`}
              </Typography>
              <Typography
                variant={"body3"}
                sx={{
                  textAlign: "center",
                  fontSize: "8px",
                  color: AppColors.primaryGreen
                }}
                component="p"
              >
                {"Fats"}
              </Typography>
            </div>:
             <div style={{minHeight:'43px'}}>
            </div>
            }
              {meal?.mb == 1 && (
                <div className={clsx(styles.caloriesBox, styles.sty2)}>
                  <Typography
                    variant={"body3"}
                    sx={{
                      textAlign: "center",
                      fontSize: "15px",
                      color: AppColors.primaryGreen,
                      fontWeight: "600"
                    }}
                    component="p"
                  >
                    {"MB"}
                  </Typography>
                </div>
              )}
            </div>
          </div>
          {/* <div className={styles.swapIcon}>
            <Button
              className={styles.swapIconCta}
              disabled={meal?.rating ? true : false}
              //   disabled={pauseStatus == 1 ? true : false}
              onClick={() => rateFunc(meal)}
              style={{
                border: "none",
                background: "transparent",
                padding: "0",
                color: AppColors.primaryGreen,
                fontSize: "10px",
                fontWeight: "600",
                textTransform: "capitalize",
                minWidth: "auto"
              }}
              //   onClick={onSwapItemHandler}
            >
              <img
                src={
                  meal?.rating
                    ? "https://blob.practical.me/public/meal/rate.png"
                    : "https://blob.practical.me/public/meal/rate-green.png"
                }
              />

              {meal?.rating ? "Rated!" : "Rate it!"}
            </Button>
          </div> */}
        </div>
        <div className={styles.swapIcon}>
          <Button
            className={styles.swapIconCta}
            disabled={meal?.rating ? true : false}
            //   disabled={pauseStatus == 1 ? true : false}
            onClick={() => rateFunc(meal)}
            style={{
              border: "none",
              background: "transparent",
              padding: "0",
              color: AppColors.primaryGreen,
              fontSize: "10px",
              fontWeight: "600",
              textTransform: "capitalize",
              minWidth: "auto"
            }}
            //   onClick={onSwapItemHandler}
          >
            <img
              src={
                meal?.rating ? AppDataConstant.rate : AppDataConstant.rateGreen
              }
            />

            {meal?.rating ? "Rated!" : "Rate it!"}
          </Button>
        </div>
        <div
          className={`${clsx(styles.swapIcon, styles.sty3)} ${clsx(
            meal?.extra_proteins_gram ? styles.orange : styles.green
          )}`}
          // onMouseEnter={handleMouseEnter}
          // onMouseLeave={handleMouseLeave}
        >
          {meal?.meals?.is_proteins ? (
            <button
              // disabled={disableSwap}
              // disabled={handleProteinDisable() || loading}
              // disabled={pauseStatus == 1 ? true : false}
              // className={disableSwap ? styles.disableBTN : ""}
              style={{
                border: "none",
                background: "transparent"
              }}
              onClick={() => {
                meal?.extra_proteins_gram && meal?.is_extra_proteins ?
                setOpenProtien(true)
                :null
              }}
            >
              <Protiens />
              {meal?.extra_proteins_gram && meal?.is_extra_proteins ? (
                <div className={styles.protienSelected}>
                  <Typography
                    sx={{ fontSize: "8px", fontWeight: "700", color: "#000" }}
                  >
                    {meal?.extra_proteins_gram ?? "-"}
                  </Typography>
                </div>
              ) : null}
              {/* {meal.is_extra_proteins == 1 ? null : (
                <Typography
                  className={styles.text}
                  sx={{ fontSize: "8px", fontWeight: "700", color: "#000" }}
                >
                  Add Protien
                </Typography>
              )} */}
            </button>
          ) : null}
          {/* {disableSwap ? (
            <div className={styles.tooltip}>
              <Typography
                variant={"body3"}
                sx={{
                  textAlign: "center",
                  fontSize: "13px",
                  color: AppColors.white
                }}
                component="p"
              >
                Oops it’s a little bit too late to add protiens in this item
              </Typography>
            </div>
          ) : null} */}
        </div>
      </div>
    </>
  )
}

export default PastMeals
