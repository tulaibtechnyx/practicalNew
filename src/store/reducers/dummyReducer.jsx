import TYPES from "store/types"

const initialState = { loader: false }

function dummyReducer(state = initialState, action) {
  switch (action.type) {
    case TYPES.GET_DUMMY_DATA:
      return { ...state, loader: true }

    case TYPES.GET_DUMMY_DATA_SUCCESS:
      return { ...state, loader: false }

    case TYPES.GET_DUMMY_DATA_FAILED:
      return { ...state, loader: false }

    default:
      return state
  }
}

export default dummyReducer
