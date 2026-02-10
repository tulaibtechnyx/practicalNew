import React, { useState, useEffect } from "react"
import { Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Box } from "@mui/material"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
import { Animated } from "react-animated-css"
import { useSelector } from "react-redux"
import CustomConfirmationModal from '../custom-confirmation-modal';
import AppConstants from "helpers/AppConstants"
import AppColors from "@helpers/AppColors"
import BoxWithDiscountPromo from "../BoxWithDiscountPromo"
import { getQuestionAndDescription } from "@helpers/CommonFunc"
import ReactHtmlParser from "react-html-parser"
import { useRouter } from "next/router"
const PerDayMeals = ({
  handleFormData,
  options,
  fieldToUpdate,
  question,
  description,
  defaultUnit,
  values,
  popular,
  label,
  animatedState,
  quizType=''

}) => {
  const { isExecutive } = useSelector((state) => state.auth)
  const [value, setValue] = useState(null)
  const [openPopup, setOpenPopup] = useState(false) // State for dialog popup
  const [newValue, setNewValue] = useState(null)
  const [currentValue, setCurrentValue] = useState(null);
    const { decorationQuizData } = useSelector((state) => state.homepage);

  // const promoDetails = useSelector((state) => state.promoCodeDetail.data);
  const [promoDetails,setpromoDetails]=useState(null)
  const AllDays = [ 5, 6, 7];
  const AllWeeks = [ 1, 2, 4 ]
  const hasAllDays =(key) => AllDays?.every(num => key?.includes(num));
  const hasAllWeek =(key) => AllWeeks?.every(num => key?.includes(num));
  const meal_days_per_week = "meal_days_per_week";
  const meal_plan_require_weeks = "meal_plan_require_weeks";
  const isDays = fieldToUpdate === meal_days_per_week;
  const isWeeks = fieldToUpdate === meal_plan_require_weeks;
 


  useEffect(() => {
    // Check if we're running on the client (browser)
    if (typeof window !== 'undefined') {
      // Retrieve session data
      let storedData = sessionStorage.getItem('promoDetails');
      storedData = JSON.parse(storedData)
      if (storedData) {
        setpromoDetails(storedData?.data ? storedData?.data :storedData )
      }
    }
  }, [promoDetails?.id]);

  const { days, length_plan_weeks } = promoDetails || {};
  // let totalDays = days || null
  console.log("length_plan_weeks",length_plan_weeks)
  let totalDays = days || null; // Ensure totalDay has a default value if it's undefined
  let totalWeeks = length_plan_weeks || null;

  if (totalDays === "All" || hasAllDays(days) ) {
    // totalDays = 7;
    totalDays = AllDays;
  }
  if (totalWeeks === "All" || hasAllWeek(length_plan_weeks) || length_plan_weeks?.length == 0) {
    // totalWeeks = 4;
    totalWeeks = AllWeeks;
  }
  
  const defaultValue = (() => {
    switch (fieldToUpdate) {
      case "meal_days_per_week":
        return totalDays != null ? totalDays.toString() : "";
      case "meal_plan_require_weeks":
        return totalWeeks != null ? totalWeeks.toString() : "";
      default:
        return null;
    }
  })();

  const isDiscountApplicable = () => {
    const applicableKeys = {
      "meal_days_per_week": days !== 'All' || !hasAllDays(days),
      "meal_plan_require_weeks": length_plan_weeks !== 0|| !hasAllWeek(length_plan_weeks),
    };

    return fieldToUpdate && applicableKeys[fieldToUpdate] !== undefined ? applicableKeys[fieldToUpdate] : false;
  };

  const handleChange = (event) => {
    console.log("event",event)
    // const selectedValue = event.target.value
    const selectedValue = isExecutive ? fieldToUpdate === "meal_plan_require_weeks" ? event : 
    fieldToUpdate ===  'calories_meal_require_per_day' ? event.target.value :
    event.target.value : typeof event == 'number' ? event : Number(event.target.value);
    if (promoDetails && Object.keys(promoDetails).length > 0 && isDiscountApplicable()) {
      // if ((fieldToUpdate === "meal_days_per_week" && selectedValue !== totalDays.toString()) || (fieldToUpdate === "meal_plan_require_weeks" && selectedValue !== totalWeeks.toString())) {
      if ((fieldToUpdate === "meal_days_per_week" && !totalDays?.includes(Number(selectedValue))) || (fieldToUpdate === "meal_plan_require_weeks" && !totalWeeks?.includes(Number(selectedValue)))) {

        setNewValue(selectedValue); // Store new value before confirming
        if(selectedValue ==AppConstants.yesConfirm || selectedValue ==AppConstants.noConfirm ){
          handleFormData(fieldToUpdate, selectedValue); // Use selectedValue directly in handleCheck
        }else{
          setOpenPopup(true); // Open popup if user selects a value that differs from promo code
        }
      } else {
        setValue(selectedValue); // Update state value
        handleFormData(fieldToUpdate, selectedValue); // Use selectedValue directly in handleCheck
        console.log("handleCheck called within handleChange");
      }
    } else {
      // If promoDetails are not available, just set the value without any popup
      setValue(selectedValue);
      handleFormData(fieldToUpdate, selectedValue); // Trigger handleCheck immediately

    }
  }
  // Handle confirmation dialog
  const handleConfirmChange = () => {
    setValue(newValue) // Set the new value after confirming
    handleFormData(fieldToUpdate, newValue); // Trigger handleFormData after confirmation
    setOpenPopup(false) // Close the popup
  }

  // Handle canceling the change
  const handleCancelChange = () => {
    setOpenPopup(false) // Close the popup and keep the previous selection

    // if (promoDetails && Object.keys(promoDetails).length > 0) {
    //   if (fieldToUpdate === "meal_days_per_week") {
    //     setValue(totalDays); // Reset the value to the promo details value
    //     handleFormData(fieldToUpdate, totalDays); // Update form with promo value
    //   } else if (fieldToUpdate === "meal_plan_require_weeks") {
    //     setValue(totalWeeks); // Reset the value to the promo details value
    //     handleFormData(fieldToUpdate, totalWeeks); // Update form with promo value
    //   } else {
    //     setValue(value); // Revert to the last selected value
    //     handleFormData(fieldToUpdate, value); // Trigger form update with the last value
    //   }
    // } else {
    //   // No promoDetails available, revert to the last selected value
    //   setValue(value);
    //   handleFormData(fieldToUpdate, value);
    // }
  }
  // const handleChange = (event) => {
  //   setValue(event.target.value)
  // }

  const getDefaultUnit = (value, unit) => {

    if (value && unit) {
      if (value === 1) {
        return 0
      } else if (unit.length > 1) {
        return 1
      } else {
        return 0
      }
    } else {
      return 0
    }
  }
  const handleCurrentValue = (val) => {
    setCurrentValue(val)
    console.log({ val })
  }
   const isInArray = (array, value) => {
    return Array.isArray(array) && array.includes(String(value));
  }
   const oldQuesAndDesc = {question: question,description: description};
    const questionAndDescription =decorationQuizData?.showDecoration && fieldToUpdate != 'calories_meal_require_per_day'?  getQuestionAndDescription(decorationQuizData?.decorationArray , fieldToUpdate) : oldQuesAndDesc
  
    const router = useRouter();
    const isThank = router.pathname == '/thankyou';
    console.log("isThank",isThank)
  return (
    <div className={styles.quizSelection}>
      <div className="container container--custom">
        <div className="animatedWrapper">
          <Animated
            animationIn="fadeInRight"
            animationOut="fadeOutLeft"
            animationInDuration={500}
            animationOutDuration={500}
            isVisible={animatedState}
          >
            <Typography variant={"h2"} className={styles.quizTitle}>
              {questionAndDescription?.question}
            </Typography>
            <Typography
              variant={"body3"}
              component="p"
              className={styles.quizPara}
              sx={{marginBottom:'0px !important'}}
            >
              {ReactHtmlParser(questionAndDescription?.description)}
            </Typography>
            {/* {isExecutive && defaultUnit?.length == 0 &&
              < Typography
                className={styles.noNote}
              >
                {"If no take me to PractiCal as I want more flexibility"}
              </Typography>
            } */}
             {
              promoDetails && (isWeeks || isDays) ?
              quizType == AppConstants.quizTypes.quiz_a ? "":
              isDays && hasAllDays(days)  ? "" :
              isWeeks && hasAllWeek(length_plan_weeks) ? "" :
              <Typography  sx={{  maxWidth :'100% !important' ,textAlign:'center', fontSize:{md: '18px',xs:'12px'}, color:AppColors.darkGrey,p:'0px !important', minHeight:'0px !important',mb:'10px'}}>
                *Discount is only available on the highlighted option.
              </Typography>
              : ""
            }
            <div className={`quizQuestion--sty2 rounded ${isExecutive ? "quizQuesExecutive" : ""}`} style={{
              marginTop: isThank ? '20px' : '0px',
            }}>
              {
                decorationQuizData  && fieldToUpdate != 'calories_meal_require_per_day' && !(fieldToUpdate == 'meal_days_per_week' && isExecutive)?
                <BoxWithDiscountPromo
                  promoDetails={promoDetails}
                  fieldToUpdate={fieldToUpdate}
                  options={options}
                  question={question}
                  values={values}
                  value={value}
                  onChange={handleChange}
                  isDiscountApplicable={isDiscountApplicable}
                  defaultValue={defaultValue}
                  AllArrayMeal={AllWeeks}
                  AllArraySnack={AllDays}
                  hasAllOption1={hasAllWeek}
                  hasAllOptions2={hasAllDays}
                  typeofMeal1={length_plan_weeks}
                  typeofMeal2={days}
                  isInArray={isInArray}
                  tabbyCondition={values?.meals_deliver_per_day == 1 }
                />
                :
             
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={value}
                  onChange={handleChange}
                >
                  {options.map((val, i) => (
                    <>
                      {/* {
                       popular == val ? (

                     <Typography 
                     sx={{flex:1}}
                       variant="body3"
                       component={"p"}
                       className={`mostPopular ${isExecutive ? "isChipTypeExecutive" : ""}`}
                     >
                       {label ?? ""}
                     </Typography>
                   ) : (
                     ""
                   )
                    } */}
                      <FormControlLabel
                        // sx={{bgcolor:'red'}}
                        key={i}
                        value={val}
                        // onClick={() => handleFormData(fieldToUpdate, val)}
                        // onClick={()=>handleCurrentValue(val)}
                        label={
                          <Box sx={
                            (val == AppConstants?.noConfirm || val == AppConstants.yesConfirm ) && {
                            fontSize:{ xs:'10px', sm:'11px', md:'17px', lg:'19px' }
                          }}
                          >   

                            {val +
                              (defaultUnit?.length > 0
                                ? " " + defaultUnit[getDefaultUnit(val, defaultUnit)]
                                : "")}
                            {
                              popular == val ? (

                                <Typography
                                  sx={{ flex: 1 }}
                                  variant="body3"
                                  component={"p"}
                                  className={`mostPopular ${isExecutive ? "isChipTypeExecutive" : ""}`}
                                >
                                  {label ?? ""}
                                </Typography>
                              ) : (
                                ""
                              )
                            }
                          </Box>
                        }
                        control={
                          <Radio
                            className={`${values[fieldToUpdate] == val || (defaultValue === val && isDiscountApplicable()) ? "Mui-checked" : ""}
                            ${isExecutive ? "isChipTypeExecutive" : ""} 
                            ${isDays &&  values[fieldToUpdate] != val && !hasAllDays(days) && isInArray(defaultValue?.split(','), val) ? " highlighted" : ""}
                            ${isWeeks && values[fieldToUpdate] != val &&  !hasAllWeek(length_plan_weeks) && isInArray(defaultValue?.split(','), val) ? " highlighted" : ""} 
                            `}
                          />
                        }
                      // label={
                      //   val + " " + defaultUnit[getDefaultUnit(val, defaultUnit)]
                      // }
                      />
                    </>
                  ))}
                </RadioGroup>
              </FormControl>

                }
            </div>
           
          </Animated>

        </div>
      </div>
      <CustomConfirmationModal
        open={openPopup}
        handleCancel={handleCancelChange}
        handleConfirm={handleConfirmChange}
        modalTitle="Plan Change"
        modalDescription="Please note that changing your plan may affect your current discount. Depending on the new plan, you could either gain or lose the discount amount."
      />
    </div>
  )
}

PerDayMeals.propTypes = {
  values: PropTypes.any,
  value: PropTypes.any,
  handleFormData: PropTypes.func,
  options: PropTypes.array,
  fieldToUpdate: PropTypes.string,
  question: PropTypes.string,
  description: PropTypes.string,
  defaultUnit: PropTypes.array
}
export default PerDayMeals