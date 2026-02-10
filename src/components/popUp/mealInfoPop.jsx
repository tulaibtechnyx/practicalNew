import React, { useEffect, useState } from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import { Box, TextField, Typography, useMediaQuery } from "@mui/material"
import { useSelector } from "react-redux"
import AppRoutes from "../../helpers/AppRoutes"
import get from "lodash/get"
import moment from "moment"
import styles from "./style.module.scss"
import clsx from "clsx"
import SwapICon from "../../../public/images/icons/swap-svg.svg"
import EditIcon from "../../../public/images/icons/edit-byo.svg"
import Dustbin from "../../../public/images/icons/dustbin.svg"
import { useRouter } from "next/router"
import Chilli from "../../../public/images/icons/chilli.svg"
import { formatAllergens, parseAllergens, truncateText } from "@helpers/CommonFunc"
export default function MealInfoPop({
  open,
  handleClose,
  info,
  handleSwap,
  view,
  isSwapped,
  awesomepage,
  boxHide,
  isMyBYO,
  deleteMyBYOHandler,
  editMyBYOHandler,
  addProtienPop,
  isExtraProteins,
  isExecutive,
  isSwapDisabled = false,
  isLockedMealSnack,
  isLockedMeal,
  showSwapButton = true,
  handleDeleteMealClick = () => { },
  RemoveMealLoader = false,
  isAddonItem = false,
  showRemoveBtn = true,
  showWalletPop,
  setShowWalletPop
}) {
  const matchesSmall = useMediaQuery("(max-width:768px)")

  const { renewalData } = useSelector((state) => state.home)
  const router = useRouter()
  const [renewalDataLocal, setRenewalDataLocal] = useState(null)
  const [totalCalories, setTotalCalories] = useState(0)
  const [isEdit, setIsEdit] = useState(false)
  const [DeletMeal, setDeletMeal] = useState(false)
  const [textInput, setTextInput] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const numberOfDays = get(renewalDataLocal, "meal_days_per_week", "")
  const numberOfWeeks = get(renewalDataLocal, "meal_plan_require_weeks", "")
  const startDate = get(renewalDataLocal, "meal_plan_start_date", "")
  const endDate = get(renewalDataLocal, "meal_plan_end_date", "")
  const numberOfMeals = get(renewalDataLocal, "meals_deliver_per_day", "")
  const mealPlan = get(renewalDataLocal, "meal_plan", [])
  const snackPlan = get(renewalDataLocal, "snack_plan", [])
  useEffect(() => {
    if (renewalData) {
      setRenewalDataLocal(renewalData)
    }
  }, [renewalData])

  useEffect(() => {
    totalCaloriesHandler()
  }, [mealPlan, snackPlan])

  const totalCaloriesHandler = () => {
    var total = 0

    for (let index = 0; index < mealPlan.length; index++) {
      const element = mealPlan[index]
      total = total + element
    }

    for (let index = 0; index < snackPlan.length; index++) {
      const element = snackPlan[index]
      total = total + element
    }

    setTotalCalories(total)
  }
  const validateEditInput = (text) => {
    if (text !== "") {
      if (/^[A-Za-z0-9][A-Za-z0-9]+(?:\s[A-Za-z0-9]+)*\s?$/.test(text)) {
        return true
      } else {
        return false
      }
    }
  }

  const combinedTitles = info.ingredients
    ?.map((food) => food.title)
    ?.sort()
    ?.join(", ")
  const handleCloseClick = () => {
    handleClose();
    setDeletMeal(false)
  }
  const Allergen = parseAllergens(info?.allergy);
  return (
    <Dialog open={open} onClose={handleCloseClick} className="infoPop sty3">

      {matchesSmall && <DialogTitle
        variant="h2"
        sx={{
          textTransform: "capitalize",
          textAlign: "center",
          color: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen,
          padding: "36px 24px 10px 24px",
        }}
      >
        {info?.type?.toLowerCase() == 'addon' ? "Add-On" : info?.type ?? ''}
      </DialogTitle>}
      <DialogContent>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
          {/* Left hand image component */}
          <div className="sec-img">
            <img src=
              {info?.image}
              // '/images/icons/mealImage.png'
              alt={info?.title ?? ""} />
            {info?.isChilli ? <Chilli /> : null}
          </div>
          {/* Right hand description component */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '200px' }}>
            {/* Meal title */}
            {!matchesSmall && <Typography
              variant="h2"
              sx={{
                textTransform: "capitalize",
                textAlign: "center",
                color: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen,
                padding: "36px 24px 10px 24px",
              }}
            >
              {info?.type?.toLowerCase() === 'addon' ? "Add-On" : info?.type ?? ''}
            </Typography>}
            {/* Meal item title*/}
            {isMyBYO ? (
              <div
                className="inputWrap"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {isEdit ? (
                  <>
                    <TextField
                      onChange={(e) => {
                        if (validateEditInput(e.target.value)) {
                          setTextInput(e.target.value)
                          setErrorMessage("")
                        } else {
                          // set error
                          setErrorMessage("Invalid Input")
                        }
                      }}
                      defaultValue={info?.title}
                    />
                    {errorMessage && (
                      <Typography
                        className="errorMessage"
                        sx={{ fontSize: "12px" }}
                        color={AppColors.lightRed}
                      >
                        Enter a valid name
                      </Typography>
                    )}
                  </>
                ) : (
                  <Typography
                    variant="h3"
                    sx={{ paddingTop: "12px" }}
                    className="secHead"
                  >
                    {info?.title ?? ""}
                  </Typography>
                )}
                {/* <span
              onClick={() => console.log("edit")}
              style={{ margin: "5px", cursor: "pointer" }}
            >
              Edit
            </span> */}

                <EditIcon
                  onClick={() => setIsEdit(!isEdit)}
                  style={{
                    width: "25px",
                    cursor: "pointer"
                  }}
                />
              </div>
            ) : (
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: '7px', justifyContent: 'center' }}
              >
                <Typography
                  variant="h3"
                  className="secHead"
                >
                  {info?.title ?? ""}

                </Typography>
                {
                  isLockedMealSnack ?
                    <img src="/images/meal/dollarred.svg" alt='dollarred' style={{ cursor: 'pointer', width: '22px' }} />
                    : isLockedMeal ?
                      <img src="/images/meal/lock.svg" alt='dollarred' style={{ cursor: 'pointer', width: '22px' }} />
                      :
                      !showSwapButton && showRemoveBtn ?
                        <img
                          src="/images/icons/binRed.svg"
                          alt='dollarred'
                          className={RemoveMealLoader ? "disable_when_loading" : ''}
                          style={{ cursor: 'pointer', width: '22px' }}
                          // onClick={handleDeleteMealClick}
                          onClick={() => { setDeletMeal(true) }}
                        />
                        :
                        ''
                }
              </Box>
            )}
            {/* Meal allergies*/}
            {Allergen?.length != 0 ? (
              <Typography
                variant="body3"
                color={AppColors.secondryGray}
                component={"p"}
                className="secPara"
              >
                <strong>Allergen:</strong> {formatAllergens(Allergen) ?? ""}
              </Typography>
            ) : null}
            {/* Meal description*/}
            <Typography
              variant="body3"
              color={AppColors.secondryGray}
              component={"p"}
              className="secPara"
            >
              {info?.description ?? ""}
            </Typography>
            {/* Meal calories boxes*/}
            <div className={clsx(
              `${boxHide ? "postDetail boxHide" : "postDetail"} ${isExecutive ? "isExecutive" : ""}`
            )} style={{ paddingBottom: '20px' }}>
              {boxHide ? (
                <div
                  className={clsx(
                    `${"caloriesCount"} ${info?.type == "snack" ? "sty2" : ""} ${info?.title == "Build Your Own" ? "BYO" : ""
                    } `
                  )}
                // className="caloriesCount"
                >
                  <Typography
                    variant={"body3"}
                    sx={{
                      color: AppColors.white,
                      textAlign: "center",
                      fontSize: "12px !important"
                    }}
                    component="p"
                  >
                    {`${info?.totalCalories}`}
                  </Typography>
                </div>
              ) : (
                <Box sx={{ display: 'flex', gap: '10px', }}>
                  <div
                    className={clsx(
                      `${"caloriesCount"} ${info?.type == "snack" ? "sty2" : ""} `
                    )}
                    style={{
                      minWidth: isAddonItem ? "max-content" : "auto",
                      maxWidth: isAddonItem ? "max-content" : "auto",
                      padding: isAddonItem && { md: "7px 10px", xs: "4px 13px" },
                    }}
                  // className="caloriesCount"
                  >
                    {
                      isAddonItem ?
                        <Typography
                          variant={"body3"}
                          sx={{
                            color: AppColors.white,
                            textAlign: "center",
                            fontSize: "15px",
                            marginRight: '5px',
                            marginLeft: '5px'
                          }}
                          component="p"
                        >
                          {`${truncateText(info?.calories, matchesSmall ? 30 : 50)}`}
                        </Typography>
                        : <Typography
                          variant={"body3"}
                          sx={{
                            color: AppColors.white,
                            textAlign: "center",
                            fontSize: "15px"
                          }}
                          component="p"
                        >
                          {`${Math.floor(info?.calories)} Calories`}
                        </Typography>

                    }
                  </div>
                  {
                    info?.qty &&
                    <div className="caloriesBox" style={{
                      border: "0.5px solid #179c78",
                      borderRadius: "10px",
                      padding: "6.5px 0",
                      margin: "0 2px",
                      width: "47px",
                      minWidth: isAddonItem ? "45px" : "auto",
                    }} >
                      <Typography
                        variant={"body3"}
                        sx={{
                          textAlign: "center",
                          fontSize: "10px !important",
                          color: AppColors.primaryGreen,
                          fontWeight: "500"
                        }}
                        component="p"
                      >
                        {`${Math.floor(info?.qty)}`}
                      </Typography>
                      <Typography
                        sx={{
                          textAlign: "center",
                          fontSize: "10px !important",
                          color: AppColors.primaryGreen
                        }}
                      >
                        {"Qty"}
                      </Typography>
                    </div>
                  }
                </Box>
              )}
              {boxHide ? (
                <>
                  {info?.mb == 1 && (
                    <div className="caloriesBox sty2">
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
                </>
              ) : (
                <div
                  className={boxHide ? "caloriesCountBox sty2" : "caloriesCountBox"}
                  style={{
                    display: (info?.proteins == undefined && info?.carbs == undefined && info?.fats == undefined) && 'none'
                  }}
                >

                  <>

                    {
                      info?.proteins &&
                      <div className="caloriesBox">
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
                          {`${Math.floor(info?.proteins)}g`}
                        </Typography>
                        <Typography
                          variant={"body3"}
                          sx={{
                            textAlign: "center",
                            fontSize: "8px",
                            color: AppColors.primaryGreen
                          }}
                          className="ParaSM"
                          component="p"
                        >
                          {"Protein"}
                        </Typography>
                      </div>
                    }
                    {
                      info?.carbs &&
                      <div className="caloriesBox">
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
                          {`${Math.floor(info?.carbs)}g`}
                        </Typography>
                        <Typography
                          variant={"body3"}
                          sx={{
                            textAlign: "center",
                            fontSize: "8px",
                            color: AppColors.primaryGreen
                          }}
                          component="p"
                          className="ParaSM"
                        >
                          {"Carbs"}
                        </Typography>
                      </div>
                    }
                    {
                      info?.fats &&
                      <div className="caloriesBox">
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
                          {`${Math.floor(info?.fats)}g`}
                        </Typography>
                        <Typography
                          variant={"body3"}
                          sx={{
                            textAlign: "center",
                            fontSize: "8px",
                            color: AppColors.primaryGreen
                          }}
                          component="p"
                          className="ParaSM"
                        >
                          {"Fats"}
                        </Typography>
                      </div>
                    }
                  </>

                  {info?.mb == 1 && (
                    <div
                      className={
                        boxHide
                          ? clsx("caloriesBox", "sty2 high")
                          : clsx("caloriesBox", "sty2")
                      }
                    >
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
              )}
            </div>
            {/* Meal Buttons/swap/remove/add protien*/}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '200px' }}>
              {awesomepage ? (
                <DialogActions
                  sx={{ justifyContent: "center", }}
                ></DialogActions>
              ) : isMyBYO ? (
                <DialogActions
                  className="BYOWrap"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "row"
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      marginTop: "10px"
                    }}
                  >
                    <Button
                      variant="outlined"
                      className="swapButton save"
                      disabled={textInput == "" || errorMessage ? true : false}
                      onClick={() => {
                        editMyBYOHandler(info?.id, textInput)
                        setIsEdit(false)
                      }}
                      style={{ margin: "0px 10px" }}
                      sx={{ color: "#fff", width: "100%", maxWidth: "220px" }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      className="swapButton"
                      style={{
                        margin: "0px 10px",
                        color: "#119a77",
                        backgroundColor: "#fff"
                      }}
                      sx={{
                        color: "#fff",
                        width: "100%",
                        maxWidth: "220px"
                      }}
                      onClick={() => {
                        handleSwap()
                      }}
                    >
                      Swap
                    </Button>
                    <Dustbin onClick={() => deleteMyBYOHandler(info?.id)} />
                  </div>
                </DialogActions>
              ) : (
                <DialogActions sx={{ justifyContent: "flex-end", }}>
                  {view && !isSwapped && (
                    <div
                      style={{ display: !showSwapButton && 'none' }}
                      className={`buttonWrap ${isExecutive ? "isExecutive" : ''}`}>
                      <Button
                        disabled={isLockedMealSnack ? false : isSwapDisabled}
                        variant="outlined"
                        className={`swapButton${isLockedMealSnack ? '' : isSwapDisabled ? " disabled" : ""}`}
                        sx={{ color: "#fff", width: "100%", maxWidth: "220px", whiteSpace: 'nowrap' }}
                        onClick={() => {
                          handleSwap()
                        }}
                      >
                        {
                          isLockedMealSnack ?
                            "Add Snack" : isLockedMeal ? "Unlock Now" :
                              "Swap Now"}
                      </Button>
                      {addProtienPop && isExtraProteins ? (
                        <Button
                          variant="outlined"
                          className="swapButton"
                          sx={{ color: "#fff", width: "100%", maxWidth: "220px", whiteSpace: 'nowrap' }}
                          onClick={addProtienPop}
                        >
                          Add Proteins
                        </Button>
                      ) : null}
                    </div>
                  )}

                  {isMyBYO ? (
                    <>
                      <DialogActions
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                          flexDirection: "row"
                        }}
                        sx={{ paddingBottom: "40px" }}
                      >
                        <div>
                          <Button
                            variant="outlined"
                            className="swapButton"
                            sx={{ color: "#fff", width: "100%", maxWidth: "240px" }}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            className="swapButton"
                            sx={{ color: "#fff", width: "100%", maxWidth: "220px" }}
                          >
                            Swap
                          </Button>
                        </div>
                      </DialogActions>
                    </>
                  ) : null}

                  {DeletMeal &&
                    <Box sx={{ display: 'flex' }} className={`buttonWrap ${isExecutive ? "isExecutive" : ''}`}>
                      <Button
                        className="Btn"
                        onClick={handleDeleteMealClick}
                        variant="contained"
                        sx={{
                          mb: '10px',
                          minWidth: '150px',
                          '@media (max-width:840px)': {
                            minWidth: '60px',
                          },
                        }}
                      >
                        Remove
                      </Button>
                      <Button
                        className="Btn"
                        onClick={() => { setDeletMeal(false) }}
                        variant="outlined"
                        sx={{
                          mb: '10px',
                          minWidth: '150px',
                          '@media (max-width:840px)': {
                            minWidth: '60px',
                          },
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  }
                </DialogActions>
              )}
            </div>
            {/* Meal ingredients*/}
            {combinedTitles ? (
              <Typography
                variant="body3"
                color={AppColors.secondryGray}
                component={"p"}
                className="secPara"
              >
                <strong>Ingredients:</strong> {combinedTitles ?? ""}
              </Typography>
            ) : null}
            <br />
          </div>
        </div>
      </DialogContent>


      <Button
        className={`crossButton sty2 ${isExecutive ? "isExecutive" : ""}`}
        sx={{ color: "red" }}
        onClick={handleCloseClick}
      >
        x
      </Button>
    </Dialog>
  )
}
MealInfoPop.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
}
