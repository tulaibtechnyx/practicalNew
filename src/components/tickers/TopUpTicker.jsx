import React, { useState, useEffect } from "react"
import styles from "./style.module.scss"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import AppColors from "helpers/AppColors"
import { useRouter } from "next/router"
import AppRoutes from "helpers/AppRoutes"
import ConfirmationModal2 from "../popUp/confirmationModal2"
import { useSelector } from "react-redux"
import get from "lodash/get"
import {
  GetTickersRequest,
  addToWalletRequest,
  GetOrderHistory,
  UpcomingOrdersRequest
} from "../../store/reducers/dashboardReducer"
import { ProfileRequest } from "../../store/reducers/profileReducer"
import { useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import { showSuccessToast, showFaliureToast } from "../../helpers/AppToast"
import AppLogger from "helpers/AppLogger"
import AppConstants from "@helpers/AppConstants"

const TopUpTicker = ({ price, order_id, onPay, tabChange, setAddWallet, updatePrice }) => {
  // Rounding off price to nearest value: Bug Fixation
  price = typeof price == 'number'? Math.round(price):price
  const globalLoading = useSelector((state) => state.home.globalLoading);
  const { activeTabvalue } = useSelector(
    (state) => state.home
  )
  const TabValues = AppConstants?.TabValues;
  const { userDetails } = useSelector((state) => state.auth)

  const token = get(userDetails, "data.auth_token", null)

  const router = useRouter()
  const dispatch = useDispatch()

  const [totalPrice, setTotalPrice] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const [open, setOpen] = useState(false)

  const getTickersData = () => {
    try {
      setLoading(true)
      dispatch(GetTickersRequest({ token }))
        .then(unwrapResult)
        .then((res) => {
          setLoading(false)
          AppLogger("Response at getTickersData", res)
        })
        .catch((err) => {
          setLoading(false)
          AppLogger("Error at getTickersData", err)
        })
    } catch (error) {
          setLoading(false)
          console.log("err",error)
    }
  }

  const callUpcomingOrdersHandler = () => {
    try {
      dispatch(UpcomingOrdersRequest({ token }))
    } catch (error) {
      AppLogger("Error at callUpcomingOrdersHandler", error)
    }
  }

  const getUserProfileHandler = () => {
    try {
      dispatch(ProfileRequest({ token }))
        .then(unwrapResult)
        .then((res) => {
          AppLogger("Response at ProfileRequest", res)
        })
        .catch((err) => {
          AppLogger("Error at ProfileRequest", err)
          if (err == "Error: Request failed with status code 401") {
            logOutRequest()
            router.push(AppRoutes.login)
          }
        })
    } catch (err) {
      AppLogger("Error at getUserProfileHandler", err)
    }
  }

  useEffect(() => {
    if (message !== "") {
      showSuccessToast(message)
    }
  }, [message])

  const getOrderHistoryRequestHandler = () => {
    try {
      dispatch(GetOrderHistory({ token }))
        .then(unwrapResult)
        .then((res) => {
          // console.log("this is res========", res)
        })
        .catch((err) => {
          // console.log("this is err=======", err)
        })
    } catch (error) {
      AppLogger("Error at getOrderHistoryRequestHandler", error)
    }
  }

  const handleAddToWallet = () => {
    setLoading(true)
    try {
      dispatch(addToWalletRequest({ token }))
        .then(unwrapResult)
        .then((response) => {
          setMessage(response?.data?.message)
          getTickersData()
          getOrderHistoryRequestHandler()
          getUserProfileHandler()
          callUpcomingOrdersHandler()
          setLoading(false)
          setOpen(false)
          AppLogger("Response at handleAddToWallet", res)
        })
        .catch((err) => {
          setLoading(false)
          showFaliureToast(err?.response?.data?.message)
          setOpen(false)
          AppLogger("Error at handleAddToWallet", { ...err })
        })
    } catch (error) {
      setLoading(false)
      setOpen(false)
      AppLogger("Error at handleAddToWallet api", error)
    }
  }

  useEffect(() => {
    if (price) {
      setTotalPrice(price)
      setAddWallet({ addToWalletHandler: handleAddToWallet })
    }
  }, [price])

  const btnTextcolorOrange = false

  return (
    <div className="ticker-Active">
      <ConfirmationModal2
        onConfirmPress={handleAddToWallet}
        isDisabledBtn={loading}
        tabChange={tabChange?.handleTabChange}
        open={open}
        handleClose={() => setOpen(false)}
        cancelText={"No"}
        confirmText={"Yes"}
        totalPrice={totalPrice}
        modalBody={"will be credited to your Wallet."}
        modalTitle={"Confirm Add to Wallet"}
        disclaimer={
          "For more information on using the credit in your Wallet, please click "
        }
      />

      <Box
        className={styles.ticker_sec}
        style={{
          backgroundColor: "#FA7324"
        }}
      >
        <div className="tickerSM">
          <div className={styles.ticker_wrapper}>
            <div className={styles.content}>
              <Typography
                variant="h2"
                color={AppColors.white}
                style={{
                  color: AppColors.white
                }}
              >
                {loading? "Preferences Updating...":'Preferences Updated!'}
              </Typography>

              {totalPrice && totalPrice > 0 && (
                <Typography
                  variant="h2"
                  color={AppColors.white}
                  style={{
                    color: AppColors.white
                  }}
                >
                  Top Up payment required: {totalPrice} AED
                </Typography>
              )}
              {totalPrice && totalPrice < 0 && (
                <Typography
                  variant="h2"
                  color={AppColors.white}
                  style={{
                    color: AppColors.white
                  }}
                >
                  You’ve saved AED {Math.abs(totalPrice)}! Add this credit to
                  your Wallet to use later
                </Typography>
              )}
            </div>
            <div className={styles.btn_sec}>
              <Button
                  onClick={() => {
                    if (onPay) {
                      onPay()
                    } else {
                      updatePrice(order_id);
                      router.push(
                        `${AppRoutes.checkOut}?type=top up&order_id=${order_id}`
                      )
                    }
                  }}
                  variant="outlined"
                  className={styles.btn_small}
                  style={{
                    color: btnTextcolorOrange,pointerEvents:activeTabvalue===TabValues.EDIT_PREFERENCES && globalLoading?'none':'auto',
                  }}
                >
                  Pay Now
                </Button>
              {/* {totalPrice > 0 ? (
                <Button
                  onClick={() => {
                    if (onPay) {
                      onPay()
                    } else {
                      updatePrice(order_id);
                      router.push(
                        `${AppRoutes.checkOut}?type=top up&order_id=${order_id}`
                      )
                    }
                  }}
                  variant="outlined"
                  className={styles.btn_small}
                  style={{
                    color: btnTextcolorOrange
                  }}
                >
                  Pay Now
                </Button>
              ) : (
                <Button
                  onClick={() => setOpen(true)}
                  variant="outlined"
                  className={styles.btn_small}
                  style={{
                    color: btnTextcolorOrange
                  }}
                >
                  Add to Wallet
                </Button>
              )} */}
            </div>
          </div>
        </div>
      </Box>
    </div>
  )
}

export default TopUpTicker
