import React, { useEffect, useState } from "react"
import { Box, Collapse, Tooltip, Typography } from "@mui/material"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import ListItemText from "@mui/material/ListItemText"
import Select from "@mui/material/Select"
import PropTypes from "prop-types"
import Button from "@mui/material/Button"
import styles from "./style.module.scss"
import Checkbox from "@mui/material/Checkbox"
import Chip from "@mui/material/Chip"
import AppColors from "helpers/AppColors"
import AppLogger from "helpers/AppLogger"
import { Animated } from "react-animated-css"
import { useSelector } from "react-redux"
import ReactHtmlParser from "react-html-parser"
import CustomTooltip from "@components/CustomTooltip"
import CustomText from "@components/CustomText"
import AppConstants from "@helpers/AppConstants"
import TimerTooltip from "@components/mealDistrubution/TimerTooltip"
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

export default function MultipleSelectCheckmarks({
  handleFormData,
  options,
  fieldToUpdate,
  question,
  description,
  values,
  animatedState,
  allergyForDislikesRela
}) {
  const { currentQuizType } = useSelector((state) => state.quiz)
  const [foodName, setFoodName] = useState([])
  const placeholder = "Please select from list"
  const { isExecutive } = useSelector((state) => state.auth)
  const childTitles = new Set(
    options?.flatMap(opt => opt?.childs?.map(child => child?.title?.toLowerCase()) || [])
  );
  
  useEffect(() => {
    foodValueHandler()
  }, [values])
  const foodValueHandler = () => {
    try {
      const foods = []

      if (values[fieldToUpdate]) {
        const allValues = values[fieldToUpdate]
        for (let index = 0; index < allValues.length; index++) {
          const element = allValues[index]
          foods.push(element)
        }
        setFoodName(typeof foods === "string" ? foods.split(",") : foods)
      }
    } catch (error) {
      AppLogger("Error at foodValueHandler", error)
    }
  }
  const isDisabledOptionsv2 = (option) => {
    // Count the number of selected parent items
    const selectedParentCount = options?.filter(opt => 
      foodName?.includes(opt?.title) && (opt?.is_parent === 1 || !childTitles.has(opt?.title?.toLowerCase()))
    )?.length ?? 0;  
    // Disable if already 3 parent items are selected and the current item is not already in foodName
    if (selectedParentCount >= 3 && !foodName.includes(option?.title) && option?.title !== 'I have no dislikes') {
      return true;
    }

    return false;
  };

  const handleChange = (event, val) => {
    var {
      target: { value }
    } = event;
    const currValue = val?.props?.value;
    const foundOption = options?.find((item => item?.title == currValue));
    const foundInfoodName = foodName?.find((item => item == currValue));
    const updatedChilds = foundOption?.childs
        ?.filter((item) => item.availability === "Available" && item.is_dislike === 1) // Only Available and is_dislike = 1
        .map((item) => item.title) || [];

    let foodnameList = [...foodName];
    const currentIndex = value.findIndex((val) => val == "I have no dislikes")

    if (foundInfoodName) {
      if (foundOption?.is_parent == 1) {
        foodnameList = foodnameList?.filter(item => !updatedChilds?.includes(item));
        foodnameList = foodnameList?.filter(item => item != currValue)
        setFoodName(foodnameList);
        return
      }
      else{
        setFoodName(
          value?.filter(item => item != currValue)
        );
        return
      }
    }
    if (foundOption?.is_parent == 1) {
      
      // Filter out duplicates
      const newItems = [ foundOption?.title, ...updatedChilds].filter((item) => !foodName.includes(item));
      // Merge only new unique items
      const updatedList = [...foodName, ...newItems];
      if (currentIndex !== -1) {
        updatedList?.splice(currentIndex, 1)
      }
      setFoodName(updatedList);
      return
    }

    if (currentIndex !== -1) {
      if (currentIndex == 0) {
        if (value.length > 1) {
          value.splice(currentIndex, 1)
        } else {
          value = []
          value.push("I have no dislikes")
        }
      } else {
        value = []
        value.push("I have no dislikes")
      }
    }
    setFoodName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    )
  }
  function isOptionAvailable(option) {
    return childTitles?.has(option?.toLowerCase());
}

  const CheckValueColor=(val)=>{
    const foundOption = options?.find((item => item?.title == val));
    if (foundOption?.is_parent == 1) {
      return AppColors.primaryOrange
    }else{
      if(isOptionAvailable(val)){
        return AppColors.lightOrange
      }else{
        return AppColors.primaryGreen
      }
    }
  }
  const handleSubmitPress = () => {
   const selectedDislikestrimed = foodName?.map(item => item?.trim());
    handleFormData(fieldToUpdate, selectedDislikestrimed)
  }
 
  // Count selected items that are either parents or not present in the childTitles list
  const selectedParentCount = options?.filter(opt => 
    foodName?.includes(opt?.title) && (opt?.is_parent === 1 || !childTitles.has(opt?.title?.toLowerCase()))
  )?.length ?? 0;  
  
  const [expandedParents, setExpandedParents] = React.useState({});

