import TYPES from "store/types"
import ApiResource from "../../services/api/api"
import ApiConstants from "../../config/constants.config"
import get from "lodash/get"

const getHeaders = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

export function performGetHomePageData(payload) {
  return {
    type: TYPES.GET_HOME_PAGE_DATA,
    payload
  }
}

export function performGetHomePageAttachmentData(payload) {
  return {
    type: TYPES.GET_HOME_PAGE_ATTACHMENT_DATA,
    payload
  }
}

export function performGetHomePageAttachmentDataUpdate(payload) {
  return {
    type: TYPES.GET_HOME_PAGE_DATA_ATTACHMENT_UPDATE,
    payload
  }
}

export function performGetHomePageInitialValue(payload) {
  return {
    type: TYPES.GET_HOME_PAGE_DATA_INITIAL_STATE,
    payload
  }
}

async function promoBannerClicked(payload, thunkAPI) {
  try {
    const isExecutive = get(payload, 'isExecutive', false);
    // const response = await ApiResource.get(`${ApiConstants.promoBanner  }?is_executive=${isExecutive ? 1 : 0}`)
    const response = await ApiResource.post(`${ApiConstants.promoBannerClicked}`,payload)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}
async function getPromoBanner(payload, thunkAPI) {
  try {
    const isExecutive = get(payload, 'isExecutive', false);
    // const response = await ApiResource.get(`${ApiConstants.promoBanner  }?is_executive=${isExecutive ? 1 : 0}`)
    const response = await ApiResource.get(`${ApiConstants.promoBanner}`)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}
async function getHomepageData(payload, thunkAPI) {
  try {
    const isExecutive = get(payload, 'isExecutive', false);
    const response = await ApiResource.get(`${ApiConstants.homePage}?is_executive=${isExecutive ? 1 : 0}`)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}
async function postInactivity(payload, thunkAPI) {
  try {
    const inactivityData = new FormData()
    inactivityData.append("email", payload.email)
    inactivityData.append("phone", payload.phone)
    inactivityData.append("name", payload.name)
    inactivityData.append("is_executive", payload.is_executive)
    const response = await ApiResource.post(
      ApiConstants.inactivity,
      inactivityData,
      getHeaders(payload?.token)
    );
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}
async function postCarousel(payload, thunkAPI) {
  try {
    const carouselData = new FormData()
    carouselData.append("email", payload.email)
    carouselData.append("phone", payload.phone)
    carouselData.append("name", payload.name)
    carouselData.append("is_executive", payload.is_executive)
    carouselData.append("interest", payload.interest)

    const response = await ApiResource.post(
      ApiConstants.carousel,
      carouselData,
      getHeaders(payload?.token)
    );
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}
async function getMealPricingData(payload, thunkAPI) {
  try {
    const response = await ApiResource.get(`${ApiConstants.pricing}`)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}
async function getPricingData(payload, thunkAPI) {
  try {
    const response = await ApiResource.get(`${ApiConstants.pricingJson}`)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}
async function editPricingData(payload, thunkAPI) {
  try {
    const response = await ApiResource.get(`${ApiConstants.pricingJsonEdit}`)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}
async function updatePricingData(payload, thunkAPI) {
  try {
    const response = await ApiResource.post(`${ApiConstants.pricingJsonUpdate}`,payload,getHeaders(payload?.token))
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

export const HomepageApiServices = {
  promoBannerClicked,getPromoBanner,
  getHomepageData, getMealPricingData, postInactivity, postCarousel,
  getPricingData,
  editPricingData,
  updatePricingData,
}
