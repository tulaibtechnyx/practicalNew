import { createAsyncThunk, createReducer } from "@reduxjs/toolkit"
import { HomepageApiServices } from "../actions/homePageAction"
import { logOutUserRequest } from "./authReducer"
import { LoginRequest } from "./authReducer"

const loadingStates = {
  idle: "idle",
  pending: "pending"
}

let initialState = {
  homeData: null,
  error: null,
  loading: loadingStates.idle,
  promoBannerData:null,
  decorationQuizData: null
}

export const editPricingData = createAsyncThunk(
  "HomeReducer/editPricingData",
  async (payload, thunkApi) => {
    const response = await HomepageApiServices.editPricingData(
      payload,
      thunkApi
    )
    return response
  }
)
export const getPricingData2 = createAsyncThunk(
  "HomeReducer/getPricingData2",
  async (payload, thunkApi) => {
    const response = await HomepageApiServices.getPricingData(
      payload,
      thunkApi
    )
    return response?.data
  }
)
export const getPricingData = createAsyncThunk(
  "HomeReducer/getPricingData",
  async (payload, thunkApi) => {
    const response = await HomepageApiServices.getPricingData(
      payload,
      thunkApi
    )
    return response?.data
  }
)
export const updatePricingData = createAsyncThunk(
  "HomeReducer/updatePricingData",
  async (payload, thunkApi) => {
    try {
      const response = await HomepageApiServices.updatePricingData(
        payload,
        thunkApi
      )
       // ✅ Handle redirect manually
      if (response.status === 302) {
        console.warn("⚠️ Got 302 redirect — treating as success");
        return { status: 302 };
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json().catch(() => ({}));
      return result;
      
    } catch (error) {
      console.error('❌ updatePricingData error:', error);
      return rejectWithValue(error.message);      
    }
  }
)



export const setdecorationQuizData = createAsyncThunk(
  "HomeReducer/setdecorationQuizData",
  async (payload, thunkApi) => {
    return payload
  }
)
export const setHomePage = createAsyncThunk(
  "HomeReducer/setHomePage",
  async (payload, thunkApi) => {
    return payload
  }
)

export const promoBannerClicked = createAsyncThunk(
  "HomeReducer/promoBannerClicked",
  async (payload, thunkApi) => {
    const response = await HomepageApiServices.promoBannerClicked(
      payload,
      thunkApi
    )
    return response?.data
  }
)
export const getPromoBanner = createAsyncThunk(
  "HomeReducer/getPromoBanner",
  async (payload, thunkApi) => {
    const response = await HomepageApiServices.getPromoBanner(
      payload,
      thunkApi
    )
    return response
  }
)
export const postInactivity = createAsyncThunk(
  "HomeReducer/postInactivity",
  async (payload, thunkApi) => {
    const response = await HomepageApiServices.postInactivity(
      payload,
      thunkApi
    )
    return response
  }
)
export const postCarousel = createAsyncThunk(
  "HomeReducer/postCarousel",
  async (payload, thunkApi) => {
    const response = await HomepageApiServices.postCarousel(
      payload,
      thunkApi
    )
    return response
  }
)
export const getHomePageDataRequest = createAsyncThunk(
  "HomeReducer/getHomePageDataRequest",
  async (payload, thunkApi) => {
    const response = await HomepageApiServices.getHomepageData(
      payload,
      thunkApi
    )
    return response
  }
)
export const getMealPricingData = createAsyncThunk(
  "HomeReducer/getMealPricingData",
  async (payload, thunkApi) => {
    const response = await HomepageApiServices.getMealPricingData(
      payload,
      thunkApi
    )
    if (!response.payload?.response?.isSuccess) {
      return response?.data
    } else {
      throw new Error(`${response}`)
    }
    // return response
  }
)

const HomeReducer = createReducer(initialState, {

 [getPricingData2.pending]: (state, action) => {
  return {
    ...state,
  }
},
 [getPricingData2.fulfilled]: (state, action) => {
  return {
    ...state,
    decorationQuizData: action?.payload
  }
},
 [getPricingData2.rejected]: (state, action) => {
  return {
    ...state,
  }
},
 [getPricingData.pending]: (state, action) => {
  return {
    ...state,
  }
},
 [getPricingData.fulfilled]: (state, action) => {
  const decorationDataShow = action?.payload?.showDecoration == true;
  return {
    ...state,
    decorationQuizData: decorationDataShow ? action?.payload : null
  }
},
 [getPricingData.rejected]: (state, action) => {
  return {
    ...state,
  }
},
 [setdecorationQuizData.fulfilled]: (state, action) => {
  return {
    ...state,
    decorationQuizData: action.payload
  }
},
 [setHomePage.pending]: (state) => {
  return {
    ...state,
  }
},

[setHomePage.fulfilled]: (state, action) => {
  return {
    ...state,
    homeData: action.payload
  }
},

[setHomePage.rejected]: (state, action) => {
  return {
    ...state,
  }
},

  [getHomePageDataRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.pending
    }
  },

  [getHomePageDataRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.idle,
      homeData: action.payload.data?.data
    }
  },

  [getHomePageDataRequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data,
      loading: loadingStates.idle
    }
  },
  [getMealPricingData.pending]: (state) => {
    return {
      ...state,
      // error: null,
      // loading: loadingStates.pending
    }
  },

  [getMealPricingData.fulfilled]: (state, action) => {
    return {
      ...state,
      // error: null,
      // loading: loadingStates.idle,
    }
  },

  [getMealPricingData.rejected]: (state, action) => {
    return {
      ...state,
      // error: action.payload?.response?.data,
      // loading: loadingStates.idle
    }
  },
  [postInactivity.pending]: (state) => {
    return {
      ...state,
    }
  },

  [postInactivity.fulfilled]: (state, action) => {
    return {
      ...state,
    }
  },

  [postInactivity.rejected]: (state, action) => {
    return {
      ...state,
    }
  },
  [postCarousel.pending]: (state) => {
    return {
      ...state,
    }
  },
  [postCarousel.fulfilled]: (state, action) => {
    return {
      ...state,
    }
  },
  [postCarousel.rejected]: (state, action) => {
    return {
      ...state,
    }
  },

 [getPromoBanner.pending]: (state) => {
  return {
    ...state,
  }
},

[getPromoBanner.fulfilled]: (state, action) => {
  return {
    ...state,
    promoBannerData: action.payload?.data?.data
  }
},

[getPromoBanner.rejected]: (state, action) => {
  return {
    ...state,
  }
},
  // [logOutUserRequest.fulfilled]: () => {
  //   return {
  //     ...initialState
  //   }
  // },

  // [LoginRequest.fulfilled]: () => {
  //   return {
  //     ...initialState
  //   }
  // }
})

export default HomeReducer
