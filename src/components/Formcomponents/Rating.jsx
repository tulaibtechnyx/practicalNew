import React, { useState, useEffect } from "react"
import { Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Box, useMediaQuery } from "@mui/material"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
import { Animated } from "react-animated-css"
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser"
import CustomConfirmationModal from '../custom-confirmation-modal';
import { useSelector } from "react-redux"
import AppColors from "@helpers/AppColors"
import AppConstants from "@helpers/AppConstants"
import BoxWithDiscountPromo from '../BoxWithDiscountPromo'
import AppRoutes from "@helpers/AppRoutes"
import { useRouter } from "next/router"
import { DisabledOption, getQuestionAndDescription, isOptionDisabled } from "@helpers/CommonFunc"
import { dfac, dfjac } from "@components/popUp/commonSX"
const Snacks = ({
  handleFormData,
  options,
  fieldToUpdate,
  question,
  description,
  values,
  animatedState,
  handleCheck,
  quizType = '',
  handleKeyUpdateOnly
}) => {
  console.log("quizType",quizType)
    const { decorationQuizData } = useSelector((state) => state.homepage);
  const [value, setValue] = useState(null)
  const { isExecutive } = useSelector((state) => state.auth)
  const [openPopup, setOpenPopup] = useState(false) // State for dialog popup
  const [newValue, setNewValue] = useState(null)

  const meals_deliver_per_day = "meals_deliver_per_day";
  const snacks_deliver_per_day = "snacks_deliver_per_day";

  const isMeal = fieldToUpdate === meals_deliver_per_day;
  const isSnack = fieldToUpdate === snacks_deliver_per_day;
  // const promoDetailsAAA = useSelector((state) => state.promoCodeDetail.data);


  const [promoDetailsAAA, setpromoDetailsAAA] = useState(null)

  useEffect(() => {
    // Check if we're running on the client (browser)
    if (typeof window !== 'undefined') {
      // Retrieve session data
      let storedData = sessionStorage.getItem('promoDetails');
      storedData = JSON.parse(storedData)
      if (storedData) {
        setpromoDetailsAAA(storedData?.data ? storedData?.data : storedData)
      }
    }
  }, [promoDetailsAAA?.id]);

  const AllArrayMeal = [1, 2, 3, 4, 5];
  const AllArraySnack = [0, 1, 2, 3, 4, 5];
  const hasAllMeal = (key) => AllArrayMeal?.every(num => key?.includes(num));
  const hasAllSnack = (key) => AllArraySnack?.every(num => key?.includes(num));


  const { snack, meal } = promoDetailsAAA || {};
  let totalSnacks = snack || null;
  let totalMeal = meal || null;

  if (totalSnacks === "All" || hasAllSnack(snack)) {
    // totalSnacks = 5;
    totalSnacks = AllArraySnack;
  }
  if (totalMeal === "All" || hasAllMeal(meal)) {
    // totalMeal = 5;
    totalMeal = AllArrayMeal;
  }

  const defaultValue = (() => {
    switch (fieldToUpdate) {
      case meals_deliver_per_day:
        return totalMeal;
      case snacks_deliver_per_day:
        return totalSnacks;

      default:
        return null;
    }
  })();
  const isDiscountApplicable = () => {
    const applicableKeys = {
      meals_deliver_per_day: meal !== 'All' || !hasAllMeal(meal),
      snacks_deliver_per_day: snack !== 'All' || !hasAllSnack(snack)
    };

    return fieldToUpdate && applicableKeys[fieldToUpdate] !== undefined ? applicableKeys[fieldToUpdate] : false;
  };

  const handleChange = (event) => {
    const val = (typeof event == 'number' || typeof event == 'string') ? event : Number(event.target.value);
    const selectedValue = val;

    if (promoDetailsAAA && Object.keys(promoDetailsAAA).length > 0 && isDiscountApplicable()) {
      if ((fieldToUpdate === meals_deliver_per_day && !totalMeal?.includes(selectedValue)) || (fieldToUpdate === snacks_deliver_per_day && !totalSnacks?.includes(selectedValue))) {
        if (fieldToUpdate === snacks_deliver_per_day && (selectedValue == 0 && totalSnacks?.length == 0)) {
          setValue(selectedValue); // Update state value
          handleCheck(fieldToUpdate, String(selectedValue)); // Use selectedValue directly in handleCheck

        } else {
          setOpenPopup(true); // Open popup if user selects a value that differs from promo code
          setNewValue(selectedValue); // Store new value before confirming
        }
      } else {
        setValue(selectedValue); // Update state value
        handleCheck(fieldToUpdate, selectedValue); // Use selectedValue directly in handleCheck

      }
    } else {
      // If promoDetails are not available, just set the value without any popup
      setValue(selectedValue);
      handleCheck(fieldToUpdate, selectedValue); // Trigger handleCheck immediately

    }

    // }
  }

  // Handle confirmation dialog
  const handleConfirmChange = () => {
    setOpenPopup(false) // Close the popup

    // Update the values to reflect the new selection
    if (promoDetailsAAA && Object.keys(promoDetailsAAA).length > 0) {
      if (fieldToUpdate === meals_deliver_per_day) {
        setValue(newValue)
        handleCheck(fieldToUpdate, newValue); // Update form with new value
      } else if (fieldToUpdate === snacks_deliver_per_day) {
        setValue(newValue)
        handleCheck(fieldToUpdate, newValue); // Update form with new value
      }
    }
  }

  // Handle canceling the change
  const handleCancelChange = () => {
    setOpenPopup(false) // Close the popup and keep the previous selection

    // if (promoDetailsAAA && Object.keys(promoDetailsAAA).length > 0) {
    //   if (fieldToUpdate === meals_deliver_per_day) {
    //     setValue(totalMeal); // Reset the value to the promo details value
    //     handleCheck(fieldToUpdate, totalMeal); // Update form with promo value
    //   } else if (fieldToUpdate === snacks_deliver_per_day) {
    //     setValue(totalSnacks); // Reset the value to the promo details value
    //     handleCheck(fieldToUpdate, totalSnacks); // Update form with promo value
    //   } else {
    //     setValue(value); // Revert to the last selected value
    //     handleCheck(fieldToUpdate, value); // Trigger form update with the last value
    //   }
    // } else {
    //   // No promoDetailsAAA available, revert to the last selected value
    //   setValue(value);
    //   handleCheck(fieldToUpdate, value);
    // }
  }

  // const isSelected = (selectedValue, loopedValue) => {
  //   if (selectedValue) return selectedValue == loopedValue;

  //   return defaultValue == loopedValue && isDiscountApplicable();
  // }
  const isSelected = (selectedValue, loopedValue) => {
    if (selectedValue) return selectedValue === loopedValue;
    // return defaultValue?.includes(loopedValue) && isDiscountApplicable();
    return defaultValue === loopedValue && isDiscountApplicable();
  }

  const isInArray = (array, value) => {
    return Array.isArray(array) && array.includes(value);
  }
  const oldQuesAndDesc = {question: question,description: description};
  const questionAndDescription =decorationQuizData?.showDecoration && quizType != 'quiz_a' ?  getQuestionAndDescription(decorationQuizData?.decorationArray , fieldToUpdate) : oldQuesAndDesc
  

    const beautiObj =
        Array.isArray(decorationQuizData?.decorationArray) &&
        decorationQuizData?.decorationArray?.find((beauty) => beauty?.questionId == fieldToUpdate);

   const anyDisbaledChecker = beautiObj?.options?.some((item) => {
        return isOptionDisabled(item, values)
    });
    const foundDisabled = beautiObj?.options
      ?.map(item => DisabledOption(item, values))
      .find(result => result !== null);
    const isMobile400 = useMediaQuery('(max-width:768px)');
  
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
            >
              {ReactHtmlParser(questionAndDescription?.description)}
            </Typography>
            <Box>
              {
                promoDetailsAAA ?
                  quizType == AppConstants.quizTypes.quiz_a ? "" :
                    isMeal && hasAllMeal(meal) ? "" :
                      isSnack && hasAllSnack(snack) ? "" :
                        <Typography sx={{
                          textAlign: 'center', fontSize: { md: '18px', xs: '12px' }, height: 'max-content', minHeight: 'max-content !important',
                          maxWidth: '100% !important', mb: '30px', mt: '-20px', color: AppColors.darkGrey
                        }}>
                          *Discount is only available on the highlighted option.
                        </Typography>
                  : ""
              }
            </Box>
            {/* {
              promoDetailsAAA ?
                quizType == AppConstants.quizTypes.quiz_a ? "" :
                  isMeal && hasAllMeal(meal) ? "" :
                    isSnack && hasAllSnack(snack) ? "" :
                      <Typography sx={{
                        textAlign: 'center', fontSize: { md: '18px', xs: '12px' }, height: 'max-content', minHeight: 'max-content !important',
                        maxWidth: '100% !important', mb:'30px',mt:'-20px',color: AppColors.secondryGray
                      }}>
                        *Discount is only available on the highlighted option.
                      </Typography>
                : ""
            } */}
            <div className="quizQuestion--sty2 ">
              {
                decorationQuizData &&  quizType != 'quiz_a' ?
                <BoxWithDiscountPromo
                  promoDetails={promoDetailsAAA}
                  fieldToUpdate={fieldToUpdate}
                  options={options}
                  question={question}
                  values={values}
                  value={value}
                  onChange={handleChange}
                  isDiscountApplicable={isDiscountApplicable}
                  defaultValue={defaultValue}
                  AllArrayMeal={AllArrayMeal}
                  AllArraySnack={AllArraySnack}
                  hasAllOption1={hasAllMeal}
                  hasAllOptions2={hasAllSnack}
                  typeofMeal1={meal}
                  typeofMeal2={snack}
                  isInArray={isInArray}
                  handleUpgradefun={(obj)=>{
                    handleKeyUpdateOnly(obj?.sourceQuestionId,obj?.value + 1)
                  }}
                />
                :
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={value}
                  onChange={handleChange}

                >
                  {options.map((val, i) => {
                    return (

                      <FormControlLabel
                        className={`mealnsnack ${isExecutive ? "isExecutiveRadio" : ""}`}
                        key={i}
                        value={val}
                        // onClick={handleFormData(fieldToUpdate, val)}
                        // onClick={()=>handleValue(val)}
                        // onClick={()=>handleCheck(fieldToUpdate, val)}

                        control={
                          <Radio
                            className={
                              // isSelected(values[fieldToUpdate], val) ? "Mui-checked" : ""
                              // isSelected(values[fieldToUpdate], val) ? "Mui-checked" : "" + 
                              `${isSelected(values[fieldToUpdate], val) ? "Mui-checked" : ""}
                            ${isMeal && !isSelected(values[fieldToUpdate], val) && !hasAllMeal(meal) && isInArray(defaultValue, val) ? "highlighted " : ""}
                            ${isSnack && !isSelected(values[fieldToUpdate], val) && !hasAllSnack(snack) && isInArray(defaultValue, val) ? "highlighted" : ""} 
                          // (values[fieldToUpdate] === defaultValue || 
                            // (fieldToUpdate === meals_deliver_per_day && val === totalMeal) ||
                            // (fieldToUpdate === snacks_deliver_per_day && val === totalSnacks)
                            // ? "Mui-checked" : ""
                          `}
                          />
                        }
                        label={val}
                      />
                    )
                  })}
                </RadioGroup>
              </FormControl> 
              }

            </div>
          </Animated>
        </div>
        <Box sx={{...dfjac}}>
            {
               anyDisbaledChecker &&
               <Typography color={'black !important'} sx={{fontSize:{xs:'14px',md:'18px'}}} >
                   Options with
                   <Box
                       component={'span'}
                       sx={{
                           backgroundColor: '#AA2831',
                           color: `${AppColors.white}`,
                           zIndex: 30,
                           cursor: 'pointer',
                           pointerEvents: 'all',
                           borderRadius:'50%',
                           padding:{xs:'1px 4px',md:'1px 5px'},
                           margin:'0px 3px',
                           height:{xs:'14px',md:'16px'},
                           width:{xs:'14px',md:'16px'},
                       }}
                   >
                       <img src='/images/meal/lockWhite.svg' style={{ width:isMobile400? '8px': '10px' }} />
                   </Box>
                   icon require atleast {(foundDisabled?.value ?? 0)+1} meals per day
               </Typography>
            }
            </Box>
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

Snacks.propTypes = {
  values: PropTypes.any,
  handleFormData: PropTypes.func,
  options: PropTypes.array,
  fieldToUpdate: PropTypes.string,
  question: PropTypes.string,
  description: PropTypes.string
}
export default Snacks
