import { createAsyncThunk, createReducer } from "@reduxjs/toolkit"
import { OrdersApiServices } from "../actions/ordersAction"

import { logOutUserRequest } from "./authReducer"
import { LoginRequest } from "./authReducer"
const loadingStates = {
  idle: "idle",
  pending: "pending"
}
let initialState = {
  orders: null,
  error: null,
  loading: loadingStates.idle,
  orderId: "",
  buildYourOwnData: null,
  orderCalories: null,
  macroStatus: false,
  orderType: "",
  customMeal: null,
  swapItemCategories: null,
  mealSwap:""
}

// Add meal as cheat meal new API
export const snackAdd = createAsyncThunk(
  "OrdersReducer/snackAdd",
  async (payload, thunkApi) => {
    const response = await OrdersApiServices.snackAdd(
      payload,
      thunkApi
    )
    return response
  }
)
export const snackPricingRequest = createAsyncThunk(
  "OrdersReducer/snackPricingRequest",
  async (payload, thunkApi) => {
    const response = await OrdersApiServices.snackPricing(
      payload,
      thunkApi
    )
    return response
  }
)
export const cheatMealAddon = createAsyncThunk(
  "OrdersReducer/cheatMealAddon",
  async (payload, thunkApi) => {
    const response = await OrdersApiServices.cheatMealAddon(
      payload,
      thunkApi
    )
    return response
  }
)
export const setcheatMealRequest = createAsyncThunk(
  "OrdersReducer/setcheatMealRequest",
  async (payload, thunkApi) => {
    const response = await OrdersApiServices.setcheatMeal(
      payload,
      thunkApi
    )
    return response
  }
)
export const getOrdersByCategoryIdRequest = createAsyncThunk(
  "OrdersReducer/getOrdersByCategoryIdRequest",
  async (payload, thunkApi) => {
    const response = await OrdersApiServices.getOrdersByCategoryId(
      payload,
      thunkApi
    )
    return response
  }
)

export const swapItemRequest = createAsyncThunk(
  "OrdersReducer/swapItemRequest",
  async (payload, thunkApi) => {
    const response = await OrdersApiServices.swapOrderRequest(payload, thunkApi)
    return response
  }
)

export const swapMyBuildYourOwnRequest = createAsyncThunk(
  "OrdersReducer/swapMyBuildYourOwnRequest",
  async (payload, thunkApi) => {
    const response = await OrdersApiServices.swapMyBYORequest(payload, thunkApi)
    return response
  }
)

export const getBuildYourOwnData = createAsyncThunk(
  "OrdersReducer/getBuildYourOwnData",
  async (payload, thunkApi) => {
    const response = await OrdersApiServices.getBuildYourOwnData(
      payload,
      thunkApi
    )
    return response
  }
)

export const getMyBuildYourOwnDataRequest = createAsyncThunk(
  "OrdersReducer/getMyBuildYourOwnDataRequest",
  async (payload, thunkApi) => {
    const response = await OrdersApiServices.getMyBuildYourOwnData(
      payload,
      thunkApi
    )
    return response
  }
)

export const deleteMyBYORequest = createAsyncThunk(
  "OrdersReducer/deleteMyBYORequest",
  async (payload, thunkApi) => {
    const response = await OrdersApiServices.deleteMyBYORequest(
      payload,
      thunkApi
    )
    return response
  }
)

export const editMyBYORequest = createAsyncThunk(
  "OrdersReducer/editMyBYORequest",
  async (payload, thunkApi) => {
    const response = await OrdersApiServices.editMyBYORequest(payload, thunkApi)
    return response
  }
)

export const buildYourOwnDataRequest = createAsyncThunk(
  "OrdersReducer/buildYourOwnDataRequest",
  async (payload, thunkApi) => {
    const response = await OrdersApiServices.buildYourOwnDataRequest(
      payload,
      thunkApi
    )
    return response
  }
)

export const pausePassRequest = createAsyncThunk(
  "OrdersReducer/pausePassRequest",
  async (payload, thunkApi) => {
    const response = OrdersApiServices.pausePassRequest(payload, thunkApi)
    return response
  }
)

export const revertPausePassRequest = createAsyncThunk(
  "OrdersReducer/revertPausePassRequest",
  async (payload, thunkApi) => {
    const response = OrdersApiServices.revertPausePassRequest(payload, thunkApi)
    return response
  }
)

export const saveOrderId = createAsyncThunk(
  "OrdersReducer/saveOrderId",
  async (payload) => {
    return payload
  }
)

export const changeMicroBalanceStatus = createAsyncThunk(
  "OrdersReducer/changeMicroBalanceStatus",
  async (payload) => {
    return payload
  }
)

export const setMealSwap = createAsyncThunk(
  "OrdersReducer/setMealSwap",
  async (payload) => {
    return payload
  }
)

export const clearOrdersData = createAsyncThunk(
  "OrdersReducer/clearOrdersData",
  async () => {
  }
)

