/* eslint-disable no-undef */
import { createReducer } from "@reduxjs/toolkit"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { DashboardApiServices } from "../actions/dashboardAction"
import { logOutUserRequest } from "./authReducer"
import get from "lodash/get"
import { updateCRONDetails } from "./cron-reducer"
import AppConstants from "@helpers/AppConstants"

let initialState = {
  startUpData: null,
  orders: [],
  ordersLoader: false,
  faqQuestions: [],
  resturants: [],
  ticker: null,
  orderHistory: [],
  freeFoodData: null,
  cards: null,
  renewalData: null,
  addresss: [],
  cookBook: [],
  pausePassDates: [],
  UAEAddresses: [],
  walletDetails: null,
  companyEmirates: [],
  timerData: null,
  copyMealsData: null,
  mealSnackPricing: null,
  GetcalendlybookingData: null,
  GetcalendlybookingLoader: false,
  closeForceOpenedPop: '',
  tooglePSQpop: false,
  swapItemLoading: false,
  showCoupenPopupStateFromApp: '',
  globalLoading: false,
  activeTabvalue: AppConstants.TabValues.UPCOMING_ORDERS,
  AddprotienLoader:false,
  planExpiredUpcoming:false,
  activeTabvalue: AppConstants.TabValues.UPCOMING_ORDERS,
  loaderForunsaved: false,
  triggerFortabChange: false,
  paidSliderEPTriggered: false,
  saveTabChangesButtonHit:false,
  switchTabTo:'',
}
export const setswitchTabTo = createAsyncThunk(
  "DashboardReducer/setswitchTabTo",
  async (payload, thunkApi) => {
    return payload
  }
)
export const setsaveTabChangesButtonHit = createAsyncThunk(
  "DashboardReducer/setsaveTabChangesButtonHit",
  async (payload, thunkApi) => {
    return payload
  }
)
export const setpaidSliderEPTriggered = createAsyncThunk(
  "DashboardReducer/setpaidSliderEPTriggered",
  async (payload, thunkApi) => {
    return payload
  }
)
export const settriggerFortabChange = createAsyncThunk(
  "DashboardReducer/settriggerFortabChange",
  async (payload, thunkApi) => {
    return payload
  }
)
export const setloaderForunsaved = createAsyncThunk(
  "DashboardReducer/setloaderForunsaved",
  async (payload, thunkApi) => {
    return payload
  }
)
export const setactiveTabvalue = createAsyncThunk(
  "DashboardReducer/setactiveTabvalue",
  async (payload, thunkApi) => {
    return payload
  }
)
export const setSwapItemLoading = createAsyncThunk(
  "DashboardReducer/setSwapItemLoading",
  async (payload) => {
    return payload;
  }
)
export const setshowCoupenPopupStateFromApp = createAsyncThunk(
  "DashboardReducer/setshowCoupenPopupStateFromApp",
  async (payload, thunkApi) => {
    return payload
  }
)
export const settooglePSQpop = createAsyncThunk(
  "DashboardReducer/settooglePSQpop",
  async (payload, thunkApi) => {
    return payload
  }
)
export const setCloseForceOpenedPop = createAsyncThunk(
  "DashboardReducer/setCloseForceOpenedPop",
  async (payload, thunkApi) => {
    return payload
  }
)
export const Addcalendlybooking = createAsyncThunk(
  "DashboardReducer/Addcalendlybooking",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.Addcalendlybooking(
      payload,
      thunkApi
    )
    return response
  }
)
export const Getcalendlybooking = createAsyncThunk(
  "DashboardReducer/Getcalendlybooking",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.Getcalendlybooking(
      payload,
      thunkApi
    )
    return response
  }
)
export const removeAddonOtherItem = createAsyncThunk(
  "DashboardReducer/removeAddonOtherItem",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.removeAddonOtherItem(
      payload,
      thunkApi
    )
    return response
  }
)
export const removeAddonMealnSnack = createAsyncThunk(
  "DashboardReducer/removeAddonMealnSnack",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.removeAddonMealnSnack(
      payload,
      thunkApi
    )
    return response
  }
)
export const mealSnackPricing = createAsyncThunk(
  "DashboardReducer/mealSnackPricing",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.mealSnackPricing(
      payload,
      thunkApi
    )
    return response
  }
)
export const addOtherMeal = createAsyncThunk(
  "DashboardReducer/addOtherMeal",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.addOtherMeal(
      payload,
      thunkApi
    )
    return response
  }
)
export const addOtherSnacks = createAsyncThunk(
  "DashboardReducer/addOtherSnacks",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.addOtherSnacks(
      payload,
      thunkApi
    )
    return response
  }
)
export const addOtherItems = createAsyncThunk(
  "DashboardReducer/addOtherItems",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.addOtherItems(
      payload,
      thunkApi
    )
    return response
  }
)
export const SearchsearchAddons = createAsyncThunk(
  "DashboardReducer/SearchsearchAddons",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.searchAddons(
      payload,
      thunkApi
    )
    return response
  }
)
export const RevertMeals = createAsyncThunk(
  "DashboardReducer/RevertMeals",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.RevertMeals(
      payload,
      thunkApi
    )
    return response
  }
)
export const CopyMeals = createAsyncThunk(
  "DashboardReducer/CopyMeals",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.CopyMeals(
      payload,
      thunkApi
    )
    return response
  }
)
export const TimerRequest = createAsyncThunk(
  "DashboardReducer/TimerRequest",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.TimerRequest(
      payload,
      thunkApi
    )
    return response
  }
)
export const StartUpRequest = createAsyncThunk(
  "DashboardReducer/StartUpRequest",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.StartupRequest(
      payload,
      thunkApi
    )
    return response
  }
)

