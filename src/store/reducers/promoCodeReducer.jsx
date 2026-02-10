import TYPES from "../types"

const initialState = ""

//ANCHOR - PROMO CODE REDUCER
export default function promoCodeReducer(state = initialState, action) {
  switch (action.type) {
    case TYPES.PROMO_CODE:
      // return{
      //   // ...state,
      //   ...action.payload
      // }
      return action.payload ? action.payload.toString() : ""
      // return action.payload.data
    default:
      return state
  }
}
