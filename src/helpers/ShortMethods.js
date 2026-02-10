import { call } from "redux-saga/effects"
import AppMetaConstant from "./AppMetaConstant"
import { useRouter } from "next/router"
import AppLogger from "helpers/AppLogger"
import moment from "moment"
import _ from "lodash"
import AppConstants from "./AppConstants"
import { animateScroll as scroller } from "react-scroll"
import { roundHalfDown } from "./CommonFunc"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";


export function responseHandler(response) {
  try {
    AppLogger("Response at responseHandler", response)
  } catch (err) {
    null
  }
}

export function* apiResponseHandler(call_function, payload) {
  try {
    const response = yield call(call_function, payload)
    const { status, data } = response
    if (status === 200 || status === 201) {
      return { isSuccess: true, response, data }
    } else if (status === 500) {
      return { isSuccess: false, message: "Internal Server Error" }
    } else if (status === 401) {
      return { isSuccess: false, message: "UnAuthenticated" }
    } else if (status === 408) {
      return { isSuccess: false, message: "Request Timeout" }
    } else {
      return { isSuccess: false, message: "Server Issue", body: {} }
    }
  } catch (exception) {
    const errorMessage = "Server Error"

    return { isSuccess: false, message: errorMessage, body: {} }
  }
}

export function IsEnglish() {
  const router = useRouter()
  return router?.locale === "en" ? true : false
}

export const getLoggedInHeader = (Accesstoken) => {
  // return { Accept: "Application/json", Authorization: "Bearer " + Accesstoken }
  return { Authorization: "Basic " + Accesstoken }
}

export const removeSlash = (str) => {
  if (str.charAt(0) == "/") {
    str = str.substr(1)
  }
  return str
}

export const getSubscriptionDiscount = (subscriptionDiscount) => {
  var subDiscount = ""
  if (subscriptionDiscount) {
    subDiscount = (
      (get(subscriptionDiscount, "value", "") / 100) *
      subTotal
    ).toFixed(2)
  }
  return subDiscount
}

export const percentCalculation = (number, percentToCount) => {
  const parsedNumber = parseFloat(number);
  const parsedPercent = parseFloat(percentToCount);
  
  if (isNaN(parsedNumber) || isNaN(parsedPercent)) {
    return 0;
  }

  const percent = (parsedNumber * parsedPercent) / 100;
  
  return percent.toFixed(2);
};

export const userDiscountHandler = (totalPrice, userDiscount) => {
  try {
    if (userDiscount && totalPrice) {
      if (userDiscount.type == "flat") {
        return userDiscount.value
      } else {
        var percent =
          (parseFloat(totalPrice) * parseFloat(userDiscount.value)) / 100
        // return parseFloat(Math.round(percent))
        return parseFloat(percent).toFixed(2)
      }
    }
  } catch (err) {
    console.log("Error at user DiscountHandler = ====", err)
  }
}

export const extractWeekNumber = (str) => {
  const weekString = str.slice(5) // Remove "week_" prefix
  const weekNumber = parseInt(weekString, 10) // Parse the remaining string as an integer
  return weekNumber
}

export const calculateTotalDays = (orders, type) => {
  try {
    let allData = []
    if (type == "upcoming") {
      orders?.map((order) => {
        const groups = order?.data?.reduce((groups, datee) => {
          if (datee?.is_pause) {
            return groups
          }
          const date = moment(datee?.delivery_date).format("YYYY-MM-DD")
          if (!groups[date]) {
            groups[date] = []
          }
          groups[date].push(datee)
          return groups
        }, {})
        const pastGroups = order?.past_data?.reduce((groups, datee) => {
          if (datee?.is_pause) {
            return groups
          }
          const date = moment(datee?.delivery_date).format("YYYY-MM-DD")
          if (!groups[date]) {
            groups[date] = []
          }
          groups[date].push(datee)
          return groups
        }, {})

        // Edit: to add it in the array format instead
        Object.keys(groups)?.map((val) => {
          allData.push(val)
        })
        if (pastGroups) {
          Object.keys(pastGroups)?.map((val) => {
            allData.push(val)
          })
        }
      })
    } else if (type == "renewal") {
      orders?.map((order) => {
        const groups = order?.data?.reduce((groups, datee) => {
          if (datee?.is_pause) {
            return groups
          }
          const date = moment(datee?.delivery_date).format("YYYY-MM-DD")
          if (!groups[date]) {
            groups[date] = []
          }
          groups[date].push(datee)
          return groups
        }, {})

        // Edit: to add it in the array format instead
        Object.keys(groups)?.map((val) => {
          allData.push(val)
        })
      })
    }

    return allData?.length
  } catch (error) {
    AppLogger("error at calculateTotalDays", error)
  }
}

export const isProductionServer = () => {
  const nonProdKeywords = ["uat", "uat-portal", "dev", "dev-portal"];
  return !nonProdKeywords.some(keyword => baseUrl.includes(keyword));
};