export const UpcomingOrdersRequest = createAsyncThunk(
  "DashboardReducer/UpcomingOrdersRequest",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.upcomingOrdersRequest(
      payload,
      thunkApi
    )
    const state = thunkApi.getState();
    const activeTabvalue = state.home.activeTabvalue;

    if(payload?.changeTab){
      thunkApi.dispatch(setswitchTabTo(activeTabvalue))
      thunkApi.dispatch(setsaveTabChangesButtonHit(false))
    }
    return response
  }
)

export const GetQuestionsRequest = createAsyncThunk(
  "DashboardReducer/GetQuestionsRequest",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.getQuestions(payload, thunkApi)
    return response
  }
)

export const GetResturantsRequest = createAsyncThunk(
  "DashboardReducer/GetResturantsRequest",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.getEatingRequest(
      payload,
      thunkApi
    )
    return response
  }
)

// export const GetTickersRequest = createAsyncThunk(
//   "DashboardReducer/GetTickersRequest",
//   async (payload, thunkApi) => {
//     const response = await DashboardApiServices.getTickersRequest(
//       payload,
//       thunkApi
//     )
//     const { dispatch } = thunkApi;
//     const planUpdated = get(response, 'data.plan_updated', false);
//     const orderId = get(response, 'data.order_id', null);
//     console.log("response",response)
//     console.log("response.data.payload",response?.data?.payload)
//     console.log("response.payload",response?.payload)
//     dispatch(updateCRONDetails({
//       planUpdated: planUpdated,
//       orderId: orderId,
//     }))
//     return response
//   }
// )
export const GetTickersRequest = createAsyncThunk(
  "DashboardReducer/GetTickersRequest",
  async (payload, thunkApi) => {
    try {
      const response = await DashboardApiServices.getTickersRequest(payload, thunkApi);

      const { dispatch } = thunkApi;
      const planUpdated = get(response, 'data.plan_updated', false);
      const orderId = get(response, 'data.order_id', null);

      dispatch(updateCRONDetails({
        planUpdated,
        orderId,
      }));

      return response;
    } catch (error) {
      // Now error is actually error.response
      const planUpdated = get(error, 'data.plan_updated', false);
      const orderId = get(error, 'data.order_id', null);

      thunkApi.dispatch(updateCRONDetails({
        planUpdated,
        orderId,
      }));

      return thunkApi.rejectWithValue(error.data);
    }
  }
);



export const GetFreeFoodRequest = createAsyncThunk(
  "DashboardReducer/GetFreeFoodRequest",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.getFreeFoodRequest(
      payload,
      thunkApi
    )
    return response
  }
)

export const GetOrderHistory = createAsyncThunk(
  "DashboardReducer/GetOrderHistory",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.getOrderHistroyRequest(
      payload,
      thunkApi
    )
    return response
  }
)

