import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { logOutUserRequest } from "../../store/reducers/authReducer"
import { useRouter } from "next/router"
import { unwrapResult } from "@reduxjs/toolkit"
import {
  getBuildYourOwnData,
  getOrdersByCategoryIdRequest,
  getMyBuildYourOwnDataRequest,
  getSwapItemCategoriesRequest
} from "../../store/reducers/ordersReducer"
import PropTypes from "prop-types"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Typography from "@mui/material/Typography"
import AppRoutes from "helpers/AppRoutes"
import Box from "@mui/material/Box"
import TabContent from "./TabContent"
import SwipeComponent from "./SwapItem"
import AppLogger from "helpers/AppLogger"
import get from "lodash/get"
import { getPromoCodeDetailsAction } from "../../store/actions/promoCodeDetailsAction"
import AppConstants from "../../helpers/AppConstants"
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { getCache, removeItemsByPrefix, setCache } from "@helpers/CommonFunc"

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  }
}

export default function BasicTabs(props) {
  const { awesomepage , isExecutive} = props
  const dispatch = useDispatch()
  const router = useRouter()
  const { swapItemCategories } = useSelector((state) => state.orders)
  const { userDetails } = useSelector((state) => state.auth)
  const swapItemLoading = useSelector((state) => state.home.swapItemLoading);  
  console.log("swapItemLoading", swapItemLoading) 
  const token = get(userDetails, "data.auth_token", null)

  const {
    error,
    orderId,
    macroStatus,
    orderCalories,
    orderType,
    myBuildYourOwnData,
    parentOrderId,
  } = useSelector((state) => state.orders)

  // States
  const [value, setValue] = useState(0)
  const [allCategories, setAllCategories] = useState([])
  const [filteredCategories, setAllFilterCategories] = useState([])
  const [myBYOData, setMyBYOData] = useState(null)
  const [macroStatuss, setMacroStatus] = useState(false)
  const [currentType, setCurrentType] = useState("meal")
  const [swapCategoryState, setswapCategoryState] = useState(null)
  const [buildYourOwnDataState, setbuildYourOwnDataState] = useState(null)

  useEffect(() => {
    if (swapItemCategories) {
      setswapCategoryState(swapItemCategories)
    }
  }, [swapItemCategories])
  // Effects

  useEffect(() => {
    if (macroStatus !== null && macroStatus !== undefined) {
      setMacroStatus(macroStatus)
    }
  }, [macroStatus])

  useEffect(() => {
    if (myBuildYourOwnData) {
      setMyBYOData(myBuildYourOwnData)
    }
  }, [myBuildYourOwnData])

  useEffect(() => {
    if (orderType) {
      setCurrentType(orderType)
    }
  }, [orderType])

  useEffect(() => {
    if (currentType == "snack") {
      setMacroStatus(true)
    }
  }, [currentType])

  useEffect(() => {
    categoriesHandler();
    if(orderType && orderType == "meal"){
      getBuildYourOwnHandler()
    }
  }, [currentType, swapCategoryState])

  useEffect(() => {
    if (error) {
      if (error?.responseCode == 401) {
        // router.push('login')
        logoutRequest()
      }
    }
  }, [error])

  useEffect(() => {
    currentCategoryHandler()
  }, [macroStatus, allCategories])

  // useEffect(() => {
  //   tabsDataHandler()
  // }, [currentType])

  useEffect(() => {
    orderCategoryHandler()
  }, [currentType, allCategories])
    
  useEffect(() => {
    getSwapItemCategoriesHandler()
  }, [])

  const tabsDataHandler = () => {
    if (currentType == "snack") {
      getData(1, macroStatuss)
    }
  }

  const orderCategoryHandler = () => {
    // const data = []
    if (currentType == "snack") {
      const allCat = allCategories.filter((val) => val.key !== "byo")

      setAllFilterCategories(allCat)
    } else {
      setAllFilterCategories(allCategories)
    }
  }

  const getBuildYourOwnHandler = () => {
    try {
      const cacheKey = `getBYOData`;
      const cachedData = getCache(cacheKey);
  
      if (cachedData) {
        setbuildYourOwnDataState(cachedData)
        AppLogger("Serving from cache", cachedData);
        return;
          }
      const { auth_token } = userDetails?.data
      dispatch(
        getBuildYourOwnData({ token: auth_token, calories: orderCalories })
      )
        .then(unwrapResult)
        .then((res) => {
          setbuildYourOwnDataState(res?.data?.data)
          setCache(cacheKey, res?.data?.data, 1, AppConstants.CacheTime.hour); // Cache for 5 minutes
          AppLogger("Response at getBuildYourOwnData", res)
        })
        .catch((err) => {
          AppLogger("Error at getBuildYourOwnData", err)
        })
    } catch (err) {
      AppLogger("Error at getBuildYourOwnHandler", err)
    }
  }

  const getMyBYOsHandler = () => {
    try {
      const { auth_token } = userDetails?.data
      dispatch(
        getMyBuildYourOwnDataRequest({
          token: auth_token,
          calories: orderCalories
        })
      )
        .then(unwrapResult)
        .then((res) => {
          AppLogger("Response at getBuildYourOwnData", res)
        })
        .catch((err) => {
          AppLogger("Error at getBuildYourOwnData", err)
        })
    } catch (err) {
      AppLogger("Error at getBuildYourOwnHandler", err)
    }
  }

  const logoutRequest = () => {
    dispatch(logOutUserRequest())
      .then(unwrapResult)
      .then((res) => {
        router.push(AppRoutes.login)
        dispatch(getPromoCodeDetailsAction({}))
        sessionStorage.clear();
      })
      .catch((err) => {
        AppLogger("Error at logOutUserRequest", err)
      })
  }

    const categoriesHandler = () => {
    try {
      const { meal_categories, snack_categories } = swapCategoryState

      if (currentType == "snack") {
        if (snack_categories) {
          setAllCategories(snack_categories)
          setMacroStatus(true)
        }
      } else {
        if (meal_categories) {
          setAllCategories(meal_categories)
        }
      }
    } catch (err) {
      AppLogger("Error at categoriesHandler", err)
    }
  }

  const getSwapItemCategoriesHandler = () => {
    try {
      const { auth_token } = userDetails?.data;
      const cacheKey = `swapCategory`;
      const cachedData = getCache(cacheKey);
    
        if (cachedData) {
           setswapCategoryState(cachedData)
          AppLogger("Serving from cache", cachedData);
          return;
            }
      dispatch(
        getSwapItemCategoriesRequest({ token: auth_token, order_id: parentOrderId})
      )
        .then(unwrapResult)
        .then((res) => {
          setswapCategoryState(res?.data?.data)
          setCache(cacheKey, res?.data?.data, 1, AppConstants.CacheTime.hour); // Cache for 5 minutes
          AppLogger("Response at getSwapItemCategoriesHandler", res)
        })
        .catch((err) => {
          AppLogger("Error at getSwapItemCategoriesHandler", err)
        })
    } catch (err) {
      AppLogger("Error at getSwapItemCategoriesHandler", err)
    }
  }

  const currentCategoryHandler = () => {
    const currentCategory = allCategories[value]
    AppLogger("this is current category=======", currentCategory)
    if (currentCategory && (currentType == currentCategory.key || currentCategory.key === 'favorite')) {
      getData(currentCategory.id, currentType == "snack" ? true : macroStatus)
    }
    // } else {
    // getData(value + 1, macroStatus)
    // }
  }
  const [currentData, setCurrentData] = useState([])

  const getData = (id, macroStatus) => {
    try {
      const cacheKey = `orders_${id}_${macroStatus}`;
      const cachedData = getCache(cacheKey);
      if (cachedData) {
        AppLogger("Serving from cache", cachedData);
        setCurrentData(cachedData)
        return;
      }
  
      const { auth_token } = userDetails?.data

      if (auth_token) {
        dispatch(
          getOrdersByCategoryIdRequest({
            token: auth_token,
            categoryId: id,
            mbStatus: macroStatus,
            orderId: orderId
          })
        )
          .then(unwrapResult)
          .then((res) => {
            setCurrentData(res?.data?.data)
            setCache(cacheKey, res?.data?.data, 5, AppConstants.CacheTime.min ); // Cache for 5 minutes
            AppLogger("Response at getOrdersByCategoryIdRequest", res)
          })
          .catch((err) => {
            AppLogger("Error at getOrdersByCategoryIdRequest", err)
          })
      }
    } catch (err) {
      AppLogger("Error at getData", err)
    }
  }

  const handleChange = (event) => {
    setValue(event)
    let currentCategory = null
    // if (currentType == "meal") {
    // currentCategory = allCategories[event - 1]
    // } else {
    currentCategory = allCategories[event]
    // }

    AppLogger("This is current cateogry=======", currentCategory)

    if (currentCategory && currentCategory.key !== 'my_byo' && currentCategory.key !== 'byo') {
      getData(currentCategory.id, macroStatuss)
    }else if(currentCategory && currentCategory.key == 'my_byo'){
      getMyBYOsHandler()
    }
  }
  const {mealSwap}=useSelector(state=>state?.orders)
  useEffect(() => {
  
    return () => {
      removeItemsByPrefix('orders')
      removeItemsByPrefix('getBYOD')
      removeItemsByPrefix('swap')
    }
  }, [])

  return (
    <Box sx={{ width: "100%" }}>
      <Box className={`tabsWrapper sty1 ${isExecutive ? "isExecutive" : ''}`}>
        <div className="container container--custom">
          <Tabs
            value={value}
            onChange={(e, newValue) => handleChange(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
            style={{pointerEvents:swapItemLoading? "none":'auto'}}
          >
            {/* {currentType !== "snack" && (
              <Tab className="icons" label="Build Your Own" {...a11yProps(0)} />
            )} */}
            {filteredCategories.length > 0 &&
              filteredCategories.map((category, index) => 
                {
                  const conditionIcon = mealSwap == AppConstants.meal && category?.key == AppConstants.snack ? true : false 
                  return(
                <Tab
                  key={index}
                  className="icons"
                  label={conditionIcon ? 
                  <Box sx={{display:'flex',alignItems:'center',gap:'5px'}}>
                      {category.title}
                    <img src="/images/meal/dollarred.svg" alt='dollarred' style={{width:'18px',marginBottom:'3px'}} />
                  </Box> : category.title}
                  {...a11yProps(index)}
                />
              )})}

            {/* <Tab className="icons" label="Breakfast" {...a11yProps(1)} />
            <Tab className="icons" label="Wraps" {...a11yProps(2)} />
            <Tab className="icons" label="Bagels" {...a11yProps(3)} />
            <Tab className="icons" label="Eggs" {...a11yProps(4)} />
            <Tab className="icons" label="Salad & Poke" {...a11yProps(5)} /> */}
          </Tabs>
        </div>
      </Box>

      {/* {currentType !== "snack" && (
        <TabPanel value={value} index={0}>
          <TabContent />
        </TabPanel>
      )} */}
      {filteredCategories.length >= 0 &&
        filteredCategories.map((category, index) => {
          return (
            <TabPanel key={index} value={value} index={index}>
              {category.key == "byo" ? (
                currentType !== "snack" && (
                  <TabContent
                  buildYourOwnData={buildYourOwnDataState}
                  awesomepage={awesomepage} isExecutive={isExecutive}/>
                )
              ) : category.key == "my_byo" && currentType !== "snack" ? (
                <SwipeComponent
                handleChange={handleChange}
                  myBYOData={myBYOData}
                  awesomepage={awesomepage}
                  currentType={currentType}
                  getMyBYOsHandler={getMyBYOsHandler}
                  token={token}
                  isExecutive={isExecutive}
                  currentData={currentData}
                  setCurrentData={setCurrentData}
                />
              ) : (
                <SwipeComponent
                handleChange={handleChange}
                  awesomepage={awesomepage}
                  currentType={currentType}
                  token={token}
                  value={value}
                  categoryKey={category.key}
                  isExecutive={isExecutive}
                  macroStatuss={macroStatuss}
                  getData={getData}
                  currentData={currentData}
                  setCurrentData={setCurrentData}
                />
              )}
            </TabPanel>
          )
        })}
    </Box>
  )
}
