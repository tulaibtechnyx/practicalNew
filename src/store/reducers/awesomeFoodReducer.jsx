import { createAsyncThunk, createReducer } from "@reduxjs/toolkit"
import { AwesomeFoodApiServices } from "../actions/awesomeFoodAction"
import { logOutUserRequest } from "./authReducer"
import { LoginRequest } from "./authReducer"

const loadingStates = {
  idle: "idle",
  pending: "pending"
}

let initialState = {
  allFoods: null,
  error: null,
  loading: loadingStates.idle
}

export const getFoodsByCategoryRequest = createAsyncThunk(
  "AwesomeFoodsReducer/getFoodsByCategoryRequest",
  async (payload, thunkApi) => {
    const response = await AwesomeFoodApiServices.getFoodsByCategory(
      payload,
      thunkApi
    )
    return response
  }
)

const AwesomeFoodsReducer = createReducer(initialState, {
  [getFoodsByCategoryRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.pending
    }
  },

  [getFoodsByCategoryRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.idle,
      allFoods: action.payload.data?.data
    }
  },

  [getFoodsByCategoryRequest.rejected]: (state, action) => {
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
  }
})

export default AwesomeFoodsReducer
