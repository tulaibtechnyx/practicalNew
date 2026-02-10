import ApiResource from "../../services/api/api"
import ApiConstants from "../../config/constants.config"
import axios from "axios"

const getHeaders = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}


async function Addcalendlybooking(payload, thunkAPI) {
  try {
    const { token, ...restPayload } = payload; 
    const response = await ApiResource.post(
      ApiConstants.calendlybooking,
      restPayload,
      getHeaders(payload?.token) 
    );
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
}
async function Getcalendlybooking(payload, thunkAPI) {
  try {
    const { token } = payload; 
    const response = await ApiResource.get(
      ApiConstants.calendlybooking,
      getHeaders(token)
    )
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
}
async function removeAddonMealnSnack(payload, thunkAPI) {
  try {
    const { token, ...restPayload } = payload; 
    const response = await ApiResource.post(
      ApiConstants.removeAddonMealnSnack,
      restPayload,
      getHeaders(payload?.token) 
    );
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
}
async function removeAddonOtherItem(payload, thunkAPI) {
  try {
    const { token, ...restPayload } = payload; 
    const response = await ApiResource.post(
      ApiConstants.removeAddonOtherItem,
      restPayload,
      getHeaders(payload?.token) 
    );
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
}
async function mealSnackPricing(payload, thunkAPI) {
  try {
    const { token, ...restPayload } = payload; 
    const response = await ApiResource.get(
      ApiConstants.mealSnackPricing+`?order_id=${restPayload?.orderId}`,
      getHeaders(payload.token)
    )
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
}
async function addOtherMeal(payload, thunkAPI) {
  try {
    const { token, ...restPayload } = payload; 
    const response = await ApiResource.post(
      ApiConstants.addOtherMeal,
      restPayload,
      getHeaders(payload?.token) 
    );
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
}
async function addOtherSnacks(payload, thunkAPI) {
  try {
    const { token, ...restPayload } = payload; 
    const response = await ApiResource.post(
      ApiConstants.addOtherSnacks,
      restPayload,
      getHeaders(payload?.token) 
    );
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
}
async function addOtherItems(payload, thunkAPI) {
  try {
    const { token, ...restPayload } = payload; 
    const response = await ApiResource.post(
      ApiConstants.addOtherItems,
      restPayload,
      getHeaders(payload?.token) 
    );
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
}
async function searchAddons(payload, thunkAPI) {
  try {
    const { token, ...restPayload } = payload; 
    const response = await ApiResource.get(
      ApiConstants.searchAddons+`?search=${restPayload?.search}&page_size=${restPayload?.pageSize}&page=${restPayload?.page}`,
      getHeaders(payload.token)
    );
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
}
async function CopyMeals(payload, thunkAPI) {
  try {
    const { token, ...restPayload } = payload; 
    const response = await ApiResource.post(
      ApiConstants.copyMeals,
      restPayload,
      getHeaders(token) 
    );
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
}
async function RevertMeals(payload, thunkAPI) {
  try {
    const { token, ...restPayload } = payload; 
    const response = await ApiResource.post(
      ApiConstants.revertMeals,
      restPayload,
      getHeaders(token) 
     )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}
async function TimerRequest(payload, thunkAPI) {
  try {
    const response = await axios.get(
      '/api/current-time'    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}
async function StartupRequest(payload, thunkAPI) {
  try {
    const response = await ApiResource.get(
      ApiConstants.startUp,
      getHeaders(payload.token)
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function upcomingOrdersRequest(payload, thunkAPI) {
  try {
    const response = await ApiResource.get(
      ApiConstants.upcomingOrders,
      getHeaders(payload.token)
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function getQuestions(payload, thunkAPI) {
  try {
    let response = {}
    if (payload?.token) {
      response = await ApiResource.get(
        ApiConstants.faq,
        getHeaders(payload.token)
      )
    } else {
      response = await ApiResource.get(ApiConstants.faq)
    }
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function getEatingRequest(payload, thunkAPI) {
  try {
    if (!payload.filter) {
      const response = await ApiResource.get(
        ApiConstants.resturants
        // getHeaders(payload.token)
      )
      return response
    } else {
      const response = await ApiResource.get(
        ApiConstants.resturants + `?type=${payload.filter}`
        // getHeaders(payload.token)
      )
      return response
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

// async function getTickersRequest(payload, thunkAPI) {
//   try {
//     // console.log("this is payload===========", payload)

//     const response = await ApiResource.get(
//       ApiConstants.tickersv2,
//       getHeaders(payload.token)
//     )
//     return response
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error)
//   }
// }
async function getTickersRequest(payload, thunkAPI) {
  try {
    const response = await ApiResource.get(
      ApiConstants.tickersv2,
      getHeaders(payload.token)
    );
    return response;
  } catch (error) {
    // Return only the response, not the whole error object
    if (error.response) {
      return Promise.reject(error.response); 
    }
    return Promise.reject(error);
  }
}


async function getFreeFoodRequest(payload, thunkAPI) {
  try {
    // console.log("this is payload===========", payload)

    const response = await ApiResource.get(
      ApiConstants.freeFood,
      getHeaders(payload.token)
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function getOrderHistroyRequest(payload, thunkAPI) {
  try {
    // console.log("this is payload===========", payload)

    const response = await ApiResource.get(
      ApiConstants.orderHistory,
      getHeaders(payload.token)
    )
    return response
  } catch (error) {
   // Safely get the API error message
    const errData = error?.response?.data || { message: error.message }
    return thunkAPI.rejectWithValue(errData)

  }
}

async function checkEmailExistRequest(payload, thunkAPI) {
  try {
    // console.log("this is payload===========", payload)
    const formData = new FormData()

    formData.append("email", payload.email)
    formData.append("phone", payload.phoneNum)
    const response = await ApiResource.post(
      ApiConstants.validateEmail,
      formData
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function postContactRequest(payload, thunkAPI) {
  try {
    //  `console.log('this is  payload========',payload.contactData)
    const response = await ApiResource.post(
      ApiConstants.contactUS,
      payload.contactData
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function getAllCardsRequest(payload, thunkAPI) {
  try {
    const response = await ApiResource.get(
      ApiConstants.cards  + `?cardType=${payload.cardType || 'stripe'}`,
      // ApiConstants.cards,
      getHeaders(payload.token)
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function getRenewalPlanData(payload, thunkAPI) {
  try {
    const response = await ApiResource.get(
      ApiConstants.renewalAvailability,
      getHeaders(payload.token)
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function getRenewedPlanOrdersRequest(payload, thunkAPI) {
  try {
    if (payload?.user_id && payload?.order_id) {
      const response = await ApiResource.get(
        ApiConstants.renewedPlanOrders +
          `?user_id=${payload.user_id}&order_id=${payload.order_id}`,
        getHeaders(payload.token)
      )
      if (response) {
        return response
      }
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function getAllAddressRequest(payload, thunkAPI) {
  try {
    const response = await ApiResource.get(
      ApiConstants.userAddress,
      getHeaders(payload.token)
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function setDefaultAddressRequest(payload, thunkAPI) {
  try {
    const body = {
      address_id: payload.address_id
    }
    const response = await ApiResource.post(
      ApiConstants.defaultAddress,
      body,
      getHeaders(payload.accessToken)
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function addToWalletRequest(payload, thunkAPI) {
  try {
    const body = {}
    const response = await ApiResource.post(
      ApiConstants.addToWallet,
      body,
      getHeaders(payload.token)
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}
async function submitFeedbackRequest(payload, thunkAPI) {
  try {
    const { currentMeal, mealData, token } = payload
    const feedbackData = new FormData()
    feedbackData.append("id", currentMeal.id)
    feedbackData.append("rating", mealData.value)
    feedbackData.append("feedback", mealData.feedback)
    console.log("this is payload========", payload)
    const response = await ApiResource.post(
      ApiConstants.mealFeedBack,
      feedbackData,
      getHeaders(token)
    )
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function getCookBookRequest(payload, thunkAPI) {
  try {
    const response = await ApiResource.get(
      ApiConstants.cookBook,
      getHeaders(payload.accessToken)
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function getPausePassDatesRequest(payload, thunkAPI) {
  try {
    const response = await ApiResource.get(
      ApiConstants.pauseDates,
      getHeaders(payload.token)
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function getEmiratesAddressesRequest(payload, thunkAPI) {
  try {
    const response = await ApiResource.get(
      ApiConstants.getEmirates,
      getHeaders(payload.token)
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function getCompanyEmirates(payload, thunkAPI) {
  try {
    const response = await ApiResource.get(
      ApiConstants.getCompanyEmirates,
      getHeaders(payload.token)
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function postProteinRequest(payload, thunkAPI) {
  try {
    //  `console.log('this is  payload========',payload.contactData)
    const response = await ApiResource.post(
      ApiConstants.proteinAdd,
      payload.preferenceData,
      getHeaders(payload.token)
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function deleteProteinRequest(payload, thunkAPI) {
  try {
    //  `console.log('this is  payload========',payload.contactData)
    const response = await ApiResource.delete(
      `${ApiConstants.proteinDelete}?order_id=${payload.order_id}`,
      getHeaders(payload.token)
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function getWalletDetails(payload, thunkAPI) {
  try {
    const response = await ApiResource.get(
      `${ApiConstants.addToWallet}?page_size=${payload?.pageSize ?? 5}&page=${
        payload?.page ?? 1
      }`,
      getHeaders(payload.token)
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function updatePriceRequest(payload, thunkAPI) {
  try {
    const response = await ApiResource.post(
      ApiConstants.priceUpdate,
      { order_id: payload.order_id ?? null },
      getHeaders(payload.token)
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function cancelSubscriptionHook(payload, thunkAPI) {
  try {
    const response = await ApiResource.post(
      ApiConstants.cancelSubscriptionHook,
      {},
      getHeaders(payload.token)
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

export const DashboardApiServices = {
  cancelSubscriptionHook,
  Addcalendlybooking,
  Getcalendlybooking,
  removeAddonMealnSnack,
  removeAddonOtherItem,
  mealSnackPricing,
  searchAddons,
  addOtherMeal,
  addOtherSnacks,
  addOtherItems,
  CopyMeals,
  RevertMeals,
  TimerRequest,
  StartupRequest,
  upcomingOrdersRequest,
  getQuestions,
  getEatingRequest,
  getTickersRequest,
  getFreeFoodRequest,
  getOrderHistroyRequest,
  checkEmailExistRequest,
  postContactRequest,
  getAllCardsRequest,
  getRenewalPlanData,
  getAllAddressRequest,
  setDefaultAddressRequest,
  getCookBookRequest,
  submitFeedbackRequest,
  getPausePassDatesRequest,
  getEmiratesAddressesRequest,
  getRenewedPlanOrdersRequest,
  addToWalletRequest,
  postProteinRequest,
  deleteProteinRequest,
  getWalletDetails,
  updatePriceRequest,
  getCompanyEmirates
}
