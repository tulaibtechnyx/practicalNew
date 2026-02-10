import { createAsyncThunk, createReducer } from "@reduxjs/toolkit"
import { CheckOutApiServices } from "../actions/checkoutAction"
import get from "lodash/get"
import { updateCRONDetails } from "./cron-reducer"

export const logOutUserRequest = createAsyncThunk(
  "AuthReducer/logOutUserRequest",
  async (payload) => {
    return
  }
)
export const discountSummaryremover = createAsyncThunk(
  "AuthReducer/discountSummaryremover",
  async (payload) => {
    return payload
  }
)

export const getUserDiscountbyOrderId = createAsyncThunk(
  "CheckOutReducer/getUserDiscountbyOrderId",
  async (payload, thunkAPI) => {
    try {
      const response = await CheckOutApiServices.getUserDiscountbyOrderId(
        payload?.orderId,
        thunkAPI
      )
      return response
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return rejectWithValue(err.response.data)
    }
  }
)
export const createIntentionFunc = createAsyncThunk(
  "CheckOutReducer/createIntentionFunc",
  async (payload, thunkAPI) => {
    try {
      const response = await CheckOutApiServices.createIntention(
        payload,
        thunkAPI
      )
      return response
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return rejectWithValue(err.response.data)
    }
  }
)
export const addCardRequest = createAsyncThunk(
  "CheckOutReducer/addCardRequest",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await CheckOutApiServices.apiAddCardRequest(payload)
      return response.data
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return rejectWithValue(err.response.data)
    }
  }
)

export const editCardRequest = createAsyncThunk(
  "CheckOutReducer/editCardRequest",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await CheckOutApiServices.apiEditCardRequest(payload)
      return response.data
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return rejectWithValue(err.response.data)
    }
  }
)

export const clearCheckOutSummary = createAsyncThunk(
  "CheckOutReducer/clearCheckOutSummary",
  async (payload) => {
    return
  }
)

export const deleteCardRequest = createAsyncThunk(
  "CheckOutReducer/deleteCardRequest",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await CheckOutApiServices.apiDeleteCardRequest(payload)
      return response.data
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return rejectWithValue(err.response.data)
    }
  }
)

export const addAddressRequest = createAsyncThunk(
  "CheckOutReducer/addAddressRequest",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await CheckOutApiServices.apiAddAddressRequest(payload)
      return response.data
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return rejectWithValue(err.response.data)
    }
  }
)

export const updateAddressRequest = createAsyncThunk(
  "CheckOutReducer/updateAddressRequest",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await CheckOutApiServices.apiUpdateAddressRequest(
        payload
      )
      return response.data
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return rejectWithValue(err.response.data)
    }
  }
)

export const deleteAddressRequest = createAsyncThunk(
  "CheckOutReducer/deleteAddressRequest",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await CheckOutApiServices.apiDeleteAddressRequest(
        payload
      )
      return response.data
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return rejectWithValue(err.response.data)
    }
  }
)

export const getOrderSummaryRequest = createAsyncThunk(
  "CheckOutReducer/getOrderSummaryRequest",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await CheckOutApiServices.apiGetOrderSummaryRequest(
        payload
      )
      const planUpdated = get(response, 'data.plan_updated', false);
      const orderId = get(response, 'data.order_id', null);
      dispatch(updateCRONDetails({
        planUpdated: planUpdated,
        orderId: orderId,
      }))
      return response.data
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return rejectWithValue(err.response.data)
    }
  }
)

export const checkOutRequest = createAsyncThunk(
  "CheckOutReducer/checkOutRequest",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await CheckOutApiServices.apiCheckOutRequest(
        payload,
        rejectWithValue
      )
      return response.data
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return rejectWithValue(err.response.data)
    }
  }
)

export const getRenewalDataRequest = createAsyncThunk(
  "CheckOutReducer/getRenewalDataRequest",
  async (payload, thunkAPI) => {
    const response = await CheckOutApiServices.apiGetRenewalDataRequest(
      payload,
      thunkAPI
    )
    return response
  }
)

export const resetRenewalRequest = createAsyncThunk(
  "CheckOutReducer/resetRenewalRequest",
  async (payload, thunkAPI) => {
    const response = await CheckOutApiServices.apiResetRenewalRequest(
      payload,
      thunkAPI
    )
    return response
  }
)

