// async function getPromoCodeDetailsAction(payload) {
//     console.log("get-promocode : "+ payload )
//     const response = await ApiResource.get("/discount/"+ payload)
//     return response
//     // return ApiResource.get("/discount/20")
//   }
  
//   export  default getPromoCodeDetailsAction




export function getPromoCodeDetailsAction(payload) {
  return {
    type: "PRMO_DETAIL",
    payload
  }
}


