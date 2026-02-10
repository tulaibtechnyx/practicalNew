import api from "./api"
// import { getLoggedInHeader } from "../../helpers/ShortMethods"
import ApiConstants from "config/constants.config"

// Dummy Api Call
export const call_dummy_data = () => {
  return api.get(`https://reqres.in/api/products/3`)
}

export const get_quiz_questions = ({ quizType }) => {
  return api.get(ApiConstants.quizQuestions + quizType)
}

export const get_common_quiz_questions = () => {
  return api.get(ApiConstants.quizQuestions + "quiz_common")
}

export const post_quiz_request = ({ quizData }) => {
  return api.post(ApiConstants.quizQuestions, quizData)
}

export const register_request = ({ data }) => {
  return api.post(ApiConstants.signUp, data)
}
// export const call_homepage_data = (payload) => {
//   const { culture, format, coupleddata } = payload
//   return api.get(
//     `content/currentsite/${culture}/all/HomePage?format=${format}&coupleddata=${coupleddata}`,
//     { headers: getLoggedInHeader("YXBpX3VzZXI6Y2xpY2sxMjM=") }
//   )
// }
