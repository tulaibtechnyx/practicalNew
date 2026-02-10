import React from "react"
import { Button, Typography, useMediaQuery } from "@mui/material"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import AppRoutes from "helpers/AppRoutes"
import clsx from "clsx"
import get from "lodash/get"
import { useSelector } from "react-redux"
import { useState } from "react"
import { useEffect } from "react"
import AppConstants from "../../helpers/AppConstants"
import { walletAmountHandler } from "helpers/ShortMethods"
import Loader2 from "@components/loader/Loader2"
import ThemeLoader from "@components/ThemeLoader"
import Loader from "@components/loader"

const Price = ({
  paymentCheck,
  price,
  dataRec,
  checkOut,
  clicked,
  secStyle,
  renewal,
  checkoutDetails,
  placeOrderRequest,
  confirmBtnClicked,
  promoApplied,
  checkOutBody,
  error,
  resultPrice,
  subscriptionDiscount,
  userDiscount,
  loading,
  totalPrice, discDetails, isPriceDiscounted,
  disable,
  tabbycondition=false

}) => {
  const isSmallScreen = useMediaQuery('(max-width: 1400px)');
  const isExtraSmallScreen = useMediaQuery('(max-width: 1003px)');

  const { ticker } = useSelector((state) => state.home)
  const { isExecutive } = useSelector((state) => state.auth)
  const { orderSummary } = useSelector((state) => state.CheckOutReducer)

  const [tickerDataLocal, setTickerDataLocal] = useState(null)
  const [orderSummaryData, setOrderSummaryData] = useState(null)

  useEffect(() => {
    if (ticker) {
      setTickerDataLocal(ticker)
    }
  }, [ticker])

  useEffect(() => {
    if (orderSummary) {
      setOrderSummaryData(orderSummary)
    }
  }, [orderSummary])

  const walletAmount = get(tickerDataLocal, "wallet", 0)

  const handleShowPrice = () => {
    if (walletAmountHandler(price, walletAmount) < price) {
      return price - walletAmountHandler(price, walletAmount)
    } else if (price > 0) {
      return price
    } else {
      return 0
    }
  }

  // const handleBtnText = () => {
  //   let str = "Pay Now"
  //   if (walletAmount >= price && handleShowPrice() != 0) {
  //     str = "Pay From Wallet"
  //   } else if (handleShowPrice() == 0) {
  //     str = "Pay Now"
  //   }
  //   return str
  // }

  {/* <div className={`${styles.boxWrapper} ${secStyle ? 'sty2' : ''} ${isExecutive ? styles.isExecutive : ''}`}>
     <div className={styles.boxContent}> */}
  return (
    <div className={secStyle ? `${styles.boxWrapper} sty2` : styles.boxWrapper} style={{ backgroundColor: isExecutive ? "#FEF1EA" : "" }}>
      <div className={styles.boxContent}>
        <div className={styles.textBox}>
          <Typography
            variant={"h2"}
            className={styles.heading}
            sx={{ fontSize: "22px", color: isExecutive ? AppColors.black : AppColors.white }}
          >
            {checkoutDetails ? dataRec?.priceBox?.heading : "Total Price"}
          </Typography>

          {!promoApplied && !checkOutBody && !isExecutive && (
            <Typography
              variant={"body3"}
              component={"p"}
              className={styles.para}
              sx={{ color: isExecutive ? AppColors.black : AppColors.white }}
            >
              {subscriptionDiscount || userDiscount
                ? null
                : dataRec?.priceBox?.para}
            </Typography>
          )}
        </div>
        {
          !isPriceDiscounted ?
            <div style={{ borderColor: isExecutive ? AppColors.primaryOrange : "",
              backgroundColor: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen
             }} className={styles.priceBoxWrapper}>
              <div className={styles.priceBox} style={{  }}>
                <Typography
                  variant={"h1"}
                  className={styles.heading}
                  sx={{ color: isExecutive ? AppColors.black : AppColors.white, fontFamily: "AWConquerorInline" }}
                >
                  {/* {`${handleShowPrice()} AED`} */}
                  {`${price} AED`}
                </Typography>

                <Typography
                  variant={"body3"}
                  component={"p"}
                  className={styles.para}
                  sx={{ color: isExecutive ? AppColors.black : AppColors.white }}
                >
                  {dataRec?.priceBox?.bottomPara}
                </Typography>
              </div>
            </div>
            :
            <div style={{ borderColor: isExecutive ? AppColors.primaryOrange : "" }}
              className={clsx(styles.caloriesBox, styles.sty1)}>
              <div className={clsx(styles.MultiAmountBox, styles.isExecutive)}>

                <Typography className={styles.finalAmount}
                  sx={{ color: isExecutive ? AppColors.black : AppColors.white, fontFamily: "AWConquerorInline" }}
                >
                  {totalPrice ? Math.round(totalPrice) : "0"}  AED
                </Typography>
                <Typography className={styles.totalAmount} >
                  {discDetails?.totalAmount}
                </Typography>
                <Typography className={styles.percentage} >
                  -{discDetails?.percentNum}{discDetails?.symbol}
                </Typography>
              </div>
              <Typography
                className={styles.vat}
                variant="body3"
                component="p"
                sx={{ color: isExecutive ? AppColors.black : AppColors.white }}
              // color={AppColors.primaryGreen}
              >
                Including VAT
              </Typography>
            </div>
        }
        <div
          className={styles.priceBtn}
          style={{ display: paymentCheck == "paid" ? "none" : "block" }}
        >
          {checkOut ? (
            <>
            {/* {disable ? <Loader2/>: */}
              <Button
                onClick={clicked}
                variant="contained"
                sx={{
                  maxWidth: "231px",
                  width: "100%",
                  backgroundColor: isExecutive && disable?AppColors.white
                  :isExecutive && !disable  ? 
                  AppColors.primaryOrange 
                  : disable?AppColors.white
                  : AppColors.primaryGreen,
                  borderColor: AppColors.white,
                  // backgroundColor:isExecutive?AppColors.lightOrange:AppColors.primaryGreen,
                  "&:hover": {
                    color: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen,
                    backgroundColor: isExecutive ? AppColors.lightOrange : AppColors.white,
                    borderColor: isExecutive ? AppColors.primaryOrange : AppColors.white
                  }
                }}
                disabled={loading || disable}
                className={styles.buttonStyle}
              >
                <span >{disable? <ThemeLoader/>:
                  orderSummaryData?.wallet
                    ? walletAmount >= price
                      ? "Pay From Wallet"
                      : "Pay Now"
                    : "Pay Now"}
                  {/* {handleBtnText()} */}
                  {/* Pay Now */}

                </span>
              </Button>
              {tabbycondition &&
              <Button
                onClick={()=>clicked({tabby:true})}
                variant="contained"
                sx={{
                  maxWidth: "231px",
                  width: "100%",
                  backgroundColor: isExecutive && disable?AppColors.white
                  :isExecutive && !disable  ? 
                  AppColors.primaryOrange 
                  : disable?AppColors.white
                  : AppColors.primaryGreen,
                  borderColor: AppColors.white,
                  fontSize:'12px',
                  // backgroundColor:isExecutive?AppColors.lightOrange:AppColors.primaryGreen,
                  "&:hover": {
                    color: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen,
                    backgroundColor: isExecutive ? AppColors.lightOrange : AppColors.white,
                    borderColor: isExecutive ? AppColors.primaryOrange : AppColors.white
                  }
                }}
                disabled={loading || disable}
                className={styles.buttonStyle}
              >
                <span >{disable? <ThemeLoader/>:
                <>
                 <img
                     src="/images/icons/tabby.png"
                     alt="tabby"
                     style={{
                         height: '38px', 
                         display: 'block',
                         objectFit: 'contain',
                         float: 'right',
                         marginTop:'-5px'
                     }}
                 />
                  Pay with
                </>
                  }
                </span>
              </Button>
              }
              <Button
                href={AppRoutes.dashboard}
                disabled={loading || disable}
                variant="contained"
                sx={{
                  borderColor: isExecutive ? AppColors.primaryOrange : AppColors.white,
                  fontSize: isExtraSmallScreen ? '11px !important' : isSmallScreen ? '12px !important' : '15px !important',
                  backgroundColor: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen,
                  maxWidth: "231px",
                  width: "100%",
                  "&:hover":
                    isExecutive ?
                      {
                        color: AppColors.primaryOrange,
                        backgroundColor: AppColors.lightOrange,
                        borderColor: AppColors.primaryOrange,
                      } :
                      {
                        color: AppColors.primaryGreen,
                        backgroundColor: AppColors.white,
                        borderColor: `${AppColors.white} !important`,
                      }
                }}
                className={styles.buttonStyle}
              >
                <span>I want to change my order</span>
              </Button>
            </>
          ) : renewal ? (
            <Button
                disabled={loading || disable}
              // href={AppRoutes.checkOut}
              onClick={confirmBtnClicked}
              variant="contained"
              sx={{
                borderColor: isExecutive ? AppColors.primaryOrange : AppColors.white,
                  backgroundColor: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen,
                color: isExecutive ? AppColors.primaryOrange : AppColors.white,
                backgroundColor: isExecutive ? AppColors.white : AppColors.primaryGreen,
                "&:hover": {
                  color: isExecutive ? AppColors.white : AppColors.primaryGreen,
                  backgroundColor: isExecutive ? AppColors.primaryOrange : AppColors.white
                }
              }}
              className={styles.buttonStyle}
            >
              <span>Confirm & Pay</span>
            </Button>
          ) : checkoutDetails ? (
            <>
              <Button
                // href={AppRoutes.signup}
                onClick={() => placeOrderRequest()}
                disabled={loading || disable}
                variant="contained"
                sx={{
                  borderColor: AppColors.white,
                  marginBottom: "12px",
                  backgroundColor: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen,
                  fontSize: "12px !important",
                  maxWidth: "231px",
                  width: "100%",
                  "&:hover": {
                    color: AppColors.primaryGreen,
                    backgroundColor: AppColors.white
                  }
                }}
                className={styles.buttonStyle}
              >
                <span>
                  {/* {walletAmount >= price ? "Pay From Wallet" : "Pay Now"} */}
                  {/* {handleBtnText()} */}
                  {orderSummaryData?.wallet
                    ? walletAmount >= price
                      ? "Pay From Wallet"
                      : "Pay Now"
                    : "Pay Now"}
                  {/* Pay Now */}
                </span>
              </Button>
              <Button
                href={AppRoutes.dashboard}
                disabled={loading || disable}
                variant="contained"
                sx={{
                  borderColor: AppColors.white,
                  fontSize: "12px !important",
                  backgroundColor: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen,
                  maxWidth: "231px",
                  width: "100%",
                  "&:hover": {
                    color: AppColors.primaryGreen,
                    backgroundColor: AppColors.white
                  }
                }}
                className={styles.buttonStyle}
              >
                <span>I want to change my order</span>
              </Button>
            </>
          ) : (
            <Button
              href={AppRoutes.signup}
              disabled={error ? true : false}
              variant="contained"
              sx={{
                  backgroundColor: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen,
                borderColor: AppColors.white,
                "&:hover": {
                  color: AppColors.primaryGreen,
                  backgroundColor: AppColors.white
                },
                "&.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  backgroundColor: "transparent"
                }
              }}
              className={clsx(styles.buttonStyle, styles.sty2)}
            >
              <span>{dataRec?.priceBox?.btnTxt}</span>
            </Button>
          )}

        </div>
      </div>
    </div>
  )
}

Price.propTypes = {
  dataRec: PropTypes.any,
  price:  PropTypes.string
}
export default Price
