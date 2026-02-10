import React, { useEffect, useState } from 'react';
import styles from './style.module.scss';
import { Typography, Button, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import get from "lodash/get"
import AppConstants from '@helpers/AppConstants';
import PromoDiscountFeild from '@components/promoDiscountFeild';
import ApiResource from "../../services/api/api"
import { showFaliureToast } from '@helpers/AppToast';
import { getPromoCodeDetailsAction } from 'store/actions/promoCodeDetailsAction';
import { performAddPromoCode } from 'store/actions/promoCodeAction';
import AppLogger from '@helpers/AppLogger';
import moment from 'moment';

const TabPanelContent = (props) => {
  const { MealData,
    isDiscountApplied,
    setIsDiscountApplied,
    promoCodefromDash
  } = props;

  const [promoCode, setpromoCode] = useState(null)  ;
  const [promoDetails, setpromoDetails] = useState(null)  ;
  let calories_prices = MealData?.calories_prices ?? [];
  let Units = {
    cal_unit: MealData?.cal_unit,
    price_unit: MealData?.price_unit
  }
  const router = useRouter();
  const { userDetails } = useSelector((state) => state.auth)
  const accessToken = get(userDetails, "data.auth_token", "")
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [loader, seloader] = useState(false);

  const dispatch = useDispatch()
  const matches = useMediaQuery("(max-width:767px)")

  useEffect(() => {
    if (promoCodefromDash) {
      onClickApplyPromoCode(promoCodefromDash )
    }
  }, [promoCodefromDash]);
  useEffect(() => {
    // Check if we're running on the client (browser)
    if (typeof window !== 'undefined') {
      // Retrieve session data
      const storedData = sessionStorage.getItem('promoCode');
      if (storedData) {
        setpromoCode(JSON.parse(storedData))
        setIsDiscountApplied(true);
      }
    }
  }, []);

  useEffect(() => {
    // Check if we're running on the client (browser)
    if (typeof window !== 'undefined') {
      // Retrieve session data
      let storedData = sessionStorage.getItem('promoDetails');
      storedData = JSON.parse(storedData?.data ? storedData?.data : storedData);
      if (storedData) {
        setpromoDetails(storedData?.data ? storedData?.data : storedData)
        setIsDiscountApplied(true);
      }
    }
  }, []);

  function subtractPercentage(amount, percentage) {
    const discount = (amount * percentage) / 100;
    return amount - discount;
  }

  // function showDiscountedPrice(Price, promoDetails) {
  //   let priceRefined = Number(Price);
  //   let promoValue = Number(promoDetails?.value);

  //   if (promoDetails?.type == AppConstants.foodPriceTypes.percent) {
  //     priceRefined = subtractPercentage(priceRefined, promoValue)
  //   } else {
  //     priceRefined = Price - promoValue
  //   }
  //   typeof priceRefined == 'number' ? priceRefined = Math.round(priceRefined) : priceRefined

  //   return priceRefined

  // }
  function showDiscountedPrice(Price, promoDetails, selectedWeek) {
    let priceRefined = Number(Price);
    const type = promoDetails?.promo_type;
    const refrealType = type === AppConstants?.promoCodeTypes?.referral_friend;
    // pick plan
    const discountPlanLengths = refrealType
      ? (promoDetails?.referral_discount || [])
      : (promoDetails?.discount_plan_lengths || []);
    const matchingPlan = discountPlanLengths?.find(
      (item) => Number(refrealType ? item?.week : item?.plan_length) == selectedWeek
    );

    if (!matchingPlan) {
      return priceRefined; // No discount for the selected plan length
    }

    const promoValue = Number(matchingPlan?.reward_value);
    const rewardType = refrealType ?
      promoDetails?.type ? promoDetails?.type :
        promoDetails?.reward_type ? promoDetails?.reward_type :
          matchingPlan?.reward_type :
      matchingPlan?.reward_type;


    if (rewardType === AppConstants.foodPriceTypes.percent) {
      const discount = (priceRefined * promoValue) / 100;
      priceRefined = priceRefined - discount;
    } else if (rewardType === AppConstants.foodPriceTypes.flat) {
      priceRefined = priceRefined - promoValue;
    }
    return {
      discountedPrice: Math.round(priceRefined),
      discountPriceUnit: rewardType === 'percentage' ? '%' : Units?.price_unit,
      discountAmount: promoValue
    }
  }
  // let discountPriceUnit = promoDetails?.type == AppConstants.foodPriceTypes.percent ? '%' : "AED"
  // let selectedPlanDiscount = promoDetails?.discount_plan_lengths?.find(plan => Number(plan?.plan_length) == selectedWeek);

  const { isExecutive } = useSelector((state) => state.auth)

  const handleVerifyPromoCode = async (promoCode = '') => {
    try {
      const checkExecutive = window.location.hostname.split(".").find((item) => {
        return item == AppConstants.executive
      })
      let locationName = window.location.hostname;
      let ExecutiveCheck = locationName == 'localhost' ? isExecutive : checkExecutive == AppConstants.executive

      if (!promoCode) return;
      seloader(true);
      const response = await ApiResource.get(`/discount/${promoCode}?is_executive=${ExecutiveCheck ? 1 : 0}`);
      seloader(false);
      return get(response, "data", null);
    } catch (error) {
      seloader(false);
      AppLogger("Error at handleVerifyPromoCode", error);
      return null;
    }
  }
  const isPromoValid = (promoDetails) => {
    try {
      if (!promoDetails) {
        showFaliureToast('Invalid Promo Code');
        return false
      };
      if (moment(promoDetails?.expiry_date).isBefore(moment())) {
        // Promo has expired
        showFaliureToast('The applied promo code has expired');
        return false
      }
      return true
    } catch (error) {
      AppLogger("Error at isPromoValid", error)
      return false;
    }
  }
  const handleInvalidPromoCode = () => {
    setIsDiscountApplied(false);
    // showFaliureToast('Invalid Promo Code');
    if (promoDetails) dispatch(getPromoCodeDetailsAction({}));
    if (promoCode) dispatch(performAddPromoCode(''));
    setpromoDetails(null)
    setpromoCode('')
    sessionStorage.clear();
  }
  const onClickApplyPromoCode = async (promoCode = '') => {


    const promoDetails = await handleVerifyPromoCode(promoCode);
    const isPromoValidAndApplicable = isPromoValid(get(promoDetails, 'data', null));

    if (!isPromoValidAndApplicable) return handleInvalidPromoCode();

    // dispatch(getPromoCodeDetailsAction(promoDetails));
    // dispatch(performAddPromoCode(get(promoDetails, 'data.promo_code', '')));
    setpromoCode(promoCode)

    // sessionStorage.setItem('promoDetails', JSON.stringify(promoDetails));
    // sessionStorage.setItem('promoCode', JSON.stringify(promoCode));

    setpromoDetails(get(promoDetails, 'data', null))
    setIsDiscountApplied(true);
  }
  const [selectedPlanDiscount, setSelectedPlanDiscount] = useState(null);
  const [removePromoCode, setremovePromoCode] = useState(false);
  // useEffect(() => {
  //   if (promoDetails) {
  //     const discount = promoDetails.discount_plan_lengths.find(
  //       (plan) => Number(plan.plan_length) === selectedWeek
  //     );
  //     setSelectedPlanDiscount(discount);
  //     if (!discount) {
  //       showFaliureToast('No discount for Week ' + selectedWeek);
  //     }
  //   } else {
  //     setSelectedPlanDiscount(null);
  //   }
  // }, [selectedWeek, promoDetails]);
  useEffect(() => {
    if (promoDetails) {
      setSelectedPlanDiscount(promoDetails);
      if (!promoDetails) {
        showFaliureToast('No discount for Week ' + selectedWeek);
        setremovePromoCode(true)
        setpromoCode(null)
        setpromoDetails(null)
      }
    } else {
      setSelectedPlanDiscount(null);
    }
  }, [promoDetails]);
  return (
    <div className={styles.tabPanelContentWrapper} style={{ transition: '0.3s ease' }}>

      <div className={styles.mealItemWrapper} style={{ maxWidth: '379px', transition: '0.3s ease' }}>
        {calories_prices?.map((meal, index) => {

          // Determine if discount logic should be shown for this iteration
          const showDiscount = selectedPlanDiscount;

          // Calculate discount details (only if applicable, avoids errors)
          const { discountedPrice, discountPriceUnit, discountAmount } = showDiscount
            ? showDiscountedPrice(meal?.price, promoDetails, selectedWeek)
            : {};

          return (
            <div className={styles.mealItem} key={index}>
              <Typography className={styles.mealItemData}>
                {`${meal?.calories} ${Units?.cal_unit}`}
              </Typography>

              {/* 2. Consistent price container */}
              <div className={styles.mealItemData_Discount_price}>

                {/* 2a. Discounted Price / Regular Price (if no discount) */}
                <Typography className={styles.mealItemData}>
                  {`${showDiscount ? discountedPrice : meal?.price} ${Units?.price_unit}`}
                </Typography>

                <div
                  className={styles.discountDetails}
                  style={{
                    // Apply transition and conditionally change opacity based on discount
                    transition: 'opacity 0.3s ease, max-width 0.3s ease',
                    opacity: showDiscount ? 1 : 0,
                    // Use max-width to smooth the space taken
                    maxWidth: showDiscount ? '200px' : '0px',
                    overflow: 'hidden',
                    display: 'flex',
                  }}
                >
                  {/* Original Price - className should apply line-through */}
                  <Typography className={`${styles.mealItemData} ${styles.originalPrice}`}>
                    {`${meal?.price} ${Units?.price_unit}`}
                  </Typography>
                  {/* Discount Value */}
                  <Typography className={styles.mealItemData} style={{color: '#FAD036',textDecoration:'none'}}>
                    -{discountAmount}{discountPriceUnit}
                  </Typography>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >

        <div className={styles.quizItemWrapper} style={{
          alignItems: accessToken && 'center',
          textAlign: accessToken && 'center',
          justifyContent: matches ? "start" : 'center',
          minHeight: matches ? "100px" : '300px',
          paddingBottom: matches ? "0px" : '30px',
        }}>
          <PromoDiscountFeild
            loader={loader}
            isPromoApplicable={true}
            isDiscountApplied={isDiscountApplied}
            handleApplyPromo={onClickApplyPromoCode}
            appliedPromoCode={promoCode}
            removePromoCode={removePromoCode}
            removeDiscountClick={() => {
              handleInvalidPromoCode()
              setpromoCode(null)
              setpromoDetails(null)
            }}
          />
          {
            accessToken ?
              <></>
              :
              <>
                <Typography className={styles.quizDescription} sx={{ mt: 4 }}>Unsure of how many
                  calories are right for you?</Typography>
                <Button className={styles.quizButton}
                  onClick={() => {
                    router.push('/')
                  }}
                >Take our Quiz</Button>
              </>
          }
        </div>
      </div>
    </div>
  )
}

export default TabPanelContent
