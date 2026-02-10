import ApiResource from "../../services/api/api"
import ApiConstants from "../../config/constants.config"

async function getFoodsByCategory(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.get(
      ApiConstants.awesomeFoods + `?is_veg=${payload.isVeg}`,
      config
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

export const AwesomeFoodApiServices = {
  getFoodsByCategory
}