const toggleExpand = (parent) => {
  setExpandedParents((prev) => ({
    ...prev,
    [parent]: !prev[parent],
  }));
};
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
            <Box sx={{mb:1, display:'flex',justifyContent:'center',gap:'10px',alignItems:'center'}} >
              <Typography
              variant={"body3"}
              component="p"
              className={styles.quizPara}
              color={AppColors.primaryGreen}
              style={{margin:'0px'}}
            >
              {foodName == "I have no dislikes"
                ? "Choose up to three parent dislikes."
                : `You have selected ${selectedParentCount} out of 3 dislikes.`}
              </Typography>
              <TimerTooltip
              fontSizechildren='9px'
              placement='top'
              title={`Exclude up to three ingredients, but don’t worry—some count as bundles! For example, removing “peppers” covers red, green, and yellow but only counts as one. This keeps your options open while ensuring meals you’ll love.`}
              positionBoxOnMobile={'translateX(-85%)'}>
              i
             </TimerTooltip>
              {/* <CustomTooltip
                leaveTouchDelay={4000}
                disableTouchListener={false}
                enterTouchDelay={50}
                title={`Exclude up to three ingredients, but don’t worry—some count as bundles! For example, removing “peppers” covers red, green, and yellow but only counts as one. This keeps your options open while ensuring meals you’ll love.`}
                arrow
                placement='top'
                >
                <Box sx={{
                  width: '15px',
                  height: '15px',
                  borderRadius: '10px',
                  backgroundColor: '#ed894e',
                  color: 'white',
                  fontSize: '11px',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center'
                }}>
                  <span>i</span>
                </Box>
              </CustomTooltip> */}
            </Box>
            <div className="selectWrapped">
              <FormControl>
                <Select
                  sx={{
                    "& .MuiSelect-select .notranslate::after": placeholder
                      ? {
                        content: `"${placeholder}"`,
                        opacity: 0.42
                      }
                      : {},
                    borderRadius: "50px",
                    textAlign: "left"
                  }}
                  id="demo-multiple-checkbox"
                  multiple
                  value={foodName}
                  onChange={(e, v) => handleChange(e, v)}
                  renderValue={(selected) => {
                    const groupedSelection = {};
                    const standaloneItems = new Set(selected);
                  
                    selected.forEach((item) => {
                      const parent = options?.find(opt => opt?.title === item && opt?.is_parent);
                  
                      if (parent) {
                        // If the parent is selected, group only its selected children
                        const selectedChildren = parent?.childs
                          ?.filter(child => selected?.includes(child?.title))
                          ?.map(child => child?.title);
                  
                        if (selectedChildren?.length > 0) {
                          groupedSelection[parent?.title] = selectedChildren;
                          selectedChildren?.forEach(child => standaloneItems?.delete(child)); // Remove grouped children from standalone
                          standaloneItems?.delete(parent?.title); // Remove parent from standalone
                        }
                      } else {
                        // If only a child is selected, allow it as a standalone item
                        const parentOfChild = options?.find(opt => opt?.childs?.some(c => c?.title === item));
                        if (parentOfChild && selected?.includes(parentOfChild?.title)) {
                          standaloneItems?.delete(item); // Remove child from standalone if parent is selected
                        }
                      }
                    });
                  
                    return (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1,alignItems:'center' ,padding:'5px'}}>
                        {Object.entries(groupedSelection)?.map(([parent, childs]) => (
                          <Box key={parent} sx={{ 
                            backgroundColor: "#FDE3D9", 
                            padding: "8px", 
                            borderRadius: "20px", 
                            display: "flex", 
                            minWidth: "180px",
                            flexWrap:'wrap'
                          }}>
                            {/* Parent Label (No Chip) */}
                            <Box sx={{
                              backgroundColor: "#FF8C42",
                              color: "white",
                              borderRadius: "16px",
                              padding: "4px 10px",
                              alignSelf: "flex-start",
                              fontSize:'13px',
                              fontWeight:400

                            }}>
                              {parent}
                            </Box>
                            {/* Child Items */}
                            {childs?.map((child) => (
                              <Box key={child} sx={{ marginTop: "5px", paddingLeft: "10px" ,
                              fontSize:'13px',
                                fontWeight:400
                              }}>
                                {child}
                              </Box>
                            ))}
                          </Box>
                        ))}
                  
                        {[...standaloneItems]?.map((item) => (
                          <Chip
                            key={item}
                            label={item}
                            sx={{
                              backgroundColor:AppColors.primaryGreen, 
                              color: "white",
                              borderRadius: "16px",
                              padding: "4px 10px",
                              fontWeight:400

                            }}
                          />
                        ))}
                      </Box>
                    );
                  }}
                  // Old render Value must not remove it
                  // renderValue={(selected) => (
                  //   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  //     {selected.map((value) => (
                  //       <Chip
                  //         key={value}
                  //         label={value}
                  //         sx={{
                  //           margin: "0 2px",
                  //           height: "28px",
                  //           backgroundColor: CheckValueColor(value),
                  //           border: CheckValueColor(value) == AppColors.lightOrange ? `1px solid ${AppColors.primaryOrange}`:'transparent',
                  //           color: CheckValueColor(value) == AppColors.lightOrange ? AppColors.primaryOrange :AppColors.white,

                  //         }}
                  //       />
                  //     ))}
                  //   </Box>
                  // )}
                  MenuProps={MenuProps}
                >
                  {options?.map((option, index) => {
                    const isItemInRelatedIngredient = allergyForDislikesRela?.related_ingredients?.some(item => item?.title?.toLowerCase() == option?.title?.toLowerCase());
                    const isDisabled = isDisabledOptionsv2(option) || isItemInRelatedIngredient;
                    const isParent = option?.is_parent;
                    const childsLen = option?.childs?.filter((item) => item?.availability === "Available" && item?.is_dislike === 1)?.length ?? null;
                    if(isItemInRelatedIngredient) return
                    return (
                      <MenuItem
                        key={index}
                        value={option?.title}
                        // disabled={isDisabled} // <-- Properly disables selection
                        sx={{
                          pointerEvents: isDisabled ? 'none' : 'auto',
                          opacity: isDisabled ? 0.5 : 1,
                        }}
                      >
                        <Checkbox
                          checked={foodName?.indexOf(option?.title) > -1}
                          disabled={isDisabled}
                        />
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                                       <CustomText
                                        disabled={isDisabled}
                                        fontSize="18px"
                                        placement={'bottom-start'}
                                        variant='p'
                                        arrow
                                        title={isItemInRelatedIngredient  ? `Disabled due to selection of ${allergyForDislikesRela?.title} as allergy` : ""}
                                        sx={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          width: 'max-content',
                                          // pointerEvents: 'none' ,
                                          color: isItemInRelatedIngredient  ? "grey" : "black", 
                                        }}>
                                        {option?.title}
                                      </CustomText>
                              {
                                childsLen == 0 ? null :
                                  isParent &&
                                  <CustomText
                                    disabled={isDisabled}
                                    variant='p'
                                    arrow
                                    fontSize="13px"
                                    color={AppColors.primaryGreen}
                                    sx={{ pt: { xs: '0px', md: '3px' } }}
                                  >
                                    {`(has ${childsLen} bundled ${childsLen == 1 ? 'dislike':'dislikes'})`}
                                  </CustomText>
                              }
                            </Box>
                          }
                        />
                      </MenuItem>
                    )
                  })}
                </Select>
                <Box>
                  <Button
                    className={`${styles.btn} ${isExecutive ? styles.isExecutive : ''}`}
                    onClick={handleSubmitPress}
                    disabled={foodName?.length > 0 ? false : true}
                    variant="contained"
                  >
                    Continue
                  </Button>
                </Box>
              </FormControl>
            </div>
          </Animated>
        </div>
      </div>
    </div>
  )
}

MultipleSelectCheckmarks.propTypes = {
  values: PropTypes.any,
  handleFormData: PropTypes.func,
  options: PropTypes.array,
  fieldToUpdate: PropTypes.any,
  question: PropTypes.string,
  description: PropTypes.string
}