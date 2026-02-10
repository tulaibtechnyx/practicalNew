import React, { useEffect, useState } from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import { Box, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import AppRoutes from "../../helpers/AppRoutes"
import get from "lodash/get"
import moment from "moment"
import AppConstants from "helpers/AppConstants"
import { useRouter } from "next/router"
export default function Nextmeal({
  open,
  handleClose,
  handleTabChange,
  isRenewedPlan,
  isExecutive
}) {
  const { renewalData } = useSelector((state) => state.home)

  const [renewalDataLocal, setRenewalDataLocal] = useState(null)
  const [totalCalories, setTotalCalories] = useState(0)
  const numberOfDays = get(renewalDataLocal, "meal_days_per_week", "")
  const numberOfWeeks = get(renewalDataLocal, "meal_plan_require_weeks", "")
  const startDate = get(renewalDataLocal, "meal_plan_start_date", "")
  const endDate = get(renewalDataLocal, "meal_plan_end_date", "")
  const numberOfMeals = get(renewalDataLocal, "meals_deliver_per_day", "")
  const numberOfSnacks = get(renewalDataLocal, "snacks_deliver_per_day", "")
  const mealPlan = get(renewalDataLocal, "meal_plan", [])
  const snackPlan = get(renewalDataLocal, "snack_plan", [])
  const paymentStatus = get(renewalDataLocal, "order.payment_status", "")

  const router = useRouter()

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
  return (
    <Dialog open={open} onClose={handleClose} className={`infoPop sty2 ${isExecutive ? "isExecutive" : ""}`}>
      <>
        {isRenewedPlan ? (
          <>
            <DialogTitle
              variant="h1"
              sx={{
                textAlign: "center",
                color:  AppColors.primaryGreen,
                padding: "36px 24px 10px 24px;"
              }}
            >
              Your Next Meal Plan
            </DialogTitle>
            <DialogContent sx={{ padding: "17px 37px 2px 45px" }}>
              <Typography
                component={"p"}
                variant="body3"
                sx={{
                  margin: "0 auto",
                  // maxWidth: "270px",
                  color: AppColors.darkGrey,
                  textAlign: "center",
                  paddingBottom: "32px",
                  fontSize: "15px !important"
                }}
              >
                Here are the details of your next Meal Plan.
              </Typography>
              <div className="secWrapper">
                {numberOfWeeks && (
                  <Box
                    className="mealPlanWrap"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "8px"
                    }}
                  >
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        color: AppColors.darkGrey,
                        fontWeight: "500",
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      Number of Weeks:
                    </Typography>
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        fontWeight: "500",
                        color: AppColors.primaryGreen,
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      {numberOfWeeks}
                    </Typography>
                  </Box>
                )}
                {numberOfDays && (
                  <Box
                    className="mealPlanWrap"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "8px"
                    }}
                  >
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        color: AppColors.darkGrey,
                        fontWeight: "500",
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      Number of Days:
                    </Typography>
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        fontWeight: "500",
                        color: AppColors.primaryGreen,
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      {numberOfDays}
                    </Typography>
                  </Box>
                )}
                {numberOfMeals && (
                  <Box
                    className="mealPlanWrap"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "8px"
                    }}
                  >
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        color: AppColors.darkGrey,
                        fontWeight: "500",
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      Number of Meals per Day:
                    </Typography>
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        fontWeight: "500",
                        color: AppColors.primaryGreen,
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      {numberOfMeals}
                    </Typography>
                  </Box>
                )}
                <Box
                  className="mealPlanWrap"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "8px"
                  }}
                >
                  <Typography
                    component={"p"}
                    variant="body3"
                    sx={{
                      // maxWidth: "270px",
                      color: AppColors.darkGrey,
                      fontWeight: "500",
                      textAlign: "center",
                      paddingBottom: "9px",
                      fontSize: "15px !important"
                    }}
                  >
                    Number of Snacks per Day:
                  </Typography>
                  <Typography
                    component={"p"}
                    variant="body3"
                    sx={{
                      // maxWidth: "270px",
                      fontWeight: "500",
                      color: AppColors.primaryGreen,
                      textAlign: "center",
                      paddingBottom: "9px",
                      fontSize: "15px !important"
                    }}
                  >
                    {numberOfSnacks}
                  </Typography>
                </Box>
                {totalCalories !== 0 && (
                  <Box
                    className="mealPlanWrap"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "8px"
                    }}
                  >
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        color: AppColors.darkGrey,
                        fontWeight: "500",
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      Number of Calories per Day:
                    </Typography>
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        fontWeight: "500",
                        color: AppColors.primaryGreen,
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      {totalCalories}
                    </Typography>
                  </Box>
                )}
                {startDate && (
                  <Box
                    className="mealPlanWrap"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "8px"
                    }}
                  >
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        color: AppColors.darkGrey,
                        fontWeight: "500",
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      Start Date:
                    </Typography>
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        fontWeight: "500",
                        color: AppColors.primaryGreen,
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      {moment(startDate).format(AppConstants.dateFormat)}
                    </Typography>
                  </Box>
                )}
                {endDate && (
                  <Box
                    className="mealPlanWrap"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "8px"
                    }}
                  >
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        color: AppColors.darkGrey,
                        fontWeight: "500",
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      End Date:
                    </Typography>
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        fontWeight: "500",
                        color: AppColors.primaryGreen,
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      {moment(endDate).format(AppConstants.dateFormat)}
                    </Typography>
                  </Box>
                )}
              </div>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: "center",
                paddingBottom: "40px",
                flexDirection: "column"
              }}
            >
              <Button
                className="Btn"
                href={
                  paymentStatus == "paid"
                    ? AppRoutes.viewRenewal
                    : AppRoutes.renewal
                }
                onClick={handleClose}
                variant="contained"
                sx={{
                  background: AppColors.primaryGreen,
                  borderColor: AppColors.primaryGreen,
                  color: AppColors.white,
                  minWidth: "231px"
                }}
              >
                {paymentStatus == "paid"
                  ? "Renewed Meal Plan Preferences"
                  : "Edit My Renewed Meal Plan"}
              </Button>
              {/* <Button
                className="Btn"
                // href={AppRoutes.viewRenewal}
                onClick={handleTabChange}
                variant="contained"
                sx={{
                  background: AppColors.primaryGreen,
                  borderColor: AppColors.primaryGreen,
                  color: AppColors.white,
                  minWidth: "231px"
                }}
              >
                View My Renewed Meal Plan
              </Button> */}
            </DialogActions>
          </>
        ) : (
          <>
            {" "}
            <DialogTitle
              variant="h1"
              sx={{
                textAlign: "center",
                color: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen,
                padding: "36px 24px 10px 24px;"
              }}
            >
              Your Next Meal Plan
            </DialogTitle>
            <DialogContent sx={{ padding: "17px 37px 2px 45px" }}>
              <Typography
                component={"p"}
                variant="body3"
                sx={{
                  margin: "0 auto",
                  // maxWidth: "270px",
                  color: AppColors.darkGrey,
                  textAlign: "center",
                  paddingBottom: "32px",
                  fontSize: "15px !important"
                }}
              >
                Here are the details of your next Meal Plan.
              </Typography>
              <div className="secWrapper">
                {numberOfWeeks && (
                  <Box
                    className="mealPlanWrap"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "8px"
                    }}
                  >
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        color: AppColors.darkGrey,
                        fontWeight: "500",
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      Number of Weeks:
                    </Typography>
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        fontWeight: "500",
                        color:isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen,
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      {numberOfWeeks}
                    </Typography>
                  </Box>
                )}
                {numberOfDays && (
                  <Box
                    className="mealPlanWrap"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "8px"
                    }}
                  >
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        color: AppColors.darkGrey,
                        fontWeight: "500",
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      Number of Days:
                    </Typography>
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        fontWeight: "500",
                        color: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen,
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      {numberOfDays}
                    </Typography>
                  </Box>
                )}
                {numberOfMeals && (
                  <Box
                    className="mealPlanWrap"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "8px"
                    }}
                  >
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        color: AppColors.darkGrey,
                        fontWeight: "500",
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      Number of Meals per Day:
                    </Typography>
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        fontWeight: "500",
                        color: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen,
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      {numberOfMeals}
                    </Typography>
                  </Box>
                )}

                <Box
                  className="mealPlanWrap"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "8px"
                  }}
                >
                  <Typography
                    component={"p"}
                    variant="body3"
                    sx={{
                      // maxWidth: "270px",
                      color: AppColors.darkGrey,
                      fontWeight: "500",
                      textAlign: "center",
                      paddingBottom: "9px",
                      fontSize: "15px !important"
                    }}
                  >
                    Number of Snacks per Day:
                  </Typography>
                  <Typography
                    component={"p"}
                    variant="body3"
                    sx={{
                      // maxWidth: "270px",
                      fontWeight: "500",
                      color: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen,
                      textAlign: "center",
                      paddingBottom: "9px",
                      fontSize: "15px !important"
                    }}
                  >
                    {numberOfSnacks}
                  </Typography>
                </Box>

                {totalCalories !== 0 && (
                  <Box
                    className="mealPlanWrap"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "8px"
                    }}
                  >
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        color: AppColors.darkGrey,
                        fontWeight: "500",
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      Number of Calories per Day:
                    </Typography>
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        fontWeight: "500",
                        color: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen,
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      {totalCalories}
                    </Typography>
                  </Box>
                )}
                {startDate && (
                  <Box
                    className="mealPlanWrap"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "8px"
                    }}
                  >
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        color: AppColors.darkGrey,
                        fontWeight: "500",
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      Start Date:
                    </Typography>
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        fontWeight: "500",
                        color: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen,
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      {moment(startDate).format(AppConstants.dateFormat)}
                    </Typography>
                  </Box>
                )}
                {endDate && (
                  <Box
                    className="mealPlanWrap"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "8px"
                    }}
                  >
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        color: AppColors.darkGrey,
                        fontWeight: "500",
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      End Date:
                    </Typography>
                    <Typography
                      component={"p"}
                      variant="body3"
                      sx={{
                        // maxWidth: "270px",
                        fontWeight: "500",
                        color: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen,
                        textAlign: "center",
                        paddingBottom: "9px",
                        fontSize: "15px !important"
                      }}
                    >
                      {moment(endDate).format(AppConstants.dateFormat)}
                    </Typography>
                  </Box>
                )}
              </div>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: "center",
                paddingBottom: "40px",
                flexDirection: "column"
              }}
            >
              <Button
                className="Btn"
                href={
                  paymentStatus == "paid"
                    ? AppRoutes.viewRenewal
                    : AppRoutes.renewal
                }
                onClick={handleClose}
                variant="contained"
                sx={{
                  background: AppColors.primaryGreen,
                  borderColor: AppColors.primaryGreen,
                  color: AppColors.white,
                  minWidth: "231px"
                }}
              >
                {paymentStatus == "paid"
                  ? "Renewed Meal Plan Preferences"
                  : "Edit My Renewed Meal Plan"}
              </Button>
              <Button
                className="Btn"
                // href={AppRoutes.viewRenewal}
                onClick={handleTabChange}
                variant="contained"
                sx={{
                  background: AppColors.primaryGreen,
                  borderColor: AppColors.primaryGreen,
                  color: AppColors.white,
                  minWidth: "231px"
                }}
              >
                View My Renewed Meal Plan
              </Button>
            </DialogActions>
          </>
        )}
      </>
      <Button
        className={`crossButton ${isExecutive ? 'isExecutive':'' }`}
        onClick={handleClose}>
        x
      </Button>
    </Dialog>
  )
}
Nextmeal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
}
