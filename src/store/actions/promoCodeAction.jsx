import TYPES from "../types"

export function performAddPromoCode(payload) {
  return {
    type: TYPES.PROMO_CODE,
    payload
  }
}


