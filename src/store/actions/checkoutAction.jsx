import ApiResource from "../../services/api/api"
import ApiConstants from "../../config/constants.config"
import AppLogger from "helpers/AppLogger"

const requestHeaders = (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  return config
}

function createIntention(payload, thunkAPI) {
  try {
    console.log("accessToken",accessToken)
    const { accessToken , ...body} = payload
    return ApiResource.post(
      ApiConstants.createIntention,
      body,
      requestHeaders(accessToken)
    )
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}
function apiAddCardRequest(payload, thunkAPI) {
  try {
    const { addCardBody, accessToken } = payload
    return ApiResource.post(
      ApiConstants.addCard,
      addCardBody,
      requestHeaders(accessToken)
    )
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

function apiEditCardRequest(payload, thunkAPI) {
  try {
    const { editCardBody, accessToken } = payload
    return ApiResource.post(
      ApiConstants.editCard,
      editCardBody,
      requestHeaders(accessToken)
    )
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

function getUserDiscountbyOrderId(payload, thunkAPI) {
  // console.log("this is payload", payload)
  try {
    const { token } = payload
    return ApiResource.get(ApiConstants.user_discount+'/'+payload, requestHeaders(token))
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}
function apiGetRenewalDataRequest(payload, thunkAPI) {
  // console.log("this is payload", payload)
  try {
    const { token } = payload
    return ApiResource.get(ApiConstants.renewalPlan, requestHeaders(token))
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function apiResetRenewalRequest(payload, thunkAPI) {
  try {
    const response = await ApiResource.post(
      ApiConstants.resetRenewal,
      null,
      requestHeaders(payload.token)
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

function apiDeleteCardRequest(payload, thunkAPI) {
  try {
    const { card_id, accessToken } = payload
    const path = ApiConstants.deleteCard + `?card_id=${card_id}`
    return ApiResource.delete(path, requestHeaders(accessToken))
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

function apiAddAddressRequest(payload, thunkAPI) {
  try {
    const { addAddressBody, accessToken } = payload
    return ApiResource.post(
      ApiConstants.addAddress,
      addAddressBody,
      requestHeaders(accessToken)
    )
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

function apiUpdateAddressRequest(payload, thunkAPI) {
  try {
    const { updateAddressBody, accessToken } = payload
    return ApiResource.post(
      ApiConstants.updateAddress,
      updateAddressBody,
      requestHeaders(accessToken)
    )
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

function apiDeleteAddressRequest(payload, thunkAPI) {
  try {
    const { address_id, accessToken } = payload
    const path = ApiConstants.deleteAddress + `?address_id=${address_id}`
    return ApiResource.delete(path, requestHeaders(accessToken))
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

function apiGetOrderSummaryRequest2(payload, thunkAPI) {
  try {
    const { accessToken, orderSummaryParams, order_id, discount_id } = payload
    const { type, promo_code } = orderSummaryParams
    let path = ApiConstants.orderSummary
    if (type && promo_code) {
      console.log("inside type and promo_code")
      path = `${path}?type=${type}&promo_code=${promo_code}`
    } else if (type && order_id && order_id !== "null") {
      console.log("inside type and order_id")
      path = `${path}?type=${type}&order_id=${order_id}`
    } else if (type) {
      console.log("type")
      path = `${path}?type=${type}`
    } else if (type && order_id && order_id !== "null" && discount_id && discount_id !='null') {
      console.log("1")
      path = `${path}?type=${type}&order_id=${order_id}&discount_id=${discount_id}`
    }  else if (order_id && order_id !== "null" && discount_id && discount_id !='null') {
      console.log("2")
      path = `${path}?order_id=${order_id}&discount_id=${discount_id}`
    } else if (order_id && order_id !== "null") {
      console.log("3")
      path = `${path}?order_id=${order_id}`
    } else if (promo_code) {
      console.log("4")
      path = `${path}?promo_code=${promo_code}`
    } else if (order_id == "null") {
      console.log("5")
      path = ApiConstants.orderSummary
    } else {
      console.log("6")
    }
    return ApiResource.get(path, requestHeaders(accessToken))
  } catch (error) {
    AppLogger("error ApiGetOrderSummaryRequest", error)
    return thunkAPI.rejectWithValue(error)
  }
}
function apiGetOrderSummaryRequest(payload, thunkAPI) {
  try {
    const { accessToken, orderSummaryParams, order_id, discount_id } = payload;
    const { type, promo_code } = orderSummaryParams || {};

    // 1. Initialize the base path
    let path = ApiConstants.orderSummary;

    // 2. Build parameters dynamically
    const params = new URLSearchParams();

    if (type) params.append("type", type);
    if (promo_code) params.append("promo_code", promo_code);
    
    // Check for order_id validity (ensuring it's not the string "null")
    if (order_id && order_id !== "null") {
      params.append("order_id", order_id);
    }

    if (discount_id && discount_id !== "null") {
      params.append("discount_id", discount_id);
    }

    // 3. Append parameters to path if any exist
    const queryString = params.toString();
    if (queryString) {
      path = `${path}?${queryString}`;
    }

    // 4. Execute Request
    return ApiResource.get(path, requestHeaders(accessToken));
    
  } catch (error) {
    AppLogger("error ApiGetOrderSummaryRequest", error);
    return thunkAPI.rejectWithValue(error);
  }
}
function apiCheckOutRequest(payload, rejectWithValue) {
  try {
    const { accessToken, newCheckoutBody, totalWeeks, order_id } = payload

    const checkoutBody1 = {
      ...newCheckoutBody,
      is_subscribed: newCheckoutBody.is_subscribed == true ? 1 : 0,
      meal_plan_require_weeks: totalWeeks,
      order_id
    }
    // console.log("this is checkout body=", checkoutBody1)
    return ApiResource.post(
      ApiConstants.checkout,
      checkoutBody1,
      requestHeaders(accessToken)
    )
  } catch (error) {
    return rejectWithValue(error)
  }
}

function apiGetOrderSummaryPaidRequest(payload, thunkAPI) {
  try {
    const { accessToken, order_id } = payload
    if(order_id){
      return ApiResource.get(
        `${ApiConstants.paidOrderSummary}?order_id=${order_id}`,
        requestHeaders(accessToken)
      )
    }else{
      return ApiResource.get(
        `${ApiConstants.paidOrderSummary}`,
        requestHeaders(accessToken)
      )
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

function apiGetDiscountCoupen(payload, thunkAPI) {
  try {
    const { accessToken, discountCode, is_subscribed, order_id, isRenewal } = payload
    if (order_id && order_id !== "null") {
      return ApiResource.get(
        ApiConstants.discountCode +
          discountCode +
          `&is_subscribed=${is_subscribed ? 1 : 0}&order_id=${order_id}&is_renewal=${isRenewal}`,
        requestHeaders(accessToken)
      )
    } else {
      return ApiResource.get(
        ApiConstants.discountCode +
          discountCode +
          `&is_subscribed=${is_subscribed ? 1 : 0}`,
        requestHeaders(accessToken)
      )
    }
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

function apiPostRenewalRequest(payload, thunkAPI) {
  try {
    const { accessToken, renewalData } = payload

    return ApiResource.post(
      ApiConstants.renewalPlan,
      renewalData,
      requestHeaders(accessToken)
    )
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

function apiUpdateRenewalPlanRequest(payload, thunkAPI) {
  try {
    const { accessToken, renewalData } = payload
    return ApiResource.post(
      ApiConstants.updateRenewal,
      renewalData,
      requestHeaders(accessToken)
    )
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function saveOrderCurrentStatus(payload, thunkAPI) {
  try {
    // console.log("this is payload,,,,,,,,", payload)
    const { order_id, extra_protein_price } = payload
    const { guest } = payload.orderSummary
    const { is_subscribed } = payload.checkoutBody
    const orderData = {
      meal_plan_require_weeks: guest?.meal_plan_require_weeks,
      is_subscribed: is_subscribed == false ? 0 : 1,
      orderData: {
        ...payload.checkoutBody,
        subTotal: payload.subTotal,
        subscriptionDiscount: payload.subscriptionDiscount,
        promoSummary: payload.promoCodeSummaryLocal,
        extra_protein_price
      },
      order_id
    }
    // const {} = payload.orderSummary

    const response = await ApiResource.post(
      ApiConstants.finalOrder,
      orderData,
      requestHeaders(payload.accessToken)
    )

    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function setUserDefaultCard(payload, thunkAPI) {
  try {
    const { accessToken, cardData } = payload
    return ApiResource.post(
      ApiConstants.defaultCard,
      cardData,
      requestHeaders(accessToken)
    )
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}
export const CheckOutApiServices = {
  createIntention,
  apiAddCardRequest,
  apiEditCardRequest,
  apiDeleteCardRequest,
  apiAddAddressRequest,
  apiUpdateAddressRequest,
  apiDeleteAddressRequest,
  apiGetOrderSummaryRequest,
  apiCheckOutRequest,
  apiGetOrderSummaryPaidRequest,
  apiGetDiscountCoupen,
  apiGetRenewalDataRequest,
  getUserDiscountbyOrderId,
  apiPostRenewalRequest,
  apiResetRenewalRequest,
  apiUpdateRenewalPlanRequest,
  setUserDefaultCard,
  saveOrderCurrentStatus
}
