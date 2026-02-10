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

async function getGeneratedCode(payload, thunkAPI) {
  try {
    const response = await ApiResource.post(
      ApiConstants.createCode,
      null,
      requestHeaders(payload.token)
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

export const UserCodeApiServices = {
  getGeneratedCode
}