export const AddCardRequest = createAsyncThunk(
  "DashboardReducer/AddCardRequest",
  async (payload, thunkAPI) => {
    const response = await DashboardApiServices.addCardRequest(
      payload,
      thunkAPI
    )

    return response
  }
)
export const CheckEmailExist = createAsyncThunk(
  "DashboardReducer/CheckEmailExist",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.checkEmailExistRequest(
      payload,
      thunkApi
    )
    return response
  }
)
export const ContactUsRequest = createAsyncThunk(
  "DashboardReducer/ContactUsRequest",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.postContactRequest(
      payload,
      thunkApi
    )
    return response
  }
)

export const getAllCardsRequest = createAsyncThunk(
  "DashboardReducer/getAllCardsRequest",
  async (payload, thunkAPI) => {
    const response = await DashboardApiServices.getAllCardsRequest(
      payload,
      thunkAPI
    )
    return response
  }
)

export const getRenewalRequestData = createAsyncThunk(
  "DashboardReducer/getRenewalRequestData",
  async (payload, thunkAPI) => {
    const response = await DashboardApiServices.getRenewalPlanData(
      payload,
      thunkAPI
    )

    return response
  }
)

export const getRenewedPlanRequest = createAsyncThunk(
  "DashboardReducer/getRenewedPlanRequest",
  async (payload, thunkAPI) => {
    const response = await DashboardApiServices.getRenewedPlanOrdersRequest(
      payload,
      thunkAPI
    )

    return response
  }
)

export const setDefaultAddressRequest = createAsyncThunk(
  "DashboardReducer/setDefaultAddressRequest",
  async (payload, thunkAPI) => {
    const response = await DashboardApiServices.setDefaultAddressRequest(
      payload,
      thunkAPI
    )
    return response
  }
)

export const addToWalletRequest = createAsyncThunk(
  "DashboardReducer/addToWalletRequest",
  async (payload, thunkAPI) => {
    const response = await DashboardApiServices.addToWalletRequest(
      payload,
      thunkAPI
    )
    return response
  }
)

export const getAllAddressRequest = createAsyncThunk(
  "DashboardReducer/getAllAddressRequest",
  async (payload, thunkAPI) => {
    const response = await DashboardApiServices.getAllAddressRequest(
      payload,
      thunkAPI
    )
    return response
  }
)

export const getEmiratesAddressesRequest = createAsyncThunk(
  "DashboardReducer/getEmiratesAddressesRequest",
  async (payload, thunkAPI) => {
    const response = await DashboardApiServices.getEmiratesAddressesRequest(
      payload,
      thunkAPI
    )
    return response
  }
)

export const getCompanyEmiratesRequest = createAsyncThunk(
  "DashboardReducer/getCompanyEmiratesRequest",
  async (payload, thunkAPI) => {
    const response = await DashboardApiServices.getCompanyEmirates(
      payload,
      thunkAPI
    )
    return response
  }
)

export const postFeedBackRequest = createAsyncThunk(
  "DashboardReducer/postFeedBackRequest",
  async (payload, thunkAPI) => {
    const response = await DashboardApiServices.submitFeedbackRequest(
      payload,
      thunkAPI
    )
    return response
  }
)

export const getUserCookBookRequest = createAsyncThunk(
  "DashboardReducer/getUserCookBookRequest",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.getCookBookRequest(
      payload,
      thunkApi
    )

    return response
  }
)

export const getPausePassDatesRequest = createAsyncThunk(
  "DashboardReducer/getPausePassDatesRequest",
  async (payload, thunkAPI) => {
    const response = await DashboardApiServices.getPausePassDatesRequest(
      payload,
      thunkAPI
    )
    return response
  }
)

export const postProteinRequest = createAsyncThunk(
  "DashboardReducer/postProteinRequest",
  async (payload, thunkAPI) => {
    const response = await DashboardApiServices.postProteinRequest(
      payload,
      thunkAPI
    )

    return response
  }
)

export const deleteProteinRequest = createAsyncThunk(
  "DashboardReducer/deleteProteinRequest",
  async (payload, thunkAPI) => {
    const response = await DashboardApiServices.deleteProteinRequest(
      payload,
      thunkAPI
    )

    return response
  }
)


export const getWalletDetailsRequest = createAsyncThunk(
  "DashboardReducer/getWalletDetailsRequest",
  async (payload, thunkAPI) => {
    const response = await DashboardApiServices.getWalletDetails(
      payload,
      thunkAPI
    )
    return response
  }
)

