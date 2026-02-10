import React from "react"
import ReferralComp from "../../components/referralComp"
import AppConstants from "helpers/AppConstants"
import { useSelector } from "react-redux"
const FoodScreen = (props) => {
  const { handleChange, freeFoodSetter } = props
  // const isExecutive = AppConstants.isExecutive
  const { isExecutive } = useSelector((state) => state.auth)
  return (
    <div className={`foodScreen ${isExecutive ? "isExecutive" : ""}`}>
      <ReferralComp
        handleChange={handleChange}
        freeFoodSetter={freeFoodSetter}
      />
    </div>
  )
}

export default FoodScreen
