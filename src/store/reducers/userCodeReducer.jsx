import { createAsyncThunk, createReducer } from "@reduxjs/toolkit"
import { UserCodeApiServices } from "../actions/userCodeActions"
import { logOutUserRequest } from "./authReducer"
import { LoginRequest } from "./authReducer"

const loadingStates = {
  idle: "idle",
  pending: "pending"
}

let initialState = {
  codeDetails: null,
  error: null,
  loading: loadingStates.idle,
  validatedPhone: null
}

export const ADD_VALIDATED_PHONE = createAsyncThunk(
  "UserCodeReducer/ADD_VALIDATED_PHONE",
  async (payload, thunkApi) => {
    return payload
  }
)
export const createUserCodeRequest = createAsyncThunk(
  "UserCodeReducer/createUserCodeRequest",
  async (payload, thunkApi) => {
    const response = await UserCodeApiServices.getGeneratedCode(
      payload,
      thunkApi
    )
    return response
  }
)

const UserCodeReducer = createReducer(initialState, {
  [ADD_VALIDATED_PHONE.fulfilled]: (state, action) => {
    return {
      ...state,
      validatedPhone: action.payload,
    }
  },
  [createUserCodeRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.pending
    }
  },

  [createUserCodeRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.idle,
      codeDetails: action.payload.data?.data
    }
  },

  [createUserCodeRequest.rejected]: (state, action) => {
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

export default UserCodeReducer
