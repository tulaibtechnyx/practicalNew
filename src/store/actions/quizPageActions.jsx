import ApiResource from "../../services/api/api"
import ApiConstants from "../../config/constants.config"

function getQuizQuestions(payload) {
  return ApiResource.get(ApiConstants.quizQuestions + "/" + payload.quizType + "?is_executive=" + payload.Executive)
}




async function getPreferenceQuestions(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.get(ApiConstants.quizPreference + "?is_executive=" + payload.Executive, config)
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function getCommonQuizQuestions(payload, thunkAPI) {
  try {
    const response = await ApiResource.get(
      ApiConstants.quizCommon + "?is_executive=" + payload.Executive +
      `&average_meals_day=${payload?.quizData["average_meals_day"]}&average_snacks_day=${payload?.quizData["average_snacks_day"]}`
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function postQuizQuestions(payload, thunkAPI) {
  console.log("quiz payload", {payload})
  try {
    const response = await ApiResource.post(
      ApiConstants.quizQuestions,
      payload.quizData
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}

async function updateQuizResult(payload, thunkAPI) {
  const { resultData, meal, index } = payload
  const data = { ...resultData, meal, index }
  console.log("updated-quiz", data)
  try {
    const response = await ApiResource.post(ApiConstants.updateQuiz, data)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function quizBMidRequest(payload, thunkAPI) {
  console.log("delivery-quiz")
  try {
    const response = await ApiResource.get(
      ApiConstants.quizBMid +
      `?meals_deliver_per_day=${payload.quizData["meals_deliver_per_day"]}&snacks_deliver_per_day=${payload.quizData["snacks_deliver_per_day"]}`
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function quizAMidRequest(payload, thunkAPI) {
  try {
    const response = await ApiResource.get(
      ApiConstants.quizAMid +
      `?average_meals_day=${payload.quizData["average_meals_day"]}&average_snacks_day=${payload.quizData["average_snacks_day"]}`
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function quizResetRequest(payload, thunkAPI) {
  try {
    const response = await ApiResource.get(
      ApiConstants.resetQuiz + `?uuid=${payload.uuid}`
    )
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
}

async function retakeQuizRequest(payload, thunkAPI) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
    const response = await ApiResource.post(
      ApiConstants.retakeQuiz,
      payload.quizData,
      config
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
}



export const QuizApiServices = {
  getQuizQuestions,
  getCommonQuizQuestions,
  postQuizQuestions,
  updateQuizResult,
  quizBMidRequest,
  quizAMidRequest,
  retakeQuizRequest,
  quizResetRequest,
  getPreferenceQuestions,
  
}
