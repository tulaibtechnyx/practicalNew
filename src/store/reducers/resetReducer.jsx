import TYPES from "../types"

const initialState = {}

//ANCHOR - RESET CODE REDUCER
export default function resetReducer(state = initialState, action) {
  switch (action.type) {
    case TYPES.RESET_PAYLOAD:
      return action.payload
    default:
      return state
  }
}
