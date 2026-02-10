import { createReducer } from "@reduxjs/toolkit"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ProfileApiServices } from "../actions/profileAction"
import { logOutUserRequest } from "./authReducer"
import AppLogger from "helpers/AppLogger"
import { setsaveTabChangesButtonHit, setswitchTabTo, UpcomingOrdersRequest } from "./dashboardReducer"
import AppConstants from "@helpers/AppConstants"

let initialState = {
  userProfile: null,
  userProfileLoader: false,
  priceLoader: false,
  loading:"idle",
  addressWithDays: null
}

export const PromoAvailed = createAsyncThunk(
  "DashboardReducer/PromoAvailed",
  async (payload, thunkApi) => {
    const response = await ProfileApiServices.PromoAvailed(
      payload,
      thunkApi
    )
    return response
  }
)
export const ProfileRequest = createAsyncThunk(
  "DashboardReducer/ProfileRequest",
  async (payload, thunkApi) => {
    const response = await ProfileApiServices.ProfileDataRequest(
      payload,
      thunkApi
    )
    return response
  }
)

export const PostProfileRequest = createAsyncThunk(
  "DashboardReducer/PostProfileRequest",
  async (payload, thunkApi) => {
    const response = await ProfileApiServices.PostProfileRequest(
      payload,
      thunkApi
    )
    return response
  }
)

export const UpdatePreferencesRequest = createAsyncThunk(
  "DashboardReducer/UpdatePreferencesRequest",
  async (payload, thunkApi) => {
    const response = await ProfileApiServices.updatePreferenceRequest(
      payload,
      thunkApi
    )
    return response
  }
)

export const resetPreferencesRequest = createAsyncThunk(
  "OrdersReducer/resetPreferencesRequest",
  async (payload, thunkApi) => {
    const response = ProfileApiServices.resetPreferencesRequest(
      payload,
      thunkApi
    )
    if (!response.payload?.response?.isSuccess) {
      return response
    } else {
      AppLogger(
        "Error at UpdatePreferencesSliderRequest Reducer",
        new Error(`${response}`)
      )
      throw new Error(`${response}`)
    }
  }
)

export const UpdatePreferencesSliderRequest = createAsyncThunk(
  "DashboardReducer/UpdatePreferencesSliderRequest",
  async (payload, thunkApi) => {
    const response = await ProfileApiServices.updatePreferenceSliderRequest(
      payload,
      thunkApi
    )
    const state = thunkApi.getState();
    const saveTabChangesButtonHit = state.home.saveTabChangesButtonHit;
    const activeTabvalue = state.home.activeTabvalue;
    const userDetails = state.auth.userDetails;
    const { auth_token } = userDetails?.data
    
    if (!response.payload?.response?.isSuccess) {
      if(saveTabChangesButtonHit && activeTabvalue != AppConstants?.TabValues?.EDIT_PREFERENCES ){
      if( activeTabvalue == AppConstants?.TabValues?.UPCOMING_ORDERS ){
        await thunkApi.dispatch(UpcomingOrdersRequest({token:auth_token, changeTab:true}))
      }else{
        thunkApi.dispatch(setswitchTabTo(activeTabvalue))
        thunkApi.dispatch(setsaveTabChangesButtonHit(false))

      }
    }
      return response
    } else {
      AppLogger(
        "Error at UpdatePreferencesSliderRequest Reducer",
        new Error(`${response}`)
      )
      return thunkApi.rejectWithValue(response.data)
      // throw new Error(`${response}`)
    }
    // return response
  }
)

export const cancelSubscriptionRequest = createAsyncThunk(
  "ProfileReducer/cancelSubscriptionRequest",
  async (payload, thunkApi) => {
    const response = await ProfileApiServices.cancelSubscriptionRequest(
      payload,
      thunkApi
    )
    return response

    // return response
  }
)

export const priceConfirmationRequest = createAsyncThunk(
  "ProfileReducer/priceConfirmationRequest",
  async (payload, thunkApi) => {
    const response = await ProfileApiServices.getPriceConfirmation(
      payload,
      thunkApi
    )
    return response
  }
)

export const getDeliveryAddressWithDaysRequest = createAsyncThunk(
  "ProfileReducer/getDeliveryAddressWithDays",
  async (payload, thunkApi) => {
    const response = await ProfileApiServices.getAddressWithDays(
      payload,
      thunkApi
    )
    return response
  }
)

export const updateDeliveryAddressWithDaysRequest = createAsyncThunk(
  "ProfileReducer/updateDeliveryAddressWithDays",
  async (payload, thunkApi) => {
    const response = await ProfileApiServices.updateAddressWithDays(
      payload,
      thunkApi
    )
    return response
  }
)

export const updateCompanyDeliveryAddressWithDaysRequest = createAsyncThunk(
  "ProfileReducer/updateDeliveryAddressWithDays",
  async (payload, thunkApi) => {
    const response = await ProfileApiServices.updateCompanyAddressWithDays(
      payload,
      thunkApi
    )
    return response
  }
)

export const verifyOrderDiscountRequest = createAsyncThunk(
  "ProfileReducer/verifyOrderDiscount",
  async (payload, thunkApi) => {
    const response = await ProfileApiServices.verifyOrderDiscount(
      payload,
      thunkApi
    )
    return response
  }
)

const ProfileReducer = createReducer(initialState, {
  [verifyOrderDiscountRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      // userProfileLoader: true
    }
  },
  [verifyOrderDiscountRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      userProfileLoader: false
    }
  },
  [verifyOrderDiscountRequest.rejected]: (state) => {
    return {
      ...state,
      userProfileLoader: false
    }
  },
  [ProfileRequest.pending]: (state) => {
    return {
      ...state,
      loading: "pending",
      error: null
    }
  },
  [ProfileRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: "idle",

      userProfile: action.payload.data?.data
    }
  },
  [ProfileRequest.rejected]: (state) => {
    return {
      ...state,
      loading: "idle",

      error: null
    }
  },

  [PostProfileRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [PostProfileRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      userProfile: action.payload.data?.data
    }
  },
  [PostProfileRequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data
    }
  },

  [UpdatePreferencesRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [UpdatePreferencesRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      userProfile: action.payload.data?.data
    }
  },
  [UpdatePreferencesRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [cancelSubscriptionRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [cancelSubscriptionRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null
      // userProfile: action.payload.data?.data
    }
  },
  [cancelSubscriptionRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [UpdatePreferencesSliderRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      userProfileLoader: true
    }
  },
  [UpdatePreferencesSliderRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      userProfile: action.payload.data?.data,
      userProfileLoader: false
    }
  },
  [UpdatePreferencesSliderRequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data,
      userProfileLoader: false
    }
  },
  [priceConfirmationRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      priceLoader: true
    }
  },
  [priceConfirmationRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      priceLoader: false
    }
  },
  [priceConfirmationRequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data,
      priceLoader: false
    }
  },

  [resetPreferencesRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [resetPreferencesRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      userProfile: action.payload.data?.data
    }
  },
  [resetPreferencesRequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data
    }
  },

  [getDeliveryAddressWithDaysRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [getDeliveryAddressWithDaysRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      addressWithDays: action.payload.data?.data
    }
  },
  [getDeliveryAddressWithDaysRequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data
    }
  },

  [updateDeliveryAddressWithDaysRequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data
    }
  },

  [logOutUserRequest.fulfilled]: () => {
    return {
      ...initialState
    }
  }
})

export default ProfileReducer
