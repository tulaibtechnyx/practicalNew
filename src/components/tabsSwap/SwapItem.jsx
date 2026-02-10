import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/router"
import {
  swapItemRequest,
  swapMyBuildYourOwnRequest,
  deleteMyBYORequest,
  editMyBYORequest,
  onFavouriteClickRequest
} from "store/reducers/ordersReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import { showFaliureToast } from "../../helpers/AppToast"
import $ from "jquery"

import styles from "./style.module.scss"
import Button from "@mui/material/Button"
import Mealdetails from "../mealDetails"
import AppRoutes from "helpers/AppRoutes"
import AppLogger from "helpers/AppLogger"
import { Box, Link, Typography } from "@mui/material"
import { UpcomingOrdersRequest, setSwapItemLoading } from "store/reducers/dashboardReducer"

export default function SwapItem({
  currentType,
  awesomepage,
  myBYOData,
  getMyBYOsHandler,
  handleChange,
  token,
  value,
  isExecutive,
  categoryKey = '',
  macroStatuss,
  getData,
  currentData,
  setCurrentData
}) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { loading, orders, orderId, error } = useSelector(
    (state) => state.orders
  )
  const { userDetails } = useSelector((state) => state.auth)

  const [loadingState, setLoadingState] = useState(false)
  console.log('loadingState', loadingState)
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [swapped, setSwapped] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)

  useEffect(() => {
    document.body.classList.remove("tickerON"); // Replaced jQuery with vanilla JS
    if (loading === "pending") {
      setLoadingState(true);
      dispatch(setSwapItemLoading(true))
        .then(unwrapResult)
        .catch((err) => {
          console.error("Error dispatching setSwapItemLoading(true):", err);
        });
    } else {
      setLoadingState(false);
      dispatch(setSwapItemLoading(false))
        .then(unwrapResult)
        .catch((err) => {
          console.error("Error dispatching setSwapItemLoading(false):", err);
        });
    }
  }, [loading, dispatch]);
  useEffect(() => {
    // commenting as we getting data from cache remove if u want on tab click
    // if (orders) {
    //   setCurrentData(orders)
    // }
    if (myBYOData) {
      setCurrentData(myBYOData)
    }
  }, [orders, myBYOData])

  const selectedMealHandler = (meal) => {
    setSwapped(true)
    setSelectedMeal(meal)
    swipeHandler(meal)
  }

  const selectedBYOHandler = (meal) => {
    setSwapped(true)
    setSelectedMeal(meal)
    swapMyBYOHandler(meal)
  }

  useEffect(() => {
    if (currentData.length === 0) {
      setIsEmpty(true)
    } else {
      setIsEmpty(false)
    }
  }, [currentData.length])

  // useEffect(() => {
  //   if (currentData.length === 0) {
  //     setIsEmpty(true)
  //   } else {
  //     setIsEmpty(false)
  //   }
  // }, [currentData])

  const swipeHandler = (meal) => {
    try {
      const { auth_token } = userDetails?.data
      setSwapped(false)
      document.querySelector("html").classList.add("nprogress-busy")
      dispatch(
        swapItemRequest({
          token: auth_token,
          mealId: meal?.id,
          orderId: orderId
        })
      )
        .then(unwrapResult)
        .then((res) => {
          setSwapped(true)
          if(token){
            dispatch(UpcomingOrdersRequest({ token })).then(() => {
              document.querySelector("html").classList.remove("nprogress-busy")
              router.push(AppRoutes.dashboard);
            })
          }
          AppLogger("Response at swapItemRequest", res)
        })
        .catch((err) => {
          document.querySelector("html").classList.remove("nprogress-busy")
          showFaliureToast(err.response?.data?.message);
          AppLogger("Error at swapItemRequest", err)
        })
    } catch (err) {
      AppLogger("Error at swipeHandler", err)
    }
  }

  const swapMyBYOHandler = (meal) => {
    try {
      const { auth_token } = userDetails?.data
      setSwapped(false)
      document.querySelector("html").classList.add("nprogress-busy")
      dispatch(
        swapMyBuildYourOwnRequest({
          token: auth_token,
          swapMyBYOBody: {
            byo_id: meal?.id,
            order_id: orderId
          }
        })
      )
        .then(unwrapResult)
        .then((res) => {
          setSwapped(true)
          if(token){
            dispatch(UpcomingOrdersRequest({ token })).then(() => {
              document.querySelector("html").classList.remove("nprogress-busy")
              router.push(AppRoutes.dashboard);
            })
          }
          AppLogger("Response at swapMyBYOHandler", res)
        })
        .catch((err) => {
          document.querySelector("html").classList.remove("nprogress-busy")
          showFaliureToast(err.response?.data?.message);
          AppLogger("Error at swapMyBYOHandler", err)
        })
    } catch (err) {
      AppLogger("Error at swapMyBYOHandler", err)
    }
  }

  const deleteMyBYOHandler = (byo_id) => {
    try {
      const { auth_token } = userDetails?.data
      dispatch(
        deleteMyBYORequest({
          token: auth_token,
          byo_id: byo_id
        })
      )
        .then(unwrapResult)
        .then(() => {
          getMyBYOsHandler()
          AppLogger("Response at deleteMyBYOHandler", res)
        })
        .catch((err) => {
          AppLogger("Error at deleteMyBYOHandler", err)
        })
    } catch (err) {
      AppLogger("Error at swipeHandler", err)
    }
  }

  const editMyBYOHandler = (byo_id, name) => {
    try {
      const { auth_token } = userDetails?.data
      if (auth_token) {
        dispatch(
          editMyBYORequest({
            token: auth_token,
            byo_id,
            name
          })
        )
          .then(unwrapResult)
          .then(() => {
            getMyBYOsHandler()
            AppLogger("Response at editMyBYORequest", res)
          })
          .catch((err) => {
            AppLogger("Error at editMyBYORequest", err)
          })
      }
    } catch (err) {
      AppLogger("Error at editMyBYORequest", err)
    }
  }
  
  /*const handleOnFavouriteClick = (e, meal) => {
    e.stopPropagation()
    try {
      const payload = { token: token, meal: {meal_id: meal.id} }
      setLoadingState(true);
      dispatch(
        onFavouriteClickRequest(payload)
      ).then(unwrapResult)
        .then(res => {
          AppLogger("Response on onFavouriteClickRequest", res)
          //setLoadingState(false);
          handleChange(value);
          
      }).catch((err) => {
        AppLogger("Error at onFavouriteClickRequest", err)
        setLoadingState(false)
      })
    } catch (err) {
      showFaliureToast(err?.response?.data?.message)
      AppLogger("Error at handleOnFavouriteClick", err)
    }
  }*/
  return (
    <div className={`${styles.mealDetailWrapper} ${isExecutive ? styles.isExecutive : ''}`}>
      {!loadingState ? (
        <div className="container container--custom">
          {currentData.length > 0 ? (
            <div className={styles.mealWrap}  >
              {currentData.map((meal, index) => {
                if (myBYOData) {
                  return (
                    <Mealdetails
                      awesomepage={awesomepage}
                      swapped={swapped}
                      onSwapClick={swapMyBYOHandler}
                      selectMeal={selectedBYOHandler}
                      selectedMeal={selectedMeal}
                      key={index}
                      isMyBYO={true}
                      meal={meal}
                      editMyBYOHandler={editMyBYOHandler}
                      deleteMyBYOHandler={deleteMyBYOHandler}
                      errorMessage={errorMessage}
                      currentType={currentType ?? ''}
                      isExecutive={isExecutive}
                      //handleOnFavouriteClick={handleOnFavouriteClick}
                    />
                  )
                } else {
                  return (
                    <Mealdetails
                      awesomepage={awesomepage}
                      swapped={swapped}
                      onSwapClick={swipeHandler}
                      selectMeal={selectedMealHandler}
                      selectedMeal={selectedMeal}
                      key={index}
                      meal={meal}
                      currentType={currentType ?? ''}
                      //handleOnFavouriteClick={handleOnFavouriteClick}
                      token={token}
                      categoryKey={categoryKey}
                      isExecutive={isExecutive}
                      macroStatuss={macroStatuss}
                      getData={getData}

                    />
                  )
                }
              })}
            </div>
          ) : <>
            {!myBYOData ? (
              <div style={{ textAlign: "center ", minHeight: '70vh' }}>
                {
                loadingState ? 
                  <p >
                    Loading {currentType === "snack" ? "Snacks" : "Meals"}
                  </p>
                :
                isEmpty && (
                  <p >
                    No {currentType === "snack" ? "Snacks" : "Meals"} Found
                  </p>
                )}
              </div>
            ) : (
              myBYOData.length == 0 && (
                <Box sx={{ textAlign: "center", minHeight: '70vh' }}>
                  <Typography>
                    You can view your personal ,Build Your Own Meals here. Right now,
                    you have no Build Your Own Meals saved.
                    <br />{" "}
                    <Link
                      sx={{
                        display: "inline",
                        cursor: "pointer",
                        color: isExecutive ? "#fa7324" : "",
                        textDecorationColor: isExecutive ? "#fa7324" : "black",
                      }}
                      onClick={() => {
                        handleChange(1)
                      }}
                    >
                      Click here
                    </Link>{" "}
                    to make your own Build Your Own Meal
                  </Typography>
                </Box>
              )
            )}
          </>}

          {currentData.length > 0 && (
            <div className={styles.ctawrapper}>
              {awesomepage ? null : (
                <Button
                  onClick={() => {
                    localStorage.removeItem("currentDate")
                    router.push("dashboard")
                  }}
                  variant="outlined"
                >
                  Back
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <p style={{ 
          textAlign: "center",
          minHeight: '70vh'
         }}>Loading</p>
      )}
    </div>
  )
}
