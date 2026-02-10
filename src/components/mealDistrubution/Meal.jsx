import React, { useState, useEffect } from "react"
import { Box, Typography } from "@mui/material"
import { useDispatch } from "react-redux"
import { saveOrderId, clearOrdersData, onFavouriteClickRequest, setMealSwap } from "../../store/reducers/ordersReducer"
import {
  deleteProteinRequest,
  postProteinRequest,
  GetTickersRequest,
  removeAddonMealnSnack,
  removeAddonOtherItem,
  StartUpRequest
} from "../../store/reducers/dashboardReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import { useRouter } from "next/router"
import styles from "./style.module.scss"
import clsx from "clsx"
import PropTypes from "prop-types"
import SwapItemPopup from "../tabsSwap/SwapItemPopup"
import get from "lodash/get"
import useMediaQuery from "@mui/material/useMediaQuery"
import AppColors from "helpers/AppColors"
import AppRoutes from "helpers/AppRoutes"
import AppLogger from "../../helpers/AppLogger"
import SwapICon from "../../../public/images/icons/swap-svg.svg"
import Protiens from "../../../public/images/icons/protiens.svg"
import StarIcon from "../../../public/images/icons/star.svg"
import UnlockICON from "../../../public/images/meal/unlock.svg"
import { showFaliureToast, showSuccessToast } from "../../helpers/AppToast"
import MealInfoPop from "components/popUp/mealInfoPop"
import ProtienPop from "components/popUp/protienPop"
import { useSelector } from "react-redux"
import Chilli from "../../../public/images/icons/chilli.svg"
import { extractObjects } from "helpers/ShortMethods"
import { animateScroll as scroll } from "react-scroll"
import CustomStyledTooltip from "../CustomTooltip"
import ConfirmationModal2 from "@components/popUp/confirmationModal2"
import AppConstants from "@helpers/AppConstants"
import { truncateText } from "@helpers/CommonFunc"
import Loader2 from "@components/loader/Loader2"
export default function Meal({
  meal,
  mealNumber,
  pauseStatus,
  disabled,
  disableSwap,
  currentWeek,
  is_switch,
  currentDate,
  currentSlide,
  isRenewedPlan,
  callUpcomingOrdersHandler,
  callRenewedPlanHandler,
  callStartUpFilesHandler,
  loading,
  setLoading,
  isExecutive,
  isAddonItem=false,
  isAddonMealorSnack=false,
  canDeleteMeal
}) {
  // Other hooks
  const dispatch = useDispatch()
  const router = useRouter()
  const matches = useMediaQuery("(min-width:768px)")
  const isScreenSmall = useMediaQuery("(max-width:767px)")
  const isScreenMid = useMediaQuery("(max-width:1200px)")

  // Redux data
  const userData = useSelector((state) => state.auth.userDetails)
  const { renewalData } = useSelector((state) => state.home)
  // States
  const [showSwapPopUp, setShowPopup] = useState(false)
  const [showWalletPop, setShowWalletPop] = useState(false)
  const [proteinDisable, setProteinDisable] = useState(false)
  const [renewalDataLocal, setRenewalDataLocal] = useState(null)
  const [proteinPopupData, setProteinPopupData] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [open, setOpen] = useState(false)
  const [openProtien, setOpenProtien] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isPostingFavourite, setIsPostingFavourite] = useState(false)
  const [RemoveMealLoader, setRemoveMealLoader] = useState(false)
  const [isFavourite, setIsFavourite] = useState(get(meal, 'meals.is_favourite', false));

  // Lodash data handling
  const token = get(userData, "data.auth_token", null)
  const renewalOrderId = get(renewalDataLocal, "order_id", null)
  const renewalUserId = get(renewalDataLocal, "user_id", null)
  const customMeal = get(meal, "custom_meals", null)
  const isDown = get(meal, "is_down", false)

  // Effects
  useEffect(() => {
    if (renewalData) {
      setRenewalDataLocal(renewalData)
    }
  }, [renewalData])

  useEffect(() => {
    // Retrieve the stored scroll position from localStorage
    const storedScroll = JSON.parse(localStorage.getItem("currentScroll"))

    // Set the scroll position if it's available
    if (storedScroll !== null) {
      window.scrollTo(0, storedScroll)
    }
  }, [])

  useEffect(() => {
    setIsFavourite(get(meal, 'meals.is_favourite', false))
  }, [meal])

  // Functions
  const handleProteinScroll = () => {
    if (
      typeof window !== "undefined" &&
      typeof JSON.parse(localStorage.getItem("proteinScroll")) == "number"
    ) {
      scroll.scrollTo(JSON.parse(localStorage.getItem("proteinScroll"), {
        duration: 50
      }))
      localStorage.removeItem('proteinScroll')
    }
  }

  const onSwapItemHandler = () => {
    localStorage.setItem(
      "currentWeek",
      JSON.stringify({
        currentWeek
      })
    )
    localStorage.setItem(
      "currentDate",
      JSON.stringify({
        currentDate
      })
    )
    localStorage.setItem("currentScroll", JSON.stringify(window.scrollY))
    localStorage.setItem("currentSlide", JSON.stringify(currentSlide))
    
    dispatch(
      saveOrderId({
        orderId: meal?.id,
        orderCalories: meal?.base_calories,
        orderType: meal?.type,
        customMeal: customMeal,
        parentOrderId: meal?.order_id
      })
    )
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at saveOrderId", res)
        dispatch(clearOrdersData()).then(unwrapResult)
        .then(()=>{
          dispatch(setMealSwap(meal.type))
          if (isRenewedPlan) {
            localStorage.setItem("isRenewedPlan", JSON.stringify(true))
            router.push(AppRoutes.swapItem)
          } else {
            router.push(AppRoutes.swapItem)
          }
        })
        // setShowPopup(true)
      })
      .catch((err) => {
        AppLogger("Error at saveOrderId", err)
      })
  }

  const getTickersData = () => {
    const { auth_token } = userData?.data
    dispatch(GetTickersRequest({ token: auth_token }))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at getTickersData", res)
      })
      .catch((err) => {
        AppLogger("Error at getTickersData", err)
      })
  }

  const proteinHandler =async(id) => {
    const { auth_token } = userData?.data
    localStorage.setItem("proteinScroll", JSON.stringify(window.scrollY))
    setLoading(true)
    setProteinDisable(true)
    const allData = {
      order_id: meal.id,
      meal_id: meal.meal_id,
      gram_id: parseInt(id)
    }
    setOpenProtien(false)

    await dispatch(
      postProteinRequest({
        preferenceData: allData,
        token: auth_token
      })
    )
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at proteinHandler", res)
        callUpcomingOrdersHandler()
        callStartUpFilesHandler()
        if (renewalDataLocal) {
          callRenewedPlanHandler()
        }
        getTickersData()
      })
      .then(() => {
        setProteinDisable(false)
        setLoading(false)
        handleProteinScroll()
      })
      .catch((error) => {
        setProteinDisable(false)
        setLoading(false)
        showFaliureToast(error?.response?.data?.message)
        AppLogger("Error at proteinHandler", error)
      })
  }

  const deleteProtein = () => {
    const { auth_token } = userData?.data
    localStorage.setItem("proteinScroll", JSON.stringify(window.scrollY))
    setOpenProtien(false)
    setProteinDisable(true)
    setLoading(true)
    dispatch(
      deleteProteinRequest({
        order_id: meal.id,
        token: auth_token
      })
    )
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at deleteProtein", res)
        callUpcomingOrdersHandler()
        callStartUpFilesHandler()
        if (renewalDataLocal) {
          callRenewedPlanHandler()
        }
        getTickersData()
      })
      .then(() => {
        setLoading(false)
        setProteinDisable(false)
        handleProteinScroll()
      })
      .catch((error) => {
        setProteinDisable(false)
        setLoading(false)
        AppLogger("Error at deleteProtein", error)
        showFaliureToast(error?.response?.data?.message)
      })
  }

  const handleOnFavouriteClick = (e, meal) => {
    e.stopPropagation()
    try {
      const payload = { token: token, meal: {meal_id: get(meal, 'meals.id', null)} }
      setIsPostingFavourite(true);
      dispatch(
        onFavouriteClickRequest(payload)
      ).then(unwrapResult)
        .then(res => {
          AppLogger("Response on onFavouriteClickRequest", res)
          setIsPostingFavourite(false)
          setIsFavourite(!isFavourite)
      }).catch((err) => {
        AppLogger("Error at onFavouriteClickRequest", err)
        setIsPostingFavourite(false)
      })
    } catch (err) {
      showFaliureToast(err?.response?.data?.message)
      AppLogger("Error at handleOnFavouriteClick", err)
    }
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }
  
  const handleClose = () => {
    setOpen(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleProteinDisable = () => {
    if (proteinDisable) {
      return proteinDisable
    } else {
      return disableSwap
    }
  }

  const handleMealMacros = (grammage, extra_grammage) => {
    if (meal?.is_extra_proteins) {
      return grammage + extra_grammage
    }
    return grammage
  }
  const meal_Snack_payment_status = meal?.extra_proteins_payment_status;
  const meal_addon_payment_status = meal?.payment_status;
  const handleDeleteMealConfirmation = async ()=>{
      const conditionForUnpaidMeals = isAddonItem ?meal_addon_payment_status == AppConstants.unpaid : meal_Snack_payment_status == AppConstants.unpaid
      if(conditionForUnpaidMeals){
        handleDeleteMealClick()
      }else{
        setShowWalletPop(true)
      }
  }
  const handleDeleteMealClick = async ()=>{
    setRemoveMealLoader(true)
    try {
        await dispatch(removeAddonOtherItem({
          token: token,
          order_id: meal?.order_id,
          addon_orders: isAddonItem ? [meal?.id] :  [],
          meal_orders: isAddonMealorSnack ? [meal?.id] : []
        })).then(unwrapResult).then((res)=>{
          setRemoveMealLoader(false)
          showSuccessToast('Add on item removed from your plan.')
          if (renewalDataLocal) {
            callRenewedPlanHandler()
          }
          callUpcomingOrdersHandler()
          getTickersData()
          handleClose()
          dispatch(StartUpRequest({ token }))
          .then(unwrapResult)
          .then((response) => {
            AppLogger("Response at StartUpRequest", response)
          })
          .catch((error) => {
            AppLogger("Error at StartUpRequest", error)
          })
        
          }).catch((err)=>{
           setRemoveMealLoader(false)
           console.log("err",err)
          })      
    } catch (error) {
      setRemoveMealLoader(false)
      showFaliureToast(error?.response?.data?.message)
      console.log("error =>",error)
    }
  }

  // Conditional constants
  const description = 
  isAddonItem ? meal?.addon?.description:
    meal?.meals?.description
    ? meal?.meals?.description
    : meal?.custom_meals?.description

  const mealTitle = isAddonItem ? meal?.addon?.title : meal?.meals?.title ? meal?.meals?.title : meal?.custom_meals?.title;
  const mealCalories = isAddonItem ? meal?.size : meal?.calories;
  const mealImage = isAddonItem ? meal?.addon?.image : meal?.meals?.image ? meal?.meals?.image : meal?.custom_meals?.image
  const mealPrice = isAddonItem ? meal?.price : meal?.meal_price ? meal?.meal_price : 0;
  
  
  return (
    <div
      className={clsx(
        `${styles.mealDetailBox} ${meal?.type == "snack" ? "snacks" : ""} ${isPostingFavourite ? styles.postingFavourite: ""} ${isExecutive ? "isExecutive " : ""}`
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
      <SwapItemPopup
        open={showSwapPopUp}
        handleClose={() => setShowPopup(false)}
      />

      {/* On Add Protein click Modal */}
      <ProtienPop
        isExecutive={isExecutive}
        open={openProtien}
        proteinPaymentStatus={meal?.extra_proteins_payment_status == 'paid'}
        handleClose={() => setOpenProtien(false)}
        protein={meal.meals?.extra_protein}
        proteinId={meal?.extra_proteins_gram}
        popUpData={(e) => setProteinPopupData(e)}
        onConfirm={(id) => proteinHandler(id)}
        onDelete={deleteProtein}
        isExtraProteins={meal?.is_extra_proteins}
      />

      {/* On Meal card click Modal */}
      <MealInfoPop
      isExecutive={isExecutive}
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
          isChilli: meal?.meals?.is_chilli,
          qty:meal?.qty,
          allergy:[]
        }}
        isExtraProteins={meal?.meals?.is_proteins}
        view={!disableSwap}
        handleSwap={onSwapItemHandler}
        open={open}
        handleClose={handleClose}
        isAddonItem={isAddonItem}
        RemoveMealLoader={RemoveMealLoader}
        addProtienPop={() => {
          setOpenProtien(true)
          setOpen(false)
        }}
        showSwapButton={(isAddonMealorSnack || isAddonItem) ? false : true}
        // handleDeleteMealClick={handleDeleteMealClick}
        handleDeleteMealClick={handleDeleteMealConfirmation}
        showWalletPop={showWalletPop}
        setShowWalletPop={setShowWalletPop}
        showRemoveBtn={!canDeleteMeal}
      />
      <ConfirmationModal2
        onConfirmPress={handleDeleteMealClick}
        isDisabledBtn={RemoveMealLoader}
        tabChange={false}
        open={showWalletPop}
        handleClose={() => setShowWalletPop(false)}
        cancelText={"Cancel"}
        confirmText={"Confirm"}
        totalPrice={meal?.qty ? Number(meal?.qty) * Number(mealPrice) : mealPrice}
        modalBody={"will be credited to your Wallet."}
        modalTitle={"Confirm Add to Wallet"}
        disclaimer={"For more information on using the credit in your Wallet, please click "}
      />
      {/* Meal Box for /Dashboard screen (Upcoming Orders) */}
      <div
        className={
          is_switch == "1" ||
          meal?.custom_meals ||
          meal?.is_extra_proteins == "1"
            ? clsx(styles.mealBox, styles.sty2)
            : styles.mealBox
        }
        style={{
          pointerEvents: isDown || pauseStatus ? "none" : "all",
          opacity: isDown ? 0.6 : 1
        }}
      >
        {/* Meal image & description */}
        <div className={styles.postImg}>
          <div
            className={styles.boxImg}
            onClick={() => {
              setOpen(!open)
            }}
          >
            <div className={styles.secWrap}>
              <img
                src={
                  mealImage
                }
                alt={mealTitle}
              />
              {meal?.meals?.is_chilli === 1 ? <Chilli /> : null}
            </div>
          </div>
          <div
            className={styles.boxText}
            onClick={() => {
              setOpen(!open)
            }}
          >
            <Typography variant={"h3"} className={styles.boxTitle}>
              {`${
                mealTitle
                  ? mealTitle
                  : meal?.custom_meals?.title
              }`}
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
          </div>
        </div>

        {/* Meal Nutritions Details */}
        <div className={styles.postDetail}>
          <div className={styles.caloriesCount}>
            { 
            isAddonItem ? 
            <Typography
              variant={"body3"}
              sx={{ color: AppColors.white, textAlign: "center" }}
              component="p"
            >
              {`${truncateText(mealCalories,9)}`}
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
        
        {/* Swap Icon */}
        <div
          style={{
            display:(isAddonItem )&&'none'
          }}
          className={
            meal?.is_extra_proteins == "1" && is_switch == "0"
              ? clsx(styles.swapIcon, styles.green)
              : styles.swapIcon
          }
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            disabled={disableSwap}
            // disabled={pauseStatus == 1 ? true : false}
            className={`${disableSwap ? styles.disableBTN : ""} ${is_switch=="0" && styles.swapButton}`}
            style={{
              border: "none",
              background: "transparent"
            }}
            onClick={onSwapItemHandler}
          >
            <SwapICon />
          </button>

          {disableSwap ? (
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
                Oops it’s a little bit too late to swap this item
              </Typography>
            </div>
          ) : null}
        </div>

        {/* Add Protein Icon */}
        <div
        style={{
          display:(isAddonItem || isAddonMealorSnack)&&'none'
        }}
          className={clsx(
            styles.swapIcon,
            styles.sty2,
            meal.is_extra_proteins == 1 ? null : styles.green
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {meal?.meals?.is_proteins ? (
            <button
              // disabled={disableSwap}
              disabled={handleProteinDisable() || loading}
              // disabled={pauseStatus == 1 ? true : false}
              className={disableSwap ? styles.disableBTN : ""}
              style={{
                border: "none",
                background: "transparent",
                
              }}
              onClick={() => {
                setOpenProtien(true)
              }}
            >
              <div style={{
                    marginTop: !matches ? "-2px" : "0px",
              }} >
              <Protiens />
              </div>
              {meal?.extra_proteins_gram && meal?.is_extra_proteins ? (
                <div className={styles.protienSelected} >
                  <Typography
                    sx={{ fontSize: "8px", fontWeight: "700", color: "#000" }}
                  >
                    {`${meal?.extra_proteins_gram}` ?? "-"}
                  </Typography>
                </div>
              ) : null}
              {/* {meal.is_extra_proteins == 1 ? null : ( */}
                <Typography
                  className={styles.text}
                  sx={{
                      fontWeight: "700", color: "#000", 
                    fontSize: !matches ? "6px !important" : "8px !important",
                    bottom: !matches ? "1px !important" : "-1px !important",
                    left: !matches ? "10px" : "5px",
                   }}
                >
                  Add Protein
                </Typography>
              {/* )} */}
            </button>
          ) : null}
          {disableSwap ? (
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
                Oops it's a little bit too late to add protein to this item
              </Typography>
            </div>
          ) : null}
        </div>

        {/* Favourite Icon (READONLY) */}
        {meal.meals ? 
        meal?.is_cheat ?
        <div
        style={{
          display:(isAddonItem || isAddonMealorSnack)&&'none'
        }}
          className={clsx(
            styles.swapIcon,
            styles.favourite,
            meal?.meals?.is_proteins ? styles.protienPresent : null
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* <CustomStyledTooltip title='It was locked based on your preferences, but is now available.' > */}
            <button
              onClick={(e) => e.stopPropagation()}
              // disabled={handleProteinDisable() || loading}
              className={clsx(isFavourite ? styles.isFavourite : null)}
            >
              <Box sx={{marginBottom:{xs:"-3px",md:'-5px'}}}>
            <img src='images/meal/unlocknewt.svg' style={{width:matches?'34px':'24px',marginTop:'3px',
              opacity:disableSwap?"0.7":"1",

            }}   />
              </Box>
                {/* <Typography
                  className={styles.text}
                  sx={{ fontSize: "8px", fontWeight: "700", color: `${AppColors?.primaryGreen} !important`,
                  marginBottom:{xs:'-5px'} }}
                >
                  Unlock
                </Typography> */}
            </button>
            <div className={styles.tooltip} style={{top:'-90px',left:
            isScreenMid ? "-155px":
            '-85px',

            }}>
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
          {/* </CustomStyledTooltip> */}
            </div>
        :
        <div
        style={{
          display:(isAddonItem || isAddonMealorSnack)&&'none'
        }}
          className={clsx(
            styles.swapIcon,
            styles.favourite,
            meal?.meals?.is_proteins ? styles.protienPresent : null
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
            <button
              onClick={(e) => handleOnFavouriteClick(e, meal)}
              // disabled={handleProteinDisable() || loading}
              className={clsx(isFavourite ? styles.isFavourite : null)}
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
        
        : null}
      </div>
    </div>
  )
}
Meal.propTypes = {
  mealNumber: PropTypes.number,
  meal: PropTypes.any
}
