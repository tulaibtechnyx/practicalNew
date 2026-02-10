import TYPES from "store/types"

export function performGetDummyData(payload) {
  return {
    type: TYPES.GET_DUMMY_DATA,
    payload: payload
  }
}
