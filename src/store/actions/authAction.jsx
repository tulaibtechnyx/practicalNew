import ApiResource from "../../services/api/api"
import ApiConstants from "../../config/constants.config"

const requestHeaders = (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  return config
}

async function GetCompany(payload, thunkAPI) {
  const { userData } = payload
  try {
    const response = await ApiResource.get(ApiConstants.getCompany, userData)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}
async function RegisterRequest(payload, thunkAPI) {
  const { userData } = payload
  try {
    const response = await ApiResource.post(ApiConstants.signUp, userData)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

function LoginUserRequest(payload, thunkAPI) {
  try {
    const { userData } = payload
    const response = ApiResource.post(ApiConstants.login, userData)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

function apiForgotPasswordRequest(payload, thunkAPI) {
  try {
    const { forgotPassBody, isExecutive } = payload
    const response = ApiResource.post(
      `${ApiConstants.forgotPassword}?is_executive=${isExecutive?1:0}`,
      forgotPassBody
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

function apiChangePasswordRequest(payload, thunkAPI) {
  try {
    
    const { changePassBody } = payload
    
    const response = ApiResource.post(
      ApiConstants.changePassword,
      changePassBody
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

function apiChangePassRequest(payload, thunkAPI) {
   try {

     const { changePassBody,token } = payload

     const response = ApiResource.post(
       ApiConstants.changePass,
       changePassBody,
          requestHeaders(token)
     )
     return response
   } catch (error) {
     return thunkAPI.rejectWithValue(error)
   }
}

function logoutRequest(payload, thunkAPI) {
  try {
    const { token } = payload
    if(token){
      const response = ApiResource.post(
        ApiConstants.logout,
        null,
        requestHeaders(token)
      )
      return response
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}


export const AuthApiServices = {
  RegisterRequest,
  LoginUserRequest,
  apiForgotPasswordRequest,
  apiChangePasswordRequest,
  apiChangePassRequest,
  logoutRequest,GetCompany
}
