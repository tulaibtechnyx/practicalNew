import React from "react"
import MealPlan from "../../components/mealPlan"
import PropTypes from "prop-types"
const MealPlanScreenMealPlanScreen = (props) => {
  const { dataRec ,changed , isExecutive} = props
  return (
    <>
      <div className="mealPlanScreen">
        <MealPlan changed={changed} dataRec={dataRec} isExecutive={isExecutive}/>
      </div>
    </>
  )
}
MealPlanScreen.propTypes = {
  dataRec: PropTypes.any
}
export default MealPlanScreen
