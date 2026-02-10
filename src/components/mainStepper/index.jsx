import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/router"
import {
  saveQuizFields,
  postQuizRequest,
  quizBMidRequest,
  getCommonQuizQuestions,
  retakeQuizRequest
} from "../../store/reducers/quizPageReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import { PostProfileRequest } from "store/reducers/profileReducer"
import AppLogger from "../../helpers/AppLogger"
import PropTypes from "prop-types"
import Box from "@mui/material/Box"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepButton from "@mui/material/StepButton"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Badge from "../Formcomponents/Badge"
import Counter from "../Formcomponents/Counter"
import Options from "../Formcomponents/Options"
import Rating from "../Formcomponents/Rating"
import Chip from "../Formcomponents/Chip"
import MultiSelect from "../Formcomponents/MultiSelect"
import Date from "../Formcomponents/Date"
import BadgeMultiSelect from "../Formcomponents/BadgeMultiSelect"
import dynamic from "next/dynamic";
// ...Dynamic import for Quiz components...
// const Badge = dynamic(() => import("../Formcomponents/Badge"), { ssr: false });
// const Counter = dynamic(() => import("../Formcomponents/Counter"), { ssr: false });
// const Options = dynamic(() => import("../Formcomponents/Options"), { ssr: false });
// const Rating = dynamic(() => import("../Formcomponents/Rating"), { ssr: false });
// const Chip = dynamic(() => import("../Formcomponents/Chip"), { ssr: false });
// const MultiSelect = dynamic(() => import("../Formcomponents/MultiSelect"), { ssr: false });
// const Date = dynamic(() => import("../Formcomponents/Date"), { ssr: false });
// const BadgeMultiSelect = dynamic(() => import("../Formcomponents/BadgeMultiSelect"), { ssr: false });
// ...Dynamic import for Quiz components...
import Tooltip from "@mui/material/Tooltip"
import ThankyouPop from "../popUp/index"
import useMediaQuery from "@mui/material/useMediaQuery"
import AppRoutes from "helpers/AppRoutes"
import SkeletonComp from "components/skeleton"
import AppColors from "helpers/AppColors"
import ThankyouLG from "components/popUp/thankYouLG"
import AppDataConstant from "helpers/AppDataConstant"
import { customTimeout } from "helpers/ShortMethods"
import { isExecutiveRequest } from "store/reducers/authReducer"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import AppConstants from "helpers/AppConstants"
import PopUpConfirmDays from "./PopUpConfirmDays"
import { getCache, pushToDataLayer, setCache } from "@helpers/CommonFunc"
import useQuizTracking from "../../hooks/useQuizTracking"
import { setshowCoupenPopupStateFromApp } from "../../store/reducers/dashboardReducer"

