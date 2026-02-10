import TYPES from "store/types"

export function performPageLoaderToggle(payload) {
  return {
    type: TYPES.PAGE_SPINNER_TOGGLE,
    payload
  }
}
