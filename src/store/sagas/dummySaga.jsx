import { takeLatest, put } from "redux-saga/effects"
import TYPES from "store/types"
import { call_dummy_data } from "../../services/api/endpoints"
import { apiResponseHandler } from "../../helpers/ShortMethods"

function* get_dummy_data(action) {
  const { payload } = action
  const { isSuccess } = yield apiResponseHandler(call_dummy_data, payload)

  if (isSuccess) {
    yield put({ type: TYPES.GET_DUMMY_DATA_SUCCESS, payload })
  } else {
    yield put({ type: TYPES.GET_DUMMY_DATA_FAILED, payload })
  }
}

export const dummySaga = [takeLatest(`${TYPES.GET_DUMMY_DATA}`, get_dummy_data)]
