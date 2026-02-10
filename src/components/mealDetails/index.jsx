import React, { useEffect, useState } from "react"
import { Box, Button, Tooltip, Typography } from "@mui/material"
import styles from "./style.module.scss"
import clsx from "clsx"
import AppColors from "helpers/AppColors"
import SwapNow from "../../../public/images/meal/swap-now.svg"
import LockICON from "../../../public/images/meal/lock.svg"
import UnlockICON from "../../../public/images/meal/unlock.svg"
import useMediaQuery from "@mui/material/useMediaQuery"
import MealInfoPop from "components/popUp/mealInfoPop"
import AppRoutes from "../../helpers/AppRoutes"
import { useRouter } from "next/router"
import Protiens from "../../../public/images/icons/protiens.svg"
import StarIcon from "../../../public/images/icons/star.svg"
import Chilli from "../../../public/images/icons/chilli.svg"
import { extractObjects } from "helpers/ShortMethods"
import get from "lodash/get"
import { useDispatch, useSelector } from "react-redux"
import { onFavouriteClickRequest } from "store/reducers/ordersReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import AppLogger from "helpers/AppLogger"
import { showFaliureToast } from "helpers/AppToast"
import LockIcon from '@mui/icons-material/Lock';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BypassDialog from "../popUp/BypassPop"
import AddSnackDialog from "../popUp/AddSnackPop"
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AppConstants from "@helpers/AppConstants"
import TimerTooltip from "../mealDistrubution/TimerTooltip"
import CustomStyledTooltip from "../CustomTooltip"
const Mealdetails = ({
  meal,
  selectMeal,
  selectedMeal,
  swapped,
  onSwapClick,
  isStatic,
  boxHide,
  isMyBYO,
  deleteMyBYOHandler,
  editMyBYOHandler,
  currentType = '',
  //handleOnFavouriteClick,
  token,
  categoryKey = '',
  isExecutive,
  macroStatuss,
  getData
}) => {
  const router = useRouter()
  const isScreenSmall = useMediaQuery("(max-width:767px)")
  const dispatch = useDispatch()
  const {mealSwap}=useSelector(state=>state?.orders)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFavourite, setIsFavourite] = useState(get(meal, 'is_favourite', 0))
  const [isPostingFavourite, setIsPostingFavourite] = useState(false)
  const [open, setOpen] = useState(false)
  const [openByPassPop, setOpenByPassPop] = useState(false)
  const [AddSnackPop, setAddSnackPop] = useState(false)
  const { orderId ,parentOrderId} = useSelector(
    (state) => state.orders
  );
  const description = meal?.description ? meal?.description : null

  useEffect(() => {
    setIsFavourite(meal?.is_favorite)
  }, [meal])

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }
  
  const handleClose = () => {
    setOpen(false)
  }

  const handleOnFavouriteClick = (e, meal) => {
    e.stopPropagation()
    try {
      const payload = { token: token, meal: {meal_id: meal.id} }
      setIsPostingFavourite(true);
      dispatch(
        onFavouriteClickRequest(payload)
      ).then(unwrapResult)
        .then(res => {
          AppLogger("Response on onFavouriteClickRequest", res)
          setIsPostingFavourite(false)
          setIsFavourite(isFavourite ==0 ?1:0)
      }).catch((err) => {
        AppLogger("Error at onFavouriteClickRequest", err)
        setIsPostingFavourite(false)
      })
    } catch (err) {
      showFaliureToast(err?.response?.data?.message)
      AppLogger("Error at handleOnFavouriteClick", err)
    }
  }
  return (
    <>
      <MealInfoPop
        isExecutive={isExecutive}
        isSwapDisabled={meal.type !== currentType}
        view={!isStatic}
        isStatic={isStatic}
        isSwapped={meal == selectedMeal && swapped ? true : false}
        isMyBYO={isMyBYO}
        deleteMyBYOHandler={deleteMyBYOHandler}
        editMyBYOHandler={editMyBYOHandler}
        setOpen={setOpen}
        info={
          isMyBYO
            ? {
                ...meal,
                ingredients: meal.ingredients ?? extractObjects(meal),
                fats: meal?.total_fats,
                carbs: meal?.total_carbs,
                proteins: meal?.total_proteins,
                calories: meal?.total_calories,
                totalCalories: meal?.total_calories,
                type: "meal"
              }
            : {
                ingredients: meal.ingredients,
                title: meal?.title ? meal?.title : meal?.custom_title,
                type: meal?.type,
                image: meal?.image,
                description: description,
                calories: meal?.calories,
                proteins: meal.proteins,
                carbs: meal?.carbs,
                fats: meal?.fats,
                mb: meal?.mb,
                totalCalories: meal?.display_calories,
                isChilli: meal?.is_chilli
              }
        }
        handleSwap={() => {
          if(meal?.dollar_show){
            setOpen(false)
            setAddSnackPop(true)
          }else if(meal?.meal_locked == 1 
            && (
              mealSwap == AppConstants.meal ?
              categoryKey == AppConstants.snack ? false : true:true )
            ){
              setOpen(false)
              setOpenByPassPop(true);
            }else{
            selectMeal(meal)
          }
          // onSwapClick()
        }}
        boxHide={boxHide}
        open={open}
        handleClose={handleClose}
        isLockedMealSnack={meal?.dollar_show}
        isLockedMeal={
          meal?.meal_locked == 1 
          && (
            mealSwap == AppConstants.meal ?
            categoryKey == AppConstants.snack ? false : true:true )
        }
      />
       <BypassDialog
        open={openByPassPop}
        onClose={() => {
          setOpenByPassPop(false);
        }}
        onCloseSnack={() => {
            if(categoryKey == AppConstants.snack){
              if(mealSwap == AppConstants.snack){
                selectMeal(meal)
              }else{
                getData(6,macroStatuss)
                setTimeout(() => {
                  setAddSnackPop(true)
                }, 200);
              }
            }else{
              selectMeal(meal)
            }
          setOpenByPassPop(false);
        }}
        onConfirm={null}
        meal={meal}
        selectMeal={selectMeal}
        selectedMeal={selectedMeal}
        common_allergies={meal?.common_allergies}
        common_dislikes={meal?.common_dislikes}
        isVeg={meal?.veg_lock}
        mealorderId={orderId}
        mealId={meal?.id}
        orderId={parentOrderId}
        token={token}
        categoryKey={categoryKey}
      />
       <AddSnackDialog
        open={AddSnackPop}
        onClose={() => setAddSnackPop(false)}
        onConfirm={null}
        meal={meal}
        selectMeal={selectMeal}
        selectedMeal={selectedMeal}
        common_allergies={meal?.common_allergies}
        common_dislikes={meal?.common_dislikes}
        isVeg={meal?.veg_lock}
        mealorderId={orderId}
        mealId={meal?.id}
        orderId={parentOrderId}
        token={token}
        categoryKey={categoryKey}
        setAddSnackPop={setAddSnackPop}
      />
      <div className={
        `${styles.mealDetailBox} ${!isFavourite == 1 && categoryKey === "favorite" ? styles.unFavourited : ""} ${isPostingFavourite ? styles.postingFavourite: ""}`}>
        <div
          style={{
            borderColor: meal == selectedMeal ? "#FA7324" : ""
          }}
          className={styles.mealBox}
          onClick={() => {
            setOpen(!open)
          }}
        >
          <div className={styles.postImg}>
            <div className={styles.boxImg}>
              <div className={styles.secWrap}>
                {meal?.image && <img src={meal?.image} alt={meal?.title} />}
                {meal?.is_chilli === 1 ? <Chilli /> : null}
                {meal?.meal_locked && 
                (
                <div className={styles.lockOverlay}>
                  Locked Due to Selected Preferences
                </div>
                )}
              </div>
            </div>
            <div className={styles.boxText}>
              {meal?.title && (
                <Typography variant={"h3"} className={styles.boxTitle}>
                  {meal?.title}
                </Typography>
              )}
             

              <Typography
                variant={"body3"}
                component={"p"}
                sx={{ fontSize: "10px" }}
              >
             
                {description ?? ""}
              </Typography>
            </div>
          </div>
          <div
            className={
              boxHide ? clsx(styles.postDetail, styles.sty2  ) : clsx(styles.postDetail ,isExecutive ? styles.isExecutive : "" ) 
            }
          >
            {boxHide ? (
              <div
                className={
                  meal.type == "snack"
                    ? clsx(styles.caloriesCount, styles.sty2, styles.hide)
                    : meal.title == "Build Your Own"
                    ? clsx(styles.caloriesCount, styles.BYO, styles.hide)
                    : boxHide == true
                    ? clsx(styles.caloriesCount, styles.hide)
                    : styles.caloriesCount
                }
              >
                <Typography
                  variant={"body3"}
                  sx={{ color: AppColors.white, textAlign: "center" }}
                  component="p"
                >
                  {`${isMyBYO ? meal?.total_calories : meal?.display_calories}`}
                </Typography>
              </div>
            ) : (
              <div
                className={
                  meal.type == "snack"
                    ? clsx(styles.caloriesCount, styles.sty2)
                    : styles.caloriesCount
                }
              >
                <Typography
                  variant={"body3"}
                  sx={{ color: AppColors.white, textAlign: "center" }}
                  component="p"
                >
                  {`${
                    isMyBYO
                      ? Math.floor(meal?.total_calories)
                      : Math.floor(meal?.calories)
                  } Calories`}
                </Typography>
              </div>
            )}
            <div className={styles.caloriesCountBox}>
              {boxHide ? (
                <div
                  className={
                    meal.type == "snack"
                      ? clsx(styles.caloriesCount, styles.sty2, styles.Mobile)
                      : meal.title == "Build Your Own"
                      ? clsx(styles.caloriesCount, styles.BYO, styles.Mobile)
                      : boxHide == true
                      ? clsx(styles.caloriesCount, styles.Mobile)
                      : styles.caloriesCount
                  }
                >
                  <Typography
                    variant={"body3"}
                    sx={{ color: AppColors.white, textAlign: "center" }}
                    component="p"
                  >
                    {isMyBYO
                      ? `${meal?.total_calories}`
                      : `${meal?.display_calories}`}
                  </Typography>
                </div>
              ) : (
                <>
                  {" "}
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
                      {isMyBYO
                        ? `${Math.floor(meal.total_proteins)}g`
                        : `${Math.floor(meal.proteins)}g`}
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
                  </div>
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
                      {isMyBYO
                        ? `${Math.floor(meal.total_carbs)}g`
                        : `${Math.floor(meal?.carbs)}g`}
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
                  </div>
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
                      {isMyBYO
                        ? `${Math.floor(meal.total_fats)}g`
                        : `${Math.floor(meal?.fats)}g`}
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
                  </div>
                </>
              )}

              {meal?.mb == 1 && (
                <div className={clsx(styles.caloriesBox, styles.sty2)}>
                  <Typography
                    variant={"body3"}
                    sx={{
                      textAlign: "center",
                      // fontSize: "15px",
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
          {!isStatic && (
            <>
            {
              meal?.meal_locked == 1 
              && (
                mealSwap == AppConstants.meal ?
                categoryKey == AppConstants.snack ? false : true:true )
              ?
              <div className={clsx(styles.lockIcon , isExecutive ? styles.isExecutive : '')}>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenByPassPop(true)
                    // selectMeal(meal)
                  }}
                  sx={{
                    fontWeight: "600",
                    fontSize: "10px",
                    border: "none",
                    background: "transparent",
                    padding: "0",
                    color:'red'
                  }}
                >
                  <LockICON  />
                  {"locked"}
                </Button>
              </div>
                :
              meal?.dollar_show == 1 ?
              <div className={clsx(styles.lockIcon , isExecutive ? styles.isExecutive : '')}>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setAddSnackPop(true)
                }}
                sx={{
                  fontWeight: "600",
                  fontSize: "10px",
                  border: "none",
                  background: "transparent",
                  padding: "0",
                  color:'red'
                }}
              >
                <img src="/images/meal/dollarred.svg" alt='dollarred' style={{width:'22px'}} />
                {"Add"}
              </Button>
              </div>
            :
              <>
              <div className={clsx(styles.swapIcon , isExecutive ? styles.isExecutive : '')}>
                <Button
                  disabled={meal == selectedMeal && swapped ? true : false}
                  className={clsx(
                    styles.swapButton,
                    meal == selectedMeal && swapped ? styles.disableBTN : ""
                  )}
                  onClick={() => {
                    selectMeal(meal)
                  }}
                  sx={{
                    fontWeight: "600",
                    fontSize: "10px",
                    border: "none",
                    background: "transparent",
                    padding: "0"
                  }}
                >
                  <SwapNow />
                  {meal == selectedMeal && swapped ? "Swapped" : "Swap now"}
                </Button>
              </div>
              {meal.is_proteins ? (
                <div className={clsx(
                  styles.swapIcon,
                  styles.sty2)} >
                  <Button
                  disableRipple
                  disableTouchRipple
                    sx={{
                      fontWeight: "600",
                      fontSize: "10px",
                      border: "none",
                      background: "transparent",
                      padding: "0",
                      cursor:"default !important",
                      ":hover":{
                        bgcolor:"transparent",
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Protiens />
                    Add Protein
                  </Button>
                </div>
              ) : null}
              {!isMyBYO && 
              meal?.is_cheat_meal == 1 ?
              <div className={clsx(styles.unlockIcon , isExecutive ? styles.isExecutive : '',
                            meal?.is_proteins ? styles.protienPresent : null

              )}>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  sx={{
                    fontWeight: "600",
                    fontSize: "10px",
                    border: "none",
                    background: "transparent",
                    padding: "0",
                    color:'red'
                  }}
                >
                  <img src="/images/meal/unlocknew.svg" alt="unloick" style={{
                    width:isScreenSmall?"28px":'37px',
                    height:isScreenSmall ?'25px':'27px'
                  }} />
                  <Box sx={{mt:'-5px'}} >
                  {"unlocked"}
                  </Box>
                </Button>
                <div className={styles.tooltip} style={{top:'-90px'}}>
                    <Typography
                      variant={"body3"}
                      sx={{
                        textAlign: "center",
                        fontSize: "13px",
                        color: AppColors.white
                      }}
                      component="p"
                    >
                      It was locked based on your preferences, but is now available.
                    </Typography>
                  </div>
              </div>
              :
              <div
                  className={clsx(
                    styles.swapIcon,
                    styles.favourite,
                    meal?.is_proteins ? styles.protienPresent : null
                  )}
                >
                  <button
                    className={clsx(isFavourite == 1 ? styles.isFavourite : null)}
                    onClick={(e) => handleOnFavouriteClick(e, meal)}
                  >
                  <StarIcon />
                      <Typography
                        className={styles.text}
                        sx={{ fontSize: "8px", fontWeight: "700", color: "#000" }}
                      >
                        Favorite
                      </Typography>
                  </button>
              </div>
              }
              </>
            }
              {/* FAVOURITE ICON CLICKABLE */}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Mealdetails
