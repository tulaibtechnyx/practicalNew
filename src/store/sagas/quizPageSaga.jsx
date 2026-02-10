import TYPES from "store/types"
import { takeLatest, put } from "redux-saga/effects"

import {
  get_quiz_questions,
  get_common_quiz_questions,
  post_quiz_request
} from "../../services/api/endpoints"
import { apiResponseHandler } from "../../helpers/ShortMethods"

function* get_quiz_questions_request(action) {
  const { payload } = action
  const { isSuccess, data } = yield apiResponseHandler(
    get_quiz_questions,
    payload
  )

  if (isSuccess) {
    yield put({ type: TYPES.GET_QUIZ_QUESTIONS_SUCCESS, data })
  } else {
    yield put({ type: TYPES.GET_QUIZ_QUESTIONS_FAILURE, data })
  }
}

function* get_common_quiz_questions_request(action) {
  const { payload } = action
  const { isSuccess, data } = yield apiResponseHandler(
    get_common_quiz_questions,
    payload
  )

  if (isSuccess) {
    yield put({ type: TYPES.GET_COMMON_QUESTION_REQUEST_SUCCESS, data })
  } else {
    yield put({ type: TYPES.GET_COMMON_QUESTION_REQUEST_FAILURE, data })
  }
}

function* post_quiz_questions_request(action) {
  const { payload } = action
  const { isSuccess, data } = yield apiResponseHandler(
    post_quiz_request,
    payload
  )

  if (isSuccess) {
    yield put({ type: TYPES.POST_QUIZ_REQUEST_SUCCESS, data })

    window.location.replace("/result")
  } else {
    yield put({ type: TYPES.POST_QUIZ_REQUEST_FAILURE, data })
  }
}

const quizPageSagas = [
  takeLatest(TYPES.GET_QUIZ_QUESTIONS, get_quiz_questions_request),
  takeLatest(
    TYPES.GET_COMMON_QUESTION_REQUEST,
    get_common_quiz_questions_request
  ),
  takeLatest(TYPES.POST_QUIZ_REQUEST, post_quiz_questions_request)
]
export default quizPageSagas
