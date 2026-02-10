import React, { useState, useEffect } from "react"
import { Box, Typography } from "@mui/material"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import { useSelector } from "react-redux"
import get from "lodash/get"
import FormGroup from "@mui/material/FormGroup"
import Checkbox from "@mui/material/Checkbox"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
import Button from "@mui/material/Button"
import AppLogger from "helpers/AppLogger"
import DisclaimerComp from "../disclaimer"
import { Animated } from "react-animated-css"
import QuizDisclaimer from "components/quizDisclaimer"
import AppColors from "helpers/AppColors"
import MuiAlert from "@mui/material/Alert"
import { customTimeout } from "helpers/ShortMethods"
import PopUpConfirmDays from "@components/mainStepper/PopUpConfirmDays"
import AppConstants from "@helpers/AppConstants"
import { useRouter } from "next/router"
import AppRoutes from "@helpers/AppRoutes"

const BadgeMultiSelect = ({
  handleFormData,
  options,
  fieldToUpdate,
  question,
  description,
  animatedState,
  values,
  changeFormData,
}) => {

  const { currentQuizType, result } = useSelector((state) => state.quiz)
  const [allOptions, setAllOptions] = useState([])
  const [warningBox, setWarningBox] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const { userProfile } = useSelector((state) => state.profile)
  const [localProfileData, setLocalProfileData] = useState(null)
  const [resultData, setResultData] = useState(null)
  // meal_days_per_week
  // console.log("allOptions",allOptions)
  const mealsDaysPerWeek = get(localProfileData, "guest.meal_days_per_week", 0)

  const AllSnacks = get(resultData, "guest.snacks_deliver_per_day", "")
  const AllMeals = get(resultData, "guest.meals_deliver_per_day", "")
  const AllDays = get(resultData, "guest.meal_days_per_week", "")
  const AllWeeks = get(resultData, "guest.meal_plan_require_weeks", "")
  const { isExecutive } = useSelector((state) => state.auth)
  const [openModalforDayConfirm, setOpenModalforDayConfirm] = useState(false);
  const router = useRouter();
  const DoesPathIncludes = router?.pathname?.includes(AppRoutes.dashboard || AppRoutes.login)
  
  useEffect(() => {
    startDataValueHandler()
  }, [values])

  useEffect(() => {
    setLocalProfileData(userProfile)
  }, [userProfile])

  useEffect(() => {
    const currentIndex = allOptions.findIndex((val) => val.selected == true)
    if (currentIndex < 0) {
      setWarningBox(false)
    } else {
      setWarningBox(true)
    }
    if (currentIndex !== -1) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [allOptions])

  useEffect(() => {
    try {
      if (userProfile) {
        setResultData(userProfile)
      }
    } catch (err) {
      AppLogger("Error at setResultData", err)
    }
  }, [userProfile])

  useEffect(() => {
    optionHandler()
  }, [])

  const optionHandler = () => {
    const allOpt = []

    for (let index = 0; index < options.length; index++) {
      const element = { value: options[index], selected: false }
      allOpt.push(element)
    }
    setAllOptions(allOpt)
  }

  const handleSelect = (event, index) => {
    const datees = [...allOptions]
    datees[index] = { ...datees[index], selected: !datees[index].selected }
    setAllOptions(datees)
  }

  const startDataValueHandler = () => {
    try {
      if (values) {
        const startValues = []
        if (values.hasOwnProperty(fieldToUpdate)) {
          const selectedValues = get(values, `${fieldToUpdate}`, [])

          for (let index = 0; index < options.length; index++) {
            const element = options[index]

            const curIndex = selectedValues.findIndex((val) => val == element)
            AppLogger("this isindex========", curIndex)
            if (curIndex !== -1) {
              const formmated = { value: element, selected: true }
              startValues.push(formmated)
            } else {
              const formmated = { value: element, selected: false }
              startValues.push(formmated)
            }
          }
          customTimeout(() => {
            setAllOptions(startValues)
          }, 200)
        }
      }
    } catch (err) {
      AppLogger("this is error at startDataValueHandler=======", err)
    }
  }
  const handleSubmitPress = () => {
    var options = []
    for (let index = 0; index < allOptions.length; index++) {
      const element = allOptions[index]
      if (element.selected) {
        options.push(element.value)
      }
    }
    // handleFormData("meal_plan_start_date", null)
    // handleFormData("meal_plan_end_date", null)
    // handleFormData("meal_plan_pause_date", [])
    changeFormData({ ...values, meal_plan_pause_date: [] })
    handleFormData(fieldToUpdate, options);

    // setOpenModalforDayConfirm(true)
  }
  const disableHandler = () => {
    try {
      if (fieldToUpdate == "days_food_delivery") {
        if (mealsDaysPerWeek) {
          var options = []
          for (let index = 0; index < allOptions.length; index++) {
            const element = allOptions[index]
            if (element.selected) {
              options.push(element.value)
            }
          }
          AppLogger("this is mealsDaysPerWeek==========", mealsDaysPerWeek)
          AppLogger("this is allOptions==========", allOptions)
          if (options.length === mealsDaysPerWeek) {
            return true
          } else {
            AppLogger("in first else=========")
            return false
          }
        } else {
          AppLogger("in second else===========")
          return false
        }
      } else {
        AppLogger("in third else=========")
        return true
      }
    } catch (err) {
      AppLogger("this is err-==========", err)
    }
  }

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  })

  const justDayNameExtract = allOptions?.filter(item => item?.selected)?.map(item => item?.value);

  return (
    <div className={styles.quizSelection}>
      <div className="container container--custom">
        <div className="animatedWrapper">
          <Animated
            animationIn="fadeInRight"
            animationOut="fadeOutLeft"
            animationInDuration={currentQuizType == "quiz_preference" ? 0 : 500}
            animationOutDuration={
              currentQuizType == "quiz_preference" ? 0 : 500
            }
            isVisible={animatedState}
          >
            <Typography variant={"h2"} className={styles.quizTitle}>
              {question}
            </Typography>
            <Typography
              variant={"body3"}
              component="p"
              className={styles.quizPara}
            >
              {description}
            </Typography>

            {resultData ? (
              <div>
                <QuizDisclaimer
                  AllSnacks={AllSnacks}
                  AllMeals={AllMeals}
                  AllDays={AllDays}
                  AllWeeks={AllWeeks}
                />
                {/* <DisclaimerComp
                  AllSnacks={AllSnacks}
                  AllMeals={AllMeals}
                  AllDays={AllDays}
                  AllWeeks={AllWeeks}
                /> */}
              </div>
            ) : null}

            <div className={`quizQuestion--sty2 rounded${isExecutive ? " quizQuesExecutive" : ""} style2`}>
              <FormControl>
                <FormGroup>
                  {allOptions?.length > 0
                    ? allOptions?.map((val, index) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            checked={val.selected}
                            onChange={(e) => handleSelect(e, index)}
                            name={val.value}
                          />
                        }
                        label={val.value}
                      />
                    ))
                    : ""}
                </FormGroup>
                {warningBox ? (
                  <>
                    <Alert severity="info" className="infoBox">
                      Please select your delivery days based on when you want
                      the food delivered, not the day you want to eat it.
                    </Alert>
                  </>
                ) : null}
                <Box>
                  <Button
                    className={`${styles.btn} ${isExecutive ? styles.isExecutive : ''}`}
                    // onClick={handleSubmitPress}
                    onClick={() => {
                      
                      // if (fieldToUpdate == AppConstants.days_food_delivery) {
                      //   setOpenModalforDayConfirm(true)
                      // } else {
                        handleSubmitPress()
                      // }
                    }}
                    disabled={disableHandler() ? false : true}
                    variant="contained"
                  >
                    Continue
                  </Button>
                </Box>
                {/* <button onClick={handleSubmitPress}>Continue</button> */}
              </FormControl>
            </div>
          </Animated>
        </div>
      </div>
      <PopUpConfirmDays
        openModalforDayConfirm={openModalforDayConfirm && !DoesPathIncludes}
        isExecutive={isExecutive}
        AppColors={AppColors}
        setOpenModal={setOpenModalforDayConfirm}
        // handleBack={handleBack}
        formData={{ days_food_delivery: justDayNameExtract }}
        onYesClick={handleSubmitPress}
      />
      {/* days_food_delivery */}
    </div>
  )
}

BadgeMultiSelect.propTypes = {
  handleFormData: PropTypes.func,
  options: PropTypes.array,
  fieldToUpdate: PropTypes.string,
  question: PropTypes.string,
  description: PropTypes.string,
  defaultUnit: PropTypes.array,
  bool: PropTypes.any,
  allergies: PropTypes.array
}
export default BadgeMultiSelect
