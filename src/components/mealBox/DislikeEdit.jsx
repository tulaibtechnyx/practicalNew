import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Typography, Box, Button } from "@mui/material"
import { showFaliureToast } from "../../helpers/AppToast"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import AppLogger from "helpers/AppLogger"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import get from "lodash/get"
import CustomText from "@components/CustomText"
import CustomTooltip from "@components/CustomTooltip"
import AppConstants from "@helpers/AppConstants";
import TimerTooltip from "../mealDistrubution/TimerTooltip"
export default function AllergiesEdit({
  currentData,
  setCurrentData,
  handleClose
}) {
  const { startUpData } = useSelector((state) => state.home)
  const { isExecutive } = useSelector((state) => state.auth)
  const { userProfile } = useSelector((state) => state.profile)
  
  const [startUpLocal, setStartUpLocal] = useState(null)
  const [selectedDislikes, setSelectedDislikes] = useState([])
  const [allDislikes, setAllDislikes] = useState([])

  const userAllergy = get(userProfile, "allergies[0]", null)
  const allAllergy = get(startUpData, "allergies", [])
  const userAllergyChilds = allAllergy?.find((item)=>item?.title == userAllergy?.title);
  const allFoods = get(startUpLocal, "food_ingredients", [])

  useEffect(() => {
    if (startUpData) {
      setStartUpLocal(startUpData)
    }
  }, [startUpData])

  useEffect(() => {
    startDataHandler()
  }, [startUpLocal, currentData])

  const startDataHandler = () => {
    // AppLogger("this  is currentData=======", currentData)
    const allData = []
    const allDataSelected = []

    for (let index = 0; index < allFoods.length; index++) {
      const element = allFoods[index]

      const currentIndex = currentData.findIndex((val) => val == element.title)
      if (currentIndex !== -1) {
        var selectedAllergy = { ...element, selected: true }
        allDataSelected.push(selectedAllergy?.title)
        allData.push(selectedAllergy)
      } else {
        var nonSelectedAllergy = { ...element, selected: false }
        allData.push(nonSelectedAllergy)
      }
    }
      setSelectedDislikes(allDataSelected);
      setAllDislikes(allData)
  }

  const deleteAllergyHandler = (currAllerg) => {
    try {
      const allDislikes = [...selectedDislikes]
      const { food_ingredients } = startUpData
      const all = [...food_ingredients]
      const currentAllergyIndex = allDislikes.findIndex(
        (val) => val == currAllerg
      )
      if (currentAllergyIndex !== -1) {
        allDislikes.splice(currentAllergyIndex, 1)
      }

      const alls = all.filter((allegy) => !allDislikes.includes(allegy))
      setSelectedDislikes(allDislikes)
      setAllDislikes(allDislikes)
    } catch (err) {
      AppLogger("Error at deleteAllergyHandler", err)
    }
  }

  const updateAllergySelection = (alllallergy, selectedallergy) => {
    return alllallergy.map(allergy => ({
      ...allergy,
      selected: selectedallergy.some(selected => selected.toLowerCase() == allergy.title.toLowerCase())
    }));
  };

  const addAllergyHandler = (currAllerg) => {
    try {
      // AppLogger("this is curr  allerg", currAllerg)
      
      const foundOption = allDislikes?.find((item => item?.title == currAllerg));
      const allFood = [...allDislikes];
      const currentIndex = allFoods.findIndex((val) => val.title == currAllerg)
      const NoDislikesObjIndex = allFood.findIndex(
        (val) => val.title == AppConstants?.noDislikes
      )

      if (foundOption?.is_parent == 1) {
        
        if (selectedDislikes?.includes(foundOption?.title)) {
          allFood[currentIndex] = {
            ...allFood[currentIndex],
            selected: !allFood[currentIndex].selected
          }
          for (let i = 0; i < allFood.length; i++) {
            const childselected = foundOption?.childs?.some(itemC=>itemC?.title == allFood[i]?.title);
            if(childselected){
              allFood[i] = { ...allFood[i], selected: false }
            }
          }
          setAllDislikes(allFood)
          setSelectedDislikes(selectedDislikes?.filter(item=>item !=foundOption?.title))
          return
        }
        const updatedChilds = foundOption?.childs
          ?.filter((item) => item?.availability === AppConstants.Available && item?.is_dislike === 1) // Only Available and is_dislike = 1
          .map((item) => item?.title) || [];
        // Filter out duplicates
        const newItems = [...updatedChilds, foundOption?.title].filter((item) => !selectedDislikes.includes(item));
        // Merge only new unique items
        const updatedList = [...selectedDislikes, ...newItems];
        const updatedAllergyList = updateAllergySelection(allDislikes, updatedList);

        if (NoDislikesObjIndex !== -1) {
          if (updatedAllergyList[NoDislikesObjIndex].selected == true) {
              updatedAllergyList[NoDislikesObjIndex].selected = false
          }
        }
        setAllDislikes(updatedAllergyList);
        setSelectedDislikes(updatedList?.filter((item)=>item?.toLowerCase() != AppConstants?.noDislikes?.toLowerCase()));
        return
      }

      allFood[currentIndex] = {
        ...allFood[currentIndex],
        selected: !allFood[currentIndex].selected
      }
      setAllDislikes(allFood)

      if (allFood[currentIndex].title == AppConstants?.noDislikes) {
        for (let i = 0; i < allFood.length; i++) {
          allFood[i] = { ...allFood[i], selected: false }
        }
        allFood[currentIndex].selected = true
      } else {
       
        if (NoDislikesObjIndex !== -1) {
          if (allFood[NoDislikesObjIndex].selected == true) {
            allFood[NoDislikesObjIndex] = {
              ...allFood[NoDislikesObjIndex],
              selected: false
            }
          }
        }
      }
      const selected = []
      for (let index = 0; index < allFood.length; index++) {
        const aller = allFood[index]
        // AppLogger("This is  aller=====", aller)
        if (aller.selected) {
          selected.push(aller.title)
        }
        // AppLogger("This is allergies", aller)
        setSelectedDislikes(selected)
      }
    } catch (err) {
      AppLogger("This is error at addAllergyHandler======", err)
    }

  }

  const onSavePressHandler = () => {
   const selectedDislikestrimed = selectedDislikes?.map(item => item?.trim());

    if (selectedDislikestrimed?.length > 0) {
      setCurrentData(selectedDislikestrimed)
      handleClose()
    } else {
      showFaliureToast("Dislikes list cannot be empty")
    }
  }
  const isDisabledOptionsv2 = (option) => {
    const IsInAllergy = userAllergyChilds?.related_ingredients?.find((ite)=>ite?.title == option?.title)
    if ( IsInAllergy) {
      return true;
    }
    return false;
  };

  const childTitles = new Set(
    allDislikes?.flatMap(opt => opt?.childs?.map(child => child?.title?.toLowerCase()) || [])
  );
  // Count selected items that are either parents or not present in the childTitles list
  const selectedParentCount = allDislikes?.filter(opt => 
    selectedDislikes?.includes(opt?.title) && (opt?.is_parent === 1 || !childTitles.has(opt?.title?.toLowerCase()))
  )?.length ?? 0;  
  
  
  return (
    <div className="popItems sty2">
    <Button 
    // className="crossButton"
    className={`crossButton ${isExecutive ? 'isExecutive':'' }`}
     onClick={handleClose}>
      x
    </Button>
      <Typography
        className="headingTime sty"
        variant="h3"
        sx={{ color: AppColors.primaryGreen, fontWeight: "bold" }}
      >
        {"Dislikes"}
      </Typography>
      <Box sx={{my:1, display:'flex',justifyContent:'center',gap:'10px',alignItems:'center'}} >
        <Typography
        className="headingTime sty"
        variant="body3"
        component={"p"}
        sx={{
          color: AppColors.primaryGreen,
          // fontWeight: "bold",
        }}
      >
        {allDislikes?.find(
          (val) => val?.title == AppConstants?.noDislikes && val?.selected == true
        )
          ? "Choose up to three"
          : `You have selected ${selectedParentCount} out of 3 dislikes.`}
        </Typography>
        <TimerTooltip
            title={`Exclude up to three ingredients, but don’t worry—some count as bundles! For example, removing “peppers” covers red, green, and yellow but only counts as one. This keeps your options open while ensuring meals you’ll love.`}
            positionBoxOnMobile={'translateX(-85%)'}>
            i
          </TimerTooltip>
       </Box>

      <div className={`selectItem--list--New ${isExecutive?"selectListItemExecutive":""}`}>
        {allDislikes.map((food, index) => {
          // AppLogger("this is food=======", food)
          if(isDisabledOptionsv2(food)) return
          return (
            <FormControlLabel
              disabled={isDisabledOptionsv2(food)}
              key={index}
              control={<Checkbox checked={food.selected} />}
              // label={food.title}
              label={
                <CustomText
                  tooltipTheme="light"
                  disabled={isDisabledOptionsv2(food)}
                  placement={'bottom-start'}
                  variant='p'
                  arrow
                  color="white"
                  title=""
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    color: isDisabledOptionsv2(food) ? "grey" : "#fff !important", 
                    width: '100%',
                    textAlign:'center',
                    pointerEvents: 'auto'
                  }}>
                    {food?.title}
                  </CustomText>
              }
              onClick={() => !isDisabledOptionsv2(food) && addAllergyHandler(food.title)}
            />
          )
        })}
      </div>
      <Box
        className={`saveButton ${isExecutive?"saveBtnExecutive":""}`}
        sx={{
          borderTop: "1px solid #ffff",
          // marginTop: "30px",
          paddingTop: "20px",
          textAlign: "center"
        }}
      >
        <button
          disabled={
            selectedDislikes.length >= 1 && selectedParentCount < 4
              ? false
              : true
          }
          onClick={() => {
            onSavePressHandler()
          }}
        >
          Save
        </button>
      </Box>
    </div>
  )
}
AllergiesEdit.propTypes = {
  currentData: PropTypes.any,
  setCurrentData: PropTypes.any,
  handleClose: PropTypes.func
}
