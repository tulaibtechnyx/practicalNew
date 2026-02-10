

const initialState = {}

// - PROMO CODE detail REDUCER
export default function promoCodeReducer(state = initialState, action) {

  switch (action.type) {
    case "PRMO_DETAIL":
      return action.payload
    default:
      return state
  }
}