export const getSwapItemCategoriesRequest = createAsyncThunk(
  "OrdersReducer/getSwapItemCategoriesRequest",
  async (payload, thunkApi) => {
    const response = OrdersApiServices.getSwapItemCategories(payload, thunkApi)
    return response
  }
)

export const onFavouriteClickRequest = createAsyncThunk(
  "OrdersReducer/onFavouriteClickRequest",
  async (payload, thunkApi) => {
    const response = OrdersApiServices.onFavouriteClickAction(payload, thunkApi)
    return response
  }
)

const OrdersReducer = createReducer(initialState, {
  [clearOrdersData.fulfilled]: (state) => {
    return {
      ...state,
      orders:null
    }
  },
  [snackAdd.pending]: (state) => {
    return {
      ...state,
      error: null,
    }
  },
  [snackAdd.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
    }
  },
  [snackAdd.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data,
    }
  },
  [snackPricingRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
    }
  },
  [snackPricingRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
    }
  },
  [snackPricingRequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data,
    }
  },
  [cheatMealAddon.pending]: (state) => {
    return {
      ...state,
      error: null,
    }
  },
  [cheatMealAddon.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
    }
  },
  [cheatMealAddon.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data,
    }
  },
  [setcheatMealRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
    }
  },
  [setcheatMealRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
    }
  },
  [setcheatMealRequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data,
    }
  },
  [getOrdersByCategoryIdRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.pending
    }
  },
  [getOrdersByCategoryIdRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.idle,
      orders: action.payload.data?.data
    }
  },
  [getOrdersByCategoryIdRequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data,
      loading: loadingStates.idle
    }
  },

  [getBuildYourOwnData.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.pending
    }
  },
  [getBuildYourOwnData.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.idle,
      buildYourOwnData: action.payload.data?.data
    }
  },
  [getBuildYourOwnData.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data,
      loading: loadingStates.idle
    }
  },

  //ANCHOR - get my BYOs
  [getMyBuildYourOwnDataRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.pending
    }
  },
  [getMyBuildYourOwnDataRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.idle,
      myBuildYourOwnData: action.payload.data?.data
    }
  },
  [getMyBuildYourOwnDataRequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data,
      loading: loadingStates.idle
    }
  },

  [buildYourOwnDataRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.pending
    }
  },
  [buildYourOwnDataRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.idle
    }
  },
  [buildYourOwnDataRequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data,
      loading: loadingStates.idle
    }
  },

  [swapItemRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.pending
    }
  },
  [swapItemRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.idle
      // orders: action.payload.data?.data
    }
  },
  [swapItemRequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data,
      loading: loadingStates.idle
    }
  },
  //ANCHOR - Swap my BYOs
  [swapMyBuildYourOwnRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.pending
    }
  },
  [swapMyBuildYourOwnRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.idle
      // orders: action.payload.data?.data
    }
  },
  [swapMyBuildYourOwnRequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data,
      loading: loadingStates.idle
    }
  },
  //ANCHOR - delete my BYOs
  [deleteMyBYORequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.pending
    }
  },
  [deleteMyBYORequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.idle
      // orders: action.payload.data?.data
    }
  },
  [deleteMyBYORequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data,
      loading: loadingStates.idle
    }
  },
  //ANCHOR - edit my BYOs
  [editMyBYORequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.pending
    }
  },
  [editMyBYORequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.idle
      // orders: action.payload.data?.data
    }
  },
  [editMyBYORequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data,
      loading: loadingStates.idle
    }
  },

  [pausePassRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.pending
    }
  },
  [pausePassRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.idle
      // orders: action.payload.data?.data
    }
  },
  [pausePassRequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data,
      loading: loadingStates.idle
    }
  },

  [revertPausePassRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.pending
    }
  },
  [revertPausePassRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.idle
      // orders: action.payload.data?.data
    }
  },
  [revertPausePassRequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data,
      loading: loadingStates.idle
    }
  },

  [getSwapItemCategoriesRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.pending
    }
  },
  [getSwapItemCategoriesRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.idle,
      swapItemCategories: action.payload.data?.data
    }
  },
  [getSwapItemCategoriesRequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data,
      loading: loadingStates.idle
    }
  },

  [logOutUserRequest.fulfilled]: () => {
    return {
      ...initialState
    }
  },
  [LoginRequest.fulfilled]: () => {
    return {
      ...initialState
    }
  },

  [saveOrderId.fulfilled]: (state, action) => {
    return {
      ...state,
      orderId: action.payload.orderId,
      orderCalories: action.payload.orderCalories,
      orderType: action.payload.orderType,
      customMeal: action.payload.customMeal,
      parentOrderId: action.payload.parentOrderId
    }
  },

  [changeMicroBalanceStatus.fulfilled]: (state, action) => {
    return {
      ...state,
      macroStatus: action.payload
    }
  },
  [setMealSwap.fulfilled]: (state, action) => {
    return {
      ...state,
      mealSwap: action.payload
    }
  }
})

export default OrdersReducer
