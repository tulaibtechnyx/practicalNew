import React from "react"
import DiscountWeekComponentNewUi from "../../components/discountWeekComponentNewUi"
import DiscountWeekComponent from "../../components/discountWeekComponent"
import AppColors from "helpers/AppColors"
import AppConstants from "helpers/AppConstants"
import { useSelector } from "react-redux"
import get from "lodash/get"
import { Box } from "@mui/material"
const DiscountedScreenWeekNewUi = ({ percentDiscount, discountValue, referalDataLocal = null, loader = false }) => {
  const { isExecutive } = useSelector((state) => state.auth)
  const discountArr = referalDataLocal?.refer_discount_tier || [];
  const discount1Week = discountArr?.find((item => item.week === 1)) || null;
  const discount2Week = discountArr?.find((item => item.week === 2)) || null;
  const discount3Week = discountArr?.find((item => item.week === 4)) || null;

  const referalDiscountForExe = referalDataLocal?.referral_discount?.parent|| null;
  const youGetreferalDiscountForExe = referalDataLocal?.refer_discount_tier?.find((item => item?.week == '4')) || null;
  const exeDisWeek4 = referalDiscountForExe?.discount_plan_lengths?.find((item => item?.plan_length == '4')) || null;

  return (
    <div className="discountedScreen" >
      {
        loader ?
          <Box sx={{ display: 'flex', alignItems: 'center', minHeight: '300px', width: '100%' }}>
            <LoaderSmall
              isExecutive={isExecutive}
              type={"discount"}
              matchType={"discount"}
            />
          </Box>
          :
          isExecutive ?
            <DiscountWeekComponentNewUi
              textColor={AppColors.white}
              bgColor={isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen}
              heading={"1 Week Plan"}
              // myPrice={Math.round(discount1Week?.referrer_amount)}
              myPrice={Math.round(youGetreferalDiscountForExe?.incentive_amount )}
              price={Math.round(exeDisWeek4?.reward_value)}
              sign={"AED"}
            />
            :
            <>
              <DiscountWeekComponentNewUi
                textColor={AppColors.white}
                bgColor={isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen}
                heading={"1 Week Plan"}
                // myPrice={Math.round(discount1Week?.referrer_amount)}
                myPrice={Math.round(discount1Week?.referrer_amount)}
                price={Math.round(discount1Week?.client_facing_value)}
                sign={"AED"}
              />
              <DiscountWeekComponentNewUi
                textColor={AppColors.white}
                bgColor={isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen}
                heading={"2 Week Plan"}
                // myPrice={Math.round(discount2Week?.referrer_amount)}
                myPrice={Math.round(discount2Week?.referrer_amount)}
                price={Math.round(discount2Week?.client_facing_value)}
                sign={"AED"}
              />
              <DiscountWeekComponentNewUi
                textColor={AppColors.white}
                bgColor={isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen}
                heading={"4 Week Plan"}
                // myPrice={Math.round(discount3Week?.referrer_amount)}
                myPrice={Math.round(discount3Week?.referrer_amount)}
                price={Math.round(discount3Week?.client_facing_value)}
                sign={"AED"}
              />
            </>
      }
      {/* <DiscountWeekComponentNewUi
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

export default DiscountedScreenWeekNewUi
const LoaderSmall = (props) => {
  const { isExecutive, type, matchType } = props
  return (
    <Box className={`lds-ellipsis ${isExecutive ? 'isExecutive' : ''}`} style={{ display: "block", position: 'relative', left: { md: '5%', xs: '8%' }, top: '0%' }}>
      <div ></div>
      <div ></div>
      <div ></div>
      <div ></div>
    </Box>
  )
}