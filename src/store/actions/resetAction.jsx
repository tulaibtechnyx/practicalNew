import TYPES from "../types"

export function performAddResetPayload(payload) {
  return {
    type: TYPES.RESET_PAYLOAD,
    payload
  }
}
