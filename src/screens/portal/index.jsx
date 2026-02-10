import React, { useState, useEffect } from "react"
import MealDistrubution from "../../components/mealDistrubution"
import PropTypes from "prop-types"
import { animateScroll as scroll } from "react-scroll"
import { Box, Button } from "@mui/material"
import BackTo from "../../../public/images/icons/backtotop.svg"
import AppRoutes from "helpers/AppRoutes"
import { useRouter } from "next/router"
import { useDispatch, useSelector } from "react-redux"
import get from "lodash/get"
import { updatePriceRequest } from "store/reducers/dashboardReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import AppLogger from "helpers/AppLogger"
import AppConstants from "helpers/AppConstants"
import AddItemsScreen from "../../screens/AddItems"
import Loader2 from "../../components/loader/Loader2"

const Portal = ({
  currentWeek,
  updated,
  weekChanged,
  order_id,
  type,
  isOrderReady,
  token,
  isRenewedPlan,
  weekCopied,
  setWeekCopied,
  AddItemsBool=false,
  setAddItems=()=>{},
  setValue=()=>{},
  setMealDate=()=>{},
}) => {
  const { ticker } = useSelector((state) => state.home)
  const { userDetails, isExecutive } = useSelector((state) => state.auth)
  const [isVisible, setIsVisible] = useState(false)
  const [tickerDataLocal, setTickerData] = useState(null)
  const paymentStatus = get(tickerDataLocal, "payment_status", "")
  const price = get(tickerDataLocal, "price", "")
  const accessToken = get(userDetails, "data.auth_token", null)
  useEffect(() => {
    if (ticker) {
      setTickerData(ticker)
    }
  }, [ticker])

  const router = useRouter()
  const dispatch = useDispatch()
  useEffect(() => {
    const handleScroll = () => {
      // Calculate the current scroll position
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0

      // Determine whether the button should be visible based on the scroll position
      setIsVisible(scrollTop > 200) // Change "100" to the desired scroll threshold for when the button should become visible
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    function handleScroll() {
      setScrollPosition(
        window.pageYOffset || document.documentElement.scrollTop
      )
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // console.log(scrollPosition, "scrollPosition")

  const scrollFn = () => {
    scroll.scrollTo(0)
  }

  const updatePrice = (order_id) => {
    try {
      if (accessToken && order_id) {
        dispatch(updatePriceRequest({ token: accessToken, order_id }))
          .then(unwrapResult)
          .then((res) => {
            AppLogger("Response at updatePriceRequest", res)
          })
          .catch((err) => {
            AppLogger("Error at updatePriceRequest", err)
          })
      }
    } catch (error) {
      AppLogger("Error at updatePriceRequestHandler", error)
    }
  }
  // const isExecutive = AppConstants.isExecutive
  const [firstOpenDate, setFirstOpenDate] = useState(null)
  // const [AddItemsBool, setAddItems] = useState(false)
  return (
    <div className="sec-Portal">
      <div className="container container--custom">
        {/* {
          AddprotienLoader ?
          <Loader2 /> : '' 
        } */}
        {/* {
          AddItemsBool ?
            <AddItemsScreen
              isExecutive={isExecutive}
            /> :
            <MealDistrubution
              token={token}
              firstOpenDate={firstOpenDate}
              setFirstOpenDate={setFirstOpenDate}
              weekChanged={weekChanged}
              updated={updated}
              currentWeek={currentWeek}
              isRenewedPlan={isRenewedPlan}
              isOrderReady={isOrderReady}
              weekCopied={weekCopied}
              setWeekCopied={setWeekCopied}
            />
        } */}
         <MealDistrubution
              token={token}
              firstOpenDate={firstOpenDate}
              setFirstOpenDate={setFirstOpenDate}
              weekChanged={weekChanged}
              updated={updated}
              currentWeek={currentWeek}
              isRenewedPlan={isRenewedPlan}
              isOrderReady={isOrderReady}
              weekCopied={weekCopied}
              setWeekCopied={setWeekCopied}
              setAddItems={setAddItems}
              AddItemsBool={AddItemsBool}
              setValue={setValue}
              setMealDate={setMealDate}
            />
        {/* <Box sx={{ display: 'flex', justifyContent: 'center' }} >
          <Box
            className="custom_Button"
            sx={{
              textTransform: "capitalize",
              padding: "10px 20px !important",
              width: 'max-content !important',
              mb: '10px'
            }}
            variant="contained"
            onClick={() => {
              setAddItems(!AddItemsBool)
            }
            }
          >
            {!AddItemsBool ? 'Add items to plan' : 'Go back'}
          </Box>
        </Box> */}
        {paymentStatus == "unpaid" && price > 0 && (
          <div className={`paybtn ${isExecutive ? "isExecutive" : ""}`}>
            <Button
              className="paynow-btn"
              sx={{
                // display: isVisible ? "block" : "none ",
                textTransform: "capitalize"
              }}
              variant="contained"
              onClick={() => {
                updatePrice(order_id);
                router.push(
                  `${AppRoutes.checkOut}?type=${type}&order_id=${order_id}`
                )
              }
              }
            >
              Pay Now
            </Button>
          </div>
        )}
        {scrollPosition >= 1000 ? (
          <Button
            className={`ToTop ${isExecutive ? "isExecutive" : ""}`}
            sx={{
              display: isVisible ? "block " : "none ",
              textTransform: "capitalize"
            }}
            onClick={scrollFn}
          >
            <BackTo />
          </Button>
        ) : null}
      </div>
    </div>
  )
}
Portal.propTypes = {
  currentWeek: PropTypes.string
}

export default Portal
