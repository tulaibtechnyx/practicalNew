import React from "react"
import DiscountWeekComponent from "../../components/discountWeekComponent"
import AppColors from "helpers/AppColors"
import AppConstants from "helpers/AppConstants"
import { useSelector } from "react-redux"
import get from "lodash/get"
const discountedScreenWeek = ({ percentDiscount, discountValue, referalDataLocal=null }) => {
  // const isExecutive = AppConstants.isExecutive
  const { isExecutive } = useSelector((state) => state.auth)
  // const { freeFoodData } = useSelector((state) => state.home)
  const percentType = get(referalDataLocal, "friend_discount.type", "");
  const discountType = "percentage";

  const discountArr = referalDataLocal?.refer_discount_tier || [];
  const discount1Week = discountArr?.find((item => item.week === 1)) || null;
  const discount2Week = discountArr?.find((item => item.week === 2)) || null;
  const discount3Week = discountArr?.find((item => item.week === 4)) || null;


  return (
    <div className="discountedScreen">
      <DiscountWeekComponent
        textColor={AppColors.white}
        bgColor={isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen}
        heading={"1 Week Plan"}
        myPrice={Math.round(discount1Week?.referrer_amount)}
        price={Math.round(discount1Week?.reward_value) +"%"}
        sign={"AED"}
      />
      <DiscountWeekComponent
        textColor={AppColors.white}
        bgColor={isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen}
        heading={"2 Week Plan"}
        myPrice={Math.round(discount2Week?.referrer_amount)}
        price={Math.round(discount2Week?.reward_value) +"%"}
        sign={"AED"}
      />
      <DiscountWeekComponent
        textColor={AppColors.white}
        bgColor={isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen}
        heading={"4 Week Plan"}
        myPrice={Math.round(discount3Week?.referrer_amount)}
        price={Math.round(discount3Week?.reward_value) +"%"}
        sign={"AED"}
      />
      {/* <DiscountWeekComponent
        textColor={isExecutive ? AppColors.white : AppColors.darkGrey}
        bgColor={isExecutive ? AppColors.primaryGreen : AppColors.appLightGreen}
        heading={isExecutive ? "Your colleague gets your company discount of" : "Your friend gets"}
        price={percentType===AppConstants.foodPriceTypes.percent?percentDiscount+"%":percentDiscount}
        currency={"off any plan"}
        sign={percentType===AppConstants.foodPriceTypes.flat &&"AED"}
      /> */}
    </div>
  )
}

export default discountedScreenWeek
