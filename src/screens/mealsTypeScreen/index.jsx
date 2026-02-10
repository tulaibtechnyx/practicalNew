import React from "react"
import MealTypes from "../../components/mealType"
import PropTypes from "prop-types"
const MealTypeScreen = (props) => {
  const {
    bgColor,
    title,
    para,
    paraSm,
    popUp,
    calories,
    protien,
    crabs,
    fat,
    percentage1,
    percentage2,
    percentage3,
    mb,
    isExecutive
  } = props
  return (
    <div className={bgColor ? "mealType withBG" : "mealType"}>
      <div className="container container--custom">
        <MealTypes
          isExecutive={isExecutive}
          mb={mb}
          percentage1={percentage1}
          percentage2={percentage2}
          percentage3={percentage3}
          title={title}
          para={para}
          paraSm={paraSm}
          popUp={popUp}
          calories={calories}
          protien={protien}
          crabs={crabs}
          fat={fat}
        />
      </div>
    </div>
  )
}

MealTypeScreen.propTypes = {
  percentage1: PropTypes.string,
  percentage2: PropTypes.string,
  percentage3: PropTypes.string,
  calories: PropTypes.string,
  protien: PropTypes.string,
  crabs: PropTypes.string,
  fat: PropTypes.string,
  bgColor: PropTypes.any,
  title: PropTypes.string,
  para: PropTypes.string,
  paraSm: PropTypes.string,
  popUp: PropTypes.bool
}
export default MealTypeScreen
