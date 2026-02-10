import TYPES from "../types"

const initialState = false

//ANCHOR - BETA CODE REDUCER
export default function betaCodeReducer(state = initialState, action) {
  switch (action.type) {
    case TYPES.BETA:
      return action.payload
    default:
      return state
  }
}
