import TYPES from "store/types"

const initialState = { pageLoader: false }

function pageLoaderReducer(state = initialState, action) {
  switch (action.type) {
    case TYPES.PAGE_SPINNER_TOGGLE:
      return { ...state, pageLoader: action.payload.pageLoader }

    default:
      return state
  }
}

export default pageLoaderReducer