export const updatePriceRequest = createAsyncThunk(
  "DashboardReducer/updatePriceRequest",
  async (payload, thunkAPI) => {
    const response = await DashboardApiServices.updatePriceRequest(
      payload,
      thunkAPI
    )
    return response
  }
)
export const updateDefCard = createAsyncThunk(
  "DashboardReducer/updateDefCard",
  async (payload) => {
    return payload
  }
)
export const setGlobalLoading = createAsyncThunk(
  "DashboardReducer/setGlobalLoading",
    async (payload) => {
    return payload;
  }
)
export const setPlanExpiredUpcoming = createAsyncThunk(
  "DashboardReducer/setPlanExpiredUpcoming",
  async (payload) => {
    return payload;
  }
)
export const CancelSubscriptionHook = createAsyncThunk(
  "DashboardReducer/cancelSubscriptionHook",
  async (payload, thunkApi) => {
    const response = await DashboardApiServices.cancelSubscriptionHook(
      payload,
      thunkApi
    )
    return response
  }
)
const DashboardReducer = createReducer(initialState, {
  [setswitchTabTo.fulfilled]: (state,action) => {
    return {
      ...state,
      switchTabTo: action.payload
    }
  },
  [setsaveTabChangesButtonHit.fulfilled]: (state,action) => {
    return {
      ...state,
      saveTabChangesButtonHit: action.payload
    }
  },
  [setpaidSliderEPTriggered.fulfilled]: (state,action) => {
    return {
      ...state,
      paidSliderEPTriggered: action.payload
    }
  },
  [settriggerFortabChange.fulfilled]: (state,action) => {
    return {
      ...state,
      triggerFortabChange: action.payload
    }
  },
  [setloaderForunsaved.fulfilled]: (state,action) => {
    return {
      ...state,
      loaderForunsaved: action.payload
    }
  },
  [setactiveTabvalue.fulfilled]: (state,action) => {
    return {
      ...state,
      activeTabvalue: action.payload
    }
  },
  [setshowCoupenPopupStateFromApp.fulfilled]: (state,action) => {
    return {
      ...state,
      showCoupenPopupStateFromApp: action.payload
    }
  },
  [setSwapItemLoading.fulfilled]: (state, action) => {
    state.swapItemLoading = action.payload
  },
  [settooglePSQpop.fulfilled]: (state,action) => {
    return {
      ...state,
      tooglePSQpop: action.payload
    }
  },
  [Getcalendlybooking.pending]: (state) => {
    return {
      ...state,
      error: null,
      GetcalendlybookingLoader: true
    }
  },
  [Getcalendlybooking.fulfilled]: (state, action) => {
    return {
      ...state,
      GetcalendlybookingData: action?.payload?.data?.data,
      error: null,
      GetcalendlybookingLoader: false
    }
  },
  [Getcalendlybooking.rejected]: (state) => {
    return {
      ...state,
      error: null,
      GetcalendlybookingLoader: false
    }
  },
  [mealSnackPricing.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [mealSnackPricing.fulfilled]: (state, action) => {
    return {
      ...state,
      mealSnackPricing:action?.payload?.data?.data,
      error: null,
    }
  },
  [mealSnackPricing.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [addOtherSnacks.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [addOtherSnacks.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
    }
  },
  [addOtherSnacks.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [addOtherMeal.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [addOtherMeal.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
    }
  },
  [addOtherMeal.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [addOtherItems.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [addOtherItems.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
    }
  },
  [addOtherItems.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [SearchsearchAddons.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [SearchsearchAddons.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
    }
  },
  [SearchsearchAddons.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [updateDefCard.fulfilled]: (state, action) => {
    return {
      ...state,
      cards: [{card: [...state.cards.card], defaultCard: action.payload}],
    }
  },
  [CopyMeals.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [CopyMeals.fulfilled]: (state, action) => {
    return {
      ...state,
      copyMealsData: action.payload.data,
      error: null,
    }
  },
  [CopyMeals.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [TimerRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [TimerRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      timerData: action.payload.data,
      error: null,
    }
  },
  [TimerRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [StartUpRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [StartUpRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      startUpData: action.payload.data?.data
    }
  },
  [StartUpRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [GetOrderHistory.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [GetOrderHistory.fulfilled]: (state, action) => {
    const payload = action?.payload?.data;
    let history = [];

    const mainData = payload?.data;

    if (Array.isArray(mainData)) {
      history = mainData;
    } else if (Array.isArray(mainData?.data)) {
      history = mainData.data;
    }
    return {
      ...state,
      error: null,
      orderHistory: history
    }
  },
  [GetOrderHistory.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [postProteinRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      AddprotienLoader:true
    }
  },
  [postProteinRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      AddprotienLoader:false
    }
  },
  [postProteinRequest.rejected]: (state) => {
    return {
      ...state,
      error: null,
      AddprotienLoader:false
    }
  },

  [deleteProteinRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [deleteProteinRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null
    }
  },
  [deleteProteinRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [addToWalletRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [addToWalletRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null
    }
  },
  [addToWalletRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [getPausePassDatesRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [getPausePassDatesRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      pausePassDates: action.payload.data?.data
    }
  },
  [getPausePassDatesRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [getUserCookBookRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [getUserCookBookRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      cookBook: action.payload.data?.data
    }
  },
  [getUserCookBookRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [postFeedBackRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [postFeedBackRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null
      // addresss: action.payload.data?.data
    }
  },
  [postFeedBackRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [getAllAddressRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [getAllAddressRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      addresss: action.payload.data?.data
    }
  },
  [getAllAddressRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [getEmiratesAddressesRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [getEmiratesAddressesRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      UAEAddresses: action.payload.data?.data
    }
  },
  [getEmiratesAddressesRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [getCompanyEmiratesRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [getCompanyEmiratesRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      companyEmirates: action.payload.data?.data
    }
  },
  [getCompanyEmiratesRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [setDefaultAddressRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [setDefaultAddressRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null
      // addresss: action.payload.data?.data
    }
  },
  [setDefaultAddressRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [getAllCardsRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [getAllCardsRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      cards: action.payload.data?.data
    }
  },
  [getAllCardsRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [CheckEmailExist.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [CheckEmailExist.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null
    }
  },
  [CheckEmailExist.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [ContactUsRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [ContactUsRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null
    }
  },
  [ContactUsRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [GetFreeFoodRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [GetFreeFoodRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      freeFoodData: action.payload.data?.data
    }
  },
  [GetFreeFoodRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [UpcomingOrdersRequest.pending]: (state) => {
    return {
      ...state,
      error: null,
      ordersLoader: true
    }
  },
  [UpcomingOrdersRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      ordersLoader: false,
      error: null,
      orders: action.payload.data?.data,
    }
  },
  [UpcomingOrdersRequest.rejected]: (state) => {
    return {
      ...state,
      ordersLoader: false,
      error: null,
    }
  },

  [getRenewalRequestData.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [getRenewalRequestData.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      renewalData: action.payload.data?.data
    }
  },
  [getRenewalRequestData.rejected]: (state) => {
    return {
      ...state,
      error: null,
      renewalData: null
    }
  },
  [getRenewedPlanRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [getRenewedPlanRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      renewedPlanOrders: action.payload.data?.data
    }
  },
  [getRenewedPlanRequest.rejected]: (state) => {
    return {
      ...state,
      renewedPlanOrders: null,
      error: null
    }
  },

  [GetTickersRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [GetTickersRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      ticker: action.payload.data?.data
    }
  },
  [GetTickersRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [GetQuestionsRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [GetQuestionsRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      faqQuestions: action.payload.data?.data
    }
  },
  [GetQuestionsRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [GetResturantsRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [GetResturantsRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      resturants: action.payload.data?.data
    }
  },
  [GetResturantsRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [getWalletDetailsRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [getWalletDetailsRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
      walletDetails: action.payload.data?.data
    }
  },
  [getWalletDetailsRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [updatePriceRequest.pending]: (state) => {
    return {
      ...state,
      error: null
    }
  },
  [updatePriceRequest.fulfilled]: (state, action) => {
    return {
      ...state,
      error: null,
    }
  },
  [updatePriceRequest.rejected]: (state) => {
    return {
      ...state,
      error: null
    }
  },

  [logOutUserRequest.fulfilled]: () => {
    return {
      ...initialState
    }
  },
  [setGlobalLoading.fulfilled]: (state, action) => {
    state.globalLoading = action.payload
  },
  [setPlanExpiredUpcoming.fulfilled]: (state, action) => {
    state.planExpiredUpcoming = action.payload
  },
})

export default DashboardReducer