const MainStepper = ({
  activeIndex,
  common,
  handleClose,
  quizType,
  showAfterQuizPopup,
  isExecutive
}) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const {
    questions,
    commonQuestions,
    formFields,
    savedFields,
    currentQuizType,
    error,
    loading,
    retakeMode
  } = useSelector((state) => state.quiz)
  const { startUpData, showCoupenPopupStateFromApp } = useSelector((state) => state.home)
  const { error: profileError, userProfile } = useSelector(
    (state) => state.profile
  )
  const [showCoupenPopup, setShowCoupenPopUp] = useState(false)


  const [hasHydrated, setHasHydrated] = useState(false); // flag for first load
  const { userDetails } = useSelector((state) => state.auth)
  // const promoCode = useSelector((state) => state.promoCode)
  const [promoCodeLocal, setPromoCodeLocal] = useState(null)
  const [activeStep, setActiveStep] = useState(0)
  const [completed, setCompleted] = useState({})
  const [formData, setFormData] = useState({})
  const [currentQuizData, setCurrentQuizData] = useState([])
  const [allergies, setAllergies] = useState([])
  const [retakeModeLocal, setRetakeModeLocal] = useState(false)
  const [showQuizAfterPopup, setShowQuizAfterPopup] = useState(false)
  const [loadingState, setLoadingState] = useState(false)
  const [foodIngredients, setFoodIngredients] = useState([])
  const [errorString, setErrorString] = useState("")
  const [showCoupenPopupState, setShowCoupenPopUpState] = useState(false)
  const [animatedState, setAnimatedState] = useState(true)
  const [currentRoute, setCurrentRoute] = useState("")
  const [userProfileLocal, setUserProfileLocal] = useState(null)
  const [APILoading, setAPILoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [allergyForDislikesRela, setallergyForDislikesRela] = useState(null);
  let storedData = null;
  if (typeof window !== 'undefined') {
    storedData = sessionStorage.getItem('promoCode');
  }

  useQuizTracking(formData);

  useEffect(()=>{
    if(formData?.meal_plan_start_date){
      pushToDataLayer("ending_psu_quiz");
    }
  },[formData?.meal_plan_start_date])

  useEffect(() => {
    // Check if we're running on the client (browser)
    // if (typeof window !== 'undefined') {
    //   // Retrieve session data
    //   storedData = sessionStorage.getItem('promoCode');
    console.log("storedData on mainstepper",storedData)
      if (storedData == undefined || storedData == 'undefined') {
      }else{
        setPromoCodeLocal(JSON.parse(storedData));
      }
    // }
  }, [promoCodeLocal, router?.query?.code, storedData]);

  // useEffect(() => {
  //   if (promoCode) {
  //     setPromoCodeLocal(promoCode)
  //   }
  // }, [promoCode])

  useEffect(() => {
    if (userProfile) {
      setUserProfileLocal(userProfile)
    }
  }, [userProfile])

  // //NOTE - Disturbed UI issue fix on quiz A - I
  useEffect(() => {
    if (activeStep > currentQuizData.length && currentRoute !== "thankyou" && currentQuizType == "quiz_a") {
      setActiveStep(0)
    }
  }, [activeStep])

  // const selectedDaysPerWeek = get(
  //   userProfileLocal,
  //   "guest.meal_days_per_week",
  //   0
  // )
  const selectedDaysPerWeek = userProfileLocal?.guest?.meal_days_per_week ?? 0;

  useEffect(() => {
    setRetakeModeLocal(retakeMode)
  }, [retakeMode])

  useEffect(() => {
    if (profileError) {
      setErrorString(profileError?.message)
    } else {
      setErrorString("")
    }
  }, [profileError])

  useEffect(() => {
    if (loading) {
      if (loading == "idle") {
        setLoadingState(false)
      } else if (loading == "pending") {
        setLoadingState(true)
      } else {
        setLoadingState(true)
      }
    }
  }, [loading])

  useEffect(() => {
    if (error) {
      setErrorString(error?.message)
    } else {
      setErrorString("")
    }
  }, [error])

  useEffect(() => {
    if (savedFields) {
      setFormData(savedFields)
      // AppLogger("this is saved fields==========", savedFields)
    }
  }, [savedFields])

  useEffect(() => {
    if (savedFields && !isExecutive) {
      // if(isExecutive && router.asPath == AppRoutes.quizB && activeStep > currentQuizData.length) return;
      stepOnBackStateHandler()
    }
  }, [savedFields, currentRoute])

  const stepOnBackStateHandler = () => {
    try {
      if (currentQuizType == "quiz_a" && currentRoute !== "thankyou") {
        let length = Object.keys(savedFields).length - 1

        const currentUnit = savedFields["weight_unit"]
        if (currentUnit) {
          length = length - 1
        }
        AppLogger("this is length=======", length)
        setActiveStep(length)
      } else {
        setActiveStep(0)
      }
    } catch (err) {
      AppLogger("this is error at stepOnBackStateHandler=======", err)
    }
  }
  useEffect(() => {
    try {
      if (startUpData?.allergies) {
        setAllergies(startUpData?.allergies)
      }
      if (startUpData?.food_ingredients) {
        setFoodIngredients(startUpData?.food_ingredients)
      }
    } catch (err) {
      AppLogger("Error at startUpdata", err)
    }
  }, [startUpData])

  useEffect(() => {
    if (activeIndex) {
      activeIndex(activeStep)
    }
  }, [activeStep])

  useEffect(() => {
    if (router) {
      currentRouteHandler()
    }
  }, [router])

  useEffect(() => {
    if (!common) {
      if (questions?.length > 0) {
        populateAnswers()
      }
    } else {
      if (commonQuestions?.length > 0) {
        populateCommon()
      }
    }
  }, [questions, commonQuestions])

  useEffect(() => {
    showPopUpHandler()
  }, [activeIndex])

  const showAfterQuizPopupHandler = () => {
    showAfterQuizPopup()
  }
  const postProfileRequestHandler = (values) => {
    setAPILoading(true)
    try {
      const { auth_token } = userDetails?.data
      var data
      const pausedates = []

      if (values.hasOwnProperty("meal_plan_pause_date")) {
        data = {
          ...values,
          meal_plan_pause_date:
            values.meal_plan_pause_date.length > 0
              ? values?.meal_plan_pause_date?.map((date) => {
                AppLogger("THIS IS DAYYYYYY+==========", `${date}`)
                const [day, month, year] = date.split(".")
                return `${day}/${month}/${year}`
              })
              : [],
          is_executive: isExecutive
        }
      } else {
        data = {
          ...values,
          is_executive: isExecutive
        }
      }
      AppLogger("values", data)

      dispatch(PostProfileRequest({ formData: data, token: auth_token }))
        .then(unwrapResult)
        .then((res) => {
          AppLogger("Response at PostProfileRequest", res)
          if (currentQuizType !== "quiz_preference") {
            router.push(AppRoutes.result)
          } else {
            showAfterQuizPopupHandler()
            handleClose()
            if (values.hasOwnProperty("allergy")) {
              const currentAllergyIndex = values?.allergy?.findIndex(
                (val) => val == "Talk to our Team"
              )
              if (currentAllergyIndex !== -1) {
                showAfterQuizPopupHandler()
              }
            }
            // router.push(AppRoutes.dashboard)
          }
          setAPILoading(false)
        })
        .catch((err) => {
          setAPILoading(false)
          AppLogger("Error at PostProfileRequest", err)
        })

    } catch (err) {
      AppLogger("Error at postProfileRequestHandler", err)
      setAPILoading(false)
    }
  }

  //
  const postQuizRequestHandler = (values) => {
    var data = {
      ...formFields,
      ...values,
      quiz_type: currentQuizType ? currentQuizType : "",
      // promo_code: promoCodeLocal ?? null
      promo_code: '',
      is_executive: isExecutive
    }
    dispatch(postQuizRequest({ quizData: data }))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at postQuizRequest", res)
        saveFieldsHandler(data)
        if (res) {
          if (currentQuizType !== "quiz_preference") {
            // router.push(AppRoutes.result)
            router.push(AppRoutes.result)
          } else {
            // if()
          }
        } else {
          router.push(AppRoutes.dashboard)
        }
      })
      .catch((err) => {
        AppLogger("Error at postQuizRequest", err)
      })
  }

  const populateAnswers = () => {
    const data = []

    for (let i = 0; i < questions.length; i++) {
      const element = questions[i]
      let elementData = { ...element, [element.key]: "" }

      data.push(elementData)
    }
    setCurrentQuizData(data)
  }

  const handleAllegeries = (fieldToUpdate, value) => {
    const values = { ...formData, [fieldToUpdate]: value }
    setFormData({ ...formData, [fieldToUpdate]: value })
    handleNext(values)
  }
  const populateCommon = () => {
    const data = []

    for (let i = 0; i < commonQuestions.length; i++) {
      const element = commonQuestions[i]
      let elementData = { ...element, [element.key]: "" }

      data.push(elementData)
    }
    setCurrentQuizData(data)
  }

  const totalSteps = () => {
    return currentQuizData.length
  }

  const completedSteps = () => {
    return Object.keys(completed).length
  }

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps()
  }

  const handleQuizAMidRequest = (values) => {
    dispatch(saveQuizFields(values))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at saveQuizFields", res)
        if (currentQuizType === "quiz_b") {
          postQuizRequestHandler(values)
        } else {
          callCommonQuizRequst(values)
        }
      })
      .catch((err) => {
        AppLogger("Error at saveQuizFields", err)
      })
  }
  console.log("isExecutive",isExecutive)
  const Executive = isExecutive ? 1 : 0
  const callCommonQuizRequst = (values) => {
    try{
      const quizData = {
        average_meals_day: values["average_meals_day"],
        average_snacks_day: values["average_snacks_day"]
      }

       const cacheKey = `quiz?${JSON.stringify(quizData)}`;
       const cachedData = getCache(cacheKey);
          
       if (cachedData) {
         router.push(AppRoutes.thankyou)
         AppLogger("Serving from cache", cachedData);
         return;
        }
      
      dispatch(getCommonQuizQuestions({ quizData, Executive }))
        .then(unwrapResult)
        .then((res) => {
          setCache(cacheKey, res?.data?.data, 1, AppConstants.CacheTime.hour); // Cache for 5 minutes
          router.push(AppRoutes.thankyou)
          AppLogger("Response at getCommonQuizQuestions", res)
        })
        .catch((err) => {
          AppLogger("Error at getCommonQuizQuestions", err)
        })

    }catch(err){console.log("err",err)}
  }

  const saveFieldsHandler = (values) => {
    dispatch(saveQuizFields(values))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at saveQuizFields", res)
      })
      .catch((err) => {
        AppLogger("Error at saveQuizFields", err)
      })
  }
  const handleNext = (values) => {


    if (activeStep == currentQuizData.length - 1) {
      if (common) {
        if (values?.weight && values?.weight_unit == "lbs") {
          values = { ...values, weight: Math.round(values.weight / 2.205) ,is_executive: isExecutive}
        }
        postQuizRequestHandler(values)
      } else if (currentQuizType == "quiz_preference") {
        if (retakeModeLocal) {
          retakeQuizHandler(values)
        } else {
          const breakFastValue = values?.exclude_breakfast;
          postProfileRequestHandler({ ...values, exclude_breakfast: breakFastValue == AppConstants.yes ? 0 : 1 })
        }
      } else {
        handleQuizAMidRequest(values)
      }
    } else {
      setAnimatedState(false)
      customTimeout(
        () => {
          setActiveStep(activeStep + 1)
          setAnimatedState(true)
        },
        currentQuizType == "quiz_preference" ? 0 : 300
      )
    }
  }

  const currentRouteHandler = () => {
    const currentRoutee = router.pathname.split("/")[1]
    setCurrentRoute(currentRoutee)
  }
  const handleBack = () => {
    // if()

    if (currentRoute == "thankyou" && activeStep == 0) {
      if (isExecutive) {
        router.push(AppRoutes.quizB)
      } else {
        router.push("/")
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }
  }

  const handleCurrentDataExistHandler = (key) => {
    const currentIndex = currentQuizData.findIndex((val) => val.key == key)
    if (currentIndex !== -1) {
      if (formData.hasOwnProperty(key)) {
        return true
      } else {
        return false
      }
    }
  }
  const handleStep = (step) => () => {
    try {
      const currentStepData = currentQuizData[step]
      const next = currentQuizData[step - 1]
      AppLogger("This is current step daa======", next)
      const currentStep = [currentStepData.key]
      if (next) {
        var nextStep = [next.key]
      }
      AppLogger("this is data========", currentStep)
      const exists = handleCurrentDataExistHandler(currentStep)
      const pastExist = handleCurrentDataExistHandler(nextStep)
      if (currentStep[0] == "") {
        return
      } else {
        if (exists) {
          setActiveStep(step)
        } else if (pastExist) {
          setActiveStep(step)
        } else {
          return
        }
      }
    } catch (err) {
      AppLogger("Error at handle step========", err)
    }
  }

  const handleDisableSteps = (step) => {
    try {
      const stepData = currentQuizData[step];
      const isStepDataValid = stepData && formData.hasOwnProperty(stepData.key) && formData[stepData.key];
      return !isStepDataValid;
    } catch (error) {
      AppLogger("Error at handleDisableSteps =>", error);
    }
  };

  const handleReset = () => {
    setActiveStep(0)
    setCompleted({})
  }

  useEffect(() => {
    AppLogger("this is formdata=====", formData)
  }, [formData])

  const handleData = (input, value) => {
    // console.log("first")
    setAnswer({
      input: input, value: value
    })
    // if (isExecutive && input === AppConstants.meals.meal_days_per_week && value == AppConstants.yes) {
    if (isExecutive && input === AppConstants.meals.meal_days_per_week && value == AppConstants.yesConfirm) {
      value = 5
      handleBadgeNextQuest(input, value)
      // } else if (isExecutive && value == AppConstants.no && input == AppConstants.meals.meal_days_per_week) {
    } else if (isExecutive && value == AppConstants.noConfirm && input == AppConstants.meals.meal_days_per_week) {

      setOpenModal(true)
    }

    if (input !== AppConstants.meals.meal_days_per_week || !isExecutive) {
      handleBadgeNextQuest(input, value)
    }
  }

  const handleBadgeNextQuest = (input = "", value = "") => {
    setAnimatedState(false)
    setFormData((prevState) => ({
      ...prevState,
      [input]: value
    }))
    const values = { ...formData, [input]: value }
    setFormData({ ...formData, [input]: value })
    handleNext(values)
  }

  const handleInputData = (input) => (e) => {
    console.log("clicking")
    setAnimatedState(false)
    const { value } = e.target
    const values = { ...formData, [input]: value,is_executive: isExecutive}
    setFormData({ ...formData, [input]: value })

    if (currentQuizType == "quiz_b" && activeStep == 1) {
      postQuizBMidRequest(values)
    } else {
      handleNext(values)
    }
  }

  const handleKeyUpdateOnly = (key, val) => {
    console.log("check handleKeyUpdateOnly", key, val);
    setFormData({ ...formData, [key]: val })
  }
  const handleCheck = (key, val) => {
    console.log("check 123", key, val);
    setAnimatedState(false)
    // const { value } = e.target
    const values = { ...formData, [key]: val }
    setFormData({ ...formData, [key]: val })
    if (currentQuizType == "quiz_b" && activeStep == 1) {
      postQuizBMidRequest(values)
    } else {

      handleNext(values)
    }
  }

  useEffect(() => {
    if (activeStep == 2) {
      setFormData({
        ...formData,
        meal_plan_pause_date: [],
        meal_plan_start_date: null,
        meal_plan_end_date: null
      })
    }
  }, [activeStep])

  const retakeQuizHandler = (data) => {
    const { auth_token } = userDetails?.data
    var quizData = {}
    if (data.hasOwnProperty("meal_plan_pause_date")) {
      quizData = {
        ...data,
        meal_plan_pause_date:
          data.meal_plan_pause_date.length > 0
            ? data?.meal_plan_pause_date?.map((date) => {
              AppLogger("THIS IS DAYYYYYY+==========", `${date}`)
              const [day, month, year] = date.split(".")
              return `${day}/${month}/${year}`
            })
            : [],
        is_executive: isExecutive
      }
    } else {
      quizData = {
        ...data
      }
    }

    dispatch(retakeQuizRequest({ token: auth_token, quizData }))
      .then(unwrapResult)
      .then((res) => {
        showAfterQuizPopupHandler()
        AppLogger("Response at retakeQuizHandler=====", res)
      })
      .catch((err) => {
        AppLogger("Error at retakeQuizHandler=====", err)
      })
  }

  const onDatePressHandler = (
    fieldToUpdate,
    startDate,
    fieldToUpdate2,
    pauseDates,
    fieldToUpdate3,
    renewalDate
  ) => {
    const values = {
      ...formData,
      [fieldToUpdate]: startDate,
      [fieldToUpdate2]: pauseDates,
      [fieldToUpdate3]: renewalDate
    }
    setFormData({
      ...formData,
      [fieldToUpdate]: startDate,
      [fieldToUpdate2]: pauseDates,
      [fieldToUpdate3]: renewalDate
    })
    handleNext(values)
  }

  const onWeightPressHandler = (fieldToUpdate, value, fieldToUpdate2, unit) => {
    setFormData({
      ...formData,
      [fieldToUpdate]: value,
      [fieldToUpdate2]: unit
    })
    const values = {
      ...formData,
      [fieldToUpdate]: value,
      [fieldToUpdate2]: unit
    }
    handleNext(values)
  }

  const postQuizBMidRequest = (values) => {
    dispatch(quizBMidRequest({ quizData: values }))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at quizBMidRequest", res)
        const data = [...currentQuizData]
        const currentIndex = data.findIndex(
          (val) => val.key == res?.data?.data?.key
        )

        if (currentIndex !== -1) {
          data[currentIndex] = {
            ...data[currentIndex],
            options: res?.data?.data?.options
          }
        }
        setCurrentQuizData(data)
        handleNext(values)
      })
      .catch((err) => {
        AppLogger("Error at quizBMidRequest", err)
      })
  }

  useEffect(() => {
    if (selectedDaysPerWeek == 7) {
      setFormData({
        ...formData,
        days_food_delivery: ["Mon", "Tues", "Weds", "Thur", "Fri", "Sat", "Sun"]
      })
    }
  }, [selectedDaysPerWeek])

  useEffect(() => {
    if (isExecutive) {
      setFormData({
        ...formData,
        days_food_delivery: ["Mon", "Tues", "Weds", "Thur", "Fri"]
      })
    }
  }, [isExecutive])
  console.log("values,",formData)
  const renderComponent = (component) => {
    if (component.type == "icon") {
      console.log(component.type)
      return (
        <Options
          animatedState={animatedState}
          question={component?.question}
          fieldToUpdate={component?.key}
          description={component?.description}
          options={component?.options}
          handleFormData={handleInputData}
          values={formData}
        />
      )
    } else if (component.type == "rating") {
      return (
        <Rating
          animatedState={animatedState}
          fieldToUpdate={component?.key}
          question={component?.question}
          description={component?.description}
          options={component?.options}
          handleFormData={handleInputData}
          values={formData}
          handleCheck={handleCheck}
          handleKeyUpdateOnly={handleKeyUpdateOnly}
          quizType={quizType}
        />
      )
    } else if (component.type == "counter") {
      console.log(component.type)
      return (
        <Counter
          animatedState={animatedState}
          fieldToUpdate={component?.key}
          question={component?.question}
          description={component?.description}
          options={component?.options}
          defaultUnit={component?.default_unit}
          handleFormData={handleData}
          handleWeightData={onWeightPressHandler}
          values={formData}
        />
      )
    } else if (component.type == "badge") {
      console.log(component.type)
      return (
        <Badge
          animatedState={animatedState}
          fieldToUpdate={component?.key}
          question={component?.question}
          description={component?.description}
          popular={component?.most_popular}
          label={component?.most_popular_text}
          options={component?.options}
          defaultUnit={component?.default_unit}
          handleFormData={handleData}
          handleKeyUpdateOnly={handleKeyUpdateOnly}
          values={formData}
          quizType={quizType}
        // handleCheck={handleData}
        />
      )
    } else if (component.type == "badge_boolean") {
      console.log(component.type)
      return (
        <Chip
          animatedState={animatedState}
          bool
          fieldToUpdate={component?.key}
          question={component?.question}
          description={component?.description}
          options={component?.options}
          defaultUnit={component?.default_unit}
          handleFormData={handleInputData}
          values={formData}
          allergyForDislikesRela={allergyForDislikesRela}
          setallergyForDislikesRela={setallergyForDislikesRela}
        />
      )
    } else if (component.type == "badge_multiselect") {
      return (
        <Chip
          loading={APILoading}
          animatedState={animatedState}
          fieldToUpdate={component?.key}
          question={component?.question}
          description={component?.description}
          options={component?.options}
          defaultUnit={component?.default_unit}
          handleFormData={handleAllegeries}
          values={formData}
          allergies={allergies ?? []}
          allergyForDislikesRela={allergyForDislikesRela}
          setallergyForDislikesRela={setallergyForDislikesRela}
        />
      )
    } else if (component.type == "dropdown_multiselect") {
      return (
        <MultiSelect
          animatedState={animatedState}
          fieldToUpdate={component?.key}
          question={component?.question}
          description={component?.description}
          options={foodIngredients}
          defaultUnit={component?.default_unit}
          handleFormData={handleAllegeries}
          values={formData}
          allergyForDislikesRela={allergyForDislikesRela}
          setallergyForDislikesRela={setallergyForDislikesRela}
        />
      )
    } else if (component.type == "multiple_dates") {
      return (
        <Date
          loading={APILoading}
          animatedState={animatedState}
          fieldToUpdate={component?.key}
          question={component?.question}
          description={component?.description}
          options={foodIngredients}
          fieldToUpdate2={component?.alternate_key}
          fieldToUpdate3={"meal_plan_end_date"}
          defaultUnit={component?.default_unit}
          handleFormData={onDatePressHandler}
          values={formData}
          alternative_tool_tip={
            currentQuizData[activeStep]?.alternative_tool_tip ?? ""
          }
        />
      )
    } else if (component.type == "badge_circle_multiselect") {
      return (
        <BadgeMultiSelect
          animatedState={animatedState}
          fieldToUpdate={component?.key}
          question={component?.question}
          description={component?.description}
          options={component?.options}
          defaultUnit={component?.default_unit}
          handleFormData={handleAllegeries}
          values={formData}
          // openModalforDayConfirm={openModalforDayConfirm}
          // setOpenModalforDayConfirm={setOpenModalforDayConfirm}
          changeFormData={(e) => {
            setFormData(e)
          }}
        />
      )
    }
  }

  function getStepContent(activeIndex) {
    if (typeof activeIndex === "number") {
      return currentQuizData.map((element, index) => {
        if (index == activeIndex) {
          return (
            <div key={index} className={`QuizWrapped  ${isExecutive ? 'isExecutive' : ''}`}            >
              {loadingState ? <SkeletonComp isExecutive={isExecutive} /> : renderComponent(element)}
            </div>
          )
        } else {
          return null
        }
      })
    }
  }

  const showPopUpHandler = () => {
    if (!common && currentQuizType !== "quiz_preference") {
      if (activeStep == 3 && !showCoupenPopupState) {
        // setShowPopUp(true)
        if (formData.hasOwnProperty("email")) {
          return
        } else {
          dispatch(setshowCoupenPopupStateFromApp(true))
          setShowCoupenPopUp(true)
          setShowCoupenPopUpState(true)
        }
      }
    }
  }
  const matches = useMediaQuery("(max-width:1441px)")

  const disableHandler = () => {
    if (currentRoute == "thankyou" && activeStep === 0) {
      return false
    } else if (activeStep === 0) {
      return true
    }
  }
  const handleClose2 = (event, reason) => {
    if (reason !== "backdropClick") {
      dispatch(setshowCoupenPopupStateFromApp(false))
      setShowCoupenPopUp(false)
    }

    // setOpen(false)
  }

  const handleOk = () => {
    window.location.href = AppConstants.domain;
  }
  const DoesPathIncludes = router?.pathname?.includes(AppRoutes.dashboard || AppRoutes.login)


  useEffect(() => {
  // On mount, mark hydration complete
  setHasHydrated(true);

  // If modal was open from persisted Redux, close it once on first load
  if (showCoupenPopupStateFromApp) {
    dispatch(setshowCoupenPopupStateFromApp(false));
  }
  }, []);
  
  useEffect(() => {
  if (hasHydrated) {
    setShowCoupenPopUp(showCoupenPopupStateFromApp);
  }
  }, [showCoupenPopupStateFromApp, hasHydrated]);
  
  useEffect(() => {
  // Cleanup on unmount
  return () => {
    dispatch(setshowCoupenPopupStateFromApp(false));
    setShowCoupenPopUp(false);
  };
  }, []);
  
  return (
    <Box
      sx={{ width: "100%",overflow:'hidden' }}
      // className={quizType === "quiz_1A" ? "quiz1A" : ""}
      className={
        quizType && quizType == "quiz_1A"
          ? "quiz1A"
          : quizType == "quiz_b"
            ? "quiz_b"
            : quizType == "quiz_a"
              ? "quiz_a"
              : null
      }
    >
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        className={`infoPop${isExecutive ? " isExecutive" : ""}`}
      >
        <DialogTitle
          // variant="h2"
          sx={{
            textAlign: "center",
            lineClamp: "3",
            color: AppColors.primaryOrange,
            padding: "50px 50px 0 50px",
            marginBottom: "25px",
          }}
        >

          {/* For more flexibility please visit our site practical.me */}
          {/* Executive only offers 5 days a week for more flexibility visit our site */}
          For any questions just click the whatsapp icon at the bottom of this page and we will come back to you asap.

        </DialogTitle>
        <DialogContent sx={{ padding: "0 50px 50px 50px", display: 'flex', justifyContent: 'end', flexDirection: { xs: 'column', sm: 'row' } }}>

          <Button className="marginBottomMobile10"
            sx={{
              paddingLeft: 20, paddingRight: 20, color: `${AppColors.white} !important`,
              ":hover":
                isExecutive && {
                  color: `${AppColors.primaryOrange} !important`,
                  backgroundColor: `${AppColors.lightOrange} !important`,
                  borderColor: `${AppColors.primaryOrange} !important`,
                }

            }} onClick={() => {
              setOpenModal(false)
              handleBadgeNextQuest(answer?.input, 5)

            }}>
            {/* backgroundColor:'transparent',border:'1px solid #119a77' */}
            {/* <Typography sx={{ textTransform:'capitalize',color:'white',
 ":hover": {
  color: `${AppColors.primaryOrange} !important`,
 }

          }}> */}
            {/* color:'#119a77' */}
            {/* OK, lets continue */}
            Continue
            {/* </Typography> */}
          </Button>
          {/* <Button style={{ paddingLeft: 20, paddingRight: 20 }} onClick={handleOk}>
          <Typography style={{ color: "white" ,textTransform:'capitalize'}}>
          Show me Full Meal Plan
          </Typography>
        </Button> */}
        </DialogContent>
        <Button className="crossButton" sx={{
          color: isExecutive && `${AppColors.primaryOrange} !important`,

        }} onClick={() => setOpenModal(false)}>
          x
        </Button>
      </Dialog>
      {/* {loading === "pending" && <Loader2 />} */}
      {!isExecutive && !promoCodeLocal &&
        <ThankyouPop
          isExecutive={isExecutive}
          setEmail={(email) => setFormData({ ...formData, email: email })}
          open={showCoupenPopup && !DoesPathIncludes }
          // open={showCoupenPopupStateFromApp && !DoesPathIncludes }
          handleClose={handleClose2}
        />}
      <div className={`stepWrapper ${isExecutive ? 'isExecutive' : ''}`}>
        <Button
          className={`backStep ${isExecutive ? 'isExecutiveBtn' : ''}`}
          color="inherit"
          disabled={disableHandler()}
          onClick={handleBack}
          sx={{
            mr: 1,
            "&:hover": {
              backgroundColor: "#cfebe4 !important"
            }
          }}
        >
          <img
            className="white"
            src={
              matches
                ? AppDataConstant.backarrowWhite
                : AppDataConstant.backarrowWhiteLG
            }
          />
          <img
            className="green"
            src={
              matches
                ? AppDataConstant.backarrowGreen
                : AppDataConstant.backarrowGreenLG
            }
          />
          {/* {isExecutive &&   <img
            className="orange"
            src={
              matches
                ? AppDataConstant.backarrowOrange
                : AppDataConstant.backarrowOrangeLG
            }
          />} */}
        </Button>
        <Stepper  nonLinear activeStep={activeStep}>
          {currentQuizData.map((label, index) => {
            return (

              <Step key={index} completed={completed[index]}>

                <StepButton
                  aria-label={index}
                  color="inherit"
                  disabled={handleDisableSteps(index)}
                  onClick={handleStep(index)}
                ></StepButton>
                {currentQuizData[activeStep]?.tool_tip ? (
                  <Tooltip
                    leaveTouchDelay={10000000}
                    disableTouchListener={false}
                    enterTouchDelay={50}
                    componentsProps={{
                      popper: {
                        className: `${isExecutive ? 'isExecutive' : ''}`,
                      },
                    }}
                    className={`toolTip ${isExecutive ? 'isExecutive' : ''}`}
                    title={
                          <span
                             dangerouslySetInnerHTML={{
                               __html:
                                 activeStep == 4 && router.asPath == "/quicksignup"
                                   ? currentQuizData[activeStep]?.alternative_tool_tip || ""
                                   : currentQuizData[activeStep]?.tool_tip || ""
                             }}
                           />
                      // activeStep == 4 && router.asPath == "/quicksignup"
                      //   ? ReactHtmlParser(
                      //     currentQuizData[activeStep]?.alternative_tool_tip
                      //   )
                      //   : ReactHtmlParser(currentQuizData[activeStep]?.tool_tip)
                    }
                    placement="top"
                    arrow

                  >

                    <Button>
                      <span>i</span>
                    </Button>
                  </Tooltip>
                ) : null}
              </Step>
            )
          })}
          {/* <Button
          className="toolTip"
          sx={{
            color: AppColors.white,
            width: "17px",
            height: "17px",
            borderRadius: "50px",
            minWidth: "17px",
            textTransform: "lowercase"
          }}
        >
          i
        </Button> */}
        </Stepper>
      </div>
      {errorString !== "" && (
        <p
          style={{
            textAlign: "center",
            color: AppColors.red,
            fontWeight: "bold"
          }}
        >{`Error:${errorString}`}</p>
      )}
      <ThankyouLG
        open={showQuizAfterPopup}
        handleClose={() => setShowQuizAfterPopup(false)}
        handleClickOpen={() => setShowQuizAfterPopup(true)}
      />
      <div className="quizBox" >
        {/* {allStepsCompleted() ? ( */}
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography
              sx={{ mt: 2, mb: 1, textAlign: "center", margin: "70px 0" }}
            >
              No Incoming data for Quiz
            </Typography>
            {/* <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box> */}
          </React.Fragment>
        ) : (
          <React.Fragment>{getStepContent(activeStep)}</React.Fragment>
        )}
      </div>

      {/* <PopUpConfirmDays
        openModalforDayConfirm={openModalforDayConfirm}
        isExecutive={isExecutive}
        AppColors={AppColors}
        setOpenModal={setOpenModalforDayConfirm}
        handleBack={handleBack}
        formData={formData}
      /> */}
    </Box>
  )
}

MainStepper.propTypes = {
  activeIndex: PropTypes.any,
  common: PropTypes.any
}
export default MainStepper
