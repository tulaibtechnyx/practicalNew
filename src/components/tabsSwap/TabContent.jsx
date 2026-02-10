import React, { useState, useEffect, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { buildYourOwnDataRequest } from "../../store/reducers/ordersReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import { useRouter } from "next/router"
import EditPreferences from "../../screens/editContent"
import SelectToComp from "components/selectTo/SelectTo"
import styles from "./style.module.scss"
import Button from "@mui/material/Button"
import AppRoutes from "helpers/AppRoutes"
import AppColors from "helpers/AppColors"
import AppLogger from "helpers/AppLogger"
import InfoPopup from "../popUp/infoPop"
import Typography from "@mui/material/Typography"
import { UpcomingOrdersRequest } from "store/reducers/dashboardReducer"

export default function TabContent({ awesomepage , isExecutive , buildYourOwnData=null}) {
  const dispatch = useDispatch()
  const router = useRouter()

  const { orderId, error, orderCalories, customMeal } =
    useSelector((state) => state.orders)
  const { userDetails } = useSelector((state) => state.auth)

  const [proteins, setProteins] = useState([])
  const [customMealLocal, setCustomMealLocal] = useState(null)
  const [carbs, setCarbs] = useState([])
  const [fats, setFats] = useState([])
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const [currentCalories, setCurrentCalories] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [vegetables, setVegetables] = useState([])
  const [proteinId, setProteinId] = useState("")
  const [carbsId, setCarbsId] = useState("")
  const [vegetableId, setVegetableId] = useState("")
  const [fatsId, setFatsId] = useState("")

  const [totalData, setTotalData] = useState({
    carbs: 0,
    protein: 0,
    calories: 0,
    fats: 0
  })

  useEffect(() => {
    if (customMeal) {
      setCustomMealLocal(customMeal)
    }
  }, [customMeal])

  useEffect(() => {
    startUpCustomMealHandler()
  }, [customMealLocal])

  useEffect(() => {
    if (orderCalories) {
      setCurrentCalories(orderCalories)
    }
  }, [orderCalories])

  useEffect(() => {
    if (error) {
      setErrorMessage(error?.message)
    } else {
      setErrorMessage("")
    }
  }, [error])

  useEffect(() => {
    foodDataCounter()
  }, [vegetableId, proteinId, carbsId, fatsId])

  useEffect(() => {
    startDataHandler()
  }, [buildYourOwnData])

  const startUpCustomMealHandler = () => {
    if (customMealLocal) {
      AppLogger("this is custom meal========", customMealLocal)
      setFatsId(customMeal?.fats_id)
      setProteinId(customMeal?.proteins_id)
      setVegetableId(customMeal?.sides_vegetables_id)
      setCarbsId(customMeal?.sides_starchy_carbohydrates_id)
    }
  }

  const startDataHandler = () => {
    try {
      if (buildYourOwnData) {
        if (buildYourOwnData.proteins) {
          setProteins(buildYourOwnData?.proteins)
        }

        if (buildYourOwnData?.vegetables) {
          setVegetables(buildYourOwnData?.vegetables)
        }

        if (buildYourOwnData?.carbs) {
          setCarbs(buildYourOwnData?.carbs)
        }

        if (buildYourOwnData?.fats) {
          setFats(buildYourOwnData?.fats)
        }
      }
    } catch (err) {
      AppLogger("Error at startDataHandler", err)
    }
  }

  const disabledHandler = useCallback(() => {
    if (
      vegetableId == "" ||
      vegetableId == -1 ||
      proteinId == "" ||
      proteinId == -1 ||
      carbsId == "" ||
      carbsId == -1 ||
      fatsId == "" ||
      fatsId == -1 ||
      totalData.calories == 0
    ) {
      return true
    } else {
      return false
    }
  }, [vegetableId, proteinId, carbsId, fatsId, totalData])

  const foodDataCounter = () => {
    var totalCalories = 0
    var totalFats = 0
    var totalCarbs = 0
    var totalProteins = 0

    if (proteinId !== "" || proteinId !== -1) {
      const currentProteinIndex = proteins.findIndex(
        (val) => val.id == proteinId
      )
      if (currentProteinIndex !== -1) {
        const currentProtien = proteins[currentProteinIndex]
        totalCalories = totalCalories + currentProtien.calories
        totalFats = totalFats + currentProtien.fats
        totalCarbs = totalCarbs + currentProtien.carbs
        totalProteins = totalProteins + currentProtien.proteins
      }
    }

    if (carbsId !== "" || carbsId !== -1) {
      const currentCarbsIndex = carbs.findIndex((val) => val.id == carbsId)
      if (currentCarbsIndex !== -1) {
        const currentCarbs = carbs[currentCarbsIndex]
        totalCalories = totalCalories + currentCarbs.calories
        totalFats = totalFats + currentCarbs.fats
        totalCarbs = totalCarbs + currentCarbs.carbs
        totalProteins = totalProteins + currentCarbs.proteins
      }
    }

    if (vegetableId !== "" || vegetableId !== -1) {
      const currentVegetableIndex = vegetables.findIndex(
        (val) => val.id == vegetableId
      )
      if (currentVegetableIndex !== -1) {
        const currentVegetable = vegetables[currentVegetableIndex]
        totalCalories = totalCalories + currentVegetable.calories
        totalFats = totalFats + currentVegetable.fats
        totalCarbs = totalCarbs + currentVegetable.carbs
        totalProteins = totalProteins + currentVegetable.proteins
      }
    }

    if (fatsId !== "" || fatsId !== -1) {
      const currentFatsIndex = fats.findIndex((val) => val.id == fatsId)
      if (currentFatsIndex !== -1) {
        const currentFats = fats[currentFatsIndex]
        totalCalories = totalCalories + currentFats.calories
        totalFats = totalFats + currentFats.fats
        totalCarbs = totalCarbs + currentFats.carbs
        totalProteins = totalProteins + currentFats.proteins
      }
    }

    totalData.calories = totalCalories
    totalData.fats = totalFats
    totalData.carbs = totalCarbs
    totalData.protein = totalProteins

    if (
      totalCalories == 0 &&
      totalFats == 0 &&
      totalCarbs == 0 &&
      totalProteins == 0 &&
      proteinId !== "" &&
      carbsId !== "" &&
      vegetableId !== "" &&
      fatsId !== ""
    ) {
      setErrorMessage("Cannot Skip all Items")
    } else {
      setErrorMessage("")
    }

    setTotalData({ ...totalData })
  }

  const swipeHandler = () => {
    try {
      const { auth_token } = userDetails?.data
      document.querySelector("html").classList.add("nprogress-busy")
      const data = {
        proteins_id: proteinId,
        fats_id: fatsId,
        sides_starchy_carbohydrates_id: carbsId,
        sides_vegetables_id: vegetableId,
        order_id: orderId,
        total_calories: totalData.calories,
        total_fats: totalData.fats,
        total_carbs: totalData.carbs,
        total_proteins: totalData.protein
      }
      dispatch(buildYourOwnDataRequest({ token: auth_token, SwipeData: data }))
        .then(unwrapResult)
        .then((res) => {
          AppLogger("Response at buildYourOwnDataRequest", res)
          if(auth_token){
            dispatch(UpcomingOrdersRequest({ token: auth_token })).then(() => {
              document.querySelector("html").classList.remove("nprogress-busy")
              router.push(AppRoutes.dashboard);
            })
          }
        })
        .catch((err) => {
          document.querySelector("html").classList.remove("nprogress-busy")
          AppLogger("Error at buildYourOwnDataRequest", err)
        })
    } catch (err) {
      AppLogger("Error at swipeHandler", err)
    }
  }

  const onConfirmPressHandler = () => {
    if (currentCalories !== totalData.calories) {
      setShowConfirmPopup(true)
    } else {
      swipeHandler()
    }
  }

  return (
    <div className="container container--custom">
      <div className="swap--pageWrapper">
        <EditPreferences
          title="Let us count your Calories & Macros for you"
          para="We’ve taken the guess work out of building your own Macro-Balanced Meal.
          Select 1 option from each of the categories below & this Meal will match the Calories of the rest of your Meal Plan & it will be Macro-Balanced too! Cool, right?!"
          para2="The Build Your Own Meal you created will be saved in the My Build Your Own tab above. There, you can name your BYO too!"
          color={true}
          isExecutive={isExecutive}
        />
        {proteins.length > 0 && (
          <SelectToComp
          TitleDesc={'i.e. Chicken (Approx 35% of total meal calories)'}  
          Title={`Protein`}
            optionData={proteins}
            value={proteinId}
            onChange={(e) => setProteinId(e)}
            placeholder="Choose 1 Option"
           isExecutive={isExecutive}

          />
        )}
        {carbs.length > 0 && (
          <SelectToComp
          TitleDesc={'i.e. Rice (Approx 25-30% of total meal calories)'}  
          Title={'Side One'}
            optionData={carbs}
            value={carbsId}
            onChange={(e) => setCarbsId(e)}
            placeholder="Choose 1 Option"
           isExecutive={isExecutive}

          />
        )}
        {vegetables.length > 0 && (
          <SelectToComp
          TitleDesc={'i.e. Veggies (Approx 10% of total meal calories)'}  
          Title={"Side Two"}
            placeholder="Choose 1 Option"
            optionData={vegetables}
            value={vegetableId}
            onChange={(e) => setVegetableId(e)}
           isExecutive={isExecutive}

          />
        )}
        {fats.length > 0 && (
          <SelectToComp
          TitleDesc={'i.e. Cheese (Approx 25-30% of total meal calories)'}  
          Title={"Side Three"}
            optionData={fats}
            value={fatsId}
            onChange={(e) => setFatsId(e)}
            placeholder="Choose 1 Option"
           isExecutive={isExecutive}

          />
        )}
        <div className={`caloriesBox ${isExecutive ? "isExecutive" : ""}`}>
          <div className="totalCalories">
             <Typography
              variant={"h1"}
              className={styles.para}
              sx={{
                color: AppColors.primaryGreen,
                fontFamily: "AWConquerorInline"
              }}
            >
              {totalData.calories} Calories
            </Typography>
          </div>
          <div className="calories--distribution">
            <div className="caloryBox">
              <Typography
                variant={"body2"}
                className={styles.para}
                sx={{
                  color: AppColors.primaryGreen
                }}
              >
                {`${totalData.protein}g`} <span>Protein</span>
              </Typography>
            </div>
            <div className="caloryBox">
              <Typography
                variant={"body2"}
                className={styles.para}
                sx={{
                  color: AppColors.primaryGreen
                }}
              >
                {`${totalData.carbs}g`} <span>Carbs</span>
              </Typography>
            </div>
            <div className="caloryBox">
              <Typography
                variant={"body2"}
                className={styles.para}
                sx={{
                  color: AppColors.primaryGreen
                }}
              >
                {`${totalData.fats}g`} <span>Fats</span>
              </Typography>
            </div>
          </div>
        </div>
        {errorMessage && (
          <p
            className="errorMsgSwap"
            style={{ color: AppColors.red, textAlign: "center" }}
          >{`Error: ${errorMessage}`}</p>
        )}
        <InfoPopup
          open={showConfirmPopup}
          onConfirm={() => swipeHandler()}
          handleClose={() => setShowConfirmPopup(!showConfirmPopup)}
        />
        {awesomepage ? null : (
          <div className={`ctawrapper ${isExecutive ? "isExecutive" : ""}`}>
            <Button
              onClick={onConfirmPressHandler}
              disabled={disabledHandler()}
              variant="outlined"
            >
              Confirm & Swap
            </Button>
            <Button
              onClick={() => router.push("dashboard")}
              // disabled={disabledHandler()}
              // href="/dashboard"
              variant="outlined"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
