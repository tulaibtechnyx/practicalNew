import ApiResource from "../../services/api/api"

// import TYPES from "store/types"
import ApiConstants from "../../config/constants.config"

async function PromoAvailed(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }

    const response = await ApiResource.post(
      ApiConstants.discountAvailed,
      payload.data,
      config
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}
async function ProfileDataRequest(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.get(ApiConstants.userProfile, config)

    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function PostProfileRequest(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }

    const response = await ApiResource.post(
      ApiConstants.userProfile,
      payload.formData,
      config
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function updatePreferenceRequest(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.post(
      ApiConstants.userProfile,
      payload.preferenceData,
      config
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function updatePreferenceSliderRequest(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.post(
      ApiConstants.updateUserProfile,
      payload.preferenceData,
      config
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function getPriceConfirmation(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.post(
      ApiConstants.priceConfirmation,
      payload.preferenceData,
      config
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function resetPreferencesRequest(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.post(
      ApiConstants.resetPreference,
      null,
      config
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function cancelSubscriptionRequest(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.post(
      ApiConstants.cancelSubscription,
      null,
      config
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function getAddressWithDays(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.get(
      ApiConstants.assignDeliveryDaysToAddresses,
      config
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function updateAddressWithDays(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.post(
      ApiConstants.assignDeliveryDaysToAddresses,
      payload?.scheduleDeliveryBody,
      config
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function updateCompanyAddressWithDays(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.post(
      ApiConstants.assignDeliveryDaysToCompanyAddresses,
      payload?.scheduleDeliveryBody,
      config
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function verifyOrderDiscount(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const order_id = payload?.order_id;
    let response;
    if(order_id){
      response = await ApiResource.get(
        `${ApiConstants.verifyOrderDiscount}?order_id=${order_id}`,
        config
      )
    }else{
      response = await ApiResource.get(
        ApiConstants.verifyOrderDiscount,
        config
      )
    }
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}


export const ProfileApiServices = {
  PromoAvailed,
  ProfileDataRequest,
  PostProfileRequest,
  updatePreferenceRequest,
  updatePreferenceSliderRequest,
  resetPreferencesRequest,
  cancelSubscriptionRequest,
  getPriceConfirmation,
  getAddressWithDays,
  updateAddressWithDays,
  verifyOrderDiscount,
  updateCompanyAddressWithDays
}
