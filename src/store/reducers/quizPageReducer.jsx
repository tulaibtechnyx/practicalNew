import { createAsyncThunk, createReducer } from "@reduxjs/toolkit"
import { QuizApiServices } from "../actions/quizPageActions"
import { logOutUserRequest } from "./authReducer"
import AppLogger from "helpers/AppLogger"

let initialState = {
  questions: [],
  commonQuestions: [],
  formFields: null,
  savedFields: null,
  result: null,
  currentQuizType: "",
  loading: "idle",
  resultChanged: false,
  retakeMode: false,
  resultDataToCompare: null
}

const loadingStates = {
  idle: "idle",
  pending: "pending"
}
export const setQuizData = createAsyncThunk(
  "QuizReducer/setQuizData",
  async (payload) => {
    return payload
  }
)

export const getQuizQuestions = createAsyncThunk(
  "QuizReducer/getQuizQuestions",
  async (payload) => {
    const response = await QuizApiServices.getQuizQuestions(payload)
    return response
  }
)

export const getPreferenceQuestions = createAsyncThunk(
  "QuizReducer/getPreferenceQuestions",
  async (payload) => {
    const response = await QuizApiServices.getPreferenceQuestions(payload)
    return response
  }
)

export const getCommonQuizQuestions = createAsyncThunk(
  "QuizReducer/getCommonQuizQuestions",
  async (payload, thunkApi) => {
    const response = await QuizApiServices.getCommonQuizQuestions(
      payload,
      thunkApi
    )
    if (response) {
      return response
    } else {
      // reject the promise
      throw new Error(`status code ${response}`)
    }
  }
)

export const updateQuizResult = createAsyncThunk(
  "QuizReducer/updateQuizResult",
  async (payload, thunkApi) => {
    const response = await QuizApiServices.updateQuizResult(payload, thunkApi)
    if (!response.payload?.response?.isSuccess) {
      return response
    } else {
      AppLogger("Error at postQuizRequest", new Error(`${response}`))
      throw new Error(`${response}`)
    }
  }
)

export const postQuizRequest = createAsyncThunk(
  "QuizReducer/postQuizRequest",
  async (payload, thunkAPI) => {
    const response = await QuizApiServices.postQuizQuestions(payload, thunkAPI)

    if (!response?.payload?.response?.isSuccess) {
      return response
    } else {
      AppLogger("Error at postQuizRequest", new Error(`${response}`))
      throw new Error(`${response}`)
    }
  }
)

export const resetQuizRequest = createAsyncThunk(
  "QuizReducer/resetQuizRequest",
  async (payload, thunkApi) => {
    const response = await QuizApiServices.quizResetRequest(payload, thunkApi)

    return response
  }
)

export const saveQuizFields = createAsyncThunk(
  "QuizReducer/saveQuizFields",
  async (payload) => {
    return payload
  }
)

export const saveCurrentQuizType = createAsyncThunk(
  "QuizReducer/saveCurrentQuizType",
  async (payload) => {
    return payload
  }
)
export const quizBMidRequest = createAsyncThunk(
  "QuizReducer/quizBMidRequest",
  async (payload, thunkApi) => {
    const response = await QuizApiServices.quizBMidRequest(payload, thunkApi)
    return response
  }
)

export const quizAMidRequest = createAsyncThunk(
  "QuizReducer/quizAMidRequest",
  async (payload, thunkApi) => {
    const response = await QuizApiServices.quizAMidRequest(payload, thunkApi)
    return response
  }
)

export const retakeQuizRequest = createAsyncThunk(
  "QuizReducer/retakeQuizRequest",
  async (payload, thunkAPI) => {
    const response = await QuizApiServices.retakeQuizRequest(payload, thunkAPI)
    return response
  }
)

export const retakeModeHandler = createAsyncThunk(
  "QuizReducer/retakeModeHandler",
  async (payload) => {
    return payload
  }
)

export const clearFieldsRequest = createAsyncThunk(
  "QuizReducer/clearFieldsRequest",
  async (payload, thunkApi) => {
    return
  }
)

