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
    promoCode,
    setpromoCode,
    promoDetails,
    setpromoDetails,
    isDiscountApplied,
    setIsDiscountApplied,
  } = props;

  let calories_prices = MealData?.calories_prices ?? [];
  let Units = {
    cal_unit: MealData?.cal_unit,
    price_unit: MealData?.price_unit
  }
  const router = useRouter();
  const { userDetails } = useSelector((state) => state.auth)
  const accessToken = get(userDetails, "data.auth_token", "")


  const dispatch = useDispatch()
  const matches = useMediaQuery("(max-width:767px)")
  
  // let promoCode=null;  
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
      storedData = JSON.parse(storedData)
      if (storedData) {
        setpromoDetails(storedData?.data)
        setIsDiscountApplied(true);
      }
    }
  }, []);

  function subtractPercentage(amount, percentage) {
    const discount = (amount * percentage) / 100;
    return amount - discount;
  }

  function showDiscountedPrice(Price, promoDetails) {
    let priceRefined = Number(Price);
    let promoValue = Number(promoDetails?.value);

    if (promoDetails?.type == AppConstants.foodPriceTypes.percent) {
      priceRefined = subtractPercentage(priceRefined, promoValue)
    } else {
      priceRefined = Price - promoValue
    }
    typeof priceRefined == 'number' ? priceRefined = Math.round(priceRefined) : priceRefined

    return priceRefined

  }
  let discountPriceUnit = promoDetails?.type == AppConstants.foodPriceTypes.percent ? '%' : "AED"

  const { isExecutive } = useSelector((state) => state.auth)

  const handleVerifyPromoCode = async (promoCode = '') => {
    try {
      const checkExecutive = window.location.hostname.split(".").find((item) => {
        return item == AppConstants.executive
      })
      let locationName = window.location.hostname;
      let ExecutiveCheck = locationName == 'localhost' ? isExecutive : checkExecutive == AppConstants.executive

      if (!promoCode) return;

      const response = await ApiResource.get(`/discount/${promoCode}?is_executive=${ExecutiveCheck ? 1 : 0}`);
      return get(response, "data", null);
    } catch (error) {
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


  return (
    <div className={styles.tabPanelContentWrapper}>

      {
        promoDetails ?
          <div className={styles.mealItemWrapper} style={{
            maxWidth: '379px',
          }}>
            {
              calories_prices?.map((meal, index) => (
                <div className={styles.mealItem} key={index}>
                  <Typography className={styles.mealItemData}>{`${meal?.calories} ${Units?.cal_unit}`}</Typography>
                  <div className={styles.mealItemData_Discount_price} >
                    <Typography className={styles.mealItemData}>{`${showDiscountedPrice(meal?.price, promoDetails)} ${Units?.price_unit}`}</Typography>
                    <Typography className={styles.mealItemData}>{`${meal?.price} ${Units?.price_unit}`}</Typography>
                    <Typography className={styles.mealItemData}> -{promoDetails?.value}{discountPriceUnit}</Typography>
                  </div>
                </div>
              ))
            }
          </div>
          :
          <div className={styles.mealItemWrapper}>
            {
              calories_prices?.map((meal, index) => (
                <div className={styles.mealItem} key={index}>
                  <Typography className={styles.mealItemData}>{`${meal?.calories} ${Units?.cal_unit}`}</Typography>
                  <Typography className={styles.mealItemData}>{`${meal?.price} ${Units?.price_unit}`}</Typography>
                </div>
              ))
            }
          </div>
      }

      <div className={styles.quizItemWrapper} style={{
        alignItems: accessToken && 'center',
        textAlign: accessToken && 'center',
        justifyContent: matches ? "start": 'center',
        minHeight: matches ? "100px":'300px',
        paddingBottom: matches ? "0px":'30px',
      }}>
        <PromoDiscountFeild
          isPromoApplicable={true}
          isDiscountApplied={isDiscountApplied}
          handleApplyPromo={onClickApplyPromoCode}
          appliedPromoCode={promoCode}
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
  )
}

export default TabPanelContent
