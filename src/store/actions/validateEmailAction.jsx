import TYPES from "../types"

export function performAddValidatedEmail(payload) {
  return {
    type: TYPES.ADD_VALIDATED_EMAIL,
    payload
  }
}