export const QuizReducer = createReducer(initialState, {
  [setQuizData.fulfilled]: (state, action) => {
    return {
      ...state,
      questions: action.payload,
    }
  },

  [getQuizQuestions.pending]: (state) => {
    return {
      ...state,
      loading: loadingStates.pending,
      error: null
      // savedFields: null
    }
  },
  [getQuizQuestions.fulfilled]: (state, action) => {
    return {
      ...state,
      questions: action.payload.data.data,
      // savedFields:null
      loading: loadingStates.idle
    }
  },
  [getQuizQuestions.rejected]: (state) => {
    return {
      ...state,
      loading: loadingStates.idle,
      questions: null
    }
  },

  [getPreferenceQuestions.pending]: (state) => {
    return {
      ...state,
      loading: loadingStates.pending,
      error: null
    }
  },
  [getPreferenceQuestions.fulfilled]: (state, action) => {
    return {
      ...state,
      questions: action.payload.data.data,
      loading: loadingStates.idle
    }
  },
  [getPreferenceQuestions.rejected]: (state) => {
    return {
      ...state,
      loading: loadingStates.idle,
      questions: null
    }
  },

  [getCommonQuizQuestions.pending]: (state) => {
    return {
      ...state,
      loading: loadingStates.pending,
      error: null
    }
  },
  [getCommonQuizQuestions.fulfilled]: (state, action) => {
    return {
      ...state,
      loading: loadingStates.idle,

      commonQuestions: action.payload.data.data
    }
  },
  [getCommonQuizQuestions.rejected]: (state) => {
    return {
      ...state,
      loading: loadingStates.idle,

      commonQuestions: null
    }
  },

  [postQuizRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.pending,
      savedFields: null
    }
  },
  [postQuizRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      result: action.payload?.data?.data,
      loading: loadingStates.idle,
      resultDataToCompare: action.payload?.data?.data,
      savedFields: null,
      resultChanged: false
    }
  },
  [postQuizRequest.rejected]: (state, action) => {
    return {
      ...state,
      result: null,
      error: action.payload?.response?.data,
      loading: loadingStates.idle
    }
  },

  [retakeQuizRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.pending,
      savedFields: null
    }
  },
  [retakeQuizRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      loading: loadingStates.idle,
      retakeMode: false,
      savedFields: null,
      resultChanged: false
    }
  },
  [retakeQuizRequest.rejected]: (state, action) => {
    return {
      ...state,
      error: action.payload?.response?.data,
      loading: loadingStates.idle
    }
  },

  [updateQuizResult.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [updateQuizResult.fulfilled]: (state, action) => {
    return {
      ...state,
      // result: action.payload?.data?.data,
      result: { ...state.result, ...action.payload?.data?.data },
      resultChanged: true
    }
  },
  [updateQuizResult.rejected]: (state, action) => {
    console.log(action.payload ?? "")
    return {
      ...state,
      // result: null,
      error: action.payload?.response?.data
    }
  },

  [resetQuizRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [resetQuizRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      result: { ...state.result, ...action.payload?.data?.data , total_price: action.payload?.data?.data?.meal_price + action.payload?.data?.data?.snack_price},
      // result: action.payload?.data?.data,
      resultChanged: false
    }
  },
  [resetQuizRequest.rejected]: (state, action) => {
    return {
      ...state,
      result: null,
      error: action.payload?.response?.data
    }
  },

  [saveQuizFields.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [saveQuizFields.fulfilled]: (state, action) => {
    return {
      ...state,
      formFields: action.payload,
      savedFields: action.payload
    }
  },
  [saveQuizFields.rejected]: (state) => {
    return {
      ...state,
      formFields: null
    }
  },

  [saveCurrentQuizType.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [saveCurrentQuizType.fulfilled]: (state, action) => {
    return {
      ...state,
      currentQuizType: action.payload
    }
  },
  [saveCurrentQuizType.rejected]: (state) => {
    return {
      ...state,
      currentQuizType: null
    }
  },

  [quizBMidRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.pending
    }
  },
  [quizBMidRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      loading: loadingStates.idle
      // currentQuizType: action.payload
    }
  },
  [quizBMidRequest.rejected]: (state) => {
    return {
      ...state,
      loading: loadingStates.idle
    }
  },

  [quizAMidRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      loading: loadingStates.pending
    }
  },
  [quizAMidRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      loading: loadingStates.idle
      // currentQuizType: action.payload
    }
  },
  [quizAMidRequest.rejected]: (state) => {
    return {
      ...state,
      loading: loadingStates.idle
    }
  },
  [logOutUserRequest.fulfilled]: () => {
    return {
      ...initialState
    }
  },
  [retakeModeHandler.fulfilled]: (state, action) => {
    return {
      ...state,
      retakeMode: action.payload
    }
  },
  [clearFieldsRequest.fulfilled]: (state) => {
    return {
      ...state,
      savedFields: null
    }
  }
})

export default QuizReducer
