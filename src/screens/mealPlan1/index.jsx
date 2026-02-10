import React from "react"
import MealPlan1 from "../../components/mealPlan1"
import PropTypes from "prop-types"
const MealPlanScreen1 = (props) => {
  const { val } = props
  return <MealPlan1 val={val} />
}

MealPlanScreen1.propTypes = {
  val: PropTypes.object
}

export default MealPlanScreen1
