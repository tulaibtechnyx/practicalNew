import { takeLatest, put } from "redux-saga/effects"
import TYPES from "store/types"
import { register_request } from "../../services/api/endpoints"
import { apiResponseHandler } from "../../helpers/ShortMethods"

function* post_register_request(action) {
  const { payload } = action
  const { isSuccess } = yield apiResponseHandler(register_request, payload)

  if (isSuccess) {
    yield put({ type: TYPES.REGISTER_USER_SUCCESS, payload })
  } else {
    yield put({ type: TYPES.REGISTER_USER_FAILURE, payload })
  }
}

const authSaga = [takeLatest(`${TYPES.REGISTER_USER}`, post_register_request)]

export default authSaga
