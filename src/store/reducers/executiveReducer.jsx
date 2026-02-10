import { createAsyncThunk, createReducer } from "@reduxjs/toolkit"
import { ExecutiveApiServices } from "../actions/executiveAction"


let initialState = {
  error: null,
  loading: false,
  allergies: [],
}



//executive form data

export const ExecutiveRequest = createAsyncThunk(
  "ExecutiveReducer/ExecutiveRequest",
  async (payload, thunkAPI) => {
    const response = await ExecutiveApiServices.executiveFormRequest(payload, thunkAPI)
    return response
  }
)
//executive form data
export const AllergiesRequest = createAsyncThunk(
    "ExecutiveReducer/AllergiesRequest",
    async (payload, thunkAPI) => {
      const response = await ExecutiveApiServices.allergiesRequest(payload, thunkAPI)
      return response
    }
  )


const ExecutiveReducer = createReducer(initialState, {
    [AllergiesRequest.pending]: (state) => {
        return {
          ...state,
          error: null
        }
      },
      [AllergiesRequest.fulfilled]: (state, action) => {
        return {
          ...state,
          error: null,
          allergies: action.payload.data?.data.allergies
        }
      },
      [AllergiesRequest.rejected]: (state) => {
        return {
          ...state,
          error: null,
          allergies:[]
        }
      },
  
})

export default ExecutiveReducer
