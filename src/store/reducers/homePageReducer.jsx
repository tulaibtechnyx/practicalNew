import TYPES from "store/types"
import { jsonParser } from "../../helpers/ShortMethods"

// import { homepage } from "../../data/homepage-mock"
let initialState = null

function homePageReducer(state = initialState, action) {
  switch (action.type) {
    case TYPES.GET_HOME_PAGE_DATA_SUCCESS: {
      return {
        ...state,
        // items: homepage
        items: action.payload.items
      }
    }

    case TYPES.GET_HOME_PAGE_ATTACHMENT_DATA_SUCCESS:
      return {
        ...state,
        attachment: action.payload.items
        // items: [...action.payload.items],
      }

    case TYPES.GET_HOME_PAGE_DATA_ATTACHMENT_UPDATE: {
      const dataObj = jsonParser(state)
      return { ...state, updateItem: dataObj }
    }

    case TYPES.GET_HOME_PAGE_DATA_INITIAL_STATE:
      return (initialState = null)

    default:
      return state
  }
}
export default homePageReducer
