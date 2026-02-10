import ApiResource from "../../services/api/api"
import ApiConstants from "../../config/constants.config"

async function snackAdd(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.post(
      ApiConstants.snackAdd ,
      payload,
      config
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}
async function snackPricing(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.post(
      ApiConstants.snackPricing ,
      payload,
      config
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}
async function cheatMealAddon(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.get(
      ApiConstants.cheatMealAddon +
        `?addon_id=${payload.addon_id}`,
      config
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}
async function setcheatMeal(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.get(
      ApiConstants.cheatMeal +
        `?meal_order_id=${payload.meal_order_id}&meal_id=${payload.meal_id}&order_id=${payload.orderId}`,
      config
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}
async function getOrdersByCategoryId(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.get(
      ApiConstants.mealsByCategoryIdV2 +
        `?category_id=${payload.categoryId}&is_mb=${payload.mbStatus}&order_id=${payload.orderId}`,
      config
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}
async function getOrdersByCategoryIdV1(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.get(
      ApiConstants.mealsByCategoryId +
        `?category_id=${payload.categoryId}&is_mb=${payload.mbStatus}&order_id=${payload.orderId}`,
      config
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function swapOrderRequest(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.get(
      ApiConstants.swapItem +
        `?order_id=${payload.orderId}&meal_id=${payload.mealId}`,
      config
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function swapMyBYORequest(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.post(
      ApiConstants.swapMyBuildYourOwn,
      payload.swapMyBYOBody,
      config
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function deleteMyBYORequest(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.delete(
      ApiConstants.swapMyBuildYourOwn + `?byo_id=${payload.byo_id}`,
      config
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function editMyBYORequest(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.patch(
      ApiConstants.swapMyBuildYourOwn +
        `?byo_id=${payload.byo_id}&name=${payload.name}`,
      null,
      config
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function getBuildYourOwnData(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.get(
      ApiConstants.buildYourOwn + `?calories=${payload.calories}`,
      config
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function getMyBuildYourOwnData(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.get(
      ApiConstants.getMyBuildYourOwn + `?calories=${payload.calories}`,
      config
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function buildYourOwnDataRequest(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.post(
      ApiConstants.buildYourOwnSwap,
      payload.SwipeData,
      config
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function pausePassRequest(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.post(
      ApiConstants.mealPause,
      payload.pauseData,
      config
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function revertPausePassRequest(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.post(
      ApiConstants.mealPauseReverse,
      payload.pauseData,
      config
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function getSwapItemCategories(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.get(
      ApiConstants.swapCategories + `?order_id=${payload.order_id}`,
      config
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function onFavouriteClickAction(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.post(
      ApiConstants.favouriteMeal,
      payload.meal,
      config
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

export const OrdersApiServices = {
  getOrdersByCategoryId,
  swapOrderRequest,
  getBuildYourOwnData,
  buildYourOwnDataRequest,
  pausePassRequest,
  revertPausePassRequest,
  getMyBuildYourOwnData,
  swapMyBYORequest,
  deleteMyBYORequest,
  editMyBYORequest,
  getSwapItemCategories,
  onFavouriteClickAction,
  setcheatMeal,
  snackPricing,
  snackAdd,
  cheatMealAddon
}
