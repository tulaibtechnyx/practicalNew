import TYPES from "../types"

const initialState = ""

//ANCHOR - VALIDATED EMAIL CODE REDUCER
export default function validatedEmailReducer(state = initialState, action) {
  switch (action.type) {
    case TYPES.ADD_VALIDATED_EMAIL:
      return action.payload.toString()
    default:
      return state
  }
}
