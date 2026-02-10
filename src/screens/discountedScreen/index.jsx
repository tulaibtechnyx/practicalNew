import React from "react"
import DiscountComponent from "../../components/discountComponent"
import AppColors from "helpers/AppColors"
import AppConstants from "helpers/AppConstants"
import { useSelector } from "react-redux"
import get from "lodash/get"
const DiscountedScreen = ({ percentDiscount, discountValue, referalDataLocal=null }) => {
  // const isExecutive = AppConstants.isExecutive
  const { isExecutive } = useSelector((state) => state.auth)
  // const { freeFoodData } = useSelector((state) => state.home)
  const percentType = get(referalDataLocal, "friend_discount.type", "")
  const discountType = get(referalDataLocal, "user_discount.type", "")
  return (
    <div className="discountedScreen">
      <DiscountComponent
        textColor={AppColors.white}
        bgColor={isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen}
        heading={"You get"}
        price={discountType===AppConstants.foodPriceTypes.percent?discountValue+"%":discountValue}
        sign={discountType===AppConstants.foodPriceTypes.flat &&"AED"}
      />
      <DiscountComponent
        textColor={isExecutive ? AppColors.white : AppColors.darkGrey}
        bgColor={isExecutive ? AppColors.primaryGreen : AppColors.appLightGreen}
        heading={isExecutive ? "Your colleague gets your company discount of" : "Your friend gets"}
        price={percentType===AppConstants.foodPriceTypes.percent?percentDiscount+"%":percentDiscount}
        currency={"off any plan"}
        sign={percentType===AppConstants.foodPriceTypes.flat &&"AED"}
      />
    </div>
  )
}

export default DiscountedScreen
