import React, { useState } from "react"
import styles from "./style.module.scss"
import PromoNewBox from "./PromoNewBox"
import Typography from "@mui/material/Typography"
import AppColors from "helpers/AppColors"
import clsx from "clsx"
import { Box, Button } from "@mui/material"
import Equals from "../../../public/images/icons/equals.svg"
import AppRoutes from "../../helpers/AppRoutes"
import Tooltip from "@mui/material/Tooltip"
import { useSelector } from "react-redux"
import PromoDiscountFeild from "@components/promoDiscountFeild"
import SmallLoader from "@components/SmallLoader"
import ThemeLoader from "@components/ThemeLoader"
import { DiscountObjwrtWeek, getFormattedCapAmount, getPromoCodeDiscountValueToDisplay, isDiscountNegative, pushToDataLayer, roundHalfDown } from "@helpers/CommonFunc"
import AppConstants from "@helpers/AppConstants"

const RecomendResult = ({
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
    if (!discountData.isDiscountApplied) {
      return `You saved ${roundHalfDown(AmountSaved)} AED just by choosing your plan — with our ongoing discounts`;
    }

    if((promoDiscountValueWRTWeekToDisplay == 0 || IsDiscountIsAppliedAndZero || isMyDiscountValueNegative)&&promoSummaryTitle){
      return `Code ${promoSummaryTitle} is active`;
      // return ``;
    }

    if (!discountData.isDiscountApplied) {
      return "(not including any discounts yet!)";
    }
    if (renewalCondition) {
      return `This discount is applicable only on renewal order`;
    }

    // if (walletCredit) {
    //   return `Reward amount ${walletCredit?.rewardValue} AED will be credited to your wallet`;
    // }
    if (walletCredit) {
      return ""
    }
    // If both meals and snacks, but no cap
    if (bothMealsAndSnacks && !DiscountObj?.cap_amount && promoDiscountValueWRTWeekToDisplay) {
      return `This discount is up to ${promoDiscountValueWRTWeekToDisplay}${discDetails?.symbol}`;
    }
    const hasCap =
      DiscountObj?.cap_amount &&
      DiscountObj?.reward_type !== AppConstants.getDiscountRewardType.wallet_credit;
    const CappedAmount = getFormattedCapAmount(DiscountObj?.cap_amount)
    if (hasCap) {
      if (bothMealsAndSnacks) {
        return `*This discount is up to ${promoDiscountValueWRTWeekToDisplay}${discDetails?.symbol}. There is a ${CappedAmount} AED cap on this discount.`;
      }
      if (onMeals) {
        return `*This discount is up to ${promoDiscountValueWRTWeekToDisplay}${discDetails?.symbol}. It is applicable only on Meals There is a ${CappedAmount} AED cap on this discount.`;
      }
      if (onSnacks) {
        return `*This discount is up to ${promoDiscountValueWRTWeekToDisplay}${discDetails?.symbol}. It is applicable only on Snacks There is a ${CappedAmount} AED cap on this discount.`;
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
          <div className={styles.caloriesCount}>
            {
              isExecutive ?
                <Typography variant="body3" component="p" color={AppColors.white}>
                  Daily Calories from PractiCal Executive:
                </Typography>
                :
                <Typography variant="body3" component="p" color={AppColors.white}>
                  Total Daily Calories from PractiCal
                </Typography>


            }

            <div className={styles.caloriesBox}>
              <Typography variant="h2" className={styles.heading}>
                {totalCalories ?? ""} CALORIES
              </Typography>
              {leastProteins && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Typography
                    color={AppColors.primaryGreen}
                    component={"h6"}
                    variant="caption"
                    style={{ fontSize: "14px" }}
                  >
                    Providing up to {InitialleastProteins}g of Protein
                  </Typography>
                  <div
                    className={styles.Btn}
                    style={{
                      marginLeft: "5px",
                      paddingBottom: "3px"
                    }}
                  >
                    <Tooltip
                      leaveTouchDelay={10000000}
                      enterTouchDelay={50}
                      arrow
                      title="All of our Calorie-Counted & Macro-Balanced Meals are designed so that 25% of the Calories come from Protein. Our aim is that you enjoy a wide selection of delicious food options confident in the knowledge that no matter which one you choose you will not missing out on this crucial macro-nutrient."
                      className="toolTip sty2 style"
                      style={{
                        width: "17px",
                        height: "17px",
                        display: 'flex',
                        justifyContent: "center",
                        alignItems: "center",
                      }}
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
          <div className={`${styles.equal} ${isExecutive ? styles.isExecutive : ''}`}>
            <Equals />
          </div>
          {

            (discDetails?.total_discount_amount ||(discountData.isDiscountApplied && !IsDiscountIsAppliedAndZero && !isMyDiscountValueNegative)) ?
              <div className={styles.caloriesCount}>
                {
                  isExecutive ?
                    <Typography variant="body3" component="p" color={AppColors.white}>
                      Total Price for the plan
                    </Typography> :
                    <Typography variant="body3" component="p" color={AppColors.white}>
                      Total Price for the entire Meal Plan
                    </Typography>
                }

                {
                  loader ?
                    <div className={styles.caloriesBox} style={{ zIndex: 99, height: '75px' }}>
                      {/* <SmallLoader /> */}
                      <ThemeLoader top={'-4%'} isExecutive={true} />
                    </div>
                    :
                    // walletCredit ?
                    //   <div className={clsx(styles.caloriesBox, styles.sty1)} >
                    //     <Typography variant="h2" className={styles.heading}>
                    //       {typeof walletCredit?.combinedTotal == 'number' ? Math.round(walletCredit?.combinedTotal) : ''} AED
                    //     </Typography>
                    //     <Typography
                    //       className={styles.vat}
                    //       variant="body3"
                    //       component="p"
                    //       color={AppColors.primaryGreen}
                    //     >
                    //       Including VAT
                    //     </Typography>
                    //     <Typography className={styles.plausAmount} sx={{my:'6px'}}>
                    //       { `Plus...`}
                    //     </Typography>
                    //     <Typography color={AppColors.primaryOrange} className={styles.plausAmount}>
                    //       { `${AmountSaved} AED added to your Wallet!`}
                    //     </Typography>
                    //   </div>
                    //   :
                      // discDetails?.extra_discount_only ?
                      // <div className={clsx(styles.caloriesBox, styles.sty1)}>
                      //   <div className={clsx(styles.MultiAmountBox, styles.isExecutive)}>

                      //     <Typography className={styles.finalAmount}>
                      //       {discDetails?.extra_finalPrice ? roundHalfDown(discDetails?.extra_finalPrice) : "0"}  AED
                      //     </Typography>
                      //     <Typography className={styles.totalAmount} >
                      //       {discDetails?.extra_totalAmount}
                      //     </Typography>
                      //     <Typography className={styles.percentage} >
                      //       {/* -{promoDiscountValueWRTWeekToDisplay ? promoDiscountValueWRTWeekToDisplay : discDetails?.percentNum}{discDetails?.symbol} */}
                      //       {`${AmountSaved} AED saved!` }
                      //     </Typography>
                      //   </div>
                      //   <Typography
                      //     className={styles.vat}
                      //     variant="body3"
                      //     component="p"
                      //     color={AppColors.primaryOrange}
                      //   >
                      //     Including Sign Up Discounts & VAT
                      //   </Typography>

                      // </div>:
                      <div className={clsx(styles.caloriesBox, styles.sty1)}>
                        <div className={clsx(styles.MultiAmountBox, styles.isExecutive)}>
                          <Typography className={styles.finalAmount}>
                            {discDetails?.total ? discDetails?.total : "0"}  AED
                          </Typography>
                          <Typography className={styles.totalAmount} >
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
                        <Typography
                          className={styles.vat}
                          variant="body3"
                          component="p"
                          color={AppColors.primaryOrange}
                          sx={{mt:'6px !important'}}
                        >
                          Including Sign Up Discounts & VAT
                        </Typography>

                      </div>
                }

                {/* {message && (
                  <Typography
                    className={styles.disclaimer}
                    variant="body3"
                    component="p"
                    color={AppColors.white}
                    sx={{
                      fontWeight: "300 !important",
                      marginBottom: walletCredit && '10px'
                    }}
                  >
                    {message}
                  </Typography>
                )} */}

              </div> 
              :

              <div className={styles.caloriesCount}>

                <Typography variant="body3" component="p" color={AppColors.white}>
                  Total Price for the entire Meal Plan
                </Typography>
                {
                  loader ?
                    <div className={styles.caloriesBox} style={{ zIndex: 99, height: '75px' }}>
                      {/* <SmallLoader /> */}
                      <ThemeLoader top={'-4%'} isExecutive={true} />
                    </div>
                    :
                    <div className={clsx(styles.caloriesBox, styles.sty1)}>
                      <Typography variant="h2" className={styles.heading} style={{color:AppColors.primaryOrange}}>
                        {/* {isMyDiscountValueNegative ? discDetails?.finalPrice : totalPrice ? Math.round(totalPrice) : ""} AED */}
                        {AmountPayableToDisplay} AED
                      </Typography>
                      <Typography
                        className={styles.vat}
                        variant="body3"
                        component="p"
                        color={AppColors.primaryOrange}
                      >
                        Including all Sign Up Discounts & VAT
                      </Typography>{
                        walletCredit &&
                      <Typography
                        className={styles.vat}
                        variant="body3"
                        component="p"
                        color={AppColors.primaryGreen}
                      >
                        {`Plus ${AmountSaved} AED added to your Wallet!`}
                      </Typography>
                      }
                    </div>}
                {/* {

                  <Typography
                    className={styles.disclaimer}
                    variant="body3"
                    component="p"
                    color={AppColors.white}
                    sx={{ fontWeight: "300 !important" }}
                  >
                    {
                      IsDiscountIsAppliedAndZero || isMyDiscountValueNegative ?
                        message :
                        `(not including any discounts yet!)`
                    }
                  </Typography>
                } */}
              </div>

          }
        </div>
        {/* {isPromoApplicable && (
          <div className={styles.ctaWrap}>
            <Button
              className={isExecutive ? `${styles.btnExecutive} ${styles.promoButton}` : `${styles.promoButton}`}
              sx={{ fontWeight: 500 }}
              onClick={() => togglePromoPopup(true)}
              disabled={error ? true : false}
              variant="outlined"
            >
              {discountData.isDiscountApplied ? "Promo Applied" : "Have Promo code?"}
            </Button>
          </div>
        )} */}
      
        <div className={styles.ctaWrap}>
          <Button
            className={isExecutive ? styles.btnExecutive : ""}
            sx={{ fontWeight: 700 }}
            href={AppRoutes.signup}
            disabled={error ? true : false}
            variant="outlined"
            onClick={() => pushToDataLayer("cos-signup-cta")}
          >
            Sign Up
          </Button>
        </div>
        {/* New Ui for want to change calorie */}
        <div ref={refForPreferenceChangeBox} className={styles.MenuWrapper}>
          {/* <div className="OptionMenu"> */}
          <Box
            className={!isOptionsExpanded ? "open-option" : "close-option"}

            sx={{
              backgroundColor: 'white',
              padding: { md: isOptionsExpanded ? '0px 0px 20px 0px':'0px', xs: '0px 20px' },
              // mx:{xs:'20px',xs:'20px'},
              borderRadius: { md: '24px', xs: '16px' },
              maxWidth: { md: '100%', xs: '90%' },
              mx: 'auto'
            }}
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
                  <img src='images/icons/arrowBlack.png' style={{ height: '20px', transform: isOptionsExpanded ? 'rotate(0deg)' : 'rotate(180deg)'}} />
                </Box> </div>
            </div>
            <Box sx={{ display: isOptionsExpanded ? "block" : 'none' }} >
              <div className={styles.contentWrapper} style={{ backgroundColor: 'white' }}>
                {children ?? null}
                {/* {
                    isExecutive ?
                      <Typography
                        variant="h2"
                        color={AppColors.black}
                        className={styles.MainHead}
                      >
                        Your New Adjusted Daily Calories from PractiCal Executive
                      </Typography> :

                      <Typography
                        variant="h2"
                        color={AppColors.black}
                        className={styles.MainHead}
                      >
                        Your New Adjusted Daily Calories from PractiCal

                      </Typography>

                  } */}


                {/* <div className={clsx(styles.CaloriesWrap, styles.sty1)}>
                    <div className={styles.caloriesCount}>
                      {
                        isExecutive ?
                          <Typography
                            variant="body3"
                            component="p"
                            color={AppColors.black}
                          >
                            Daily Calories from PractiCal Executive:
                          </Typography>
                          :
                          <Typography
                            variant="body3"
                            component="p"
                            color={AppColors.black}
                          >
                            Total number of Calories
                          </Typography>

                      }


                      <div className={styles.caloriesBox}>
                        <Typography variant="h2" className={styles.heading}>
                          {adjustedCalories ?? ""} CALORIES
                        </Typography>
                        {leastProteins && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                          >
                            <Typography
                              color={AppColors.primaryGreen}
                              component={"h6"}
                              variant="caption"
                              style={{ fontSize: "14px" }}
                            >
                              Providing up to {leastProteins}g of Protein
                            </Typography>
                            <div
                              className={styles.Btn}
                              style={{
                                marginLeft: "5px",
                                paddingBottom: "3px"

                              }}
                            >
                              <Tooltip
                                leaveTouchDelay={10000000}
                                enterTouchDelay={50}
                                arrow
                                title="All of our Calorie-Counted & Macro-Balanced Meals are designed so that 25% of the Calories come from Protein. Our aim is that you enjoy a wide selection of delicious food options confident in the knowledge that no matter which one you choose you will not missing out on this crucial macro-nutrient."
                                className="toolTip sty2 style"
                                style={{
                                  width: "17px",
                                  height: "17px",
                                  display: 'flex',
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              >
                                <Button>
                                  <span className="sm">i</span>
                                </Button>
                              </Tooltip>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`${styles.equal} ${styles.sty2} ${isExecutive ? styles.isExecutive : ''}`}>
                      <Equals />
                    </div>
                    <div className={styles.caloriesCount}>
                      {
                        isExecutive ?
                          <Typography
                            variant="body3"
                            component="p"
                            color={AppColors.black}
                          >
                            Total Price for the plan

                          </Typography> :
                          <Typography
                            variant="body3"
                            component="p"
                            color={AppColors.black}
                          >
                            Total Price for the entire Meal Plan

                          </Typography>

                      }


                      {
                        loader ?
                        <div className={clsx(styles.caloriesBox, styles.sty2)} style={{height: '70px',zIndex:99}}>
                          <ThemeLoader top={'-15%'} />
                        </div>  
                        :
                        discountData.isDiscountApplied && !IsDiscountIsAppliedAndZero && !isMyDiscountValueNegative? 
                         walletCredit ? 
                          <div className={clsx(styles.caloriesBox, styles.sty2)}>
                            <Typography variant="h2" className={styles.heading}>
                              { typeof walletCredit?.combinedTotal == 'number' ? Math.round(walletCredit?.combinedTotal):''} AED
                            </Typography>
                            <Typography
                              className={styles.vat}
                              variant="body3"
                              component="p"
                              color={AppColors.primaryGreen}
                            >
                              Including VAT
                            </Typography>
                          </div>
                          :
                          <div className={clsx(styles.caloriesBox, styles.sty2)}>
                            <div className={styles.MultiAmountBox}>
                              <Typography className={styles.finalAmount}>
                                {discDetails?.finalPrice ? roundHalfDown(discDetails?.finalPrice) : ""}  AED
                              </Typography>
                              <Typography className={styles.totalAmount} >
                                {discDetails?.totalAmount}
                              </Typography>
                              <Typography className={styles.percentage} >
                                -{promoDiscountValueWRTWeekToDisplay ? promoDiscountValueWRTWeekToDisplay : discDetails?.percentNum}{discDetails?.symbol}
                              </Typography>
                            </div>
                            <Typography
                              className={styles.vat}
                              variant="body3"
                              component="p"
                              color={AppColors.primaryGreen}
                            >
                              Including VAT
                            </Typography>
                          </div>
                          :
                          <div className={clsx(styles.caloriesBox, styles.sty2)}>
                            <Typography variant="h2" className={styles.heading}>
                              {isMyDiscountValueNegative ? discDetails?.finalPrice : adjustedPrice ? Math.round(adjustedPrice) : ""} AED
                            </Typography>
                            <Typography
                              className={styles.vat}
                              variant="body3"
                              component="p"
                              color={AppColors.primaryGreen}
                            >
                              Including VAT
                            </Typography>
                          </div>
                      }
                        {message && (
                          <Typography
                            className={styles.disclaimer}
                            variant="body3"
                            component="p"
                                  color={AppColors.primaryGreen}
                                    sx={{ fontWeight: "300 !important" }}
                          >
                            {message}
                          </Typography>
                        )
                      }
                    </div>
                  </div> */}
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
            </Box>
          </Box>
          {/* </div> */}
        </div>
          {isPromoApplicable && (
          <div>
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

export default RecomendResult
