import { createAsyncThunk, createReducer } from "@reduxjs/toolkit"
import { AuthApiServices } from "../actions/authAction"
import AppLogger from "helpers/AppLogger"
import { verifyURLforExe } from "helpers/CommonFunc"


let initialState = {
  user: null,
  error: null,
  userDetails: null,
  loading: false,
  // isExecutive: true
  isExecutive: false
  // isExecutive: verifyURLforExe()
}

export const GetCompany = createAsyncThunk(
  "AuthReducer/GetCompany",
  async (payload, thunkAPI) => {
    const response = await AuthApiServices.GetCompany(payload, thunkAPI)

    if (!response.payload?.response?.isSuccess) {
      return response?.data
    } else {
      throw new Error(`${response}`)
    }
  }
)
export const RegisterRequest = createAsyncThunk(
  "AuthReducer/RegisterRequest",
  async (payload, thunkAPI) => {
    const response = await AuthApiServices.RegisterRequest(payload, thunkAPI)

    if (!response.payload?.response?.isSuccess) {
      return response
    } else {
      throw new Error(`${response}`)
    }
  }
)

export const forgotPasswordRequest = createAsyncThunk(
  "AuthReducer/forgotPasswordRequest",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await AuthApiServices.apiForgotPasswordRequest(payload)
      return response.data
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return rejectWithValue(err.response.data)
    }
  }
)

export const changePasswordRequest = createAsyncThunk(
  "AuthReducer/changePasswordRequest",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await AuthApiServices.apiChangePasswordRequest(payload)
      return response.data
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return rejectWithValue(err.response.data)
    }
  }
)
// apiChangePassRequest

export const changePassRequest = createAsyncThunk(
  "AuthReducer/changePasswordRequest",
  async (payload, thunkAPI) => {
    try {

      const response = await AuthApiServices.apiChangePassRequest(payload, thunkAPI)
      return response
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)

export const LoginRequest = createAsyncThunk(
  "AuthReducer/LoginRequest",
  async (payload, thunkAPI) => {
    const response = await AuthApiServices.LoginUserRequest(payload, thunkAPI)
    return response
  }
)

//executive form data

export const ExecutiveRequest = createAsyncThunk(
  "AuthReducer/ExecutiveRequest",
  async (payload, thunkAPI) => {
    const response = await AuthApiServices.executiveFormRequest(payload, thunkAPI)
    return response
  }
)
//executive form data


export const logOutUserRequest = createAsyncThunk(
  "AuthReducer/logOutUserRequest",
  async (payload, thunkAPI) => {
    const response = await AuthApiServices.logoutRequest(payload, thunkAPI)
    return response
  }
)

export const postQuizRequest = createAsyncThunk(
  "QuizReducer/postQuizRequest",
  async () => {
    return
  }
)

export const isExecutiveRequest = createAsyncThunk(
  "AuthReducer/isExecutiveRequest",
  async (payload) => {
    return payload
  }
)
export const Removeerror = createAsyncThunk(
  "AuthReducer/Removeerror",
  async (payload) => {
    return payload
  }
)

const AuthReducer = createReducer(initialState, {

  [Removeerror.fulfilled]: (state, action) => {
    return {
      ...initialState,
      error: null
    }
  },
  [postQuizRequest.fulfilled]: (state, action) => {
    return {
      ...initialState,
      isExecutive: state.isExecutive
    }
  },
  [isExecutiveRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      isExecutive: action.payload
    }
  },
  [LoginRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [LoginRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      userDetails: action.payload.data
    }
  },
  [LoginRequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action?.error?.message
      // questions: null
    }
  },

  [RegisterRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [RegisterRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      userDetails: action.payload.data,
      user: action.payload.data,
      error: null
    }
  },
  [RegisterRequest.rejected]: (state, action) => {
    return {
      ...state,
      questions: null,
      error: action.payload?.response?.data
    }
  },

  [forgotPasswordRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: true
    }
  },
  [forgotPasswordRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      loading: false,
      error: null
    }
  },
  [forgotPasswordRequest.rejected]: (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.payload?.response?.data
    }
  },

  [changePasswordRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: true
    }
  },
  [changePasswordRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      loading: false,
      error: null
    }
  },
  [changePasswordRequest.rejected]: (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.payload?.response?.data
    }
  },

  [changePassRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: true
    }
  },
  [changePassRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      loading: false,
      error: null
    }
  },
  [changePassRequest.rejected]: (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.payload?.response?.data
    }
  },

  [logOutUserRequest.fulfilled]: (state, action) => {
    return {
      ...initialState,
      isExecutive: state.isExecutive,
      userDetails: null
    }
  },
  [logOutUserRequest.rejected]: (state, action) => {
    return {
      ...initialState,
      isExecutive: state.isExecutive,
    }
  },

  [GetCompany.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: true
    }
  },
  [GetCompany.fulfilled]: (state, action) => {
    return {
      ...state,
      loading: false,
      error: null
    }
  },
  [GetCompany.rejected]: (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.payload?.response?.data
    }
  },
})

export default AuthReducer
