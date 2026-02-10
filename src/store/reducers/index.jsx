import { combineReducers } from "redux"
import { HYDRATE } from "next-redux-wrapper"
import quizReducer from "./quizPageReducer"
import AuthReducer from "./authReducer"
import DashboardReducer from "./dashboardReducer"
import OrdersReducer from "./ordersReducer"
import ProfileReducer from "./profileReducer"
import CheckOutReducer from "./checkoutReducer"
import promoCodeReducer from "./promoCodeReducer"
import promoCodeDetailReducer from "./promoCodeDetailReducer"
import resetReducer from "./resetReducer"
import betaReducer from "./betaReducer"
import awesomeFoodReducer from "./awesomeFoodReducer"
import homeReducer from "./homeReducer"
import userCodeReducer from "./userCodeReducer"
import validatedEmailReducer from "./validatedEmailReducer"
import executiveReducer from "./executiveReducer"
import cronReducer from "./cron-reducer"

const combinedReducer = combineReducers({
  quiz: quizReducer,
  auth: AuthReducer,
  home: DashboardReducer,
  profile: ProfileReducer,
  orders: OrdersReducer,
  CheckOutReducer: CheckOutReducer,
  promoCode: promoCodeReducer,
  promoCodeDetail: promoCodeDetailReducer,
  validatedEmail: validatedEmailReducer,
  resetPayload: resetReducer,
  isBeta: betaReducer,
  awesomeFoods: awesomeFoodReducer,
  homepage: homeReducer,
  userCode: userCodeReducer,
  executive: executiveReducer,
  cronDetails: cronReducer
})

export const rootReducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload,
    }
    return nextState
  } else {
    return combinedReducer(state, action)
  }
}
