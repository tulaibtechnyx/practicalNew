import React, { useState } from "react"
import styles from "./style.module.scss"
import PromoNewBox from "./PromoNewBox"
import Typography from "@mui/material/Typography"
import AppColors from "helpers/AppColors"
import clsx from "clsx"
import { Box, Button, useMediaQuery } from "@mui/material"
import Equals from "../../../public/images/icons/equals.svg"
import AppRoutes from "../../helpers/AppRoutes"
import Tooltip from "@mui/material/Tooltip"
import { useSelector } from "react-redux"
import PromoDiscountFeild from "@components/promoDiscountFeild"
import SmallLoader from "@components/SmallLoader"
import ThemeLoader from "@components/ThemeLoader"
import { DiscountObjwrtWeek, getPromoCodeDiscountValueToDisplay, isDiscountNegative, pushToDataLayer, roundHalfDown } from "@helpers/CommonFunc"
import AppConstants from "@helpers/AppConstants"

const RecomendedResultNewPricing = ({
  InitialleastProteins,
  totalCalories,
  totalPrice,
  adjustedCalories,
  adjustedPrice,
  children,
  error,
  leastProteins,
  isPromoApplicable = false,
  discountData = {
    isDiscountApplied: false,
  },
  togglePromoPopup = () => { },
  discDetails = {},
  isDiscountApplied = false,
  appliedPromoCode = '',
  handleApplyPromo = () => { },
  loader = false,
  promoDetails = {},
  walletCredit = null,
  promoDetailsWeek = null,
  removeDiscountClick = () => { },
  refForPreferenceChangeBox,
  weekBasedDiscount=false

}) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  // const AmountSaved = discDetails?.AmountSaved;
  const AmountSaved = discDetails?.extra_discount_only ? discDetails?.extra_AmountSaved : discDetails?.AmountSaved;
  const [appliedPromoCodeState, setAppliedPromoCodeState] = useState("");
  const DiscountObj = DiscountObjwrtWeek(promoDetails, promoDetailsWeek);
  const isMyDiscountValueNegative = isDiscountNegative(promoDetails, promoDetailsWeek);
  const onMeals = promoDetails?.discount_on?.includes('meals');
  const onSnacks = promoDetails?.discount_on?.includes('snacks');
  const bothMealsAndSnacks = promoDetails?.discount_on?.includes('meals') && promoDetails?.discount_on?.includes('snacks');
  const renewalCondition = (promoDetails?.promo_restrictions == AppConstants?.promo_restrictions?.renewal_customers)
  const [isOptionsExpanded, setIsOptionsExpanded] = useState(false)
  const { isExecutive } = useSelector((state) => state.auth)
  const addClass = () => {
    setIsOptionsExpanded(!isOptionsExpanded)
  }
  const promoDiscountValueWRTWeekToDisplay = getPromoCodeDiscountValueToDisplay(promoDetails, promoDetailsWeek);
  const IsDiscountIsAppliedAndZero = discountData.isDiscountApplied && (promoDiscountValueWRTWeekToDisplay == '0' || promoDiscountValueWRTWeekToDisplay == 0);
  const promoSummaryTitle = promoDetails?.promo_code || appliedPromoCode || appliedPromoCodeState || '';
  const getDiscountMessage = () => {
    // if (weekBasedDiscount && !discountData.isDiscountApplied) {
    if ( !discountData.isDiscountApplied) {
      return `You saved ${roundHalfDown(AmountSaved)} AED just by choosing your plan — with our ongoing discounts`;
    }
    if ((promoDiscountValueWRTWeekToDisplay == 0 || IsDiscountIsAppliedAndZero || isMyDiscountValueNegative) && promoSummaryTitle) {
      return `Code ${promoSummaryTitle} is active`;
      // return ``;
    }

    if (!discountData.isDiscountApplied) {
      return "";
    }
    if (renewalCondition) {
      return `This discount is applicable only on renewal order`;
    }

    if (walletCredit) {
      return `Reward amount ${walletCredit?.rewardValue} AED will be credited to your wallet`;
    }
    // If both meals and snacks, but no cap
    if (bothMealsAndSnacks && !DiscountObj?.cap_amount && promoDiscountValueWRTWeekToDisplay) {
      return `This discount is up to ${promoDiscountValueWRTWeekToDisplay}${discDetails?.symbol}`;
    }
    const hasCap =
      DiscountObj?.cap_amount &&
      DiscountObj?.reward_type !== AppConstants.getDiscountRewardType.wallet_credit;

    if (hasCap) {
      if (bothMealsAndSnacks) {
        return `*This discount is up to ${promoDiscountValueWRTWeekToDisplay}${discDetails?.symbol}`;
      }
      if (onMeals) {
        return `*This discount is up to ${promoDiscountValueWRTWeekToDisplay}${discDetails?.symbol} and is applicable only on Meals`;
      }
      if (onSnacks) {
        return `*This discount is up to ${promoDiscountValueWRTWeekToDisplay}${discDetails?.symbol} and is applicable only on Snacks`;
      }
      return `*This discount is up to ${promoDiscountValueWRTWeekToDisplay}${discDetails?.symbol}`;
    }

    // No cap cases
    if (bothMealsAndSnacks) {
      return `*This discount is applicable on Meals & Snacks`;
    }
    if (onMeals) {
      return `*This discount is applicable only on Meals`;
    }
    if (onSnacks) {
      return `*This discount is applicable only on Snacks`;
    }

    return "";
  };
  const message = getDiscountMessage();

  const extrAmountCondition = (discDetails?.extra_AmountSaved > 0 && discDetails?.promoType == AppConstants.foodPriceTypes.percent) ;
  const AmountPayableToDisplay = 
  discDetails?.extra_discount_only || (discountData.isDiscountApplied && !IsDiscountIsAppliedAndZero && !isMyDiscountValueNegative) ?
  walletCredit ? typeof walletCredit?.combinedTotal == 'number' ? Math.round(walletCredit?.combinedTotal):'' 
  : discDetails?.extra_discount_only ? roundHalfDown(discDetails?.extra_finalPrice) :
  discDetails?.finalPrice ? roundHalfDown(discDetails?.finalPrice) : "0" : isMyDiscountValueNegative ? discDetails?.finalPrice : totalPrice ? Math.round(totalPrice) : ""
  console.log("AmountPayableToDisplay xxx",AmountPayableToDisplay)
  
  return (
    <div className={styles.recomendedSec}>
      <div className={styles.secWrap}>
        <Typography
          variant="h2"
          color={AppColors.white}
          className={styles.MainHead}
        >
          Our Recommendation
        </Typography>
        <div className={styles.CaloriesWrap}>
          {/* ===== 1. Left Box: Calories & Protein Info ===== */}
          <div className={styles.caloriesCount}>
            <Typography variant="body3" component="p" color={AppColors.white}>
              {isExecutive ? 'Daily Calories from PractiCal Executive:' : 'Total Daily Calories from PractiCal'}
            </Typography>

            <div className={styles.caloriesBox}>
              <Typography variant="h2" className={styles.heading}>
                {totalCalories ?? ""} CALORIES
              </Typography>

              {leastProteins && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Typography
                    color={AppColors.primaryGreen}
                    component="h6"
                    variant="caption"
                    style={{ fontSize: "14px" }}
                  >
                    Providing up to {InitialleastProteins}g of Protein
                  </Typography>

                  <div className={styles.Btn} style={{ marginLeft: "5px", paddingBottom: "3px" }}>
                    <Tooltip
                      leaveTouchDelay={10000000}
                      enterTouchDelay={50}
                      arrow
                      title="All of our Calorie-Counted & Macro-Balanced Meals are designed so that 25% of the Calories come from Protein. Our aim is that you enjoy a wide selection of delicious food options confident in the knowledge that no matter which one you choose you will not missing out on this crucial macro-nutrient."
                      className="toolTip sty2 style"
                      style={{ width: "17px", height: "17px", display: 'flex', justifyContent: "center", alignItems: "center" }}
                    >
                      <Button sx={{ fontSize: "12px" }}>
                        <span className="sm">i</span>
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ===== 2. Center: Equals Sign ===== */}
          <div className={clsx(styles.equal, isExecutive && styles.isExecutive)}>
            <Equals />
          </div>

          {/* ===== 3. Right Box: Price, Discount, and CTA ===== */}
          <div className={styles.caloriesCount}>
            {/* Heading */}
            <Typography variant="body3" component="p" color={AppColors.white}>
              {/* This heading is rendered in both discount and non-discount states */}
              {discountData.isDiscountApplied && !IsDiscountIsAppliedAndZero && !isMyDiscountValueNegative && isExecutive
                ? 'Total Price for the plan'
                : 'Total Price for the entire Meal Plan'}
            </Typography>

            {/* Price/Loader Box */}
            {(
              <div className={clsx(styles.caloriesBox, styles.sty1)}>
                {/* Wallet Credit or Discounted/Total Price Content */}
                {
                  loader ? (
                    <div className={styles.caloriesBox} style={{ zIndex: 99, height: '75px' }}>
                      <ThemeLoader top={'-4%'} isExecutive={true} />
                    </div>
                  ) 
                  :
                       discDetails || (discountData.isDiscountApplied && !IsDiscountIsAppliedAndZero && !isMyDiscountValueNegative) ? (
                        <>
                        <div className={clsx(styles.MultiAmountBox, styles.isExecutive)}>
                          <Typography className={styles.finalAmount}>
                           {discDetails?.total ? discDetails?.total : "0"}  AED
                          </Typography>
                          <Typography className={styles.totalAmount}>
                            {discDetails?.subtotal}
                            </Typography>
                          <Typography className={styles.percentage} >
                            {`${discDetails?.total_discount_amount} AED saved!` }
                          </Typography>
                        </div>
                        {
                            discDetails?.isWalletCredit &&
                            <>
                          <Typography className={styles.plausAmount} >
                          { `Plus...`}
                          </Typography>
                          <Typography color={AppColors.primaryOrange} className={styles.plausAmount} >
                            { `${discDetails?.wallet_credit_amount} AED added to your Wallet!`}
                          </Typography>
                            </>
                          }
                        </>
                      ) : (
                        // No Discount/Base Price UI
                        <Typography variant="h2" className={styles.heading}>
                          {isMyDiscountValueNegative ? discDetails?.finalPrice : totalPrice ? Math.round(totalPrice) : ""} AED
                        </Typography>
                      )}
                    <Typography
                        className={styles.vat}
                        variant="body3"
                        component="p"
                        color={AppColors.primaryOrange}
                      >
                        Including all Sign Up Discounts & VAT
                      </Typography>
                <div className={styles.ctaWrap}>
                  <Button
                    className={isExecutive ? styles.btnExecutive : ""}
                    sx={{ fontWeight: 700 }}
                    href={AppRoutes.signup}
                    disabled={error}
                    variant="outlined"
                    onClick={() => pushToDataLayer("cos-signup-cta")}
                  >
                    Sign Up
                  </Button>
                </div>


                {/* New Ui for want to change calorie */}

                  <div ref={refForPreferenceChangeBox} className={styles.MenuWrapper}>
                    <div className="OptionMenu">
                      <div
                        className={!isOptionsExpanded ? "open-option" : "close-option"}
                      >
                        <div className={styles.moreOptionsBar}>
                          <div className={styles.textWrapperstyles}>
                            <Typography
                              variant={"h2"}
                              component={"p"}
                              className={styles.para2}
                              sx={{ fontWeight: "500", color: AppColors.black }}
                            >
                              Want to change your selections?
                            </Typography>

                            <Box
                              onClick={addClass}
                              sx={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }} >
                              <Typography
                                variant={"h2"}
                                component={"p"}
                                className={styles.para}
                                sx={{ fontWeight: "500", color: AppColors.black, width: 'max-content !important' }}
                              >
                                Edit them right here
                              </Typography>
                              <img src='images/icons/arrowBlack.png' style={{ height: '17px', transform: isOptionsExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }} />
                            </Box>
                          </div>
                        </div>
                      </div>
                      <div className={styles.menuItems}>
                        <div className={isOptionsExpanded ? "option expanded" : "option"}>
                          <div className={styles.contentWrapper}>
                            {children ?? null}
                            {/* <div className={clsx(styles.ctaWrap, styles.sty1)}>
                              <Button
                                disabled={error ? true : false}
                                href={AppRoutes.signup}
                                variant="outlined"
                                onClick={() => { pushToDataLayer("cos-signup-cta") }}
                              >
                                Save Changes & Sign Up
                              </Button>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            )}

            {/* Message/Disclaimer (Common to all states) */}
            {/* {message && (
              <Typography
                className={styles.disclaimer}
                variant="body3"
                component="p"
                color={AppColors.white}
                sx={{
                  fontWeight: "300 !important",
                  marginBottom: (walletCredit || IsDiscountIsAppliedAndZero || isMyDiscountValueNegative) && '10px',
                }}
              >
                {message}
              </Typography>
            )} */}
          </div>
        </div>
        {isPromoApplicable && (
          <div style={{ marginTop: '10px' }}>
            <PromoDiscountFeild
              promoDetails={promoDetails}
              isPromoApplicable={true}
              isDiscountApplied={isDiscountApplied}
              handleApplyPromo={handleApplyPromo}
              appliedPromoCode={appliedPromoCode}
              appliedPromoCodeState={appliedPromoCodeState}
              setAppliedPromoCodeState={setAppliedPromoCodeState}
              removeDiscountClick={removeDiscountClick}
              loader={loader}
            />
          </div>

        )}

      </div>
    </div >
  )
}

export default RecomendedResultNewPricing
