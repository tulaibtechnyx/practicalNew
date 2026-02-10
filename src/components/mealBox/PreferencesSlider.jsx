import React, { useCallback, useEffect, useRef, useState } from "react"
import { Typography } from "@mui/material"
import Slider from "react-slick"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
import $ from "jquery"
import ConfirmationModal from "../popUp/scrollMessage"
import AppConstants from "helpers/AppConstants"
import { useDispatch, useSelector } from "react-redux"
import debounce from "lodash/debounce"
import AppColors from "@helpers/AppColors"
import { setGlobalLoading } from "store/reducers/dashboardReducer"
import { useRouter } from "next/router"
import AppRoutes from "@helpers/AppRoutes"

const days = [5, 6, 7]
const weeks = [1, 2, 4]
const meals = [400, 500, 600, 700, 800]
const noOfMeals = [1, 2, 3, 4, 5]
const snacks = [0, 1, 2, 3, 4, 5]

const PreferencesSlider = ({
  type,
  currentData,
  sliderChange,
  currentType,
  isPaid,
  isLoading = false,
  index = null,
  startDate,
  setCurrentTypeOfSlider = () => { },
  currentTypeOfSlider = [],
  disableOnchange = false
}) => {
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)
  const [localValue, setLocalValue] = useState(currentData ?? 0)

  useEffect(() => {
    setLocalValue(currentData ?? 0)
  }, [currentData])

  useEffect(() => {
    $(".slide").on("touchstart", function () {
      $("body").addClass("touched")
    })
    $(".slide").on("touchend", function () {
      $("body").removeClass("touched")
    })
  }, [])

  const setTypeOfSlider = useCallback((type) => {
    setCurrentTypeOfSlider((prev) => {
      const updated = Array.isArray(prev) ? [...prev] : [];
      if (!updated.includes(type)) {
        updated.push(type);
      }
      return updated;
    });
  }, [setCurrentTypeOfSlider]);

  const { isExecutive } = useSelector((state) => state.auth)

  // Helper to get array and label for each type
  const getSliderConfig = () => {
    switch (type) {
      case "week": return { arr: weeks, label: "Weeks" }
      case "days": return { arr: days, label: "Days" }
      case "meal": return { arr: meals, label: "Calorie Meal" }
      case "meals": return { arr: noOfMeals, label: "Meals" }
      case "snack": return { arr: snacks, label: "200 Calorie" }
      default: return { arr: [], label: "" }
    }
  }

  // Handler for slider change
  const handleSliderChange = useCallback(
    debounce((e, arr) => {
      const value = arr[e]
      if (value !== localValue) {
        setLocalValue(value)
        setTypeOfSlider(type + (type === "meal" ? index : ""))
        sliderChange(value, currentType)
      }
    }, 800),
    [sliderChange, currentType, setTypeOfSlider, type, index, localValue]
  )

  // below one is perfect old sami bhai k issue k sath
  const handleSliderChange2 = useCallback(
    (e, arr) => {
      const value = arr[e];
      // if (value !== currentData) {
      setTypeOfSlider(currentType + (type === "meal" ? index : ""));
      sliderChange(value, currentType, index);
      // }
    },
    [sliderChange, currentType, setTypeOfSlider, type, index, currentData]
  );

  // Use a direct, immediate function: with parent callbacks
  const handleSliderChangeNew = useCallback(
    (e, arr) => {
      const value = arr[e];
      // This function runs immediately on every slider change.
      // It calls the parent's handler with the new value.
      sliderChange(value, currentType, index); // <-- Pass the 'index' now
    },
    [sliderChange, currentType, index] // Added index to dependencies
  );


  // For meal calories only slide changes
  // Sync visualValue with currentData when currentData changes

  const handleSliderChangeImmediate = useCallback(
    (e, arr) => {
      const value = arr[e];
      // Pass the new value, the currentType, and the index.
      setTypeOfSlider(currentType + (type === "meal" ? index : ""));
      sliderChange(value, currentType, index);
    },
    [sliderChange, currentType, index]
  );

  // RENDER FUNCTION UPDATE
  const sliderRef = useRef(null);
  const { arr, label } = getSliderConfig()
  // const currentActiveIndexVisual = arr.findIndex((val) => val == visualValue);
  const currentActiveIndex = arr.findIndex((val) => val == currentData);
  // const currentActiveIndex = currentType == 'meal_plan' ? currentActiveIndexVisual : currentActiveIndexForOthers;


  const renderSlider = (localValuefun) => {
    return (
      <Slider
        ref={sliderRef}
        arrows={true}
        fade={false}
        dots={false}
        vertical={true}
        afterChange={(e) => disableOnchange ? null : handleSliderChange2(e, arr)}
        // afterChange={(e) => disableOnchange ? null : currentType == 'meal_plan' ? handleSliderChangeImmediate(e, arr) : handleSliderChange2(e, arr)}
        slidesToShow={1}
        swipeToSlide={true}
        verticalSwiping={true}
        infinite={true}
        centerMode={false}
        currentSlide={currentActiveIndex}
        className={`${isExecutive ? "isExecutive" : ""}`}
      >
        {arr.map((val, idx) => (
          <div key={idx} className={styles.boxCol}>
            <Typography
              sx={{
                fontFamily: "AWConquerorInline",
                ...(type === "snack" && { color: `${AppColors.yellow} !important` })
              }}
              variant={"h2"}
              className={styles.heading}
            >
              {val}
            </Typography>
            <Typography
              variant={"body3"}
              component={"p"}
              className={styles.para}
            >
              {label}
              {type === "snack" && ` ${val <= 1 ? "snack" : "snacks"}`}
            </Typography>
          </div>
        ))}
      </Slider>
    )
  }

  // Render confirmation modal if needed (kept as is)
  const renderConfirmationModal = () => (
    <ConfirmationModal
      open={openConfirmationModal}
      handleClose={() => {
        setOpenConfirmationModal(!openConfirmationModal)
        setOpenConfirmationModal(null)
      }}
      onConfirm={() => {
        // Confirm logic here if needed
        setOpenConfirmationModal(!openConfirmationModal)
        setOpenConfirmationModal(null)
      }}
    />
  )

  return (
    <div className={styles.boxSlider} style={{
      pointerEvents: isLoading ? 'none' : 'auto',
      overflow: isLoading ? 'hidden' : 'visible',
      zIndex: isLoading ? 2 : 'auto'
    }}>
      {isLoading && currentTypeOfSlider && (
        type === "meal"
          ? currentTypeOfSlider.some(item => item?.startsWith("meal_plan") && item?.slice(-1) == index)
          : currentTypeOfSlider.includes(currentType)
      ) ?
        <LoaderSmall
          isExecutive={isExecutive}
          type={type}
          matchType={'snack'}
        />
        :
        <div className={"slide"} style={{ pointerEvents: disableOnchange ? 'none' : 'auto' }}>
          {["week", "days", "meals"].includes(type) && renderConfirmationModal()}
          {(currentData == 0 || currentData) && renderSlider(currentData)}
        </div>
      }
    </div>
  )
}

const LoaderSmall = (props) => {
  const { isExecutive, type, matchType } = props
  return (
    <div className={`lds-ellipsis ${isExecutive || type == matchType ? 'isExecutive' : ''}`} style={{ display: "block", position: 'relative', zIndex: 1 }}>
      <div ></div>
      <div ></div>
      <div ></div>
      <div ></div>
    </div>
  )
}

export default PreferencesSlider

PreferencesSlider.propTypes = {
  type: PropTypes.string,
  currentData: PropTypes.any,
  sliderChange: PropTypes.func,
  currentType: PropTypes.string,
  setGlobalLoading: PropTypes.func,
  currentType: PropTypes.string
}