export const isStagingServer = () => {
  if (baseUrl.includes("/uat/") || 
      baseUrl.includes("uat") ||
      baseUrl.includes("uat-portal")) {
    return true
  } else {
    return false
  }
}
export const isDevServer = () => {
  if (baseUrl.includes("/dev/") || 
      baseUrl.includes("dev") ||
      baseUrl.includes("dev-portal")) {
    return true
  } else {
    return false
  }
}

export const formateDateFrom = (dateStr) => {
  const year = parseInt(dateStr.substr(0, 4), 10)
  const month = parseInt(dateStr.substr(5, 2), 10) - 1 // Months are 0-based (0 to 11)
  const day = parseInt(dateStr.substr(8, 2), 10)
  const hour = parseInt(dateStr.substr(11, 2), 10)
  const minute = parseInt(dateStr.substr(14, 2), 10)
  const second = parseInt(dateStr.substr(17, 2), 10)

  // Create the Date object using extracted components
  return new Date(year, month, day, hour, minute, second)
}

export function extractObjects(inputObject) {
  if (typeof inputObject !== "object" || inputObject === null) {
    return [] // Return an empty array for non-object input
  }

  const extractedObjects = []

  for (const key in inputObject) {
    if (
      inputObject.hasOwnProperty(key) &&
      typeof inputObject[key] === "object" &&
      inputObject[key] !== null
    ) {
      if (inputObject[key]?.title == AppConstants.skipItem) {
        continue
      } else {
        extractedObjects.push(inputObject[key])
      }
    }
  }

  return extractedObjects
}

export const metaTagHandler = (route) => {
  return AppMetaConstant[route] ?? AppMetaConstant["generic"]
}

export const handleFAQMessage = (text = '', keyword = 'click here') => {
  try {
    if (typeof text !== 'string') {
      return null;
    }
  
    if (text.includes(keyword)) {
      const [beforeKeyword, afterKeyword] = text.split(keyword);
  
      return {beforeKeyword, afterKeyword}
    }
  
    return text;
  } catch (error) {
    console.log('Error at handleFAQRedirection', error)
    return text;
  }
};

export const setStorage = (key = "") => {
  if(key && typeof key == "string"){
    localStorage.setItem(key, true)
  }
}

export const handleScrollToTop = () => {
  scroller.scrollTo(0,  {
    duration: 0
  });
}

export const customTimeout =async (callback, timeout) => {
  const timeoutId = setTimeout(callback, timeout);

  // Return a cancellation function
  return () => {
      clearTimeout(timeoutId);
  };
};

export const walletAmountHandler = (totalPayable, walletAmount) => {
  if (walletAmount) {
    let updatedPrice = Math.round(
      totalPayable - Math.round(walletAmount)
    ).toFixed(2)
    if (updatedPrice > 0 && updatedPrice < AppConstants.walletMinimumAmount) {
      const temp = AppConstants.walletMinimumAmount - updatedPrice
      return walletAmount - temp
    } else {
      return walletAmount
    }
  }
}

export const handleShowWalletDiscount = (totalPayable, walletAmount) => {
  const subTotal = parseFloat(totalPayable);

  if (walletAmount < subTotal) {
    return Math.round(walletAmountHandler(subTotal, walletAmount));
  } 

  return Math.round(subTotal);
};

export const handleSubtotalPrice = (totalPayable, walletAmount) => {
 try {
  const subTotal = parseFloat(totalPayable);
  if (walletAmount && walletAmount > 0) {
    // const remainingAmount = subTotal - Math.round(walletAmount);
    const remainingAmount = subTotal - roundHalfDown(walletAmount);
    
    if (remainingAmount > 0 && remainingAmount < AppConstants.walletMinimumAmount) {
      return AppConstants.walletMinimumAmount.toFixed(2);
    }
    
    return Math.max(0, remainingAmount).toFixed(2);
  } else {
    return subTotal.toFixed(2);
  }
 } catch (error) {
    console.log('Error at handleSubtotalPrice', error);
    return 0
 }
};

export const transformScheduleDeliveryPayload = (inputData) => {
  try {
    // Create an object to store days and corresponding address_ids
    const dayToAddressMap = {};

    // Iterate through the input data
    for (const day in inputData) {
      const address_id = inputData[day].address_id;

      // If address_id is already in the map, add the day to its array
      if (dayToAddressMap[address_id]) {
        dayToAddressMap[address_id].days.push(day);
      } else {
        // If address_id is not in the map, create a new entry
        dayToAddressMap[address_id] = {
          address_id: address_id,
          days: [day],
        };
      }
    }

    // Convert the map values to an array
    const resultArray = Object.values(dayToAddressMap);

    return resultArray;
  } catch (error) {
    console.log('Error at transformScheduleDeliveryPayload', error);
    return null
  }
}
