import axios from "axios"

// const instance = axios.create({
//   baseURL: `${constants.BASE_URL}`,
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//     "Access-Control-Allow-Origin": "*",
//     "ngrok-skip-browser-warning":"69420"
//   }
// })

// instance.interceptors.request.use(
//   (request) => {
//     console.log("*** Request ***", request)
//     return request
//   },
//   (request) => {
//     console.log("*** Request ***", request)
//     return request
//   }
// )

// instance.interceptors.response.use(
//   (response) => {
//     console.log("*** Response ***", response)
//     return response
//   },
//   (response) => {
//     console.log("*** Response ***", response)
//     return response
//   }
// )

// export default instance
export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origin": "*",
    "ngrok-skip-browser-warning": "69420",
    // "Access-Control-Allow-Methods":"POST, GET"
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    "Access-Control-Allow-Headers":
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_PRIMARY_SUBSCRIPTION_KEY
  }
})
