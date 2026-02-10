import TYPES from "../types"

export function performAddBeta(payload) {
  return {
    type: TYPES.BETA,
    payload
  }
}