export const postRenewalRequest = createAsyncThunk(
  "CheckOutReducer/postRenewalRequest",
  async (payload, thunkAPI) => {
    try {
      const response = await CheckOutApiServices.apiPostRenewalRequest(
        payload,
        thunkAPI
      )
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)

export const getOrderSummaryPaidRequest = createAsyncThunk(
  "CheckOutReducer/getOrderSummaryPaidRequest",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await CheckOutApiServices.apiGetOrderSummaryPaidRequest(
        payload
      )
      return response.data
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return rejectWithValue(err.response.data)
    }
  }
)
export const getOrderDiscountSummary = createAsyncThunk(
  "CheckOutReducer/getOrderDiscountSummary",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await CheckOutApiServices.apiGetDiscountCoupen(payload)
      return response.data
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return rejectWithValue(err.response.data)
    }
  }
)

export const updateRenewalSummary = createAsyncThunk(
  "CheckOutReducer/updateRenewalSummary",
  async (payload, thunkAPI) => {
    try {
      const response = await CheckOutApiServices.apiUpdateRenewalPlanRequest(
        payload,
        thunkAPI
      )
      return response
    } catch (err) {
      // throw err
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)

export const saveCheckOutSummary = createAsyncThunk(
  "CheckOutReducer/saveCheckOutSummary",
  async (payload, thunkAPI) => {
    try {
      const response = await CheckOutApiServices.saveOrderCurrentStatus(
        payload,
        thunkAPI
      )
      return response
    } catch (err) {
      // throw err
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)

export const saveOrderLocalSummary = createAsyncThunk(
  "CheckOutReducer/saveOrderLocalSummary",
  async (payload) => {
    return payload
  }
)
export const changePrice = createAsyncThunk(
  "CheckOutReducer/changePrice",
  async (payload) => {
    return payload
  }
)
export const setpaymentMethod = createAsyncThunk(
  "CheckOutReducer/setpaymentMethod",
  async (payload) => {
    return payload
  }
)
export const setpaymobRespoUrl = createAsyncThunk(
  "CheckOutReducer/setpaymobRespoUrl",
  async (payload) => {
    return payload
  }
)
export const setpaymobRespoUrlString = createAsyncThunk(
  "CheckOutReducer/setpaymobRespoUrlString",
  async (payload) => {
    return payload
  }
)
export const setpromoCodeString = createAsyncThunk(
  "CheckOutReducer/setpromoCodeString",
  async (payload) => {
    return payload
  }
)

export const setUserDefaultCardRequest = createAsyncThunk(
  "CheckOutReducer/setUserDefaultCardRequest",
  async (payload, thunkAPI) => {
    const response = await CheckOutApiServices.setUserDefaultCard(
      payload,
      thunkAPI
    )

    return response
  }
)
const initialState = {
  error: null,
  loading: false,
  orderSummary: null,
  paidSummary: null,
  discountSummary: null,
  renewalSummary: null,
  checkoutSummary: null,
  orderLocalSummary: null,
  paymentMethod: null,
  paymobRespoUrl:null,
  paymobRespoUrlString:'',
  promoCodeString : '',
  orderDiscountByOrderId:null
}

const CheckOutReducer = createReducer(initialState, {
  [discountSummaryremover.fulfilled]: (state, action) => {
    return {
      ...state,
      discountSummary: null
    }
  },
  [getUserDiscountbyOrderId.pending]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: true
    }
  },
  [getUserDiscountbyOrderId.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      orderDiscountByOrderId : action.payload,
      loading: false,
    }
  },
  [getUserDiscountbyOrderId.rejected]: (state, action) => {
    return {
      ...state,
      loading: false,
    }
  },
  [createIntentionFunc.pending]: (state, action) => {
    return {
      ...state,
      error: null,
      // loading: true
    }
  },
  [createIntentionFunc.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      createIntentionData : action.payload,
      // loading: false,
    }
  },
  [createIntentionFunc.rejected]: (state, action) => {
    return {
      ...state,
      // loading: false,
      error: action.payload.message
    }
  },
  [addCardRequest.pending]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: true
    }
  },
  [addCardRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: false
    }
  },
  [addCardRequest.rejected]: (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.payload.message
    }
  },
  [editCardRequest.pending]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: true
    }
  },
  [editCardRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: false
    }
  },
  [editCardRequest.rejected]: (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.payload.message
    }
  },

  [deleteCardRequest.pending]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: true
    }
  },
  [deleteCardRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: false
    }
  },
  [deleteCardRequest.rejected]: (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.payload.message
    }
  },

  [postRenewalRequest.pending]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: true
    }
  },
  [postRenewalRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: false
    }
  },
  [postRenewalRequest.rejected]: (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.payload?.message
    }
  },

  [updateRenewalSummary.pending]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: true
    }
  },
  [updateRenewalSummary.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: false,
      renewalSummary: action.payload?.data
    }
  },
  [updateRenewalSummary.rejected]: (state, action) => {
    return {
      ...state,
      loading: false,
      error: action?.payload?.message
    }
  },

  [addAddressRequest.pending]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: true
    }
  },
  [addAddressRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: false
    }
  },
  [addAddressRequest.rejected]: (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.payload.message
    }
  },

  [updateAddressRequest.pending]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: true
    }
  },
  [updateAddressRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: false
    }
  },
  [updateAddressRequest.rejected]: (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.payload.message
    }
  },

  [deleteAddressRequest.pending]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: true
    }
  },
  [deleteAddressRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: false
    }
  },
  [deleteAddressRequest.rejected]: (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.payload.message
    }
  },

  [getOrderSummaryRequest.pending]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: true
    }
  },
  [getOrderSummaryRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: false,
      orderSummary: action.payload.data
      // orderLocalSummary: null
    }
  },
  [getOrderSummaryRequest.rejected]: (state, action) => {
    // AppLogger("Error at getOrderSummaryRequest", action)
    return {
      ...state,
      loading: false
    }
  },

  [getRenewalDataRequest.pending]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: true
    }
  },
  [getRenewalDataRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      renewalSummary: action.payload?.data,
      error: null,
      loading: false
    }
  },
  [getRenewalDataRequest.rejected]: (state, action) => {
    // AppLogger("Error at getOrderSummaryRequest", action)
    return {
      ...state,
      loading: false
    }
  },

  // resetRenewalRequest

  [resetRenewalRequest.pending]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: true
    }
  },
  [resetRenewalRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      renewalSummary: action.payload?.data,
      error: null,
      loading: false
    }
  },
  [resetRenewalRequest.rejected]: (state, action) => {
    // AppLogger("Error at getOrderSummaryRequest", action)
    return {
      ...state,
      loading: false
    }
  },

  [getOrderDiscountSummary.pending]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: true
    }
  },
  [getOrderDiscountSummary.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: false,
      discountSummary: action.payload.data
    }
  },
  [getOrderDiscountSummary.rejected]: (state, action) => {
    // AppLogger("Error at getOrderSummaryRequest", action)
    return {
      ...state,
      loading: false,
      discountSummary:null,
      error: action.payload
    }
  },

  [checkOutRequest.pending]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: true
    }
  },
  [checkOutRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: false,
      orderLocalSummary: null,
      checkoutSummary: null,
      discountSummary: null,
      orderSummary: {...state.orderSummary, discount:null}
    }
  },
  [checkOutRequest.rejected]: (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.payload?.message
    }
  },

  [setUserDefaultCardRequest.pending]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: true
    }
  },
  [setUserDefaultCardRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: false
      // orderLocalSummary: null,
      // checkoutSummary: null
    }
  },
  [setUserDefaultCardRequest.rejected]: (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.payload?.message
    }
  },

  [getOrderSummaryPaidRequest.pending]: (state, action) => {
    return {
      ...state,
      loading: true,
      error: null
    }
  },
  [getOrderSummaryPaidRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: false,
      orderSummary: null,
      paidSummary: action.payload.data
    }
  },
  [getOrderSummaryPaidRequest.rejected]: (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.payload.message
    }
  },
  [changePrice.fulfilled]: (state, action) => {
    return {
      ...state,
      paidSummary: {...state.paidSummary, price: action.payload}
    }
  },
  [setpaymentMethod.fulfilled]: (state, action) => {
    return {
      ...state,
      paymentMethod: action.payload
    }
  },
  [setpaymobRespoUrl.fulfilled]: (state, action) => {
    return {
      ...state,
      paymobRespoUrl: action.payload
    }
  },
  [setpaymobRespoUrlString.fulfilled]: (state, action) => {
    return {
      ...state,
      paymobRespoUrlString: action.payload
    }
  },
  [setpromoCodeString.fulfilled]: (state, action) => {
    return {
      ...state,
      promoCodeString: action.payload
    }
  },
  [saveOrderLocalSummary.fulfilled]: (state, action) => {
    return {
      ...state,
      orderLocalSummary: action.payload,
      discountSummary: null
    }
  },
  [clearCheckOutSummary.fulfilled]: (state, action) => {
    return {
      ...state,
      orderSummary: null,
      checkoutSummary: null,
      orderLocalSummary: null,
      discountSummary: null,
    }
  },

  [saveCheckOutSummary.pending]: (state, action) => {
    return {
      ...state,
      loading: true,
      error: null
    }
  },
  [saveCheckOutSummary.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: false,
      checkoutSummary: action.payload?.data?.data
    }
  },
  [saveCheckOutSummary.rejected]: (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.payload.message
    }
  },

  [logOutUserRequest.fulfilled]: (_, action) => {
    return {
      ...initialState
    }
  }
})

export default CheckOutReducer
